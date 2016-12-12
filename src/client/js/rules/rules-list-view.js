
var baseHTML = require('./rules-list-view.html');

var EmailRule = require('../data/email-rule.js');
var RuleListItem = require('./rule-list-item.js');

var RulesListView = function(appendTo) {
  // private variables
  var self = this;
  var base = $(baseHTML);
  var list = base.find('ul');
  var triggerButton = base.find('[data-id="trigger-button"]');
  var instantButton = base.find('[data-id="instant-button"]');
  var ruleItems = [];

  // Event callbacks
  var deletionCallback;
  var editCallback;
  var triggerCB;
  var instantCB;

  // public variables


  //***** private methods *****//

  this.init_ = function(appendTo) {
    appendTo.append(base);

    //newItem.on('click', openRuleEditor)
    triggerButton.on('click', newTrigger);
    instantButton.on('click', newInstant);
  };

  var itemDelete = function(e) {
    deletionCallback(e.data);
  };

  var itemEdit = function(e) {
    editCallback(e.data);
  };

  var newTrigger = function(e) {
    triggerCB(e);
  };

  var newInstant = function(e) {
    instantCB(e);
  };

  //***** privileged methods *****//

  this.addRule = function(rule) {

    var item = new RuleListItem(list, rule);
    item.setDeleteHandler(itemDelete);
    item.setEditHandler(itemEdit);

    ruleItems.push(item);
  };

  this.setDeleteHandler = function(callback) {
    deletionCallback = callback;
  };

  this.setEditHandler = function(callback) {
    editCallback = callback;
  };

  this.setTriggerHandler = function(callback) {
    triggerCB = callback;
  };

  this.setInstantHandler = function(callback) {
    instantCB = callback;
  };

  this.init_(appendTo);
};

module.exports = RulesListView;
