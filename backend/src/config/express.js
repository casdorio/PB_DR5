import express from 'express';
import cors from 'cors';
import { API_BASE_URL_VALID } from '../globals.js';


export default function createExpressApp() {
  const app = express();

  const corsOptions = {
    origin: API_BASE_URL_VALID, // Permite somente requisições desse domínio
    optionsSuccessStatus: 200 // Para navegadores mais antigos que não suportam CORS
  };
  app.use(cors(corsOptions));
  app.use(express.json());

  return app;
}
