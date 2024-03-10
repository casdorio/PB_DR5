import express from "express";
import {
    getQueue,
    createQueue
} from "../controllers/queueController.js";

import { createClient } from "../controllers/clientController.js";
const router = express.Router();


router.get('/queues', getQueue);
router.post('/queues', createQueue);


router.post('/clients', createClient);

export default router;