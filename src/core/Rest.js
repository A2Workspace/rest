import axios from 'axios';
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
    this.#axios = options.axios || axios;

    this.defaults = options;
  }

  /**
   * @param {(function|object|null)} callback
   * @returns {Promise}
   */
  fetchAll(params) {
    const config = this.defaults.fetchAll;

    if (typeof params === 'function') {
      params = params(this.#currentQuery);
    }

    if (typeof params !== 'object') {
      params = {};
    }

    params = Object.assign(params, config.params);

    this.#currentQuery = params;

    return this.#axios.request({
      method: config.method,
      url: this.#resourceURL,
      params,
    });
  }

  /**
   * @param {object} data
   * @returns {Promise}
   */
  create(data = {}) {
    const config = this.defaults.create;

    if (typeof data !== 'object') {
      data = {};
    }

    data = Object.assign(data, config.data);

    return this.#axios.request({
      method: config.method,
      url: this.#resourceURL,
      data,
    });
  }

  /**
   * @param {number} id
   * @param {object} params
   * @returns {Promise}
   */
  fetch(id, params = {}) {
    const config = this.defaults.fetch;

    if (typeof params !== 'object') {
      params = {};
    }

    params = Object.assign(params, config.params);

    return this.#axios.request({
      method: config.method,
      url: `${this.#resourceURL}/${id}`,
      params,
    });
  }

  /**
   * @param {number} id
   * @param {object} data
   * @returns {Promise}
   */
  update(id, data = {}) {
    const config = this.defaults.update;

    if (typeof data !== 'object') {
      data = {};
    }

    data = Object.assign(data, config.data);

    return this.#axios.request({
      method: config.method,
      url: `${this.#resourceURL}/${id}`,
      data,
    });
  }

  /**
   * @param {number} id
   * @param {object} params
   * @returns {Promise}
   */
  delete(id, params = {}) {
    const config = this.defaults.delete || {};

    if (typeof params !== 'object') {
      params = {};
    }

    params = Object.assign(params, config.params);

    return this.#axios.request({
      method: config.method,
      url: `${this.#resourceURL}/${id}`,
      params,
    });
  }
}
