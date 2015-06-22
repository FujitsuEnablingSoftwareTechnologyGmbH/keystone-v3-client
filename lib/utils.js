/**
 * @module
 * @description Utility functions that are used in the project
 */
module.exports = {
  /**
   * parseISO8601Date - creates Date object
   *
   * Returned object is compatible with format <b>ISO8601</b>
   *
   * @param  {string} iso8601 raw date (string) in <b>ISO8601</b> format
   * @return {Date}         Date instance
   * @static
   * @function
   */
  parseISO8601Date: parseISO8601Date,
  /**
   * dateDiff - returns <b>ms</b> difference between two dates.
   *
   * @param  {Date} dateA subtrahend
   * @param  {Date} dataB minuend
   * @return {Date}       result of subtraction
   * @static
   * @function
   */
  dateDiff        : dateDiff,
  /**
   * mixin - copies properties from source to target
   *
   * If property is already in target for given key it will
   * be overriden.
   *
   * @param  {object} target target object to copy properties to
   * @param  {object} source source object to get properties from
   * @return {object} target updated by source properties
   * @static
   * @function
   */
  mixin           : mixin,
  /**
   * @type {object}
   * @description encloses start and end function for timing the code
   */
  timer           : {
    /**
     * @name start
     * @alias timer.start
     * @return {integer} start checkpoint
     * @see process.hrtime
     */
    start: function () {
      /* istanbul ignore next */
      return process.hrtime();
    },
    /**
     * @name end
     * @alias timer.end
     * @param start {integer} start checkoint
     * @return {integer} time elapsed from param start
     * @see process.hrtime
     */
    end  : function (start) {
      /* istanbul ignore next */
      return process.hrtime(start);
    }
  }
};

function mixin(target, source) {
  /* istanbul ignore next */
  source = source || {};
  Object.keys(source).forEach(function (key) {
    target[key] = source[key];
  });
  return target;
}

function parseISO8601Date(iso8601) {
  if(!iso8601 || (['string'].indexOf(typeof iso8601) < 0)){
    return undefined;
  }
  return new Date(Date.parse(iso8601));
}

function dateDiff(dateA, dataB) {
  // uses getTime, becasue calculation is based on ms
  return dataB.getTime() - dateA.getTime();
}
