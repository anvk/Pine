/*global require, module*/

var express = require('express'),
    dataProvider = require('./dataProvider'),
    _ = require('lodash-node'),
    extend = require('node.extend');

var app = express();
app.use(express.bodyParser());

var pine = function(options) {
  var that = {},
      dataLayer;

  var defaults = {
    routes: [],
    port: 3000,
    dataConfig: undefined,
    parseCallback: undefined
  };

  var init = function(options) {
    options = extend(true, {}, defaults, options);

    var dataConfig = options.dataConfig;

    dataConfig.parseCallback = options.parseCallback;
    dataLayer = dataProvider(dataConfig);

    generateRoutes(options.routes);

    app.listen(options.port);
    console.log('WebService has started on port ' + options.port + '...');

    return that;
  };

  var getEl = function(obj, path) {
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
      result[name] = getEl(obj, path);
    });

    return result;
  };

  var generateRoutes = function(routes) {
    routes = routes || [];

    _.each(routes, function(route){
      app[route.method](route.url, function(req, res) {
        dataLayer.call({
          storProcName: route.storProcName,
          args: generateNewMapObject(req, route.argMap),
          onSuccess: function(data) {
            res.send(data);
          }
        });
      });
    });
  };

  return init(options);
};

module.exports = pine;