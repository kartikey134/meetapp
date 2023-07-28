const express = require('express');
const { getRooms, add, remove } = require('../controllers/room');
const router = express.Router();

router.get('/', getRooms);
router.post('/add', add);
router.post('/remove', remove);

module.exports = router;