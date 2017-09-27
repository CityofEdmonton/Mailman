/**
 * This module exports the LocalStorageEmitter object.
 *
 * @author {@link https://github.com/j-rewerts|Jared Rewerts}
 * @module
 */

var StorageObject = function(channel, timer, promise) {

};

/**
 * This object allows communication between a GAS sidebar and a dialog.
 *
 * @constructor
 */
var LocalStorageEmitter = function() {

  var subs = {};
  var timers = {};
  var store = window.localStorage;
  var self = this;
  var CHECK_FREQ = 3000;

  //***** private methods *****//

  this.init_ = function() {

  };

  var checkChannel = function(channel) {
    var value = store.getItem(channel);
    if (value) {
      store.removeItem(channel);
      clearInterval(timers[channel]);
      subs[channel].resolve(JSON.parse(value));
      subs[channel] = null;
    }
  };

  //***** public methods *****//

  /**
   * Emit a payload on a channel.

   * @param {string} channel The channel to emit on.
   * @param {Object} content A POJO. Must be easily de/serializeable.
   */
  this.emit = function(channel, content) {
    store.setItem(channel, JSON.stringify(content));
  };

  /**
   * Allows for being notified once time about a change to a channel.

   * @param {string} channel The channel to listen on.
   * @return {Promise} A Promise that resolves with a POJO.
   */
  this.once = function(channel) {
    var promise = new Promise((resolve, reject) => {
      subs[channel] = {promise, resolve, reject};
      timers[channel] = setInterval(checkChannel.bind(self, channel), CHECK_FREQ);
    });

    return promise;
  };

  this.init_();
};


/** */
module.exports = LocalStorageEmitter;
