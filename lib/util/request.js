var _ = require('lodash'),
  rest = require('restler'),
  debug = require('debug')('kvn:request'),
  mixin = require('../utils').mixin,
  Promise = require('bluebird');

/**
 * @module
 */
module.exports = {
  /**
   * @name httpMethod
   * @description
   *  List of HTTP method
   * @property {object} method list of all HTTP methods
   */
  method        : {
    /** @attribute {string} <b>GET<b> HTTP method */
    GET   : 'get',
      /** @attribute {string} <b>POST</b> HTTP method */
    POST  : 'post',
      /** @attribute {string} <b>DELETE</b> HTTP method */
    DELETE: 'delete',
      /** @attribute {string} <b>PATCH</b> HTTP method */
    PATCH : 'patch',
      /** @attribute {string} <b>PUT</b> HTTP method */
    PUT   : 'put',
      /** @attribute {string} <b>HEAD</b> HTTP method */
    HEAD  : 'head'
  },
  /**
   * uriParams - Returns uri params from template URI.
   *
   * Method assumes that URI follows this pattern : <b>/a/${b}/c/${d}</b>
   * thus extracting b and d
   *
   * @param {string} uri input URI
   * @returns {array} list of parameters extracted from URI
   * @static
   * @function
   */
  uriParams: uriParams,
  /**
   * noParamRequest - creates method for non-parametric requests
   *
   * @param   {type} method HTTP method
   * @param   {type} uri    URI to resource
   * @returns {function}    function that accepts single param {object} and
   *                        executes non-parametric request againts URI
   * @static
   * @function
   */
  noParamRequest: noParamRequest,
  /**
   * paramRequest - creates method for parametric requests
   *
   * <p>
   * Builds request method that will have params in the URL.
   * Method requires template <b>uri</b> instead of raw string
   * and an array of all path-param names.
   * </p>
   *
   * <p>
   * Values will be extracted from <b>data.params</b> and afterwards
   * entire params property will be deleted.
   * </p>
   *
   * @param   {type} method HTTP method
   * @param   {type} uri    URI to resource
   * @returns {function}    function that accepts single param {object} and
   *                        executes parametric request againts URI
   *
   * @static
   * @function
   */
  paramRequest  : paramRequest
};

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
  /**
   * manufactured - non-parametric method that will execute request
   *
   * @param  {object}  configuration of the requests
   *                   containing following keys: [token, headers,data,params]
   * @return {Promise<{},Error>} value returned
   *          from [request]{@link module:util/request~request} method
   *
   * @function manufactured
   * @name nonParametricRequest
   * @alias noParamRequest.manufactured
   * @inner
   * @see [request]{@link module:util/request~request}
   */
  var manufactured = function manufactured(data) {
    return request.call(this, this.settings.url, method, uri, data);
  };
  return _.wrap(manufactured, beforeRequest);
}

function paramRequest(method, uri) {
  /**
   * manufactured - parametric method that will execute request
   *
   * <p>
   * Method verifies if required parameters have been supplied and if not
   * throws an [Error]{@link external:Error}
   * </p>
   *
   * @param  {object}  configuration of the requests
   *                   containing following keys: [token, headers,data,params]
   * @return {Promise<{},Error>} value returned
   *          from [request]{@link module:util/request~request} method
   *
   * @function manufactured
   * @name parametricRequest
   * @alias paramRequest.manufactured
   * @see [request]{@link module:util/request~request}
   */
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
   * checkParams - evaluates if supplied params matches URI requirements.
   *
   * <p>
   *    This method compares two arrays of strings.
   *    No exception situation is when both arrays
   *    intersections contains elements from both arrays or when
   *    there is a possibility to locate all elements that can be found
   *    in <b>fromUri</b> set in </b>fromData</b> set.
   * </p>
   *
   * @param {array} fromUri   parameters extracted from URI
   * @param {array} fromData  parameters found in data.params
   * @throws {Error}
   *  1) if supplied parameters do not match required one</br>
   *  2) if there is an amount difference between supplied and expected [early check]
   *
   * @function
   * @name checkParams
   * @alias paramRequest.checkParams
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
 * @returns {Promise<{},Error>} Promise is returned as a result of calling wrapped <b>fn</b> method
 *
 * @private
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
 * @param {string} url base url do Keystone
 * @param {string} actual HTTP method to use
 * @param {object} data data object to pass to
 * @param {string} uri points to specific end point
 *
 * @returns {Promise<{},Error>}
 *
 * @private
 * @see [HTTP methods]{@link module:util/request~httpMethod}
 */
