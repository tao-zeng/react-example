var q = require('q'),
  is = require('is');
function _arrayEmptyFilter(v) {
  return v;
}
function callconsole(fn, args) {
  if (console && console[fn]) {
    return console[fn].apply(console, args);
  }
}
function _assign(target, keyFilter, ...sources) {
  target = target || {};
  sources.forEach(function(source) {
    if (is.hash(source)) {
      var keys = Object.keys(source);
      if (keyFilter) {
        keys = keys.filter(keyFilter);
      }
      keys.forEach(function(key) {
        target[key] = source[key];
      });
    }
  });
  return target;
}
var core = {
  is: is,
  parseArguments(args) {
    var ret = [],
      i = 0;
    for (; i < args.length; i++) {
      ret[i] = args[i];
    }
    return ret;
  },
  debug() {
    callconsole('debug', ['[debug]'].concat(core.parseArguments(arguments)));
  },
  log() {
    callconsole('log', ['[info]'].concat(core.parseArguments(arguments)));
  },
  warn() {
    callconsole('warn', ['[warn]'].concat(core.parseArguments(arguments)));
  },
  err() {
    callconsole('error', ['[error]'].concat(core.parseArguments(arguments)));
  },
  consoleGroup(callback, ...args) {
    callconsole('group', args);
    callback();
    callconsole('groupEnd');
  },
  consoleTime(callback, ...args) {
    callconsole('time', args);
    callback();
    callconsole('time', args);
  },
  promise(c) {
    let def = Q.defer();
    c(def);
    return def.promise;
  },
  promiseAll(promises) {
    if (!is.array(promises)) {
      promises = [];
      for (var i = 0; i < arguments.length; i++) {
        promises[i] = arguments[i];
      }
    }
    return Q.promise.all(promises);
  },
  arrayEmptyFilter: _arrayEmptyFilter,
  emptyFn() {},
  parseClassName(classNames) {
    if (!classNames) {
      return '';
    }
    if (is.array(classNames)) {
      return classNames.join(' ');
    } else if (is.hash(classNames)) {
      return Object.keys(classNames).filter(function(className) {
        return classNames[className];
      }).join(' ');
    } else {
      return Array.prototype.filter.call(arguments, _arrayEmptyFilter).join(' ');
    }
  },

  parseIconClassName(iconCls) {
    let iconClasses,
      isFa = false,
      i;
    if (!iconCls) {
      return '';
    }
    if (is.string(iconCls)) {
      iconClasses = iconCls ? iconCls.split(/\s+/g) : []
    } else if (is.array(iconCls)) {
      iconClasses = iconCls;
    } else if (is.hash(iconCls)) {
      iconClasses = Object.keys(classNames).filter(function(className) {
        return classNames[className];
      });
    } else {
      throw new Error('Invalid param', arguments);
    }
    for (i = 0; i < iconClasses.length; i++) {
      if (iconClasses[i].indexOf('fa-') == 0) {
        isFa = true;
      }
    }
    if (isFa && iconClasses.indexOf('fa') === -1) {
      iconClasses.splice(0, 0, 'fa');
    }
    return iconClasses.join(' ');
  },

  objectWithoutProperties() {
    return _objectWithoutProperties.apply(this, arguments);
  },

  chainedFunc(funcs, scope) {
    return funcs
      .filter(f => is.fn(f))
      .reduce((acc, f) => {
        if (acc === null) {
          return f;
        }
        return function chainedFunction(...args) {
          acc.apply(scope, args);
          f.apply(scope, args);
        };
      }, null);
  },

  assign(target, ...sources) {
    return _assign.apply(this, [target, null].concat(sources));
  },

  assignIf(target, ...sources) {
    return _assign.apply(this, [target, function(key) {
      return !is.defined(target[key]);
    }].concat(sources));
  },

  assignWith(target, includes, ...sources) {
    let keyFilter;
    if (is.array(includes) && includes.length > 0) {
      keyFilter = function(key) {
        return includes.indexOf(key) != -1;
      }
    }
    return _assign.apply(this, [target, keyFilter].concat(sources));
  },

  assignWithout(target, excludes, ...sources) {
    let keyFilter;
    if (is.array(excludes) && excludes.length > 0) {
      keyFilter = function(key) {
        return excludes.indexOf(key) == -1;
      }
    }
    return _assign.apply(this, [target, keyFilter].concat(sources));
  },

  upperFirst(str) {
    if (is.string(str)) {
      return str.replace(/^[a-z]/, function(w) {
        return w.toUpperCase();
      });
    }
    return str;
  },

  observe() {
    Object.observe();
  },

  eq(source, target, deep) {
    if (source === target) {
      return true;
    }
    if (is.array(source) && is.array(target)) {
      return !source.some((v, i) => {
          var tv = target[i];
          if (deep) {
            return !core.eq(v, tv, deep);
          } else {
            return tv !== v;
          }
        });
    } else if (is.hash(source) && is.hash(target)) {
      Object.keys(source).some((key) => {
        var v = source[key],
          tv = target[key];
        if (deep) {
          return !core.eq(v, tv, deep);
        } else {
          return tv !== v;
        }
      });
    }
    return false;
  }
}
module.exports = core;
