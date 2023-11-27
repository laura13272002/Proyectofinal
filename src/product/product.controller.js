import { async } from '../user/user.controller';
import productModel from './product.model';

export async function createProduct(req, res) {
  try {
    const product = req.body;
    product.active = true;
    if (req.body.user_id !== req.user_id) {
      return res.status(403).send({
        message: 'User ID in token does not match user ID in request body.',
      });
    }
    const document = await productModel.create(product);
    res.status(201).json(document);
  } catch (error) {
    res.status(400).json(error.message);
  }
}

export async function readProduct(req, res) {
  try {
    const id = req.params._id;
    const document = await productModel.findOne({ _id: id, active: true });
    document ? res.status(200).json(document) : res.sendStatus(404);
  } catch (error) {
    res.status(400).json(error.message);
  }
}

export async function searchProduct(req, res) {
  try {
    const { user_id, search, category } = req.query;

    const filter = {
      ...(user_id && { user_id: user_id }),
      ...((search || category) && {
        $or: [
          ...((category && [{ category }]) || []),
          ...((search && [{ name: { $regex: search, $options: 'i' } }]) || []),
        ],
      }),
      active: true,
    };

    const documents = await productModel.aggregate([
      { $match: filter },
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
    ]);;

    documents.length > 0 ? res.status(200).json(documents) : res.sendStatus(404);

  } catch (error) {
    res.status(400).json(error.message);
  }
}

export async function readProducts(req,res) {
  try {
    const document = await productModel.find({ user: req.params.user_id }).distinct(
      'category',
    );
    document ? res.status(200).json(document) : res.sendStatus(404);
  } catch (error) {
    res.status(400).json(error.message);
  }
}

export async function updateProduct(req, res) {
  try {
    const id = req.params._id;
    const document = await productModel.findByIdAndUpdate({ _id: id, active: true }, req.body, {
      runValidators: true,
      new: true,
    });
    if (product.user.toString() !== req.user_id) {
      return res.status(403).send({
        message: 'You do not have permission to update this product.',
      });
    }
    document ? res.status(200).json(document) : res.sendStatus(404);
  } catch (error) {
    res.status(400).json(error.message);
  }
}

export async function deleteProduct(req, res) {
  try {
    const id = req.params._id;
    if (product.user.toString() !== req.user_id) {
      return res.status(403).send({
        message: 'You do not have permission to delete this product.',
      });
    }
    const document = await productModel.findOneAndUpdate({ _id: id, active:true}, { active: false }, {
			runValidators: true,
			new: true,
		});
    document ? res.status(200).json(document) : res.sendStatus(404);
  } catch (error) {
    res.status(400).json(error.message);
  }
}
