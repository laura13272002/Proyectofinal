import { Router } from 'express';
import authenticate from '../auth/authenticate';

import {
  createUser,
  deleteUser,
  login,
  readUserByID,
  updateUser,
} from './user.controller';

const userRouter = Router();

userRouter.post('/login', login);
userRouter.post('/', createUser);
userRouter.get('/:id', readUserByID);
userRouter.patch('/:id', authenticate, updateUser);
userRouter.delete('/:id', authenticate, deleteUser);

export default userRouter;
