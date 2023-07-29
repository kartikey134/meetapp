const express = require('express');
const { getRooms, add, remove } = require('../controllers/room');
const router = express.Router();

const authMiddlewares = require('../middlewares/authenticate');

router.get('/', getRooms);
router.post('/add', authMiddlewares.authenticate, add);
router.post('/remove', authMiddlewares.authenticate, remove);

module.exports = router;