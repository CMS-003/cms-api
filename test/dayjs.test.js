const dayjs = require('dayjs')

console.log(dayjs().toDate())

console.log(dayjs(new Date()).toDate())

console.log(dayjs().format('YYYY-MM-DD'))
console.log(dayjs().format('YYYYMMDD'))