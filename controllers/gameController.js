/* eslint-disable no-underscore-dangle */
/* eslint-disable no-param-reassign */
const asyncHandler = require('express-async-handler');
const { body, validationResult } = require('express-validator');
const Game = require('../models/game');
const Category = require('../models/category');

exports.index = asyncHandler(async (req, res) => {
  const [
    numGames,
    numCategories,
  ] = await Promise.all([
    Game.countDocuments().exec(),
    Category.countDocuments().exec(),
  ]);

  res.render('index', {
    title: 'The Games Inventory',
    game_count: numGames,
    category_count: numCategories,
  });
});

exports.game_list = asyncHandler(async (req, res) => {
  const allGames = await Game.find({}, 'title description').sort({ title: 1 }).exec();

  res.render('game_list', {
    title: 'Games List',
    games: allGames,
  });
});

exports.game_detail = asyncHandler(async (req, res) => {
  const game = await Game.findById(req.params.id).populate('category').exec();

  console.log(game);
  res.render('game_detail', {
    title: game.title,
    game,
  });
});

exports.game_create_get = asyncHandler(async (req, res) => {
  const allCategories = await Category.find({}, 'name').sort({ name: 1 }).exec();
  res.render('game_form', {
    title: 'Create Game',
    category_list: allCategories,
  });
});

exports.game_create_post = [
  (req, res, next) => {
    if (!(req.body.category instanceof Array)) {
      if (typeof req.body.category === 'undefined') { req.body.genre = []; } else req.body.category = new Array(req.body.category);
    }
    next();
  },
  body('title', 'Title must contain at least 3 characters')
    .trim()
    .isLength({ min: 3 })
    .escape(),
  body('description', 'Description must not be empty')
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body('price', 'Price must be greater than 0')
    .trim()
    .isInt({ min: 1 })
    .withMessage('Price must be greater than 0')
    .escape(),
  body('stock', 'Stock must be greater than 0')
    .trim()
    .isInt({ min: 1 })
    .escape(),
  body('category.*').escape(),

  asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    console.log('sent');

    const game = new Game({
      title: req.body.title,
      description: req.body.description,
      price: req.body.price,
      stock: req.body.stock,
      category: req.body.category,
    });

    if (!errors.isEmpty()) {
      const allCategories = await Category.find({}, 'name').sort({ name: 1 }).exec();

      allCategories.forEach((category) => {
        if (game.category.includes(category._id)) {
          category.checked = true;
        }
      });
      res.render('game_form', {
        title: 'Create Game',
        game,
        errors: errors.array(),
        category_list: allCategories,
      });
    } else {
      await game.save();
      res.redirect(game.url);
    }
  }),
];

exports.game_delete_get = asyncHandler(async (req, res, next) => {
  const game = await Game.findById(req.params.id).exec();

  if (game === null) {
    const err = new Error('Game not found');
    err.status = 404;
    return next(err);
  }

  res.render('game_delete', {
    title: 'Delete Game',
    game,
  });
});

exports.game_delete_post = asyncHandler(async (req, res) => {
  await Game.findByIdAndDelete(req.params.id);

  res.redirect('/catalog/games');
});

exports.game_update_get = asyncHandler(async (req, res, next) => {
  const [game, allCategories] = await Promise.all([
    Game.findById(req.params.id).exec(),
    Category.find({}, 'name').sort({ name: 1 }).exec(),
  ]);

  if (game === null) {
    const err = new Error('Game not found');
    err.status = 404;
    return next(err);
  }

  allCategories.forEach((category) => {
    if (game.category.includes(category._id)) {
      category.checked = true;
    }
  });

  res.render('game_form', {
    title: 'Update',
    game,
    category_list: allCategories,
  });
});

exports.game_update_post = [
  (req, res, next) => {
    if (!(req.body.category instanceof Array)) {
      if (typeof req.body.category === 'undefined') req.body.category = [];
      else req.body.category = new Array(req.body.category);
    }
    next();
  },

  body('title', 'Title must not be empty!')
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body('description', 'Description must not be empty')
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body('price', 'Price must be greater than 0')
    .trim()
    .isInt({ min: 1 })
    .withMessage('Price must be greater than 0')
    .escape(),
  body('stock', 'Stock must be greater than 0')
    .trim()
    .isInt({ min: 1 })
    .escape(),
  body('category.*').escape(),

  asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    const game = new Game({
      title: req.body.title,
      description: req.body.description,
      price: req.body.price,
      stock: req.body.stock,
      category: typeof req.body.category === 'undefined' ? [] : req.body.category,
      _id: req.params.id,
    });

    if (!errors.isEmpty()) {
      const allCategories = await Category.find({}, 'name').sort({ name: 1 }).exec();

      allCategories.forEach((category) => {
        if (game.category.includes(category._id)) {
          category.checked = true;
        }
      });

      res.render('game_form', {
        title: 'Update Game',
        game,
        category_list: allCategories,
        errors: errors.array(),
      });
    } else {
      await Game.findByIdAndUpdate(req.params.id, game, {});
      res.redirect(game.url);
    }
  }),
];
