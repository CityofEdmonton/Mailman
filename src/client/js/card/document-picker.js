/**
 * This module exports an DocumentPickerCard object.
 *
 * @author {@link https://github.com/j-rewerts|Jared Rewerts}
 * @module
 */


var html = require('./document-picker.html');
var TitledCard = require('./card-titled.js');
var Util = require('../util/util.js');
var DocService = require('../services/document-service.js');


/**
 * This card allows a user to pick a file from their Drive.
 *
 * @constructor
 * @extends module:client/js/card/card-titled~TitledCard
 * @param {jquery} appendTo The object to append this Card to.
 * @param {Object} options The configuration options for this card.
 */
var DocumentPickerCard = function(appendTo, options) {
  TitledCard.call(this, appendTo, options);

  // Private variables
  var self = this;
  var innerBase = $(html);

  var button = innerBase.find('[data-id="docs-button"]');

  //***** Private Methods *****//

  this.init_ = function(appendTo, options) {
    this.append(innerBase);

    button.on('click', function() {
      open();
    });

    componentHandler.upgradeElement(button[0], 'MaterialButton');
  };

  var open = function() {
    console.log(DocService);
    DocService.getDocument().then((result) => {
      console.log(result);
    }, (err) => {
      throw err;
    });
  }

  //***** Public Methods *****//

  /**
   * Gets the document id selected by the user.
   *
   * @return {string|null} The id of the document.
   */
  this.getValue = function() {
    return null;
  };

  this.init_(appendTo, options);
};


/** */
DocumentPickerCard.prototype.constructor = DocumentPickerCard;
DocumentPickerCard.prototype = Object.create(TitledCard.prototype);


/** */
module.exports = DocumentPickerCard;
