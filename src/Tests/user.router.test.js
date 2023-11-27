const request = require('supertest');
const app = require('../index'); 

// Importa el modelo de usuario y la función de autenticación si es necesario
const userModel = require('../user/user.model.js');
const authenticate = require('../auth/authenticate.js');

// Mockear funciones del controlador si es necesario
jest.mock('../user/user.model.js');

describe('User Routes', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // Prueba para createUser
  describe('POST /', () => {
    test('should create a user', async () => {
      const userData = {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'password123',
        phone: '1234567890',
        address: '123 Main St',
      };

      userModel.create.mockResolvedValueOnce({ _id: '1', ...userData });

      const response = await request(app)
        .post('/')
        .send(userData);

      expect(response.status).toBe(201);
    });

    test('should handle errors when creating a user', async () => {
      const errorMessage = 'Error creating user';
      userModel.create.mockRejectedValueOnce(new Error(errorMessage));

      const response = await request(app)
        .post('/')
        .send({});

      expect(response.status).toBe(400);
    });
  });

  // Prueba para login
  describe('POST /login', () => {
    test('should log in a user and return a token', async () => {
      const userData = {
        email: 'john@example.com',
        password: 'password123',
      };

      userModel.findOne.mockResolvedValueOnce({
        _id: '1',
        name: 'John Doe',
        ...userData,
      });

      const response = await request(app)
        .post('/login')
        .send(userData);

      expect(response.status).toBe(200);
    });

    test('should handle login errors', async () => {
      const errorMessage = 'Login error';
      userModel.findOne.mockResolvedValueOnce(null);

      const response = await request(app)
        .post('/login')
        .send({});

      expect(response.status).toBe(404);
    });
  });

  // Prueba para readUserByID
  describe('GET /:id', () => {
    test('should get a user by ID', async () => {
      const userId = '1';
      const userData = {
        _id: userId,
        name: 'John Doe',
        email: 'john@example.com',
        password: 'password123',
        phone: '1234567890',
        address: '123 Main St',
      };

      userModel.findById.mockResolvedValueOnce(userData);

      const response = await request(app).get(`/${userId}`);

      expect(response.status).toBe(200);
    });

    test('should handle errors when getting a user by ID', async () => {
      const userId = '1';
      const errorMessage = 'Error getting user';
      userModel.findById.mockRejectedValueOnce(new Error(errorMessage));

      const response = await request(app).get(`/${userId}`);

      expect(response.status).toBe(400);
    });

    test('should handle user not found when getting by ID', async () => {
      const userId = '1';
      userModel.findById.mockResolvedValueOnce(null);

      const response = await request(app).get(`/${userId}`);

      expect(response.status).toBe(404);
    });
  });

  // Prueba para updateUser
  describe('PATCH /:id', () => {
    test('should update a user', async () => {
      const userId = '1';
      const userData = {
        name: 'John Doe',
        email: 'john@example.com',
        phone: '1234567890',
        address: '123 Main St',
      };

      userModel.findByIdAndUpdate.mockResolvedValueOnce({ _id: userId, ...userData });

      const response = await request(app)
        .patch(`/${userId}`)
        .send(userData);

      expect(response.status).toBe(200);
    });

    test('should handle errors when updating a user', async () => {
      const userId = '1';
      const errorMessage = 'Error updating user';
      userModel.findByIdAndUpdate.mockRejectedValueOnce(new Error(errorMessage));

      const response = await request(app)
        .patch(`/${userId}`)
        .send({});

      expect(response.status).toBe(400);
    });

    test('should handle user not found when updating', async () => {
      const userId = '1';
      userModel.findByIdAndUpdate.mockResolvedValueOnce(null);

      const response = await request(app)
        .patch(`/${userId}`)
        .send({});
      
      expect(response.status).toBe(404);
    });
  });

  // Prueba para deleteUser
  describe('DELETE /:id', () => {
    test('should delete a user', async () => {
      const userId = '1';

      userModel.findByIdAndUpdate.mockResolvedValueOnce({ _id: userId, active: false });

      const response = await request(app)
        .delete(`/${userId}`);

      expect(response.status).toBe(200);
    });

    test('should handle errors when deleting a user', async () => {
      const userId = '1';
      const errorMessage = 'Error deleting user';
      userModel.findByIdAndUpdate.mockRejectedValueOnce(new Error(errorMessage));

      const response = await request(app)
        .delete(`/${userId}`);

      expect(response.status).toBe(400);
    });

    test('should handle user not found when deleting', async () => {
      const userId = '1';
      userModel.findByIdAndUpdate.mockResolvedValueOnce(null);

      const response = await request(app)
        .delete(`/${userId}`);

      expect(response.status).toBe(404);
    });
  });
});
