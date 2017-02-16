var Card = require('./card.js');
var titleHTML = require('./card-titled.html');
var ID = require('../data/id.js');
var Util = require('../util.js');



/**
 * This represents a basic Card that has a title. It also provides help functionality.
 *
 * @param {jquery} appendTo The jquery object to append this Card to.
 * @param {Object} options The parent configuration object for this TitledCard.
 * @param {string} options.title The title of this Card.
 * @param {string} options.help The text of the help pop-up. If nothing is provided, there will be no help icon.
 */
var TitledCard = function(appendTo, options) {
  Card.call(this, appendTo, options);

  // Private variables
  var self = this;

  // jquery objects
  var innerBase = $(titleHTML);
  var header = innerBase.find('[data-id="title-header"]');
  var helpIcon = innerBase.find('[data-id="help-icon"]');
  var helpText = innerBase.find('[data-id="help-tooltip"]');

  //***** Private Methods *****//

  this.init_ = function(appendTo, options) {
    this.insert(innerBase, 0);

    var iconID = ID();

    helpIcon.attr('id', iconID);
    helpText.attr('for', iconID);
    Util.setHidden(helpIcon, true);

    if (options !== undefined) {
      if (options.title !== undefined) {
        this.setTitle(options.title);
      }
      if (options.help !== undefined) {
        this.setHelp(options.help);
      }
    }

    componentHandler.upgradeElement(helpText[0], 'MaterialTooltip');
  };

  //***** Public Methods *****//

  /**
   * Sets the title that is displayed for this Card.
   *
   * @param {string} title The title of the Card.
   */
  this.setTitle = function(title) {
    header.text(title);
  };

  /**
   * This sets the help that is displayed for this card.
   *
   * @param {string} help The help to be displayed to users about this Card.
   */
  this.setHelp = function(help) {
    helpText.text(help);
    Util.setHidden(helpIcon, false);
  };

  /**
   * Determines whether a Card has help set.
   *
   * @return {boolean} Returns true if this Card has help. False if it has no help.
   */
  this.hasHelp = function() {
    return !helpIcon.hasClass('hidden');
  };

  this.init_(appendTo, options);
};


/** */
TitledCard.prototype.constructor = TitledCard;
TitledCard.prototype = Object.create(Card.prototype);


/** */
module.exports = TitledCard;
