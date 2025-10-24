import { GiphyFetch } from '@giphy/js-fetch-api'

export async function fetchRandomCelebrationGif(): Promise<string> {
  const fallbackGifUrl =
    'https://media4.giphy.com/media/v1.Y2lkPTc5MGI3NjExcWVmZTFwYTZ2OTJmbmVxeWtrN3NubmN5MmJqcHRmeHFqNGo1MXZrdiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/l0MYt5jPR6QX5pnqM/giphy.gif'

  if (!process.env.GIPHY_API_KEY) {
    console.error('GIPHY_API_KEY is not set in environment variables.')
    process.exit(1)
  }

  const gf = new GiphyFetch(process.env.GIPHY_API_KEY)

  try {
    const response = await gf.search('celebration, success', {
      sort: 'relevant',
      lang: 'en',
      limit: 25,
    })

    if (response.data.length === 0) {
      return fallbackGifUrl
    }

    const randomGif =
      response.data[Math.floor(Math.random() * response.data.length)]
    return randomGif.images.original.url
  } catch (error) {
    console.error('Error fetching GIF from Giphy:', error)
    return fallbackGifUrl
  }
}
