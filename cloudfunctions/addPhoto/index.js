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
    return await db.collection('photo-wall').add({
      data: {
        openid: event.openid,
        nickName: event.nickName,
        avatarUrl: event.avatarUrl,
        createTime: event.createTime,// 照片集上传日期
        pictrueList: event.pictrueList, // 照片集地址列表
        total: event.total, // 照片集总数
        name: event.name, // 照片集名称
        mediaType: event.mediaType, // 照片类型 image/video
      }
    })
  } catch (err) {
    console.log(err)
  }
}