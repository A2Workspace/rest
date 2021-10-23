import axios from 'axios';
import createMockedAxios from './helpers/createMockedAxios';
import { captureAxiosError } from '../src/captures';

const mock = createMockedAxios();

describe('captures', () => {
  afterEach(() => {
    mock.reset();
  });

  describe('captureAxiosError', () => {
    test('基本測試', async () => {
      mock.onPost('/api/join-us').reply(422);

      const handleResponse = jest.fn((res) => res.data);
      const handleAxiosError = jest.fn((error) => error.isAxiosError);
      const handleError = jest.fn((error) => error);

      await axios
        .post('/api/join-us')
        .then(handleResponse)
        .catch(captureAxiosError(handleAxiosError))
        .catch(handleError);

      // 因回傳非 200 成功 handleResponse 應不被呼叫過
      expect(handleResponse.mock.calls.length).toBe(0);

      // 因為錯誤被攔截 handleError 應不被呼叫過
      expect(handleError.mock.calls.length).toBe(0);

      // handleAxiosError 應被呼叫過
      expect(handleAxiosError.mock.calls.length).toBe(1);

      // handleAxiosError 應接收一個 AxiosError 參數
      expect(handleAxiosError.mock.calls[0][0]).toMatchObject({
        response: {
          status: 422,
        },
      });

      // handleAxiosError 應回傳一個 true
      expect(handleAxiosError.mock.results[0].value).toBeTruthy();
    });

    test('略過非 AxiosError 不處理', async () => {
      mock.onPost('/api/join-us').reply(200);

      const handleAxiosError = jest.fn((error) => error.isAxiosError);
      const handleError = jest.fn((error) => error);

      await axios
        .post('/api/join-us')
        .then(() => {
          throw '捕獲這個錯誤吧';
        })
        .catch(captureAxiosError(handleAxiosError))
        .catch(handleError);

      // 非 http 請求錯誤 handleAxiosError 應不被呼叫過
      expect(handleAxiosError.mock.calls.length).toBe(0);

      // handleError 應被呼叫過
      expect(handleError.mock.calls.length).toBe(1);

    });
  });
});
