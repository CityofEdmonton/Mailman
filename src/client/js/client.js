var $ = require('jquery');
var MailMan = require('./mailman.js');
var Util = require('./util.js');
var LoadingScreen = require('./loading/loading-screen.js');

$(document).ready(function() {
  var body = $(document).find('[data-id="body"]');
  var ls = LoadingScreen;
  ls.init(body);
  ls.show();

  console.log('Loading screen');

  var mailman = new MailMan(body);
});
