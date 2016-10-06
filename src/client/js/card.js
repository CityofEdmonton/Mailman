
var baseHTML = require('../html/card-base.html');

var Card = function(appendTo, options) {
  // Private variables
  var self = this;

  // Public Variables
  this.base = $(baseHTML);


  // constructor
  appendTo.append(this.base);

  if (options !== undefined) {
    if (options.visible !== undefined) {
      if (options.visible === true) {
        this.show();
      }
      else {
        this.hide();
      }
    }
  }

  //***** Private Methods *****//


  //***** Privileged Methods *****//


};

//***** Public Methods *****//

Card.prototype.show = function() {
  if (this.base.hasClass('hidden') === true) {
    this.base.removeClass('hidden');
    this.base.trigger('card.show');
  }
};

Card.prototype.hide = function() {
  if (this.base.hasClass('hidden') === false) {
    this.base.addClass('hidden');
    this.base.trigger('card.hide');
  }
};

module.exports = Card;
