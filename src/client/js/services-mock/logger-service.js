
var Provoke = require('../util/provoke.js');

// this class in lowercased to be consistent with server side logging
var Logger = function() {

    var self = this; 

    this.fatal = function() {
        console.error.apply(console, arguments);
    };

    this.error = function() {
        console.error.apply(console, arguments);
    };

    this.warn = function() {
        console.warn.apply(console, arguments);
    };

    this.info = function() {
        console.info.apply(console, arguments);
    };

    this.debug = function() {
        console.debug.apply(console, arguments);
    };

    this.verbose = function() {
        console.debug.apply(console, arguments);
    };

  };
  
  
  /** */
  module.exports = new Logger();
