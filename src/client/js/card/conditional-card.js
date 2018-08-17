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
  var innerBase = $(conditionalHTML);
  var checkbox1 = innerBase.find('[data-id="checkbox1"]');
  var cbLabel1 = innerBase.find('[data-id="checkbox-label1"]');
  var checkbox2 = innerBase.find('[data-id="checkbox2"]');
  var cbLabel2 = innerBase.find('[data-id="checkbox-label2"]');
  var checkbox3 = innerBase.find('[data-id="checkbox3"]');
  var cbLabel3 = innerBase.find('[data-id="checkbox-label3"]');

  //***** Private Methods *****//

  this.init_ = function(appendTo, options) {
    this.append(innerBase);

    checkbox1.on('change', setcheckbox1);
    checkbox2.on('change', setcheckbox2);
    checkbox3.on('change', setcheckbox3);


    componentHandler.upgradeAllRegistered();

    if (options.enabled_checkboxText1 !== undefined) {
      if (options.enabled_checkboxText1) {
        checkbox1.attr('checked');
      }
    }
    if (options.checkboxText1 !== undefined) {
      cbLabel1.text(options.checkboxText1);
    }

    if (options.enabled_checkboxText2 !== undefined) {
      if (options.enabled_checkboxText2) {
        checkbox2.attr('checked');
      }
    }
    if (options.checkboxText2 !== undefined) {
      cbLabel2.text(options.checkboxText2);
    }

    if (options.enabled_checkboxText3 !== undefined) {
      if (options.enabled_checkboxText3) {
        checkbox3.attr('checked');
      }
    }
    if (options.checkboxText3 !== undefined) {
      cbLabel3.text(options.checkboxText3);
    }


  };

  var setcheckbox1 = function(e) {
      checkbox1.attr('checked');
      checkbox2.attr('unchecked');
      checkbox3.attr('unchecked');
  };
  var setcheckbox2 = function(e) {
    checkbox1.attr('unchecked');
    checkbox2.attr('checked');
    checkbox3.attr('unchecked');
};
var setcheckbox3 = function(e) {
  checkbox1.attr('unchecked');
  checkbox2.attr('unchecked');
  checkbox3.attr('checked');
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
