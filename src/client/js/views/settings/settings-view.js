/**
 * This module exports the SettingsView object.
 *
 * @author {@link https://github.com/j-rewerts|Jared Rewerts}
 * @module
 */


var baseHTML = require('./settings-view.html');
var Util = require('../../util/util.js');
var PubSub = require('pubsub-js');
//var SettingsService = require('../../services/settings-service.js');
var Snackbar = require('../snackbar/snackbar.js');
//var MetadataService = require('../../services/metadata-service.js');



/**
 * The SettingsView handles much of the advanced app parameters. Primary functions include
 * logging, current version and the active users email quota.
 *
 * @constructor
 * @param {jquery} appendTo The object to append this view to.
 * @param SettingsService The Settings Service defined by require('../../services/settings-service.js')
 */
var SettingsView = function(appendTo,
    settingsService,
    metadataService) {

  // BEGIN contract block
  if (!appendTo)
      throw "appendTo cannot be null";
  else if (!settingsService)
      throw "settingsService cannot be null";
  else if (!metadataService)
      throw "metadataService cannot be null";

  // private variables
  var self = this;
  var visible = false;

  // jQuery objects
  var base = $(baseHTML);
  var list = base.find('[data-id="settings-list"]');
  var back = base.find('[data-id="back"]');
  var logSwitchIn = base.find('[data-id="log-switch-input"]');
  var logSwitch = base.find('[data-id="log-switch"]');
  var logIcon = base.find('[data-id="log-icon"]');
  var emailsLeft = base.find('[data-id="emails-left"]');
  var version = base.find('[data-id="version"]');

  //***** private methods *****//

  this.init_ = function(appendTo) {
    appendTo.append(base);

    settingsService.getLog().then(
      function(url) {
        if (url != null) {
          setURL(url);
          logSwitch[0].MaterialSwitch.on();
        }
      },
      logError
    ).done();

    getQuota();
    window.setInterval(getQuota, 10000);

    metadataService.getVersion().then(
      function(result) {
        version.text('Mailman ' + result);
      },
      logError
    ).done();

    back.on('click', function() {
      self.hide();
    });

    logSwitchIn.on('change', function() {

      if (logSwitchIn[0].checked) {
        Snackbar.show('Turning ON logging...');
        settingsService.turnOnLogging().then(setURL, logError).done();
      }
      else {
        Snackbar.show('Turning OFF logging...');
        settingsService.turnOffLogging().then(removeURL, logError).done();
      }
    });
  };

  var getQuota = function() {
    metadataService.getQuota().then(
      function(result) {
        emailsLeft.text(result + ' daily emails remaining');
      },
      logError
    ).done();
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
