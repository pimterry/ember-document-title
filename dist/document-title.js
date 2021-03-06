var define, requireModule, require, requirejs;

(function() {

  var _isArray;
  if (!Array.isArray) {
    _isArray = function (x) {
      return Object.prototype.toString.call(x) === "[object Array]";
    };
  } else {
    _isArray = Array.isArray;
  }
  
  var registry = {}, seen = {}, state = {};
  var FAILED = false;

  define = function(name, deps, callback) {
  
    if (!_isArray(deps)) {
      callback = deps;
      deps     =  [];
    }
  
    registry[name] = {
      deps: deps,
      callback: callback
    };
  };

  function reify(deps, name, seen) {
    var length = deps.length;
    var reified = new Array(length);
    var dep;
    var exports;

    for (var i = 0, l = length; i < l; i++) {
      dep = deps[i];
      if (dep === 'exports') {
        exports = reified[i] = seen;
      } else {
        reified[i] = require(resolve(dep, name));
      }
    }

    return {
      deps: reified,
      exports: exports
    };
  }

  requirejs = require = requireModule = function(name) {
    if (state[name] !== FAILED &&
        seen.hasOwnProperty(name)) {
      return seen[name];
    }

    if (!registry[name]) {
      throw new Error('Could not find module ' + name);
    }

    var mod = registry[name];
    var reified;
    var module;
    var loaded = false;

    seen[name] = { }; // placeholder for run-time cycles

    try {
      reified = reify(mod.deps, name, seen[name]);
      module = mod.callback.apply(this, reified.deps);
      loaded = true;
    } finally {
      if (!loaded) {
        state[name] = FAILED;
      }
    }

    return reified.exports ? seen[name] : (seen[name] = module);
  };

  function resolve(child, name) {
    if (child.charAt(0) !== '.') { return child; }

    var parts = child.split('/');
    var nameParts = name.split('/');
    var parentBase;

    if (nameParts.length === 1) {
      parentBase = nameParts;
    } else {
      parentBase = nameParts.slice(0, -1);
    }

    for (var i = 0, l = parts.length; i < l; i++) {
      var part = parts[i];

      if (part === '..') { parentBase.pop(); }
      else if (part === '.') { continue; }
      else { parentBase.push(part); }
    }

    return parentBase.join('/');
  }

  requirejs.entries = requirejs._eak_seen = registry;
  requirejs.clear = function(){
    requirejs.entries = requirejs._eak_seen = registry = {};
    seen = state = {};
  };
})();

;define("ember-document-title", 
  ["ember","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    var Ember = __dependency1__["default"];

    var get = Ember.get;
    var copy = Ember.copy;
    var removeObserver = Ember.removeObserver;
    var addObserver = Ember.addObserver;

    var DocumentTitle = Ember.Mixin.create({

      titleTokensDidChange: function () {
        this.notifyPropertyChange('titleTokens');
      },

      titleTokens: function () {
        var currentHandlerInfos = get(this, 'router.currentHandlerInfos');
        var tokens = [];
        var token;

        if (currentHandlerInfos) {
          for (var i = 0, len = currentHandlerInfos.length; i < len; i++) {
            token = get(currentHandlerInfos[i], 'handler.title');
            if (token) {
              tokens.push(token);
            }
          }
        }

        return tokens;
      }.property(),

      titleDivider: '|',

      titleSpecificityIncreases: true,

      title: function () {
        var tokens = get(this, 'titleTokens'),
            divider = get(this, 'titleDivider');

        divider = ' ' + divider + ' ';

        if (!get(this, 'titleSpecificityIncreases')) {
          tokens = copy(tokens).reverse();
        }

        return tokens.join(divider);
      }.property('titleTokens', 'titleDivider', 'titleSpecificityIncreases'),

      titleDidChange: function () {
        var title = get(this, 'title');

        if (title) {
          document.title = title;
        }
      }.observes('title').on('init'),

      willTransition: function () {
        var oldInfos = get(this, 'router.currentHandlerInfos');

        if (oldInfos) {
          for (var i = 0, len = oldInfos.length; i < len; i++) {
            removeObserver(oldInfos[i].handler, 'title', this, this.titleTokensDidChange);
          }
        }
      },

      didTransition: function (infos) {
        for (var i = 0, len = infos.length; i < len; i++) {
          addObserver(infos[i].handler, 'title', this, this.titleTokensDidChange);
        }

        this.notifyPropertyChange('titleTokens');

        return this._super(infos);
      },

      _setupRouter: function (router, location) {
        var emberRouter = this;
        router.willTransition = function (infos) {
          emberRouter.willTransition(infos);
        };

        this._super(router, location);
      }
    });

    __exports__["default"] = DocumentTitle;
  });
;define("loader", 
  [],
  function() {
    "use strict";
    var define, requireModule, require, requirejs;

    (function() {

      var _isArray;
      if (!Array.isArray) {
        _isArray = function (x) {
          return Object.prototype.toString.call(x) === "[object Array]";
        };
      } else {
        _isArray = Array.isArray;
      }
      
      var registry = {}, seen = {}, state = {};
      var FAILED = false;

      define = function(name, deps, callback) {
      
        if (!_isArray(deps)) {
          callback = deps;
          deps     =  [];
        }
      
        registry[name] = {
          deps: deps,
          callback: callback
        };
      };

      function reify(deps, name, seen) {
        var length = deps.length;
        var reified = new Array(length);
        var dep;
        var exports;

        for (var i = 0, l = length; i < l; i++) {
          dep = deps[i];
          if (dep === 'exports') {
            exports = reified[i] = seen;
          } else {
            reified[i] = require(resolve(dep, name));
          }
        }

        return {
          deps: reified,
          exports: exports
        };
      }

      requirejs = require = requireModule = function(name) {
        if (state[name] !== FAILED &&
            seen.hasOwnProperty(name)) {
          return seen[name];
        }

        if (!registry[name]) {
          throw new Error('Could not find module ' + name);
        }

        var mod = registry[name];
        var reified;
        var module;
        var loaded = false;

        seen[name] = { }; // placeholder for run-time cycles

        try {
          reified = reify(mod.deps, name, seen[name]);
          module = mod.callback.apply(this, reified.deps);
          loaded = true;
        } finally {
          if (!loaded) {
            state[name] = FAILED;
          }
        }

        return reified.exports ? seen[name] : (seen[name] = module);
      };

      function resolve(child, name) {
        if (child.charAt(0) !== '.') { return child; }

        var parts = child.split('/');
        var nameParts = name.split('/');
        var parentBase;

        if (nameParts.length === 1) {
          parentBase = nameParts;
        } else {
          parentBase = nameParts.slice(0, -1);
        }

        for (var i = 0, l = parts.length; i < l; i++) {
          var part = parts[i];

          if (part === '..') { parentBase.pop(); }
          else if (part === '.') { continue; }
          else { parentBase.push(part); }
        }

        return parentBase.join('/');
      }

      requirejs.entries = requirejs._eak_seen = registry;
      requirejs.clear = function(){
        requirejs.entries = requirejs._eak_seen = registry = {};
        seen = state = {};
      };
    })();
  });