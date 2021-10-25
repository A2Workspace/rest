import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { captureAxiosError, captureStatusCode, captureValidationError } from '../src/core/captures';

const API_URL = '/endpoint';

const mock = new MockAdapter(axios);

describe('captures', () => {
  afterEach(() => {
    mock.reset();
  });

  describe('captureAxiosError()', () => {
    test('基本測試', async () => {
      mock.onPost(API_URL).reply(422);

      const handleResponse = jest.fn((res) => res.data);
      const handleAxiosError = jest.fn((error) => error.isAxiosError);
      const handleError = jest.fn((error) => error);

      await axios
        .post(API_URL)
        .then(handleResponse)
        .catch(captureAxiosError(handleAxiosError))
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

    test('略過非 AxiosError 不處理', async () => {
      mock.onPost(API_URL).reply(200);

      const handleAxiosError = jest.fn((error) => error.isAxiosError);
      const handleError = jest.fn((error) => error);

      await axios
        .post(API_URL)
        .then(() => {
          throw '捕獲這個錯誤吧';
        })
        .catch(captureAxiosError(handleAxiosError))
        .catch(handleError);

      expect(handleAxiosError).not.toHaveBeenCalled();
      expect(handleError).toHaveBeenCalledTimes(1);
    });
  });

  describe('captureStatusCode()', () => {
    test('基本測試', async () => {
      mock.onPost(API_URL).reply(403);

      const handleResponse = jest.fn((res) => res.data);
      const handleUnauthorized = jest.fn((error) => error.response.status);
      const handleForbidden = jest.fn((error) => error.response.status);
      const handleError = jest.fn((error) => error);

      await axios
        .post(API_URL)
        .then(handleResponse)
        .catch(captureStatusCode(401, handleUnauthorized))
        .catch(captureStatusCode(403, handleForbidden))
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

    test('測試參數為陣列', async () => {
      mock.onPost(API_URL).reply(403);

      const handlePermissionDenied = jest.fn((error) => error.response.status);
      const handleError = jest.fn((error) => error);

      await axios
        .post(API_URL)
        .catch(captureStatusCode([401, 403], handlePermissionDenied))
        .catch(handleError);

      expect(handleError).not.toHaveBeenCalled();

      expect(handlePermissionDenied).toHaveBeenCalledTimes(1);
      expect(handlePermissionDenied).toBeCalledWith(
        expect.objectContaining({
          response: expect.objectContaining({
            status: expect.any(Number)
          }),
        })
      );
    });
  });

  describe('captureValidationError()', () => {
    test('基本測試', async () => {
      mock.onPost(API_URL).reply(422, {
        message: '缺少必要資料',
        errors: {
          title: '標題不能為空',
          name: '名稱不能為空',
        },
      });

      const handleResponse = jest.fn((res) => res.data);
      const handleValidationError = jest.fn((errorBag) => errorBag.first());
      const handleError = jest.fn((error) => error);

      await axios
        .post(API_URL)
        .then(handleResponse)
        .catch(captureValidationError(handleValidationError))
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
