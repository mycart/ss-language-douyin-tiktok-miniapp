const sdk = require('../../../../vendor/rob-web-sdk/index.js')
const utils = require('../../../../vendor/rob-web-sdk/libs/utils.js')
//获取应用实例
const app = getApp()

Page({
  data: {
    items: [
      { value: 'cn', name: '中文', checked: 'true' },
      { value: 'en', name: '英文' },
    ],
    url: null,
    lang: 'cn',
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    loginStatus: true,
    openid: null,
    isadmin: false,
    checkPoint: null
  },
  onLoad: function (params) {
    let that = this
    this.setData({
      displayDemo: app.globalData.displayDemo
    })

    if (!app.globalData.hasLogin) {
      app.getUserInfo(function (res) {
        console.log('login success!')
        that.setData({
          loginStatus: true,
          isadmin: app.globalData.isadmin,
          openid: app.globalData.openid
        });
      }, function (err) {
        console.log('login fail!')
        that.setData({
          loginStatus: false,
          openid: null
        });
      })
    }else{
      that.setData({
        loginStatus: true,
        isadmin: app.globalData.isadmin,
        openid: app.globalData.openid
      });
    }
    // 通过选定的方式获取视频
    var _video_url = params.url
    var _lang = params.lang
    if (_video_url && _lang){
      console.log('_video_url:', _video_url)
      const items = this.data.items
      for (let i = 0, len = items.length; i < len; ++i) {
        items[i].checked = items[i].value == _lang
      }
      that.setData({
        url: _video_url,
        lang: _lang,
        items,
      })
      wx.showLoading({
        title: '正在字幕分析!',
        mask: true,
      })

      sdk.preAv(that.data.openid, _video_url, _lang, function (res) {
        console.log('服务器字幕分析正在处理', res)
      })
      let _checkPoint = setInterval(that.checkSched, 5000);
      that.setData({
        checkPoint: _checkPoint
      })
    }
  },
  onReady() {
    if (!this.data.displayDemo) {
      wx.setNavigationBarTitle({
        title: "上传作品",
      })
    }
  },
  radioChange(e) {
    console.log('radio发生change事件，携带value值为：', e.detail.value)
    const items = this.data.items
    for (let i = 0, len = items.length; i < len; ++i) {
      items[i].checked = items[i].value === e.detail.value
    }

    this.setData({
      items,
      lang: e.detail.value
    })
  },
  choiceVideo: function(e) {
    wx.navigateTo({
      url: '/page/lenglish/pages/listtt/listtt',
    })
  },
  uploadVideo: function (e) {
    //调用工具类中的上传组件
    var that = this
    // wx.showModal({
    //   content: '确认视频文件的语种选择正确?',
    //   confirmText: '确定',
    //   cancelText: '取消',
    //   success(res) {
    //     if (res.confirm) {
    //       console.log('用户点击确定')
    //     } else if (res.cancel) {
    //       console.log('用户点击取消')
    //     }
    //   }
    // })

    sdk.video2local(function (res) {
      var file_list = res.fileList
      if (file_list) {
        var downloadUrl = file_list[0].tempFileURL
        console.log(downloadUrl)
        that.setData({
          url: downloadUrl
        })
        // 调用接口处理
        wx.showLoading({
          title: '正在字幕分析!',
          mask: true,
        })
        
        sdk.preAv(that.data.openid, downloadUrl, that.data.lang, function (res) {
          console.log('服务器字幕分析正在处理', res)
        })
        let _checkPoint = setInterval(that.checkSched, 5000);
        that.setData({
          checkPoint: _checkPoint
        })
      }
    }, function (res) {
      console.log('end.')
    })
  },
  checkSched: function() {
    // 调用接口检查
    var that = this
    sdk.checkPreSchedVideoFile(this.data.openid, function (res) {
      console.log(res)
      if (res.code == 200) {
        wx.hideLoading()
        if (that.data.checkPoint) {
          clearInterval(that.data.checkPoint);
          that.setData({
            checkPoint: null
          })
          //跳转到字幕处理页面
          console.log('跳转到字幕处理页面')
          wx.navigateTo({
            url: '/page/lenglish/pages/editsrt/editsrt?url=' + that.data.url + '&lang=' + that.data.lang,
          })
        }
      }
    })
  },
  bindGetUserInfo: function (e) {
    console.log(e.detail)
    let role = e.target.dataset.role
    let that = this
    let user = e.detail.userInfo
    if (user) {
      console.info(user)
      that.addUser(user)
    } else {
      sdk.clearSession()
      that.setData({
        loginStatus: false,
        openid: null
      });
    }
  },
  addUser: function (user) {
    let that = this
    wx.cloud.callFunction({
      name: 'addUser',
      data: { userMsg: user },
      success: res => {
        console.log('[云函数] [addUser] addUser: ', res)
        let _openid = res.result.openid
        user = utils.extend({}, user, { openid: _openid });
        //请求rob的随机登录
        sdk.setSession(user)
        that.setData({
          loginStatus: true,
          openid: user.openid
        });
        app.globalData.openid = user.openid
        app.globalData.hasLogin = true
        app.globalData.userInfo = user
      },
      fail: err => {
        console.error('[云函数] [addUser] 调用失败', err)
        sdk.clearSession()
        that.setData({
          loginStatus: false
        });
      }
    });
  },
  onUnload: function(){
    clearInterval(this.data.checkPoint);
  }
})
