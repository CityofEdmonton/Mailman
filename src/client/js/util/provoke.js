/**
 * This module exports the Provoke function.
 * This was modified from Bruce McPherson's awesome examples found
 * {@link http://ramblings.mcpher.com/Home/excelquirks/gassnips/promisesandappsscript|here}.
 *
 * @author Bruce McPherson
 * @module
 */


var Promise = require('promise');



/**
 * A statically accessed way of calling GAS functions that return a Promise. Check out the server side function
 * {@link exposeRun}.
 *
 * @param {string} namespace The server-side namespace to search for the function. null for global.
 * @param {string} method The funtion to call server side.
 * @param {...*} args The additional arguments to pass to the function.
 */
var Provoke = function(namespace, method) {
  var runArgs = Array.prototype.slice.call(arguments).slice(2);

  return new Promise(function(resolve, reject) {

    google.script.run
      .withFailureHandler(function(err) {
        reject(err);
      })
      .withSuccessHandler(function(result) {
        resolve(result);
      })
    .exposeRun(namespace, method, runArgs);
  });
};


/** */
module.exports = Provoke;
