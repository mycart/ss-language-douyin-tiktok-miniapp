// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  try{
    const wxContext = cloud.getWXContext()
    const _userMsg = event.userMsg
    const db = cloud.database()
    if (!_userMsg){
      console.error('userinfo is empty!')
      return
    }
    console.log('_userMsg:' + JSON.stringify(_userMsg))
    await db.collection('user').add({
      // data 字段表示需新增的 JSON 数据
      data: {
        // _id: 'todo-identifiant-aleatoire', // 可选自定义 _id，在此处场景下用数据库自动分配的就可以了
        openid: wxContext.OPENID,
        userInfo: _userMsg
      },
      success: function (res) {
        // res 是一个对象，其中有 _id 字段标记刚创建的记录的 id
        console.log(JSON.stringify(res))
      }
    })
    return {openid: wxContext.OPENID}
  }catch(e){
    console.error(e)
  }
}