const OrderSchema = require('../../model/order');
const ProductSchema = require('../../model/product');

const { SUCCESS_MESSAGES, ERROR_MESSAGES } = require('../order/orderConstants');
async function createOrder(req,res) {
    try {
      console.log("check4");
      const {
        products = [],
        address
      } = req.body;
      const { user } = req;
      if(!products.length) {
        throw ({ message: 'products are missing'});
      }
      console.log(products);
      const productIds = products.map((product)=>product.productId);
      const productsCount = await ProductSchema.count({
        _id: {$in: productIds }
      });
      if(productsCount != products.length){
        throw({ message: 'Some products does not exists'});
      }
      let total = 0;
      products.forEach(product=>{
        total += product.price*product.quantity;
      });
      const order = new OrderSchema({
        products,
        address,
        userId: user._id,
        total,
        tax: total*12/100,
        shippingPrice: total*2/100,
        orderTotal: total + total*14/100 
      });
      await order.save();
      return res.status(201).json({
         message: 'Order created successfully',
         data: {
          order
         }
      })
    } catch (error) {
      console.log(error);
      return res.status(400).json({
        message: 'Something went wrong',
        error
      });
    }
  }
  
  

async function getOrderDetails(req,res) {
    try {
        const { id } = req.params;
    const order = await OrderSchema.findById(id);
    if(!order){
        throw({message:'order not found'});
    }
    return res.status(200).json({
        data:{order},
        message:SUCCESS_MESSAGES.ORDER_FETCHED_SUCCESSFULLY
    })
    } catch (error) {
        return res.status(200).json({
            message:ERROR_MESSAGES.SOMETHING_WENT_WRONG,
            error
        })  
    }
}
async function getAllOrders(req,res) {
    try {
        const { user } = req;
        const order = await OrderSchema.find({});
        return res.status(200).json({
            data:{ order },
            message:SUCCESS_MESSAGES.ORDER_FETCHED_SUCCESSFULLY
        })
    } catch (error) {
        return res.status(500).json({
            message:ERROR_MESSAGES.SOMETHING_WENT_WRONG,
            error,
        })
    }
}
async function getMyOrder(req,res) {
  try {
    const { limit, skip, filters } = req.query;
    const whereClause = {userId: '64f9e6214324f08a141ec25f'};
    const { status } = JSON.parse(filters);
    if(status) {
      whereClause.status = status;
    };
        const {user} = req;
    const order = await OrderSchema.find(whereClause).limit(limit).skip(skip);
    const ordersCount = await OrderSchema.count(whereClause);
    setTimeout(() => {
      return res.status(200).json({
        data: { order,ordersCount },
        
        message: SUCCESS_MESSAGES.USER_FETCHED_SUCCESSFULLY
      })
    }, 5000);
    } catch (error) {
        return res.status(500).json({
            message: ERROR_MESSAGES.SOMETHING_WENT_WRONG,
            error,
          })
    }
}

async function updateOrderStatus(req,res) {
    try {
      console.log("check1");
      const { id } = req.params;
      const { status } = req.body;
      const order = await OrderSchema.findById(id);
      if(!order){
        throw ({ message: 'Invalid id'});
      };
      const { status: currentStatus } = order; 
      console.log(currentStatus);
      if (currentStatus === 'delivered' || currentStatus === 'canceled') {
        throw ({ message: 'Order cannot be updated'});
      }
      console.log(currentStatus === 'processing', status != 'confirmed', status != 'canceled', status != 'confirmed' || status != 'canceled');
      if (
        (currentStatus === 'processing' && (status != 'confirmed' || status != 'canceled'))
        || (currentStatus === 'confirmed' && (status != 'out for delivery'|| status != 'canceled'))
        || (currentStatus === 'out for delivery' && (status != 'delivered'|| status != 'canceled'))
      ) {
        throw ({ message: 'Invalid order status'})
      }
      order.status = status;
      await order.save();
      return res.status(200).json({
        message: 'Orders updated successfully',
        data: {
         order
        }
     });
    } catch (error) {
      return res.status(400).json({
        message: 'Something went wrong',
        error
      });
    }
  }
  

module.exports = {
    getAllOrders,
    getOrderDetails,
    getMyOrder,
    createOrder,
    updateOrderStatus
}

