const asyncHandler = require('express-async-handler');
const { body, validationResult } = require('express-validator');
const Category = require('../models/category');
const Game = require('../models/game');

exports.category_list = asyncHandler(async (req, res) => {
  const allCategories = await Category.find({}).sort({ name: 1 }).exec();

  res.render('category_list', {
    title: 'Category List',
    categories: allCategories,
  });
});

exports.category_detail = asyncHandler(async (req, res, next) => {
  const [category, allCategoryGames] = await Promise.all([
    Category.findById(req.params.id).exec(),
    Game.find({ category: req.params.id }, 'title price').sort({ title: 1 }).exec(),
  ]);

  if (category === null) {
    const err = new Error('Category not found');
    err.status = 404;
    return next(err);
  }

  res.render('category_detail', {
    title: category.name,
    category,
    categoryGames: allCategoryGames,
  });
});

exports.category_create_get = asyncHandler(async (req, res, next) => {
  res.render('category_form', {
    title: 'Create Category',
  });
});

exports.category_create_post = [
  body('name', 'Name must not be empty')
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body('description', 'Description must not be empty')
    .trim()
    .isLength({ min: 1 })
    .escape(),

  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);

    const category = new Category({
      name: req.body.name,
      description: req.body.description,
    });

    if (!errors.isEmpty()) {
      res.render('category_form', {
        title: 'Create Category',
        category,
      });
    } else {
      await category.save();
      res.redirect(category.url);
    }
  }),
];

exports.category_delete_get = asyncHandler(async (req, res, next) => {
  const [category, allCategoryGames] = await Promise.all([
    Category.findById(req.params.id).exec(),
    Game.find({ category: req.params.id }, 'title description').sort({ title: 1 }).exec(),
  ]);

  if (category === null) {
    const err = new Error('Category not found');
    err.status = 404;
    return next(err);
  }

  res.render('category_delete', {
    title: 'Delete Category',
    category,
    game_list: allCategoryGames,
  });
});

exports.category_delete_post = asyncHandler(async (req, res, next) => {
  const [category, allCategoryGames] = await Promise.all([
    Category.findById(req.params.id, 'name').exec(),
    Game.find({ category: req.params.id }, 'title description').sort({ title: 1 }).exec(),
  ]);

  if (allCategoryGames.length > 0) {
    res.render('category_delete', {
      title: 'Delete Category',
      category,
      game_list: allCategoryGames,
    });
  }
  await Category.findByIdAndRemove(req.params.id);
  res.redirect('/catalog/categories');
});

exports.category_update_get = asyncHandler(async (req, res, next) => {
  const category = await Category.findById(req.params.id).exec();

  if (category === null) {
    const err = new Error('Category not found');
    err.status = 404;
    return next(err);
  }

  res.render('category_form', {
    title: 'Update Category',
    category,
  });
});

exports.category_update_post = [
  body('name', 'Name must not be empty')
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body('description', 'Description must not be empty')
    .trim()
    .isLength({ min: 1 })
    .escape(),

  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);

    const category = new Category({
      name: req.body.name,
      description: req.body.description,
      _id: req.params.id,
    });

    if (!errors.isEmpty()) {
      res.render('category_form', {
        title: 'Update Category',
        category,
      });
    } else {
      await Category.findByIdAndUpdate(req.params.id, category, {});
      res.redirect(category.url);
    }
  }),
];
