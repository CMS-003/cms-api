import dayjs from 'dayjs';
import Router from 'koa-router'
import _ from 'lodash'


const router = new Router();

router.get('/', async ({ models, response, request, config }) => {
  const html = config['capsule_home'];
  response.status = 200;
  response.set({
    'Cache-Control': 'no-cache, no-store, must-revalidate',
    Pragma: 'no-cache',
    Expires: '0'
  })
  response.res.end(html)
});

router.get('/create', async ({ models, response, config }) => {
  const html = config['capsule_create'];
  response.status = 200;
  response.set({
    'Cache-Control': 'no-cache, no-store, must-revalidate',
    Pragma: 'no-cache',
    Expires: '0'
  })
  response.res.end(html)
});

router.get('/open', async ({ models, response, config }) => {
  const html = config['capsule_open'];
  response.status = 200;
  response.set({
    'Cache-Control': 'no-cache, no-store, must-revalidate',
    Pragma: 'no-cache',
    Expires: '0'
  })
  response.res.end(html)
});

export default router