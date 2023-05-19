const express = require('express');
const router = express.Router();

const mealCtrl = require('../controllers/meal');
const multer = require('../middleware/multer-config').array('images');
const auth = require('../middleware/auth');

router.post('/:idRes/', auth, multer, mealCtrl.add);

router.put('/:idRes/:id', auth, multer, mealCtrl.update);

router.delete('/:idRes/:id', auth, mealCtrl.delete);

router.get('/:id', mealCtrl.findById);

router.get('/', mealCtrl.findAll);

module.exports = router;