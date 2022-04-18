const WIDTH = 800,
		HEIGHT = 600,
		FPS = 60,
		SHIP_WINNER = 4;
		MILISECONDS_IN_A_SECONDS = 1000
		TILE_WIDTH = 75,
		TILE_HEIGHT = 75;
var img0 = new Image();
var img1 = new Image();
var img2 = new Image();
var img3 = new Image();
img0.src = 'image/central-space-back.png'; 
img1.src = 'image/ship1.png'; 
img2.src = 'image/ship2.png'; 
img3.src = 'image/central-space.png'; 

var canvas = document.querySelector('#canvas');
var ctx = canvas.getContext('2d');
var turn = 0;
var rowEmpty = [0,0,0,0,0,0,0,0,0];
var fourInRow = [0,0,0,0];
	
var board = [
	[0,0,0,0,0,0,0,0,0],
	[0,0,0,0,0,0,0,0,0],
	[0,0,0,0,0,0,0,0,0],
	[0,0,0,0,0,0,0,0,0],
	[0,0,0,0,0,0,0,0,0],
	[0,0,0,0,0,0,0,0,0],
	[0,0,0,0,0,0,0,0,0],
	[0,0,0,0,0,0,0,0,0],
	[1,1,1,1,1,1,1,1,1],
];

document.addEventListener('DOMContentLoaded', handlerDomContentLoadedEvent);
canvas.addEventListener('click', handlerClickEvent);

function handlerDomContentLoadedEvent() {
	setInterval(mainLoop, MILISECONDS_IN_A_SECONDS/FPS);
}

function handlerClickEvent(e) {
	let chip = new Chip();
	chip.isInsideBound(e.x, e.y);
	chips.add(chip);
	turn++;
}

function mainLoop() {
	clearCanvas();
	stage.drawBackStage();
	chips.clear();
	stage.draw();
	chips.draw();
	chips.goDown();
	stage.drawFrontStage();
}

function clearCanvas() {
	canvas.style.width = WIDTH;
	canvas.style.height = HEIGHT;
	ctx.clearRect(0, 0, canvas.width, canvas.height);
}

var Stage = function() {
	this.drawFrontStage = function() {
		for(let y = 0; y < board.length; y++) {
			for(let x = 0; x < board[y].length; x++) {
				ctx.drawImage(img3, (x+1) * TILE_WIDTH, (y+1) * TILE_HEIGHT);
			}
		}
	}
	
	this.drawBackStage = function() {
		for(let y = 0; y < board.length; y++) {
			for(let x = 0; x < board[y].length; x++) {
				ctx.drawImage(img0, (x+1) * TILE_WIDTH, (y+1) * TILE_HEIGHT);
			}
		}
	}
	
	this.draw = function() {
		for(let y = 0; y < board.length; y++) {
			for(let x = 0; x < board[y].length; x++) {
				let color = '#0f0';
				if(board[y][x] == 1) {
					color = '#00f';
				} else if(board[y][x] == 2) {
					ctx.drawImage(img1, x * TILE_WIDTH, y * TILE_HEIGHT);
				} else if(board[y][x] == 3) {
					ctx.drawImage(img2, x * TILE_WIDTH, y * TILE_HEIGHT);
				} else {
					
				}
			}
		}			
	}
}

