import Queue from '../models/queueModel.js';
import Client from '../models/clientModel.js';

const getQueueInfo = async (queueId) => {
  // Lógica para pegar informações da fila do banco de dados
};

const callNextInQueue = async (queueId) => {
  // Lógica para atualizar o próximo na fila, etc.
};

export { getQueueInfo, callNextInQueue };
