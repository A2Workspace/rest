
/**
 * 捕獲處理指定 http 狀態碼
 *
 * ```js
 * axios.post(API_URI)
 *   .then((res) => res.data)
 *   .catch(captureStatusCode(401, (res) => {
 *     console.log('尚未登入');
 *   }))
 *   .catch(captureStatusCode(403, (res) => {
 *     console.log('沒有權限');
 *   }))
 * ```
 *
 * @param  {string|array}  code
 * @param  {(error: Error) => any)}  handler
 * @return {(error: Error) => any}
 *
 * @throws {Error}
 */
export function captureStatusCode(code, handler) {
  let expected = Array.isArray(code) ? code : [code];

  return function (error) {
    let status = error.response?.status;

    if (status && expected.includes(status)) {
      return handler ? handler(error) : null;
    }

    throw error;
  }
}

/**
 * 捕獲驗證錯誤
 *
 * ```js
 * axios.post(API_URI)
 *   .then((res) => res.data)
 *   .catch(captureValidationError(({ message, errors }) => {
 *     this.errors = errors;
 *     alert(message);
 *   }))
 * ```
 *
 * @param  {(context: object) => any}  handler
 * @param  {boolean}  brief
 * @return {(error: Error) => any}
 * @throws {Error}
 */
export function captureValidationError(handler, brief) {
  return captureStatusCode(422, function (error) {
    return handler ? handler(createValidationMessageBag(error.response, brief)) : null;
  });
}

/**
 * 生成一個錯誤訊息包
 *
 * @param  {object}  response
 * @param  {boolean}  brief
 * @return {({ response: object; message: string; errors: object; first: (field: (string|null)) => string })}
 */
function createValidationMessageBag(response, brief = false) {
  let message = response.data?.message || 'The given data was invalid';
  let errors = response.data?.errors || {};

  Object.entries(errors).forEach(([key, value]) => {
    errors[key] = Array.isArray(value) ? value : [value];
  })

  if (brief) {
    Object.entries(errors).forEach(([key, value]) => {
      errors[key] = value[0];
    })
  }

  return {
    get response() {
      return response;
    },
    get message() {
      return message;
    },
    get errors() {
      return errors;
    },
    first(field) {
      return Object.entries(this.errors).find(([key, value]) => {
        if (! field || field == key) {
          return value[0];
        }
      })
    }
  };
}

/**
 * 捕獲 axiox 錯誤
 *
 * ```js
 * axios.post(API_URI)
 *   .then((res) => res.data)
 *   .catch(captureAxiosError((res) => {
 *     console.log('請求失敗');
 *   }))
 *   .catch((error) => {
 *     console.error(error);
 *   })
 * ```
 *
 * @param  {function}  handler
 * @return {function}
 *
 * @throws {Error}
 */
export function captureAxiosError(handler) {
  return function(error) {
    if (error.isAxiosError) {
      return handler ? handler(error) : null;
    }

    throw error;
  };
}
