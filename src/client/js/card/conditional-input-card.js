var conditionalHTML = require('./conditional-input-card.html');
var InputCard = require('./card-input.js');



var ConditionalInputCard = function(appendTo, options) {
  InputCard.call(this, appendTo, options);

  // Private variables
  var self = this;
  var innerBase = $(conditionalHTML);
  var checkbox = innerBase.find('[data-id="checkbox"]');
  var cbLabel = innerBase.find('[data-id="checkbox-label"]');

  //***** Private Methods *****//

  this.init_ = function(appendTo, options) {
    this.append(innerBase);

    checkbox.on('change', setCardState);

    if (options.enabled !== undefined) {
      if (options.enabled) {
        checkbox.attr('checked');
      }
      else {
        checkbox.removeAttr('checked');
      }
    }
  };

  var setCardState = function(e) {
    console.log(e);
  };

  var disableCard = function() {
    self.disableInput();
  };

  var enableCard = function() {
    self.enableInput();
  };

  this.init_(appendTo, options);
};


/** */
ConditionalInputCard.prototype.constructor = ConditionalInputCard;
ConditionalInputCard.prototype = Object.create(ConditionalInputCard.prototype);


/** */
module.exports = ConditionalInputCard;
