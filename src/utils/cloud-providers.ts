import { CloudSyncData } from '@/types/cloud-sync'

// File System Access API types
declare global {
  interface Window {
    showSaveFilePicker?: (options?: {
      suggestedName?: string
      types?: Array<{
        description: string
        accept: Record<string, string[]>
      }>
    }) => Promise<FileSystemFileHandle>
    
    showOpenFilePicker?: (options?: {
      types?: Array<{
        description: string
        accept: Record<string, string[]>
      }>
    }) => Promise<FileSystemFileHandle[]>
  }
  
  interface FileSystemFileHandle {
    createWritable(): Promise<FileSystemWritableFileStream>
    getFile(): Promise<File>
  }
  
  interface FileSystemWritableFileStream {
    write(data: string): Promise<void>
    close(): Promise<void>
  }
}

export interface CloudProvider {
  id: string
  name: string
  upload(data: CloudSyncData): Promise<void>
  download(): Promise<CloudSyncData | null>
  delete(): Promise<void>
  isAvailable(): boolean
}

/**
 * GitHub Gist Provider - Uses GitHub Gists as cloud storage
 */
export class GitHubGistProvider implements CloudProvider {
  id = 'github-gist'
  name = 'GitHub Gist'
  
  private token: string
  private gistId?: string
  
  constructor(token: string, gistId?: string) {
    this.token = token
    this.gistId = gistId
  }
  
  isAvailable(): boolean {
    return !!this.token && typeof fetch !== 'undefined'
  }
  
