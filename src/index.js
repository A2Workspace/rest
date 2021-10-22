import Rest from './core/Rest';

import defaults from './defaults';

function rest(urn, options = {}) {
  return new Rest(urn, {
    ...cloneDefaultConfig(rest.defaults),
    ...fastDeepClone(options),
  });
}

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

export default rest;
