import mergeConfig from './mergeConfig';

export default class Rest {
  #resourceURL;
  #axios;
  #currentQuery;

  /**
   * @param {string} uri
   * @param {object} options
   */
  constructor(uri, options = {}) {
    this.#resourceURL = uri.replace(/\/$/, '');
    this.#axios = options.axios;

    this.defaults = options;
  }

  /**
   * @param {(function|object|null)} callback
   * @returns {Promise}
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
      url: this.#resourceURL,
    });
  }

  /**
   * @param {object} data
   * @returns {Promise}
   */
  create(data = {}) {
    const config = mergeConfig(this.defaults.create, { data });

    return this.#axios.request({
      ...config,
      url: this.#resourceURL,
    });
  }

  /**
   * @param {number} id
   * @param {object} params
   * @returns {Promise}
   */
  fetch(id, params = {}) {
    const config = mergeConfig(this.defaults.fetch, { params });

    return this.#axios.request({
      ...config,
      url: `${this.#resourceURL}/${id}`,
    });
  }

  /**
   * @param {number} id
   * @param {object} data
   * @returns {Promise}
   */
  update(id, data = {}) {
    const config = mergeConfig(this.defaults.update, { data });

    return this.#axios.request({
      ...config,
      url: `${this.#resourceURL}/${id}`,
    });
  }

  /**
   * @param {number} id
   * @param {Object} params
   * @returns {Promise}
   */
  delete(id, params = {}) {
    const config = mergeConfig(this.defaults.delete, { params });

    return this.#axios.request({
      ...config,
      url: `${this.#resourceURL}/${id}`,
    });
  }
}
