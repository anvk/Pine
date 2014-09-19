/*global require, module*/

var express = require('express'),
    extend = require('node.extend');

var app = express();
app.use(express.bodyParser());

var pine = function(options) {
  var that = {},
      defaultMethod = 'get';

  var defaults = {
    routes: [],
    port: 3000,
    verbose: false,
    defaultCallback: undefined
  };

  var init = function(options) {
    options = extend(true, {}, defaults, options);

    generateRoutes(options.routes);

    app.listen(options.port);
    console.log('WebService has started on port ' + options.port + '...');

    return that;
  };

  var get = function(obj, path) {
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
  };

  var generateNewMapObject = function(obj, map) {
    map = map || {};
    obj = obj || {};
    var result = {};

    Object.keys(map).forEach(function(name) {
      result[name] = get(obj, map[name]);
    });

    return result;
  };

  var processRoute = function(route) {
    var method = route.method || defaultMethod,
        callback = route.callback || options.defaultCallback;

    app[method.toLowerCase()](route.url, function(req, res) {
      var args = generateNewMapObject(req, route.argMap);

      if (options.verbose) {
        console.log('URL was requested -> ' + method.toUpperCase() + ' ' + req.url);
      }

      callback({
        args: args,
        req: req,
        res: res
      });
    });
  };

  var generateRoutes = function(routes) {
    routes = routes || [];

    for (var i=0, len = routes.length; i<len; i++) {
      processRoute(routes[i]);
    }
  };

  return init(options);
};

module.exports = pine;