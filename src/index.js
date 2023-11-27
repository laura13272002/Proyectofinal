import express from 'express';
import userRouter from './user/user.router';
import productRouter from './product/product.router';
import orderRouter from './order/order.router';
import mongoose from 'mongoose';

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

app.use('/user', userRouter);
app.use('/product', productRouter);
app.use('/order', orderRouter);
app.get("/", function (req, res) {
  res.send("Hola Mundo!");
});

mongoose
  .connect('mongodb+srv://cluster0.8cfhty8.mongodb.net/',{
    dbName: 'db_PF',
    user: 'test',
    pass:'testeo',
  })
  .then(()=> console.log('database connected'))
  .catch((error) => console.log(error))

try {
  app.listen(port);
  console.log('server running on port ' + port);
} catch (error) {
  console.log(error);
}