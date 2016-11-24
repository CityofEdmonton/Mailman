/**
 * This file handles all data storage and retrieval.
 *
 */


/**
 * Saves value, indexable by key, in the data store.
 *
 * @param {String} key The key of the data
 * @param {String} value The data to store.
 */
function save(key, value) {
  var prop = PropertiesService.getDocumentProperties();

  if (prop === null) {
    throw 'Error: no document could be found.';
  }

  prop.setProperty(key, value);
}


/**
 * Returns the data associated with key or null if nothing is found.
 *
 * @param {String} key The key the required string is indexed on.
 * @return {?String} The data store
 */
function load(key) {
  var prop = PropertiesService.getDocumentProperties();

  if (prop === null) {
    throw 'Error: no document could be found.';
  }

  return prop.getProperty(key);
}
