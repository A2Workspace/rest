import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import testActionRetunedPromise from './helper/testActionRetunedPromise';
import rest from '../src/index';

const mock = new MockAdapter(axios);

const userTable = [
  { id: 1, name: 'Foo' },
  { id: 2, name: 'Bar' },
];

describe('Rest.fetchAll()', () => {
  afterEach(() => {
    mock.reset();
  });

  beforeEach(() => {
    mock.onGet('/api/users').reply(200, userTable);
  });

  test('基本測試', async () => {
    const users = rest('/api/users');

    const result = await users.fetchAll();

    expect(mock.history.get[0].url).toEqual('/api/users');
    expect(result.data).toEqual(userTable);
    expect(Array.isArray(result.data)).toBeTruthy();
  });

  test('測試查詢參數', async () => {
    const users = rest('/api/users');

    await users.fetchAll({ page: 1 });

    expect(mock.history.get[0].url).toEqual('/api/users');
    expect(mock.history.get[0].params).toEqual({ page: 1 });
  });

  test('測試合併查詢參數', async () => {
    const users = rest('/api/users');

    await users.fetchAll({ page: 1 });

    expect(mock.history.get[0].params).toEqual({ page: 1 });

    await users.fetchAll((params) => ({ ...params, sort: 'name' }));

    expect(mock.history.get[1].params).toEqual({ page: 1, sort: 'name' });
  });

  testActionRetunedPromise(
    '回傳值測試',
    function getTarget() {
      return rest('/api/users').fetchAll();
    },
    function getRequestHandler() {
      return mock.onGet('/api/users');
    }
  );
});
