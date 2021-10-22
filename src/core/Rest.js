import axios from 'axios';

export default class Rest {
  #resourceUri;
  #axiosInstance;
  #currentQuery;

  /**
   * @param {string} uri
   * @param {object} options
   */
  constructor(uri, options = {}) {
    this.#resourceUri = uri.replace(/\/$/, '');
    this.#axiosInstance = options.axios || axios;

    this.defaults = {
      ...options,
    };
  }

  /**
   * @param {(function|object|null)} callback
   * @returns {Promise}
   */
  fetchAll(params) {
    params = (typeof params === 'function')
      ? params(this.#currentQuery)
      : params;

    this.#currentQuery = params;

    return this.#axiosInstance.get(this.#resourceUri, { params });
  }

  /**
   * @param {object} data
   * @returns {Promise}
   */
  create(data) {
    return this.#axiosInstance.post(this.#resourceUri, data);
  }

  /**
   * @param {number} id
   * @param {object} params
   * @returns {Promise}
   */
  fetch(id, params = {}) {
    return this.#axiosInstance.get(`${this.#resourceUri}/${id}`, { params });
  }

  /**
   * @param {number} id
   * @param {object} data
   * @returns {Promise}
   */
  update(id, data) {
    return this.#axiosInstance.post(`${this.#resourceUri}/${id}`, data);
  }

  /**
   * @param {number} id
   * @returns {Promise}
   */
  delete(id) {
    return this.#axiosInstance.delete(`${this.#resourceUri}/${id}`);
  }
}
