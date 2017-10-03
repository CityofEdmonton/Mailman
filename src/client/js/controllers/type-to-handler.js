var StandardMailHandler = require('./standard-mail-handler.js');
var DocumentMailHandler = require('./document-mail-handler.js');

module.exports = {
  'document': DocumentMailHandler,
  'email': StandardMailHandler
};
