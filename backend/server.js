const express = require('express');
const { connectDB } = require('./database/connect');
const app = express();
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
connectDB();
app.use(bodyParser.json());
app.use(cookieParser())

const productRoutes= require('./modules/product/productRoutes')
const userRoutes= require('./modules/user/userRoutes')
const orderRoutes= require('./modules/order/orderRoutes')

app.use('/orders', orderRoutes);
app.use('/products', productRoutes);
app.use('/users',userRoutes);


app.listen(3001, () => {
    console.log('server running on ', 3001);
})
