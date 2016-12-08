
var baseHTML = require('./rules-list-view.html');
var EmailRule = require('../data/email-rule.js');
var RuleListItem = require('./rule-list-item.js');

var RulesListView = function(appendTo) {
  // private variables
  var self = this;
  var base = $(baseHTML);
  var list = base.find('ul');

  // public variables


  //***** private methods *****//

  this.init_ = function(appendTo) {
    appendTo.append(base);
  };

  //***** privileged methods *****//

  this.addRule = function(rule) {
    console.log('test');
    var item = new RuleListItem(list, rule);
  };

  this.init_(appendTo);
};

module.exports = RulesListView;
