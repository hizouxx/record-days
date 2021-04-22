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
    return await db.collection('wish').where({
      _id: event.id
    }).update({
      data:{
        achieve: event.achieve,
        achieveDate: event.achieveDate,
      }
    })
  } catch (err) {
    console.log(err)
  }
}