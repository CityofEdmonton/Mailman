var baseHTML = require('./settings-view.html');
var Util = require('../../util/util.js');
var PubSub = require('pubsub-js');
var SettingsService = require('../../data/settings-service.js');


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
  var ss = new SettingsService();

  // jQuery objects
  var base = $(baseHTML);
  var list = base.find('[data-id="settings-list"]');
  var back = base.find('[data-id="back"]');
  var logSwitchIn = base.find('[data-id="log-switch-input"]');
  var logSwitch = base.find('[data-id="log-switch"]');
  var logIcon = base.find('[data-id="log-icon"]');
  var send = base.find('[data-id="as-me-button"]');
  var clear = base.find('[data-id="clear"]');

  //***** private methods *****//

  this.init_ = function(appendTo) {
    appendTo.append(base);

    ss.getLog(
      function(url) {
        setURL(url);

        if (url != null) {
          logSwitch[0].MaterialSwitch.on();
        }
      },
    logError);

    back.on('click', function() {
      self.hide();
    });

    logSwitchIn.on('change', function() {

      // var enable = logSwitch[0].MaterialSwitch.enable.bind(logSwitch[0].MaterialSwitch);
      // logSwitch[0].MaterialSwitch.disable();
      // setTimeout(enable, 3000);

      if (logSwitchIn[0].checked) {
        console.log('turning on logging');
        ss.turnOnLogging(setURL, logError);
      }
      else {
        console.log('turning off logging');
        ss.turnOffLogging(removeURL, logError);
      }
    });

    send.on('click', function() {
      ss.sendAsMe(null, logError);
    });

    clear.on('click', function() {
      ss.clearData(null, logError);
    });
  };

  var setURL = function(url) {
    if (url != null) {

      logIcon.addClass('sv-clickable');

      logIcon.off();
      logIcon.on('click', function() {
        console.log('opening: ' + url);
        window.open(url);
      });
    }
  };

  var removeURL = function() {
    logIcon.removeClass('sv-clickable');
    logIcon.off();
  };

  var logError = function(e) {
    console.error(e);
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
