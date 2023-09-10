const fetch = require('node-fetch');

// 网易云段子
// http://www.yduanzi.com/duanzi/getduanzi

/**
duanzi: "玩游戏真的会变年轻，我昨天玩王者荣耀时，大家都夸我是小学生。"
qiafan: false
success: "获取段子成功"
 */


// 毒鸡汤
// https://api.shadiao.app/du
/**
data:
  text: "大家喜欢和你一起，是为了，显示他们的好看。"
  type: "毒鸡汤"
 */


// 彩虹屁
// fetch('https://api.shadiao.app/chp', { method: 'GET' }).then(async (resp) => {
//   if (resp.status === 200) {
//     const body = await resp.json();
//     console.log(body)
//   }
// })
// data: {type, text}

// https://api.uomg.com/api/rand.qinghua
// code, content

// 天气
// fetch('https://devapi.qweather.com/v7/weather/3d?location=101210707&key=19f3c3f4694b4b918ff30019b6e2efb3').then(async (resp) => {
//   if (resp.status === 200) {
//     const data = await resp.json()
//     // data.code === "200"
//     const w = data.daily[0]
//     console.log(`今天是${w.fxDate},天气: ${w.textDay}, 温度: ${w.tempMin}℃-${w.tempMax}℃, 体感温度: ${w.feelsLike}℃, 湿度: ${w.humidity}, 风向: ${w.windDirDay}, 风力等级: ${w.windScaleDay}`)
//   }
// })