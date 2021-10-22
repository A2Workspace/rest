const mergeMap = {
  method: '',
  url: '',
  data: {},
  params: {},
};

/**
 * 合併兩個設定值
 *
 * @param {Object} config1
 * @param {Object} config2
 * @returns {Object} 合併後的新物件
 */
export default function mergeConfig(config1: object, config2: object): object {
  config1 = accessible(config1);
  config2 = accessible(config2);

  let config = {};

  for (const [prop, value] of Object.entries(mergeMap)) {
    if (isAccessible(value)) {
      config[prop] = mergeAccessible(value, config1[prop], config2[prop]);
    } else {
      config[prop] = config2[prop] || config1[prop] || value;
    }
  }

  return config;
}

/**
 * 若給予的值不為可存取之物件，則回傳一個空物件。
 *
 * @param {*} value
 * @returns {Object}
 */
export function accessible(value: any): object {
  return isAccessible(value) ? value : {};
}

/**
 * 判斷是否為可存取之物件。
 *
 * @param {*} value
 * @returns {boolean}
 */
export function isAccessible(value: any): boolean {
  return typeof value === 'object' && value !== null;
}

/**
 * 淺合併多個物件。
 *
 * @param {any[]} ...args
 * @returns {Object}
 */
export function mergeAccessible(...args: any[]): object {
  return Object.assign({}, ...args.filter(isAccessible));
}
