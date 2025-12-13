/**
 * IndexNow API integration for Bing and other search engines
 * 
 * IndexNow allows you to notify search engines immediately when content is added, updated, or deleted.
 * Supported by: Bing, Yandex, Seznam.cz, Naver
 * 
 * Documentation: https://www.indexnow.org/documentation
 */

const INDEXNOW_API_KEY = 'afadbe044ea7453d8fd27d8d8f84ef12'
const INDEXNOW_KEY_LOCATION = 'https://nullkdev.github.io//afadbe044ea7453d8fd27d8d8f84ef12.txt'
const INDEXNOW_API_URL = 'https://api.indexnow.org/IndexNow'

export interface IndexNowOptions {
  /** The host where the URLs belong (e.g., "nullkdev.github.io") */
  host: string
  /** List of URLs to submit (full URLs with https://) */
  urls: string[]
  /** Optional: Custom key location if different from default */
  keyLocation?: string
}

/**
 * Submit URLs to IndexNow API
 * 
 * @param options IndexNow submission options
 * @returns Promise<Response> The API response
 */
export async function submitToIndexNow(options: IndexNowOptions): Promise<Response> {
  const { host, urls, keyLocation = INDEXNOW_KEY_LOCATION } = options

  // Validate URLs
  const validUrls = urls.filter((url) => {
    try {
      const urlObj = new URL(url)
      return urlObj.hostname === host || urlObj.hostname === `www.${host}`
    } catch {
      return false
    }
  })

  if (validUrls.length === 0) {
    throw new Error('No valid URLs to submit')
  }

  const payload = {
    host: host.startsWith('www.') ? host : `www.${host}`,
    key: INDEXNOW_API_KEY,
    keyLocation,
    urlList: validUrls,
  }

  const response = await fetch(INDEXNOW_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
    },
    body: JSON.stringify(payload),
  })

  return response
}

/**
 * Submit a single URL to IndexNow
 */
export async function submitUrl(url: string, host = 'nullkdev.github.io'): Promise<Response> {
  return submitToIndexNow({ host, urls: [url] })
}

/**
 * Submit multiple URLs to IndexNow (batch)
 */
export async function submitUrls(urls: string[], host = 'nullkdev.github.io'): Promise<Response> {
  return submitToIndexNow({ host, urls })
}

