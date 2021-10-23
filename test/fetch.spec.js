import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import rest from '../src/index';

const mock = new MockAdapter(axios);

describe('Rest.fetch()', () => {
  afterEach(() => {
    mock.reset();
  });

  beforeEach(() => {
    mock.onGet('/api/users/1').reply(200, {
      name: 'John',
    });
  });

  test('基本測試', async () => {
    const $rest = rest('/api/users');

    const result = await $rest.fetch(1);

    expect(mock.history.get[0].url).toEqual('/api/users/1');
    expect(result.data).toEqual({ name: 'John' });
  });
});
