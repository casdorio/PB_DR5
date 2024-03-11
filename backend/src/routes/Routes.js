import express from "express";

import { getQueue, createQueue, getQueuePanel, 
    getQueuePanelAdmin, next, returnToQueue, cancelQueue  } from "../controllers/queueController.js";
import { createClient, checkPositionInQueue } from "../controllers/clientController.js";

const router = express.Router();

router.get('/queue/:queueId', getQueue);
router.get('/queue/:queueId/:session', getQueue);
router.get('/panel/:queueId', getQueuePanel);
router.get('/admin/:queueId/:hash_admin', getQueuePanelAdmin);

router.get('/next/:queueId', next);
router.get('/return/:queueId', returnToQueue);
router.get('/cancel/:queueId', cancelQueue);

router.post('/queues', createQueue);

router.post('/queue/join', createClient);

router.get('/client/position/:queueId/:clientId', checkPositionInQueue);

export default router;