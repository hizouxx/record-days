// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
  // const wxContext = cloud.getWXContext()

  try {
    return await db.collection('log').add({
      data: {
        openid: event.openid,
        nickName: event.nickName,
        avatarUrl: event.avatarUrl,
        createTime: event.createTime,
        remark: event.remark,
      }
    })
  } catch (err) {
    console.log(err)
  }
}