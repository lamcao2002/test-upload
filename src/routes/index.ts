import { Router } from 'express';
import { initRoutersUpload } from './upload';

export function initRouters(): Router {
  const router = Router();

  initRoutersUpload(router);

  return router;
}
