import type { RestInstarce, RestOptions } from './core/Rest';

declare var rest: {
  (urn: string, options?: object): RestInstarce,
  defaults: RestOptions,
};

export default rest;
