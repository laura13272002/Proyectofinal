import { Router } from 'express';
import authenticate from '../auth/authenticate';

import {
  createProduct,
  readProduct,
  readProducts,
  searchProduct,
  updateProduct,
  deleteProduct,
} from './product.controller';

const productRouter = Router();

productRouter.post('/', authenticate, createProduct);
productRouter.get('/:id', readProduct);
productRouter.get('/', searchProduct);
productRouter.get('/categories/:user_id', readProducts);
productRouter.patch('/:id', authenticate, updateProduct);
productRouter.delete('/:id', authenticate, deleteProduct);

export default productRouter;