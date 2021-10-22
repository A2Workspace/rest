import rest from '../src/index';
import { users } from './helpers/seeds';
import createMockedAxios from './helpers/createMockedAxios';

describe('fetchAll', () => {
  let $rest;
  const mock = createMockedAxios();

  afterEach(() => {
    mock.reset();
  });

  beforeEach(() => {
    $rest = rest('/api/users');

    mock.onGet('/api/users/1').reply(200, users[0]);
  });

  test('Basic', async () => {
    const result = await $rest.fetch(1);

    expect(mock.history.get[0].url).toEqual('/api/users/1');
    expect(result.data).toEqual(users[0]);
  });
});
