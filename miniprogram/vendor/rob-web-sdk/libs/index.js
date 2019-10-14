const constants = require('./constants');
const request = require('./request');
const utils = require('./utils');

var listPidAv = function (callback) {
  let _rd = Math.random()
  var options = {
    method: 'GET',
    url: constants.INDEX_LIST_ALL_AV,
    data: {
      rd: _rd
    },
    success: function (data) {
      callback(data);
    }
  };
  request.request(options);
}

var listMyAv = function (_id, callback) {
  let _rd = Math.random()
  var options = {
    method: 'GET',
    url: constants.INDEX_LIST_MY_AV,
    data: {
      id: _id,
      rd: _rd
    },
    success: function (data) {
      callback(data);
    }
  };
  request.request(options);
}

var listPreAv = function (_id, callback) {
  let _rd = Math.random()
  var options = {
    method: 'GET',
    url: constants.INDEX_LIST_PRE_AV,
    data: {
      id: _id,
      rd: _rd
    },
    success: function (data) {
      callback(data);
    }
  };
  request.request(options);
}

var checkUploadVideoFile = function (_fileName, _id, callback) {
  let _rd = Math.random()
  var options = {
    method: 'GET',
    url: constants.INDEX_CHECK_FILE,
    data: {
      fileName: _fileName,
      id: _id,
      rd: _rd
    },
    success: function (data) {
      callback(data);
    }
  };
  request.request(options);
}

var checkPreSchedVideoFile = function (_id, _url, callback) {
  let _rd = Math.random()
  var options = {
    method: 'GET',
    url: constants.INDEX_CHECK_SCHED,
    data: {
      id: _id,
      url: _url,
      type: 'pre',
      rd: _rd
    },
    success: function (data) {
      callback(data);
    }
  };
  request.request(options);
}

var checkProSchedVideoFile = function (_id, _url, callback) {
  let _rd = Math.random()
  var options = {
    method: 'GET',
    url: constants.INDEX_CHECK_SCHED,
    data: { 
      id: _id,
      url: _url,
      type:'pro',
      rd:_rd
    },
    success: function (data) {
      callback(data);
    }
  };
  request.request(options);
}

var preAv = function (_id, _download_url, _lang, callback) {
  var options = {
    method: 'GET',
    url: constants.INDEX_PRE_AV,
    data: {
      id: _id,
      url: encodeURIComponent(_download_url),
      lang: _lang
    },
    success: function (data) {
      callback(data);
    }
  };
  request.request(options);
}

var editSrt = function (_id, _url, callback) {
  var options = {
    method: 'GET',
    header: { 'contentType': 'application/json;charset=UTF-8'},
    url: constants.INDEX_EDIT_SRT,
    data: {
      id: _id,
      url: encodeURIComponent(_url),
    },
    success: function (data) {
      callback(data);
    }
  };
  request.request(options);
}

var transLang = function (_data, _lang, callback) {
  let _rd = Math.random()
  var options = {
    method: 'POST',
    header: { 'content-type': 'application/x-www-form-urlencoded' },
    url: constants.INDEX_TRANS_LANG,
    data: {
      lang: _lang,
      data: _data,
      rd: _rd,
    },
    success: function (data) {
      callback(data);
    }
  };
  request.request(options);
}

var submitSrt = function (_id, _url, _zh, _en, _lang, callback) {
  let _rd = Math.random()
  var options = {
    method: 'POST',
    header: { 'content-type': 'application/x-www-form-urlencoded' },
    url: constants.INDEX_EDIT_SRT,
    data: {
      id: _id,
      url: _url,
      zh: _zh,
      en: _en,
      lang: _lang,
      rd: _rd,
    },
    success: function (data) {
      callback(data);
    }
  };
  request.request(options);
}

var addLike = function (_data, callback){
  var options = {
    method: 'POST',
    url: constants.LIKE_ADD,
    data: _data,
    success: function (res) {
      //追加缓存
      let key = 'like_list'
      let likes = wx.getStorageSync(key) || [];
      likes.push(_data)
      wx.setStorageSync(key, likes);
      //回调
      callback(res);
    }
  };
  request.request(options);
}

var getLikeNum = function (_id, callback) {
  var options = {
    method: 'GET',
    url: constants.LIKE_ADD,
    data: {
      id: _id,
    },
    success: function (res) {
      if(res.code == 200){
        //回调
        callback(res.data);
      }else{
        console.log('getLikeNum error', res.msg)
      }
    }
  };
  request.request(options);
}

var delLike = function (_id, callback) {
  //删除缓存即可
  let key = 'like_list'
  let likes = wx.getStorageSync(key) || null;
  if (likes){
    likes = likes.filter(items => {
      if(items != _id){
        console.log('not del', items, _id)
        return items
      }
    })
    if (likes && likes.length>0){
      wx.setStorageSync(key, likes);
    }else{
      wx.removeStorageSync(key)
    }
  }
  callback(likes)
}

var isLike = function(_id, callback){
  let key = 'like_list'
  let likes = wx.getStorageSync(key) || null;
  let hasLike = false
  if (likes) {
    likes.map(function(item, index){
      if (item == _id){
        hasLike = true
      }
    })
  }
  callback(hasLike) 
}

var addComment = function (_data, callback) {
  var options = {
    method: 'POST',
    url: constants.COMMENT_ADD,
    data: _data,
    success: function (res) {
      //追加缓存
      let key = 'comment_list'
      let comments = wx.getStorageSync(key) || [];
      comments.push(_data)
      wx.setStorageSync(key, comments);
      //回调
      callback(res);
    }
  };
  request.request(options);
}

var listComment = function (_id, _page, callback, complete) {
  var options = {
    method: 'GET',
    url: constants.COMMENT_ADD,
    data: {
      id: _id,
      page: _page,
    },
    success: function (res) {
      if (res.code == 200) {
        //回调
        callback(res.data);
      } else {
        console.log('listComment error', res.msg)
      }
    },
    complete: function(res){
      complete(res)
    }
  };
  request.request(options);
}

var version = function (callback, complete) {
  var options = {
    method: 'GET',
    url: constants.INDEX_TRANS_VERSION,
    success: function (res) {
      callback(res.data);
    },
    complete: function (res) {
      complete(res)
    }
  };
  request.request(options);
}

var listtt = function (_mark_key, _lang, callback, complete) {
  var options = {
    method: 'GET',
    url: constants.INDEX_TRANS_LISTTT,
    data: {
      marker: _mark_key,
      lang: _lang,
    },
    success: function (res) {
      callback(res.data);
    },
    complete: function (res) {
      complete(res)
    }
  };
  request.request(options);
}

var deltt = function (_key, callback, complete) {
  var options = {
    method: 'GET',
    url: constants.INDEX_TRANS_DELTT,
    data: {
      key: _key,
    },
    success: function (res) {
      callback(res.data);
    },
    complete: function (res) {
      complete(res)
    }
  };
  request.request(options);
}

module.exports = {
  listPidAv,
  listMyAv,
  listPreAv,
  checkUploadVideoFile,
  checkPreSchedVideoFile,
  checkProSchedVideoFile,
  preAv,
  editSrt,
  submitSrt,
  transLang,
  addLike,
  getLikeNum,
  delLike,
  isLike,
  addComment,
  listComment,
  version,
  listtt,
  deltt,
};