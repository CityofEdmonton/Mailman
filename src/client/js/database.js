var factory = require('./serializable-factory.js');

var Database = function() {
  // private variables

  // public variables

  // ***** private methods ***** //

  /**
   * Converts the returned String into an Object. If the string isn't valid JSON, an error is thrown.
   *
   * @param {String} jsonString The stringified data value to be converted into an object.
   * @param {Function} callback The function to call after parsing is successful.
   */
  var handleJSONParsing = function(jsonString, callback) {
    var obj;

    try {
      obj = JSON.parse(jsonString);
    }
    catch (e) {
      console.log('Failed when parsing JSON.');
      throw e;
    }

    var actualObj = factory.build(obj);

    callback(obj);
  };

  // ***** privileged methods ***** //

  /**
   * Saves the given object to the Mailman file store.
   *
   * @param {String} key The unique key to save the Object under.
   *  If the key already exists, the old object is overwritten.
   * @param {Object} obj A JSON-serializeable Object.
   * @param {Function} success This function is called on success.
   */
  this.save = function(key, obj, success) {
    var jsonString = JSON.stringify(obj);

    if (window.google !== undefined) {
      if (success === undefined) {
        google.script.run
            .save(key, jsonString);
      }
      else {
        google.script.run
            .withSuccessHandler(success)
            .save(key, jsonString);
      }
    }
  };

  /**
   * Loads an object.
   *
   * @param {String} key The key of the Object to return.
   * @param {Function} callback The function to call on success
   */
  this.load = function(key, callback) {
    if (window.google !== undefined) {
      google.script.run
          .withUserObject(callback)
          .withSuccessHandler(handleJSONParsing)
          .load(key);
    }
  };
};


/** */
module.exports = Database;
