const express = require('express');
const router = express.Router();

const userCtrl = require('../controllers/user');
const multer = require('../middleware/multer-config').single('image');

router.post('/signup', multer, userCtrl.signup);

router.post('/login', userCtrl.login);

router.get('/:id', userCtrl.findById);

router.put('/:id/image', multer, userCtrl.updateImage);

router.put('/:id', userCtrl.update);

router.delete('/:id', userCtrl.delete);

router.get('/:id/restaurants', userCtrl.getRestaurants);

router.get('/:id/orders', userCtrl.getOrders);



module.exports = router;