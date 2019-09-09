// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  try {
    const _openids = event.openids
    const _openid_array = JSON.parse(_openids)
    const db = cloud.database()
    const _ = db.command
    let promise = await db.collection('user').where({
      openid: _.in(_openid_array)
    }).get()
    console.log('promise:' + JSON.stringify(promise))
    return promise
  } catch (e) {
    console.error(e)
  }
}