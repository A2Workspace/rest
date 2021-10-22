import rest from '../src/index';
import createMockedAxios from './helpers/createMockedAxios';

describe('update', () => {
  let $rest;
  const mock = createMockedAxios();

  afterEach(() => {
    mock.reset();
  });

  beforeEach(() => {
    $rest = rest('/api/users');

    mock.onPost('/api/users/1').reply(200, {
      status: true,
    });
  });

  test('Basic', async () => {
    const result = await $rest.update(1, { name: 'John' });

    expect(mock.history.post[0].url).toEqual('/api/users/1');
    expect(mock.history.post[0].data).toEqual(JSON.stringify({ name: 'John' }));
    expect(result.data.status).toBeTruthy();
  });
});
