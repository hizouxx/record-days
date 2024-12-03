/**
 * 日期时间格式化
 * @param {*} date 
 * 如：2020-01-01 12:00:00
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

  return year + month + day
}
/**
 * 日期格式化4
 * 如：2020/01/01
 * @param {*} date 
 */
const formatDate4 = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()

  return [year, month, day].map(formatNumber).join('/')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}
/**
 * 时间格式化
 * 如：12:00:00
 * @param {*} date 
 */
const formatTime = date => {
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [hour, minute, second].map(formatNumber).join(':')
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
/**
 * 获取:当月的月首与至今时间戳
 */
const getCurMonthStartAndEnd = () => {
  const date = new Date()
  date.setDate(1)
  date.setHours(0, 0, 0, 0)
  return {
    start: date.getTime(),
    end: new Date().getTime(),
  }
}
/**
 * 获取:上月的月首与月尾时间戳
 */
const getLastMonthStartAndEnd = () => {
  const date = new Date()
  date.setDate(1)
  date.setHours(0, 0, 0, 0)
  //  上个月的天数
  const days = lastMonthDats()
  //  一天的毫秒数
  const MillisecondsADay = 24 * 60 * 60 * 1000
  return {
    start: date.getTime() - (MillisecondsADay * days),
    end: date.getTime() - 1,
  }
}
/**
 * 获取:今年年初到现在的时间戳
 */
const getCurYearStartAndEnd = () => {
  const date = new Date()
  date.setMonth(0)
  date.setDate(1)
  date.setHours(0, 0, 0, 0)
  return {
    start: date.getTime(),
    end: new Date().getTime(),
  }
}

/**
 * 正则：保留两位小数的金额
 */
const regExpMoney = (val) => {
  return /((^[1-9]\d*)|^0)(\.\d{0,2}){0,1}$/.test(val)
}
/**
 * 正则：正整数金额
 */
const regExpMoney2 = (val) => {
  return /^[1-9]\d*$/.test(val)
}


/**
 * 上月天数
 * @returns {number}
 */
const lastMonthDats = () => {
  const date = new Date()
  const year = date.getFullYear()
  //  上个月月份
  let month = (date.getMonth() + 1) - 1 //  0-11 表示 1月-12月
  //  0 表示12月
  month = month || 12
  //  30天的月份
  const arr30 = [4, 6, 9, 11]
  //  31天的月份
  const arr31 = [1, 3, 5, 7, 8, 10, 12]
  if (arr30.indexOf(month) !== -1) {
    //  上个月是 30 天
    return 30
  } else if (arr31.indexOf(month) !== -1) {
    //  上个月是 31 天
    return 31
  } else {
    //  2月
    if (isRunYear(year)) {
      return 29
    } else {
      return 28
    }
  }
}
/**
 * 是否为闰年
 * @param year
 * @returns {boolean}
 */
const isRunYear = (year) => {
  //  条件:能被4整除并且不能被100整除，或者被400整除的
  let flag = false
  if (year % 4 === 0 && year % 100 !== 0 || year % 400 === 0) {
    flag = true
  }
  return flag
}

/* 格式化时间，转化为几天前，几个月前，几年前
* @param timestamp 时间戳，单位是毫秒
*/
const timePoint = (timestamp) => {
  const mistiming = Date.now() - timestamp;
  if (mistiming < 86400000) {
    return '今天'
  }
  const arrr = ['年', '个月', '星期', '天'];
  var arrn = [31536000000, 2592000000, 604800000, 86400000];
  for (var i = 0; i < arrn.length; i++) {
    var inm = Math.floor(mistiming / arrn[i]);
    if (inm != 0) {
      return inm + arrr[i] + '前';
    }
  }
}

module.exports = {
  formatDateTime: formatDateTime,
  formatDate: formatDate,
  formatDate2: formatDate2,
  formatDate3: formatDate3,
  formatDate4: formatDate4,
  formatTime: formatTime,
  timePoint: timePoint,
  getWeekByDate: getWeekByDate,
  getCurMonthStartAndEnd: getCurMonthStartAndEnd,
  getLastMonthStartAndEnd: getLastMonthStartAndEnd,
  getCurYearStartAndEnd: getCurYearStartAndEnd,
  regExpMoney: regExpMoney,
  regExpMoney2: regExpMoney2,
}