function request(url, method, uri, data) {
  url = combineUrl(url, uri);

  var self = this,
    settings = buildRequestSettings();

  return new Promise(resolver);

  /**
   * buildRequestSettings - creates request settings object
   *
   * <p>
   * Request setting object comply to requirements defined in
   * [restler]{@link https://github.com/danwrong/restler} library.
   * </p>
   *
   * @return {object}  request settings
   *
   * @function
   * @name buildRequestSettings
   * @alias request.buildRequestSettings
   */
  function buildRequestSettings() {
    if (!hasToken()) {
      throw new Error('Failed to locate token in data object or in data.headers.X-Auth');
    }

    /**
     * settings - definition of [restler]{@link https://github.com/danwrong/restler} request.
     *
     * @name requestSettings
     * @alias request.buildRequestSettings.requestSettings
     * @member
     */
    var settings = {
      /**
       * @property {string} one of [HTTP methods]{@link module:util/request~httpMethod}
       */
      method : method,
      /**
       * @property {object} headers for the request
       */
      headers: mixin({
        'Content-Type': 'application/json',
        'X-Auth-Token': data.token // required value for each request must have it
      }, data.headers || {})
    };

    if (data.data) {
      // append stringify data if such present
      settings.data = JSON.stringify(data.data);
    }

    return settings;
  }

  /**
   * hasToken - evaluates if <b>X-Auth-Token</b> has been located in headers
   *
   * @return {boolean}  true if so, false otherwise
   *
   * @function
   * @name hasToken
   * @alias request.hasToken
   */
  function hasToken() {
    if (!data.token) {
      return data.headers && 'X-Auth-Token' in data.headers;
    }
    return true;
  }

  /**
   * resolver -  constructor function for the Promise
   *
   * <p>
   * - resolve is called only for HTTP success code (i.e. 2XX)
   * - reject is called for both warning codes (i.e. 4XX) and failure codes (i.e. 5XXX)
   * </p>
   *
   * @param  {function} resolve success handler for promise
   * @param  {function} reject  error handler for promise
   *
   * @function
   * @name resolver
   * @alias request.resolver
   */
  function resolver(resolve, reject) {
    var finishPromise = afterRequest.bind(self);
    rest
      .request(url, settings)
      .on('success', _.wrap(resolve, finishPromise(uri, 'success')))
      .on('fail', _.wrap(reject, finishPromise(uri, 'fail')))
      .on('error', _.wrap(reject, finishPromise(uri, 'error')));

    /**
    * @typedef apiResponse
    * @type {Object}
    * @property {object}  headers    response headers
    * @property {integer} statusCode response status code
    * @property {data}    ret.data   <b>optional</b>, available only if
    *                                response carried body
    */

    /**
     * afterRequest - completes promise (either success or failure)
     *
     * <p>
     * Method is responsible for normalization of the data into for successfully
     * completed promises, detected for empty responses and errors.
     * </p>
     * <p>
     * Returned object contains always:
     * - headers
     * - statusCode
     *
     * <b>data</b> is an option and is added to returned object only
     * if such is present in response
     * </p>
     *
     * @param  {string} uri   target URI
     * @param  {string} event <i>debug purpose</i>, notifies what happened,
     *                        it can be one of the following values:
     *                        [success,fail,error]
     * @returns {apiResponse}
     *
     * @function
     * @name afterRequest
     * @alias request.resolver.afterRequest
     */
    function afterRequest(uri, event) {
      return function (fn, data, response) {
        debug('[' + settings.method + '] ' + uri + ' finished with event ' + event + ', data is = ' + data);
        data = parseData(data);
        var ret = {
          headers   : response.headers,
          statusCode: response.statusCode
        };
        if (!_.isEmpty(data)) {
          ret.data = data;
        }
        fn(ret);
      };
    }

    /**
     * parseData - normalizes the data
     *
     * @param  {*} data           input dat
     * @return {object|Error}     an Error, object or an empty object for empty
     *                            empty reponses
     */
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

/**
 * combineUrl - combines two values together
 *
 * @param  {string} baseUrl baseURL
 *                          an adress with port where keystone is accessible
 * @param  {string} uri     value appended to baseURL
 * @return {string}         combined URL
 * @private
 */
function combineUrl(baseUrl, uri) {
  if (_.endsWith(baseUrl, '/')) {
    baseUrl = baseUrl.substr(0, baseUrl.lastIndexOf('/'));
  }
  if (!_.startsWith(uri, '/')) {
    uri = '/' + uri;
  }
  return baseUrl + uri;
}
