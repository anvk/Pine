Pine.js a Node project
========

> Project target of which is a developer friendly and easy configurable to use RESTful webservices using Node.JS. Create more by coding less!

### Prerequisites

Node + NPM

```
$ npm install
```

### To start a webservice example

```
$ node main
```

Navigate to [http://localhost:3000] to see your running webservice

### Options

**routes** - array of route objects. Please refer to the documentation below for further details.  
**port** - port where for the webservice  
**verbose** - there will extra logging messages printed if true  
**processRequest** - callback which will be executed for every webservice request. Please refer to the documentation below for further details.  

#### Route object

> Object which sets route rules(URLs) for the webservice. Its properties are described below. NOTE: extra properties could be specified and used in `proccessRequest()` callback

**url** - url for a route (e.g. `http://localhost:3000/customers/:customerid/properties` then your url must be `customers/:customerid/properties`)  
**method** - get/post/put/patch/delete  
**argMap** - an object which contains mapping for arguments which came from URL, Body or Query URL. Example: If you have the following URL `POST http://localhost:3000/customers/:customerid/properties?name=[name]` with body `{ "value": "myval" }` then your argMap will be the following:  

```javascript
argMap: {
  customerid: 'params.customerid',
  propertyName: 'query.name',
  propertyValue: 'body.value'
}
```

#### processRequest(params)

> Callback which will be called for every route which got executed. Params consist of the following objects:

**args** - object which contains resolved variables from route's argMap 
**res** - Express response object. NOTE: you need to call `res.send(data)` within your `processRequest()` callback to send JSON back to the user.  
**req** - Express request object.  
**route** - Route object which got executed.  

### Widget default options

```javascript
var defaults = {
  routes: [],
  port: 3000,
  verbose: false,
  processRequest: undefined
};
```

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