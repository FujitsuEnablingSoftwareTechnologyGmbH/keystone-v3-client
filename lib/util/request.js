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
  uriParams: uriParams,
  noParamRequest: noParamRequest,
  paramRequest  : paramRequest
};

/**
 * Returns uri params from template URI. Method
 * assumes that URI follows this pattern : <b>/a/${b}/c/${d}</b>
 * thus extracting b and d
 *
 * @param uri
 * @returns {*|Array|{index: number, input: string}}
 */
function uriParams(uri) {
  var regex = /\${([^}]+)}/gi,
    matches = uri.match(regex);

  return _.map(matches, function (mt) {
    mt = mt.substr(2);
    mt = mt.substr(0, mt.length - 1);
    return mt;
  });

}

function noParamRequest(method, uri) {
  var manufactured = function (data) {
    return request.call(this, this.settings.url, method, uri, data);
  };
  return _.wrap(manufactured, beforeRequest);
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
 * @returns {Function} manufactured request method
 */
function paramRequest(method, uri) {
  var manufactured = function manufactured(data) {
    var self = this,
      url = self.settings.url,
      fromUriParams = uriParams(uri),
      fromDataParams = data.params || {},
      _uri;

    checkParams(fromUriParams, _.keys(fromDataParams));

    _uri = _.template(uri)(fromDataParams);

    delete data.params;

    return request.call(self, url, method, _uri, data);
  };

  return _.wrap(manufactured, beforeRequest);

  /**
   * This method compares two arrays of strings.
   * No exception situation is when both arrays
   * intersections contains elements from both arrays or when
   * there is a possibility to locate all elements that can be found
   * in <b>fromUri</b> set in </b>fromData</b> set.
   *
   * @param fromUri
   * @param fromData
   */
  function checkParams(fromUri, fromData) {
    if (!fromData.length && !fromUri.length) {
      debug('Detected that method does not specify URI params, consider using noParamRequest');
    } else if (fromUri.length && !fromData.length) {
      var error = new Error('Detected that method specify URI params, but failed to find any in data.params');
      error.expectedParams = _.clone(fromUri);
      throw error;
    }
    _.forEachRight(fromUri, function (param) {
      if (fromData.indexOf(param) < 0) {
        throw new Error(param + ' not found in data.params although specified in URI');
      }
    });
  }

}

/**
 * Wrapper that will clean up the data passed into the endpoint method
 * and then call actual preparing method
 * @param fn actual request method ptr
 * @param data raw data
 * @returns {*} value of wrapped method
 */
function beforeRequest(fn, data) {
  if (data && data.method) {
    delete data.method;
  }
  return fn.call(this, data);
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

  var self = this,
    settings = buildRequestSettings();

  return new Promise(resolver);

  function buildRequestSettings() {
    if (!hasToken()) {
      throw new Error('Failed to locate token in data object or in data.headers.X-Auth');
    }
    var settings = {
      method : method,
      headers: mixin({
        'Content-Type': 'application/json',
        'X-Auth-Token': data.token // required value for each request must have it
      }, data.headers || {})
    };

    if (data.data) {
      settings.data = JSON.stringify(data.data);
    }

    return settings;
  }

  function hasToken() {
    if (!data.token) {
      return data.headers && 'X-Auth-Token' in data.headers;
    }
    return true;
  }

  function resolver(resolve, reject) {
    var finishPromise = afterRequest.bind(self);
    rest
      .request(url, settings)
      .on('success', _.wrap(resolve, finishPromise(uri, 'success')))
      .on('fail', _.wrap(reject, finishPromise(uri, 'fail')))
      .on('error', _.wrap(reject, finishPromise(uri, 'error')));

    function afterRequest(uri, event) {
      return function (fn, data, response) {
        debug('[' + settings.method + '] ' + uri + ' finished with event ' + event + ', data is = ' + data);
        data = parseData(data);
        var ret = {
          statusCode: response.statusCode
        };
        if (!_.isEmpty(data)) {
          ret.data = data;
        }
        fn(ret);
      };
    }

    function parseData(data) {
      if (data instanceof Error) {
        return data;
      } else if (_.isString(data)) {
        return data.length > 0 ? JSON.parse(data) : {};
      }
      throw new Error('Failed to parse data');
    }

  }
}

function combineUrl(baseUrl, val) {
  if (_.endsWith(baseUrl, '/')) {
    baseUrl = baseUrl.substr(0, baseUrl.lastIndexOf('/'));
  }
  if (!_.startsWith(val, '/')) {
    val = '/' + val;
  }
  return baseUrl + val;
}
