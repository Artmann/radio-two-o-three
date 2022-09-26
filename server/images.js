const fetch = require('node-fetch')
const sharp = require('sharp')

async function imageRoute(request, response) {
  let { url, size } = request.query

  if (!url) {
    request.status(400).send('Missing URL')

    return
  }

  try {
    url = decodeURIComponent(url)
    size = size ? parseInt(size, 10) : 256

    const res = await fetch(url)

    if (!res.ok) {
      throw new Error('Failed to fetch image.')
    }

    const data = await res.buffer()

    const image = await sharp(data)
      .resize(size, size)
      .toFormat('webp')
      .toBuffer()


    response.set('Content-Type', 'image/webp')

    const expiresInSeconds = 3600 * 24 * 365

    response.set('Cache-Control', `public, max-age=${  expiresInSeconds }, s-maxage=${  expiresInSeconds  }, stale-while-revalidate`)

    response.end(image, 'binary')
  } catch (error) {
    console.error(error)
  }

  response.status(500).send('Something went wrong')
}

module.exports = { imageRoute }
