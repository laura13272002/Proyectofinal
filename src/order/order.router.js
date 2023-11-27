import { Router } from 'express';
import authenticate from '../auth/authenticate';

import {
  createOrder,
  readOrder,
  searchOrder,
  updateOrder,
} from './order.controller';

const orderRouter = Router();

orderRouter.post('/', authenticate, createOrder);
orderRouter.get('/:id', authenticate, readOrder);
orderRouter.get('/', authenticate, searchOrder);
orderRouter.patch('/:id', authenticate, updateOrder);

export default orderRouter;
