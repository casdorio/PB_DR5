import { Server as SocketIOServer } from 'socket.io';
import { toggleQueue, callNextInQueue } from '../services/queueService.js';
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
        io.to(roomName).emit(`new-client-in-queue-${data.queueId}`, { success: true, message: "novo cadastro", data });

    });
    socket.on('cancel-client', async  (data) => {
      const roomName = `queue-${data.queueId}`;
      io.to(roomName).emit(`new-client-in-queue-${data.queueId}`, { success: true, message: "Cliente cancelado", data });
    });
  
    socket.on('call-next', async  (data) => {
        const roomName = `queue-${data.queueId}`;
        await callNextInQueue(data.queueId);
        io.to(roomName).emit(`update-queue-${data.queueId}`, { success: true, message: "Próximo na fila chamado", data });
        io.to(roomName).emit(`new-client-in-queue-${data.queueId}`, { success: true, message: "Cliente cancelado", data });
    });
    socket.on('toggle-queue', async  (data) => {
      const roomName = `queue-${data.queueId}`;
      const teste = await toggleQueue(data.queueId, data.status);
      io.to(roomName).emit(`new-client-in-queue-${data.queueId}`, { success: true, message: "Cliente cancelado", data });
      io.to(roomName).emit(`update-queue-${data.queueId}`, { success: true, message: "status da queue alterado", data });
    });


  });

  return io;
}
