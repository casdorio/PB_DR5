import Queue from "../models/queueModel.js";
import Client from "../models/clientModel.js";

export const getQueue = async (req, res) => {
    try {
        console.log('Obtendo a fila')
      const { queueId, session } = req.params;
  
      let user = null;
      if (session) {
        user = await Client.findOne({ where: { session } });
      }
  
      const queue = await Queue.findByPk(queueId, {
        attributes: ['name', 'isActive'] 
        });
  
      if (!queue) {
        return res.status(404).json({ message: 'Fila não encontrada.' });
      }
  
      const response = {
        queue,
        isActive: queue.isActive
      };
  
      if (user) {
        response.id_client = user.id;
      }
  
      res.status(200).json(response);
    } catch (error) {
      console.error('Erro ao obter a fila:', error.message);
      res.status(500).json({ message: 'Erro ao obter a fila.' });
    }
  };

export const createQueue = async(req, res) =>{
    try {
        const newQueue = await Queue.create(req.body);
        res.status(201).json({
            id_queue: newQueue.id,
            hash_admin: newQueue.hash_admin,
            msg: "Queue Created"
        });
    } catch (error) {
        console.log(error.message);
    }
}



export const getQueuePanel = async (req, res) => {
    const { queueId } = req.params; 

    try {

        const queue = await Queue.findByPk(queueId, {
            attributes: ['name'] 
        });

        if (!queue) {
            return res.status(404).json({ error: "Fila não encontrada" });
        }
        const lastServed = await Client.findOne({
            where: {
                queueId: queueId,
                status: ['in_service', 'served', 'cancelled']
            },
            order: [
                ['serviceNumber', 'DESC'] 
            ],
            attributes: ['serviceNumber'],
        });

        let nextToBeCalled = 1; 
        if (lastServed) {
            nextToBeCalled = lastServed.serviceNumber; 
        }

        res.json({
            queueId: queueId,
            nextToBeCalled, 
            queueName: queue.name

        });
    } catch (error) {
        console.error('Erro ao buscar o painel da fila:', error);
        res.status(500).json({ message: 'Erro ao buscar informações do painel da fila.' });
    }
};

export const getQueuePanelAdmin = async (req, res) => {
    const { queueId, hash_admin } = req.params; 

    try {
        

        const queue = await Queue.findByPk(queueId);
        if (!queue) {
            return res.status(404).json({ message: "Fila não encontrada." });
        }

        const waitingCount = await Client.count({ where: { queueId: queueId, status: 'waiting' } });
        const inServiceCount = await Client.count({ where: { queueId: queueId, status: 'in_service' } });
        const servedCount = await Client.count({ where: { queueId: queueId, status: 'served' } });
        const cancelledCount = await Client.count({ where: { queueId: queueId, status: 'cancelled' } });

        const nextToBeCalled = await Client.findOne({
            where: {
                queueId: queueId,
                status: ['in_service', 'served', 'cancelled']
            },
            order: [['serviceNumber', 'DESC']],
            attributes: ['serviceNumber'],
        });

        res.json({
            queueId: queueId,
            queueName: queue.name, 
            waiting: waitingCount,
            inService: inServiceCount,
            served: servedCount,
            cancelled: cancelledCount,
            nextToBeCalled: nextToBeCalled ? nextToBeCalled.serviceNumber : 0 
        });

    } catch (error) {
        console.error('Erro ao buscar o painel de administração da fila:', error);
        res.status(500).json({ message: "Erro ao buscar informações do painel da fila." });
    }
};



export const next = async (req, res) => {
    const { queueId } = req.params;

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
        res.status(500).json({ message: "Erro ao avançar para o próximo usuário na fila." });
    }
};

export const returnToQueue = async (req, res) => {
    const { queueId } = req.params;

    try {
        const inServiceUser = await Client.findOne({
            where: { queueId: queueId, status: 'in_service' },
        });

        if (inServiceUser) {
            inServiceUser.status = 'waiting';
            await inServiceUser.save();

            return res.json({ message: "Usuário retornado para espera.", userId: inServiceUser.id });
        } else {
            return res.status(404).json({ message: "Nenhum usuário atualmente em atendimento." });
        }

    } catch (error) {
        console.error('Erro ao retornar usuário para a fila:', error);
        res.status(500).json({ message: "Erro ao retornar o usuário para espera na fila." });
    }
};

export const cancelQueue = async (req, res) => {
    const { queueId } = req.params;

    try {
        const queue = await Queue.findByPk(queueId);

        if (queue) {
            queue.isActive = 0;
            await queue.save();

            return res.json({ message: "Fila cancelada com sucesso." });
        } else {
            return res.status(404).json({ message: "Fila não encontrada." });
        }

    } catch (error) {
        console.error('Erro ao cancelar a fila:', error);
        res.status(500).json({ message: "Erro ao cancelar a fila." });
    }
};

