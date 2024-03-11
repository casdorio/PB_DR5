import { checkPositionInQueue, createClient  } from '../controllers/clientController.js';

describe('Client Controller', () => {
  describe('checkPositionInQueue', () => {
    it('should return the position of the client in the queue', async () => {
      const req = {
        params: {
          clientId: '192ff983' 
        }
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

    await checkPositionInQueue(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ position: 0 });
    });
  });

  describe('createClient', () => {
    it('should create a new client', async () => {
      const req = {
        body: {
          name: 'fila teste',
        }
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      await createClient(req, res);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({ msg: 'Client Created' });
    });

    it('should handle errors during client creation', async () => {
      const req = {
        body: {
         
        }
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

    await createClient(req, res);

    expect(console.log).toHaveBeenCalled(); 
    expect(res.status).toHaveBeenCalledWith();
    expect(res.json).toHaveBeenCalledWith({ error: 'Mensagem de erro apropriada' });
    });
  });

});


 