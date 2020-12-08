import 'reflect-metadata';
import { NextFunction, Request, RequestHandler, Response } from 'express';
import { plainToClass } from 'class-transformer';
import { validate, ValidationError } from 'class-validator';
import { AppRouter } from '../../AppRouter';
import { MetadataKeys } from './MetadataKeys';
import { Methods } from './Methods';
import { AppLogger, LogTypes } from '../../logger';

interface ErrorMessages {
  [key: string]: any
}

function bodyValidators<T>(keys: { new(...args: any[]): T }, skipMissingProperties = false): RequestHandler {
  return function (req: Request, res: Response, next: NextFunction) {
    if (!req.body) {
      res.status(422).send('Invalid request');
      return;
    }

    validate(plainToClass(keys, req.body), { skipMissingProperties })
      .then((errors: ValidationError[]) => {
        if (errors.length > 0) {
          const jsonFormattedError = transformValidationErrorsToJSON(errors);
          AppLogger.error(LogTypes.PAYLOAD_VALIDATION_ERROR, jsonFormattedError);
          res.status(400).json(jsonFormattedError).end();
        } else {
          next();
        }
      });
  }
}

function transformValidationErrorsToJSON(errors: ValidationError[]) {
  return errors.reduce((p: ErrorMessages, c: ValidationError) => {
    if (!c.children || !c.children.length) {
      p[c.property] = Object.keys(c.constraints!).map(key => c.constraints![key]);
    } else {
      p[c.property] = transformValidationErrorsToJSON(c.children);
    }
    return p;
  }, {});
}

export function controller(routePrefix: string) {
  return (target: any) => {
    const router = AppRouter.getInstance();

    for (const key in target.prototype) {
      const routeHandler = target.prototype[key];
      const path = Reflect.getMetadata(
        MetadataKeys.path,
        target.prototype,
        key
      );

      const method: Methods = Reflect.getMetadata(
        MetadataKeys.method,
        target.prototype,
        key
      );

      const middlewares = Reflect.getMetadata(MetadataKeys.middleware, target.prototype, key) || [];

      const requiredBodyProps = Reflect.getMetadata(MetadataKeys.validator, target.prototype, key) || [];

      const validator = bodyValidators(requiredBodyProps);

      if (path) {
        router[method](
          `${routePrefix}${path}`,
          ...middlewares,
          validator,
          routeHandler
        )
      }
    }
  }
}