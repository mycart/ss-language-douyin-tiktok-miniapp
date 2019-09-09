const config = require('./config')
const sdk = require('./vendor/rob-web-sdk/index.js')
const utils = require('./vendor/rob-web-sdk/libs/utils.js');

App({
  onLaunch(opts) {
    console.log('App Launch', opts)
    let that =  this
    try{
      sdk.version(function(res){
        that.globalData.displayDemo = res
      }, function(res2){
        console.log('version complete:', res2)
      })
    }catch(error){
      console.log('version error:', error)
    }
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力')
    } else {
      wx.cloud.init({
        env: config.envId,
        traceUser: true,
      })

      //判定用户以前是否有登录操作
      if (sdk.getSession() && !this.globalData.hasLogin){
        this.getUserInfo(function(res){
          console.log('app load login success')
        }, function(err){
          console.log('app load login error')
        })
      }
    }

  },
  onShow(opts) {
    console.log('App Show', opts)
  },
  onHide() {
    console.log('App Hide')
  },
  globalData: {
    displayDemo: true,
    hasLogin: false,
    openid: null,
    isadmin: false,
    userInfo: null
  },
  // lazy loading openid
  getUserOpenId(callback) {
    const self = this

    if (self.globalData.openid) {
      callback(null, self.globalData.openid)
    } else {
      wx.login({
        success(data) {
          wx.request({
            url: config.openIdUrl,
            data: {
              code: data.code
            },
            success(res) {
              console.log('拉取openid成功', res)
              self.globalData.openid = res.data.openid
              callback(null, self.globalData.openid)
            },
            fail(res) {
              console.log('拉取用户openid失败，将无法正常使用开放接口等服务', res)
              callback(res)
            }
          })
        },
        fail(err) {
          console.log('wx.login 接口调用失败，将无法正常使用开放接口等服务', err)
          callback(err)
        }
      })
    }
  },
  // 通过云函数获取用户 openid，支持回调或 Promise
  getUserOpenIdViaCloud() {
    return wx.cloud.callFunction({
      name: 'wxContext',
      data: {}
    }).then(res => {
      this.globalData.openid = res.result.openid
      return res.result.openid
    })
  },
  getUserInfo: function (callSuccess, callFail) {
    const that = this
    wx.cloud.callFunction({
      name: 'getUser',
      data: {},
      success: res => {
        console.log('[云函数] [getUserInfo] getUserInfo: ', res)
        if (!res.result){
          callFail(res)
          return
        }
        let _data = res.result.data
        if (_data.length > 0){
          let _openid = _data[0].openid
          let user = utils.extend({}, _data[0].userInfo, { openid: _openid });
          //请求rob的随机登录
          sdk.setSession(user)
          that.globalData.openid = _data[0].openid
          that.globalData.hasLogin = true
          that.globalData.userInfo = user
          that.globalData.isadmin = _data[0].isadmin
          callSuccess(res)
        }else{
          callFail(res)
        }
      },
      fail: err => {
        console.error('[云函数] [getUserInfo] 调用失败', err)
        callFail(err)
      }
    });
  }
})
