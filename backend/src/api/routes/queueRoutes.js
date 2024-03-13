import { getQueue, createQueue, getQueuePanel, 
    getQueuePanelAdmin, next, returnToQueue  } from "../controllers/queueController.js";
import { createClient, checkPositionInQueue, deleteClient } from "../controllers/clientController.js";
const queueRoutes = (router) => {

router.get('/queue/:queueId', getQueue);
router.get('/queue/:queueId/:session', getQueue);
router.post('/queues', createQueue);

router.get('/admin/:queueId/:hash_admin', getQueuePanelAdmin);
router.get('/panel/:queueId', getQueuePanel);
router.get('/next/:queueId', next);
router.get('/return/:queueId', returnToQueue);


router.post('/queue/join', createClient);

router.get('/client/position/:queueId/:clientId', checkPositionInQueue);

router.delete('/client/:clientId', deleteClient)


};
export default queueRoutes;