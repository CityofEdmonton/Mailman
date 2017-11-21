/**
 * This module exports the SheetsService object as a singleton.
 *
 * @author {@link https://github.com/dchenier|Dan Chenier}
 * @module
 */


var Provoke = require('../util/provoke.js');
var handlebars = require('handlebars');

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
    return Provoke('RenderService', 'getContext', sheetName, headerRowIndex); 
  };

  var preParseTemplateText = function(text) {
    var value = text;
    if (value && typeof value === "function") {
      value = value.replace(/&lt;&lt;|<<|&gt;&gt;|>>/gi, m => {
        switch (m.toUpperCase()) {
          case '<<': 
          case '&LT;&LT;': return '{{';
          case '>>':
          case '&GT;&GT;': return '}}';
        }
      });
    }
    return value;
  };


 //**** public functions ****//

 /**
  * Renders the specified content in the default context (active row)
  */
  this.render = function(content, sheetName, headerRowIndex) {
    return new Promise((resolve, reject) =>
    {
      var compiler = handlebars.compile;
      if (typeof compiler === "function") {
        console.log("1");
        getContext(sheetName, headerRowIndex).then(ctx => {
          console.log(ctx);
          var text = preParseTemplateText(content);
          console.log(text);
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
          console.log("2");
          reject({
            message: "Unable to get context to render",
            error: err
          });
        });
      } else {
        resolve(content); 
      }
    });
  }
  self.init_();
};

/** */
module.exports = RenderService;