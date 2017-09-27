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
  var documentID;

  var button = innerBase.find('[data-id="docs-button"]');
  var imageContainer = innerBase.find('[data-id="image-container"]');
  var title = innerBase.find('[data-id="title"]');

  //***** Private Methods *****//

  this.init_ = function(appendTo, options) {
    this.append(innerBase);

    button.on('click', function() {
      open();
    });

    componentHandler.upgradeElement(button[0], 'MaterialButton');
  };

  var open = function() {
    DocService.getDocument().then((result) => {
      documentID = result.id;
      title.text(result.title);
      imageContainer.empty();
      imageContainer.append('<img src="' + result.thumbnail + '"/>');
    }, (err) => {
      throw err;
    });
  };

  //***** Public Methods *****//

  /**
   * Gets the document id selected by the user.
   *
   * @return {string?} The id of the document.
   */
  this.getValue = function() {
    return documentID;
  };

  this.init_(appendTo, options);
};


/** */
DocumentPickerCard.prototype.constructor = DocumentPickerCard;
DocumentPickerCard.prototype = Object.create(TitledCard.prototype);


/** */
module.exports = DocumentPickerCard;
