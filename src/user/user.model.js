import { Schema, model } from "mongoose";

const userSchema = new Schema({
name: { type: String, required: true },
email: { type: String, required: true, unique: true },
password: { type: String, required: true},
phone: { type: String, required: true, unique: true },
address: { type: String, required: true},
active: { type: Boolean, default: true },
},
{   timestamps: true,
});

const userModel = model('users', userSchema);
export default userModel;

