/*global require*/

var Pine = require('./pine'),
    path = require('path'),
    homeHtml = 'html/home.html';

var defaultCallback = function(params) {
  var res = params.res,
      req = params.req;

  res.send({
    url: req.url,
    args: params.args
  });
};

var homeCallback = function(params) {
  params.res.sendfile(path.resolve(homeHtml));
};

var routes = [
  // GET http://localhost:3000
  {
    url: '/',
    callback: homeCallback
  },
  // GET http://localhost:3000/customers
  // GET http://localhost:3000/customers?name=Test
  {
    url: '/customers',
    argMap: {
      customerid: 'query.name'
    }
  },
  // GET http://localhost:3000/customers/10
  {
    url: '/customers/:customerid',
    argMap: {
      customerid: 'params.customerid'
    }
  },
  // POST http://localhost:3000/customers/10/properties?name=Test    w body   { "value": "myval" }
  {
    url: '/customers/:customerid/properties',
    method: 'post',
    argMap: {
      customerid: 'params.customerid',
      propertyName: 'query.name',
      propertyValue: 'body.value'
    }
  }
];

new Pine({
  defaultCallback: defaultCallback,
  routes: routes,
  port: 3000,
  verbose: true
});