var baseHTML = require('./settings-view.html');
var Util = require('../util.js');
var PubSub = require('pubsub-js');


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
  var visible = false;

  // jQuery objects
  var base = $(baseHTML);
  var list = base.find('[data-id="settings-list"]');
  var back = base.find('[data-id="back"]');

  //***** private methods *****//

  this.init_ = function(appendTo) {
    appendTo.append(base);

    back.on('click', function() {
      self.hide();
    });
  };

  //***** public methods *****//

  /**
   * Hides the SettingsView.
   * Publishes the event Mailman.SettingsView.hide.
   *
   */
  this.hide = function() {
    if (visible) {
      Util.setHidden(base, true);
      visible = false;
      PubSub.publish('Mailman.SettingsView.hide');
    }
  };

  /**
   * Shows the SettingsView.
   * Publishes the event Mailman.SettingsView.show.
   *
   */
  this.show = function() {
    if (!visible) {
      Util.setHidden(base, false);
      visible = true;
      PubSub.publish('Mailman.SettingsView.show');
    }
  };

  this.init_(appendTo);
};


/** */
module.exports = SettingsView;
