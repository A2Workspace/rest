import axios from 'axios';
import mergeConfig from './mergeConfig';

export default class Rest {
  #resourceURN;
  #options;
  #axios;

  /**
   * @param {string} urn
   * @param {RestOptions} options
   */
  constructor(urn, options = {}) {
    this.#resourceURN = String(urn).replace(/\/$/, '');
    this.#axios = options.axios || axios;

    this.#options = options;

    bindDefaultActions(this);
  }

  /**
   * @param {string} name
   * @param {bindActionHandler} callable
   * @returns {void}
   */
  bindAction(name, callable) {
    if (typeof this[name] !== 'undefined') {
      throw new Error(`${name} 已存在`);
    }

    let actionOptions = this.#options[name];

    let action = (...args) => {
      let inputOptions = callable.call(action, ...args);

      let config = mergeConfig(actionOptions, inputOptions);
      config.url = callCustomParseURL(inputOptions, this.#resourceURN);

      action.lastQuery = config;

      return this.#axios.request(config);
    };

    action.options = actionOptions;
    action.lastQuery = {};

    this[name] = action;
  }
}

/**
 * 綁定預設的 fetchAll, create, fetch, update, delete 等五個方法
 *
 * @param {Rest} restInstance
 * @returns {void}
 */
function bindDefaultActions(restInstance) {
  restInstance.bindAction('fetchAll', function (params = {}) {
    if (typeof params === 'function') {
      params = params(this.lastQuery.params);
    }

    if (typeof params !== 'object') {
      params = {};
    }

    return { params };
  });

  restInstance.bindAction('create', function (data = {}) {
    return { data };
  });

  restInstance.bindAction('fetch', function (id, params = {}) {
    return {
      params,
      parseURL: (resourceURN) => `${resourceURN}/${id}`,
    };
  });

  restInstance.bindAction('update', function (id, data = {}) {
    return {
      data,
      parseURL: (resourceURN) => `${resourceURN}/${id}`,
    };
  });

  restInstance.bindAction('delete', function (id, params = {}) {
    return {
      params,
      parseURL: (resourceURN) => `${resourceURN}/${id}`,
    };
  });
}

/**
 * @param {Object.<string, *>} config
 * @returns {string}
 */
function callCustomParseURL(config, resourceURN) {
  if (typeof config.parseURL === 'function') {
    return config.parseURL(resourceURN);
  }

  return resourceURN;
}

/**
 * @typedef RestOptions
 * @type {object}
 * @property {AxiosInstance} [axios]
 * @property {Object.<string, *>} [fetchAll]
 * @property {Object.<string, *>} [create]
 * @property {Object.<string, *>} [fetch]
 * @property {Object.<string, *>} [update]
 * @property {Object.<string, *>} [delete]
 */

/**
 * @callback bindActionHandler
 * @param {...*} args
 * @returns {ActionConfig}
 */

/**
 * @typedef ActionConfig
 * @type {object}
 * @property {Object.<string, *>} [params]
 * @property {Object.<string, *>} [data]
 * @property {parseURL} [parseURL]
 */

/**
 * @callback parseURL
 * @param {string} resourceURN
 * @returns {string}
 */
