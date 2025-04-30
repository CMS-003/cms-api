import vm, { runInNewContext, createContext } from 'node:vm';
import { dirname, resolve, join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import module from 'node:module'; // 引入 `createRequire` 方法
import { readFile } from "fs/promises";
import constant from '#constant.js';

const __filename = join(constant.PATH.SRC, 'server.js')
const __dirname = constant.PATH.SRC;

const require = module.createRequire(__filename);
const defaultIdentifier = pathToFileURL(__filename).toString();


export default async function vmRunCode(code, identifier = defaultIdentifier) {
  // 创建沙盒上下文
  const sandbox = {
    process: {
      env: { ...process.env }, // 浅拷贝环境变量
      cwd: () => process.cwd() // 可选：注入其他 process 方法
    },
    // 注入定时器函数（但存在风险！）
    setInterval: (fn, delay) => {
      return setInterval(fn, delay);
    },
    clearInterval: (id) => {
      clearInterval(id);
    },
    require,          // 注入 require 函数
    module: { exports: null }, // 用于导出结果
    console,          // 允许使用 console
    __dirname,        // 当前目录路径
    __filename,       // 当前文件路径
  };
  const context = createContext(sandbox);

  // 定义动态导入回调
  async function dynamicImport(specifier, referencingModule) {
    if (!specifier.startsWith(".")) {
      // 导入第三方
      return import(specifier);
    } else {
      // 导入相对路径
      const resolvedURL = new URL(specifier, referencingModule.identifier);
      const importedCode = await readFile(resolvedURL, "utf8");
      // 为子模块构造一个新的 identifier
      const childIdentifier = identifier + '/' + specifier;
      // 创建子模块
      const childModule = new vm.SourceTextModule(importedCode, {
        context,
        identifier: childIdentifier,
        // @ts-ignore
        importModuleDynamically: dynamicImport, // 递归设置动态导入
      });
      // 链接子模块（这里未自定义 resolve 函数，传入空函数即可）
      // @ts-ignore
      await childModule.link(() => { });
      // 执行子模块
      await childModule.evaluate();
      return childModule;
    }
  }

  // 创建主模块
  const module = new vm.SourceTextModule(code, {
    context,
    identifier,
    // @ts-ignore
    importModuleDynamically: dynamicImport,
  });

  // 链接和执行主模块
  // @ts-ignore
  await module.link(() => { });
  await module.evaluate();
  return module;
}
