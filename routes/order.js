const express = require('express');
const router = express.Router();

const orderCtrl = require('../controllers/order');
const auth = require('../middleware/auth');

router.post('/', auth, orderCtrl.add);

router.put('/:id', auth, orderCtrl.update);

router.get('/:id', auth, orderCtrl.findById);

router.delete('/:id',auth,  orderCtrl.delete);

module.exports = router;