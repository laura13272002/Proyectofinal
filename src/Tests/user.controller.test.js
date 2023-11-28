import {
  createUser,
  login,
  readUserByID,
  updateUser,
  deleteUser,
} from '../user/user.controller.js';
import userModel from '../user/user.model.js';

// Mock del objeto req y res
const req = {
  body: {
    name: 'John Doe',
    email: 'johndoe@example.com',
  },
  params: {
    _id: 'user_id',
  },
};

const res = {
  status: jest.fn().mockReturnThis(),
  json: jest.fn(),
  sendStatus: jest.fn(),
};

jest.mock('../user/user.model.js');

describe('User Controller', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createUser', () => {
    it('debe crear un usuario y devolver una respuesta exitosa', async () => {
      userModel.create.mockResolvedValue({ id: 1, ...req.body });

      await createUser(req, res);

      expect(userModel.create).toHaveBeenCalledWith(req.body);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({ id: 1, ...req.body });
    });

    it('debe devolver un error si la creación de usuario falla', async () => {
      const errorMessage = 'Error al crear usuario';
      userModel.create.mockRejectedValue(new Error(errorMessage));

      await createUser(req, res);

      expect(userModel.create).toHaveBeenCalledWith(req.body);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(errorMessage);
    });
  });

  describe('login', () => {
    it('debe realizar el inicio de sesión correctamente y devolver un token', async () => {
      const user = { email: 'johndoe@example.com', password: 'password', active: true };
      const token = 'generated_token';
      userModel.findOne.mockResolvedValue(user);
      jest.spyOn(userModel, 'toJSON').mockReturnValue(user);
      jest.spyOn(jwt, 'sign').mockReturnValue(token);

      req.body = { email: 'johndoe@example.com', password: 'password' };

      await login(req, res);

      expect(userModel.findOne).toHaveBeenCalledWith({
        email: req.body.email,
        password: req.body.password,
        active: true,
      });
      expect(jwt.sign).toHaveBeenCalledWith(user, process.env.SECRET_KEY);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ token });
    });

    it('debe devolver un estado 404 si el inicio de sesión falla', async () => {
      userModel.findOne.mockResolvedValue(null);

      req.body = { email: 'johndoe@example.com', password: 'password' };

      await login(req, res);

      expect(userModel.findOne).toHaveBeenCalledWith({
        email: req.body.email,
        password: req.body.password,
        active: true,
      });
      expect(res.sendStatus).toHaveBeenCalledWith(404);
    });

    it('debe devolver un error si ocurre un error durante el inicio de sesión', async () => {
      const errorMessage = 'Error en inicio de sesión';
      userModel.findOne.mockRejectedValue(new Error(errorMessage));

      req.body = { email: 'johndoe@example.com', password: 'password' };

      await login(req, res);

      expect(userModel.findOne).toHaveBeenCalledWith({
        email: req.body.email,
        password: req.body.password,
        active: true,
      });
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(errorMessage);
    });
  });

  describe('readUserByID', () => {
    it('debe buscar y devolver un usuario existente', async () => {
      const user = { id: 'user_id', name: 'John Doe', email: 'johndoe@example.com', active: true };
      userModel.findById.mockResolvedValue(user);

      await readUserByID(req, res);

      expect(userModel.findById).toHaveBeenCalledWith({ _id: req.params._id, active: true });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(user);
    });

    it('debe devolver un estado 404 si el usuario no existe', async () => {
      userModel.findById.mockResolvedValue(null);

      await readUserByID(req, res);

      expect(userModel.findById).toHaveBeenCalledWith({ _id: req.params._id, active: true });
      expect(res.sendStatus).toHaveBeenCalledWith(404);
    });

    it('debe devolver un error si ocurre un error al buscar el usuario', async () => {
      const errorMessage = 'Error al buscar el usuario';
      userModel.findById.mockRejectedValue(new Error(errorMessage));

      await readUserByID(req, res);

      expect(userModel.findById).toHaveBeenCalledWith({ _id: req.params._id, active: true });
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(errorMessage);
    });
  });

  describe('updateUser', () => {
    it('debe actualizar un usuario existente y devolverlo', async () => {
      const updatedUser = {
        id: 'user_id',
        name: 'John Doe',
        email: 'johndoe@example.com',
        active: true,
      };
      userModel.findByIdAndUpdate.mockResolvedValue(updatedUser);

      await updateUser(req, res);

      expect(userModel.findByIdAndUpdate).toHaveBeenCalledWith(
        { _id: req.params._id, active: true },
        req.body,
        { runValidators: true, new: true }
      );
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(updatedUser);
    });

    it('debe devolver un estado 404 si el usuario no existe al intentar actualizar', async () => {
      userModel.findByIdAndUpdate.mockResolvedValue(null);

      await updateUser(req, res);

      expect(userModel.findByIdAndUpdate).toHaveBeenCalledWith(
        { _id: req.params._id, active: true },
        req.body,
        { runValidators: true, new: true }
      );
      expect(res.sendStatus).toHaveBeenCalledWith(404);
    });

    it('debe devolver un error si ocurre un error al actualizar el usuario', async () => {
      const errorMessage = 'Error al actualizar el usuario';
      userModel.findByIdAndUpdate.mockRejectedValue(new Error(errorMessage));

      await updateUser(req, res);

      expect(userModel.findByIdAndUpdate).toHaveBeenCalledWith(
        { _id: req.params._id, active: true },
        req.body,
        { runValidators: true, new: true }
      );
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(errorMessage);
    });
  });

  describe('deleteUser', () => {
    it('debe desactivar un usuario existente y devolverlo', async () => {
      const deactivatedUser = {
        id: 'user_id',
        name: 'John Doe',
        email: 'johndoe@example.com',
        active: false,
      };
      userModel.findByIdAndUpdate.mockResolvedValue(deactivatedUser);

      await deleteUser(req, res);

      expect(userModel.findByIdAndUpdate).toHaveBeenCalledWith(
        { _id: req.params._id, active: true },
        { active: false },
        { runValidators: true, new: true }
      );
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(deactivatedUser);
    });

    it('debe devolver un estado 404 si el usuario no existe al intentar eliminar', async () => {
      userModel.findByIdAndUpdate.mockResolvedValue(null);

      await deleteUser(req, res);

      expect(userModel.findByIdAndUpdate).toHaveBeenCalledWith(
        { _id: req.params._id, active: true },
        { active: false },
        { runValidators: true, new: true }
      );
      expect(res.sendStatus).toHaveBeenCalledWith(404);
    });

    it('debe devolver un error si ocurre un error al eliminar el usuario', async () => {
      const errorMessage = 'Error al eliminar el usuario';
      userModel.findByIdAndUpdate.mockRejectedValue(new Error(errorMessage));

      await deleteUser(req, res);

      expect(userModel.findByIdAndUpdate).toHaveBeenCalledWith(
        { _id: req.params._id, active: true },
        { active: false },
        { runValidators: true, new: true }
      );
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(errorMessage);
    });
  });
});
