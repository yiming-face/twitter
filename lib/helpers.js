const crypto = require('crypto');
const UUID = require('uuid');


const isDef = (v) => v !== undefined && v !== null;

const isUndef = (v) => v === undefined || v === null;

const isNumber = (v) => 'number' == typeof v;

/**
 * isPrimitive(undefined) = true
 * isPrimitive(null) = true
 * isPrimitive('str') = true
 * isPrimitive(10) = true
 * isPrimitive([]) = false
 * isPrimitive({}) = false
 * @param v
 */
const isPrimitive = (v) => !(v instanceof Object);

/**
 * isPrimitive(undefined) = false
 * isPrimitive(null) = false
 * isPrimitive('str') = false
 * isPrimitive(10) = false
 *
 * isPrimitive([]) = true
 * isPrimitive({}) = true
 * @param v
 */
const isObject = (v) => v instanceof Object;

const isEmpty = (v) => v === undefined || v === null || v.length === 0 || isObject(v) && Object.keys(v).length === 0;

const hasMember = (v) => isObject(v) && Object.keys(v).length > 0;

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms, null));

const md5sum = (buffer) => crypto.createHash('md5').update(buffer).digest('hex');

const uuid = () => UUID.v4();

/**
 * Level-1 clone
 * @param obj
 * @returns object
 */
function clone(obj) {
  return {...obj};
}

function regulateNum(n, min, max) {
  if (n < min) {
    return min;
  }
  if (n > max) {
    return max;
  }

  return n;
}

/**
 * When you initialize an array with a number, it creates an array with
 * the length set to that value so that the array appears to contain that
 * many undefined elements. Though some Array instance methods skip array
 * elements without values, .join() doesn't, or at least not completely;
 * it treats them as if their value is the empty string. Thus you get
 * a copy of the zero character (or whatever "z" is) between each of
 * the array elements; that's why there's a + 1 in there.
 *
 * Example usage:
 * pad(10, 4);      // 0010
 * pad(9, 4);       // 0009
 * pad(123, 4);     // 0123
 * pad(10, 4, '-'); // --10
 *`
 * @param n
 * @param width
 * @param z
 * @return {string}
 */
const pad = (n, width, z = '0') => {
  let nStr = n.toString();
  return nStr.length >= width ? nStr : new Array(width - nStr.length + 1).join(z) + nStr;
};

function firstMatch(key, ...maps) {
  for (let i = 0; i < maps.length; ++i) {
    if (Object.keys(maps[i]).includes(key)) {
      return maps[i][key];
    }
  }

  return null;
}

/**
 * @param arr
 * @param obj
 * @returns {boolean}
 */
function contains(arr, obj) {
  let i = arr.length;
  while (i--) {
    if (arr[i] === obj) {
      return true;
    }
  }
  return false;
}

/**
 * Merge arrays
 * @param args
 * @return Array
 */
function merge(...args) {
  let arr = {};
  for (let i = 0; i < args.length; ++i) {
    arr = {...arr, ...args[i]};
  }

  return arr;
}

function unique(arr) {
  function onlyUnique(value, index, self) {
    return self.indexOf(value) === index;
  }

  return arr.filter(onlyUnique);
}

function uniqueDictItem(arr, key) {
  let ret = [];
  let keys = {};
  for (let i = 0; i < arr.length; ++i) {
    let item = arr[i];
    if (item[key] in keys) {
      continue;
    }

    ret.push(item);
    keys[item[key]] = 1;
  }

  return ret;
}


function toCamelCaseString(str) {
  let words = str.split(' ');
  let result = '';
  for (let i = 0, len = words.length; i < len; i++) {
    let tmpWord = words[i].toLowerCase();
    tmpWord = tmpWord.substr(0, 1).toUpperCase() + tmpWord.substr(1);
    result += tmpWord + ' ';
  }

  return result.trim();
}

function genSmileCode(len = 8) {
  let result = '';
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ23456789';
  const charactersLength = characters.length;
  for (let i = 0; i < len; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

function genUserName(len = 14) {
  return 'fpid_' + crypto.randomBytes(len).toString('hex');
}

module.exports = {
  isDef,
  isUndef,
  isNumber,
  isPrimitive,
  isObject,
  isEmpty,
  hasMember,
  sleep,
  md5sum,
  uuid,
  clone,
  regulateNum,
  pad,
  firstMatch,
  contains,
  merge,
  unique,
  uniqueDictItem,
  toCamelCaseString,
  genSmileCode,
  genUserName
};
