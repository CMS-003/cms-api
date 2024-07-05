import _ from ('lodash')
import fetch from ('node-fetch')
import dayjs from ('dayjs')

export default async function (code) {
  const data = {
    date: '',
    prev_close: 0,
    begin: 0,
    end: 0,
    high: 0,
    low: 0,
    quantity: 0,
    amount: 0,
    percent: 0,
    line: [],
  };
  if (code.startsWith('SZ')) {
    code = code.substring(2)
    // 今日
    const resp = await fetch(`http://www.szse.cn/api/market/ssjjhq/getTimeData?random=${Math.random()}&marketId=1&code=${code}`);
    if (resp.status === 200) {
      const res = await resp.json();
      if (res.code === '0') {
        data.date = dayjs(new Date(res.data.marketTime)).format('YYYYMMDD');
        data.prev_close = parseFloat(res.data.close)
        data.begin = parseFloat(res.data.open)
        data.end = parseFloat(res.data.now)
        data.high = parseFloat(res.data.high)
        data.low = parseFloat(res.data.low)
        data.quantity = parseFloat(res.data.volume)
        data.amount = parseFloat(res.data.amount)
        data.percent = parseFloat(res.data.deltaPercent)
        res.data.picupdata.map(item => {
          let [t, n, a, d, p, v, m] = item
          data.line.push({
            quantity: parseInt(v),
            price: parseFloat(n),
            average: parseFloat(a),
          })
        });
        return data;
      } else {
        console.log(code, 'fail')
      }
    } else {
      console.log('fetch fail')
    }
  } else {
    code = code.substring(2)
    const resp = await fetch(`http://yunhq.sse.com.cn:32041/v1/sh1/line/${code}?&begin=0&end=-1&select=time%2Cprice%2Cvolume`)
    if (resp.status === 200) {
      const res = await resp.json()
      data.date = res.date
      data.prev_close = res.prev_close
      data.high = res.highest
      data.low = res.lowest
      data.begin = res.line[0][0]
      data.end = res.line[res.line.length - 1][0]
      res.line.map(item => {
        data.quantity += item[2]
        data.amount += Math.round(1000 * item[2] * item[1]) / 1000;
        data.line.push({
          quantity: item[2],
          price: item[0],
          average: item[1],
        })
      })
      data.percent = (data.end - data.prev_close) / data.prev_close
      return data;
    }
  }
}