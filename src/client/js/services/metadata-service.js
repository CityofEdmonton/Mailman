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

  this.getUser = function() {
    if (user == null) {
      return Provoke('MetadataService', 'getUser');
    }
    else {
      return new Promise(resolve, reject) {
        resolve(user);
      };
    }
  };

  this.getVersion = function() {
    if (user == null) {
      return Provoke('MetadataService', 'getVersion');
    }
    else {
      return new Promise(resolve, reject) {
        resolve(version);
      };
    }
  };
};

module.exports = new MetadataService();
