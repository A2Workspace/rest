import rest from '../src/index';
import createMockedAxios from './helpers/createMockedAxios';

describe('delete', () => {
  let $rest;
  const mock = createMockedAxios();

  afterEach(() => {
    mock.reset();
  });

  beforeEach(() => {
    $rest = rest('/api/users');

    mock.onDelete('/api/users/1').reply(201);
  });

  test('Basic', async () => {
    const result = await $rest.delete(1);

    expect(mock.history.delete[0].url).toEqual('/api/users/1');
    expect(mock.history.delete[0].method).toEqual('delete');
    expect(result.status).toEqual(201);
  });
});