  async upload(data: CloudSyncData): Promise<void> {
    if (!this.isAvailable()) {
      throw new Error('GitHub Gist provider not available')
    }
    
    const gistData = {
      description: `QCode Discount Codes Sync - ${new Date().toISOString()}`,
      public: false,
      files: {
        'qcode-sync.json': {
          content: JSON.stringify(data, null, 2)
        }
      }
    }
    
    const url = this.gistId 
      ? `https://api.github.com/gists/${this.gistId}`
      : 'https://api.github.com/gists'
    
    const method = this.gistId ? 'PATCH' : 'POST'
    
    const response = await fetch(url, {
      method,
      headers: {
        'Authorization': `token ${this.token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(gistData)
    })
    
    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.status} ${response.statusText}`)
    }
    
    if (!this.gistId) {
      const result = await response.json()
      this.gistId = result.id
      // Store gist ID for future use
      if (this.gistId) {
        localStorage.setItem('qcode-gist-id', this.gistId)
      }
    }
  }
  
  async download(): Promise<CloudSyncData | null> {
    if (!this.isAvailable() || !this.gistId) {
      return null
    }
    
    const response = await fetch(`https://api.github.com/gists/${this.gistId}`, {
      headers: {
        'Authorization': `token ${this.token}`,
      }
    })
    
    if (!response.ok) {
      if (response.status === 404) {
        return null // Gist doesn't exist
      }
      throw new Error(`GitHub API error: ${response.status} ${response.statusText}`)
    }
    
    const gist = await response.json()
    const fileContent = gist.files['qcode-sync.json']?.content
    
    if (!fileContent) {
      return null
    }
    
    try {
      const data = JSON.parse(fileContent)
      // Ensure dates are properly parsed
      return {
        ...data,
        lastModified: new Date(data.lastModified),
        codes: data.codes.map((code: Record<string, unknown>) => ({
          ...code,
          dateAdded: new Date(code.dateAdded as string),
          expiryDate: code.expiryDate ? new Date(code.expiryDate as string) : undefined,
        }))
      }
    } catch (error) {
      console.error('Error parsing sync data:', error)
      return null
    }
  }
  
  async delete(): Promise<void> {
    if (!this.isAvailable() || !this.gistId) {
      return
    }
    
    const response = await fetch(`https://api.github.com/gists/${this.gistId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `token ${this.token}`,
      }
    })
    
    if (!response.ok && response.status !== 404) {
      throw new Error(`GitHub API error: ${response.status} ${response.statusText}`)
    }
    
    this.gistId = undefined
    localStorage.removeItem('qcode-gist-id')
  }
}

/**
 * LocalStorage-based provider for development/testing
 */
export class LocalCloudProvider implements CloudProvider {
  id = 'local-cloud'
  name = 'Local Storage (Dev)'
  
  private storageKey = 'qcode-cloud-sync'
  
  isAvailable(): boolean {
    return typeof localStorage !== 'undefined'
  }
  
  async upload(data: CloudSyncData): Promise<void> {
    if (!this.isAvailable()) {
      throw new Error('Local storage not available')
    }
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500))
    
    localStorage.setItem(this.storageKey, JSON.stringify(data))
  }
  
  async download(): Promise<CloudSyncData | null> {
    if (!this.isAvailable()) {
      return null
    }
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 300))
    
    const stored = localStorage.getItem(this.storageKey)
    if (!stored) {
      return null
    }
    
    try {
      const data = JSON.parse(stored)
      return {
        ...data,
        lastModified: new Date(data.lastModified),
        codes: data.codes.map((code: Record<string, unknown>) => ({
          ...code,
          dateAdded: new Date(code.dateAdded as string),
          expiryDate: code.expiryDate ? new Date(code.expiryDate as string) : undefined,
        }))
      }
    } catch (error) {
      console.error('Error parsing local cloud data:', error)
      return null
    }
  }
  
  async delete(): Promise<void> {
    if (!this.isAvailable()) {
      return
    }
    
    localStorage.removeItem(this.storageKey)
  }
}

/**
 * Browser File API provider - Uses the File System Access API for local file sync
 */
export class FileSystemProvider implements CloudProvider {
  id = 'file-system'
  name = 'Local File'
  
  private fileHandle?: FileSystemFileHandle
  
  isAvailable(): boolean {
    return typeof window !== 'undefined' && !!(window.showSaveFilePicker && window.showOpenFilePicker)
  }
  
  async upload(data: CloudSyncData): Promise<void> {
    if (!this.isAvailable() || !window.showSaveFilePicker) {
      throw new Error('File System Access API not available')
    }
    
    if (!this.fileHandle) {
      this.fileHandle = await window.showSaveFilePicker({
        suggestedName: 'qcode-sync.json',
        types: [{
          description: 'QCode Sync Files',
          accept: { 'application/json': ['.json'] }
        }]
      })
    }
    
    if (!this.fileHandle) {
      throw new Error('No file handle available')
    }
    
    const writable = await this.fileHandle.createWritable()
    await writable.write(JSON.stringify(data, null, 2))
    await writable.close()
  }
  
  async download(): Promise<CloudSyncData | null> {
    if (!this.isAvailable() || !window.showOpenFilePicker) {
      return null
    }
    
    try {
      const [fileHandle] = await window.showOpenFilePicker({
        types: [{
          description: 'QCode Sync Files',
          accept: { 'application/json': ['.json'] }
        }]
      })
      
      const file = await fileHandle.getFile()
      const content = await file.text()
      
      const data = JSON.parse(content)
      return {
        ...data,
        lastModified: new Date(data.lastModified),
        codes: data.codes.map((code: Record<string, unknown>) => ({
          ...code,
          dateAdded: new Date(code.dateAdded as string),
          expiryDate: code.expiryDate ? new Date(code.expiryDate as string) : undefined,
        }))
      }
    } catch (error) {
      if ((error as Error).name === 'AbortError') {
        return null // User cancelled
      }
      throw error
    }
  }
  
  async delete(): Promise<void> {
    // File system provider doesn't need explicit delete
    this.fileHandle = undefined
  }
}

// Export available providers
export const availableProviders: CloudProvider[] = [
  new LocalCloudProvider(),
  new FileSystemProvider(),
  // GitHubGistProvider needs to be instantiated with token
]

export function createGitHubGistProvider(token: string, gistId?: string): GitHubGistProvider {
  return new GitHubGistProvider(token, gistId)
}
