import { NextFunction, Request, Response } from 'express';
import { ZodTypeAny, z } from 'zod';

type Source = 'body' | 'query' | 'params';

declare global {
  namespace Express {
    interface Request {
      valid?: {
        body?: unknown;
        query?: unknown;
        params?: unknown;
      };
    }
  }
}

export function validate<S extends ZodTypeAny>(source: Source, schema: S) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    const result = schema.safeParse(req[source]);
    if (!result.success) {
      return next(result.error);
    }
    req.valid = req.valid ?? {};
    req.valid[source] = result.data;
    next();
  };
}

export function validated<S extends ZodTypeAny>(
  req: Request,
  source: Source,
  _schema: S,
): z.output<S> {
  return req.valid?.[source] as z.output<S>;
}