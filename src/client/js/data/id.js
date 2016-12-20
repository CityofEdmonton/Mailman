/**
 * Thanks to gordonbrander for the implementation. Simple and effective.
 * See: https://gist.github.com/gordonbrander/2230317
 * Useful for less than 10000 ids. Beyond that, collisions start to occur.
 *
 * @return {string} A randomized string.
 */
var ID = function() {
  // Math.random should be unique because of its seeding algorithm.
  // Convert it to base 36 (numbers + letters), and grab the first 9 characters
  // after the decimal.
  return '_' + Math.random().toString(36).substr(2, 9);
};


/** */
module.exports = ID;
