import { fetchCommitsSince, fetchPullRequestsSince } from '../utils/changelog'

// Mock fetch globally
const mockFetch = jest.fn()
global.fetch = mockFetch

describe('Changelog GitHub API Integration', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    console.error = jest.fn() // Suppress console.error in tests
  })

  describe('fetchCommitsSince', () => {
    it('should make correct API call to GitHub commits endpoint', async () => {
      const mockCommits = [
        {
          sha: 'abc123',
          commit: {
            message: 'Fix bug in release notes\n\nDetailed description here',
            author: {
              name: 'John Doe',
              date: '2023-10-01T12:00:00Z'
            }
          },
          author: {
            login: 'johndoe'
          },
          html_url: 'https://github.com/Githubguy132010/qcode/commit/abc123'
        }
      ]

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockCommits
      })

      const since = new Date('2023-10-01T00:00:00Z')
      const result = await fetchCommitsSince(since)

      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('https://api.github.com/repos/Githubguy132010/qcode/commits'),
        expect.objectContaining({
          headers: {
            'Accept': 'application/vnd.github.v3+json',
            'User-Agent': 'QCode-App'
          }
        })
      )

      expect(result).toHaveLength(1)
      expect(result[0]).toMatchObject({
        id: 'commit-abc123',
        type: 'commit',
        title: 'Fix bug in release notes',
        description: 'Detailed description here',
        author: 'John Doe',
        sha: 'abc123',
        url: 'https://github.com/Githubguy132010/qcode/commit/abc123'
      })
    })

    it('should handle API errors gracefully', async () => {
      mockFetch.mockRejectedValueOnce(new Error('Network error'))

      const since = new Date()
      const result = await fetchCommitsSince(since)

      expect(result).toEqual([])
      expect(console.error).toHaveBeenCalledWith('Failed to fetch commits:', expect.any(Error))
    })
  })

  describe('fetchPullRequestsSince', () => {
    it('should make correct API call to GitHub pull requests endpoint', async () => {
      const mockPRs = [
        {
          number: 42,
          title: 'Add new feature',
          body: 'This PR adds a new feature',
          user: {
            login: 'johndoe'
          },
          merged_at: '2023-10-01T12:00:00Z',
          html_url: 'https://github.com/Githubguy132010/qcode/pull/42',
          merge_commit_sha: 'def456'
        }
      ]

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockPRs
      })

      const since = new Date('2023-10-01T00:00:00Z')
      const result = await fetchPullRequestsSince(since)

      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('https://api.github.com/repos/Githubguy132010/qcode/pulls'),
        expect.objectContaining({
          headers: {
            'Accept': 'application/vnd.github.v3+json',
            'User-Agent': 'QCode-App'
          }
        })
      )

      expect(result).toHaveLength(1)
      expect(result[0]).toMatchObject({
        id: 'pr-42',
        type: 'pr',
        title: 'Add new feature',
        description: 'This PR adds a new feature',
        author: 'johndoe',
        prNumber: 42,
        sha: 'def456',
        url: 'https://github.com/Githubguy132010/qcode/pull/42'
      })
    })

    it('should filter out unmerged pull requests', async () => {
      const mockPRs = [
        {
          number: 42,
          title: 'Merged PR',
          user: { login: 'johndoe' },
          merged_at: '2023-10-01T12:00:00Z',
          html_url: 'https://github.com/Githubguy132010/qcode/pull/42'
        },
        {
          number: 43,
          title: 'Unmerged PR',
          user: { login: 'johndoe' },
          merged_at: null,
          html_url: 'https://github.com/Githubguy132010/qcode/pull/43'
        }
      ]

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockPRs
      })

      const since = new Date('2023-10-01T00:00:00Z')
      const result = await fetchPullRequestsSince(since)

      expect(result).toHaveLength(1)
      expect(result[0].title).toBe('Merged PR')
    })

    it('should handle API errors gracefully', async () => {
      mockFetch.mockRejectedValueOnce(new Error('Network error'))

      const since = new Date()
      const result = await fetchPullRequestsSince(since)

      expect(result).toEqual([])
      expect(console.error).toHaveBeenCalledWith('Failed to fetch pull requests:', expect.any(Error))
    })
  })
})