
/**
 * 拓展对象
 */
exports.extend = function extend(target) {
    var sources = Array.prototype.slice.call(arguments, 1);

    for (var i = 0; i < sources.length; i += 1) {
        var source = sources[i];
        for (var key in source) {
            if (source.hasOwnProperty(key)) {
                target[key] = source[key];
            }
        }
    }

    return target;
};

exports.removeEmptyProperty = function removeEmptyProperty (obj) {
  for (var prop in obj) {
    if (obj[prop] === null || obj[prop] === '') {
      delete obj[prop]
    }
  }
  return obj;
}

// 获取域名后的接口地址
// 例如 https://request.kdk.igrowiser.com/api/taskexecs/listTaskExecByTeacher
// 会被截取为 /api/taskexecs/listTaskExecByTeacher
exports.extractURL = function extractURL(url) {
  let urlModified = url.split('//')[1].split('/');
  urlModified.splice(0, 1);
  let temp = '';
  urlModified.forEach(item => {
    temp += '/' + item;
  });

  urlModified = temp;
  return urlModified;
}