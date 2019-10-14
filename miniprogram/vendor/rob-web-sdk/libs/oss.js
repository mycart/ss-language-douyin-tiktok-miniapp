const utils = require('./utils');
const constants = require('./constants');
const Session = require('./session');
const request = require('./request');

var policy = function (dir, callback, errCallBack) {
  wx.request({
    method: 'GET',
    url: constants.OSS_POLICY,
    data: { dir },
    success: function (data) {
      callback(data)
    },
    fail: res => {
      console.log(res)
      errCallBack(res)
    }
  })
}

module.exports = {
  policy
}