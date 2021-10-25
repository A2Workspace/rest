import RestPromise from '../../src/core/RestPromise';

/**
 *
 * @param {string} label
 * @param {getTargetCallable} getTarget
 * @param {getRequestHandlerCallable} getRequestHandler
 * @returns {void}
 */
export default function testActionRetunedPromise(label, getTarget, getRequestHandler) {
  describe(label, () => {

    test('回傳必須為 RestPromise 實體', async () => {
      getRequestHandler().reply(200);

      const target = getTarget();

      expect(target).toBeInstanceOf(RestPromise);

      expect(target).toHaveProperty('catchAxiosError');
      expect(target).toHaveProperty('catchStatusCode');
      expect(target).toHaveProperty('catchValidationError');
    });

    test('我仍是我', async () => {
      getRequestHandler().reply(200);

      let target = getTarget();

      expect(target).toBeInstanceOf(RestPromise);

      target = target.then(() => {});
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

    test('catchAxiosError()', async () => {
      getRequestHandler().reply(400);

      const handleResponse = jest.fn((res) => res.data);
      const handleAxiosError = jest.fn((error) => error.isAxiosError);
      const handleError = jest.fn((error) => error);

      await getTarget()
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

    test('catchStatusCode()', async () => {
      getRequestHandler().reply(403);

      const handleResponse = jest.fn((res) => res.data);
      const handleUnauthorized = jest.fn((error) => error.response.status);
      const handleForbidden = jest.fn((error) => error.response.status);
      const handleError = jest.fn((error) => error);

      await getTarget()
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

    test('catchValidationError()', async () => {
      getRequestHandler().reply(422, {
        message: '缺少必要資料',
        errors: {
          title: '標題不能為空',
          name: '名稱不能為空',
        },
      });

      const handleResponse = jest.fn((res) => res.data);
      const handleValidationError = jest.fn((errorBag) => errorBag.first());
      const handleError = jest.fn((error) => error);

      await getTarget()
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
}

/**
 * @callback getTargetCallable
 * @returns {RestPromise}
 */

/**
 * @callback getRequestHandlerCallable
 * @param {MockAdapter}
 * @returns {RequestHandler}
 */
