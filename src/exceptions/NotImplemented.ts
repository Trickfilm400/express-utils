import { HttpExceptions } from '../index';

class NotImplemented extends HttpExceptions.HttpException {
  constructor() {
    //todo 501 error code
    super(501, 'Not Implemented');
  }
}

export default NotImplemented;
