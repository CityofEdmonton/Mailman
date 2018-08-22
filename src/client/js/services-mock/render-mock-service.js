/**
 * This module exports the SheetsService object as a singleton.
 *
 * @author {@link https://github.com/dchenier|Dan Chenier}
 * @module
 */


var Provoke = require('../util/provoke.js');
var handlebars = require('handlebars/runtime');

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

 //**** public functions ****//

 /**
  * Renders the specified content in the default context (active row)
  */
  this.render = function(content) {
    var text = content;
    var context = { Name: "User 1", Email: "test.user@nowhere.com" };
    if (handlebars.compile) {
      var template = handlebars.compile(text);
      if (typeof template === "function")
        text = template(context);
    }
    return text;
  }

};


/**
 * This module exports the SheetsService object as a singleton.
 *
 * @author {@link https://github.com/dchenier|Dan Chenier}
 * @module
 */


var Provoke = require('../util/provoke.js');
var handlebars = require('handlebars/runtime');

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

  //**** public functions ****//

 /**
  * Renders the specified content in the default context (active row)
  */
  this.render = function(content) {
    return new Promise((resolve, reject) =>
    {
      var compiler = handlebars.compile;
      if (typeof compiler === "function") {
        getContext().then(ctx => {
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
  }
  self.init_();
};



/** */
module.exports = RenderService;