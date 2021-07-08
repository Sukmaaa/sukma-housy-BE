const router = require('express').Router();

// Controller
const { signin, signup } = require('../controllers/Auth');
const { cities } = require('../controllers/City');
const { getHouses, getHouse, createHouse, deleteHouse, updateHouse } = require('../controllers/House');
const { getOrders, getOrder, deleteOrder, createOrder, updateOrder } = require('../controllers/Transaction');
const { getRoles, createRole } = require('../controllers/Role');
const { users, deleteUser } = require('../controllers/Users');
const { auth } = require('../middleware/auth');

// auth
router.post('/signin', signin);
router.post('/signup', signup);

// cities
router.get('/cities', cities);

// User
router.get('/users', auth, users);
router.delete('/user/:id', auth, deleteUser);

// houses
router.get('/houses', getHouses);
router.get('/house/:id', getHouse);
router.post('/house', auth, createHouse);
router.patch('/house/:id', auth, updateHouse);
router.delete('/house/:id', auth, deleteHouse);

//Transaction
router.get('/orders', auth, getOrders);
router.get('/order/:id', auth, getOrder);
router.post('/order', auth, createOrder);
router.patch('/order/:id', auth, updateOrder);
router.delete('/order/:id', auth, deleteOrder);

// roles
router.get('/roles', getRoles);
router.post('/role', createRole);

module.exports = router;