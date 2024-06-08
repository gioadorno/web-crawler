import { JSDOM } from 'jsdom';

function normalizeURL(url) {
  try {
    const parsedUrl = new URL(url);

    let host = parsedUrl.hostname.replace(/^www\./, '');
    let pathname = parsedUrl.pathname.replace(/\/$/, '');

    return `${host}${pathname}`
  } catch (error) {
    console.error('Invalud URL', e);
    return null;
  }
}

function getURLsFromHTML(htmlBody, baseURL) {
  const dom = new JSDOM(htmlBody, {
    url: baseURL
  })
  const absoluteURLs = [];
  const urls = dom.window.document.querySelectorAll('a');
  urls.forEach(u => {
    if (u?.href) {
      const normalURL = normalizeURL(u.href)
      if (normalURL) {
        absoluteURLs.push(normalURL)
      }
    }
  })
  return absoluteURLs;
}

// use default args to prime the first call
async function crawlPage(baseURL, currentURL = baseURL, pages = {}) {
  // if this is an offsite URL, bail immediately
  const currentURLObj = new URL(currentURL)
  const baseURLObj = new URL(baseURL)
  if (currentURLObj.hostname !== baseURLObj.hostname) {
    return pages
  }

  // use a consistent URL format
  const normalizedURL = normalizeURL(currentURL)

  // if we've already visited this page
  // just increase the count and don't repeat
  // the http request
  if (pages[normalizedURL] > 0) {
    pages[normalizedURL]++
    return pages
  }

  // initialize this page in the map
  // since it doesn't exist yet
  pages[normalizedURL] = 1

  // fetch and parse the html of the currentURL
  console.log(`crawling ${currentURL}`)
  let html = ''
  try {
    html = await fetchHTML(currentURL)
  } catch (err) {
    console.log(`${err.message}`)
    return pages
  }

  // recur through the page's links
  const nextURLs = getURLsFromHTML(html, baseURL)
  for (const nextURL of nextURLs) {
    pages = await crawlPage(baseURL, nextURL, pages)
  }

  return pages
}

export { normalizeURL, getURLsFromHTML, crawlPage }
