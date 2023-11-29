import orderModel from './order.model';

export async function createOrder(req, res) {
  try {
    const order = req.body;
    order.active = true;
    if (req.body.user !== req.user_id) {
      return res.status(403).send({
        message: 'User ID in token does not match user ID in request body.',
      });
    }
    const document = await orderModel.create(order);
    res.status(201).json(document);
  } catch (error) {
    res.status(400).json(error.message);
  }
}
export async function readOrder(req, res) {
  try {
    const id = (req.params.id).toString().toObjectId();
    const document = await orderModel.findOne({ _id: id, active: true });
    if (order.user.toString() !== req.user_id) {
      return res
        .status(403)
        .send({ message: 'You do not have permission to view this order.' });
    }
    document ? res.status(200).json(document) : res.sendStatus(404);
  } catch (error) {
    res.status(400).json(error.message);
  }
}

export async function searchOrder(req, res) {
  try {
    const { user_id, starDate, endDate} =req.query;
    const filter = {
      ...(user_id && {user: user_id}),
      ...(starDate && endDate && {
        createdAt: {
          $gte: new Date(starDate),
          $lt: new Date(endDate),
        },
      }),
      active: true,
    }
    const documents = await orderModel.find(filter);
    documents.length > 0 ? res.status(200).json(documents): res.sendStatus(404);
  } catch (error) {
    res.status(400).json(error.message);
  }
}

export async function updateOrder(req, res) {
  try {
    const id = (req.params.id).toString().toObjectId();
    const document = await orderModel.findOneAndUpdate(
      { user_id: id, active: true },
      req.body,
      { runValidators: true,
      new: true }
    );
    if (order.user.toString() !== req.user_id) {
      return res.status(403).send({
        message: 'You do not have permission to update this order.',
      });
    }
    document ? res.status(200).json(document) : res.status(404);

    res.status(200).send(order);

  } catch (error) {
    res.status(400).json(error.message);
  }
}

