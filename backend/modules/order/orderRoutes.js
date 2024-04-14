const express = require('express');
const router = express.Router();
const { authenticate, authorize } = require('../../authentication/auth');
const { getMyOrder, createOrder, getOrderDetails, getAllOrders, updateOrderStatus } = require('./orderController');



router.route('/').get(getMyOrder).post(authenticate, createOrder);
router.route('/admin/').get(getAllOrders);
router.route('/admin/:id').put(updateOrderStatus);
router.route('/:id').get(getOrderDetails);

module.exports = router;