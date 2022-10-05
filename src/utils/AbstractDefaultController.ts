import { NextFunction, Request, Response, Router } from 'express';
import { IDefaultService } from '../interfaces/IDefaultService';
import { ObjectSchema } from 'joi';
import { IDefaultController } from '../interfaces/IDefaultController';
import { HttpExceptions, HTTPResponse } from '../index';
import InputException from '../exceptions/InputException';

abstract class DefaultController<T extends IDefaultService<T>>
  implements IDefaultController<T>
{
  private readonly joiSchema: ObjectSchema;
  private readonly service: IDefaultService<T>;
  constructor(obj: {
    joi: ObjectSchema;
    service: IDefaultService<T>;
    router?: Router;
  }) {
    this.joiSchema = obj.joi;
    this.service = obj.service;
    if (obj.router) DefaultController.addRoutes(obj.router, this);
  }
  public static addRoutes(router: Router, instance: DefaultController<any>) {
    router
      .route('/:id?')
      .get(instance.get)
      .post(instance.post)
      .patch(instance.patch)
      .delete(instance.delete)
      .put(instance.put);
  }

  // todo: parameters can be cleaned up I guess
  public _missingID = (_req: Request, _res: Response, _next: NextFunction) => {
    if (!_req.params.id) throw new HttpExceptions.BadRequest('Missing ID');
  };

  public _joiValidation(type: string, obj: object) {
    const result = this.joiSchema.tailor(type).validate(obj);
    if (result.error) throw new InputException(result.error.details);
    return result;
  }

  //functions
  public get = async (
    req: Request,
    res: Response<HTTPResponse<T | T[] | null>>,
    next: NextFunction
  ) => {
    try {
      const x = await this.service.get(req.params.id);
      res.json({ data: x });
    } catch (e) {
      next(e);
    }
  };

  public delete = async (
    req: Request,
    res: Response<HTTPResponse<boolean>>,
    next: NextFunction
  ) => {
    try {
      this._missingID(req, res, next);
      const x = await this.service.delete(req.params.id);
      res.json({ data: x });
    } catch (e) {
      next(e);
    }
  };

  public post = async (
    req: Request,
    res: Response<HTTPResponse<T>>,
    next: NextFunction
  ) => {
    try {
      const validationResult = this._joiValidation('create', req.body);
      const x = await this.service.post(validationResult.value);
      res.json({ data: x });
    } catch (e) {
      next(e);
    }
  };

  public patch = async (
    req: Request,
    res: Response<HTTPResponse<T>>,
    next: NextFunction
  ) => {
    try {
      this._missingID(req, res, next);
      const validationResult = this._joiValidation('update', req.body);
      const x = await this.service.patch(req.params.id, validationResult.value);
      if (!x)
        throw new HttpExceptions.NotFound(
          `'${req.params.id}' not found while trying to update`
        );
      res.json({ data: x });
    } catch (e) {
      next(e);
    }
  };

  public put = async (
    req: Request,
    res: Response<HTTPResponse<T>>,
    next: NextFunction
  ) => {
    try {
      this._missingID(req, res, next); //if id is missing, throw input exception or so
      const validationResult = this._joiValidation('create', req.body); //if validation error throw also exception
      const x = await this.service.put(req.params.id, validationResult.value);
      res.json({ data: x });
    } catch (e) {
      next(e); //catch all errors from above and pass to error middleware
    }
  };
}

export default DefaultController;
