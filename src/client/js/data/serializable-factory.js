


/**
 * The SerializableFactory is used to handle converting objects between types. The problem arises when de/serializing
 * In Javascript, when JSON.parse is used, it doesn't return a specific type of object.
 * Problem solved!
 *
 * @constructor
 */
var SerializableFactory = function() {
  this.registrants = [];
};


/**
 * Registers an object with the factory. Now this object can be built using the build function.
 * Registrants must have a TYPE property so the factory can tell its type. Typeof wouldn't work due to
 * serialization constraints.
 *
 * @param {Object} obj The object to register. This must have a TYPE property.
 */
SerializableFactory.prototype.register = function(obj) {
  this.registrants.push(obj);
};


/**
 * This builds a registered object from a generic one.
 *
 * @param {Object} obj The object that contains all the needed properties to become a new object.
 * @return {?Object} The object returned by the conversion. Note that this will likely be a specific type,
    not just an Object.
 */
SerializableFactory.prototype.build = function(obj) {
  for (var i = 0; i < this.registrants.length; i++) {
    var registrant = this.registrants[i];

    if (obj.TYPE === registrant.TYPE) {
      registrantObj = new registrant();

      for (var prop in obj) {
        registrantObj[prop] = obj[prop];
      }

      return registrantObj;
    }
  }

  return null;
};


/** This exports the factory as a singleton */
module.exports = new SerializableFactory();
