/**
 * This module exports a ConditionalCard object.
 *
 * @author {@link https://github.com/j-rewerts|Jared Rewerts}
 * @module
 */


var conditionalHTML = require('./conditional-card.html');
var BaseCard = require('./card-titled.js');



/**
 * This Card extends the functionality of BaseCard. It gives the ability of disabling the BaseCard.
 * This is useful in situations where you don't want the Card to be required.
 *
 * @constructor
 * @param {jquery} appendTo The div to append this Card to.
 * @param {Object} options The object that describes the Card functionality. See the parent object BaseCard for details.
 * @param {boolean} enabled The default state of the checkbox.
 */
var ConditionalCard = function(appendTo, options) {
  BaseCard.call(this, appendTo, options);

  // Private variables
  var self = this;
  var  innerBase = $(conditionalHTML);
  var  RadioButtons1 = innerBase.find('[data-id="radio-button-option1"]');
  var  rbLabel1 = innerBase.find('[data-id="radio__label-1"]');
  var  RadioButtons2 = innerBase.find('[data-id="radio-button-option2"]');
  var  rbLabel2 = innerBase.find('[data-id="radio__label-2"]');
  var  RadioButtons3 = innerBase.find('[data-id="radio-button-option3"]');
  var  rbLabel3 = innerBase.find('[data-id="radio__label-3"]');

  //***** Private Methods *****//

  this.init_ = function(appendTo, options) {
    //$(this).find('[data-id="radio-button-option1"]').attr("checked","true");
    innerBase.find('[data-id="radio-button-option1"]').prop("checked","true");
    this.append(innerBase);

    if (options.checkboxText1 !== undefined) {
      rbLabel1.text(options.checkboxText1);
    }

    if (options.checkboxText2 !== undefined) {
      rbLabel2.text(options.checkboxText2);
    }

    if (options.checkboxText3 !== undefined) {
      rbLabel3.text(options.checkboxText3);
    }

    //$(this).find('[data-id="radio-button-option1"]').prop("checked","true");
    console.log("hahaha");
    componentHandler.upgradeAllRegistered();

    RadioButtons3.val("checked");
  

  };

  var test = function(buttonname){
    RadioButtons2.attr('checked');
  }

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
      return "onform";
      //return "auto";
      //return "off";
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
