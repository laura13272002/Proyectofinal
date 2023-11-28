import {
    createProduct,
    readProduct,
    searchProduct,
    readProducts,
    updateProduct,
    deleteProduct,
  } from '../product/product.controller';
  import productModel from '../product/product.model';
  
  // Mock del objeto req y res
  const req = {
    body: {},
    params: {},
    query: {},
    userId: 'mockUserId',
    user_id: 'mockUserId',
  };
  
  const res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
    sendStatus: jest.fn(),
  };
  
  const mockProduct = {
    _id: 'mockProductId',
    name: 'Product Name',
    description: 'Product Description',
    price: 10.99,
    category: 'Electronics',
    rating: 4.5,
  };
  
  describe('createProduct', () => {
    beforeEach(() => {
      req.body = {
        name: 'Product Name',
        description: 'Product Description',
        price: 10.99,
        category: 'Electronics',
        user: 'mockUserId',
      };
      req.params._id = 'mockProductId';
      req.query = {};
      res.status.mockClear();
      res.json.mockClear();
      res.sendStatus.mockClear();
      productModel.create.mockClear();
    });
  
    it('Debe crear un producto y devolver una respuesta correcta.', async () => {
      productModel.create.mockResolvedValue(mockProduct);
  
      await createProduct(req, res);
  
      expect(productModel.create).toHaveBeenCalledWith({
        ...req.body,
        active: true,
      });
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(mockProduct);
    });
  
    it('Debe devolver un error 403 si el ID de usuario en el token no coincide con el ID de usuario en el cuerpo de la solicitud.', async () => {
      req.body.user = 'otherUserId';
  
      await createProduct(req, res);
  
      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.send).toHaveBeenCalledWith({
        message: 'El ID de usuario en el token no coincide con el ID de usuario en el cuerpo de la solicitud.',
      });
    });
  
    it('Debe devolver un error si se produce un error al crear el producto.', async () => {
      const errorMessage = 'Error creating product';
      productModel.create.mockRejectedValue(new Error(errorMessage));
  
      await createProduct(req, res);
  
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(errorMessage);
    });
  });
  
  describe('readProduct', () => {
    beforeEach(() => {
      req.params._id = 'mockProductId';
      res.status.mockClear();
      res.json.mockClear();
      res.sendStatus.mockClear();
      productModel.findOne.mockClear();
    });
  
    it('Debe leer un producto y devolver una respuesta correcta.', async () => {
      productModel.findOne.mockResolvedValue(mockProduct);
  
      await readProduct(req, res);
  
      expect(productModel.findOne).toHaveBeenCalledWith({
        _id: req.params._id,
        active: true,
      });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockProduct);
    });
  
    it('Debe devolver un estado 404 si no se encuentra el producto.', async () => {
      productModel.findOne.mockResolvedValue(null);
  
      await readProduct(req, res);
  
      expect(productModel.findOne).toHaveBeenCalledWith({
        _id: req.params._id,
        active: true,
      });
      expect(res.sendStatus).toHaveBeenCalledWith(404);
    });
  
    it('Debe devolver un error si se produce un error al leer el producto.', async () => {
      const errorMessage = 'Error reading product';
      productModel.findOne.mockRejectedValue(new Error(errorMessage));
  
      await readProduct(req, res);
  
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(errorMessage);
    });
  });
  
  describe('searchProduct', () => {
    beforeEach(() => {
      req.query = {
        user_id: 'mockUserId',
        search: 'Product',
        category: 'Electronics',
      };
      res.status.mockClear();
      res.json.mockClear();
      res.sendStatus.mockClear();
      productModel.aggregate.mockClear();
    });
  
    it('Debe buscar productos y devolver una respuesta satisfactoria.', async () => {
      const mockDocuments = [mockProduct];
  
      productModel.aggregate.mockResolvedValue(mockDocuments);
  
      await searchProduct(req, res);
  
      const expectedFilter = {
        ...(req.query.user_id && { user_id: req.query.user_id }),
        ...((req.query.search || req.query.category) && {
          $or: [
            ...((req.query.category && [{ category: req.query.category }]) || []),
            ...((req.query.search && [
              { name: { $regex: req.query.search, $options: 'i' } },
            ]) || []),
          ],
        }),
        active: true,
      };
  
      expect(productModel.aggregate).toHaveBeenCalledWith([
        { $match: expectedFilter },
        {
          $project: {
            name: 1,
            _id: 1,
            description: 1,
            price: 1,
            category: 1,
            rating: 1,
          },
        },
        {
          $sort: {
            rating: -1,
          },
        },
      ]);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockDocuments);
    });
  
    it('Debe devolver un estado 404 si no se encuentra ningún producto.', async () => {
      productModel.aggregate.mockResolvedValue([]);
  
      await searchProduct(req, res);
  
      expect(productModel.aggregate).toHaveBeenCalled();
      expect(res.sendStatus).toHaveBeenCalledWith(404);
    });
  
    it('Debe devolver un error si se produce un error durante la búsqueda de productos.', async () => {
      const errorMessage = 'Error searching for products';
      productModel.aggregate.mockRejectedValue(new Error(errorMessage));
  
      await searchProduct(req, res);
  
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(errorMessage);
    });
  });
  
  describe('readProducts', () => {
    beforeEach(() => {
      req.params.user_id = 'mockUserId';
      res.status.mockClear();
      res.json.mockClear();
      res.sendStatus.mockClear();
      productModel.find.mockClear();
      productModel.distinct.mockClear();
    });
  
    it('Debe leer los productos y devolver una respuesta correcta.', async () => {
      const mockDocuments = ['Electronics', 'Clothing'];
  
      productModel.distinct.mockResolvedValue(mockDocuments);
  
      await readProducts(req, res);
  
      expect(productModel.find).toHaveBeenCalledWith({
        user: req.params.user_id,
      });
      expect(productModel.distinct).toHaveBeenCalledWith('category');
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockDocuments);
    });
  
    it('Debe devolver un estado 404 si no se encuentra ningún producto.', async () => {
      productModel.distinct.mockResolvedValue([]);
  
      await readProducts(req, res);
  
      expect(productModel.distinct).toHaveBeenCalledWith('category');
      expect(res.sendStatus).toHaveBeenCalledWith(404);
    });
  
    it('Debe devolver un error si se produce un error al leer los productos.', async () => {
      const errorMessage = 'Error reading products';
      productModel.distinct.mockRejectedValue(new Error(errorMessage));
  
      await readProducts(req, res);
  
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(errorMessage);
    });
  });
  
  describe('updateProduct', () => {
    beforeEach(() => {
      req.params._id = 'mockProductId';
      req.body = {
        name: 'Updated Product Name',
        description: 'Updated Product Description',
        price: 15.99,
        category: 'Electronics',
      };
      req.user_id = 'mockUserId';
      res.status.mockClear();
      res.json.mockClear();
      res.sendStatus.mockClear();
      productModel.findByIdAndUpdate.mockClear();
    });
  
    it('Debe actualizar un producto y devolver una respuesta correcta.', async () => {
      const updatedProduct = {
        ...mockProduct,
        ...req.body,
      };
  
      productModel.findByIdAndUpdate.mockResolvedValue(updatedProduct);
  
      await updateProduct(req, res);
  
      expect(productModel.findByIdAndUpdate).toHaveBeenCalledWith(
        { _id: req.params._id, active: true },
        req.body,
        {
          runValidators: true,
          new: true,
        }
      );
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(updatedProduct);
    });
  
    it('Debe devolver un error 403 si el usuario no tiene permiso para actualizar el producto.', async () => {
      req.user_id = 'otherUserId';
  
      await updateProduct(req, res);
  
      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.send).toHaveBeenCalledWith({
        message: 'You do not have permission to update this product.',
      });
    });
  
    it('Debe devolver un estado 404 si no se encuentra el producto.', async () => {
      productModel.findByIdAndUpdate.mockResolvedValue(null);
  
      await updateProduct(req, res);
  
      expect(productModel.findByIdAndUpdate).toHaveBeenCalledWith(
        { _id: req.params._id, active: true },
        req.body,
        {
          runValidators: true,
          new: true,
        }
      );
      expect(res.sendStatus).toHaveBeenCalledWith(404);
    });
  
    it('Debe devolver un error si se produce un error al actualizar el producto.', async () => {
      const errorMessage = 'Error updating product';
      productModel.findByIdAndUpdate.mockRejectedValue(new Error(errorMessage));
  
      await updateProduct(req, res);
  
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(errorMessage);
    });
  });
  
  describe('deleteProduct', () => {
    beforeEach(() => {
      req.params._id = 'mockProductId';
      req.user_id = 'mockUserId';
      res.status.mockClear();
      res.json.mockClear();
      res.sendStatus.mockClear();
      productModel.findOneAndUpdate.mockClear();
    });
  
    it('Debe eliminar un producto y devolver una respuesta correcta.', async () => {
      const deletedProduct = {
        ...mockProduct,
        active: false,
      };
  
      productModel.findOneAndUpdate.mockResolvedValue(deletedProduct);
  
      await deleteProduct(req, res);
  
      expect(productModel.findOneAndUpdate).toHaveBeenCalledWith(
        { _id: req.params._id, active: true },
        { active: false },
        {
          runValidators: true,
          new: true,
        }
      );
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(deletedProduct);
    });
  
    it('Debe devolver un error 403 si el usuario no tiene permiso para eliminar el producto.', async () => {
      req.user_id = 'otherUserId';
  
      await deleteProduct(req, res);
  
      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.send).toHaveBeenCalledWith({
        message: 'No tiene permiso para eliminar este producto.',
      });
    });
  
    it('Debe devolver un estado 404 si no se encuentra el producto.', async () => {
      productModel.findOneAndUpdate.mockResolvedValue(null);
  
      await deleteProduct(req, res);
  
      expect(productModel.findOneAndUpdate).toHaveBeenCalledWith(
        { _id: req.params._id, active: true },
        { active: false },
        {
          runValidators: true,
          new: true,
        }
      );
      expect(res.sendStatus).toHaveBeenCalledWith(404);
    });
  
    it('Debe devolver un error si se produce un error al eliminar el producto.', async () => {
      const errorMessage = 'Error deleting product';
      productModel.findOneAndUpdate.mockRejectedValue(new Error(errorMessage));
  
      await deleteProduct(req, res);
  
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(errorMessage);
    });
  });
  