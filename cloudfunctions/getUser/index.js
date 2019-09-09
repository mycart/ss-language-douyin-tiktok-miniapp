// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  try {
    const wxContext = cloud.getWXContext()
    const _openid = wxContext.OPENID
    const db = cloud.database()
    let promise = await db.collection('user').where({
      openid: _openid
    }).limit(1).get()
    console.log('promise:' + JSON.stringify(promise))
    if (_openid == 'ohDuv4vf6o5W8dNqo8J1Hx4CUnaI'){
      promise.data[0]['isadmin'] = true
    }else{
      promise.data[0]['isadmin'] = false
    }
    return promise
  } catch (e) {
    console.error(e)
  }
}