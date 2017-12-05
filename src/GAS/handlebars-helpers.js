/**
 * @file Helpers for the handlebarsjs templating engine
 * based on handlebars-helpers 
 * https://github.com/helpers/handlebars-helpers
 *
 * @author {@link https://github.com/dchenier|Dan chenier}
 */

function registerHandlebarsHelpers(handlebars) {
  var util = {};
  
  /**
   * Returns true if the given value is an object.
   * @param {Object} `val`
   */
  util.isObject = function(val) {
    return typeof (val) === 'object';
  };

  /**
   * Returns true if the given value is a handlebar `options` object.
   * @param {Object} `val` 
   * @return {Boolean}
   */
  util.isOptions = function(val) {
    return util.isObject(val) && util.isObject(val.hash);
  };

  /**
   *  Returns true if a helper is a block helper.
   */
  util.isBlock = function(options) {
    return util.isOptions(options)
      && typeof options.fn === 'function'
      && typeof options.inverse === 'function';
  };

  /**
   * Returns the given value or renders the block if it's a block helper.
   */
  util.fn = function(val, context, options) {
    if (util.isOptions(val)) {
      return util.fn('', val, options);
    }
    if (util.isOptions(context)) {
      return util.fn(val, {}, context);
    }
    return util.isBlock(options) ? options.fn(context) : val;
  };  

  /**
   * Returns the given value or renders the inverse block if it's a block helper.
   */
  util.inverse = function(val, context, options) {
    if (util.isOptions(val)) {
      return util.identity('', val, options);
    }
    if (util.isOptions(context)) {
      return util.inverse(val, {}, context);
    }
    return util.isBlock(options) ? options.inverse(context) : val;
  };

  /**
   * Gets the return value for a helper
   */
  util.value = function(val, context, options) {
    if (util.isOptions(val)) {
      return util.value(null, val, options);
    }
    if (util.isOptions(context)) {
      return util.value(val, {}, context);
    }
    if (util.isBlock(options)) {
      return !!val ? options.fn(context) : options.inverse(context);
    }
    return val;
  };

  /**
   * Returns the given value as-is, unchanged.
   */
  util.identity = function(val) {
    return val;
  };

  /**
   * Return true if `val` is a non-empty string.
   * @param {*} val 
   */
  util.isString = function(val) {
    return typeof val === 'string' && val !== '';
  };

  util.isUndefined = function(val) {
    return val == null || (util.isOptions(val) && val.hash != null);
  };  

  util.isNumber = function(num) {
    //is-number <https://github.com/jonschlinkert/is-number>
    var type = typeof num;

    if (type === 'string' || num instanceof String) {
      // an empty string would be coerced to true with the below logic
      if (!num.trim()) return false;
    } else if (type !== 'number' && !(num instanceof Number)) {
      return false;
    }

    return (num - num + 1) >= 0;
  };

  util.contains = function(val, obj, start) {
    if (val == null || obj == null || !util.isNumber(val.length)) {
      return false;
    }
    return val.indexOf(obj, start) !== -1;
  };

  var falseyKeywords = ['none', 'nil', 'nope', 'no', 'nada', '0', 'false'];
  function arrayify(val) {
    return Array.isArray(val) ? val : [val];
  }

  util.falsey = function(val, keywords) {
    // based on https://github.com/jonschlinkert/falsey
    if (!val) 
      return true;
    
    if (Array.isArray(val) || typeof (val) === 'arguments') {
      return !val.length;
    }

    if (typeof (val) === 'object') {
      return !Object.keys(val).length;
    }
    
    var arr = !keywords
      ? falseyKeywords
      : arrayify(keywords);
  
    return arr.indexOf(val.toLowerCase ? val.toLowerCase() : val) !== -1;
  };

  util.isOdd = function(i) {
    if (!util.isNumber(i)) {
      throw new TypeError('is-odd expects a number.');
    }
    if (Number(i) !== Math.floor(i)) {
      throw new RangeError('is-odd expects an integer.');
    }
    return !!(~~i & 1);
  };

  util.isEven = function(i) {
    return !util.isOdd(i);
  };

  function isObject(val) {
    return val !== null && (typeof val === 'object' || typeof val === 'function');
  }
  
  function toString(val) {
    if (!val) return '';
    if (Array.isArray(val)) {
      return val.join('.');
    }
    return val;
  }

  // get-value <https://github.com/jonschlinkert/get-value>
  util.get = function(obj, prop, a, b, c) {
    if (!isObject(obj) || !prop) {
      return obj;
    }
  
    prop = toString(prop);
  
    // allowing for multiple properties to be passed as
    // a string or array, but much faster (3-4x) than doing
    // `[].slice.call(arguments)`
    if (a) prop += '.' + toString(a);
    if (b) prop += '.' + toString(b);
    if (c) prop += '.' + toString(c);
  
    if (prop in obj) {
      return obj[prop];
    }
  
    var segs = prop.split('.');
    var len = segs.length;
    var i = -1;
  
    while (obj && (++i < len)) {
      var key = segs[i];
      while (key[key.length - 1] === '\\') {
        key = key.slice(0, -1) + '.' + segs[++i];
      }
      obj = obj[key];
    }
    return obj;
  };

  function extend(obj /* , ...source */) {
    for (var i = 1; i < arguments.length; i++) {
      for (var key in arguments[i]) {
        if (Object.prototype.hasOwnProperty.call(arguments[i], key)) {
          obj[key] = arguments[i][key];
        }
      }
    }
  
    return obj;
  };

  util.createFrame = function(object) {
    var frame = extend({}, object);
    frame._parent = object;
    return frame;
  };

  util.indexOf = function(array, value) {
    for (var i = 0, len = array.length; i < len; i++) {
      if (array[i] === value) {
        return i;
      }
    }
    return -1;
  };

  util.result = function(val) {
    if (typeof val === 'function') {
      return val.apply(this, [].slice.call(arguments, 1));
    }
    return val;
  };

  var sortBy = {
    defaultCompare: function(a, b, prop) {
      if (prop != null && typeof (prop) !== 'string') {
        throw new TypeError('expected "prop" to be undefined or a string');
      }
    
      var typeA = typeof(a);
      var typeB = typeof(b);
    
      if (prop) {
        if (typeA === 'object') {
          a = a[prop];
          typeA = typeof(a);
        }
        if (typeB === 'object') {
          b = b[prop];
          typeB = typeof(b);
        }
      }
    
      if (typeA === 'null') {
        return typeB === 'null' ? 0 : (typeB === 'undefined' ? -1 : 1);
      } else if (typeA === 'undefined') {
        return typeB === 'null' ? 1 : (typeB === 'undefined' ? 0 : 1);
      } else if (typeB === 'null' || typeB === 'undefined') {
        return -1;
      } else {
        return a < b ? -1 : (a > b ? 1 : 0);
      }
    },
    compare: function(prop, a, b) {
      if (typeof prop === 'function') {
        // expose `compare` to custom function
        return prop(a, b, compare.bind(null, null));
      }
      // compare object values
      if (prop && typeof a === 'object' && typeof b === 'object') {
        return sortBy.compare(null, util.get(a, prop), util.get(b, prop));
      }
      return sortBy.defaultCompare(a, b);
    },
    flatten: function(arr) {
      return [].concat.apply([], arr);
    }, 
    sortBy: function(props, opts) {
      opts = opts || {};
      
      return function compareFn(a, b) {
        var len = props.length, i = -1;
        var result;
    
        while (++i < len) {
          result = sortBy.compare(props[i], a, b);
          if (result !== 0) {
            break;
          }
        }
        if (opts.reverse === true) {
          return result * -1;
        }
        return result;
      };
    }
  }

  util.sortBy = function(arr, props, opts) {
    if (arr == null) {
      return [];
    }
  
    if (!Array.isArray(arr)) {
      throw new TypeError('array-sort expects an array.');
    }
  
    if (arguments.length === 1) {
      return arr.sort();
    }
  
    var args = sortBy.flatten([].slice.call(arguments, 1));
  
    // if the last argument appears to be a plain object,
    // it's not a valid `compare` arg, so it must be options.
    if (typeof (args[args.length - 1]) === 'object') {
      opts = args.pop();
    }
    return arr.sort(sortBy.sortBy(args, opts));
  };

  /**
   * Remove leading and trailing whitespace and non-word
   * characters from the given string.
   */
  util.chop = function(str) {
    if (!util.isString(str)) return '';
    var re = /^[-_.\W\s]+|[-_.\W\s]+$/g;
    return str.trim().replace(re, '');
  };

  /**
   * Change casing on the given `string`, optionally
   * passing a delimiter to use between words in the
   * returned string.
   */
  util.changecase = function(str, fn) {
    if (!util.isString(str)) return '';
    if (str.length === 1) {
      return str.toLowerCase();
    }
  
    str = util.chop(str).toLowerCase();
    if (typeof fn !== 'function') {
      fn = util.identity;
    }
  
    var re = /[-_.\W\s]+(\w|$)/g;
    return str.replace(re, function(_, ch) {
      return fn(ch);
    });
  }


  /**
   * range - gets a range of data from the current active Google Sheet
   */
  Handlebars.registerHelper('range', function(innerContext, innerOptions) {
    var sheet, range;
    if (innerContext && typeof innerContext.indexOf === 'function' && innerContext.indexOf('!') > 0) {
      sheet = Utility.getSpreadsheet().getSheetByName(innerContext.substring(0, innerContext.indexOf('!')));
      range = innerContext.substring(innerContext.indexOf('!')+1);
    }
    else {
      sheet = SpreadsheetApp.getActive().getActiveSheet();
      range = innerContext;
    }
    
    var rangeObj = sheet.getRange ? sheet.getRange(range) : {};
    var rangeValues = rangeObj.getDisplayValues ? rangeObj.getDisplayValues() : {};
    
    var ret = "", data;
    
    if (innerOptions.data) {
      data = Handlebars.createFrame(innerOptions.data);
    }
          
    for(var i=0, j=rangeValues.length; i<j; i++) {
      if (data) {
        data.row = rangeValues[i];
      }
      ret = ret + innerOptions.fn(rangeValues[i], { data: data });
    }
    
    return ret;
  });


  // -------------------------------------------------------------------
  // BEGIN Comparison helpers
  // -------------------------------------------------------------------
  /**
   * and - Helper that renders the block if **both** of the given values
   * are truthy
   */
  Handlebars.registerHelper('and', function() {
    var len = arguments.length - 1;
    var options = arguments[len];
    var val = true;
  
    for (var i = 0; i < len; i++) {
      if (!arguments[i]) {
        val = false;
        break;
      }
    }
  
    return util.value(val, this, options);
  });

  Handlebars.registerHelper('compare', function(a, operator, b, options) {
    if (arguments.length < 4) {
      throw new Error('handlebars Helper {{compare}} expects 4 arguments');
    }
  
    var result;
    switch (operator) {
      case '==':
        result = a == b;
        break;
      case '===':
        result = a === b;
        break;
      case '!=':
        result = a != b;
        break;
      case '!==':
        result = a !== b;
        break;
      case '<':
        result = a < b;
        break;
      case '>':
        result = a > b;
        break;
      case '<=':
        result = a <= b;
        break;
      case '>=':
        result = a >= b;
        break;
      case 'typeof':
        result = typeof a === b;
        break;
      default: {
        throw new Error('helper {{compare}}: invalid operator: `' + operator + '`');
      }
    }
  
    return util.value(result, this, options);
  });

  Handlebars.registerHelper('contains', function(collection, value, startIndex, options) {
    if (typeof startIndex === 'object') {
      options = startIndex;
      startIndex = undefined;
    }
    var val = util.contains(collection, value, startIndex);
    return util.value(val, this, options);
  });

  Handlebars.registerHelper('default', function() {
    for (var i = 0; i < arguments.length - 1; i++) {
      if (arguments[i] != null) return arguments[i];
    }
    return '';
  });

  Handlebars.registerHelper('eq', function(a, b, options) {
    if (arguments.length === 2) {
      options = b;
      b = options.hash.compare;
    }
    return util.value(a === b, this, options);    
  });  

  Handlebars.registerHelper('gt', function(a, b, options) {
    if (arguments.length === 2) {
      options = b;
      b = options.hash.compare;
    }
    return util.value(a > b, this, options);    
  });  

  Handlebars.registerHelper('gte', function(a, b, options) {
    if (arguments.length === 2) {
      options = b;
      b = options.hash.compare;
    }
    return util.value(a >= b, this, options);    
  });  

  Handlebars.registerHelper('has', function(value, pattern, options) {
    if (util.isOptions(value)) {
      options = value;
      pattern = null;
      value = null;
    }
  
    if (util.isOptions(pattern)) {
      options = pattern;
      pattern = null;
    }
  
    if (value === null) {
      return util.value(false, this, options);
    }
  
    if (arguments.length === 2) {
      return util.value(has(this, value), this, options);
    }
  
    if ((Array.isArray(value) || util.isString(value)) && util.isString(pattern)) {
      if (value.indexOf(pattern) > -1) {
        return util.fn(true, this, options);
      }
    }
    if (util.isObject(value) && util.isString(pattern) && pattern in value) {
      return util.fn(true, this, options);
    }
    return util.inverse(false, this, options);    
  });  

  Handlebars.registerHelper('isFalsey', function(val, options) {
    return util.value(util.falsey(val), this, options);
  });  

  Handlebars.registerHelper('isTruthy', function(val, options) {
    return util.value(!util.falsey(val), this, options);
  });  

  Handlebars.registerHelper('ifEven', function() {
    return util.value(util.isEven(num), this, options);
  });  

  Handlebars.registerHelper('ifNth', function() {
    var isNth = util.isNumber(a) && util.isNumber(b) && b % a === 0;
    return util.value(isNth, this, options);    
  }); 
  
  Handlebars.registerHelper('ifOdd', function(val, options) {
    return util.value(util.isOdd(val), this, options);
  }); 
  
  Handlebars.registerHelper('is', function(a, b, options) {
    if (arguments.length === 2) {
      options = b;
      b = options.hash.compare;
    }
    return util.value(a == b, this, options);    
  }); 
  
  Handlebars.registerHelper('isnt', function(a, b, options) {
    if (arguments.length === 2) {
      options = b;
      b = options.hash.compare;
    }
    return util.value(a != b, this, options);    
  }); 
  
  Handlebars.registerHelper('lt', function(a, b, options) {
    if (arguments.length === 2) {
      options = b;
      b = options.hash.compare;
    }
    return util.value(a < b, this, options);    
  });
  
  Handlebars.registerHelper('lte', function(a, b, options) {
    if (arguments.length === 2) {
      options = b;
      b = options.hash.compare;
    }
    return util.value(a <= b, this, options);    
  });
  
  Handlebars.registerHelper('neither', function(a, b, options) {
    return util.value(!a && !b, this, options);
  });
  
  Handlebars.registerHelper('not', function(val, options) {
    return util.value(!val, this, options);
  });
  
  Handlebars.registerHelper('or', function() {
    var len = arguments.length - 1;
    var options = arguments[len];
    var val = false;
  
    for (var i = 0; i < len; i++) {
      if (arguments[i]) {
        val = true;
        break;
      }
    }
    return util.value(val, this, options);
  });
  
  Handlebars.registerHelper('unlessEq', function(a, b, options) {
    if (util.isOptions(b)) {
      options = b;
      b = options.hash.compare;
    }
    return util.value(a !== b, this, options);    
  }); 
  
  Handlebars.registerHelper('unlessGt', function(a, b, options) {
    if (util.isOptions(b)) {
      options = b;
      b = options.hash.compare;
    }
    return util.value(a <= b, this, options);    
  }); 
  
  Handlebars.registerHelper('unlessLt', function(a, b, options) {
    if (util.isOptions(b)) {
      options = b;
      b = options.hash.compare;
    }
    return util.value(a >= b, this, options);    
  }); 
  
  Handlebars.registerHelper('unlessGteq', function(a, b, options) {
    if (util.isOptions(b)) {
      options = b;
      b = options.hash.compare;
    }
    return util.value(a < b, this, options);    
  }); 
  
  Handlebars.registerHelper('unlessLteq', function(a, b, options) {
    if (util.isOptions(b)) {
      options = b;
      b = options.hash.compare;
    }
    return util.value(a > b, this, options);    
  });
             
  // -------------------------------------------------------------------
  // END Comparison helpers
  // -------------------------------------------------------------------

  // -------------------------------------------------------------------
  // BEGIN Array helpers
  // -------------------------------------------------------------------  
  Handlebars.registerHelper('after', function(array, n) {
    if (util.isUndefined(array)) return '';
      return array.slice(n);    
  });

  Handlebars.registerHelper('arrayify', function(value) {
    return value ? (Array.isArray(value) ? value : [value]) : [];
  });

  Handlebars.registerHelper('before', function(array, n) {
    if (util.isUndefined(array)) return '';
      return array.slice(0, -n);    
  });

  Handlebars.registerHelper('eachIndex', function(array, options) {
    var result = '';
    for (var i = 0; i < array.length; i++) {
      result += options.fn({item: array[i], index: i});
    }
    return result;    
  });

  Handlebars.registerHelper('filter', function(array, value, options) {
    var content = '';
    var results = [];
  
    // filter on a specific property
    var prop = options.hash && (options.hash.property || options.hash.prop);
    if (prop) {
      results = array.filter(function(val) {
        return value === util.get(val, prop);
      });
    } else {
  
      // filter on a string value
      results = array.filter(function(v) {
        return value === v;
      });
    }
  
    if (results && results.length > 0) {
      for (var i = 0; i < results.length; i++) {
        content += options.fn(results[i]);
      }
      return content;
    }
    return options.inverse(this);    
  });

  Handlebars.registerHelper('first', function(array, n) {
    if (util.isUndefined(array)) return '';
    if (!util.isNumber(n)) {
      return array[0];
    }
    return array.slice(0, n);    
  });

  Handlebars.registerHelper('forEach', function(array, options) {
    var data = util.createFrame(options, options.hash);
    var len = array.length;
    var buffer = '';
    var i = -1;
  
    while (++i < len) {
      var item = array[i];
      data.index = i;
      item.index = i + 1;
      item.total = len;
      item.isFirst = i === 0;
      item.isLast = i === (len - 1);
      buffer += options.fn(item, {data: data});
    }
    return buffer;
  });

  Handlebars.registerHelper('inArray', function(array, value, options) {
    return util.value(util.indexOf(array, value) > -1, this, options);
  });

  Handlebars.registerHelper('isArray', function(value) {
    return Array.isArray(value);
  });

  Handlebars.registerHelper('itemAt', function(array, idx) {
    array = util.result(array);
    if (Array.isArray(array)) {
      idx = util.isNumber(idx) ? +idx : 0;
      if (idx < 0) {
        return array[array.length + idx];
      }
      if (idx < array.length) {
        return array[idx];
      }
    }
  });

  Handlebars.registerHelper('join', function(array, separator) {
    if (typeof array === 'string') return array;
    if (!Array.isArray(array)) return '';
    separator = util.isString(separator) ? separator : ', ';
    return array.join(separator);
  });

  Handlebars.registerHelper('equalsLength', function(value, length, options) {
    if (util.isOptions(length)) {
      options = length;
      length = 0;
    }
  
    var len = 0;
    if (typeof value === 'string' || Array.isArray(value)) {
      len = value.length;
    }
  
    return util.value(len === length, this, options);
  });

  Handlebars.registerHelper('last', function(value, n) {
    if (!Array.isArray(value) && typeof value !== 'string') {
      return '';
    }
    if (!util.isNumber(n)) {
      return value[value.length - 1];
    }
    return value.slice(-Math.abs(n));
  });

  Handlebars.registerHelper('length', function(value) {
    if (util.isObject(value) && !util.isOptions(value)) {
      value = Object.keys(value);
    }
    if (typeof value === 'string' || Array.isArray(value)) {
      return value.length;
    }
    return 0;    
  });

  Handlebars.registerHelper('map', function(array, iter) {
    if (!Array.isArray(array)) return '';
    var len = array.length;
    var res = new Array(len);
    var i = -1;
  
    if (typeof iter !== 'function') {
      return array;
    }
  
    while (++i < len) {
      res[i] = iter(array[i], i, array);
    }
    return res;
  });

  Handlebars.registerHelper('pluck', function(arr, prop) {
    if (util.isUndefined(arr)) return '';
    var res = [];
    for (var i = 0; i < arr.length; i++) {
      var val = util.get(arr[i], prop);
      if (typeof val !== 'undefined') {
        res.push(val);
      }
    }
    return res;
  });

  Handlebars.registerHelper('reverse', function(val) {
    if (Array.isArray(val)) {
      val.reverse();
      return val;
    }
    if (val && typeof val === 'string') {
      return val.split('').reverse().join('');
    }
  });

  Handlebars.registerHelper('some', function(array, iter, options) {
    if (Array.isArray(array)) {
      for (var i = 0; i < array.length; i++) {
        if (iter(array[i], i, array)) {
          return options.fn(this);
        }
      }
    }
    return options.inverse(this);
  });

  Handlebars.registerHelper('sort', function(array, options) {
    if (!Array.isArray(array)) return '';
    if (util.get(options, 'hash.reverse')) {
      return array.sort().reverse();
    }
    return array.sort();
  });

  Handlebars.registerHelper('sortBy', function(array, prop, options) {
    if (!Array.isArray(array)) return '';
    var args = [].slice.call(arguments);
    // remove handlebars options
    args.pop();
  
    if (!util.isString(prop) && typeof prop !== 'function') {
      return array.sort();
    }
    return util.sortBy.apply(null, args);
  });

  Handlebars.registerHelper('withAfter', function(array, idx, options) {
    if (!Array.isArray(array)) return '';
    array = array.slice(idx);
    var result = '';
  
    for (var i = 0; i < array.length; i++) {
      result += options.fn(array[i]);
    }
    return result;
  });

  Handlebars.registerHelper('withBefore', function(array, idx, options) {
    if (!Array.isArray(array)) return '';
    array = array.slice(0, -idx);
    var result = '';
  
    for (var i = 0; i < array.length; i++) {
      result += options.fn(array[i]);
    }
    return result;
  });

  Handlebars.registerHelper('withFirst', function(array, idx, options) {
    if (util.isUndefined(array)) return '';
    array = util.result(array);
  
    if (!util.isUndefined(idx)) {
      idx = parseFloat(util.result(idx));
    }
  
    if (util.isUndefined(idx)) {
      options = idx;
      return options.fn(array[0]);
    }
  
    array = array.slice(0, idx);
    var result = '';
    for (var i = 0; i < array.length; i++) {
      result += options.fn(array[i]);
    }
    return result;
  });

  Handlebars.registerHelper('withGroup', function(array, size, options) {
    var result = '';
    if (Array.isArray(array) && array.length > 0) {
      var subcontext = [];
      for (var i = 0; i < array.length; i++) {
        if (i > 0 && (i % size) === 0) {
          result += options.fn(subcontext);
          subcontext = [];
        }
        subcontext.push(array[i]);
      }
      result += options.fn(subcontext);
    }
    return result;
  });

  Handlebars.registerHelper('withLast', function(array, idx, options) {
    if (util.isUndefined(array)) return '';
    array = util.result(array);
  
    if (!util.isUndefined(idx)) {
      idx = parseFloat(util.result(idx));
    }
  
    if (util.isUndefined(idx)) {
      options = idx;
      return options.fn(array[array.length - 1]);
    }
  
    array = array.slice(-idx);
    var len = array.length, i = -1;
    var result = '';
    while (++i < len) {
      result += options.fn(array[i]);
    }
    return result;
  });

  Handlebars.registerHelper('withSort', function(array, prop, options) {
    if (util.isUndefined(array)) return '';
    var result = '';
  
    if (util.isUndefined(prop)) {
      options = prop;
  
      array = array.sort();
      if (util.get(options, 'hash.reverse')) {
        array = array.reverse();
      }
  
      for (var i = 0, len = array.length; i < len; i++) {
        result += options.fn(array[i]);
      }
      return result;
    }
  
    array.sort(function(a, b) {
      a = util.get(a, prop);
      b = util.get(b, prop);
      return a > b ? 1 : (a < b ? -1 : 0);
    });
  
    if (util.get(options, 'hash.reverse')) {
      array = array.reverse();
    }
  
    var alen = array.length, j = -1;
    while (++j < alen) {
      result += options.fn(array[j]);
    }
    return result;
  });

  Handlebars.registerHelper('unique', function(array, options) {
    if (util.isUndefined(array)) return '';
    
    return array.filter(function(item, index, arr) {
      return arr.indexOf(item) === index;
    });
  });
  // -------------------------------------------------------------------
  // END Array helpers
  // -------------------------------------------------------------------   

  // -------------------------------------------------------------------
  // BEGIN String helpers
  // -------------------------------------------------------------------  
  Handlebars.registerHelper('append', function(str, suffix) {
    if (typeof str === 'string' && typeof suffix === 'string') {
      return str + suffix;
    }
    return str;
  }); 

  Handlebars.registerHelper('camelcase', function(str) {
    if (!util.isString(str)) return '';
    return util.changecase(str, function(ch) {
      return ch.toUpperCase();
    });
  });

  Handlebars.registerHelper('capitalize', function(str) {
    if (!util.isString(str)) return '';
    return str.charAt(0).toUpperCase() + str.slice(1);
  });

  Handlebars.registerHelper('capitalizeAll', function(str) {
    if (!util.isString(str)) return '';
    if (util.isString(str)) {
      return str.replace(/\w\S*/g, function(word) {
        return Handlebars.helpers.capitalize(word);
      });
    }
  });

  Handlebars.registerHelper('center', function(str, spaces) {
    if (!util.isString(str)) return '';
    var space = '';
    var i = 0;
    while (i < spaces) {
      space += '&nbsp;';
      i++;
    }
    return space + str + space;
  });

  Handlebars.registerHelper('chop', function(str) {
    if (!util.isString(str)) return '';
    return util.chop(str);
  });

  Handlebars.registerHelper('dashcase', function(str) {
    if (!util.isString(str)) return '';
    return util.changecase(str, function(ch) {
      return '-' + ch;
    });
  });

  Handlebars.registerHelper('dotcase', function(str) {
    if (!util.isString(str)) return '';
    return util.changecase(str, function(ch) {
      return '.' + ch;
    });
  });

  Handlebars.registerHelper('ellipsis', function(str, limit) {
    if (util.isString(str)) {
      if (str.length <= limit) {
        return str;
      }
      return Handlebars.helpers.truncate(str, limit) + '…';
    }
  });

  Handlebars.registerHelper('hyphenate', function(str) {
    if (!util.isString(str)) return '';
    return str.split(' ').join('-');
  });

  Handlebars.registerHelper('isString', function(value) {
    return typeof value === 'string';
  });

  Handlebars.registerHelper('lowercase', function(str) {
    if (util.isObject(str) && str.fn) {
      return str.fn(this).toLowerCase();
    }
    if (!util.isString(str)) return '';
    return str.toLowerCase();
  });

  Handlebars.registerHelper('occurrences', function(str, substring) {
    if (!util.isString(str)) return '';
    var len = substring.length;
    var pos = 0;
    var n = 0;
  
    while ((pos = str.indexOf(substring, pos)) > -1) {
      n++;
      pos += len;
    }
    return n;
  });

  Handlebars.registerHelper('pascalcase', function(str) {
    if (!util.isString(str)) return '';
    str = util.changecase(str, function(ch) {
      return ch.toUpperCase();
    });
    return str.charAt(0).toUpperCase() + str.slice(1);
  });

  Handlebars.registerHelper('pathcase', function(str) {
    if (!util.isString(str)) return '';
    return util.changecase(str, function(ch) {
      return '/' + ch;
    });
  });

  Handlebars.registerHelper('plusify', function(str, ch) {
    if (!util.isString(str)) return '';
    if (!util.isString(ch)) ch = ' ';
    return str.split(ch).join('+');
  });

  Handlebars.registerHelper('prepend', function(str, prefix) {
    return typeof str === 'string' && typeof prefix === 'string'
    ? (prefix + str)
    : str;
  });

  Handlebars.registerHelper('raw', function(options) {
    var str = options.fn();
    var opts = util.options(this, options);
    if (opts.escape !== false) {
      var idx = 0;
      while (((idx = str.indexOf('{{', idx)) !== -1)) {
        if (str[idx - 1] !== '\\') {
          str = str.slice(0, idx) + '\\' + str.slice(idx);
        }
        idx += 3;
      }
    }
    return str;
  });

  Handlebars.registerHelper('remove', function(str, ch) {
    if (!util.isString(str)) return '';
    if (!util.isString(ch)) return str;
    return str.split(ch).join('');
  });

  Handlebars.registerHelper('removeFirst', function(str, ch) {
    if (!util.isString(str)) return '';
    if (!util.isString(ch)) return str;
    return str.replace(ch, '');
  });

  Handlebars.registerHelper('replace', function(str, a, b) {
    if (!util.isString(str)) return '';
    if (!util.isString(a)) return str;
    if (!util.isString(b)) b = '';
    return str.split(a).join(b);
  });

  Handlebars.registerHelper('replaceFirst', function(str, a, b) {
    if (!util.isString(str)) return '';
    if (!util.isString(a)) return str;
    if (!util.isString(b)) b = '';
    return str.replace(a, b);
  });

  // reverse already defined in Array helpers
  // Handlebars.registerHelper('reverse', function() {
  // });

  Handlebars.registerHelper('sentence', function(str) {
    if (!util.isString(str)) return '';
    return str.replace(/((?:\S[^\.\?\!]*)[\.\?\!]*)/g, function(txt) {
      return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
  });

  Handlebars.registerHelper('snakecase', function(str) {
    if (!util.isString(str)) return '';
    return util.changecase(str, function(ch) {
      return '_' + ch;
    });
  });

  Handlebars.registerHelper('split', function(str, ch) {
    if (!util.isString(str)) return '';
    if (!util.isString(ch)) ch = ',';
    return str.split(ch);
  });

  Handlebars.registerHelper('startsWith', function(prefix, str, options) {
    var args = [].slice.call(arguments);
    options = args.pop();
    if (util.isString(str) && str.indexOf(prefix) === 0) {
      return options.fn(this);
    }
    if (typeof options.inverse === 'function') {
      return options.inverse(this);
    }
    return '';
  });

  Handlebars.registerHelper('substring', function(str, index, length) {
    if (!util.isString(str)) return '';
    if (!util.isNumber(index)) return str;
    if (util.isNumber(length))
      return str.substr(index, length);
    else
      return str.substr(index);
  });

  Handlebars.registerHelper('titleize', function(str) {
    if (!util.isString(str)) return '';
    var title = str.replace(/[- _]+/g, ' ');
    var words = title.split(' ');
    var len = words.length;
    var res = [];
    var i = 0;
    while (len--) {
      var word = words[i++];
      res.push(Handlebars.helpers.capitalize(word));
    }
    return res.join(' ');
  });

  Handlebars.registerHelper('trim', function(str) {
    return typeof str === 'string' ? str.trim() : '';
  });

  Handlebars.registerHelper('trimLeft', function(str) {
    if (util.isString(str)) {
      return str.replace(/^\s+/, '');
    }
  });

  Handlebars.registerHelper('trimRight', function(str) {
    if (util.isString(str)) {
      return str.replace(/\s+$/, '');
    }
  });

  Handlebars.registerHelper('truncate', function(str, limit, suffix) {
    if (util.isString(str)) {
      if (typeof suffix !== 'string') {
        suffix = '';
      }
      if (str.length > limit) {
        return str.slice(0, limit - suffix.length) + suffix;
      }
      return str;
    }
  });

  Handlebars.registerHelper('truncateWords', function(str, count, suffix) {
    if (util.isString(str) && isNumber(count)) {
      if (typeof suffix !== 'string') {
        suffix = '…';
      }
  
      var num = Number(count);
      var arr = str.split(/[ \t]/);
      if (num > arr.length) {
        arr = arr.slice(0, num);
      }
  
      var val = arr.join(' ').trim();
      return val + suffix;
    }
  });

  Handlebars.registerHelper('uppercase', function(str) {
    if (util.isObject(str) && str.fn) {
      return str.fn(this).toUpperCase();
    }
    if (!util.isString(str)) return '';
    return str.toUpperCase();
  });  
  // -------------------------------------------------------------------
  // END String helpers
  // -------------------------------------------------------------------  
}