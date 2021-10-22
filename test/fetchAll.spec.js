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

    mock.onGet('/api/users').reply(200, users);
  });

  test('Basic', async () => {
    const result = await $rest.fetchAll();

    expect(mock.history.get[0].url).toEqual('/api/users');
    expect(result.data).toEqual(users);
    expect(Array.isArray(result.data)).toBeTruthy();
  });

  test('With params', async () => {
    await $rest.fetchAll({ page: 1 });

    expect(mock.history.get[0].url).toEqual('/api/users');
    expect(mock.history.get[0].params).toEqual({ page: 1 });
  });

  test('Append params', async () => {
    await $rest.fetchAll({ page: 1 });

    expect(mock.history.get[0].params).toEqual({ page: 1 });

    await $rest.fetchAll((params) => ({ ...params, sort: 'name' }));

    expect(mock.history.get[1].params).toEqual({ page: 1, sort: 'name' });
  });

  test('With prepare', async () => {
    $rest.prepare((params) => ({ ...params, limit: 15 }));

    await $rest.fetchAll({ page: 1 });

    expect(mock.history.get[0].params).toEqual({ page: 1, limit: 15 });
  });
});
