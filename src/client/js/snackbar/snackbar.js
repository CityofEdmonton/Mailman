var baseHTML = require('./snackbar.html');
var $ = require('jquery');



/**
 * The snackbar provides a way to display information to users. This uses MDL snackbar, found here:
 * https://getmdl.io/components/#snackbar-section
 * Note that this is a singleton. To use it, you must create it, then call init(appendTo). Subsequent uses need only
 * create a new Snackbar (it will return the same object, as it's a singleton).
 *
 */
var Snackbar = function() {

  // private variables
  var self = this;
  var initialized = false;

  // jQuery objects
  var base = $(baseHTML);


  //***** private methods *****//


  //***** public methods *****//

  /**
   * Initializes the Snackbar by attaching it to a DOM object.
   *
   * @param {jquery} appendTo The object to append this Snackbar to.
   */
  this.init = function(appendTo) {
    if (initialized) {
      return;
    }

    appendTo.append(base);

    initialized = true;
  };

  /**
   * The show function displays a snackbar for a set period of time. If this function is called before the previous
   * snackbar is hidden, the new message is delayed until the old snackbar is gone.
   *
   */
  this.show = function(message, timeout) {
    base[0].MaterialSnackbar.showSnackbar({
      message: message,
      timeout: timeout
    });
  };

};


/** */
module.exports = new Snackbar();
