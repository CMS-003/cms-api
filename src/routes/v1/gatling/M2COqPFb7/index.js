import Router from 'koa-router'

const route = new Router();

route.get('/', async (ctx) => {
  const { models, request, response } = ctx;
  const results = await models.MResource.aggregate([
    { $group: { _id: "$type", count: { $sum: 1 } } }
  ]);
  const map = {
    10: '文件',
    11: '帖子',
    2: '视频',
    7: '音频',
    3: '图片',
    4: '漫画',
    5: '电影',
    6: '小说',
    8: '私人',
    1: '文章',
    9: '动画',
  };
  const serie = {
    type: 'pie',
    emphasis: {
      itemStyle: {
        shadowBlur: 10,
        shadowOffsetX: 0,
        shadowColor: 'rgba(0, 0, 0, 0.5)'
      }
    },
    label: {
      formatter: '{b}: {c} ({d}%)',
      fontSize: 14
    },
    data: results.sort((a, b) => a.count - b.count).map(v => ({ name: map[v._id] || '其它', value: v.count })),
  }
  response.success({
    backgroundColor: '#ccc4',
    title: {
      text: '资源分布',
      left: 'center',
      top: 20
    },
    grid: {
      "left": "5%",
      "right": "5%",
      "top": 50,
      "bottom": "5%",
      "containLabel": true
    },
    tooltip: {
      trigger: 'item'
    },
    legend: {
      orient: 'vertical',
      left: 20,
      top: "center"
    },
    series: [serie]
  });
})

export default route;
