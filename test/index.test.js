import rest from '../src/index';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';

const mock = new MockAdapter(axios);

const users = [
  { id: 1, name: 'Foo' },
  { id: 2, name: 'Bar' },
];

describe('rest', () => {
  let $rest;

  afterEach(() => {
    mock.reset();
  });

  describe('fetchAll()', () => {
    beforeEach(() => {
      $rest = rest('/api/users');

      mock.onGet('/api/users').reply(200, users);
    });

    test('Basic', async () => {
      const result = await $rest.fetchAll();

      expect(mock.history.get[0].url).toEqual('/api/users');
      expect(result.data).toEqual(users);
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

  describe('create()', () => {
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

  describe('fetch()', () => {
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

  describe('fetch()', () => {
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

  describe('update()', () => {
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

  describe('delete()', () => {
    beforeEach(() => {
      $rest = rest('/api/users');

      mock.onDelete('/api/users/1').reply(201);
    });

    test('Basic', async () => {
      const result = await $rest.delete(1);

      expect(mock.history.delete[0].url).toEqual('/api/users/1');
      expect(mock.history.delete[0].method).toEqual('delete');
      expect(result.status).toEqual(201);
    });
  });
});
