import axios from 'axios';
import mergeConfig from './mergeConfig';

export default class Rest {
  #resourceURN;
  #axios;
  #currentQuery;
  #options;

  /**
   * @param {string} urn
   * @param {Object} options
   */
  constructor(urn, options = {}) {
    this.#resourceURN = String(urn).replace(/\/$/, '');
    this.#axios = options.axios || axios;

    this.#options = options;

    this.bindAction('fetchAll', function (params = {}) {
      if (typeof params === 'function') {
        params = params(this.lastQuery.params);
      }

      if (typeof params !== 'object') {
        params = {};
      }

      return { params };
    });

    this.bindAction('create', (data = {}) => ({
      data,
    }));

    this.bindAction('fetch', (id, params = {}) => ({
      params,
      parseURL: (resourceURN) => `${resourceURN}/${id}`,
    }));

    this.bindAction('update', (id, data = {}) => ({
      data,
      parseURL: (resourceURN) => `${resourceURN}/${id}`,
    }));

    this.bindAction('delete', (id, params = {}) => ({
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

    let actionOptions = this.#options[name];

    let action = function (...args) {
      let inputOptions = callable.call(action, ...args);

      let config = mergeConfig(actionOptions, inputOptions);
      config.url = callCustomParseURL(inputOptions, this.#resourceURN);

      action.lastQuery = config;
      return this.#axios.request(config);
    };

    action.bind(this);
    action.options = actionOptions;
    action.lastQuery = {};

    this[name] = action;
  }
}

/**
 * @param {Object} config
 * @returns {string}
 */
function callCustomParseURL(config, resourceURN) {
  if (typeof config.parseURL === 'function') {
    return config.parseURL(resourceURN);
  }

  return resourceURN;
}
