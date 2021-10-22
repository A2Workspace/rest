import Rest from './core/Rest';

export default function createInstance(uri, options = {}) {
  return new Rest(uri, options);
}
