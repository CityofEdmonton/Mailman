var baseHTML = require('./settings-view.html');
var Util = require('../util.js');



/**
 * The SettingsView handles much of the advanced app parameters. Primary functions include:
 * Logging
 * Data clearing
 * Send email as me
 *
 * @param {jquery} appendTo The object to append this view to.
 */
var SettingsView = function(appendTo) {
  // private variables
  var self = this;

  // jQuery objects
  var base = $(baseHTML);
  var list = base.find('[data-id="settings-list"]');

  //***** private methods *****//

  this.init_ = function(appendTo) {
    appendTo.append(base);
  };

  //***** public methods *****//

  /**
   * Hides the SettingsView.
   *
   */
  this.hide = function() {
    Util.setHidden(base, true);
  };

  /**
   * Shows the SettingsView.
   *
   */
  this.show = function() {
    Util.setHidden(base, false);
  };

  this.init_(appendTo);
};


/** */
module.exports = SettingsView;
