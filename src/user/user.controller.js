import userModel from "./user.model";
import jwt from 'jsonwebtoken';
require('dotenv').config();

String.prototype.toObjectId = function() {
  var ObjectId = (require('mongoose').Types.ObjectId);
  return new ObjectId(this.toString());
};

export async function createUser(req, res) {
  try {
    const user = req.body;
    user.active = true;
    const document = await userModel.create(user);
    res.status(201).json(document)
  } catch (error) {
    res.status(400).json(error.message);
  }
}

export async function login(req, res) {
  try {
    const { email, password } = req.body;
    const result = await userModel.findOne({ email, password, active: true });
    
    if (result) { 
      const payload = result.toObject();
      if (!process.env.SECRET_KEY) {
        return res.status(500).json({ error: 'Secret key is missing or invalid.' });
      }
      const token = jwt.sign(payload, process.env.SECRET_KEY);
      return res.status(200).json({ token: token });
    }
    res.sendStatus(404);
  } catch (err) {
    return res.status(400).json(err.message);
  }
}


export async function readUserByID(req, res) {
  try {
    
    const id = (req.params.id).toString().toObjectId();
    const document = await userModel.findById({ _id: id , active:true });
    document ? res.status(200).json(document) : res.sendStatus(404);
  } catch (error) {
    res.status(400).json(error.message);
  }
}

export async function updateUser(req, res) {
  try {
    const id = (req.params.id).toString().toObjectId();
    const document = await userModel.findByIdAndUpdate( { _id: id, active: true }, req.body, {
      runValidators: true,
      new: true,
    });
    document ? res.status(200).json(document) : res.sendStatus(404);
  } catch (error) {
    res.status(400).json(error.message);
  }
}

export async function deleteUser(req, res) {
  try {
    const id = (req.params.id).toString().toObjectId();
    const document = await userModel.findByIdAndUpdate({ _id: id, active: true }, { active: false }, {
      runValidators: true,
			new: true,
    });
    document ? res.status(200).json(document) : res.sendStatus(404);
  } catch (error) {
    res.status(400).json(error.message);
  }
}
