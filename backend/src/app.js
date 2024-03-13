import http from 'http';
import createExpressApp from './config/express.js';
import setupSocketIO from './config/socketio.js';
import setupRoutes from './api/routes/index.js';
import { BASE_PORT } from './globals.js';

const app = createExpressApp();
setupRoutes(app);

const httpServer = http.createServer(app);
setupSocketIO(httpServer);

httpServer.listen(BASE_PORT, () => {
  console.log(`Server up and running on port ${BASE_PORT}...`);
});
