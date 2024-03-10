import Queue from "../models/queueModel.js";
import Client from "../models/clientModel.js";

//ajustar alguns erros
export const createClient = async (req, res) => {
    try {
        const queueId = req.body.queueId; 
        const queue = await Queue.findByPk(queueId);

        if (!queue || !queue.isActive) {
            return res.status(400).json({ error: "A fila não está ativa ou não existe" });
        }

        const newClient = await Client.create(req.body);
        res.status(201).json({
            id_client: newClient.id,
            msg: "Cliente criado com sucesso"
        });
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ error: "Erro ao criar cliente" });
    }
}


export const checkPositionInQueue = async (req, res) => {
    const clientId = req.params.clientId;

    try {
        const client = await Client.findByPk(clientId);
        const clientCreatedAt = client.createdAt;

        const clientsAhead = await Client.findAll({
            where: {
                createdAt: { $lt: clientCreatedAt } 
            }
        });

        
        const positionInQueue = clientsAhead.length + 1; 

        res.status(200).json({ positionInQueue });
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ error: "Failed to check position in queue" });
    }
};