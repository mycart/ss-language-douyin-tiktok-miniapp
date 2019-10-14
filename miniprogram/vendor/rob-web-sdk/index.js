const constants = require('./libs/constants');
const Session = require('./libs/session');
const request = require('./libs/request');
const index = require('./libs/index');
const upload = require('./libs/upload');
const user = require('./libs/user');
const oss = require('./libs/oss');


var exports = module.exports = {
  //--------------登录与基础服务相关----------------
  session: Session,
  getSession: Session.get,
  setSession: Session.set,
  clearSession: Session.clear,
  //请求类
  request: request.request,
  RequestError: request.RequestError,

  //--------------业务相关----------------
  ...index,
  ...upload,
  ...user,
  ...oss,
};

// 导出错误类型码
Object.keys(constants).forEach(function (key) {
  if (key.indexOf('ERR_') === 0 || key.indexOf('HOST') === 0) {
    exports[key] = constants[key];
  }
});