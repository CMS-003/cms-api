const request = require('supertest');
const mongoose = require('mongoose')
const { run } = require('../src/app');

test('Hello Word', async () => {
  const app = await run();
  const resp = await request(app.callback()).get('/')
  expect(resp.status).toBe(200);
  expect(resp.text).toBe('Hello World!');
})

afterAll(() => mongoose.disconnect());
