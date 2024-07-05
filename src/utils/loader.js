import fs from 'fs'
import path from 'path'

/**
 * 遍历文件夹并对每个文件应用回调函数
 * @param {object} opt 参数
 * @param {function} cb 回调函数
 */
function loader(opt, cb = null) {
  scanner(opt.dir, cb, opt.filter, opt.recusive);
}

function scanner(dir, cb, filter, recusive) {
  fs.readdirSync(dir).forEach(file => {
    const fullpath = path.join(dir, file);
    const ext = path.extname(file).toLocaleLowerCase();
    const filename = file.substring(0, file.length - ext.length);
    if (recusive === true && fs.existsSync(fullpath) && fs.lstatSync(fullpath).isDirectory()) {
      scanner(fullpath, cb, filter, recusive);
    } else if (cb) {
      // filter处理
      cb({ fullpath, dir, filename, ext });
    }
  });
}

export default loader;