
var baseHTML = require('./rule-list-item.html');
var EmailRule = require('../data/email-rule.js');
var ID = require('../data/id.js');
var Util = require('../util.js');
var RuleTypes = require('../data/rule-types.js');



/**
 * Used to display an EmailRule. It has icons for editing and deleting the rule.
 *
 * @constructor
 * @param {jquery} appendTo The object to append this component to.
 * @param {EmailRule} rule The rule to display.
 */
var RuleListItem = function(appendTo, rule) {
  // private variables
  var self = this;
  var base = $(baseHTML);

  var triggerIcon = base.find('[data-id="trigger-icon"]');
  var instantIcon = base.find('[data-id="instant-icon"]');
  var deleteIcon = base.find('[data-id="delete"]');
  var runIcon = base.find('[data-id="run"]');
  var editIcon = base.find('[data-id="edit"]');
  var title = base.find('[data-id="title"]');

  var rule;

  // public variables

  //***** private methods *****//

  this.init_ = function(appendTo, rule) {
    rule = rule;

    title.text(rule.title);

    if (rule.ruleType === RuleTypes.TRIGGER) {
      Util.setHidden(instantIcon, true);
      Util.setHidden(triggerIcon, false);
    }
    else if (rule.ruleType === RuleTypes.INSTANT) {
      Util.setHidden(instantIcon, false);
      Util.setHidden(triggerIcon, true);
    }
    else {
      throw new Error('Unknown ruletype.');
    }

    appendTo.append(base);

    componentHandler.upgradeElement(deleteIcon[0], 'MaterialButton');
    componentHandler.upgradeElement(runIcon[0], 'MaterialButton');
    componentHandler.upgradeElement(editIcon[0], 'MaterialButton');
  };

  //***** privileged methods *****//

  /**
   * Sets the handler for when the delete icon is clicked.
   *
   * @param {Function} callback The function to call.
   */
  this.setDeleteHandler = function(callback) {
    deleteIcon.on('click', rule, callback);
  };

  /**
   * Sets the handler for when the edit icon is clicked.
   *
   * @param {Function} callback The function to call.
   */
  this.setEditHandler = function(callback) {
    editIcon.on('click', rule, callback);
  };

  /**
   * Sets the handler for when the run icon is clicked.
   *
   * @param {Function} callback The function to call.
   */
  this.setRunHandler = function(callback) {
    runIcon.on('click', rule, callback);
  };

  /**
   * Cleans up this component. This involves removing the HTML from the DOM.
   *
   */
  this.cleanup = function() {
    base.remove();
  };

  this.init_(appendTo, rule);
};


/** */
module.exports = RuleListItem;
