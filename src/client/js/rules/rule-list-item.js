
var baseHTML = require('./rule-list-item.html');
var EmailRule = require('../data/email-rule.js');
var ID = require('../data/id.js');
var Util = require('../util.js');
var RuleTypes = require('../data/rule-types.js');

var RuleListItem = function(appendTo, rule) {
  // private variables
  var self = this;
  var base = $(baseHTML);

  var to = base.find('[data-id="to"]');
  var toTooltip = base.find('[data-id="to-tooltip"]');
  var subject = base.find('[data-id="subject"]');
  var subjectTooltip = base.find('[data-id="subject-tooltip"]');
  var triggerIcon = base.find('[data-id="trigger-icon"]');
  var instantIcon = base.find('[data-id="instant-icon"]');
  var deleteIcon = base.find('[data-id="delete"]');

  var rule;

  // public variables


  //***** private methods *****//

  this.init_ = function(appendTo, rule) {
    rule = rule;

    to.text(rule.to);
    subject.text(rule.subject);

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

    upgradeTooltip(toTooltip, to);
    upgradeTooltip(subjectTooltip, subject);
  };

  var upgradeTooltip = function(tooltip, item) {
    var id = ID();
    item.attr('id', id);
    tooltip.attr('data-mdl-for', id);

    tooltip.addClass('mdl-tooltip');

    componentHandler.upgradeElement(tooltip[0], 'MaterialTooltip');
  };

  //***** privileged methods *****//

  this.setDeleteHandler = function(callback) {
    deleteIcon.on('click', rule, callback);
  }

  this.setEditHandler = function(callback) {
    triggerIcon.on('click', rule, callback);
    instantIcon.on('click', rule, callback);
  }

  this.init_(appendTo, rule);
};

module.exports = RuleListItem;
