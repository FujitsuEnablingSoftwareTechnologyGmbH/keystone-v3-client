var _ = require('lodash'),
  rest = require('restler'),
  debug = require('debug')('kvn:request'),
  mixin = require('./mixin'),
  Promise = require('bluebird');

module.exports = {
  method        : {
    GET   : 'get',
    POST  : 'post',
    DELETE: 'delete',
    PATCH : 'patch',
    PUT   : 'put',
    HEAD  : 'head'
  },
  noParamRequest: noParamRequest,
  paramRequest  : paramRequest
};

function noParamRequest(method, uri) {
  return _.wrap(function (data) {
    return request(this.settings.url, method, uri, data);
  }, beforeRequest)
}

/**
 * Builds request method that will have params in the URL.
 * Method requires template <b>uri</b> instead of raw string
 * and an array of all path-param names.
 *
 * Values will be extracted from <b>data.params</b> and afterwards
 * entire params property will be deleted.
 *
 * @param method HTTP method
 * @param uri template URI
 * @param paramNames all param names that must be found in <b>data.params</b>
 * @returns {Function} manufactured request method
 */
function paramRequest(method, uri) {
  return _.wrap(function (data) {
    var self = this,
      url = self.settings.url,
      _uri = _.template(uri)(data.params);

    delete data.params;

    return request.request(url, method, _uri, data);
  }, beforeRequest);
}

/**
 * Wrapper that will clean up the data passed into the endpoint method
 * and then call actual preparing method
 * @param fn actual request method ptr
 * @param data raw data
 * @returns {*} value of wrapped method
 */
function beforeRequest(fn, data) {
  if (data.method) {
    delete data.method;
  }
  return fn(data);
}

/**
 * Executes request and replaces callback based API with Promise based
 * API. Expects base URL do keystone and meta information of an API endpoint
 *
 * @param url base url do Keystone
 * @param method actual method to use
 * @param data data object to pass to
 * @param uri points to specific end point
 */
function request(url, method, uri, data) {
  url = combineUrl(url, uri);

  var settings = mixin(
    {
      method: method
    },
    data
  );

  return Promise(function (resolve, reject) {
    rest
      .request(url, settings)
      .on('success', _.wrap(onSuccess, afterRequest(uri, 'success')))
      .on('fail', _.wrap(onFail, afterRequest(uri, 'fail')))
      .on('error', _.wrap(onError, afterRequest(uri, 'error')));

    function onSuccess(data, response) {
      resolve({
        data      : data,
        statusCode: response.statusCode,
        success   : true
      })
    }

    function onFail(data, response) {
      reject({
        data      : data,
        statusCode: response.statusCode,
        success   : false
      })
    }

    function onError(error, response) {
      reject({
        error     : error,
        statusCode: response.statusCode,
        success   : false
      })
    }

    function afterRequest(fn, uri, event) {
      return function (data, response) {
        debug(uri + ' finished with event ' + event);
        fn(data, response);
      }
    }

  })
}

function combineUrl(baseUrl, val) {
  if (baseUrl.endsWith('/')) {
    baseUrl = baseUrl.substr(baseUrl.lastIndexOf('/'));
  }
  if (!val.startsWith('/')) {
    val = '/' + val;
  }
  return baseUrl + val;
}