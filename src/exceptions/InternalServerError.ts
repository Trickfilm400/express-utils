/**
 * originalError Object Type
 * interface Error {
 *     name: string;
 *     message: string;
 *     stack?: string;
 * }
 */
import { Config, HttpError, HttpExceptions } from '../index';

class InternalServerError extends HttpExceptions.HttpException {
  private error: Error;
  constructor(originalError: Error) {
    super(500, 'Internal Server Error');
    this.error = originalError;
  }
  getBody(): HttpError<Error> {
    if (Config.getConfig().get('env') === 'test')
      return { ...super.getBody(), errorDetails: this.error };
    else return super.getBody();
  }
}

export default InternalServerError;
