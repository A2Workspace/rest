import {
  captureAxiosError,
  captureStatusCode,
  captureValidationError,
} from './captures';

export default class RestPromise extends Promise {
  /**
   * @param {AxiosErrorHandler} handler
   * @returns {RestPromise}
   */
  catchAxiosError(handler) {
    return this.catch(captureAxiosError(handler));
  }

  /**
   * @param {(number|number[]|string|string[])} code
   * @param {AxiosErrorHandler} handler
   * @returns {RestPromise}
   */
  catchStatusCode(code, handler) {
    return this.catch(captureStatusCode(code, handler));
  }

  /**
   * @param {(boolean|ValidationErrorHandler)} brief
   * @param {ValidationErrorHandler} [handler]
   * @returns {RestPromise}
   */
  catchValidationError(brief, handler) {
    return this.catch(captureValidationError(brief, handler));
  }
}

/**
 * @param {Promise} promise
 * @returns {RestPromise}
 */
RestPromise.wrap = function (promise) {
  if (promise instanceof Promise) {
    return RestPromise.resolve(promise);
  }

  throw TypeError('傳入的參數必須為 Promise');
};

/**
 * @callback AxiosErrorHandler
 * @param {AxiosError} error
 * @returns {*}
 */

/**
 * @callback ValidationErrorHandler
 * @param {(ValidationMessageBag|BriefValidationMessageBag)} error
 * @returns {*}
 */

/**
 * @typedef ValidationErrorResponse
 * @type {object}
 * @property {number} status
 * @property {Object} data
 * @property {string} data.message
 * @property {Object.<string, string[]>} data.errors
 */
