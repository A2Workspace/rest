import type { AxiosErrorHandler, ValidationErrorHandler, ValidationMessageBag } from './captures';

declare interface RestPromiseInstance<T = any> extends Promise<T> {
  catchAxiosError(handler: AxiosErrorHandler<any>): RestPromiseInstance;
  catchStatusCode(code: number | number[] | string | string[], handler: AxiosErrorHandler<any>): RestPromiseInstance;
  catchValidationError(brief: ValidationErrorHandler<ValidationMessageBag>): RestPromiseInstance;
  catchValidationError(brief: boolean, handler: ValidationErrorHandler<ValidationMessageBag>): RestPromiseInstance;
}

interface RestPromiseConstructor {
  readonly prototype: RestPromiseInstance;
  wrap(promise: Promise<any>): RestPromiseInstance;
}

declare var RestPromise: RestPromiseConstructor;
