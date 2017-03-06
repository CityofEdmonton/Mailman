/**
 * Temporarily disables the given object.
 *
 * @param {jquery} obj The object to disable.
 * @param {number} time the amount of time to wait before reenabling.
 */
var Disabler = function(obj, time) {
  var timeout = time | 3000;

  obj.attr('disabled', "true");

  window.setTimeout(function() {
    if (obj != null) {
      obj.removeAttr('disabled');
    }
  }, timeout);
};


/** */
module.exports = Disabler;
