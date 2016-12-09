
var baseHTML = require('./rules-list-view.html');
var EmailRule = require('../data/email-rule.js');
var RuleListItem = require('./rule-list-item.js');

var RulesListView = function(appendTo) {
  // private variables
  var self = this;
  var base = $(baseHTML);
  var list = base.find('ul');
  var ruleItems = [];

  var deletionCallback;
  var editCallback;

  // public variables


  //***** private methods *****//

  this.init_ = function(appendTo) {
    appendTo.append(base);
  };

  var itemDelete = function(e) {
    deletionCallback(e.data);
  };

  var itemEdit = function(e) {
    editCallback(e.data);
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

  this.init_(appendTo);
};

module.exports = RulesListView;
