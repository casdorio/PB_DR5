import { checkPositionInQueue, createClient  } from '../controllers/clientController.js';

describe('Client Controller', () => {
  describe('checkPositionInQueue', () => {
    it('should return the position of the client in the queue', async () => {
      // Simulate request and response objects
      const req = {
        params: {
          clientId: '192ff983' // Cliente ID
        }
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      // Chamar a função do controlador com os objetos de requisição e resposta simulados
    await checkPositionInQueue(req, res);

    // Verificar se a função de resposta JSON foi chamada com os dados corretos
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ position: /* Posição do cliente na fila */ 0 });
    });
  });

  describe('createClient', () => {
    it('should create a new client', async () => {
      // Simulate request and response objects
      const req = {
        body: {
          // Dados do novo cliente
          name: 'fila teste',
          // Outros campos do cliente, se necessário
        }
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      // Chamar a função do controlador com os objetos de requisição e resposta simulados
      await createClient(req, res);

      // Verificar se a função de resposta JSON foi chamada com a mensagem correta
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({ msg: 'Client Created' });
    });

    it('should handle errors during client creation', async () => {
      // Simular um erro durante a criação do cliente
      const req = {
        body: {
          // Dados do novo cliente
          // Se necessário, simular dados inválidos aqui para forçar um erro
        }
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      // Chamar a função do controlador com os objetos de requisição e resposta simulados
    await createClient(req, res);

    // Verificar se a função de log de erro foi chamada
    expect(console.log).toHaveBeenCalled(); // Você pode ajustar este teste conforme necessário
    // Verificar se a função de resposta JSON foi chamada com uma mensagem de erro
    expect(res.status).toHaveBeenCalledWith(/* Código de status de erro apropriado */);
    expect(res.json).toHaveBeenCalledWith({ error: 'Mensagem de erro apropriada' });
    });
  });

});


 