var constants = require('./constants');
var utils = require('./utils');
var Session = require('./session');

// 添加 hideLoading 接口判断条件
// 如果在以下的接口，则执行 hideLoading 
// const loadingList = [
//     "/api/booknote/getBestNoteBook",
//     "/api/booknote/",
//     "/api/booknote/publishNoteByChapter"
// ]

var noop = function noop() {};

//Cookie: uid=wxwobot; sid=8f5aa86f-67b3-48db-add8-0ea53db88f0e
var buildAuthHeader = function buildAuthHeader(session) {
    var header = {};
    let cookie_str = 'pid=' + constants.PID
    header[constants.WX_HEADER_SKEY] = cookie_str;
    return header;
};

/***
 * @class
 * 表示请求过程中发生的异常
 */
var RequestError = (function () {
    function RequestError(type, message) {
        Error.call(this, message);
        this.type = type;
        this.message = message;
    }
    RequestError.prototype = new Error();
    RequestError.prototype.constructor = RequestError;
    return RequestError;
})();

var defaultOptions = {
  method: 'GET',
  dataType: 'json',
  fail: noop,
};

/**
 * @mehod
 * 向微信服务器发送请求，统一处理请求头，以及请求拦截操作，比如登录要求操作。
 * 统一处理部分返回业务错误码操作，比如登录错误的统一处理。
 * @param {string} options.url 此外部请求的url地址。
 * @param {string} options.data 此外部请求的请求参数。
 * @param {string} options.method 此外部请求的有效值：OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT。
 * @param {string} options.dataType 如果设为json，会尝试对返回的数据做一次 JSON.parse
 * @param {string} options.login 此外部请求是否需要提前登录。
 * @param {string} options.success 此外部请求成功后的回调函数，无此配置则默认一个noop回调。
 * @param {string} options.fail 此外部请求失败后的回调函数，无此配置则默认一个noop回调。
 * @param {string} options.complete 此外部请求完成后的回调函数，无此配置则默认一个noop回调。
 * @param {string} options.originHeader 此外部请求需要的HTTP头参数，无此配置则默认为空。
 */
function request(options) {
    if (typeof options !== 'object') {
        var message = '请求传参应为 object 类型，但实际传了 ' + (typeof options) + ' 类型';
        throw new RequestError(constants.ERR_INVALID_PARAMS, message);
    }
    options = utils.extend({}, defaultOptions, options);

    var requireLogin = options.login;
    var success = options.success || noop;
    var fail = options.fail || noop;
    var complete = options.complete || noop;
    var originHeader = options.header || {};

    // 成功回调
    var callSuccess = function (data, currentURL) {
      //console.info("callSuccess:" + JSON.stringify(data));
      success.apply(null, arguments);
      complete.apply(null, arguments);

      // hideLoading 接口判断条件
      // loadingList.forEach(item => {
      //     if (item === currentURL){
      //       hideLoading();
      //     }
      // })
    };

    // 失败回调
    var callFail = function (error, currentURL) {
        console.log("******** callback error **********")
        console.log(error)
        console.log(currentURL);
        console.log("******** callback error **********")
        fail.call(null, error);
        complete.call(null, error);
        let hideFlag = false;
        // hideLoading 接口判断条件
        // loadingList.forEach(item => {
        //     if (item === currentURL){
        //       hideFlag = true
        //       hideLoading();
        //     }
        // })

      if (!hideFlag){
        wx.showToast({
          title: '加载失败，请稍后再尝试',
          icon: 'none'
        })
      }
    };

    // 失败回调
    var callComplete = function () {
      complete.call(null, arguments);
    };

    // 是否已经进行过重试
    var hasRetried = false;
   
    checkNetWork();

    doRequest();

    function checkNetWork() {
      //检查网络设备
      wx.getNetworkType({
        success: function (res) {
          // 返回网络类型, 有效值：
          // wifi/2g/3g/4g/unknown(Android下不常见的网络类型)/none(无网络)
          var networkType = res.networkType
          if (networkType == 'none'){
            wx.showToast({
              title: '啊！网络不给力~',
              duration: 3000
            })
          }
        }
      })
    }

    // 实际进行请求的方法
    function doRequest() {
        var authHeader = buildAuthHeader(Session.get());
        var headerContent =  utils.extend({}, originHeader, authHeader);
        console.info("headerContent:" + JSON.stringify(headerContent));
        //console.log(extractURL(options.url));
        const currentURL = utils.extractURL(options.url)

        wx.request(utils.extend({}, options, {
            header: headerContent,
            success: function (response) {
                //console.info("response:" + JSON.stringify(response));
                var data = response.data;

                // 如果响应非200业务码表示出现业务错误
              if (response.statusCode != 200) {
                    var error, message;
                    if (data.code === constants.ERR_WX_NOT_LOGIN) {
                        // 如果是登录态无效，并且还没重试过，会尝试登录后刷新凭据重新请求   
                        // 清除登录态
                        Session.clear();
                        if (!hasRetried) {
                            hasRetried = true;
                            //跳转登录页
                            console.info("retry login");
                            wx.reLaunch({
                              url: '/page/lenglish/pages/mine/mine',
                            });
                            // doLogin(options);
                            return;
                        }
                        message = '登录态已过期';
                        error = new RequestError(data.code, message);
                    } else {
                        message = data.message;
                        if (!message){
                          message = '未知错误';
                        }
                        error = new RequestError(data.code, message);
                    }
                    callFail(error, currentURL);
                    return;
                }
                callSuccess(data, currentURL);
            },

            fail: callFail,
            complete: callComplete,
        }));
    };

};

module.exports = {
    RequestError: RequestError,
    request: request,
};