import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import RestPromise from '../../src/core/RestPromise';

const mock = new MockAdapter(axios);

describe('RestPromise', () => {
  test('基本測試', async () => {
    const target = RestPromise.wrap(new Promise((resolve) => resolve()));

    expect(target).toBeInstanceOf(RestPromise);

    expect(target).toHaveProperty('catchAxiosError');
    expect(target).toHaveProperty('catchStatusCode');
    expect(target).toHaveProperty('catchValidationError');
  });

  test('我仍是我', async () => {
    let target = RestPromise.wrap(new Promise((resolve) => resolve()));

    expect(target).toBeInstanceOf(RestPromise);

    target = target.then((res) => res.data);
    expect(target).toBeInstanceOf(RestPromise);

    target = target.catch(() => {});
    expect(target).toBeInstanceOf(RestPromise);

    target = target.catchAxiosError(() => {});
    expect(target).toBeInstanceOf(RestPromise);

    target = target.catchStatusCode(404, () => {});
    expect(target).toBeInstanceOf(RestPromise);

    target = target.catchValidationError(() => {});
    expect(target).toBeInstanceOf(RestPromise);
  });

  describe('axios', () => {
    afterEach(() => {
      mock.reset();
    });

    test('基本測試', async () => {
      mock.onGet('/endpoint').reply(200);

      const target = RestPromise.wrap(axios.get('/endpoint'));
    });
  });
});
