import Queue from '../api/models/queueModel.js';
import Client from '../api/models/clientModel.js';

const getQueueInfo = async (queueId) => {
  // Lógica para pegar informações da fila do banco de dados
  const queue = await Queue.findByPk(queueId, {
    attributes: ['name', 'isActive'],
  });
  return queue;
};

const callNextInQueue = async (queueId) => {
  // Lógica para atualizar o próximo na fila, etc.
  const next = await Client.findOne({
    where: {
      queueId,
      status: 'waiting',
    },
  });
  return next;
};

export { getQueueInfo, callNextInQueue };
