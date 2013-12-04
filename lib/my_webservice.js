var pine = require('./pine'),
    config = require('../config/dataProvider.json');

var parseCallback = function(data) {
  data = data || [];
  if (!data || !data.length || !data[0].length || data[0][0].errorCode !== 1) {
    return data;
  }

  return data[1];
};

var onDataError = function(res, err) {
  res.send({
    error: (err) ? err.toString() : 'something went wrong with the webservice'
  });
};

var routes = [
  {
    url: '/customers',
    method: 'get',
    storProcName: 'stGetCustomers'
  },
  {
    url: '/customers/:customerid',
    method: 'get',
    storProcName: 'stGetCustomers',
    argMap: {
      customerid: 'params.customerid'
    }
  },
  {
    url: '/customers',
    method: 'post',
    storProcName: 'stAddCustomer',
    argMap: {
      customerid: 'body.customerid',
      enabled: 'body.enabled',
      name: 'body.name'
    }
  },
  {
    url: '/customers/:customerid',
    method: 'put',
    storProcName: 'stUpdateCustomer',
    argMap: {
      customerid: 'params.customerid',
      enabled: 'body.enabled',
      name: 'body.name'
    }
  },
  {
    url: '/customers/:customerid',
    method: 'delete',
    storProcName: 'stDeleteCustomer',
    argMap: {
      customerid: 'params.customerid'
    }
  }
];

pine({
  routes: routes,
  parseCallback: parseCallback,
  onDataError: onDataError,
  dataConfig: config,
  port: 3000
});