import Queue from "../models/queueModel.js";
import Client from "../models/clientModel.js";

export const createClient = async (req, res) => {
    try {
        const { queueId, session } = req.body;

        const queue = await Queue.findByPk(queueId);

        if (!queue || !queue.isActive) {
            return res.status(400).json({ error: "A fila não está ativa ou não existe" });
        }

        const existingClient = await Client.findOne({ where: { session } });

        if (existingClient) {
            return res.status(201).json({
                id_client: existingClient.id,
                msg: "Cliente já está na fila"
            });
        }

        const lastClient = await Client.findOne({
            where: { queueId: queueId },
            order: [['serviceNumber', 'DESC']]
        });

        const nextServiceNumber = lastClient ? lastClient.serviceNumber + 1 : 1;

        const newClient = await Client.create({
            queueId,
            session,
            serviceNumber: nextServiceNumber,
        });

        res.status(201).json({
            id_client: newClient.id,
            msg: "Cliente criado com sucesso",
            serviceNumber: nextServiceNumber 
        });

    } catch (error) {
        console.log('Erro ao criar cliente:', error.message);
        res.status(500).json({ error: "Erro ao criar cliente" });
    }
};




export const checkPositionInQueue = async (req, res) => {
    const { clientId, queueId } = req.params;

    try {
        const client = await findClientByIdAndQueueId(clientId, queueId);
        const queueIsActive_ = await queueIsActive(queueId);
        if (!client) {
            return res.status(404).json({ error: "Client not found in the specified queue" });
        }
        
        if (client.status !== 'waiting') {
            return res.json(formatNonWaitingResponse(client, queueIsActive_));
        }
       
        const positionInQueue = await calculatePositionInQueue(clientId, queueId);
        return res.json({ 
            status: 'waiting', 
            positionInQueue: positionInQueue, 
            serviceNumber: String(client.serviceNumber).padStart(3, '0'),
            queueIsActive: queueIsActive_,
        });
        
    } catch (error) {
        console.error(error.message);
        return res.status(500).json({ error: "Failed to check position in queue" });
    }
};

async function findClientByIdAndQueueId(clientId, queueId) {
    return await Client.findOne({
        where: { id: clientId, queueId },
        attributes: ['id', 'status', 'serviceNumber', 'createdAt'],
    });
}
async function queueIsActive(queueId) {
    const queue = await Queue.findByPk(queueId, {
        attributes: ['isActive'],
    });

    return queue ? (queue.isActive ? 1 : 0) : 0;
}
function formatNonWaitingResponse(client, queueIsActive_) {
    const statusMessages = {
        'in_service': "Em atendimento",
        'served': "Já atendido",
        'canceled': "Cancelado"
    };

    const defaultMessage = "Status desconhecido";
    return {
        status: client.status,
        positionInQueue: 0,
        queueIsActive: queueIsActive_,
        message: statusMessages[client.status] || defaultMessage
    };
}

async function calculatePositionInQueue(clientId, queueId) {
    const clientsWaiting = await Client.findAll({
        where: { queueId, status: 'waiting' },
        order: [['createdAt', 'ASC']],
        attributes: ['id'],
    });

    return clientsWaiting.findIndex(client => client.id === clientId) + 1;
}

export const deleteClient = async (req, res) => {
    const { clientId } = req.params;
    const client = await Client.findByPk(clientId);
    if (!client) {
        return res.status(404).json({ message: 'Client not found' });
    }
    client.status = 'canceled';
    await client.save();
    res.status(200).json({ message: 'Client status updated' });

};




