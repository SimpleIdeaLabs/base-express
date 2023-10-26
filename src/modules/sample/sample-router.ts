import createError from 'err-code';
import { NextFunction, Request, Response, Router } from 'express';

const appRouter = Router();

appRouter.get('/success', (req: Request, res: Response, next: NextFunction) => {
  try {
    res.json({
      hello: 'world'
    });
  } catch (error) {
    next(error);
  }
});

appRouter.get('/error', (req: Request, res: Response, next: NextFunction) => {
  try {
    throw createError(new Error('Sample'), 'SampleError', {
      meta: {
        hello: 'world'
      }
    });
  } catch (error) {
    next(error);
  }
});

export default appRouter;
