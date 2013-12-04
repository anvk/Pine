/*global require, module*/

var sql = require('mssql'),
    extend = require('node.extend'),
    _ = require('lodash-node');


// options.debug
// options.verbose
// options.parseCallback
// options.dbconfig.user
// options.dbconfig.password
// options.dbconfig.server
// options.dbconfig.database
var dataProvider = function(options) {
  var that = {},
      verbose, parseCallback, onError, dbconfig;

  var defaults = {
    dbconfig: {
      user: undefined,
      password: undefined,
      server: undefined,
      database: undefined
    },
    parseCallback: undefined,
    onError: function() {},
    verbose: false,
    debug: false
  };

  var init = function(options) {
    options = extend(true, {}, defaults, options);

    verbose = options.verbose;
    parseCallback = options.parseCallback;
    onError = options.onError;
    dbconfig = options.dbconfig;

    return that;
  };

  var wrap = _.wrap(_.escape, function(func, text) {
    return '\'' + func(text) + '\'';
  });

  // options.query
  // options.onSuccess
  // options.parseCallback
  that.query = function(options) {
    var query = options.query,
        onSuccess = options.onSuccess,
        queryParseCallback = options.parseCallback || parseCallback,
        onError = options.onError || onError;

    if (!_.isString(query)) {
      console.log('query is in a wrong format');
      return;
    }

    sql.connect(dbconfig, function(err) {
      if (err) {
        console.log(err);
        if (_.isFunction(onError)) {
          onError(err);
        }
        sql.close();
        return;
      }
      var request = new sql.Request();
      request.multiple = true;
      if (verbose) {
        console.log('Executing query -> ' + query);
      }
      request.query(query, function(err, recordset) {
        if (err) {
          console.log(err);
          sql.close();
          return;
        }
        if (verbose) {
          console.log(recordset);
        }
        if (_.isFunction(queryParseCallback)) {
          recordset = queryParseCallback(recordset);
        }
        if (_.isFunction(onSuccess)) {
          onSuccess(recordset);
        }

        sql.close();
      });
    });
  };

  // options.storProcName
  // options.args
  // options.onSuccess
  // options.parseCallback
  that.call = function(options) {
    var storProcName = _.escape(options.storProcName),
        query = 'EXEC [dbo].[' + storProcName + ']',
        argsQuery = [];

    _.each(options.args, function(value, key) {
      if (value === undefined) {
        return;
      }

      if (_.isString(value)) {
        value = wrap(value);
      }

      argsQuery.push('@' + key + '=' + value);
    });
    that.query({
      query: query + ' ' + argsQuery.join(','),
      onSuccess: options.onSuccess,
      parseCallback: options.parseCallback,
      onError: options.onError
    });
  };

  return init(options);
};

module.exports = dataProvider;