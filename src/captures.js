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
 */
export function captureAxiosError(handler) {
  return function (error) {
    if (error.isAxiosError) {
      return handler(error);
    }

    throw error;
  };
}

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
 */
export function captureStatusCode(code, handler) {
  let expected = Array.isArray(code) ? code : [code];

  return function (error) {
    let status = error.response?.status;

    if (status && expected.includes(status)) {
      return handler(error);
    }

    throw error;
  };
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
 */
export function captureValidationError(brief, handler) {
  if (typeof brief === 'function') {
    handler = brief;
    brief = false;
  }

  return captureStatusCode(422, function (error) {
    if (typeof handler !== 'function') {
      return null;
    }

    let messageBag = brief ? new BriefValidationMessageBag(error.response) : new ValidationMessageBag(error.response);

    return handler(messageBag);
  });
}

class ValidationMessageBag {
  _response;
  _message;
  _errors;

  constructor(response) {
    this._response = response;
    this._message = response.data.message || 'The given data was invalid';
    this._errors = response.data.errors || {};

    for (const [key, value] of Object.entries(this._errors)) {
      this._errors[key] = Array.isArray(value) ? value : [value];
    }
  }

  get response() {
    return this._response;
  }

  get message() {
    return this._message;
  }

  get errors() {
    return this._errors;
  }

  first(field) {
    for (const [key, value] of Object.entries(this._errors)) {
      if (!field || field == key) {
        return value[0];
      }
    }
  }
}

class BriefValidationMessageBag extends ValidationMessageBag {
  constructor(response) {
    super(response);

    for (const [key, value] of Object.entries(this._errors)) {
      this._errors[key] = value[0];
    }
  }

  first(field) {
    for (const [key, value] of Object.entries(this._errors)) {
      if (!field || field == key) {
        return value;
      }
    }
  }
}
