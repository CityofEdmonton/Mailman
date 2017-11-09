/**
 * This module exports the MetadataService object.
 *
 * @author {@link https://github.com/j-rewerts|Jared Rewerts}
 * @module
 */


var Provoke = require('../util/provoke.js');
var Promise = require('promise');



/**
 * The MetadataService provides data services relating to this programs information. It also provides basic caching
 * to speed up future queries. As an example, getting the active user is only ever done once (the first time).
 * The email quota has a 30 second refresh period. If a request is made after a certain point, it repulls the quota.
 *
 * @constructor
 */
var MetadataService = function() {
  var user;
  var version;
  var quota;
  var resetInterval = 30000;

  this.init_ = function() {
    window.setInterval(resetCache, resetInterval);
  };

  /**
   * Gets the active user.
   *
   * @return {Promise} A Promise.
   */
  this.getUser = function() {
    if (user == null) {
      user = Provoke('MetadataService', 'getUser').then();
    }

    return user;
  };

  /**
   * Gets the currently executing version of Mailman.
   *
   * @return {Promise} A Promise.
   */
  this.getVersion = function() {
    if (version == null) {
      version = Provoke('MetadataService', 'getVersion');
    }

    return version;
  };

  /**
   * Gets the remaining quota for the active user.
   *
   * @return {Promise} A Promise.
   */
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
module.exports = MetadataService;
