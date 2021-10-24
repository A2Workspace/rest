import mergeConfig from './mergeConfig';

export default class Rest {
  #resourceURN;
  #axios;
  #currentQuery;

  /**
   * @param {string} urn
   * @param {Object} options
   */
  constructor(urn, options = {}) {
    this.#resourceURN = parseURN(urn);
    this.#axios = options.axios;

    this.options = options;

    this.bindAction('create', (data = {}) => ({
      method: 'post',
      data,
    }));

    this.bindAction('fetch', (id, params = {}) => ({
      method: 'get',
      params,
      parseURL: (resourceURN) => `${resourceURN}/${id}`,
    }));

    this.bindAction('update', (id, data = {}) => ({
      method: 'put',
      data,
      parseURL: (resourceURN) => `${resourceURN}/${id}`,
    }));

    this.bindAction('delete', (id, params = {}) => ({
      method: 'delete',
      params,
      parseURL: (resourceURN) => `${resourceURN}/${id}`,
    }));
  }

  /**
   * @param {string} name
   * @param {function} callable
   */
  bindAction(name, callable) {
    if (typeof this[name] !== 'undefined') {
      throw new Error(`${name} 已存在`);
    }

    let action = function (...args) {
      let config = mergeConfig(this.options[name], callable(...args));

      let url = typeof config.parseURL === 'function' ? config.parseURL(this.#resourceURN) : this.#resourceURN;

      return this.#axios.request({
        ...config,
        url,
      });
    };

    action.bind(this);

    this[name] = action;
  }

  /**
   * @param {(function|Object.<string, number>)} params
   * @returns {Promise}
   */
  fetchAll(params) {
    if (typeof params === 'function') {
      params = params(this.#currentQuery);
    }

    if (typeof params !== 'object') {
      params = {};
    }

    const config = mergeConfig(this.options.fetchAll, { params });

    this.#currentQuery = config.params;

    return this.#axios.request({
      ...config,
      url: this.#resourceURN,
    });
  }
}

/**
 * @param {*} value
 * @returns {string}
 */
function parseURN(value) {
  return String(value).replace(/\/$/, '');
}
