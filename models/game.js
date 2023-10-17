/* eslint-disable no-underscore-dangle */
const mongoose = require('mongoose');
const { randomUUID } = require('crypto');

const { Schema } = mongoose;

const GameSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  category: [{ type: Schema.Types.ObjectId, ref: 'Category' }],
  price: { type: Number, required: true },
  stock: { type: Number, required: true },
  sn: { type: Schema.Types.UUID, default: () => randomUUID() },
  image: { data: Buffer, contentType: String },
});

GameSchema.virtual('url').get(function () {
  return `/catalog/game/${this._id}`;
});

module.exports = mongoose.model('Game', GameSchema);
