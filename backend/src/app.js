import express from 'express';
import cors from 'cors';
import route from './routes/Routes.js';

const app = express();
app.use(cors());
app.use(express.json());
app.use(route);

const httpServer = app.listen(5000, () => {
  console.log('HTTP Server up and running...');
});
