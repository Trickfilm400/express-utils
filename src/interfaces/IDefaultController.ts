import { HTTPResponse } from '../../types';
import { NextFunction, Request, Response } from 'express';

export interface IDefaultController<T> {
  //fetch data
  get: (
    req: Request,
    res: Response<HTTPResponse<T | T[] | null>>,
    next: NextFunction
  ) => Promise<void>;
  //delete data
  delete: (
    req: Request,
    res: Response<HTTPResponse<boolean>>,
    next: NextFunction
  ) => Promise<void>;
  //exec actions && create new data without knowing new data url
  post: (
    req: Request,
    res: Response<HTTPResponse<T>>,
    next: NextFunction
  ) => Promise<void>;
  //create new data with new url known
  put: (
    req: Request,
    res: Response<HTTPResponse<T>>,
    next: NextFunction
  ) => Promise<void>;
  //update data
  patch: (
    req: Request,
    res: Response<HTTPResponse<T | null>>,
    next: NextFunction
  ) => Promise<void>;
}
