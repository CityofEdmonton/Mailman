var $ = require('jquery');
require('jquery-ui');
require('mdl');

var MailMan = require('./mailman.js');
var Util = require('./util/util.js');
var LoadingScreen = require('./views/loading/loading-screen.js');

$(document).ready(function() {
  var body = $(document).find('[data-id="body"]');
  var ls = LoadingScreen;
  ls.init(body);
  ls.show();

  var mailman = new MailMan(body);

  componentHandler.upgradeAllRegistered();
});
