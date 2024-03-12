import { Server as SocketIOServer } from 'socket.io';
import { getQueueInfo, callNextInQueue } from '../services/queueService.js';
import { API_BASE_URL_VALID } from '../globals.js';

export default function setupSocketIO(httpServer) {
  const io = new SocketIOServer(httpServer, {
    cors: {
      origin: API_BASE_URL_VALID,
      methods: ["GET", "POST"],
      credentials: true,
    },
  });

  io.on('connection', (socket) => {
    console.log('Servidor ativo e ouvindo conexões de clientes...');
  
    socket.on('subscribe', async  (data) => {
        const roomName = `queue-${data.queueId}`;
        socket.join(roomName);
        io.to(roomName).emit(`update-queue-${data.queueId}`, { success: true, message: "novo cadastro" });

    });
  
    socket.on('call-next', async  (data) => {
        const roomName = `queue-${data.queueId}`;
        console.log(`Chamar próximo na fila ${data.queueId}`);
        await callNextInQueue(data.queueId);
        io.to(roomName).emit(`update-queue-${data.queueId}`, { success: true, message: "Próximo na fila chamado" });
    });
  });

  return io;
}
