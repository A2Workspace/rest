import Rest from './core/Rest';

import defaults from './defaults';

function rest(uri, options = {}) {
  return new Rest(uri, {
    ...defaults,
    ...options,
  });
}

rest.defaults = defaults;

export default rest;
