const express = require('express');
const router = express.Router();
const auth = require('../middlewares/requireAuth');
const admin = require('../middlewares/checkRole');
const { fetchOrder, placeOrder, changeStatus, removeOrder } = require('../controllers/orderController');

router.get('/fetch/:id', auth, fetchOrder);
router.post('/place', auth, placeOrder);
router.patch('/update/:id', auth, admin, changeStatus);
router.delete('/delete/:id', auth, removeOrder);


module.exports = router;