

var MetadataService = {
  getUser: function() {
    Session.getEffectiveUser().getEmail();
  },

  getVersion: function() {
    return MAILMAN_VERSION;
  },

  getQuota: function() {
    
  }
};
