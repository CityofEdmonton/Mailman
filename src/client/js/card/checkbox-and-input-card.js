/**
 * This module exports a CheckboxInput object.
 *
 * @author {@link https://github.com/j-rewerts|Jared Rewerts}
 * @module
 */


var conditionalHTML = require('./checkbox-and-input-card.html');
var InputCard = require('./card-input.js');



/**
 * This Card extends the functionality of InputCard. It gives the ability of disabling the InputCard.
 * This is useful in situations where you don't want the Card to be required.
 *
 * @constructor
 * @extends module:client/js/card/card-input~InputCard
 * @param {jquery} appendTo The div to append this Card to.
 * @param {Object} options The object that describes the Card functionality. See the parent object InputCard for details.
 * @param {boolean} enabled The default state of the checkbox.
 */
var CheckboxInput = function(appendTo, options) {
  InputCard.call(this, appendTo, options);

  // Private variables
  var self = this;
  var innerBase = $(conditionalHTML);
  var checkbox = innerBase.find('[data-id="checkbox"]');
  var cbLabel = innerBase.find('[data-id="checkbox-label"]');

  //***** Private Methods *****//

  this.init_ = function(appendTo, options) {
    this.append(innerBase);

    componentHandler.upgradeAllRegistered();

    if (options.enabled !== undefined) {
      if (options.enabled) {
        checkbox.attr('checked');
      }
    }
    if (options.checkboxText !== undefined) {
      cbLabel.text(options.checkboxText);
    }
  };





  //***** Public Functions *****//

  /**
   * Checks whether this Card is enabled.
   *
   * @returns {boolean} True if the Card is enabled. False if it isn't.
   */
  this.isEnabled = function() {
    return innerBase.hasClass('is-checked');
  };

  /**
   * Checks and enables this Card.
   *
   */
  this.check = function() {
    innerBase[0].MaterialCheckbox.check();
  };

  /**
   * Unchecks and disables this Card.
   *
   */
  this.uncheck = function() {
    innerBase[0].MaterialCheckbox.uncheck();
  };

  var oldGetValue = this.getValue;


  /**
   * Gets the value associated with this Card.
   *
   * @return {string} The value of this Card.
   */
  this.useTitle = function() {
    if (self.isEnabled()) {
      return true;
    }
    return false;
  }

  this.getValue = function() {
      return oldGetValue();
  }

  this.init_(appendTo, options);
};


/** */
CheckboxInput.prototype.constructor = CheckboxInput;
CheckboxInput.prototype = Object.create(CheckboxInput.prototype);


/** */
module.exports = CheckboxInput;
