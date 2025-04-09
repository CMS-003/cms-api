import Router from 'koa-router'
import _ from 'lodash'
import fs from 'fs'
import path from 'path'
import constant from '#constant.js';

const route = new Router();

route.get('/upload/video/(.*)', async (ctx) => {
  const filepath = path.join(constant.PATH.STATIC, ctx.params[0]);
  const stat = fs.statSync(filepath);
  const fileSize = stat.size;
  const range = ctx.headers.range;

  const MAX_CHUNK_SIZE = 1024 * 1024; // 1MB

  if (range) {
    const parts = range.replace(/bytes=/, '').split('-');
    const start = parseInt(parts[0], 10);
    let end = parts[1] ? parseInt(parts[1], 10) : start + MAX_CHUNK_SIZE - 1;

    // 防止超过文件大小
    end = Math.min(end, fileSize - 1);

    const chunkSize = end - start + 1;
    const file = fs.createReadStream(filepath, { start, end });

    ctx.status = 206;
    ctx.set({
      'Content-Range': `bytes ${start}-${end}/${fileSize}`,
      'Accept-Ranges': 'bytes',
      // @ts-ignore
      'Content-Length': chunkSize,
      'Content-Type': 'video/mp4',
    });
    ctx.body = file;
  } else {
    // 无 Range 请求，返回整段视频
    ctx.status = 200;
    ctx.set({
      // @ts-ignore
      'Content-Length': fileSize,
      'Content-Type': 'video/mp4',
    });
    ctx.body = fs.createReadStream(filepath);
  }
});

export default route