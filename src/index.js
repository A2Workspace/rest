
export default function rest(uri, axiosInstance) {
  let axios = axiosInstance || require('axios');

  const BASE_URI = uri.replace(/\/$/, '');

  let currentQuery = {};
  let prepareHandler = function (params) {
    return params;
  };

  return {
    /**
     * @returns {(object)}
     */
    get query() {
      return currentQuery || {};
    },

    /**
     * @param {Axios} axiosInstance
     */
    axios(axiosInstance) {
      if (axiosInstance) {
        axios = axiosInstance;
      }

      return this;
    },

    /**
     * @callback onPrepare
     * @param {object} params
     */
    /**
     * @param {onPrepare} callback
     */
    prepare(callback) {
      if (typeof callback === 'function') {
        prepareHandler = callback;
      }

      return this;
    },

    /**
     * @param {(function|object|null)} callback
     * @returns {Promise}
     */
    fetchAll(callback) {
      let params = (function () {
        if (typeof callback === 'function') {
          return callback(currentQuery);
        }

        return callback;
      })();

      currentQuery = params;
      params = prepareHandler(currentQuery);

      return axios.get(BASE_URI, { params });
    },

    /**
     * @param {object} data
     * @returns {Promise}
     */
    create(data) {
      return axios.post(BASE_URI, data);
    },

    /**
     * @param {number} id
     * @param {object} params
     * @returns {Promise}
     */
    fetch(id, params = {}) {
      return axios.get(`${BASE_URI}/${id}`, { params });
    },

    /**
     * @param {number} id
     * @param {object} data
     * @returns {Promise}
     */
    update(id, data) {
      return axios.post(`${BASE_URI}/${id}`, data);
    },

    /**
     * @param {number} id
     * @returns {Promise}
     */
    delete(id) {
      return axios.delete(`${BASE_URI}/${id}`);
    },
  };
}
