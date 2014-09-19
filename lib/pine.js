/*global require, module*/

var express = require('express'),
    extend = require('node.extend');

var app = express();
app.use(express.bodyParser());

var Pine = function(options) {
  this._init = this._init.bind(this);
  this._registerRoute = this._registerRoute.bind(this);
  this._generateNewMapObject = this._generateNewMapObject.bind(this);
  this.registerRoutes = this.registerRoutes.bind(this);

  var defaults = {
    routes: [],
    port: 3000,
    verbose: false,
    defaultCallback: undefined
  };

  options = extend(true, {}, defaults, options);

  this._init(options);
};

Pine.prototype = {
  _init: function Pine__init(options) {
    this._defaultCallback = options.defaultCallback;
    this._verbose = options.verbose;

    this.registerRoutes(options.routes);

    app.listen(options.port);
    console.log('WebService has started on port ' + options.port + '...');
  },

  _registerRoute: function Pine__registerRoute(route) {
    var method = route.method || this._defaultMethod,
        callback = route.callback || this._defaultCallback;

    app[method.toLowerCase()](route.url, function(req, res) {
      var args = this._generateNewMapObject(req, route.argMap);

      if (this._verbose) {
        console.log('URL was requested -> ' + method.toUpperCase() + ' ' + req.url);
      }

      callback({
        args: args,
        req: req,
        res: res
      });
    }.bind(this));
  },

  _generateNewMapObject: function Pine__generateNewMapObject(obj, map) {
    map = map || {};
    obj = obj || {};
    var result = {};

    for (var name in map) {
      result[name] = this._get(obj, map[name]);
    }

    return result;
  },

  _get: function Pine__get(obj, path) {
    if (path.length === 0 || !path.trim() || !obj) {
      return;
    }

    path = path.split('.');
    var res = obj;
    for (var i = 0, len = path.length; i < len; i++) {
      var segment = res[path[i]];
      if (segment !== undefined) {
        res = segment;
      } else {
        return;
      }
    }
    return res;
  },

  registerRoutes: function Pine_registerRoutes(routes) {
    routes = routes || [];

    for (var i=0, len = routes.length; i<len; i++) {
      this._registerRoute(routes[i]);
    }
  },

  _defaultMethod: 'get',
  _verbose: false,
  _defaultCallback: undefined
};

module.exports = Pine;