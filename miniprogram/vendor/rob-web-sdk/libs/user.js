const constants = require('./constants');
const session = require('./session');
const utils = require('./utils');

var addUser = function (user, success, fail) {

  wx.cloud.callFunction({
    name: 'addUser',
    data: { userMsg: user },
    success: res => {
      console.log('[云函数] [addUser] addUser: ', res)
      let _openid = res.result.openid
      user = utils.extend({}, user, { openid: _openid });
      //存session
      session.set(user)
      success(user)
    },
    fail: err => {
      console.error('[云函数] [addUser] 调用失败', err)
      session.clear()
      fail(err)
    }
  });

}

var getUserByIds = function (_openids, success, fail) {
  wx.cloud.callFunction({
    name: 'getUserById',
    data: { openids: JSON.stringify(_openids)},
    success: res => {
      console.log('[云函数] [getUserByIds] getUserByIds: ', res)
      if (!res.result || !res.result.data){
        fail(res)
      }
      let _data = res.result.data
      let _result = []
      _data.map(function(value, index){
        _result.push(utils.extend({}, value.userInfo, { openid: value.openid }))
      })
      success(_result)
    },
    fail: err => {
      console.error('[云函数] [getUserByIds] 调用失败', err)
      fail(err)
    }
  });
}

module.exports = {
  addUser,
  getUserByIds,
}