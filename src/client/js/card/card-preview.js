/**
 * This module exports a PreviewCard object.
 *
 * @author {@link https://github.com/dchenier|Dan Chenier}
 * @module
 */


var inputHTML = require('./card-preview.html');
var TitledCard = require('./card-titled.js');



var PreviewCard = function(appendTo, options) {
  TitledCard.call(this, appendTo, options);

  // Private variables
  var self = this;
  var innerBase = $(inputHTML);

  var to, cc, bcc, subject, body, bodyRender;

  //***** Private Methods *****//

  this.init_ = function(appendTo, options) {
    this.append(innerBase);

    to = appendTo.find("[data-id='preview-to']");
    cc = appendTo.find("[data-id='preview-cc']");
    bcc = appendTo.find("[data-id='preview-bcc']");
    subject = appendTo.find("[data-id='preview-subject']");
    body = appendTo.find("[data-id='preview-body']");
    bodyRender = appendTo.find("[data-id='preview-rendered']").first();
    
    $.each(appendTo.find(".mdl-textfield"), (i, x) => {
      componentHandler.upgradeElement(x, 'MaterialTextfield');
    });  
  };

  //***** Public Methods *****//
  this.setValue = function(data) {
    var mergeData = data || {};
    // mdlObject[0].MaterialTextfield.change(value);
    to[0].MaterialTextfield.change(mergeData.to);
    cc[0].MaterialTextfield.change(mergeData.cc);
    bcc[0].MaterialTextfield.change(mergeData.bcc);
    subject[0].MaterialTextfield.change(mergeData.subject);
    if (mergeData.body) {
      body.hide();
      bodyRender.html(mergeData.body);
    } else {
      body.show();
      bodyRender.html("");
    }
  };

  this.isValid = function() {
    // easy - we're always valid!
    return true;
  };  
  
  this.init_(appendTo, options);
};


/** */
PreviewCard.prototype.constructor = PreviewCard;
PreviewCard.prototype = Object.create(TitledCard.prototype);


/** */
module.exports = PreviewCard;