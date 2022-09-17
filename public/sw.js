const version = 1
const cacheStorageName = 'v1'

self.addEventListener('fetch', (event) => {
  // console.log('Fetch', event)
})

self.addEventListener('install', event => {

})

self.addEventListener('message', (event) => {
  if (event.data === 'SKIP_WAITING') {
    self.skipWaiting()
  }
})


async function downloadFile(url) {

}
