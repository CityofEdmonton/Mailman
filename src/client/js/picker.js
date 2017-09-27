/**
 * This module exports the Picker object.
 *
 * @author {@link https://github.com/j-rewerts|Jared Rewerts}
 * @module
 */


var EventEmitter = require('./event-emitter/local-storage-emitter.js');
var DocumentService = require('./services/document-service.js');


/**
 * This handles the creation, serving and response of Drive files.
 *
 * @constructor
 */
var Picker = function(token) {

  var key = 'DOC_PICKER_RESPONSE';
  var DEVELOPER_KEY = 'TODO';
  var DIALOG_DIMENSIONS = {width: 600, height: 425};
  var emitter = new EventEmitter();

  //***** private methods *****//

  this.init_ = function(token) {
    var picker = new google.picker.PickerBuilder()
        // For other views, see https://developers.google.com/picker/docs/#otherviews
        .addView(google.picker.ViewId.DOCUMENTS)
        .enableFeature(google.picker.Feature.NAV_HIDDEN)
        .hideTitleBar()
        .setOAuthToken(token)
        .setDeveloperKey(DEVELOPER_KEY)
        .setCallback(pickerCallback)
        .setOrigin(google.script.host.origin)
        .setSize(DIALOG_DIMENSIONS.width - 2, DIALOG_DIMENSIONS.height - 2)
        .build();
    picker.setVisible(true);
  };

  /**
   * A callback function that extracts the chosen document's metadata from the
   * response object. For details on the response object, see
   * https://developers.google.com/picker/docs/result
   *
   * @param {object} data The response object.
   */
  function pickerCallback(data) {
    var action = data[google.picker.Response.ACTION];
    if (action == google.picker.Action.PICKED) {
      var doc = data[google.picker.Response.DOCUMENTS][0];
      var id = doc[google.picker.Document.ID];
      var url = doc[google.picker.Document.URL];
      var title = doc[google.picker.Document.NAME];
      var iconURL = doc[google.picker.Document.ICON_URL];
      var thumbnails = doc[google.picker.Document.THUMBNAILS];
      var embedURL = doc[google.picker.Document.EMBEDDABLE_URL];

      DocumentService.getThumbnail(id).then((thumbnail) => {
        emitter.emit(key, {id, url, title, iconURL, thumbnails, embedURL, thumbnail});
        google.script.host.close();
      });
    } else if (action == google.picker.Action.CANCEL) {
      console.log('Cancelled document selection.');
      google.script.host.close();
    }
  }

  //***** public methods *****//

  this.init_(token);
};


window.Picker = Picker;
/** */
module.exports = Picker;
