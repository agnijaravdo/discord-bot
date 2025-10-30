import { fetchRandomCelebrationGif } from './giphy'
import { describe, it, expect, vi, beforeEach } from 'vitest'

vi.mock('@giphy/js-fetch-api')

describe('External API tests for Giphy service', () => {
  let mockGifSearch: ReturnType<typeof vi.fn>

  beforeEach(async () => {
    vi.clearAllMocks()
    vi.stubEnv('GIPHY_API_KEY', 'giphy-api-key')
    mockGifSearch = vi.fn()

    const { GiphyFetch } = await import('@giphy/js-fetch-api')
    vi.mocked(GiphyFetch).mockImplementation(
      () =>
        ({
          search: mockGifSearch,
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
        }) as any
    )
  })

  it('should return an error when GIPHY_API_KEY is missing', async () => {
    const mockConsoleError = vi
      .spyOn(console, 'error')
      .mockImplementation(() => {})
    const mockProcessExit = vi.spyOn(process, 'exit').mockImplementation(() => {
      throw new Error('process.exit was called')
    })

    vi.stubEnv('GIPHY_API_KEY', '')

    await expect(fetchRandomCelebrationGif()).rejects.toThrow(
      'process.exit was called'
    )

    expect(mockConsoleError).toHaveBeenCalledWith(
      'GIPHY_API_KEY is not set in environment variables.'
    )
    expect(mockProcessExit).toHaveBeenCalledWith(1)
  })

  it('should fetch a random celebration, success, congratulations, or victory GIF', async () => {
    const mockedGifsUrl = {
      data: [
        {
          images: { original: { url: 'https://giphy.com/gif1.gif' } },
        },
        {
          images: { original: { url: 'https://giphy.com/gif2.gif' } },
        },
        {
          images: { original: { url: 'https://giphy.com/gif3.gif' } },
        },
      ],
    }

    mockGifSearch.mockResolvedValueOnce(mockedGifsUrl)

    const gifUrl = await fetchRandomCelebrationGif()
    expect(mockGifSearch).toHaveBeenCalledWith(
      'celebration, success, congratulations, victory',
      {
        sort: 'relevant',
        lang: 'en',
        limit: 50,
      }
    )
    expect(gifUrl).toMatch(/https:\/\/giphy\.com\/gif[1-3]\.gif/)
  })

  it('should return fallback GIF when search fails', async () => {
    mockGifSearch.mockRejectedValue(new Error('API Error'))

    const gifUrl = await fetchRandomCelebrationGif()

    expect(gifUrl).toBe(
      'https://media4.giphy.com/media/v1.Y2lkPTc5MGI3NjExcWVmZTFwYTZ2OTJmbmVxeWtrN3NubmN5MmJqcHRmeHFqNGo1MXZrdiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/l0MYt5jPR6QX5pnqM/giphy.gif'
    )
  })

  it('should return fallback GIF when no GIFs are found', async () => {
    mockGifSearch.mockResolvedValue({ data: [] })
    const gifUrl = await fetchRandomCelebrationGif()

    expect(gifUrl).toBe(
      'https://media4.giphy.com/media/v1.Y2lkPTc5MGI3NjExcWVmZTFwYTZ2OTJmbmVxeWtrN3NubmN5MmJqcHRmeHFqNGo1MXZrdiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/l0MYt5jPR6QX5pnqM/giphy.gif'
    )
  })
})
