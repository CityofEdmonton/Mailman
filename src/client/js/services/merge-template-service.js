var Provoke = require('../util/provoke.js');
var Promise = require('promise');



var MergeTemplateService = function() {

  //***** private methods *****//


  //***** public methods *****//

  this.create = function(template) {
    return Provoke('MergeTemplateService', 'create', template.toConfig());
  };

  this.getAll = function() {
    return Provoke('MergeTemplateService', 'getAll');
  };

  this.getOne = function(id) {
    return Provoke('MergeTemplateService', 'getByID', id);
  };

  this.update = function(template) {
    return Provoke('MergeTemplateService', 'update', template.toConfig());
  };

  this.delete = function(template) {
    return Provoke('MergeTemplateService', 'deleteByID', template.getID());
  };

  this.getRepeat = function() {
    return Provoke('MergeTemplateService', 'getRepeatConfig');
  };

  this.removeRepeat = function(template) {
    return Provoke('MergeTemplateService', 'removeRepeatMerge', template.toConfig());
  };
};


module.exports = MergeTemplateService;
