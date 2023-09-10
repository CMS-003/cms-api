const constant = require('../src/constant')
const ejs = require('ejs');
const path = require('path');

(async () => {
  const text = await ejs.renderFile(path.join(constant.PATH.SRC, 'templates/email/lovedaily.ejs'), {
    cp_time: '2022/04/03 00:00:00',
    date: '2022-05-22',
    days: 50,
    weather: '</br>天气提醒: 小雨, 温度: 18℃-23℃, 湿度: 96</br>风向: 北风, 风力等级: 1-2',
    sentence: '出门要像明星一样保护自己，要不然就会被别人抢走',
    url: 'https://www.bing.com/th?id=OHR.ZebraEgret_ROW1402853310_1920x1080.jpg&rf=LaDigue_1920x1080.jpg&pid=hp'
  });
  console.log(text)
})();