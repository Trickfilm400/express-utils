import { ValidationErrorItem } from 'joi';
import { HttpError, HttpExceptions } from '../index';

class InputException extends HttpExceptions.BadRequest {
  private readonly errorDetails: ValidationErrorItem[];

  constructor(errorDetails: ValidationErrorItem[]) {
    super('Bad Request');
    this.errorDetails = errorDetails;
  }

  public getBody(): HttpError<ValidationErrorItem[]> {
    return { ...super.getBody(), errorDetails: this.errorDetails };
  }
}

export default InputException;
