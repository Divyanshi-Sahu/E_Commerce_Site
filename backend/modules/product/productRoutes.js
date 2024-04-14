const { getProducts, getproductDetail, createNewProduct, updateProduct, deleteProduct, getProductDetail, } = require('./productController');
const express = require('express');

const router = express.Router();
const {authenticate,authorize} = require('../../authentication/auth');
 
router.route('/').get(getProducts);
router.route('/:id').get(getProductDetail);
router.route('/admin').post(authenticate, authorize, createNewProduct);
router.route('/admin/:id').put(authenticate, authorize,updateProduct).delete(authenticate, authorize, deleteProduct);

module.exports = router;