var Chip = function() {
	this.x = 0;
	this.y = 0;
	this.frame = 0;
	this.delay = 2;
	this.isPosibleDraw = false;
	this.isHit = false;
	this.image = img1;
	
	this.isInsideBound = function(ex, ey) {
		for(let i = 0; i < board.length; i++) {
			for(let j = 0; j < board[i].length; j++) {
				if(board[i][j] != 1){
					if(
						ex > j * TILE_WIDTH &&
						ey > i * TILE_HEIGHT &&
						ex < TILE_WIDTH * (j + 1) &&
						ey < TILE_HEIGHT * (i + 1)
					) {
						this.x = j;
						this.y = i;
						this.isPosibleDraw = true;
						return true;
					}
				}
			}
		}
		return false;
	}
	
	this.draw = function(){
		if(!this.isPosibleDraw)
			return;
		
		this.image = turn % 2 == 0 ? img1 : img2;
		ctx.drawImage(this.image, this.x * TILE_WIDTH, this.y * TILE_HEIGHT);
		/*ctx.fillRect(
			this.x * TILE_WIDTH,
			this.y * TILE_HEIGHT,
			TILE_WIDTH, 
			TILE_HEIGHT
		);*/
	}
	
	this.isHitting = function() {
		if(board[this.y + 1][this.x] != 0) {
			board[this.y][this.x] = turn % 2 == 0 ? 2 : 3;
			this.isHit = true;
			
			this.validateWinner();
		}
	}
	
	this.goDown = function() {
		if(this.isHitting()) {
			return;
		}
		
		if(this.frame < this.delay){
			this.frame++;
		} else {
			this.frame = 0;
			this.y++;
		}
	}
	
	this.validateWinner = function() {
		for(let y = 0; y < board.length - 1; y++) {
			//if(board[y] == rowEmpty) continue;
			
			for(let x = 0; x < board[y].length; x++) {
				if(board[y][x] != 0) {
					let pivot = board[y][x];
					if(this.validateHorizontal(pivot, y)) {
						console.log("GANASTE EN HORIZONTAL!!!!!");
						return;
					}
					
					if(this.validateDiagonalRight(pivot, x, y)) {
						console.log("GANASTE EN DIAGONAL DERECHA!!!!!");
						return;
					}
					
					if(this.validateDiagonalLeft(pivot, x, y)) {
						console.log("GANASTE EN DIAGONAL IZQUIERDA!!!!!");
						return;
					}
					
					if(this.validateVertical(pivot, x)) {
						console.log("GANASTE EN VERTICAL!!!!!");
						return;
					}
				}
			}
		}
	}
	
	this.validateHorizontal = function(ship, y) {
		let base = fourInRow.map(x => ship);
		return findSubArrayInArray(board[y], base);
	}
	
	this.validateVertical = function(ship, x) {
		let base = fourInRow.map(fir => ship);
		let vertical = [];
		for(let y = 0; y < board[0].length - 1; y++) {
			vertical.push(board[y][x]);
		}
		return findSubArrayInArray(vertical, base);
	}
	
	this.validateDiagonalRight = function(ship, x, y) {
		let base = fourInRow.map(a => ship);
		let diagonalRight = [];
		
		do {
			diagonalRight.splice(x,0, board[y][x]);
			x--; y--;
		} while(x > 0 && y > 0);
		do {
			diagonalRight.splice(x,0, board[y][x]);
			x++; y++;
		} while(y < board.length-2 && x < board[0].length);
		
		return findSubArrayInArray(diagonalRight, base);
	}
		
	this.validateDiagonalLeft = function(ship, x, y) {
		let base = fourInRow.map(a => ship);
		let diagonalLeft = [];
		
		do {
			diagonalLeft.splice(x,0, board[y][x]);
			x++; y--;
		} while(x < board[0].length && y > 0);
		do {
			diagonalLeft.splice(x,0, board[y][x]);
			x--; y++;
		} while(x > 0 && y < board.length-1);
		
		return findSubArrayInArray(diagonalLeft, base);
	}
}

var ChipCollection = function() {
	this.chips = [];
	
	this.add = function(chip) {
		this.chips.push(chip);
	}
	
	this.draw = function() {
		for(let chip of this.chips) {
			chip.draw();
		}
	}
	
	this.goDown = function() {
		for(let chip of this.chips) {
			chip.goDown();
		}
	}
	
	this.clear = function() {
		this.chips = this.chips.filter(chip => !chip.isHit);
	}
}

var stage = new Stage();
var chips = new ChipCollection();










//UTILITIES
function findSubArrayInArray(array, subArray) {
	return (array.toString()).indexOf(subArray.toString()) > -1;
}












