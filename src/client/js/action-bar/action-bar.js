var baseHTML = require('./action-bar.html');
var Util = require('../util.js');
var PubSub = require('pubsub-js');


/**
 * The ActionBar is responsible for the display on the very top of Mailman. It has a logo, a title and some controls.
 * This object is a singleton.
 * ActionBar.init MUST be called.
 *
 */
var ActionBar = function() {
  // private variables
  var helpCB;
  var settingsCB;
  var base = $(baseHTML);
  var self = this;
  var initialized = false;
  var fadeDuration = 500;

  // jQuery objects
  var help = base.find('[data-id="help"]');
  var settings = base.find('[data-id="settings"]');
  var title = base.find('[data-id="header-title"]');
  var icon = base.find('[data-id="mm-icon"]');

  //***** private methods *****//

  var hideHelp = function() {
    Util.setHidden(help, true);
  };

  var showHelp = function() {
    Util.setHidden(help, false);
  };

  var hideSettings = function() {
    Util.setHidden(settings, true);
  };

  var showSettings = function() {
    Util.setHidden(settings, false);
  };

  //***** public methods *****//

  this.init = function(appendTo) {
    if (initialized) {
      return;
    }

    appendTo.append(base);

    help.on('click', function() {
      helpCB();
    });

    settings.on('click', function() {
      settingsCB();
    });

    PubSub.subscribe('Mailman.CardsView.show', function() {
      showHelp();
      hideSettings();
    });

    PubSub.subscribe('Mailman.RulesListView.show', function() {
      hideHelp();
      //self.showSettings();
    });

    initialized = true;
  };

  /**
   * Sets the callback for the settings icon.
   *
   * @param {Function} cb Called when the settings icon is clicked.
   */
  this.setSettingsHandler = function(cb) {
    settingsCB = cb;
  };

  /**
   * Sets the callback for the help icon.
   *
   * @param {Function} cb Called when the help icon is clicked.
   */
  this.setHelpHandler = function(cb) {
    helpCB = cb;
  };

  /**
   * Displays the Mailman logo and title.
   *
   */
  this.showBranding = function() {
    title.show('fade', {}, fadeDuration);
    icon.show('fade', {}, fadeDuration);
  };

  /**
   * Hides the Mailman logo and title.
   *
   */
  this.hideBranding = function() {
    title.hide('fade', {}, fadeDuration);
    icon.hide('fade', {}, fadeDuration);
  };
};


/** */
module.exports = new ActionBar();
