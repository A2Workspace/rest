import type { AxiosResponse, AxiosError } from 'axios';

type ErrorCapturer = (error: any) => void;

type AxiosErrorHandler<T = any> = (error: AxiosError<T>) => any;

interface ValidationError {
  message?: string;
  errors?: object;
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
 */
export function captureAxiosError(handler: AxiosErrorHandler<any>): ErrorCapturer {
  return function (error: any) {
    if (error.isAxiosError) {
      return handler ? handler(error) : null;
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
export function captureStatusCode(code: any, handler: AxiosErrorHandler<any>): ErrorCapturer {
  let expected = Array.isArray(code) ? code : [code];

  return function (error: any) {
    let status = error.response?.status;

    if (status && expected.includes(status)) {
      return handler ? handler(error) : null;
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
export function captureValidationError(
  brief: boolean | AxiosErrorHandler<ValidationError>,
  handler?: AxiosErrorHandler<ValidationError>
): ErrorCapturer {
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
  _response: AxiosResponse<ValidationError>;
  _message: string;
  _errors: object;

  constructor(response: AxiosResponse<ValidationError>) {
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

  first(field: string): string {
    for (const [key, value] of Object.entries(this._errors)) {
      if (! field || field == key) {
        return value[0];
      }
    }
  }
}

class BriefValidationMessageBag extends ValidationMessageBag {
  constructor(response: AxiosResponse<ValidationError>) {
    super(response);

    for (const [key, value] of Object.entries(this._errors)) {
      this._errors[key] = value[0];
    }
  }

  first(field: string): string {
    for (const [key, value] of Object.entries(this._errors)) {
      if (! field || field == key) {
        return value;
      }
    }
  }
}
