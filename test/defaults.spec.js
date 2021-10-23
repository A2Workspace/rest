import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import rest from '../src/index';

const mock = new MockAdapter(axios);

describe('defaults', () => {
  afterEach(() => {
    mock.reset();
  });

  beforeEach(() => {
    mock.onGet('/api/users').reply(200, []);
  });

  test('設定全域的請求預設參數', async () => {
    rest.defaults.fetchAll.params.limit = 15;
    rest.defaults.fetchAll.params.sortBy = 'id';

    const $rest = rest('/api/users');

    await $rest.fetchAll({ page: 1 });

    expect(mock.history.get[0].params).toEqual({
      page: 1,
      limit: 15,
      sortBy: 'id',
    });
  });

  test('修改 RestInstance 的預設參數', async () => {
    const $rest = rest('/api/users');

    $rest.options.fetchAll.params.limit = 15;
    $rest.options.fetchAll.params.sortBy = 'id';

    await $rest.fetchAll({ page: 1 });

    expect(mock.history.get[0].params).toEqual({
      page: 1,
      limit: 15,
      sortBy: 'id',
    });
  });

  test('修改全域時不會動到 RestInstance', async () => {
    rest.defaults.fetchAll.params.limit = 15;

    const $rest = rest('/api/users');

    expect($rest.options.fetchAll.params.limit).toEqual(15);

    $rest.options.fetchAll.params.limit = 30;

    expect($rest.options.fetchAll.params.limit).toEqual(30);

    // 修改後全域設置應仍為 15
    expect(rest.defaults.fetchAll.params.limit).toEqual(15);
  });

  test('RestInstance 間的 configs 應相互不影響', async () => {
    rest.defaults.fetchAll.params.limit = 15;

    const $post = rest('/api/posts');
    const $users = rest('/api/users');

    $post.options.fetchAll.params.limit = 30;

    // 修改 $post 後 $users 的設置應仍為 15
    expect($users.options.fetchAll.params.limit).toEqual(15);
  });
});
