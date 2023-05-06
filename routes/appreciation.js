const express = require('express');
const router = express.Router();

const auth = require('../middleware/auth');
const appreciationCtrl = require('../controllers/appreciation');

router.post('/', auth, appreciationCtrl.add);

router.put('/:id', auth, appreciationCtrl.update);

router.get('/:id', appreciationCtrl.find);

router.delete('/:id', auth, appreciationCtrl.delete);

module.exports = router;