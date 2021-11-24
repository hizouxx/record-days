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
    return await db.collection('plan').add({
      data: {
        openid: event.openid,
        nickName: event.nickName,
        avatarUrl: event.avatarUrl,
        createTime: event.createTime, // 创建日期
        year: event.year,
        plan: event.plan,
        remark: event.remark,
        achieve: event.achieve, // 是否实现
        achieveDate: event.achieveDate, // 实现日期
      }
    })
  } catch (err) {
    console.log(err)
  }
}
