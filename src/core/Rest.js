import mergeConfig from './mergeConfig';

export default class Rest {
  #resourceURN;
  #axios;
  #currentQuery;

  /**
   * @param {string} urn
   * @param {RestOption} options
   */
  constructor(urn, options = {}) {
    this.#resourceURN = parseURN(urn);
    this.#axios = options.axios;

    this.defaults = options;
  }

  /**
   * @param {(function|Object|null)} callback
   * @returns {Promise<AxiosResponse>}
   */
  fetchAll(params) {
    if (typeof params === 'function') {
      params = params(this.#currentQuery);
    }

    if (typeof params !== 'object') {
      params = {};
    }

    const config = mergeConfig(this.defaults.fetchAll, { params });

    this.#currentQuery = config.params;

    return this.#axios.request({
      ...config,
      url: this.#resourceURN,
    });
  }

  /**
   * @param {object} data
   * @returns {Promise<AxiosResponse>}
   */
  create(data = {}) {
    const config = mergeConfig(this.defaults.create, { data });

    return this.#axios.request({
      ...config,
      url: this.#resourceURN,
    });
  }

  /**
   * @param {number} id
   * @param {object} params
   * @returns {Promise<AxiosResponse>}
   */
  fetch(id, params = {}) {
    const config = mergeConfig(this.defaults.fetch, { params });

    return this.#axios.request({
      ...config,
      url: `${this.#resourceURN}/${id}`,
    });
  }

  /**
   * @param {number} id
   * @param {object} data
   * @returns {Promise<AxiosResponse>}
   */
  update(id, data = {}) {
    const config = mergeConfig(this.defaults.update, { data });

    return this.#axios.request({
      ...config,
      url: `${this.#resourceURN}/${id}`,
    });
  }

  /**
   * @param {number} id
   * @param {Object} params
   * @returns {Promise<AxiosResponse>}
   */
  delete(id, params = {}) {
    const config = mergeConfig(this.defaults.delete, { params });

    return this.#axios.request({
      ...config,
      url: `${this.#resourceURN}/${id}`,
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
