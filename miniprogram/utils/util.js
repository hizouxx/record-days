/**
 * 日期时间格式化
 * @param {*} date 
 */
const formatDateTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('-') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}
/**
 * 日期格式化
 * 如：2020-01-01
 * @param {*} date 
 */
const formatDate = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()

  return [year, month, day].map(formatNumber).join('-')
}
/**
 * 日期格式化2
 * 如：2020.01.01
 * @param {*} date 
 */
const formatDate2 = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()

  return [year, month, day].map(formatNumber).join('.')
}
/**
 * 日期格式化3
 * 如：2020年01月01日
 * @param {*} date 
 */
const formatDate3 = date => {
  const year = date.getFullYear() + '年'
  const month = date.getMonth() + 1 + '月'
  const day = date.getDate() + '日'

  return [year, month, day].map(formatNumber).join('')
}
/**
 * 获取:当月的月首与月尾日期
 */
const getCurMonthStartAndEnd = () => {
  const year = new Date().getFullYear()
  const month = new Date().getMonth() + 1
  const monthStart = [year, month, 1].map(formatNumber).join('-')
  const monthEnd = month === 12 ? [year + 1, 1, 1].map(formatNumber).join('-') : [year, month + 1, 1].map(formatNumber).join('-')
  return {
    start: monthStart,
    end: monthEnd,
  }
}
/**
 * 获取:上月的月首与月尾日期
 */
const getLastMonthStartAndEnd = () => {
  const year = new Date().getFullYear()
  const month = new Date().getMonth()
  const monthStart = [year, month, 1].map(formatNumber).join('-')
  const monthEnd = month === 12 ? [year + 1, 1, 1].map(formatNumber).join('-') : [year, month + 1, 1].map(formatNumber).join('-')
  return {
    start: monthStart,
    end: monthEnd,
  }
}
/**
 * 获取:本年的年首与年尾日期
 */
const getCurYearStartAndEnd = () => {
  const year = new Date().getFullYear()
  const monthStart = [year, 1, 1].map(formatNumber).join('-')
  const monthEnd = [year + 1, 1, 1].map(formatNumber).join('-')
  return {
    start: monthStart,
    end: monthEnd,
  }
}
const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}
/**
 * 获得随机整数
 * @param {*} min 
 * @param {*} max 
 */
const getRandomInt = (min, max) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * 正则：1-12位中英文或数字组成
 */
const regExpName = (val) => {
  return /^[\u4e00-\u9fa5A-Za-z\d]{1,12}$/.test(val)
}
/**
 * 正则：4为数字
 */
const regExpPwd = (val) => {
  return /^[0-9]{4}$/.test(val)
}
/**
 * 正则：保留两位小数的金额
 */
const regExpMoney = (val) => {
  return /((^[1-9]\d*)|^0)(\.\d{0,2}){0,1}$/.test(val)
}

/**
 * 获取星期几
 */
const getWeekByDate = dates => {
  let show_day = new Array('星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六');
  let date = new Date(dates);
  date.setDate(date.getDate());
  let day = date.getDay();
  return show_day[day];
}

module.exports = {
  formatDateTime: formatDateTime,
  formatDate: formatDate,
  formatDate2: formatDate2,
  formatDate3: formatDate3,
  getCurMonthStartAndEnd: getCurMonthStartAndEnd,
  getLastMonthStartAndEnd: getLastMonthStartAndEnd,
  getCurYearStartAndEnd: getCurYearStartAndEnd,
  getRandomInt: getRandomInt,
  regExpName: regExpName,
  regExpMoney: regExpMoney,
  regExpPwd: regExpPwd,
  getWeekByDate: getWeekByDate,
}