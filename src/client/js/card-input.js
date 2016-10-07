var TitledCard = require('./card-titled.js');

var inputHTML = require('../html/card-input.html');

var InputCard = function(appendTo, options) {
  TitledCard.call(this, appendTo, options);

  // Private variables
  var self = this;
  var innerBase = $(inputHTML);

  // Public Variables


  // constructor
  this.base.append(innerBase);



  //***** Private Methods *****//


  //***** Privileged Methods *****//
};

//***** Public Methods *****//
InputCard.prototype.getValue = function() {
  return this.base.find('input').val();
};

InputCard.prototype.setValue = function(value) {
  base.find('input').val(value);
};


InputCard.prototype = Object.create(TitledCard.prototype);
InputCard.prototype.constructor = InputCard;

module.exports = InputCard;
