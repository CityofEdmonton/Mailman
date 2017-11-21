var StandardMailHandler = require('./standard-mail-handler.js');
var DocumentMailHandler = require('./document-mail-handler.js');
var PreviewHandler = require('./preview-handler.js');

module.exports = {
  'document': DocumentMailHandler,
  'email': StandardMailHandler,
  'preview': PreviewHandler
};
