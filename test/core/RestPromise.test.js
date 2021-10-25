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

  describe('真槍實彈', () => {
    afterEach(() => {
      mock.reset();
    });

    test('RestPromise.catchAxiosError()', async () => {
      mock.onPost('/api/endpoint').reply(400);

      const handleResponse = jest.fn((res) => res.data);
      const handleAxiosError = jest.fn((error) => error.isAxiosError);
      const handleError = jest.fn((error) => error);

      await RestPromise.wrap(axios.post('/api/endpoint'))
        .then(handleResponse)
        .catchAxiosError(handleAxiosError)
        .catch(handleError);

      expect(handleResponse).not.toHaveBeenCalled();
      expect(handleError).not.toHaveBeenCalled();

      expect(handleAxiosError).toHaveBeenCalledTimes(1);
      expect(handleAxiosError).toBeCalledWith(
        expect.objectContaining({
          response: expect.objectContaining({
            status: expect.any(Number),
          }),
        })
      );

      expect(handleAxiosError).toHaveReturnedWith(true);
    });

    test('RestPromise.catchStatusCode()', async () => {
      mock.onPost('/api/endpoint').reply(403);

      const handleResponse = jest.fn((res) => res.data);
      const handleUnauthorized = jest.fn((error) => error.response.status);
      const handleForbidden = jest.fn((error) => error.response.status);
      const handleError = jest.fn((error) => error);

      await RestPromise.wrap(axios.post('/api/endpoint'))
        .then(handleResponse)
        .catchStatusCode(401, handleUnauthorized)
        .catchStatusCode(403, handleForbidden)
        .catch(handleError);

      expect(handleResponse).not.toHaveBeenCalled();
      expect(handleUnauthorized).not.toHaveBeenCalled();
      expect(handleError).not.toHaveBeenCalled();

      expect(handleForbidden).toHaveBeenCalledTimes(1);
      expect(handleForbidden).toBeCalledWith(
        expect.objectContaining({
          response: expect.objectContaining({
            status: expect.any(Number),
          }),
        })
      );
    });

    test('RestPromise.catchValidationError()', async () => {
      mock.onPost('/api/endpoint').reply(422, {
        message: '缺少必要資料',
        errors: {
          title: '標題不能為空',
          name: '名稱不能為空',
        },
      });

      const handleResponse = jest.fn((res) => res.data);
      const handleValidationError = jest.fn((errorBag) => errorBag.first());
      const handleError = jest.fn((error) => error);

      await RestPromise.wrap(axios.post('/api/endpoint'))
        .then(handleResponse)
        .catchValidationError(handleValidationError)
        .catch(handleError);

      expect(handleResponse).not.toHaveBeenCalled();
      expect(handleError).not.toHaveBeenCalled();

      expect(handleValidationError).toHaveBeenCalledTimes(1);
      expect(handleValidationError).toBeCalledWith(
        expect.objectContaining({
          response: expect.any(Object),
          errors: expect.any(Object),
          message: expect.any(String),
          first: expect.any(Function),
        })
      );

      expect(handleValidationError).toHaveReturnedWith('標題不能為空');
    });

  });
});
