import Router from 'koa-router'

const route = new Router();

route.get('/', async (ctx) => {
  const { models, request, response } = ctx;
  let date = '';
  const result = await models.MTask.aggregate([
    {
      $group: {
        _id: {
          $dateToString: {
            format: "%Y-%m-%d %H:00",
            date: "$createdAt",
            timezone: "Asia/Shanghai" // 可选
          }
        },
        count: { $sum: 1 }
      }
    },
    { $sort: { _id: -1 } },
    { $limit: 12 }
  ]);
  const data = {
    backgroundColor: '#ccc4',
    title: {
      text: "下载任务",
      left: 'center',
      top: 10,
    },
    grid: {
      left: '5%',
      right: '5%',
      top: 50,
      bottom: '5%',
      containLabel: true
    },
    xAxis: {
      axisLabel: {
        interval: 0 // 强制显示所有标签，包括最后一个
      },
      axisTick: {
        alignWithLabel: true,
        interval: 0
      },
      align: 'center',
      data: result.map((v, i) => {
        let times = v._id
          .replace(/^[0-9]+[-]/, '')
          .replace(/[:]00$/, '点')
          .split(' ');
        if (times[0] !== date || i === result.length - 1) {
          date = times[0];
          return times.reverse().join('\n');
        } else {
          return times[1];
        }
      }).reverse(),
    },
    yAxis: {
      type: 'value',
      splitLine: {
        show: true,
        lineStyle: {
          color: '#999',
          width: 1,
          type: 'dashed'
        }
      }
    },
    series: [
      { name: "数量", type: 'bar', data: result.map(v => v.count).reverse() }
    ]
  };
  response.success(data);
})

export default route;
