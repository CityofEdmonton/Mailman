/**
 * Parses a URL for it's query parameters.
 * @param {String} url
 */
export function getHashParams(url) {
  let urlArray = url.split('?')
  if (urlArray.length < 2) {
    return {}
  }

  let params = {}
  urlArray[1].split('&').forEach(keyAndValue => {
    let keyValueArray = keyAndValue.split('=')
    params[keyValueArray[0]] = keyValueArray[1]
  })
  return params
}

/**
 * Creates a relative URL string from an object and a base url. Note that the parameters
 * are added after the #.
 * Eg: https://localhost:5001/#/templates?ssid=abcdefg becomes /templates?ssid=abcdefg
 * @param {String} url The url. Query params after the hash are overwritten.
 * @param {Object} params An Object containing the parameters to convert to string.
 * @return {String} A string containing "params" as a string after the hash.
 */
export function getHashUrl(url, params) {
  let splitUrl = url.split('#')

  if (splitUrl.length < 2) {
    throw new Error(`Failed getting hash URL: ${url} has no hash.`)
  } else if (splitUrl.length > 2) {
    throw new Error(`Failed getting hash URL: ${url} has multiple hashes.`)
  }

  let afterHash = splitUrl[1]
  let route = afterHash.split('?')[0]
  let currentParams = {}
  // Only matches when there is a query string.
  if (
    afterHash.split('?')[1] &&
    afterHash.split('?')[1].match(/[^=?\/&]+=[^=?\/&]+/g)
  ) {
    currentParams = afterHash.split('?')[1].reduce((combined, value) => {
      let values = value.split('=')
      combined[values[0]] = values[1]
      return combined
    }, {})
  }

  let combinedParams = { ...currentParams, ...params }
  let hashUrl = `${route}?`
  for (let [key, value] of Object.entries(combinedParams)) {
    hashUrl += `${key}=${value}&`
  }
  return hashUrl
}
