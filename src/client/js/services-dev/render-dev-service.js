/**
 * This module exports the SheetsService object as a singleton.
 *
 * @author {@link https://github.com/dchenier|Dan Chenier}
 * @module
 */


var Provoke = require('../util/provoke.js');
var handlebars = require('handlebars');
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

 //**** public functions ****//

 /**
  * Renders the specified content in the default context (active row)
  */
  this.render = function(content, sheetName, headerRowIndex) {
    return new Promise((resolve, reject) =>
    {
      var compiler = handlebars.compile;
      if (typeof compiler === "function") {
        getContext(sheetName, headerRowIndex).then(ctx => {
          var text = content;
          try {
            var template = compiler(text);
            if (typeof template === "function")
              text = template(ctx);         
            resolve(text);
          }
          catch (ex) {
            reject({
              message: "Error rendering content",
              error: ex
            });
          }
        }, err => {
          reject({
            message: "Unable to get context to render",
            error: err
          });
        });
      } else {
        resolve(content); 
      }
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