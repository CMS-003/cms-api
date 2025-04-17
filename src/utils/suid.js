
// Base62 字符集（0-9, A-Z, a-z）
const BASE62 = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
const BASE = BASE62.length;

// 2000年1月1日 00:00:00 的 Unix 时间戳（毫秒）
const EPOCH = 946684800000;

// 将整数编码为 Base62 字符串
function encodeBase62(num) {
  if (num === 0) return BASE62[0];
  let result = '';
  while (num > 0) {
    const rem = num % BASE;
    result = BASE62[rem] + result;
    num = Math.floor(num / BASE);
  }
  return result;
}

// 将 Base62 字符串解码为整数
function decodeBase62(str) {
  let num = 0;
  for (const char of str) {
    const idx = BASE62.indexOf(char);
    if (idx === -1) throw new Error(`Invalid Base62 character: ${char}`);
    num = num * BASE + idx;
  }
  return num;
}

// 生成 3 位的随机 Base62 字符串
function generateRandomBase62(length = 3) {
  let randStr = '';
  for (let i = 0; i < length; i++) {
    randStr += BASE62[Math.floor(Math.random() * BASE)];
  }
  return randStr;
}

/**
 * 生成 ID
 * @param {number} machineId 
 * @param {Date|number} targetTime 
 * @returns 
 */
export function suid(machineId = 1, targetTime = Date.now()) {
  //const targetTime = Date.now(); // 默认使用当前时间
  if (typeof targetTime === 'string') {
    targetTime = new Date(targetTime).getTime();
  }
  // @ts-ignore
  let timeDifference = targetTime - EPOCH;

  // 判断时间是否为负数
  const isNegative = timeDifference < 0;
  if (isNegative) {
    timeDifference = Math.abs(timeDifference);
  }

  // 将时间差转为 Base62 字符串
  const timeStr = encodeBase62(timeDifference);

  // 机器码转为 Base62
  const machineStr = encodeBase62(machineId);

  // 生成 3 位的随机数
  const randomStr = generateRandomBase62(3);

  // 校验位：计算校验位为所有字符的索引和 mod 62 后的字符
  const payload = (isNegative ? '-' : '') + timeStr + '-' + machineStr + '-' + randomStr;
  let sum = 0;
  for (const char of payload) {
    sum += BASE62.indexOf(char);
  }
  const checksum = BASE62[sum % BASE];

  // 返回 ID
  return `${(isNegative ? '-' : '')}${timeStr.split('').reverse().join('')}-${machineStr}${randomStr}${checksum}`;
}

/**
 * 解析 ID
 * @param {string} id 
 * @returns 
 */
export function parseId(id) {
  const regex = /^(-?)([A-Za-z0-9]+)-([A-Za-z0-9]+)([A-Za-z0-9]{3})([A-Za-z0-9])$/;
  const match = id.match(regex);

  if (!match) {
    throw new Error('Invalid ID format');
  }

  const [, negative, timeStr, machineStr, randomStr, checksum] = match;
  const reverse_time = timeStr.split('').reverse().join('');
  // 校验位验证
  const payload = (negative ? '-' : '') + reverse_time + '-' + machineStr + '-' + randomStr;
  let sum = 0;
  for (const char of payload) {
    sum += BASE62.indexOf(char);
  }
  if (BASE62[sum % BASE] !== checksum) {
    throw new Error('Invalid checksum');
  }

  // 解析时间
  const time = decodeBase62(reverse_time);
  const targetTime = EPOCH + time;

  // 解析机器码和随机数
  const machineId = decodeBase62(machineStr);
  const randomNum = decodeBase62(randomStr);

  return {
    time: targetTime,
    machine: machineId,
    random: randomNum
  };
}
