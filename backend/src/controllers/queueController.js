import Queue from "../models/queueModel.js";

export const getQueue = async(req, res) =>{
    try {
        const response = await Queue.findAll();
        res.status(200).json(response);
    } catch (error) {
        console.log(error.message);
    }
}

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