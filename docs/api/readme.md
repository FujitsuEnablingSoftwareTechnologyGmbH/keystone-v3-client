# API Binding

*Keystone-v3-client* provides binding to vast part of [Keystone V3 Identity API](http://developer.openstack.org/api-ref-identity-v3.html) excluding
meta-data about the api versions.

# Table of contents
* [Creating](#Creating)
* [Configuration](#Configuration)
* [Usage](#Usage)
* [Simplicity](#Simplicity)
* [Examples](#Examples)

## Creating <a id="Creating"></a>

Each binding is by design an instantiable class in JavaScript understanding.
Instead of using object literals (understood as singletons) it was decided that
such design wil work better and will have greater chance to serve as a strong
foundation for every future release.

## Configuration <a id="Configuration"></a>

For general approach go [here](../configuration.md), any binding
specific configuration, please refer to documentation of it.

## Usage <a id="Usage"></a>

Each binding is as pure as possible and stricly follows data, query and header
requirements defined in [Keystone V3 Identity API](http://developer.openstack.org/api-ref-identity-v3.html) documentation.
Please refer to it while wondering what particular call should look like.

Each method accepts object literal having this form
```javascript
{
  token: {String} // optional here, can be specified in headers,
  headers: {
    'X-Auth-Token': {String} // copied from token key,
    ...
    // other headers here
  },
  params: {
    // if it parametric request (i.e. has template as URI)
  },
  data: {
    // request payload
  }
}
```

and each single method will
* always return a Promise object
* resolve the promise for 2XX response code
* reject the promise for any other code

## Simplicity <a id="Simplicity"></a>

There is nothing more necessary. You will not find any programmatic caching
or sophisticated business logic. That part has been left for services which will
reuse bindings.

## Examples <a id="Examples"></a>

For better readability, examples have some code omitted such as <b>require</b>
statements. For better understing all samples below are created with
following API > [**TokensApi**](../../lib/keystone/tokens.js)

### Creating API object

Creating API is pretty straighforward as only required parameter
is a url enclosed in object literal.

:x: Set of configuration options of API bindings can be altered in future.

```javascript
var tokensApi = TokensApi({
  url: 'http://keystone.lives.here:666'
});
```

### Making request

Lets use TokensAPI to check if token is still valid.
This demonstrates how to properly construct **HEAD** request that:
* takes no query parameters
* carries no request payload
* returns no response body

```javascript
tokensApi
  .check({
    headers: {
      'X-Auth-Token'   : keystoneToken,
      'X-Subject-Token': keystoneToken
    }
  })
  .then(success, failure);

  function success(response){
    console.log('Token is valid');
  }

  function failure(error){
    console.log('Token is invalid, fun is over');
  }

```

Please take a look that this example does not follow **callback** pattern
to asynchronously react upon events but instead it uses [Promises](https://github.com/petkaantonov/bluebird). Every method called from
binding will always return a Promise instance.

As it comes down to *response* and *request* arguments visible above, they are,
respectively:

* object literal with following structure
```javascript
{
    statusCode: {int},
    data: {object},
    headers: {object}
}
```
* Error instance

# License

Copyright 2015 FUJITSU LIMITED
