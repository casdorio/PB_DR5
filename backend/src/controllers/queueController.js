import Queue from "../models/queueModel.js";

export const getQueue = async (req, res) => {
    console.log('getQueue');
    try {
      const queueId = req.params.queueId; // Obtém o ID da fila dos parâmetros da rota
      const queue = await Queue.findByPk(queueId); // Procura a fila pelo ID
      
      if (queue) {
        res.status(200).json({ queue, isActive: true }); // Se a fila existir, ela está ativa
      } else {
        res.status(404).json({ message: 'Fila não encontrada.' }); // Se a fila não existir, retorna um erro 404
      }
    } catch (error) {
      console.log(error.message);
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

export const updateQueue = async(req, res) =>{
    try {
        await Queue.update(req.body,{
            where:{
                id: req.params.id
            }
        });
        res.status(200).json({msg: "Queue Updated"});
    } catch (error) {
        console.log(error.message);
    }
}

export const deleteQueue = async(req, res) =>{
    try {
        await Queue.destroy({
            where:{
                id: req.params.id
            }
        });
        res.status(200).json({msg: "Queue Deleted"});
    } catch (error) {
        console.log(error.message);
    }
}

// preciso chamar o proximo da fila
export const nextQueue = async(req, res) =>{
    try {
        const response = await Queue.findOne({
            where:{
                id: req.params.id
            }
        });
        res.status(200).json(response);
    } catch (error) {
        console.log(error.message);
    }
}

//preciso retroceder na fila
export const previousQueue = async(req, res) =>{
    try {
        const response = await Queue.findOne({
            where:{
                id: req.params.id
            }
        });
        res.status(200).json(response);
    } catch (error) {
        console.log(error.message);
    }
}