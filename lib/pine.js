/*global require, module*/

var express = require('express'),
    _ = require('lodash-node'),
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
    processRequest: undefined
  };

  var init = function(options) {
    options = extend(true, {}, defaults, options);

    generateRoutes(options.routes);

    app.listen(options.port);
    console.log('WebService has started on port ' + options.port + '...');

    return that;
  };

  var get = function(obj, path) {
    if (_.isEmpty(path) || !obj) {
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

    _.each(map, function(path, name) {
      result[name] = get(obj, path);
    });

    return result;
  };

  var process = function(params) {
    var processRequest = options.processRequest;

    if (options.verbose) {
      console.log('URL was requested -> ' + get(params, 'route.method').toUpperCase() + ' ' + get(params, 'req.url'));
    }

    if (_.isFunction(processRequest)) {
      processRequest(params);
    }
  };

  var generateRoutes = function(routes) {
    routes = routes || [];

    _.each(routes, function(route) {
      route.method = route.method || defaultMethod;
      app[route.method.toLowerCase()](route.url, function(req, res) {
        var args = generateNewMapObject(req, route.argMap);
          process({
            args: args,
            req: req,
            res: res,
            route: route
          });
      });
    });
  };

  return init(options);
};

module.exports = pine;