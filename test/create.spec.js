import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import testActionRetunedPromise from './helper/testActionRetunedPromise';
import rest from '../src/index';

const mock = new MockAdapter(axios);

describe('Rest.create()', () => {
  afterEach(() => {
    mock.reset();
  });

  beforeEach(() => {
    mock.onPost('/api/users').reply(201);
  });

  test('基本測試', async () => {
    const $rest = rest('/api/users');

    const result = await $rest.create({ name: 'John' });

    expect(mock.history.post[0].url).toEqual('/api/users');
    expect(mock.history.post[0].data).toEqual(JSON.stringify({ name: 'John' }));
    expect(result.status).toEqual(201);
  });

  testActionRetunedPromise(
    '回傳值測試',
    function getTarget() {
      return rest('/api/users').create({ name: 'John' });
    },
    function getRequestHandler() {
      return mock.onPost('/api/users');
    }
  );
});
