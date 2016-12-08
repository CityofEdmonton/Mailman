
var baseHTML = require('./rule-list-item.html');
var EmailRule = require('../data/email-rule.js');

var RuleListItem = function(appendTo, rule) {
  // private variables
  var self = this;
  var base = $(baseHTML);

  // public variables


  //***** private methods *****//

  this.init_ = function(appendTo, rule) {
    appendTo.append(base);
  };

  //***** privileged methods *****//

  this.init_(appendTo, rule);
};

module.exports = RuleListItem;
