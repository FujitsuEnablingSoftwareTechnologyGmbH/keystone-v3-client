module.exports = {
  parseISO8601Date: parseISO8601Date,
  dateDiff        : dateDiff,
  mixin           : mixin,
  timer           : {
    start: function () {
      return process.hrtime();
    },
    end  : function (start) {
      return process.hrtime(start);
    }
  }
};

function mixin(target, source) {
  source = source || {};
  Object.keys(source).forEach(function (key) {
    target[key] = source[key];
  });
  return target;
}

function parseISO8601Date(iso8601) {
  return new Date(Date.parse(iso8601));
}

function dateDiff(dateA, dataB) {
  return dataB.getTime() - dateA.getTime();
}
