const express = require('express');

const router = express.Router();

const gameController = require('../controllers/gameController');
const categoryController = require('../controllers/categoryController');

router.get('/', gameController.index);

// game routes
router.get('/game/create', gameController.game_create_get);
router.post('/game/create', gameController.game_create_post);

router.get('/game/:id/delete', gameController.game_delete_get);
router.post('/game/:id/delete', gameController.game_delete_post);

router.get('/game/:id/update', gameController.game_update_get);
router.post('/game/:id/update', gameController.game_update_post);

router.get('/game/:id', gameController.game_detail);
router.get('/games', gameController.game_list);

module.exports = router;
