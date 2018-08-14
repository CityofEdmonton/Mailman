/**
 * This module exports a ConditionalCard object.
 *
 * @author {@link https://github.com/j-rewerts|Jared Rewerts}
 * @module
 */


var conditionalHTML = require('./conditional-card.html');
var BaseCard = require('./card-titled.js');



/**
 * This Card extends the functionality of InputCard. It gives the ability of disabling the InputCard.
 * This is useful in situations where you don't want the Card to be required.
 *
 * @constructor
 * @param {jquery} appendTo The div to append this Card to.
 * @param {Object} options The object that describes the Card functionality. See the parent object InputCard for details.
 * @param {boolean} enabled The default state of the checkbox.
 */
var ConditionalCard = function(appendTo, options) {
  BaseCard.call(this, appendTo, options);

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

  /**
   * Gets the value associated with this Card.
   *
   * @return {string} The value of this Card.
   */
  this.getValue = function() {
    if (self.isEnabled()) {
      return "enabled";
    }
    return;
  }

  this.init_(appendTo, options);
};


/** */
ConditionalCard.prototype.constructor = ConditionalCard;
ConditionalCard.prototype = Object.create(ConditionalCard.prototype);


/** */
module.exports = ConditionalCard;
