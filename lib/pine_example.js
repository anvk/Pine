var pine = require('./pine');

var processRequest = function(params) {
  var res = params.res,
      req = params.req;

  res.send({
    url: req.url,
    args: params.args
  });
};

var routes = [
  // GET http://localhost:3000/customers
  // GET http://localhost:3000/customers?name="Test"
  {
    url: '/customers',
    method: 'get',
    argMap: {
      customerid: 'query.name'
    }
  },
  // GET http://localhost:3000/customers/10
  {
    url: '/customers/:customerid',
    method: 'get',
    argMap: {
      customerid: 'params.customerid'
    }
  },
  // POST http://localhost:3000/customers/10/properties?name=Test    w body   { "value": "myval" }
  {
    url: 'customers/:customerid/properties',
    method: 'post',
    argMap: {
      customerid: 'params.customerid',
      propertyName: 'query.name',
      propertyValue: 'body.value'
    }
  }
];

pine({
  processRequest: processRequest,
  routes: routes,
  port: 3000,
  verbose: true
});
