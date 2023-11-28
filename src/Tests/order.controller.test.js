import orderModel from '../order/order.model';
import {
  createOrder,
  readOrder,
  searchOrder,
  updateOrder,
} from '../order/order.controller';

jest.mock('../order/order.model');

describe('order.controller', () => {
  describe('createOrder', () => {
    test('debe crear una orden exitosamente', async () => {
      const req = {
        body: {
          // Datos de la orden
        },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      orderModel.create.mockResolvedValueOnce({ /* Datos de la orden creada */ });

      await createOrder(req, res);

      expect(orderModel.create).toHaveBeenCalledWith(req.body);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({ /* Datos de la orden creada */ });
    });

    test('debe manejar errores al crear una orden', async () => {
      const req = {
        body: {
          // Datos de la orden
        },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      const errorMessage = 'Error al crear la orden';
      orderModel.create.mockRejectedValueOnce(new Error(errorMessage));

      await createOrder(req, res);

      expect(orderModel.create).toHaveBeenCalledWith(req.body);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(errorMessage);
    });
  });

  describe('readOrder', () => {
    test('debe leer una orden existente y devolver una respuesta exitosa', async () => {
      const orderId = '123456789';
      const req = {
        params: {
          id: orderId,
        },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
        sendStatus: jest.fn(),
      };

      const order = { /* Datos de la orden */ };
      orderModel.findOne.mockResolvedValueOnce(order);

      await readOrder(req, res);

      expect(orderModel.findOne).toHaveBeenCalledWith({ _id: orderId, active: true });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(order);
    });

    test('debe manejar una orden no encontrada', async () => {
      const orderId = '123456789';
      const req = {
        params: {
          id: orderId,
        },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
        sendStatus: jest.fn(),
      };

      orderModel.findOne.mockResolvedValueOnce(null);

      await readOrder(req, res);

      expect(orderModel.findOne).toHaveBeenCalledWith({ _id: orderId, active: true });
      expect(res.sendStatus).toHaveBeenCalledWith(404);
    });

    test('debe manejar errores al leer una orden', async () => {
      const orderId = '123456789';
      const req = {
        params: {
          id: orderId,
        },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
        sendStatus: jest.fn(),
      };

      const errorMessage = 'Error al leer la orden';
      orderModel.findOne.mockRejectedValueOnce(new Error(errorMessage));

      await readOrder(req, res);

      expect(orderModel.findOne).toHaveBeenCalledWith({ _id: orderId, active: true });
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(errorMessage);
    });
  });

  describe('searchOrder', () => {
    test('debe buscar órdenes con los parámetros proporcionados y devolver una respuesta exitosa', async () => {
      const req = {
        query: {
          user_id: 'user123',
          restaurant_id: 'restaurant123',
          starDate: '2023-01-01',
          endDate: '2023-01-31',
        },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
        sendStatus: jest.fn(),
      };

      const orders = [{ /* Datos de la orden 1 */ }, { /* Datos de la orden 2 */ }];
      orderModel.find.mockResolvedValueOnce(orders);

      await searchOrder(req, res);

      expect(orderModel.find).toHaveBeenCalledWith({
        user_id: 'user123',
        restaurant_id: 'restaurant123',
        createdAt: {
          $gte: new Date('2023-01-01'),
          $lt: new Date('2023-01-31'),
        },
        active: true,
      });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(orders);
    });

    test('debe manejar órdenes no encontradas', async () => {
      const req = {
        query: {
          user_id: 'user123',
          restaurant_id: 'restaurant123',
          starDate: '2023-01-01',
          endDate: '2023-01-31',
        },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
        sendStatus: jest.fn(),
      };

      orderModel.find.mockResolvedValueOnce([]);

      await searchOrder(req, res);

      expect(orderModel.find).toHaveBeenCalledWith({
        user_id: 'user123',
        restaurant_id: 'restaurant123',
        createdAt: {
          $gte: new Date('2023-01-01'),
          $lt: new Date('2023-01-31'),
        },
        active: true,
      });
      expect(res.sendStatus).toHaveBeenCalledWith(404);
    });

    test('debe manejar errores al buscar órdenes', async () => {
      const req = {
        query: {
          user_id: 'user123',
          restaurant_id: 'restaurant123',
          starDate: '2023-01-01',
          endDate: '2023-01-31',
        },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
        sendStatus: jest.fn(),
      };

      const errorMessage = 'Error al buscar órdenes';
      orderModel.find.mockRejectedValueOnce(new Error(errorMessage));

      await searchOrder(req, res);

      expect(orderModel.find).toHaveBeenCalledWith({
        user_id: 'user123',
        restaurant_id: 'restaurant123',
        createdAt: {
          $gte: new Date('2023-01-01'),
          $lt: new Date('2023-01-31'),
        },
        active: true,
      });
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(errorMessage);
    });
  });

  describe('updateOrder', () => {
    test('debe actualizar una orden existente y devolver una respuesta exitosa', async () => {
      const orderId = '123456789';
      const req = {
        params: {
          id: orderId,
        },
        body: {
          // Datos para actualizar la orden
        },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
        sendStatus: jest.fn(),
      };

      const updatedOrder = { /* Datos de la orden actualizada */ };
      orderModel.findOneAndUpdate.mockResolvedValueOnce(updatedOrder);

      await updateOrder(req, res);

      expect(orderModel.findOneAndUpdate).toHaveBeenCalledWith(
        { _id: orderId, active: true, status: 'created' },
        req.body,
        { runValidators: true, new: true }
      );
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(updatedOrder);
    });

    test('debe manejar una orden no encontrada', async () => {
      const orderId = '123456789';
      const req = {
        params: {
          id: orderId,
        },
        body: {
          // Datos para actualizar la orden
        },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
        sendStatus: jest.fn(),
      };

      orderModel.findOneAndUpdate.mockResolvedValueOnce(null);

      await updateOrder(req, res);

      expect(orderModel.findOneAndUpdate).toHaveBeenCalledWith(
        { _id: orderId, active: true, status: 'created' },
        req.body,
        { runValidators: true, new: true }
      );
      expect(res.sendStatus).toHaveBeenCalledWith(404);
    });

    test('debe manejar errores al actualizar una orden', async () => {
      const orderId = '123456789';
      const req = {
        params: {
          id: orderId,
        },
        body: {
          // Datos para actualizar la orden
        },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
        sendStatus: jest.fn(),
      };

      const errorMessage = 'Error al actualizar la orden';
      orderModel.findOneAndUpdate.mockRejectedValueOnce(new Error(errorMessage));

      await updateOrder(req, res);

      expect(orderModel.findOneAndUpdate).toHaveBeenCalledWith(
        { _id: orderId, active: true, status: 'created' },
        req.body,
        { runValidators: true, new: true }
      );
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(errorMessage);
    });
  });
});
