export interface HttpError<T = any> {
  error: string;
  errorDetails?: T;
}

export interface HttpSuccess<T> {
  data: T;
}

export type HTTPResponse<T> = HttpError | HttpSuccess<T>;
