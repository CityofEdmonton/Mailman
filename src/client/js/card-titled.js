var Card = require('./card.js');

var titleHTML = require('../html/card-titled.html');

var TitledCard = function(appendTo, options) {
  Card.call(this, appendTo, options);

  // Private variables
  var self = this;
  var innerBase = $(titleHTML);

  // Public Variables


  // constructor
  this.base.append(innerBase);

  if (options !== undefined) {
    if (options.title !== undefined) {
      this.setTitle(options.title);
    }
    if (options.help !== undefined) {
      this.setHelp(options.help);
    }
    if (options.label !== undefined) {
      this.setLabel(options.label);
    }
    if (options.paragraphs !== undefined) {
      options.paragraphs.every(function(data) {
        self.addParagraph(data);
        return true;
      });
    }
  }



  //***** Private Methods *****//


  //***** Privileged Methods *****//
};

TitledCard.prototype = Object.create(Card.prototype);
TitledCard.prototype.constructor = TitledCard;

//***** Public Methods *****//

TitledCard.prototype.setTitle = function(title) {
  this.base.find('h4').text(title);
};

TitledCard.prototype.setHelp = function(help) {
  this.base.find('.help').text(help);
};

TitledCard.prototype.addParagraph = function(content) {
  var para = $('<p>' + content + '</p>');
  this.base.append(para);
};



module.exports = TitledCard;
