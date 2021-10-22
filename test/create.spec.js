import rest from '../src/index';
import createMockedAxios from './helpers/createMockedAxios';

describe('create', () => {
  let $rest;
  const mock = createMockedAxios();

  afterEach(() => {
    mock.reset();
  });

  beforeEach(() => {
    $rest = rest('/api/users');

    mock.onPost('/api/users').reply(201);
  });

  test('Basic', async () => {
    const result = await $rest.create({ name: 'John' });

    expect(mock.history.post[0].url).toEqual('/api/users');
    expect(mock.history.post[0].data).toEqual(JSON.stringify({ name: 'John' }));
    expect(result.status).toEqual(201);
  });
});
