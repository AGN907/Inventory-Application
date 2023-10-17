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

// Category routes
router.get('/category/create', categoryController.category_create_get);
router.post('/category/create', categoryController.category_create_post);

router.get('/category/:id/delete', categoryController.category_delete_get);
router.post('/category/:id/delete', categoryController.category_delete_post);

router.get('/category/:id/update', categoryController.category_update_get);
router.post('/category/:id/update', categoryController.category_update_post);

router.get('/category/:id', categoryController.category_detail);
router.get('/categories', categoryController.category_list);

module.exports = router;
