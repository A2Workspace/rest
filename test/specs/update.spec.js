import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import testActionRetunedPromise from '../testActionRetunedPromise';
import rest from '../../src/index';

const mock = new MockAdapter(axios);

describe('Rest.update()', () => {
  afterEach(() => {
    mock.reset();
  });

  beforeEach(() => {
    mock.onPut('/api/users/1').reply(200, {
      status: true,
    });
  });

  test('基本測試', async () => {
    const users = rest('/api/users');

    const result = await users.update(1, { name: 'John' });

    expect(mock.history.put[0].url).toEqual('/api/users/1');
    expect(mock.history.put[0].data).toEqual(JSON.stringify({ name: 'John' }));
    expect(result.data.status).toBeTruthy();
  });

  testActionRetunedPromise(
    '回傳值測試',
    function getTarget() {
      return rest('/api/users').update(1, { name: 'John' });
    },
    function getRequestHandler() {
      return mock.onPut('/api/users/1');
    }
  );
});
