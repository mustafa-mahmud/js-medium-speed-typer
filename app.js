'use strict';

const modelEl = document.querySelector('.model');
const overlayEl = document.querySelector('.overlay');
const text = document.getElementById('text');
const wordContainer = document.querySelector('.word-container');
const allH1 = document.querySelectorAll('.word-container h1');
const scoreEl = document.getElementById('score');
const start = document.getElementById('start');
const difficulty = document.getElementById('difficulty');
const youIn = document.querySelector('.you-in');
const choosen = document.querySelector('.choosen');
const higestDiff = document.querySelector('.higest-diff');
const higestScoreEl = document.querySelector('.higest-score');
const catagories = document.getElementById('catagories');
const msg = document.getElementById('msg');
const timeEl = document.getElementById('time');

const words = {
  fruits: [
    'apple',
    'watermelon',
    'orange',
    'pear',
    'cherry',
    'strawberry',
    'grape',
    'mango',
    'blueberry',
    'plum',
    'banana',
    'jackfruit',
    'papaya',
    'pineapple',
    'lemon',
    'coconut',
    'avocado',
  ],
  animals: [
    'dog',
    'cat',
    'turtle',
    'rabbit',
    'parrot',
    'kitten',
    'rat',
    'cow',
    'deer',
    'horse',
    'tiger',
    'lion',
    'zebra',
    'monkey',
    'panda',
    'wolf',
    'camel',
    'bear',
    'koala',
    'hyna',
    'chita',
    'elephan',
    'khangaroo',
  ],
  birds: [
    'crow',
    'peacock',
    'dove',
    'sparrow',
    'goose',
    'ostrich',
    'pigeon',
    'trukey',
    'hawk',
    'raven',
    'parrot',
    'seagull',
    'penguin',
    'robin',
    'swan',
    'owl',
    'kingfisher',
    'eagle',
    'martin',
    'bad',
    'blackbird',
  ],
  fishes: [
    'catfish',
    'tuna',
    'flying fish',
    'eels',
    'sharks',
    'carp',
    'salmon',
    'climbing perch',
    'marlin',
    'lionfish',
    'piranha',
    'goldfish',
    'whale',
    'bluefish',
    'perch',
  ],
  flowers: [
    'tulip',
    'daffodil',
    'sunflower',
    'rose',
    'lily',
    'lotus',
    'water lily',
    'daisy',
    'hyacinth',
    'popy',
    'china rose',
    'orchid',
    'iris',
    'peony',
  ],
};

let user = 'birds';
let random3Nums = [];
let tempNums = [];
let scores = 0;
let times = 5;
let addTimes = 0;
let stopTime;
let highestScore = {
  Easy: 15,
  Medium: 10,
  Hard: 5,
};

localStorage.getItem('type')
  ? localStorage.getItem('type')
  : localStorage.setItem('type', JSON.stringify(highestScore));

const gameOver = () => {
  modelEl.style.display = 'block';
  overlayEl.style.display = 'block';
  const currentHigest = JSON.parse(localStorage.getItem('type'))[
    difficulty.value
  ];
  start.textContent = 'Start Again';
  //if highest break, then change LOC
  if (scores >= currentHigest) {
    highestScore = JSON.parse(localStorage.getItem('type'));
    highestScore[difficulty.value] = scores;
    localStorage.setItem('type', JSON.stringify(highestScore));
  }
  const info =
    scores >= currentHigest
      ? 'You breaked higest scores, 🥳🥳.'
      : `You could not break Higest score ${currentHigest}, ☹️☹️`;
  const msgs = `Your score: ${scores}, ${info}`;
  const cl = scores >= currentHigest ? 'green' : 'yellow';
  message(msgs, cl);

  //back to init
  catagories.value = difficulty.value = 'choose';
  scores = 0;
  times = 5;
  scoreEl.textContent = 0;
};

const timesFunc = () => {
  stopTime = setInterval(() => {
    times--;

    timeEl.textContent = `${times}s`;
    if (times === 0) {
      clearInterval(stopTime);
      gameOver();
    }
  }, 1000);
};

const message = (msgs, cl) => {
  msg.style.color = cl;
  msg.textContent = msgs;
};

const getUserChoosen = function (e) {
  const cata = catagories.value;
  const diff = difficulty.value;

  if (cata !== '' && cata !== 'choose' && diff !== '' && diff !== 'choose') {
    msg.textContent = '';
    text.focus();
    youIn.textContent = diff;
    higestDiff.textContent = `${diff}-Higest:`;
    higestScoreEl.textContent = JSON.parse(localStorage.getItem('type'))[diff];
    choosen.textContent = cata;
    user = cata.toLowerCase();
    modelEl.style.display = 'none';
    overlayEl.style.display = 'none';
    get3Nums();
    displayUI();

    if (diff === 'Medium') addTimes = 3;
    else if (diff === 'Hard') addTimes = 2;
    else addTimes = 4;

    timesFunc();
  } else {
    message('Please fill Catagory and Difficulty both.', 'red');
  }
};

const randomNum = () => {
  return Math.floor(Math.random() * words[user].length);
};

const get3Nums = () => {
  if (random3Nums.length < 3) {
    for (let i = 0; i < 3 - random3Nums.length; i++) {
      const rand = randomNum();
      if (!tempNums.includes(rand)) {
        tempNums.unshift(rand);
      } else {
        tempNums = random3Nums;

        get3Nums();
      }
    }
  }

  if (tempNums.length === 3) random3Nums = tempNums;
  else get3Nums();
};

const ckWord = (e) => {
  const val = text.value.trim().toLowerCase();
  const current = words[user][random3Nums[2]];
  if (val === current) {
    scores++;
    scoreEl.textContent = scores;
    text.value = '';
    clearInterval(stopTime);
    times += addTimes;
    timesFunc(times);
    random3Nums.pop();
    get3Nums();
    displayUI();
  }
};

//prevent space on input field
const preventSpace = (event) => {
  var space = event ? event.which : window.event.keyCode;
  if (space === 32) {
    text.value = '';
    return false;
  }
};

const displayUI = () => {
  random3Nums.forEach((rand, ind) => {
    allH1[ind].textContent = words[user][rand];
  });
};

const skipWord = (e) => {
  if (e.keyCode === 32) {
    clearInterval(stopTime);
    times = times - 2;
    if (times <= 0) {
      return gameOver();
    }
    timesFunc();
    random3Nums.pop();
    get3Nums();
    displayUI();
  }
};

//////////////////
text.addEventListener('input', ckWord);
text.addEventListener('keypress', preventSpace);
document.addEventListener('keydown', skipWord);
start.addEventListener('click', getUserChoosen);
