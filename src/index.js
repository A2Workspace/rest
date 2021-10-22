import Rest from './core/Rest';

import defaults from './defaults';

function rest(urn, options = {}) {
  return new Rest(urn, {
    ...defaults,
    ...options,
  });
}

rest.defaults = defaults;

export default rest;
