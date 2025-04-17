/*
 * Node.js Base62 ID Generator
 * Format: <timestamp>-<machineId>-<random>-<checksum>
 *  - timestamp: Unix time in seconds encoded in Base62
 *  - machineId: integer machine identifier encoded in Base62
 *  - random: random Base62 string of defined length
 *  - checksum: single Base62 character, sum of all previous char indices mod 62
 */

const crypto = require('crypto');

// Base62 character set: 0-9, A-Z, a-z
const BASE62 = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
const BASE = BASE62.length;
const FIXED_LENGTH = 6; // Fixed length for Base62 encoding

/**
 * Encode a non-negative integer to Base62 string, left-padded to 6 characters
 * @param {number} num - integer >= 0
 * @returns {string}
 */
function encodeBase62(num, len = FIXED_LENGTH) {
  if (num === 0) return BASE62[0].repeat(len);
  let result = '';
  while (num > 0) {
    const rem = num % BASE;
    result = BASE62[rem] + result;
    num = Math.floor(num / BASE);
  }
  return result.padStart(len, BASE62[0]);
}

/**
 * Decode a Base62 string (assumed to be padded to 6 characters) back to integer
 * @param {string} str - Base62 encoded string
 * @returns {number}
 */
function decodeBase62(str) {
  let num = 0;
  for (const char of str) {
    const idx = BASE62.indexOf(char);
    if (idx === -1) throw new Error(`Invalid Base62 character: ${char}`);
    num = num * BASE + idx;
  }
  return num;
}

/**
 * Generate a secure random Base62 string of given length
 * @param {number} length
 * @returns {string}
 */
function randomBase62(length) {
  const bytes = crypto.randomBytes(length);
  let str = '';
  for (let i = 0; i < length; i++) {
    // Map byte to 0..61
    const idx = bytes[i] % BASE;
    str += BASE62[idx];
  }
  return str;
}

/**
 * Generate an ID: <ts>-<machine>-<random>-<checksum>
 * @param {number} machineId - integer machine identifier
 * @param {number} randomLength - length of random segment (default 3)
 * @returns {string}
 */
function suid(machineId = 1, randomLength = 3) {
  // 1. timestamp in seconds
  const ts = Math.floor(Date.now() / 1000);
  const tsStr = encodeBase62(ts);

  // 2. machineId
  const machineStr = encodeBase62(machineId, 2);

  // 3. random part
  const randStr = randomBase62(randomLength);

  // 4. checksum: sum of indices
  const payload = tsStr + machineStr + randStr;
  let sum = 0;
  for (const c of payload) sum += BASE62.indexOf(c);
  const checksumChar = BASE62[sum % BASE];

  return `${tsStr}${machineStr}${randStr}${checksumChar}`;
}

/**
 * Parse ID string and return the original timestamp (in seconds)
 * Validates checksum
 * 需要修复,-连接符删除了
 * @param {string} idStr
 * @returns {number} timestamp in seconds
 * @throws {Error} if format or checksum invalid
 */
function parseId(idStr) {
  const parts = idStr.split('-');
  if (parts.length !== 4) {
    throw new Error('Invalid ID format');
  }

  const [tsStr, machineStr, randStr, checksumChar] = parts;
  const payload = tsStr + machineStr + randStr;

  // verify checksum
  let sum = 0;
  for (const c of payload) sum += BASE62.indexOf(c);
  if (checksumChar !== BASE62[sum % BASE]) {
    throw new Error('Checksum mismatch');
  }

  // decode timestamp
  return decodeBase62(tsStr);
}

// Export for reuse
export {
  suid
}