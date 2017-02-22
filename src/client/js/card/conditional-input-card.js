var conditionalHTML = require('./conditional-input-card.html');
var InputCard = require('./card-input.js');



/**
 * This Card extends the functionality of InputCard. It gives the ability of disabling the InputCard.
 * This is useful in situations where you don't want the Card to be required.
 *
 * @param {jquery} appendTo The div to append this Card to.
 * @param {Object} options The object that describes the Card functionality. See the parent object InputCard for details.
 * @param {boolean} enabled The default state of the checkbox.
 */
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

    componentHandler.upgradeElement(innerBase[0], 'MaterialCheckbox');

    if (options.enabled !== undefined) {
      if (options.enabled) {
        checkbox.attr('checked');
      }
    }
    if (options.checkboxText !== undefined) {
      cbLabel.text(options.checkboxText);
    }
  };

  var setCardState = function(e) {
    // NOTE MDL doesn't change the class until after this event is fired. That revereses our logic here.
    if (!self.isEnabled()) {
      enableCard();
    }
    else {
      disableCard();
    }
  };

  var disableCard = function() {
    self.disableInput();
  };

  var enableCard = function() {
    self.enableInput();
  };

  //***** Public Functions *****//

  /**
   * Checks whether this Card is enabled.
   *
   * @returns {boolean} True if the Card is enabled. False if it isn't.
   */
  this.isEnabled = function() {
    return innerBase.hasClass('is-checked');
  }

  this.init_(appendTo, options);
};


/** */
ConditionalInputCard.prototype.constructor = ConditionalInputCard;
ConditionalInputCard.prototype = Object.create(ConditionalInputCard.prototype);


/** */
module.exports = ConditionalInputCard;
