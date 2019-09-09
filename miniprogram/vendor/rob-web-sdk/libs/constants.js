var HOST_MEDIA = 'media.soso88.org'
var HOST = '127.0.0.1:8080'
var PROTOCOL = 'http'

var constants = {
  // 服务器地址
  HOST,
  PID: '10086',
  HOST_MEDIAT_URL: `${PROTOCOL}://${HOST_MEDIA}`,
  OSS_POLICY: `${PROTOCOL}://${HOST}/oss/policy`,

  //index 
  INDEX_LIST_ALL_AV: `${PROTOCOL}://${HOST}/trans/listpidav`,//获取所有平台的视频列表
  INDEX_LIST_PRE_AV: `${PROTOCOL}://${HOST}/trans/listav`,//获取某个用户的未处理的视频列表
  INDEX_LIST_MY_AV: `${PROTOCOL}://${HOST}/trans/listmyav`,//获取某个用户已处理的视频列表
  INDEX_CHECK_FILE: `${PROTOCOL}://${HOST}/trans/checkfile`,//检查视频预处理进度
  INDEX_CHECK_SCHED: `${PROTOCOL}://${HOST}/trans/checksched`,//检查视频合成处理进度
  INDEX_PRE_AV: `${PROTOCOL}://${HOST}/trans/preav`,//提出处理视频请求
  INDEX_EDIT_SRT: `${PROTOCOL}://${HOST}/trans/editsrt`,//字幕编辑纠错
  INDEX_TRANS_LANG: `${PROTOCOL}://${HOST}/trans/translang`,//字幕翻译
  INDEX_TRANS_VERSION: `${PROTOCOL}://${HOST}/trans/version`,//获取版本
  
  INDEX_TRANS_LISTTT: `${PROTOCOL}://${HOST}/trans/listtt`,//获取热门视频列表
  INDEX_TRANS_DELTT: `${PROTOCOL}://${HOST}/trans/deltt`,//删除人们视频

  //like
  LIKE_ADD: `${PROTOCOL}://${HOST}/trans/like`,

  //comment
  COMMENT_ADD: `${PROTOCOL}://${HOST}/trans/comment`,


  WX_HEADER_SKEY: 'Cookie',
  WX_SESSION_BAND: 'weapp_session_bandwx_info',

  ERR_INVALID_PARAMS: 'ERR_INVALID_PARAMS',
  ERR_WX_NOT_LOGIN: 50002001,
  ERR_WX_GET_USER_INFO: 'ERR_WX_GET_USER_INFO',
  ERR_LOGIN_TIMEOUT: 'ERR_LOGIN_TIMEOUT',
  ERR_LOGIN_FAILED: 'ERR_LOGIN_FAILED',
  ERR_LOGIN_SESSION_NOT_RECEIVED: 'ERR_LOGIN_MISSING_SESSION',

  ERR_INVALID_SESSION: 'ERR_INVALID_SESSION',
  ERR_CHECK_LOGIN_FAILED: 'ERR_CHECK_LOGIN_FAILED'
};

module.exports = constants;