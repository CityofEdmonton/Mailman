
var Provoke = require('../util/provoke.js');

// this class in lowercased to be consistent with server side logging
var Logger = function() {

    var self = this;

    var buildArgs = function(severity, e) {
        var args = ['LoggerService', severity];
        for (var i=0;i<e.length; i++) {
            args.push(e[i]);
        }
        return args;
    }
  

    this.fatal = function() {
        // ensure the promise is executed at least once
        return Provoke.apply(this, buildArgs('fatal', arguments)).then(function() { 
            /* do nothing */ 
        }, 
        function(e) { console.error('error calling server side logger.fatal', e) });
    };

    this.error = function() {
        // ensure the promise is executed at least once
        return Provoke.apply(this, buildArgs('error', arguments)).then(function() { 
            /* do nothing */ 
        }, 
        function(e) { console.error('error calling server side logger.error', e) });
    };

    this.warn = function() {
        // ensure the promise is executed at least once
        return Provoke.apply(this, buildArgs('warn', arguments)).then(function() { 
            /* do nothing */ 
        }, 
        function(e) { console.error('error calling server side logger.warn', e) });
    };

    this.info = function() {
        // ensure the promise is executed at least once
        return Provoke.apply(this, buildArgs('info', arguments)).then(function() { 
            /* do nothing */ 
        }, 
        function(e) { console.error('error calling server side logger.info', e) });
    };

    this.debug = function() {
        // ensure the promise is executed at least once
        return Provoke.apply(this, buildArgs('debug', arguments)).then(function() { 
            /* do nothing */ 
        }, 
        function(e) { console.error('error calling server side logger.debug', e) });
    };

    this.verbose = function() {
        // ensure the promise is executed at least once
        return Provoke.apply(this, buildArgs('verbose', arguments)).then(function() { 
            /* do nothing */ 
        }, 
        function(e) { console.error('error calling server side logger.verbose', e) });
    };

  

  };
  
  
  /** */
  module.exports = new Logger();
