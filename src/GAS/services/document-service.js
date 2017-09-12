/**
 * @file A service focused on reading Google Docs as HTML.
 * @author {@link https://github.com/j-rewerts|Jared Rewerts}
 */

/**
 * This service handles reading Google Docs.
 *
 * @type {Object}
 */
var DocumentService = {
  openedDocuments: {},

  /**
   * Gets a Google Doc as HTML. Before opening the document, it checks a cache to save time.
   * @param {string} id The id of the Document.
   * @return {string} An HTML string that may include merge tags.
   */
  getDocumentAsHTML: function(id) {
    if (openedDocuments[id]) {
      return openedDocuments[id];
    }

    // Get as HTML
  },
};
