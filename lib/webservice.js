var express = require('express'),
    dataProvider = require('./dataProvider'),
    config = require('../config/dataProvider.json');

var app = express(),
    dataLayer = dataProvider(config);

app.get('/customers', function(req, res) {
  dataLayer.call('stGetCustomers', {
    fsCall: 1
  },function(data) {
    res.send(data);
  });
});

app.get('/customers/:id', function(req, res) {
  getCustomers(res, req.params.id);
});

app.listen(3000);
console.log('WebService has started on port 3000...');