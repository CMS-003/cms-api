const request = require('supertest');
const mongoose = require('mongoose')
const app = require('../src/app');

test('send email', async () => {
  process.env.NODE_ENV = 'dev';
  const server = app.callback()
  const resp = await request(server).get('/api/v1/configs/')
  console.log(resp.body)
  const response = {
    accepted: ['ruanjiayou123@gmail.com'],
    rejected: [],
    response: '250 OK: queued as.',
    envelope: { from: '1439120442@qq.com', to: ['ruanjiayou123@gmail.com'] },
    messageId: 'f3c83bb8-624b-6be6-7460-3a79448d8651@qq.com'
  }
})

afterAll(() => mongoose.disconnect());
