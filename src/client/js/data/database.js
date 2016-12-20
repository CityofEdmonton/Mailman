
var Database = function() {
  // private variables

  // public variables

  // ***** private methods ***** //

  /**
   * Converts the returned String into an Object. If the string isn't valid JSON, an error is thrown.
   *
   * @param {string} jsonString The stringified data value to be converted into an object.
   * @param {Object} callback The object that stores the success and failure handlers.
   * @param {Function} callback.success The function to call after parsing is successful.
   * @param {Function} callback.failure The function to call after parsing fails.
   */
  var handleJSONParsing = function(jsonString, callback) {
    if (jsonString === undefined) {
      if (callback.failure) {
        callback.failure();
      }

      return;
    }

    var obj;

    try {
      obj = JSON.parse(jsonString);
    }
    catch (e) {
      console.log('Failed when parsing JSON: ' + jsonString);
      if (callback.failure) {
        callback.failure();
      }
      else {
        throw e;
      }
    }

    callback.success(obj);
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

    if (success === undefined) {
      google.script.run
          .save(key, jsonString);
    }
    else {
      google.script.run
          .withSuccessHandler(success)
          .save(key, jsonString);
    }
  };

  /**
   * Loads an object.
   *
   * @param {String} key The key of the Object to return.
   * @param {Function} callback The function to call on success.
   * @param {Function} failure The function to call on failure.
   */
  this.load = function(key, callback, failure) {
    var cbObject;
    if (failure !== undefined) {
      cbObject = {
        success: callback,
        failure: failure
      };
    }
    else {
      cbObject = {
        success: callback
      };
    }

    google.script.run
        .withUserObject(cbObject)
        .withSuccessHandler(handleJSONParsing)
        .load(key);
  };
};


/** */
module.exports = Database;
