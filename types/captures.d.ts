import type { AxiosResponse, AxiosError } from 'axios';

type ErrorCapturer = (error: any) => void;

type AxiosErrorHandler<T> = (error: AxiosError<T>) => any;

type ValidationErrorHandler<T = ValidationMessageBag> = (error: T) => any;

interface ValidationErrorResponse {
  message: string;
  errors: Record<string, string[]>;
}

declare function captureAxiosError(handler: AxiosErrorHandler<any>): ErrorCapturer;

declare function captureStatusCode(code: number | number[], handler: AxiosErrorHandler<any>): ErrorCapturer;

declare function captureStatusCode(code: string | string[], handler: AxiosErrorHandler<any>): ErrorCapturer;

declare function captureValidationError(brief: ValidationErrorHandler<ValidationMessageBag>): ErrorCapturer;

declare function captureValidationError(brief: boolean, handler: ValidationErrorHandler<ValidationMessageBag> ): ErrorCapturer;

declare class ValidationMessageBag {
  _response: AxiosResponse<ValidationErrorResponse>;
  _message: string;
  _errors: Record<string, string[]>;

  constructor(response: AxiosResponse<ValidationErrorResponse>);
  get response(): AxiosResponse<ValidationErrorResponse>;
  get message(): string;
  get errors(): Record<string, string[]>;
  first(field?: string): string;
}

declare class BriefValidationMessageBag {
  _response: AxiosResponse<ValidationErrorResponse>;
  _message: string;
  _errors: Record<string, string>;

  constructor(response: AxiosResponse<ValidationErrorResponse>);
  get response(): AxiosResponse<ValidationErrorResponse>;
  get message(): string;
  get errors(): Record<string, string>;
  first(field?: string): string;
}
