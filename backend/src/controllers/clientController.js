import Queue from "../models/queueModel.js";
import Client from "../models/clientModel.js";

export const createClient = async (req, res) => {
    try {
        // Verificar se a fila está ativa
        const queueId = req.body.queueId; 
        const queue = await Queue.findByPk(queueId);

        if (!queue || !queue.isActive) {
            return res.status(400).json({ error: "A fila não está ativa ou não existe" });
        }

        // Se a fila estiver ativa, criar o cliente
        await Client.create(req.body);
        res.status(201).json({ msg: "Cliente criado com sucesso" });
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ error: "Erro ao criar cliente" });
    }
}
