var sql = require('mssql'),
    extend = require('node.extend'),
    _ = require('lodash-node');

var dataProvider = function(config) {
  var that = {};

  var defaults = {
    user: undefined,
    password: undefined,
    server: undefined,
    database: undefined,
    verbose: false,
    debug: false
  };

  config = extend(defaults, config);

  var wrap = _.wrap(_.escape, function(func, text) {
    return '\'' + func(text) + '\'';
  });

  that.query = function(query, onSuccess) {
    sql.connect(config, function(err) {
      if (err) {
        console.log(err);
        sql.close();
      }
      var request = new sql.Request();
      request.multiple = true;
      if (config.verbose) {
        console.log('Executing query -> ' + query);
      }
      request.query(query, function(err, recordset) {
        if (err) {
          console.log(err);
          sql.close();
        }
        if (config.verbose) {
          console.log(recordset);
        }
        onSuccess(recordset);
        sql.close();
      });
    });
  };

  that.call = function(storProcName, args, onSuccess) {
    storProcName = _.escape(storProcName);

    var query = 'EXEC [dbo].[' + storProcName + ']',
        argsQuery = [];

    _.each(args, function(value, key) {
      value = _.chain(value)
        .escape()
        .toString();

      if (value === 'undefined') {
        value = 'null';
      }
      if (_.isString(value)) {
        value = wrap(value);
      }

      argsQuery.push('@' + key + '=' + value);
    });
    that.query(query + ' ' + argsQuery.join(','), onSuccess);
  };

  return that;
};

module.exports = dataProvider;