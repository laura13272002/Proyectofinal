import jwt from 'jsonwebtoken';
import userModel from '../user/user.model';

export default async function authenticate(req, res, next) {
  try {
    const authorization = req.headers.authorization;
    const token = authorization?.split(' ')[1];
    const payload = jwt.verify(token, process.env.SECRET_KEY);
    const { _id } = payload;
    const result = await userModel.findById(_id);

    // if (result) return (req.user = result) && next();
    if (result) {
      req.user = result;
      return next();
    }

    return res.sendStatus(404);
  } catch (err) {
    res.status(400).json(err.message);
  }
}
