var Card = require('./card.js');

var titleHTML = require('./card-titled.html');

var TitledCard = function(appendTo, options) {
  Card.call(this, appendTo, options);

  // Private variables
  var self = this;
  var innerBase = $(titleHTML);

  // Public Variables


  //***** Private Methods *****//


  //***** Privileged Methods *****//

  /**
   * Sets the title that is displayed for this Card.
   *
   * @param {string} title The title of the Card.
   */
  this.setTitle = function(title) {
    innerBase.filter('h4').text(title);
  };

  /**
   * This sets the help that is displayed for this card.
   *
   * @param {string} help The help to be displayed to users about this Card.
   */
  this.setHelp = function(help) {
    innerBase.filter('.help').text(help);
  };

  // constructor
  this.insert(innerBase, 0);

  if (options !== undefined) {
    if (options.title !== undefined) {
      this.setTitle(options.title);
    }
    if (options.help !== undefined) {
      this.setHelp(options.help);
    }
  }
};


/** */
TitledCard.prototype.constructor = TitledCard;
TitledCard.prototype = Object.create(Card.prototype);

//***** Public Methods *****//


/** */
module.exports = TitledCard;
