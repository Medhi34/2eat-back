const express = require('express');
const router = express.Router();

const restaurantCtrl = require('../controllers/restaurant');
const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config').array('images');

router.post('/', auth, multer, restaurantCtrl.create);

router.put('/:id', auth, multer, restaurantCtrl.update);

router.get('/', restaurantCtrl.findAll);

router.get('/category/:category', restaurantCtrl.findByCategory);

router.get('/city/:city', restaurantCtrl.findByCity);

router.get('/:id', restaurantCtrl.findbyId);

router.get('/:id/meals', restaurantCtrl.getMeals);

router.get('/:id/appreciations', restaurantCtrl.getAppreciations);

module.exports = router;