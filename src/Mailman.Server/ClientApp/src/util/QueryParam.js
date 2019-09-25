/**
 * Parses a URL for it's query parameters.
 * @param {String} url
 */
export default function getParams(url) {
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
