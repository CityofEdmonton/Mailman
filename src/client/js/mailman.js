
var Rules = require('./data/rule-container.js');
var RuleTypes = require('./data/rule-types.js');
var EmailRule = require('./data/email-rule.js');
var Database = require('./data/database.js');
var Keys = require('./data/prop-keys.js');
var RulesListView = require('./rules/rules-list-view.js');
var CardsView = require('./cards/cards-view.js');
var ActionBar = require('./action-bar/action-bar.js');
var LoadingScreen = require('./loading/loading-screen.js');
var baseHTML = require('./main.html');



var MailMan = function(appendTo) {

  // ***** CONSTANTS ***** //

  //***** LOCAL VARIABLES *****//

  var self = this;
  var base = $(baseHTML);

  var database = new Database();

  var state = {
    loadedSheets: true,
    loadedColumns: true,
    loadedRules: false
  };

  var rules;

  var rulesListView;
  var cardsView;

  var header = base.find('[data-id="header"]');
  var actionBar = ActionBar;

  var ls = LoadingScreen;

  //***** PUBLIC *****//

  /**
   * Performs basic set up of the Mailman environment.
   *
   * @constructor
   */
  this.init = function(appendTo) {
    appendTo.append(base);

    actionBar.init(header);
    rulesListView = new RulesListView($('#layout-container'));
    cardsView = new CardsView($('#layout-container'));

    actionBar.setHelpHandler(function() {
      cardsView.toggleHelp();
    });

    rulesListView.setTriggerHandler(function(e) {
      cardsView.newRule(RuleTypes.TRIGGER);

      rulesListView.hide();
      cardsView.show();
    });

    rulesListView.setInstantHandler(function(e) {
      cardsView.newRule(RuleTypes.INSTANT);

      rulesListView.hide();
      cardsView.show();
    });

    rulesListView.setDeleteHandler(function(rule) {
      rules.remove(rule);
    });

    rulesListView.setEditHandler(function(rule) {
      cardsView.setRule(rule);

      rulesListView.hide();
      cardsView.show();
    });

    rulesListView.setRunHandler(function(rule) {

      if (rule.ruleType === RuleTypes.INSTANT) {
        google.script.run
            .instantEmail(rule.toConfig());
      }
      else if (rule.ruleType === RuleTypes.TRIGGER) {
        google.script.run
          .triggerEmailNoSS(rule.toConfig());
      }
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

    cardsView.setCancelCallback(function() {
      cardsView.cleanup();

      rulesListView.show();
      cardsView.hide();
    });

    database.load(Keys.RULE_KEY, function(config) {
      try {
        rules = new Rules(config);
      }
      catch (e) {
        rules = new Rules({});
        // We don't need to fail if the rule isn't properly formatted. Just log and continue on.
        console.log(e);
      }

      rulesListView.setRulesContainer(rules);
      ls.hide();
    }, function() {
      rules = new Rules({});
      rulesListView.setRulesContainer(rules);
      ls.hide();
    });

    rulesListView.show();
  };

  //***** PRIVATE *****//

  this.init(appendTo);
};


/**  */
module.exports = MailMan;
