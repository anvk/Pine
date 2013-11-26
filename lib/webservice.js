var express = require('express'),
    dataProvider = require('./dataProvider'),
    extend = require('node.extend'),
    config = require('../config/dataProvider.production.json');

var app = express(),
    ok = 1;

app.use(express.bodyParser());

var parseResponse = function(data) {
  data = data || [];
  if (!data || !data.length || !data[0].length || data[0][0].errorCode !== ok) {
    return data;
  }

  return data[1];
};

config.parseCallback = parseResponse;
var dataLayer = dataProvider(config);

app.get('/customers', function(req, res) {
  dataLayer.call({
    storProcName: 'stGetCustomers',
    onSuccess: function(data) {
      res.send(data);
    }
  });
});

app.get('/customers/:customerid/:tf', function(req, res) {
  dataLayer.call({
    storProcName: 'stGetCustomers',
    args: req.params,
    onSuccess: function(data) {
      res.send(data);
    }
  });
});

app.post('/customers', function(req, res) {
  dataLayer.call({
    storProcName: 'stAddCustomer',
    args: req.body,
    onSuccess: function(data) {
      res.send(data);
    }
  });
});

app.put('/customers/:id', function(req, res) {
  dataLayer.call({
    storProcName: 'stUpdateCustomer',
    args: extend(true, {}, req.body, req.params),
    onSuccess: function(data) {
      res.send(data);
    }
  });
});

app.delete('/customers/:customerid', function(req, res) {
  dataLayer.call({
    storProcName: 'stDeleteCustomer',
    args: req.params,
    onSuccess: function(data) {
      res.send(data);
    }
  });
});

app.listen(3000);
console.log('WebService has started on port 3000...');