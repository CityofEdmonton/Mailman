
var baseHTML = require('./rules-list-view.html');

var EmailRule = require('../data/email-rule.js');
var RuleListItem = require('./rule-list-item.js');
var Util = require('../util.js');
var PubSub = require('pubsub-js');

var RulesListView = function(appendTo) {
  // private variables
  var self = this;
  var base = $(baseHTML);
  var list = base.find('ul');
  var triggerButton = base.find('[data-id="trigger-button"]');
  var instantButton = base.find('[data-id="instant-button"]');
  var ruleItems = [];
  var ruleContainer;

  // Event callbacks
  var deletionCallback;
  var editCallback;
  var triggerCB;
  var instantCB;

  // public variables


  //***** private methods *****//

  this.init_ = function(appendTo) {
    appendTo.append(base);

    triggerButton.on('click', newTrigger);
    instantButton.on('click', newInstant);

    PubSub.subscribe('Rules.delete', function(msg, data) {
      console.log('RLV rebuild');
      rebuild();
    });

    PubSub.subscribe('Rules.add', function(msg, data) {
      console.log('RLV rebuild');
      rebuild();
    });
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

  var rebuild = function() {
    for (var i = 0; i < ruleItems.length; i++) {
      ruleItems[i].cleanup();
    }

    ruleItems = [];
    for (var i = 0; i < ruleContainer.length(); i++) {
      self.addRule(ruleContainer.get(i));
    }
  };

  //***** privileged methods *****//

  this.setRulesContainer = function(container) {
    ruleContainer = container;
    rebuild();
  }

  this.addRule = function(rule) {

    var item = new RuleListItem(list, rule);
    item.setDeleteHandler(itemDelete);
    item.setEditHandler(itemEdit);

    ruleItems.push(item);
  };

  this.hide = function() {
    Util.setHidden(base, true);
  };

  this.show = function() {
    Util.setHidden(base, false);
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
