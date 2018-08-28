/**
 * This module exports the RenderService object as a singleton.
 *
 * @author {@link https://github.com/dchenier|Dan Chenier}
 * @module
 */


var Provoke = require('../util/provoke.js');

/**
* Handles operations related to getting rendering templates.
*
* @constructor
*/
var RenderService = function() {

  var self = this;

  //**** private functions ****//

  this.init_ = function() {

  };

  var getContext = function() {
    // Mock data is pretty simple
    return new Promise(function(resolve, reject) {
      resolve({ Name: "User 1", Email: "test.user@nowhere.com" });
    });    
  }

  /**
   * This function replaces  all instances of <<tags>> with the data in headerToData.
   *
   * @param {string} text The string that contains the tags.
   * @param {Object} headerToData A key-value pair where the key is a column name and the value is the data in the
   * column.
   * @return {string} The text with all tags replaced with data.
   */
  var replaceTags = function(text, headerToData) {
    if (text == null) {
      text = '';
    }

    // This must match <<these>> and &lt;&lt;these&gt;&gt; since we need to support HTML.
    var dataText = text.replace(/<<(.*?)>>|&lt;&lt;(.*?)&gt;&gt;/g, function(match, m1, m2, offset, string) {
      if (m1 && headerToData[m1]) {
        return headerToData[m1];
      }
      else if (m2 && headerToData[m2]) {
        return headerToData[m2];
      }
      return '';
    });

    return dataText;
  }


  //**** public functions ****//

 /**
  * Renders the specified content in the default context (active row)
  */
  this.render = function(content) {
    return new Promise((resolve, reject) =>
    {

      getContext().then(ctx => {
        resolve(replaceTags(context, ctx));
      }, err => {
        reject({
          message: "Unable to get context to render",
          error: err
        });
      });

    });
  }
  self.init_();
};



/** */
module.exports = RenderService;