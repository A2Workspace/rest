import { captureAxiosError, captureStatusCode } from './captures';

export default class RestPromise extends Promise {
  constructor(executor) {
    super(executor);
  }

  catchAxiosError(handler) {
    return this.catch(captureAxiosError(handler));
  }

  catchStatusCode(code, handler) {
    return this.catch(captureStatusCode(code, handler));
  }

  catchValidationError(brief, handler) {
    return this.catch(captureValidationError(brief, handler));
  }
}