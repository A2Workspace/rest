import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import testActionRetunedPromise from './helper/testActionRetunedPromise';
import rest from '../src/index';

const mock = new MockAdapter(axios);

describe('Rest.fetch()', () => {
  afterEach(() => {
    mock.reset();
  });

  test('基本測試', async () => {
    mock.onGet('/api/users/1').reply(200, { name: 'John' });

    const users = rest('/api/users');

    const result = await users.fetch(1);

    expect(mock.history.get[0].url).toEqual('/api/users/1');
    expect(result.data).toEqual({ name: 'John' });
  });

  testActionRetunedPromise(
    '回傳值測試',
    function getTarget() {
      return rest('/api/users').fetch(1);
    },
    function getRequestHandler() {
      return mock.onGet('/api/users/1');
    }
  );
});
