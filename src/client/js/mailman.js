/**
 * Intercom: https://github.com/diy/intercom.js/
 * Tips on using intercom with GAS: https://github.com/googlesamples/apps-script-dialog2sidebar
 *
 *
 */

var Util = require('./util.js');
var NavBar = require('./nav/navigation-bar.js');
var PubSub = require('pubsub-js');
var Rules = require('./data/rule-container.js');
var RuleTypes = require('./data/rule-types.js');
var EmailRule = require('./data/email-rule.js');
var Database = require('./data/database.js');
var Keys = require('./data/prop-keys.js');
var RulesListView = require('./rules/rules-list-view.js');
var CardsView = require('./cards/cards-view.js');
//var Intercom = require('./intercom.js');

var MailMan = function() {

  // ***** CONSTANTS ***** //

  //***** LOCAL VARIABLES *****//

  var self;

  // The object used to communicate between the sidebar and the RTE (Rich Text Editor)
  var intercom;

	// How long to wait for the dialog to check-in before assuming it's been closed, in milliseconds.
	var DIALOG_TIMEOUT_MS = 2000;

  // This handles all the nav-bar navigation.
  var navBar;

  var database = new Database();

	/**
	 * Holds a mapping from dialog ID to the ID of the timeout that is used to
	 * check if it was lost. This is needed so we can cancel the timeout when
	 * the dialog is closed.
	 */
	var timeoutIds = {};

  var rules;

  var rulesListView;
  var cardsView;

  //***** PUBLIC *****//

  /**
   * Performs basic set up of the Mailman environment.
   *
   * @constructor
   */
  this.init = function() {
    self = this;

    // UI Configuration
    // All UI Bindings
    $('#help').on('click', self.onHelpClick);

    intercom = Intercom.getInstance();
    rulesListView = new RulesListView($('#layout-container'));
    cardsView = new CardsView($('#layout-container'));

    rulesListView.setTriggerHandler(function(e) {
      cardsView.newRule(RuleTypes.TRIGGER);
      //cards.setType(RuleTypes.TRIGGER);

      //setButtonState();

      navBar = new NavBar($('#nav-row'), 3, function(e) {
        var node = e.data;

        cards.jumpTo(node.name);
      });
      //navBar.buildNavTree(cards.getActiveNode());

      rulesListView.hide();
      cardsView.show();
    });

    rulesListView.setInstantHandler(function(e) {
      // cards.setType(RuleTypes.INSTANT);
      cardsView.newRule(RuleTypes.INSTANT);

      //setButtonState();

      navBar = new NavBar($('#nav-row'), 3, function(e) {
        var node = e.data;

        cards.jumpTo(node.name);
      });
      //navBar.buildNavTree(cards.getActiveNode());

      rulesListView.hide();
      cardsView.show();
    });

    rulesListView.setDeleteHandler(function(rule) {
      rules.remove(rule);
    });

    rulesListView.setEditHandler(function(rule) {
      cardsView.setRule(rule);

      navBar = new NavBar($('#nav-row'), 3, function(e) {
        var node = e.data;

        cards.jumpTo(node.name);
      });
      //navBar.buildNavTree(cards.getActiveNode());

      rulesListView.hide();
      cardsView.show();
    });

    cardsView.setDoneCallback(function(rule) {
      if (rules.indexOf(rule.getID()) !== -1) {
        rules.update(rule);
      }
      else {
        rules.add(rule.toConfig());
      }

      database.save(Keys.RULE_KEY, rules.toConfig(), function() {
        if (rule.ruleType === RuleTypes.INSTANT) {
          google.script.run
              .instantEmail(rule.toConfig());
        }

        setTimeout(function() {
          cardsView.cleanup();

          rulesListView.show();
          cardsView.hide();
        }, 1000);
      });
    });

    database.load(Keys.RULE_KEY, function(config) {
      try {
        rules = new Rules(config);
      }
      catch (e) {
        // We don't need to fail if the rule isn't properly formatted. Just log and continue on.
        console.log(e);
      }

      rulesListView.setRulesContainer(rules);
    }, function() {
      rules = new Rules({});
      rulesListView.setRulesContainer(rules);
    });
  };

  /**
   * This function toggles the state of the help <p> tags.
   *
   */
  this.onHelpClick = function() {
    cardsView.toggleHelp();
  };

  //***** PRIVATE *****//

  /**
   * Using the Cards handler, this sets the state of the buttons.
   * Depending on the active Card, different buttons may be shown.
   *
   */
  var setButtonState = function() {
    // Default state
    Util.setHidden($('#done'), true);
    Util.setHidden($('#step'), false);
    Util.setHidden($('#back'), false);

    if (cards.isFirst()) {
      Util.setHidden($('#back'), true);
    }
    else if (cards.isLast()) {
      Util.setHidden($('#done'), false);
      Util.setHidden($('#step'), true);
    }
  };

  var onRTEOpened = function(dialogId) {

    intercom.on(dialogId, function(data) {

          switch (data.state) {
            case 'done':
              console.log('Dialog submitted.\n');

              getNode('Body').data.setValue(data.message);

              forget(dialogId);
              break;
            case 'checkIn':
              forget(dialogId);
              watch(dialogId);
              break;
            case 'lost':
              console.log('Dialog lost.\n');
              break;
            default:
              throw 'Unknown dialog state: ' + data.state;
          }
        });
  };

  /**
   * Watch the given dialog, to detect when it's been X-ed out.
   *
   * @param {string} dialogId The ID of the dialog to watch.
   */
  var watch = function(dialogId) {
    timeoutIds[dialogId] = window.setTimeout(function() {
      intercom.emit(dialogId, 'lost');
    }, DIALOG_TIMEOUT_MS);
  };

  /**
   * Stop watching the given dialog.
   * @param {string} dialogId The ID of the dialog to watch.
   */
  var forget = function(dialogId) {
    if (timeoutIds[dialogId]) {
      window.clearTimeout(timeoutIds[dialogId]);
    }
  };

  this.init();
};


/**  */
module.exports = MailMan;
