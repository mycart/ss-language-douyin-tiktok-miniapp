const sdk = require('../../../../vendor/rob-web-sdk/index.js')
//获取应用实例
const app = getApp()

function getRandomColor() {
  const rgb = []
  for (let i = 0; i < 3; ++i) {
    let color = Math.floor(Math.random() * 256).toString(16)
    color = color.length === 1 ? '0' + color : color
    rgb.push(color)
  }
  return '#' + rgb.join('')
}

Page({

  onReady() {
    this.videoContext = wx.createVideoContext('myVideo')
  },

  inputValue: '',
  data: {
    src: '',
    openid: null,
    srtCnList: [],
    srtEnList: [],
    srtCnEnList: [],
    disabledList: [],
    lang:'cn',
    checkPoint: null,
    processed: false,
    displayDemo: true,
  },
  onLoad: function (params) {
    this.setData({
      displayDemo: app.globalData.displayDemo
    })
    let that = this
    let video_url = params.url
    if (params.id){
      that.setData({
        openid: params.id
      })
    }else{
      that.setData({
        openid: app.globalData.openid
      })
    }
    if (params.lang){
      that.setData({
        lang: params.lang
      })
    }
    if (video_url){
      that.setData({
        src: decodeURIComponent(video_url)
      })
    }
    if (that.data.openid && video_url){
      sdk.editSrt(that.data.openid, video_url, function(res){
        console.log('editSrt', res)
        let json_str = res.data['json_str']
        let exists = res.data['exists']

        if (json_str){
          let srt_str_list = JSON.parse(json_str)
          let zh_content_list= []
          let en_content_list = []
          let zh_en_content_list = []
          let _disabledList = that.data.disabledList
          srt_str_list.map(function(value, index){
            let zh_en_content = value.content.split('<br>')
            let zh_content = ''
            for (var i = 0; i < zh_en_content.length - 1; i++) {
              zh_content += zh_en_content[i]
            }
            let en_content = zh_en_content[zh_en_content.length - 1]
            value['cn'] = zh_content
            value['en'] = en_content
            zh_content_list.push(zh_content)
            en_content_list.push(en_content)
            zh_en_content_list.push(value)
            _disabledList.push(true)
          })
          that.setData({
            srtCnList: zh_content_list,
            srtEnList: en_content_list,
            srtCnEnList: zh_en_content_list,
            disabledList: _disabledList,
            processed: exists,
          })
        }
      })
    }
  },
  onReady(){
    if (!this.data.displayDemo) {
      wx.setNavigationBarTitle({
        title: "字幕纠正",
      })
    }
  },
  goEdit(e){
    let select_index = e.currentTarget.dataset.index
    let _disabledList = this.data.disabledList
    _disabledList[select_index] = false
    console.log(select_index, _disabledList)
    this.setData({
      disabledList: _disabledList,
    })
  },
  bindTextAreaBlur2(e){
    let select_index = e.currentTarget.dataset.index
    let _disabledList = this.data.disabledList
    let _value = e.detail.value
    let _lang = this.data.lang
    //对数据赋值
    let tmp_cn_list = this.data.srtCnList
    let tmp_en_list = this.data.srtEnList
    let tmp_cn_en_list = this.data.srtCnEnList
    if(_lang == 'cn'){
      tmp_cn_en_list[select_index].en = _value
      tmp_en_list[select_index] = _value
    }else{
      tmp_cn_en_list[select_index].cn = _value
      tmp_cn_list[select_index] = _value
    }
    _disabledList[select_index] = true
    this.setData({
      disabledList: _disabledList,
      srtCnList: tmp_cn_list,
      srtEnList: tmp_en_list,
      srtCnEnList: tmp_cn_en_list,
    })
  },
  bindTextAreaBlur(e) {
    console.log('bindTextAreaBlur事件，携带数据为：', e.detail.value, e.currentTarget.dataset.index)
    let select_index = e.currentTarget.dataset.index
    let that = this
    if (that.data.lang == 'en'){
      if (that.data.srtEnList[select_index] == e.detail.value){
        console.log('字符没有发生变化1')
        return
      }
    }
    if (that.data.lang == 'cn') {
      if (that.data.srtCnList[select_index] == e.detail.value) {
        console.log('字符没有发生变化2')
        return
      }
    }

    sdk.transLang(e.detail.value, this.data.lang, function(res){
      console.log("trans result", res)
      let tmp_en_cn_list = []
      let tmp_cn_list = that.data.srtCnList
      let tmp_en_list = that.data.srtEnList
      that.data.srtCnEnList.map(function(value, index){
        if (index == select_index && that.data.lang=='en'){
          value['cn'] = res.data
          value['en'] = e.detail.value
          tmp_cn_list[index] = res.data
          tmp_en_list[index] = e.detail.value
        } else if (index == select_index && that.data.lang == 'cn'){
          value['en'] = res.data
          value['cn'] = e.detail.value
          tmp_cn_list[index] = e.detail.value
          tmp_en_list[index] = res.data
        }
        tmp_en_cn_list.push(value)
      })
      that.setData({
        srtCnEnList: tmp_en_cn_list,
        srtCnList: tmp_cn_list,
        srtEnList: tmp_en_list,
      })
    })
  },
  
  formSubmit(e) {
    console.log('form发生了submit事件，携带数据为：', e.detail.value)
    var that = this
    wx.showModal({
      content: '只有一次提交字幕机会，请确认字幕纠正完毕?',
      confirmText: '确定',
      cancelText: '取消',
      success(res) {
        if (res.confirm) {
          console.log('用户点击确定')
          // 调用接口处理
          wx.showLoading({
            title: '正在烧制字幕!',
          })
          that.setData({
            processed: true
          })
          let zh_json_str = JSON.stringify(that.data.srtCnList)
          let en_json_str = JSON.stringify(that.data.srtEnList)
          sdk.submitSrt(that.data.openid,
            that.data.src, zh_json_str, en_json_str, that.data.lang, function (res) {
              console.log("submitSrt", res)
            })
          let _checkPoint = setInterval(that.checkSched, 5000);
          that.setData({
            checkPoint: _checkPoint
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  checkSched: function () {
    // 调用接口检查
    var that = this
    sdk.checkProSchedVideoFile(this.data.openid, this.data.src, function (res) {
      console.log(res)
      if (res.code == 200) {
        wx.hideLoading()
        if (that.data.checkPoint) {
          clearInterval(that.data.checkPoint);
          that.setData({
            checkPoint: null
          })
          //跳转到我的页面
          console.log('跳转到我的页面')
          wx.redirectTo({
            url: '/page/lenglish/pages/mine/mine',
          })
        }
      }
    })
  },
  videoErrorCallback(e) {
    console.log('视频错误信息:')
    console.log(e.detail.errMsg)
  }
})
