import Rest from './core/Rest';
import defaults from './defaults';

/**
 * @typedef {import('./core/Rest.js').Rest} Rest
 * @typedef {import('./core/Rest.js').RestOptions} RestOptions
 */

/**
 * @param {string} urn
 * @param {RestOptions} options
 * @returns {Rest}
 */
export default function rest(urn, options = {}) {
  return new Rest(urn, {
    ...cloneDefaultConfig(rest.defaults),
    ...fastDeepClone(options),
  });
}

/**
 * @var {RestOptions}
 */
rest.defaults = defaults;

/**
 * @param {Object} source
 * @returns {Object}
 */
function cloneDefaultConfig(source) {
  let config = (function ({ axios, ...config }) {
    return config;
  })(source);

  return {
    ...fastDeepClone(config),
    axios: source.axios,
  }
}

/**
 * @param {Object} source
 * @returns {Object}
 */
function fastDeepClone(object) {
  return JSON.parse(JSON.stringify(object));
}
