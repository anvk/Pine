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
  // POST http://localhost:3000/customers    w body   { "customerid": 111, "name": "Sample Customer" }
  {
    url: '/customers',
    method: 'post',
    argMap: {
      customerid: 'body.customerid',
      name: 'body.name'
    }
  }
];

pine({
  processRequest: processRequest,
  routes: routes,
  port: 3000,
  verbose: true
});