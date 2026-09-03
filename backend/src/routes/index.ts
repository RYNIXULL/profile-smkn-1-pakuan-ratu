import { Router } from 'express';
import { authRouter } from './auth.routes';
import { publicRouter } from './public.routes';
import { adminRouter } from './admin.routes';

export const apiRouter = Router();

apiRouter.use('/auth', authRouter);
apiRouter.use('/public', publicRouter);
apiRouter.use('/admin', adminRouter);
