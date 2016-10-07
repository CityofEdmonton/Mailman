var Card = require('./card.js');

var titleHTML = require('../html/card-titled.html');

var TitledCard = function(appendTo, options) {
  Card.call(this, appendTo, options);

  // Private variables
  var self = this;
  var innerBase = $(titleHTML);

  // Public Variables


  //***** Private Methods *****//


  //***** Privileged Methods *****//
  this.setTitle = function(title) {
    innerBase.filter('h4').text(title);
  };

  this.setHelp = function(help) {
    innerBase.filter('.help').text(help);
  };

  // constructor
  this.insert(innerBase, 0);

  if (options !== undefined) {
    if (options.title !== undefined) {
      this.setTitle(options.title);
    }
    if (options.help !== undefined) {
      this.setHelp(options.help);
    }
  }
};

TitledCard.prototype = Object.create(Card.prototype);
TitledCard.prototype.constructor = TitledCard;

//***** Public Methods *****//





module.exports = TitledCard;
