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
        const client = await Client.findOne({
            where: {
                id: clientId,
                queueId: queueId,
            },
            attributes: ['id', 'status', 'createdAt'],
        });

        if (!client) {
            return res.status(404).json({ error: "Client not found in the specified queue" });
        }

        if (client.status === 'waiting') {
            const clientsAhead = await Client.count({
                where: {
                    queueId: queueId,
                    status: 'waiting',
                    createdAt: { $lt: client.createdAt }
                }
            });

            return res.status(200).json({
                status: client.status,
                positionInQueue: clientsAhead + 1 
            });
        }

        return res.status(200).json({
            status: client.status,
            message: client.status === 'in_service' ? "Em atendimento" : 
                     client.status === 'served' ? "Já atendido" : 
                     client.status === 'cancelled' ? "Cancelado" : "Status desconhecido"
        });
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ error: "Failed to check position in queue" });
    }
};


