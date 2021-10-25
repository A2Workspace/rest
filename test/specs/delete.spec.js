import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import testActionRetunedPromise from '../testActionRetunedPromise';
import rest from '../../src/index';

const mock = new MockAdapter(axios);

describe('Rest.delete()', () => {
  afterEach(() => {
    mock.reset();
  });

  beforeEach(() => {
    mock.onDelete('/api/users/1').reply(201);
  });

  test('基本測試', async () => {
    const $rest = rest('/api/users');

    const result = await $rest.delete(1);

    expect(mock.history.delete[0].url).toEqual('/api/users/1');
    expect(mock.history.delete[0].method).toEqual('delete');
    expect(result.status).toEqual(201);
  });

  testActionRetunedPromise(
    '回傳值測試',
    function getTarget() {
      return rest('/api/users').delete(1);
    },
    function getRequestHandler() {
      return mock.onDelete('/api/users/1');
    }
  );
});
