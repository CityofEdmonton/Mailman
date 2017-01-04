var baseHTML = require('./action-bar.html');
var Util = require('../util.js');
var PubSub = require('pubsub-js');

var ActionBar = function(appendTo) {
  // private variables
  var helpCB;
  var settingsCB;
  var base = $(baseHTML);
  var self = this;

  // jQuery objects
  var help = base.find('[data-id="help"]');
  var settings = base.find('[data-id="settings"]');

  //***** private methods *****//
  this.init_ = function(appendTo) {
    appendTo.append(base);

    help.on('click', function() {
      helpCB();
    });

    settings.on('click', function() {
      settingsCB();
    });

    PubSub.subscribe('Mailman.CardsView.show', function() {
      self.showHelp();
      self.hideSettings();
    });

    PubSub.subscribe('Mailman.RulesListView.show', function() {
      self.hideHelp();
      //self.showSettings();
    });
  }

  //***** public methods *****//

  this.setSettingsHandler = function(cb) {
    settingsCB = cb;
  };

  this.setHelpHandler = function(cb) {
    helpCB = cb;
  };

  this.hideHelp = function() {
    Util.setHidden(help, true);
  };

  this.showHelp = function() {
    Util.setHidden(help, false);
  };

  this.hideSettings = function() {
    Util.setHidden(settings, true);
  };

  this.showSettings = function() {
    Util.setHidden(settings, false);
  };

  this.init_(appendTo);
};


/** */
module.exports = ActionBar;
