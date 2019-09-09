const sdk = require('../../../../vendor/rob-web-sdk/index.js')
const utils = require('../../../../vendor/rob-web-sdk/libs/utils.js')
//获取应用实例
const app = getApp()

Page({
  data: {
    faceUrl: '/image/noneface.png',
    isMe:true,
    isFollow:false,

    isSelectdWork:"video-info-selected",
    isSelectdLike:"",
    isSelectdFollow:"",
    // 作品
    myVideoList:[],
    myVideoPage:1,
    myVideoTotal:1,
   //收藏
    waitVideoList:[],
    waitVideoPage:1,
    waitVideoTotal:1,
    // 关注
    followVideoList:[],
    followVideoPage:1,
    followVideoTotal:1,
    //列表展示
    myWorkFalg:false,
    myLikesFalg:true,
    myFollowFalg:true,

    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    loginStatus: false,
    openid: null,
    userInfo: null,
    imageExt: '.jpg?x-oss-process=style/348-225-scale3',
    displayDemo: true,
    needLogin: true, //判断进入这个页面的用户是否需要登录
  },
  onLoad:function(options){
    this.setData({
      displayDemo: app.globalData.displayDemo
    })
    let userInfoStr = options.userInfo
    if (userInfoStr){
      let _userInfo = JSON.parse(userInfoStr)
      this.setData({
        needLogin: false,
        userInfo: _userInfo,
        openid: _userInfo.openid,
      })
      this.doSelectWork();
    }else{
      //首次加载查询
      var that = this;
      if (!app.globalData.hasLogin) {
        app.getUserInfo(function (res) {
          if (!res || !res.openid){
            return
          }
          console.log('login success!')
          let _user = sdk.getSession()
          that.setData({
            userInfo: _user,
            openid: _user.openid,
            loginStatus: true,
            faceUrl: _user.avatarUrl
          });
          console.log("image url:", sdk.HOST_MEDIAT_URL + '/trans_asr_img/')
          that.doSelectWork();
        }, function (err) {
          console.log('login fail!')
        })
        // app.getUserOpenId(function (err, _openid) {
        // });
      }else{
        let _userInfo = app.globalData.userInfo
        that.setData({
          userInfo: _userInfo,
          openid: _userInfo.openid,
          loginStatus: true,
          faceUrl: _userInfo.avatarUrl
        });
        that.doSelectWork();
      }
    }
  },
  //关注点击和非关注点击
  followMe:function(e){
     
  },
  //登录退出
  logout:function(){
    
  }, 
  // 更换头像
  changeFace:function(){
   
  },
  onReady(){
    if (!this.data.displayDemo) {
      wx.setNavigationBarTitle({
        title: "用户视频浏览",
      })
    }
  },
  uploadVideo:function(){
    //调用工具类中的上传组件
    wx.redirectTo({
      url: '/page/lenglish/pages/add/add',
    })
  },
  // 动态tob
  // 作品
  doSelectWork:function(){
    this.setData({
      isSelectdWork: "video-info-selected",
      isSelectdLike: "",
      isSelectdFollow: "",  
      // 作品
      myVideoList: [],
      myVideoPage: 1,
      myVideoTotal: 1,
      //收藏
      likeVideoList: [],
      likeVideoPage: 1,
      likeVideoTotal: 1,
      // 关注
      followVideoList: [],
      followVideoPage: 1,
      followVideoTotal: 1,
      //列表展示
      myWorkFalg: false,
      myLikesFalg: true,
      myFollowFalg: true
    });
    this.getMyVideoWork(1);
  },
  doSelectWait: function () {
    this.setData({
      isSelectdWork: "",
      isSelectdLike: "video-info-selected",
      isSelectdFollow: "",
      // 作品
      myVideoList: [],
      myVideoPage: 1,
      myVideoTotal: 1,
      //待发布作品
      waitVideoList: [],
      waitVideoPage: 1,
      waitVideoTotal: 1,
      // 关注
      followVideoList: [],
      followVideoPage: 1,
      followVideoTotal: 1,
      //列表展示
      myWorkFalg: true,
      myLikesFalg: false,
      myFollowFalg: true
    });
    this.getMyVideoWait(1);
  },
  //收藏
  doSelectLike: function () {
    
  },
  //关注
  doSelectFollow: function () {
    
  },
  // 作品查询
  getMyVideoWork(page){
    var thar = this;
    wx.showLoading();
    sdk.listMyAv(this.data.openid, function(res){
      console.log("listMyAv", res)
      //隐藏加载图
      wx.hideLoading();
      var data = res.data;
      var myVideoList = data;
      var newVideoList = thar.data.myVideoList;
      if (res.code === 200) {
        let newList = newVideoList.concat(myVideoList)
        console.log('newList:', newList)
        thar.setData({
          myVideoPage: page,
          myVideoList: newList,
          serverUrl: sdk.HOST_MEDIAT_URL +'/trans_asr_img/',
        })
      }
    })
  },
  // 待发布作品查询
  getMyVideoWait(page) {
    var thar = this;
    wx.showLoading();
    sdk.listPreAv(this.data.openid, function (res) {
      console.log("listPreAv", res)
      //隐藏加载图
      wx.hideLoading();
      var data = res.data;
      var myVideoList = thar.filterWaitData(data);
      var newVideoList = thar.data.waitVideoList;
      if (res.code === 200) {
        let newList = newVideoList.concat(myVideoList)
        console.log('newList:', newList)
        thar.setData({
          waitVideoPage: page,
          waitVideoList: newList,
          serverUrl: sdk.HOST_MEDIAT_URL + '/trans_asr_img/',
        })
      }
    })
  },
  filterWaitData(data) {
    let result = []
    if (data){
      data.map(function(item, index){
        if (!item['down_btn']){
          result.push(item)
        }
      })
    }
    return result
  },
  //收藏查询
  getListVideoList(page) {
    
  },
  //上拉加载
  onReachBottom: function () {
    //that.doSelectWork();
  },
  //点击作品或收藏图片则打开视频
  showVideo:function(e){
    var videoList = this.data.myVideoList;
    //获取视频下标
    var arrindx = e.target.dataset.arrindex;
    //将json对象转换为字符串
    var videoInfo = JSON.stringify(videoList);
    //跳转视频播放页面并进行播放
    wx.navigateTo({
      url: '/page/lenglish/pages/viewvideo/viewvideo?videoInfo=' + videoInfo + '&current='+ arrindx,
    })
  },
  editVideo: function (e) {
    //跳转到字幕处理页面
    console.log('跳转到字幕处理页面')
    var videoList = this.data.waitVideoList;
    var arrindx = e.target.dataset.arrindex;
    var _video = videoList[arrindx]
    if (_video){
      wx.navigateTo({
        url: '/page/lenglish/pages/editsrt/editsrt?url=' + _video['url'] + '&lang=' + _video['lang'] + '&id=' + _video['id'],
      })
    }else{
      wx.showToast({
        title: '没有响应！',
        icon: 'none'
      })
    }
  },
  bindGetUserInfo: function (e) {
    console.log(e.detail)
    let role = e.target.dataset.role
    let that = this
    let user = e.detail.userInfo
    if (user) {
      //
      console.info(user)
      that.addUser(user)
    } else {
      sdk.clearSession()
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
          openid: _openid,
          userInfo: user,
          loginStatus: true
        });
        app.globalData.openid = user.openid
        app.globalData.hasLogin = true
        app.globalData.userInfo = user
        that.doSelectWork();
      },
      fail: err => {
        console.error('[云函数] [addUser] 调用失败', err)
        sdk.clearSession()
        that.setData({
          loginStatus: false
        });
      }
    });
  }

})
