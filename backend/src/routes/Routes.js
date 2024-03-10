import express from "express";
import {
    getQueue,
    createQueue
} from "../controllers/queueController.js";

import { createClient, checkPositionInQueue } from "../controllers/clientController.js";
const router = express.Router();


router.get('/queues', getQueue);
router.post('/queues', createQueue);


router.post('/clients', createClient);
router.get('/clients/:clientId/position', checkPositionInQueue);

export default router;