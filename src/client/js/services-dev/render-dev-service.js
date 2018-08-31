/**
 * This module exports the SheetsService object as a singleton.
 *
 * @author {@link https://github.com/dchenier|Dan Chenier}
 * @module
 */


var Provoke = require('../util/provoke.js');
var gOAuthService = require('./google-oauth-service');
var sheetsService = new (require('./sheets-dev-service'))();
var headerService = new (require('./header-dev-service'))();

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

  var getContext = function(sheetName, headerRowIndex) {
    var sheet = "Data"; // we'll always use the sheet name "Data" in our dev service
    var row = 2; // we'll just always get our data from row 2 in our dev service
    if (!headerRowIndex) {
      headerRowIndex = 1;      
    } 
    return new Promise(function(resolve, reject) {
      sheetsService.getTestSheetId().then(function(sheetId) {
        gOAuthService.getSheetsApi().then(function(sheets) {
          // sheets is a v4 Google API thing: https://developers.google.com/sheets/api/quickstart/js
          var range = sheet + "!A" + row + ":AZ" + row; 
          sheets.spreadsheets.values.get({
            spreadsheetId: sheetId,
            range:range
          }).then(function(response) {   
            var values = response.result.values;
            if (values && values.length > 0 && values[0].length > 0) {
              // transfor the array into key:value pairs
              headerService.get(sheet, headerRowIndex).then(keys => {
                var returnValue = {};
                for (var i=0; i<keys.length; i++) {
                  if (i < values[0].length) {
                    returnValue[keys[i]] = values[0][i];
                  }
                }
                resolve(returnValue);
              }, headerGetError => {
                reject({
                  message: "Unable to get header values",
                  error: headerGetError
                })
              });
            } else 
              resolve({});
          }, function(getValuesError) {
            reject({
              message: "Unable to read sheet at row " + row,
              error: getValuesError
            });
          });
          
        }, function(getSheetApiError) {
          reject({
            message: "Unable to get sheets API",
            error: getSheetApiError
          })
        });
      }, function(getTestSheetIdError) {
        reject({
          message: "Unable to get test sheet id",
          error: getTestSheetIdError
        })
      });
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
      if (m1) {
        // remove leading and trailing whitespace, including &nbsp;
        m1 = m1.replace('&nbsp;', ' ').replace(/^\s+|\s+$/g, '');
        if (headerToData[m1]) {
          return headerToData[m1];
        }
      }
      if (m2) {
        // remove leading and trailing whitespace, including &nbsp;
        m2 = m2.replace('&nbsp;', ' ').replace(/^\s+|\s+$/g, '');
        if (headerToData[m2]) {
          return headerToData[m2];
        }
      }
      return '';
    });

    return dataText;
  }

 //**** public functions ****//

 /**
  * Renders the specified content in the default context (active row)
  */
  this.render = function(content, sheetName, headerRowIndex) {
    return new Promise((resolve, reject) =>
    {
      getContext(sheetName, headerRowIndex).then(ctx => {       
        resolve(replaceTags(content, ctx));
      }, err => {
        reject({
          message: "Unable to get context to render",
          error: err
        });
      });
    });
  };

  /**
   * Renders all of a mergeTemplate
   * @param {*} mergeTemplate 
   */
  this.renderTemplate = function(mergeTemplate) {
    return new Promise((resolve, reject) => {
      resolve({
        to: "",
        cc: "",
        bcc: "",
        subject: "",
        body: "",
       });
    });    
  };



  self.init_();
};


/** */
module.exports = RenderService;