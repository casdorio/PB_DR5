import http from 'http';
import createExpressApp from './config/express.js';
import setupSocketIO from './config/socketio.js';
import setupRoutes from './api/routes/index.js';

const app = createExpressApp();
setupRoutes(app);

const httpServer = http.createServer(app);
setupSocketIO(httpServer);

const PORT = 5000;
httpServer.listen(PORT, () => {
  console.log(`Server up and running on port ${PORT}...`);
});
