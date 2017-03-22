/**
 * This module exports the ActionBar object as a singleton.
 *
 * @author {@link https://github.com/j-rewerts|Jared Rewerts}
 * @module
 */


var baseHTML = require('./action-bar.html');
var Util = require('../../util/util.js');
var PubSub = require('pubsub-js');
var $ = require('jquery');



/**
 * The ActionBar is responsible for the display on the very top of Mailman. It has a logo, a title and some controls.
 * This object is a singleton.
 * ActionBar.init MUST be called.
 *
 * @constructor
 */
var ActionBar = function() {
  // private variables
  var settingsCB;
  var base = $(baseHTML);
  var self = this;
  var initialized = false;
  var fadeDuration = 500;

  // jQuery objects
  var settings = base.find('[data-id="settings"]');
  var title = base.find('[data-id="header-title"]');
  var icon = base.find('[data-id="mm-icon"]');

  //***** private methods *****//

  var hideSettings = function() {
    Util.setHidden(settings, true);
  };

  var showSettings = function() {
    Util.setHidden(settings, false);
  };

  //***** public methods *****//

  /**
   * This function initializes the ActionBar. This must be called.
   * TODO remove the event handling from here, as it's done in Mailman now.
   *
   * @param {jQuery} appendTo The object to append this ActionBar to.
   */
  this.init = function(appendTo) {
    if (initialized) {
      return;
    }

    appendTo.append(base);

    settings.on('click', function() {
      settingsCB();
    });

    PubSub.subscribe('Mailman.CardsView.show', function() {
      hideSettings();
    });

    PubSub.subscribe('Mailman.RulesListView.show', function() {
      showSettings();
    });

    PubSub.subscribe('Mailman.SettingsView.show', function() {
      hideSettings();
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
