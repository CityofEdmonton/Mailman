var Provoke = require('../util/provoke.js');
var Promise = require('promise');



/**
 * The MetadataService provides data services relating to this programs information. It also provides basic caching
 * to speed up future queries. As an example, getting the active user is only ever done once (the first time).
 *
 */
var MetadataService = function() {
  var user;
  var version;
  var quota;
  var resetInterval = 30000;

  this.init_ = function() {
    window.setInterval(resetCache, resetInterval);
  };

  this.getUser = function() {
    if (user == null) {
      user = Provoke('MetadataService', 'getUser').then();
    }

    return user;
  };

  this.getVersion = function() {
    if (version == null) {
      version = Provoke('MetadataService', 'getVersion');
    }

    return version;
  };

  this.getQuota = function() {
    if (quota == null) {
      quota = Provoke('MetadataService', 'getQuota');
    }

    return quota;
  };

  var resetCache = function() {
    quota = null;
  };

  this.init_();
};


/** */
module.exports = new MetadataService();
