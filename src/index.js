import express from 'express';
import userRouter from './user/user.router';
import productRouter from './product/product.router';
import orderRouter from './order/order.router';
import mongoose from 'mongoose';

const app = express();
const port = process.env.PORT || 8080;

app.use(express.json());

app.use('/user', userRouter);
app.use('/product', productRouter);
app.use('/order', orderRouter);

// Conecta a la base de datos y espera a que se establezca la conexión
const connectDB = async () => {
  await mongoose.connect('mongodb+srv://cluster0.8cfhty8.mongodb.net/',{
    dbName: 'db_PF',
    user: 'test',
    pass:'testeo',
  });
  console.log('DB connected');
};

// Inicia el servidor después de la conexión a la base de datos
const startServer = () => {
  app.listen(port, () => {
    console.log('Running on port: ' + port);
  });
};

// Manejo de eventos de conexión y inicio del servidor
connectDB().then(startServer);

export default app;
