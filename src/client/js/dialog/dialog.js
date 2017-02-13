var baseHTML = require('./dialog.html');
var dialogPolyfill = require('dialog-polyfill');
var $ = require('jquery');
var Promise = require('promise');



/**
 * The Dialog provides a way to confirm or cancel user actions.This uses MDL Dialog, found here:
 * https://getmdl.io/components/#dialog-section
 *
 * @param {jquery} appendTo The parent div this dialog should be appended to.
 * @param {string} title The title of this Dialog.
 * @param {string} content The contents of the Dialog.
 */
var Dialog = function(appendTo, titleText, contentText) {
  // private variables
  var self = this;

  // jquery objects
  var base = $(baseHTML);
  var title = base.find('[data-id="title"]');
  var content = base.find('[data-id="content"]');
  var confirm = base.find('[data-id="confirm"]');
  var cancel = base.find('[data-id="close"]');

  //***** private methods *****//

  this.init_ = function(appendTo, titleText, contentText) {
    appendTo.append(base);
    
    title.text(titleText);
    content.text(contentText);

    componentHandler.upgradeElement(confirm[0], 'MaterialButton');
    componentHandler.upgradeElement(cancel[0], 'MaterialButton');

    // This is used in IE. Chrome has support for Dialog, so doesn't need this polyfill.
    if (!base[0].showModal) {
      dialogPolyfill.registerDialog(base[0]);
    }
  };

  //***** public methods *****//

  /**
   * Displays the Dialog modally. This uses a Promise (https://www.npmjs.com/package/promise) to handle flow.
   * I doubt I'm using Promises properly here.
   *
   * @return {Promise} A promise that resolves when the user accepts.
   */
  this.show = function() {

    base[0].showModal();

    return new Promise(function(resolve, reject){
      cancel.off();
      confirm.off();

      cancel.on('click', function() {
        base[0].close();
        reject('Closing dialog.');
      });
      confirm.on('click', function() {
        base[0].close();
        resolve('Accepted');
      });
    });
  };

  this.init_(appendTo, titleText, contentText);
};

module.exports = Dialog;
