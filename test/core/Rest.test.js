import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import rest from '../../src/index';

const API_URL = '/endpoint';

const mock = new MockAdapter(axios);

describe('Rest', () => {
  afterEach(() => {
    mock.reset();
  });

  describe('Return of action', () => {
    test('catchStatusCode()', async () => {
      mock.onPost('/api/users').reply(403);

      const handleResponse = jest.fn((res) => res.data);
      const handleUnauthorized = jest.fn((error) => error.response.status);
      const handleForbidden = jest.fn((error) => error.response.status);
      const handleError = jest.fn((error) => error);

      await rest('/api/users')
        .create()
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
  });
});
