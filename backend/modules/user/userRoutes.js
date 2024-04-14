const express = require('express');
const router = express.Router();
const {login,
    logout,
    getMyProfile,
    updateProfile,
    getUsers,
    deleteUser,
    forgotPassword,
    resetPassword,
    signup} = require('./userController');
const { authenticate, authorize } = require('../../authentication/auth');

router.route('/login').post(login);
router.route('/logout').put(logout);
router.route('/').post(signup).get(authenticate,getMyProfile).put(authenticate,updateProfile);
router.route('/admin/').get(authenticate,authorize,getUsers)
router.route('/admin/:id').delete(authenticate,authorize,deleteUser);
router.route('/forgotPassword').put(forgotPassword);
router.route('/resetPassword').put(resetPassword);

module.exports = router;