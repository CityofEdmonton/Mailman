

var MetadataService = {
  getUser: function() {
    log('getting user: ');
    return Session.getEffectiveUser().getEmail();
  },

  getVersion: function() {
    return MAILMAN_VERSION;
  },

  getQuota: function() {
    return MailApp.getRemainingDailyQuota();
  }
};
