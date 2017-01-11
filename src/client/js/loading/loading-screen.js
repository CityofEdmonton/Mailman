var baseHTML = require('./loading-screen.html');
var Util = require('../util.js');



var LoadingScreen = function() {
  // private variables
  var initialized = false;
  var self = this;

  // jQuery objects
  var base = $(baseHTML);

  //***** private methods *****//

  //***** public methods *****//

  /**
   * Initializes the LoadingScreen. This MUST be called.
   *
   * @param  {jquery} appendTo The jquery object to append this to.
   */
  this.init = function(appendTo) {
    if (initialized) {
      return;
    }

    appendTo.append(base);
    initialized = true;
  };

  /**
   * Hides the loading screen.
   *
   */
  this.hide = function() {
    Util.setHidden(base, true);
  };

  /**
   * Shows the loading screen.
   *
   */
  this.show = function() {
    Util.setHidden(base, false);
  };

};

module.exports = new LoadingScreen();
