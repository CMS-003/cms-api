import Router from 'koa-router'
import dayjs from '#utils/dayjs.js'

const route = new Router();

route.get('/', async (ctx) => {
  const { models, request, response } = ctx;
  let date = '';
  const result = await models.MLog.getList({
    where: { group: "schedule", createdAt: { $gt: dayjs().subtract(1, 'day').toDate() } },
    lean: true,
    limit: 100,
  });
  const labels = [];
  const datas = {};
  result.forEach(v => {
    if (!labels.includes(v.type)) {
      labels.push(v.type)
    }
    if (!datas[v.type]) {
      datas[v.type] = { name: v.type, type: 'line', data: [] };
    }
    datas[v.type].data.push([Date.parse(v.createdAt), 1])
  });
  const data = {
    backgroundColor: '#ccc4',
    title: {
      text: "定时任务",
      top: 10,
      left: 'center'
    },
    legend: {
      top: 10,
      left: '5%',
      data: labels,
    },
    grid: {
      left: '5%',
      right: '5%',
      top: 50,
      bottom: '5%',
      containLabel: true
    },
    xAxis: {
      align: 'center',
      type: 'time',
      splitNumber: 24,
    },
    yAxis: {
      type: 'value',
      min: 0,
      max: 4,
      interval: 1,
      splitLine: {
        show: true,
        lineStyle: {
          color: '#999',
          width: 1,
          type: 'dashed'
        }
      }
    },
    series: labels.map(v => datas[v])
  };
  response.success(data);
})

export default route;
