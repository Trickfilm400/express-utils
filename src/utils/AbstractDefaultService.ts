import { IDefaultService } from '../interfaces/IDefaultService';
import NotImplemented from '../exceptions/NotImplemented';

abstract class DefaultService<T> implements IDefaultService<T> {
  async delete(_id: string): Promise<boolean> {
    throw new NotImplemented();
  }

  async get(_id: string | undefined): Promise<T[] | T | null> {
    throw new NotImplemented();
  }

  async patch(_id: string, _obj: T): Promise<T | null> {
    throw new NotImplemented();
  }

  async post(_obj: T): Promise<T> {
    throw new NotImplemented();
  }

  async put(_id: string, _obj: T): Promise<T> {
    throw new NotImplemented();
  }
}

export default DefaultService;
