module.exports = {
  start: function () {
    return process.hrtime();
  },
  end  : function (start) {
    return process.hrtime(start);
  }
};