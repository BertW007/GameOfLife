function GameOfLife(boardWidth, boardHeight, cellSize) {
  this.patterns = new Patterns(this);
  this.patterns.set('rpentomino','011/110/010');
  this.patterns.set('acorn','0100000/0001000/1100111');
  this.patterns.set('switchengine','010100/100000/010010/000111');
  this.patterns.set('7468m','000010/000011/110110/100000');
  this.patterns.set('multuminparvo','000111/001001/010000/100000');

  this.defaultSettings = function() {
    return {
      width: 100,
      height: 100,
      cellSize: 5,
      startingPattern: 'rpentomino',
      genColor: 0,
      speed: 150,
      randomColors: false
    }
  }
  this.width = this.defaultSettings().width;
  this.height = this.defaultSettings().height;
  this.cellSize = this.defaultSettings().cellSize;
  this.speed = this.defaultSettings().speed;
  this.cells = [];
  this.buffer = [];
  this.startingPattern = null;
  this.intervalId = null;
  this.board = document.createElement('section'); //document.querySelector('#board');
  this.board.setAttribute("id", "board");

  this.renderControls = function() {
    var game = this;
  /* BUTTONS*/
    var play = document.querySelector('#play');
    var pause = document.querySelector('#pause');
    var reset = document.querySelector('#reset');
    var advenced = document.querySelector('#advenced');
    var options = document.querySelector('#options');
    var save = document.querySelector('#save');
    var reset = document.querySelector('#reset');

    /* GAME SETTINGS*/
    advenced.addEventListener('click', function() {
      if(options.classList.contains('visible')) {
        options.classList.remove('visible');
        options.classList.add('hidden');
        options.classList.remove('animate');
      } else {
        options.classList.add('visible');
        options.classList.add('animate');
        options.classList.remove('hidden');
      }
    });

    /* RESET GAME*/
    reset.addEventListener('click', function(){
      pause.disabled = false;
      play.disabled = false;
      clearInterval(game.intervalId);
      game.buffer = [];
      game.resetBoard();
    });
    /* PLAY GAME*/
    play.addEventListener('click', function(){
      this.disabled = true;
      pause.disabled = false;
      game.intervalId = setInterval(function(){
        game.printNextGeneration((game.buffer.length > 0)? game.buffer: game.computeNextGeneration());
        game.buffer = [];
      },game.speed);
    });
    /* PAUSE GAME*/
    pause.addEventListener('click', function() {
      clearInterval(game.intervalId);
      game.buffer = [];
      this.disabled = true;
      play.disabled = false;
      game.buffer = game.computeNextGeneration();
    });
  }

  this.renderSettings = function() {

    var boardSettings = document.querySelectorAll('#board-settings input');
    this.width = parseInt(boardSettings[0].value > 100 && boardSettings[0].value <= 800? boardSettings[0].value: this.defaultSettings().width);
    this.height = parseInt(boardSettings[1].value > 100 && boardSettings[1].value <= 800? boardSettings[1].value: this.defaultSettings().height);
    this.cellSize = parseInt(boardSettings[2].value > 5 && boardSettings[2].value <= 50? boardSettings[2].value: this.defaultSettings().cellSize);
    this.speed = parseInt(boardSettings[3].value > 0? boardSettings[3].value*50: this.defaultSettings().speed);

    var cellsColor = document.querySelectorAll('#cells-color input[type=text]');
    var color = 'rgba('
    for (var i = 0; i < cellsColor.length; i++) {
      var value = parseInt(cellsColor[i].value);
      if(value > 0 && value <= 255) {
        color += value+',';
      } else {
        color += this.defaultSettings().genColor+',';
      }
    }
    color += '1)';
    this.genColor = color;
  }

  this.resetBoard = function() {
    var loader = document.querySelector('#loading-screen');
    var options = document.querySelector('#options');

    if(options.classList.contains('visible')) {
      options.classList.remove('visible');
      options.classList.add('hidden');
      options.classList.remove('animate');
    }

    this.board.parentElement.removeChild(this.board);
    loader.classList.remove('hidden');
    loader.classList.add('visible');

    var newBoard = document.createElement('section');
    newBoard.setAttribute('id', 'board');
    this.board = newBoard;

    this.renderSettings();
    this.createBoard();
    this.drawPattern();

    var parent = document.querySelector('.container');
    var self = this;
    setTimeout(function(){
      loader.classList.add('hidden');
      parent.appendChild(self.board);
      }, 1000);
  }

  this.getByPosition = function(x,y) {
    return this.cells[x+(y*this.width)];
  }

  this.computeCellNextState = function(x,y){
    var count = 0;
    var currentCell = this.getByPosition(x,y);
    ((this.getByPosition(x, (y-1 >= 0) ? y-1 : this.height-1)).classList.contains('live')? 1:0)? count++: false;
    ((this.getByPosition(x, (y+1 <= this.height-1) ? y+1 : 0)).classList.contains('live')? 1:0)? count++: false;
    ((this.getByPosition((x-1 >= 0) ? x-1 : this.width - 1, y)).classList.contains('live')? 1:0)? count++: false;
    ((this.getByPosition((x+1 <= this.width-1) ? x+1 : 0, y)).classList.contains('live')? 1:0)? count++: false;
    ((this.getByPosition((x-1 >= 0) ? x-1 : this.width - 1, (y+1 <= this.height-1) ? y+1 : 0)).classList.contains('live')? 1:0)? count++: false;
    ((this.getByPosition((x+1 <= this.width-1) ? x+1 : 0, (y+1 <= this.height-1) ? y+1 : 0)).classList.contains('live')? 1:0)? count++: false;
    ((this.getByPosition((x-1 >= 0) ? x-1 : this.width - 1, (y-1 >= 0) ? y-1 : this.height-1)).classList.contains('live')? 1:0)? count++: false;
    ((this.getByPosition((x+1 <= this.width-1) ? x+1 : 0, (y-1 >= 0) ? y-1 : this.height-1)).classList.contains('live')? 1:0)? count++: false;

    if(currentCell.classList.contains('live')) {
      if (count < 2 || count > 3) {
        return 0;
      } else if (count === 2 || count === 3) {
        return 1;
      }
    } else {
      if (count === 3) {
        return 1;
      } else {
        return 0;
      }
    }
  }

  this.setCellState = function(cell,state,genColor) {
    if(cell.classList.contains('live')) {
      if(state != 1) {
        cell.classList.remove('live');
        cell.style.backgroundColor = "#ffffff";
      }
    } else {
      if(state == 1) {
        cell.classList.add('live');
        cell.style.backgroundColor = genColor? genColor: "#000000";
      }
    }
  }

  this.computeNextGeneration = function() {
    var nextGeneration = [];
    for (var i = 0; i < this.height; i++) {
      nextGeneration[i] = [];
      for (var j = 0; j < this.width; j++) {
        nextGeneration[i][j] = this.computeCellNextState(j,i);
      }
    }
    return nextGeneration;
  }

  this.printNextGeneration = function(nextGeneration) {
    var genColor = '';
    var random = document.querySelector('#cells-color input[type=checkbox]').checked;
    if(random) {
      var min = 0;
      var max = 255;
      var r = Math.floor(Math.random() * (max - min + 1)) + min;
      var g = Math.floor(Math.random() * (max - min + 1)) + min;
      var b = Math.floor(Math.random() * (max - min + 1)) + min;
      genColor = 'rgba('+r+','+g+','+b+',1)';
    } else {
      genColor = this.genColor;
    }

    for (var i = 0; i < nextGeneration.length; i++) {
      for (var j = 0; j < nextGeneration[i].length; j++) {
        this.setCellState(this.cells[i*nextGeneration[i].length+j], nextGeneration[i][j],genColor);
      }
    }
  }

  this.drawPattern = function() {
    var startingPatterns = document.querySelectorAll('#starting-patterns input');
    for (var i = 0; i < startingPatterns.length; i++) {
      if (startingPatterns[i].checked) {
        if(startingPatterns[i].dataset.type != 'none') {
          this.startingPattern = this.patterns.get(startingPatterns[i].dataset.type);
          for (var i = 0; i < this.startingPattern.length; i++) {
            this.setCellState(this.startingPattern[i],1);
            this.startingPattern[i].style.backgroundColor = this.genColor;
          }
        } else {
          this.startingPattern = null;
        }
      }
    }
  }

  this.createBoard = function() {
    var game = this;
    /* BOARD*/
    var width = this.width * this.cellSize;
    var height = this.height * this.cellSize;
    var cell = document.createElement('div');

    this.board.style.width = width + 'px';
    this.board.style.height = height + 'px';
    cell.style.width = this.cellSize + 'px';
    cell.style.height = this.cellSize +'px';

    for(var i = 0; i < (parseInt(width/this.cellSize) * parseInt(height/this.cellSize)); i++) {
        this.board.appendChild(cell.cloneNode(true));
    }

    this.cells = Array.from(this.board.querySelectorAll('div'));

    for (var i = 0; i < this.cells.length; i++) {
      this.cells[i].addEventListener('click', function(){
        if(this.classList.contains('live')) {
          game.setCellState(this, 0);
        } else {
          game.setCellState(this, 1);
        }
      });
    }
  }

this.renderControls();
this.renderSettings();
this.createBoard();
this.drawPattern();

var board = document.querySelector('#board');
var loader = document.querySelector('#loading-screen');
var self = this;
setTimeout(function(){
  loader.classList.remove('visible');
  loader.classList.add('hidden');
  board.parentElement.replaceChild(self.board,board);
  }, 1000);
}
/* PATTERNS LIBRARY*/
function Patterns(game) {
  this.get = function(patternName) {
    var pattern =  this[patternName].split('/');
    var startingPointX = parseInt(game.width/2);
    var startingPointY = parseInt(game.height/2);
    var model = [];
    for (var i = 0; i < pattern.length; i++) {
      for (var j = 0; j < pattern[i].length; j++) {
        if(pattern[i].charAt(j) == 1) {
          model.push(game.getByPosition(startingPointX+j, startingPointY));
        }
      }
      startingPointY++;
    }
    return model;
  }
  this.set = function(name,pattern) {
    this[name] = pattern;
  }
}
/* GAME*/
document.addEventListener('DOMContentLoaded', function(){
    console.log("Game of Life");
    var game = new GameOfLife();
});
