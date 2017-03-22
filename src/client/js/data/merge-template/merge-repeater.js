/**
 * This module exports the MergeRepeater object.
 *
 * @author {@link https://github.com/j-rewerts|Jared Rewerts}
 * @module
 */



/**
 * The MergeRepeater handles storing data related to repeated merges. This doesn't actually create the trigger
 * or talk to the server. This Object can be easily serialized by calling toConfig or deserialized by passing that
 * config back into this contructor.
 *
 * @constructor
 * @alias MergeRepeater
 * @param {Object} config The configuration Object used to define this MergeRepeater.
 * @param {Array<string>} config.triggers An Array of trigger IDs that can call this merge.
 * @param {string} config.owner The user that added the MergeRepeater.
 * @param {Array<string>} config.events A log of events that pertain to this MergeRepeater.
 */
var MergeRepeater = function(config) {

  var MAX_EVENTS = 10;

  var triggers;
  var owner;
  var events;
  var sheetID;

  //***** Private Methods *****//

  this.init_ = function(config) {
    events = [];

    this.update(config);
  };

  //***** Public Methods *****//

  /**
   * Updates this MergeRepeater.
   *
   * @param {Object} config The same config used in the constructor.
   */
  this.update = function(config) {
    if (config.triggers != null) {
      triggers = config.triggers;
    }
    if (config.owner != null) {
      owner = config.owner;
    }
    if (config.events != null) {
      events = config.events;
    }
    if (config.sheetID != null) {
      sheetID = config.sheetID;
    }
  }

  /**
   * Adds an event to this MergeRepeater. This can be used to determine what the trigger has been doing.
   * This ensures only MAX_EVENTS are recorded. Keep in mind, this is a client-side control, so it could easily be
   * circumvented.
   *
   * @param {string} event The event to log.
   */
  this.addEvent = function(event) {
    events.push(event);

    var tooMany = events.length - MAX_EVENTS;
    if (tooMany > 0) {
      events.splice(0, tooMany);
    }
  };




  /**
   * Converts this object into an easily serializeable form.
   *
   * @returns {Object} An Object containing all the data needed to recreate this Object.
   */
  this.toConfig = function() {
    return {
      triggers: triggers,
      owner: owner,
      events: events,
      sheetID: sheetID
    };
  };

  this.init_(config);
};


/** */
module.exports = MergeRepeater;
