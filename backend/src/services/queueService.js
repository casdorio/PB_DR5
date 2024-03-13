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
    try {
      const currentUser = await Client.findOne({
        where: { queueId: queueId, status: 'in_service' },
      });
  
      if (currentUser) {
        currentUser.status = 'served';
        await currentUser.save();
      }
  
      const nextUser = await Client.findOne({
        where: { queueId: queueId, status: 'waiting' },
        order: [['serviceNumber', 'ASC']],
      });
  
      if (nextUser) {
        nextUser.status = 'in_service';
        await nextUser.save();
  
        return { status: 200, message: "Próximo usuário agora está em atendimento.", nextUserId: nextUser.id };
      } else {
        return { status: 404, message: "Nenhum usuário em espera." };
      }
    } catch (error) {
      console.error('Erro ao avançar para o próximo usuário:', error);
      return { status: 500, message: "Erro ao avançar para o próximo usuário." };
    }
  };
  

const toggleQueue = async (queueId, status) => {
    try {
        const queue = await Queue.findByPk(queueId);

        if (!queue) {
            return { status: 404, message: "Fila não encontrada." };
        }

        queue.isActive = status;
        await queue.save();

        if (status === 'true') {
            return { status: 200, message: "Fila ativada com sucesso." };
        } else {
            return { status: 200, message: "Fila desativada com sucesso." };
        }
    } catch (error) {
        console.error('Erro ao alterar o status da fila:', error);
        return { status: 500, message: "Erro ao alterar o status da fila." };
    }
};


export { getQueueInfo, callNextInQueue, toggleQueue };
