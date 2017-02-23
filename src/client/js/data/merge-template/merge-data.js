


/**
 * Holds a merge template payload. This is just generic data used for merging. This could be To, Body, Subject (Email),
 * or some other data, like document title (for doc merge).
 * This Object is meant to be easily de/serializeable.
 *
 * @param {Object} config A configuration Object used for creating MergeData.
 * @param {string} config.type The type of the MergeData. These aren't stored anywhere special.
 * This can be used to assist in determining what type of MergeData this is.
 * @param {Object} config.data The data of this MergeData. (to, subject and body for email)
 * @param {string|undefined} config.title The title of this merge.
 * @param {string} config.sheet The Sheet name this merge pulls data from.
 * @param {string|undefined} config.headerRow The row to look for headers in. The merge starts in the next row.
 */
var MergeData = function(config) {

  var self = this;
  var type = config.type;
  var data = config.data;
  var sheet = config.sheet;
  var title = 'title';
  var headerRow = '1';
  var timestampColumn = '<<Mailman ' + type + ' Timestamp>>';

  //***** Private Methods *****//

  this.init_ = function(config) {
    if (config.type == null) {
      throw new Error('MergeData needs type.');
    }
    if (config.data == null) {
      throw new Error('MergeData needs data.');
    }
    if (config.sheet == null) {
      throw new Error('MergeData needs sheet.')
    }

    this.update(config);
  };

  //***** Public Methods *****//

  /**
   * Updates this MergeData. Note that you can not change the type.
   *
   * @param  {Object} config A configuration Object. The same as the one given to the constructor with 1 exception.
   * This function doesn't allow you to update the type.
   */
  this.update = function(config) {
    if (config.title != null) {
      title = config.title;
    }

    if (config.sheet != null) {
      sheet = config.sheet;
    }

    if (config.headerRow != null) {
      headerRow = config.headerRow;
    }

    if (config.data != null) {
      data = config.data;
    }
  };

  /**
   * Returns an easily serializeable form of this Object.
   *
   * @return {Object} A serializeable form of this MergeData. This is a valid config Object for a new MergeData.
   */
  this.toConfig = function() {
    return {
      type: type,
      data: data,
      title: title,
      sheet: sheet,
      headerRow: headerRow,
      timestampColumn: timestampColumn
    };
  };

  this.init_(config);
};


/** */
module.exports = MergeData;
