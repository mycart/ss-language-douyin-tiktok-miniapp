const sdk = require('../../../../vendor/rob-web-sdk/index.js')
const utils = require('../../../../vendor/rob-web-sdk/libs/utils.js')
//获取应用实例
const app = getApp()

Page({
  data: {
    faceUrl: '/image/noneface.png',

    isSelectdTt:"video-info-selected",
    isSelectdDy:"",
    videoList: [],
    // TT作品
    ttVideoList:[],
    ttVideoPage:1,
    ttVideoTotal:1,
   // DY作品
    dyVideoList:[],
    dyVideoPage:1,
    dyVideoTotal:1,
    //列表展示
    myTtFalg:false,
    myDyFalg:true,
    //分页key标记
    markKey:'',
    displayPlayer:false,
    autoPlay: false,
    ttLoadEnd: false,
    dyLoadEnd: false,
    lang: 'en',
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
  },
  onLoad:function(options){
    this.setData({
      displayDemo: app.globalData.displayDemo
    })
    this.doSelectTt()
  },
  onReady(){
    if (!this.data.displayDemo) {
      wx.setNavigationBarTitle({
        title: "热门视频",
      })
    }
    this.vvideo = wx.createVideoContext("kdvideo", this)
  },
  
  // 动态tt
  // 作品
  doSelectTt:function(){
    this.setData({
      isSelectdTt: "video-info-selected",
      isSelectdDy: "",
      videoList: [],
      displayPlayer: false,
      // 作品
      ttVideoList: [],
      ttVideoTotal: 1,
      //收藏
      dyVideoList: [],
      dyVideoTotal: 1,
     
      //列表展示
      myTtFalg: false,
      myDyFalg: true,
      ttLoadEnd: false,
      dyLoadEnd: false,
      markKey: '',
      lang: 'en',
    });
    this.getTtVideo();
  },
  doSelectDy: function () {
    this.setData({
      isSelectdTt: "",
      isSelectdDy: "video-info-selected",
      videoList: [],
      displayPlayer: false,
      // TT作品
      ttVideoList: [],
      ttVideoPage: 1,
      ttVideoTotal: 1,
      // DY作品
      dyVideoList: [],
      dyVideoPage: 1,
      dyVideoTotal: 1,

      //列表展示
      myTtFalg: true,
      myDyFalg: false,

      ttLoadEnd: false,
      dyLoadEnd: false,
      markKey: '',
      lang: 'cn',
    });

    this.getDyVideo();
  },
  // 作品查询
  getTtVideo(){
    var that = this;
    if (that.data.ttLoadEnd){
      return
    }
    wx.showLoading();
    sdk.listtt(this.data.markKey, this.data.lang, function(res){
      console.log("listtt", res)
      //隐藏加载图
      wx.hideLoading();
      var myVideoList = res;
      var newVideoList = that.data.ttVideoList;
      if (res) {
        let newList = newVideoList.concat(myVideoList)
        console.log('newList:', newList)
        that.setData({
          ttVideoList: newList,
          videoList: newList,
        })
      }
      if (myVideoList.length>0){
        var _mark = myVideoList[myVideoList.length-1]
        if (_mark){
          that.setData({
            markKey: _mark.key,
          })
        }
      }else{
        that.setData({
          ttLoadEnd: true,
        })
      }
    
    }, function(res){
      console.log('complete')
      wx.hideLoading()
    })
  },
  getDyVideo() {
    var that = this;
    if (that.data.dyLoadEnd) {
      return
    }
    wx.showLoading();
    sdk.listtt(this.data.markKey, this.data.lang, function (res) {
      console.log("listtt", res)
      //隐藏加载图
      wx.hideLoading();
      var myVideoList = res;
      var newVideoList = that.data.dyVideoList;
      if (res) {
        let newList = newVideoList.concat(myVideoList)
        console.log('newList:', newList)
        that.setData({
          dyVideoList: newList,
          videoList: newList,
        })
      }
      if (myVideoList.length > 0) {
        var _mark = myVideoList[myVideoList.length - 1]
        if (_mark) {
          that.setData({
            markKey: _mark.key,
          })
        }
      } else {
        that.setData({
          dyLoadEnd: true,
        })
      }

    }, function (res) {
      console.log('complete')
      wx.hideLoading()
    })
  },
  //上拉加载
  onReachBottom: function () {
    if(this.data.lang == 'en'){
      this.getTtVideo();
    }else{
      this.getDyVideo();
    }
  },
  addVideo: function(e){
    var that = this
    wx.showModal({
      title: '提示',
      content: '是否选择此视频？',
      success(res) {
        if(res.confirm) {
          console.log('用户点击确定')
          //跳转到add页面传递视频Url参数
          var arrindx = e.target.dataset.arrindex;
          var videoList;
          if(that.data.lang == 'en'){
            videoList = that.data.ttVideoList;
          }else{
            videoList = that.data.dyVideoList;
          }
          var _video = videoList[arrindx]
          if (_video){
            wx.redirectTo({
              url: '/page/lenglish/pages/add/add?url=' + _video.video_url + '&lang=' + that.data.lang,
            })
          }
        } else if(res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  delVideo: function(e){
    //获取视频下标
    var that = this
    wx.showModal({
      title: '提示',
      content: '是否删除视频？',
      success(res) {
        if (res.confirm) {
          console.log('用户点击确定')
          var arrindx = e.target.dataset.arrindex;
          var videoList;
          if (that.data.lang == 'en') {
            videoList = that.data.ttVideoList;
          } else {
            videoList = that.data.dyVideoList;
          }
          var _video = videoList[arrindx]
          if (_video) {
            sdk.deltt(_video.key, function (res) {
              console.log("deltt success:", res)
              videoList = videoList.slice(arrindx + 1)
              that.setData({
                ttVideoList: videoList,
                videoList: videoList,
              })
            }, function (res) {
              console.log("deltt complete")
            })
          }
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
    
  },
  downVideo: function(e) {
    var that = this
    console.log('down video:', e.detail)
    wx.showModal({
      title: '提示',
      content: '确定下载视频？',
      success(res) {
        if (res.confirm) {
          console.log('用户点击确定')
          var arrindx = e.target.dataset.arrindex;
          var videoList;
          if (that.data.lang == 'en') {
            videoList = that.data.ttVideoList;
          } else {
            videoList = that.data.dyVideoList;
          }
          var _video = videoList[arrindx]
          wx.showLoading({
            title: '正在下载...',
          })
          if (_video) {
            wx.downloadFile({
              url: _video.video_url, //仅为示例，并非真实的资源
              success(res) {
                // 只要服务器有响应数据，就会把响应内容写入文件并进入 success 回调，
                // 业务需要自行判断是否下载到了想要的内容
                wx.hideLoading()
                if (res.statusCode === 200) {
                  console.log('download success')
                  wx.showToast({
                    title: '下载成功',
                    icon: 'success',
                    duration: 1500
                  })
                  //转移文件到相册目录
                  wx.saveVideoToPhotosAlbum({
                    filePath: res.tempFilePath,
                    success(res2) {
                      console.log(res2.errMsg)
                    }
                  })
                }else{
                  wx.showToast({
                    title: '下载失败',
                    icon: 'none',
                    duration: 1500
                  })
                }
              },
              complete(res) {
                wx.hideLoading()
              }
            })
          }
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  //点击作品或收藏图片则打开视频
  showVideo:function(e){
    console.log('show video:', e.detail)
    var that = this
    this.vvideo.stop()
    //获取视频下标
    var arrindx = e.target.dataset.arrindex;
    
    //将json对象转换为字符串
    this.setData({
      displayPlayer: true,
      videoIndex: arrindx,
      autoPlay: true,
    })

    setTimeout(function () {
      //将点击视频进行播放
      that.vvideo.requestFullScreen();
      that.vvideo.play();
    }, 500)
  },
 
  binderror: function(e) {
    console.log('binderror')
  },
  bindplay: function(e) {
    console.log('bindplay')
  },
  /**视屏进入、退出全屏 */
  fullScreen(e) {
    var isFull = e.detail.fullScreen;
    console.log('fullScreen:', e.detail)
    this.vvideo.stop();
    //视屏全屏时显示加载video，非全屏时，不显示加载video
    if(!isFull){
      this.setData({
        displayPlayer: false,
        autoPlay: false,
      })
    }
  }
})
