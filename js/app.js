'use strict';

var allProductNames = ['bag', 'banana', 'bathroom', 'boots', 'breakfast', 'bubblegum', 'chair', 'cthulhu', 'dog-duck', 'dragon', 'pen', 'pet-sweep', 'scissors', 'shark', 'sweep', 'tauntaun', 'unicorn', 'usb', 'water-can', 'wine-glass'];
var allProductSrc = ['./img/bag.jpg', './img/banana.jpg', './img/bathroom.jpg', './img/boots.jpg', './img/breakfast.jpg', './img/bubblegum.jpg', './img/chair.jpg', './img/cthulhu.jpg', './img/dog-duck.jpg', './img/dragon.jpg', './img/pen.jpg', './img/pet-sweep.jpg', './img/scissors.jpg', './img/shark.jpg', './img/sweep.png', './img/tauntaun.jpg', './img/unicorn.jpg', './img/usb.gif', './img/water-can.jpg', './img/wine-glass.jpg'];

var productContainer = document.getElementById('allProducts');
var buttonLinks = document.getElementById('buttonLinks');
var stats = document.getElementById('stats');
var chartContainer = document.getElementById('chartContainer');

var leftImgTag = document.getElementById('left');
var middleImgTag = document.getElementById('center');
var rightImgTag = document.getElementById('right');

var totalClicks = 0;
//holds all products instantiated
Product.allProducts = [];
//holds 6 values
Product.checkDupes = [];

// //store products already on the page
var leftProduct = null;
var middleProduct = null;
var rightProduct = null;

function Product(name, src) {
  this.name = name;
  this.src = src;
  this.clicks = 0;
  this.timesShown = 0;
  Product.allProducts.push(this);
}

function instantiateProducts () {
  for(var i = 0; i < allProductNames.length; i++) {
    new Product(allProductNames[i], allProductSrc[i]);
  }
}

function randomNumber() {
  return Math.floor(Math.random() * Product.allProducts.length);
}

function displayProducts() {
  //generate array of random # that correlates with each index
  while (Product.checkDupes.length < 6) {
    var number = randomNumber();
    //if the number is not in the array, then that image has not been shown,
    //so push the number into the array
    if (!Product.checkDupes.includes(number)) {
      Product.checkDupes.push(number);
    }
    //do this until the array is at 6 numbers again
    //all 6 numbers are unique
  }
  leftImgTag.src = Product.allProducts[Product.checkDupes[0]].src;
  Product.allProducts[Product.checkDupes[0]].timesShown++;
  leftProduct = Product.allProducts[Product.checkDupes[0]];

  middleImgTag.src = Product.allProducts[Product.checkDupes[1]].src;
  Product.allProducts[Product.checkDupes[1]].timesShown++;
  middleProduct = Product.allProducts[Product.checkDupes[1]];

  rightImgTag.src = Product.allProducts[Product.checkDupes[2]].src;
  Product.allProducts[Product.checkDupes[2]].timesShown++;
  rightProduct = Product.allProducts[Product.checkDupes[2]];

  //only keep the last 3 numbers because the first 3 have been used
  //these 3 nums will now be at the beginning of checkDupes
  Product.checkDupes = Product.checkDupes.slice(3, 6);
}

function renderStats() {
  var h1El = document.createElement('h1');
  h1El.textContent = 'Stats';
  stats.appendChild(h1El);

  var buttonEl = document.createElement('a');
  buttonEl.textContent = 'Stats';
  buttonEl.setAttribute('class', 'btn');
  buttonEl.href = '#statsContainer';
  buttonLinks.appendChild(buttonEl);

  for (var i = 0; i < Product.allProducts.length; i++) {
    var liEl = document.createElement('li');
    liEl.textContent = Product.allProducts[i].clicks + ' votes for ' + Product.allProducts[i].name;
    stats.appendChild(liEl);
  }
}

function renderChart() {
  var canvasEl = document.createElement('canvas');
  canvasEl.setAttribute = ('id', 'productChart');
  chartContainer.style.width = '500px';
  chartContainer.style.height = '500px';
  chartContainer.appendChild(canvasEl);

  var buttonEl = document.createElement('a');
  buttonEl.textContent = 'Chart';
  buttonEl.setAttribute('class', 'btn');
  buttonEl.href = '#chartContainer';
  buttonLinks.appendChild(buttonEl);

  var ctx = canvasEl.getContext('2d');
  var votes = [];
  var names = [];
  for(var i = 0; i < Product.allProducts.length; i++) {
    votes[i] = Product.allProducts[i].clicks;
    names[i] = Product.allProducts[i].name;
  }

  new Chart(ctx, {
    type: 'bar',
    data: {
      labels: names,
      datasets: [{
        data: votes,
        label: 'Votes',
        borderWidth: 2
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      title: {
        display: true,
        text: 'Votes Per Product',
        fontSize: 50
      },
      scales: {
        yAxes: [{
          ticks: {
            beginAtZero: true,
            stepSize: 1
          }
        }]
      }
    }
  });
}

function checkStorage () {
  if(localStorage.setProducts) {
    var stringifyProducts = localStorage.getItem('setProducts');
    Product.allProducts = JSON.parse(stringifyProducts);
  } else {
    instantiateProducts();
  }
}

var handleClick = function(event) {
  if (event.target === productContainer) {
    return alert('click on an image, please');
  }
  totalClicks++;
  var clickedProduct = event.target;
  var id = clickedProduct.id;
  if (id === 'left') {
    leftProduct.clicks++;
  }
  if (id === 'center') {
    middleProduct.clicks++;
  }
  if (id === 'right') {
    rightProduct.clicks++;
  }

  if(totalClicks === 25) {
    productContainer.removeEventListener('click', handleClick);
    renderStats();
    renderChart();
    localStorage.setItem('setProducts', JSON.stringify(Product.allProducts));
  }
  displayProducts();
};

checkStorage();
displayProducts();

productContainer.addEventListener('click', handleClick);
