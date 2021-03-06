Pine.js v0.3.1
========

> Project target of which is a developer friendly and easy configurable to use RESTful webservices using Node.JS. Create more by coding less!

### Prerequisites

Node + NPM

```
$ npm install
```

### Example of pine web service

```
$ node main
```

Navigate to [http://localhost:3000](http://localhost:3000) to see your running web service

### Options

**routes** - array of route objects. Please refer to the documentation below for further details.  
**port** - port where for the web service  
**verbose** - there will extra logging messages printed if true  
**defaultCallback** - callback which will be executed by default for every web service request. Please refer to the documentation below for further details.  

#### Route object

> Object which sets route rules(URLs) for the web service. Its properties are described below. NOTE: extra properties could be specified and accessed through _params.route_ in _proccessRequest()_ callback

**url** - url for a route  
**method** - GET/POST/PUT/PATCH/DELETE. NOTE: by default method will be set to GET for a route  
**argMap** - an object which contains mapping for arguments which were passed in URL, Body or Query URL.  
**callback** - callback which will be executed upon request. Argument is an object consisting of req, res and args built by using argMap.  

#### Route example

If you need to process _POST http://localhost:3000/customers/:customerid/properties?name=[name]_ with body _{ "value": "myval" }_ then your route object will be the following:

```javascript
{
  url: '/customers/:customerid/properties',
  method: 'post',
  argMap: {
    customerid: 'params.customerid',
    propertyName: 'query.name',
    propertyValue: 'body.value'
  }
}
```

#### processRequest(params)

> Callback for every route which got executed. Params consist of the following objects:

**args** - object which contains resolved variables from route's argMap  
**res** - Express response object. NOTE: you need to call _res.send(data)_ within your _processRequest()_ callback to send JSON back to a client.  
**req** - Express request object.  

### Widget default options

```javascript
var defaults = {
  routes: [],
  port: 3000,
  verbose: false,
  processRequest: undefined
};
```

## Release History

* 2014-09-18   v0.3.1   Getting rid of lo-dash. Using prototypal pattern. Every route can have its own callback to execute. Refactored code.  
* 2013-12-25   v0.2.0   Major rewrite.  
* 2013-12-23   v0.1.1   Refactoring Pine to be a more generic library.  
* 2013-11-23   v0.1.0   First working version.  

## License
The MIT License (MIT)

Copyright (c) 2013 Alexey Novak

Permission is hereby granted, free of charge, to any person obtaining a copy of
this software and associated documentation files (the "Software"), to deal in
the Software without restriction, including without limitation the rights to
use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
the Software, and to permit persons to whom the Software is furnished to do so,
subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
