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

        return res.json({ message: "Próximo usuário agora está em atendimento.", nextUserId: nextUser.id });
    } else {
        return res.status(404).json({ message: "Nenhum usuário em espera." });
    }

} catch (error) {
    console.error('Erro ao avançar para o próximo usuário:', error);
}
};

export { getQueueInfo, callNextInQueue };
