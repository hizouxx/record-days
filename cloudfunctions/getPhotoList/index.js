// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

const db = cloud.database()
const _ = db.command

// 云函数入口函数
exports.main = async (event, context) => {
  // const wxContext = cloud.getWXContext()

  return await db.collection('photo-wall').where({
    openid: _.in(event.couple)
  }).orderBy('createTime', 'desc').field({
    _id: true,
    nickName: true,
    avatarUrl: true,
    createTime: true,
    total: true,
    name: true
  }).get()
}