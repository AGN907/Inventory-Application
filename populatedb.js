#! /usr/bin / env node
console.log(
  'This script populates some test games and categories to your database. Specified database as argument - e.g.: node populatedb "mongodb+srv://cooluser:coolpassword@cluster0.lz91hw2.mongodb.net/local_library?retryWrites=true&w=majority"',
);

// Get arguments passed on command line
const userArgs = process.argv.slice(2);

const Game = require('./models/game');
const Category = require('./models/category');

const games = [];
const categories = [];

const mongoose = require('mongoose');

mongoose.set('strictQuery', false);

const mongoDB = userArgs[0];

main().catch((err) => console.log(err));

async function main() {
  console.log('Debug: About to connect');
  await mongoose.connect(mongoDB);
  console.log('Debug: Should be connected?');
  await createCategories();
  await createGames();
  console.log('Debug: Closing mongoose');
  mongoose.connection.close();
}

async function categoryCreate(index, name, description) {
  const category = new Category({ name, description });
  await category.save();
  categories[index] = category;
  console.log(`Added category: ${name}`);
}

async function gameCreate(index, title, description, stock, price, category) {
  const gamedetail = {
    title,
    description,
    price,
    stock,
  };
  if (category != false) gamedetail.category = category;

  const game = new Game(gamedetail);
  await game.save();
  games[index] = game;
  console.log(`Added game: ${title}`);
}

async function createCategories() {
  console.log('Adding categories');
  await Promise.all([
    categoryCreate(0, 'FPS', 'First-person shooters generally focus on action gameplay, with fast-paced combat and dynamic firefights being a central point of the experience, though certain titles may also place a greater emphasis on narrative, problem-solving and logic puzzles.'),
    categoryCreate(1, 'RPG', 'A role-playing game (RPG) is a game in which each participant assumes the role of a character that can interact within the game\'s imaginary world. Many RPGs are set in fantasy or science fiction environments.'),
    categoryCreate(2, 'Sports', 'Sports games are a video game genre that simulates sports. They are usually based on real-world sports, but can also be fictional or exaggerated. These games usually let the player control one or more athletes during competition.'),
    categoryCreate(3, 'Strategy', 'A strategy game or strategic game is a game (e.g. a board game) in which the players\' uncoerced, and often autonomous, decision-making skills have a high significance in determining the outcome. Almost all strategy games require internal decision tree-style thinking, and typically very high situational awareness.'),
    categoryCreate(4, 'Racing', 'Racing games are a video game genre in which the player participates in a racing competition. They may be based on anything from real-world racing leagues to fantastical settings.'),
  ]);
}

async function createGames() {
  console.log('Adding Games');
  await Promise.all([
    gameCreate(
      0,
      'Battlefield 2042',
      'Master the unknown in Season 6: Dark Creations. Battlefield™ 2042 is a first-person shooter that marks the return to the iconic all-out warfare of the franchise. ',
      12,
      28,
      [categories[0]],
    ),
    gameCreate(
      1,
      'ELDEN RING',
      'THE NEW FANTASY ACTION RPG. Rise, Tarnished, and be guided by grace to brandish the power of the Elden Ring and become an Elden Lord in the Lands Between.',
      38,
      8,
      [categories[1]],
    ),
    gameCreate(
      2,
      'EA SPORTS FC 24',
      'EA SPORTS FC 24 welcomes you to The World’s Game: the most true-to-football experience ever with HyperMotionV, PlayStyles optimised by Opta, and an enhanced Frostbite Engine.',
      70,
      20,
      [categories[2]],
    ),
    gameCreate(
      3,
      'Hearts of Iron IV',
      'Victory is at your fingertips! Your ability to lead your nation is your supreme weapon, the strategy game Hearts of Iron IV lets you take command of any nation in World War II; the most engaging conflict in world history.',
      36,
      22,
      [categories[3]],
    ),
    gameCreate(
      4,
      'Sid Meier’s Civilization VI',
      'Civilization VI is the newest installment in the award winning Civilization Franchise. Expand your empire, advance your culture and go head-to-head against history’s greatest leaders. Will your civilization stand the test of time?',
      30,
      20,
      [categories[3]],
    ),
    gameCreate(
      5,
      'Forza Motorsport',
      'Out-build the competition in the all-new career. Race your friends in adjudicated multiplayer events. Compete in over 500 cars on world-famous tracks with cutting edge AI, advanced physics, and tire and fuel strategy.',
      80,
      5,
      [categories[2], categories[4]],
    ),
    gameCreate(
      6,
      'Lies of P',
      'Lies of P is a thrilling soulslike that takes the story of Pinocchio, turns it on its head, and sets it against the darkly elegant backdrop of the Belle Epoque era.',
      44,
      10,
      [categories[1]],
    ),
  ]);
}
