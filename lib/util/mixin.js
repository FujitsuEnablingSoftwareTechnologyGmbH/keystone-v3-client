module.exports = function mixin(target, source) {
  source = source || {};
  Object.keys(source).forEach(function (key) {
    target[key] = source[key];
  });

  return target;
};