import type { ChangelogEntry, AIGeneratedSummary, ChangelogData } from '@/types/changelog'

// Storage keys
const LAST_VISIT_KEY = 'qcode-last-visit'
const CHANGELOG_CACHE_KEY = 'qcode-changelog-cache'

export const getLastVisitDate = (): Date | null => {
  const lastVisit = localStorage.getItem(LAST_VISIT_KEY)
  return lastVisit ? new Date(lastVisit) : null
}

export const updateLastVisitDate = (): void => {
  localStorage.setItem(LAST_VISIT_KEY, new Date().toISOString())
}

export const generateAISummary = (entries: ChangelogEntry[]): AIGeneratedSummary => {
  // Simulate AI-generated summary based on entries
  const hasNewFeatures = entries.some(entry => 
    entry.title.toLowerCase().includes('add') || 
    entry.title.toLowerCase().includes('implement') ||
    entry.title.toLowerCase().includes('feature')
  )
  
  const hasBugFixes = entries.some(entry =>
    entry.title.toLowerCase().includes('fix') ||
    entry.title.toLowerCase().includes('bug') ||
    entry.title.toLowerCase().includes('resolve')
  )

  const hasUIChanges = entries.some(entry =>
    entry.title.toLowerCase().includes('ui') ||
    entry.title.toLowerCase().includes('design') ||
    entry.title.toLowerCase().includes('style')
  )

  const highlights: string[] = []
  let userImpact = ''

  if (hasNewFeatures) {
    highlights.push('🎉 New features have been added to improve your experience')
    userImpact += 'You now have access to new tools and functionality. '
  }

  if (hasBugFixes) {
    highlights.push('🐛 Bug fixes for a smoother experience')
    userImpact += 'The app should work more reliably. '
  }

  if (hasUIChanges) {
    highlights.push('✨ Visual improvements and design updates')
    userImpact += 'The interface has been refined for better usability. '
  }

  if (highlights.length === 0) {
    highlights.push('📝 General improvements and maintenance')
    userImpact = 'Various behind-the-scenes improvements have been made.'
  }

  const title = `${entries.length} new update${entries.length > 1 ? 's' : ''} available`
  const summary = `We've made some exciting improvements to QCode! ${userImpact.trim()}`

  return {
    title,
    summary,
    highlights,
    userImpact: userImpact.trim()
  }
}

export const fetchCommitsSince = async (since: Date): Promise<ChangelogEntry[]> => {
  try {
    // For demo purposes, simulate fetching commits
    // In a real implementation, this would call the GitHub API
    const mockCommits: ChangelogEntry[] = [
      {
        id: 'commit-1',
        type: 'commit',
        title: 'Implement dynamic changelog popup with AI-generated summaries',
        description: 'Added a new popup system that shows users what\'s new when they visit the site, with AI-generated summaries for better user experience.',
        author: 'Developer',
        date: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
        url: '#',
        sha: 'abc123'
      },
      {
        id: 'commit-2',
        type: 'commit',
        title: 'Add advanced release notes dashboard for technical users',
        description: 'Created a detailed dashboard with commit information and PR details for users who want technical information.',
        author: 'Developer',
        date: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 hours ago
        url: '#',
        sha: 'def456'
      },
      {
        id: 'commit-3',
        type: 'commit',
        title: 'Move sample data loading to developer options',
        description: 'Cleaned up the UI by moving all demo data functionality to a dedicated developer options section.',
        author: 'Developer',
        date: new Date(Date.now() - 6 * 60 * 60 * 1000), // 6 hours ago
        url: '#',
        sha: 'ghi789'
      }
    ]

    // Only return commits newer than the last visit
    return mockCommits.filter(commit => commit.date.getTime() > since.getTime())
  } catch (error) {
    console.error('Failed to fetch commits:', error)
    return []
  }
}

export const fetchPullRequestsSince = async (since: Date): Promise<ChangelogEntry[]> => {
  try {
    // For demo purposes, simulate fetching PRs
    // In a real implementation, this would call the GitHub API
    const mockPRs: ChangelogEntry[] = []

    // Only return PRs newer than the last visit
    return mockPRs.filter(pr => pr.date.getTime() > since.getTime())
  } catch (error) {
    console.error('Failed to fetch pull requests:', error)
    return []
  }
}

export const checkForUpdates = async (): Promise<ChangelogData> => {
  const lastVisit = getLastVisitDate()
  
  // If no last visit, consider it first time and don't show popup
  if (!lastVisit) {
    updateLastVisitDate()
    return {
      hasNewUpdates: false,
      lastCheckDate: new Date(),
      entries: []
    }
  }

  try {
    const [commits, prs] = await Promise.all([
      fetchCommitsSince(lastVisit),
      fetchPullRequestsSince(lastVisit)
    ])

    const allEntries = [...commits, ...prs].sort((a, b) => b.date.getTime() - a.date.getTime())
    const hasNewUpdates = allEntries.length > 0

    let aiSummary: AIGeneratedSummary | undefined
    if (hasNewUpdates) {
      aiSummary = generateAISummary(allEntries)
    }

    const changelogData: ChangelogData = {
      hasNewUpdates,
      lastCheckDate: new Date(),
      entries: allEntries,
      aiSummary
    }

    // Cache the results
    localStorage.setItem(CHANGELOG_CACHE_KEY, JSON.stringify(changelogData))

    return changelogData
  } catch (error) {
    console.error('Failed to check for updates:', error)
    return {
      hasNewUpdates: false,
      lastCheckDate: new Date(),
      entries: []
    }
  }
}

export const getCachedChangelog = (): ChangelogData | null => {
  try {
    const cached = localStorage.getItem(CHANGELOG_CACHE_KEY)
    if (!cached) return null

    const data = JSON.parse(cached)
    // Parse dates
    data.lastCheckDate = new Date(data.lastCheckDate)
    data.entries = data.entries.map((entry: ChangelogEntry) => ({
      ...entry,
      date: new Date(entry.date)
    }))

    return data
  } catch (error) {
    console.error('Failed to parse cached changelog:', error)
    return null
  }
}