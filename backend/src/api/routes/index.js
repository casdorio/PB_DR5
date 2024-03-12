import express from 'express';
import queueRoutes from './queueRoutes.js'; 

const setupRoutes = (app) => {
  const router = express.Router();

  queueRoutes(router);

  app.use('/api', router);
};

export default setupRoutes;