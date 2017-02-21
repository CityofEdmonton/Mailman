var MergeRepeater = require('./merge-repeater.js');

var MergeTemplate = function(config) {

  var repeater;

  //***** Private Methods *****//
  this.init_ = function(config) {

    if (config.mergeRepeater !== null) {
      repeater = new MergeRepeater(config.mergeRepeater)
    }
  };

  //***** Public Methods *****//

  /**
   * Converts this object into an easily serializeable form.
   *
   * @returns {Object} An Object containing all the data needed to recreate this Object.
   */
  this.toConfig = function() {
    var mRep;
    if (repeater !== undefined) {
      mRep = repeater.toConfig();
    }

    return {
      mergeRepeater: mRep
    };
  };


this.init_(config);
};


/** */
module.exports = MergeTemplate;
