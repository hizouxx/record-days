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

  // 云函数读取超过100条限制，若数据量超过100需要一次全部获取

  // 获取数据总个数
  let count = await db.collection('piggy-bank').where({
    openid: _.in(event.couple),
    createTime: _.gte(event.dateStart).and(_.lt(event.dateEnd))
  }).count()
  count = count.total
  // 通过循环做多次请求，并把多次请求的数据放到一个数组里
  let all = []
  for (let index = 0; index < count; index += 100) {
    const list = await db.collection('piggy-bank').where({
      openid: _.in(event.couple),
      createTime: _.gte(event.dateStart).and(_.lt(event.dateEnd))
    }).orderBy('createTime', 'desc').skip(index).get()
    all = all.concat(list.data)
  }
  return all
}