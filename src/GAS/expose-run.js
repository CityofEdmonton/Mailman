/**
 * Used to expose functions in a namespace.
 *
 * @param {string} namespace The namespace to look in. null for global.
 * @param {Function} method The function to call.
 */
function exposeRun (namespace, method, argArray) {
  var func = (namespace ? this[namespace][method] : this[method]);

  if (argArray && argArray.length) {
    return func.apply(this, argArray);
  }
  else {
    return func();
  }
}
