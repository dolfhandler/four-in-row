const FPS = 60,
		MILISECONDS_IN_A_SECONDS = 1000
		TILE_WIDTH = 75,
		TILE_HEIGHT = 75;
		
const X_CORNER_TOP_LEFT = 0,
	Y_CORNER_TOP_LEFT = 0,
	
	X_TOP_CENTER = TILE_WIDTH * 1,
	Y_TOP_CENTER = 0,
	
	X_CORNER_TOP_RIGHT = TILE_WIDTH * 2,
	Y_CORNER_TOP_RIGHT = 0,
	
	X_LEFT_CENTER = 0,
	Y_LEFT_CENTER = TILE_HEIGHT * 1,
	
	X_CENTER_CENTER = TILE_WIDTH * 1,
	Y_CENTER_CENTER = TILE_HEIGHT * 1
	
	X_RIGHT_CENTER = TILE_WIDTH * 2,
	Y_RIGHT_CENTER = TILE_HEIGHT * 1
	
	X_CORNER_BOTTOM_LEFT = 0,
	Y_CORNER_BOTTOM_LEFT = TILE_HEIGHT * 2,
	
	X_BOTTOM_CENTER = TILE_WIDTH * 1,
	Y_BOTTOM_CENTER = TILE_HEIGHT * 2,
	
	X_CORNER_BOTTOM_RIGHT = TILE_WIDTH * 2,
	Y_CORNER_BOTTOM_RIGHT = TILE_HEIGHT * 2,
	
	X_BACK_STAGE = TILE_WIDTH * 5,
	Y_BACK_STAGE = 0
	
	X_RED_CHIP = TILE_WIDTH * 4,
	Y_RED_CHIP = 0,
	
	X_YELLOW_CHIP = TILE_WIDTH * 3,
	Y_YELLOW_CHIP = 0
	
	X_RED_CHIP_WIN = TILE_WIDTH * 5,
	Y_RED_CHIP_WIN = TILE_HEIGHT * 2,
	
	X_YELLOW_CHIP_WIN = TILE_WIDTH * 5,
	Y_YELLOW_CHIP_WIN = TILE_HEIGHT * 1;
		
var tileMap = new Image();
tileMap.src = 'image/tileMap.png';

var finish = 0;
var canvas = document.querySelector('#canvas');
var ctx = canvas.getContext('2d');
var turn = 0;
var rowEmpty = [0,0,0,0,0,0,0];
var fourInRow = [0,0,0,0];
var fourInLine = [];
var chipWinnerCollection = [];
var chipMovedX = 0, chipMovedY = 0;
var board = [
	[0,0,0,0,0,0,0],
	[0,0,0,0,0,0,0],
	[0,0,0,0,0,0,0],
	[0,0,0,0,0,0,0],
	[0,0,0,0,0,0,0],
	[0,0,0,0,0,0,0],
	[1,1,1,1,1,1,1],
];
var WIDTH_LIMIT = board[0].length - 1,
	HEIGHT_LIMIT = board.length - 2;
	
var soundChipHit = new Howl({
	src: ['sound/chipHit2.wav'],
	loop: false
});

var soudWinner = new Howl({
	src: ['sound/winner.wav'],
	loop: false
});

/**
 * Botones
 */
var btnStartGame = document.querySelector('#btnStartGame');
var txtLabel = document.querySelector('#txtLabel');


document.addEventListener('DOMContentLoaded', mainLoop);
canvas.addEventListener('click', handlerClickEvent);
canvas.addEventListener('mousemove', handlerMouseMoveCanvas);
btnStartGame.addEventListener('click', handlerClickBtnStartGame);

function mainLoop() {
	update();
	draw();
	requestAnimationFrame(mainLoop);
}

function handlerClickEvent(e) {
	if(!(
		(e.offsetX > TILE_WIDTH && e.offsetX < TILE_WIDTH * (board[0].length + 1)) && 
		(e.offsetY >= 0 && e.offsetY <= TILE_WIDTH))
	) return;
	if(finish == 1) return;
	
	let chip = new Chip();
	chip.isInsideBound(e.offsetX, e.offsetY);
	soundChipHit.play();
	chips.add(chip);
	turn++;
}

function handlerMouseMoveCanvas(e) {
	if(!(
		(e.offsetX > TILE_WIDTH && e.offsetX < TILE_WIDTH * (board[0].length + 1)) && 
		(e.offsetY >= 0 && e.offsetY <= TILE_WIDTH))
	) return;
	
	chipMovedX = e.offsetX, chipMovedY = e.offsetY;
}

function handlerClickBtnStartGame() {
	restartGame();
}

function update() {
	updateChipWinner();
}

function draw() {
	console.log("running...");
	clearCanvas();
	chips.clear();
	stage.drawBackStage();
	drawChipMoved();
	stage.draw();
	chips.draw();
	chips.goDown();
	stage.drawFrontStage();
	drawChipWinner();
	animation.draw();
}

function clearCanvas() {
	ctx.clearRect(0, 0, canvas.width, canvas.height);
}

var Stage = function() {
	this.drawFrontStage = function() {
		for(let y = 0; y < board.length; y++) {
			for(let x = 0; x < board[y].length; x++) {
				if(board[y][x] == 1) break;
					
				if(x == 0 && y == 0)
					ctx.drawImage(
						tileMap, X_CORNER_TOP_LEFT, Y_CORNER_TOP_LEFT, TILE_WIDTH, TILE_HEIGHT, 
						(x + 1) * TILE_WIDTH, (y + 1) * TILE_HEIGHT, TILE_WIDTH, TILE_HEIGHT
					);
				
				if((x > 0  && y == 0) && x < WIDTH_LIMIT)
					ctx.drawImage(
						tileMap, X_TOP_CENTER, Y_TOP_CENTER, TILE_WIDTH, TILE_HEIGHT,
						(x + 1) * TILE_WIDTH, (y + 1) * TILE_HEIGHT, TILE_WIDTH, TILE_HEIGHT
					);
				
				if(y == 0 && x == WIDTH_LIMIT)
					ctx.drawImage(
						tileMap, X_CORNER_TOP_RIGHT, Y_CORNER_TOP_RIGHT, TILE_WIDTH, TILE_HEIGHT,
						(x + 1) * TILE_WIDTH, (y + 1) * TILE_HEIGHT, TILE_WIDTH, TILE_HEIGHT
					);
				
				if((y > 0  && y < HEIGHT_LIMIT) && x == 0)
					ctx.drawImage(
						tileMap, X_LEFT_CENTER, Y_LEFT_CENTER, TILE_WIDTH, TILE_HEIGHT,
						(x + 1) * TILE_WIDTH, (y + 1) * TILE_HEIGHT, TILE_WIDTH, TILE_HEIGHT
					);
				
				if((x > 0  && x < WIDTH_LIMIT) && (y > 0 && y < HEIGHT_LIMIT))
					ctx.drawImage(
						tileMap, X_CENTER_CENTER, Y_CENTER_CENTER, TILE_WIDTH, TILE_HEIGHT,
						(x + 1) * TILE_WIDTH, (y + 1) * TILE_HEIGHT, TILE_WIDTH, TILE_HEIGHT
					);
				
				if((y > 0  && y < HEIGHT_LIMIT) && x == WIDTH_LIMIT)
					ctx.drawImage(
						tileMap, X_RIGHT_CENTER, Y_RIGHT_CENTER, TILE_WIDTH, TILE_HEIGHT,
						(x + 1) * TILE_WIDTH, (y + 1) * TILE_HEIGHT, TILE_WIDTH, TILE_HEIGHT
					);
					
				if(x == 0 && y == HEIGHT_LIMIT)
					ctx.drawImage(
						tileMap, X_CORNER_BOTTOM_LEFT, Y_CORNER_BOTTOM_LEFT, TILE_WIDTH, 
						TILE_HEIGHT, (x + 1) * TILE_WIDTH, (y + 1) * TILE_HEIGHT, TILE_WIDTH, TILE_HEIGHT
					);
				
				if((x > 0  && x < WIDTH_LIMIT) && y == HEIGHT_LIMIT)
					ctx.drawImage(
						tileMap, X_BOTTOM_CENTER, Y_BOTTOM_CENTER, TILE_WIDTH, TILE_HEIGHT,
						(x + 1) * TILE_WIDTH, (y + 1) * TILE_HEIGHT, TILE_WIDTH, TILE_HEIGHT
					);
				
				if(y == HEIGHT_LIMIT && x == WIDTH_LIMIT)
					ctx.drawImage(
						tileMap, X_CORNER_BOTTOM_RIGHT, Y_CORNER_BOTTOM_RIGHT, TILE_WIDTH, TILE_HEIGHT,
						(x + 1) * TILE_WIDTH, (y + 1) * TILE_HEIGHT, TILE_WIDTH, TILE_HEIGHT
					);
			}
		}
	}
	
	this.drawBackStage = function() {
		for(let y = 0; y < board.length; y++) {
			for(let x = 0; x < board[y].length; x++) {
				if(board[y][x] == 1) continue;
				
				ctx.drawImage(
					tileMap, X_BACK_STAGE, Y_BACK_STAGE, TILE_WIDTH, TILE_HEIGHT,
					(x + 1) * TILE_WIDTH, (y + 1) * TILE_HEIGHT, TILE_WIDTH, TILE_HEIGHT
				);
			}
		}
	}
	
	this.draw = function() {
		for(let y = 0; y < board.length; y++) {
			for(let x = 0; x < board[y].length && board[y][x] != 1; x++) {
					
				if(board[y][x] == 2) 
					ctx.drawImage(
						tileMap, X_YELLOW_CHIP, Y_YELLOW_CHIP, TILE_WIDTH, TILE_HEIGHT,
						(x + 1) * TILE_WIDTH, (y + 1) * TILE_HEIGHT, TILE_WIDTH, TILE_HEIGHT
					);
				if(board[y][x] == 3)
					ctx.drawImage(
						tileMap, X_RED_CHIP, Y_RED_CHIP, TILE_WIDTH, TILE_HEIGHT,
						(x + 1) * TILE_WIDTH, (y + 1) * TILE_HEIGHT, TILE_WIDTH, TILE_HEIGHT
					);
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
	
	this.isInsideBound = function(ex, ey) {
		for(let i = 0; i < board.length + 1; i++) {
			for(let j = 0; j < board[0].length + 1; j++) {
				if(board[i][j] != 1){
					if(
						ex > j * TILE_WIDTH &&
						ey > i * TILE_HEIGHT &&
						ex < TILE_WIDTH * (j + 1) &&
						ey < TILE_HEIGHT * (i + 1)
					) {
						this.x = j - 1;
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
		
		if(turn % 2 == 0)
			ctx.drawImage(
				tileMap, X_YELLOW_CHIP, Y_YELLOW_CHIP, TILE_WIDTH, TILE_HEIGHT,
				(this.x + 1) * TILE_WIDTH, (this.y + 1) * TILE_HEIGHT, TILE_WIDTH, TILE_HEIGHT
			);
		else
			ctx.drawImage(
				tileMap, X_RED_CHIP, Y_RED_CHIP, TILE_WIDTH, TILE_HEIGHT,
				(this.x + 1) * TILE_WIDTH, (this.y + 1) * TILE_HEIGHT, TILE_WIDTH, TILE_HEIGHT
			);
	}
	
	this.isHitting = function() {
		if(board[this.y + 1][this.x] != 0) {
			board[this.y][this.x] = turn % 2 == 0 ? 2 : 3;
			this.isHit = true;
			
			this.validateWinner(this.x, this.y);
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
	
	this.validateWinner = function(x, y) {
		fourInLine = [];
		let pivot = board[y][x];
		if(this.validateHorizontal(pivot, x, y)) {
			console.log("GANASTE EN HORIZONTAL!!!!!");
			console.log(fourInLine);
			fillChipWinnerCollection(pivot);
			return;
		}
		
		fourInLine = [];
		if(this.validateDiagonalRight(pivot, x, y)) {
			console.log("GANASTE EN DIAGONAL DERECHA!!!!!");
			console.log(fourInLine);
			fillChipWinnerCollection(pivot);
			return;
		}
		
		fourInLine = [];
		if(this.validateDiagonalLeft(pivot, x, y)) {
			console.log("GANASTE EN DIAGONAL IZQUIERDA!!!!!");
			console.log(fourInLine);
			fillChipWinnerCollection(pivot);
			return;
		}
		
		fourInLine = [];
		if(this.validateVertical(pivot, x, y)) {
			console.log("GANASTE EN VERTICAL!!!!!");
			console.log(fourInLine);
			fillChipWinnerCollection(pivot);
			return;
		}
	}
	
	this.validateHorizontal = function(chip, x, y) {
		let saveX = x, saveY = y;
		let base = fourInRow.map(x => chip);
		let horizontal = [];
		
		for(let i = 0; i < 4 && (x < board[0].length); i++) {
			if(board[y][x] != chip) break;
			
			fourInLine.push({x: x, y: y});
			horizontal.splice(i,0, board[y][x]);
			x++;
		}
		x = saveX-1;
		for(let i = 0; i < 4 && (x >= 0); i++) {
			if(board[y][x] != chip) break;
			
			fourInLine.push({x: x, y: y});
			horizontal.splice(i,0, board[y][x]);
			x--;
		}
		
		return findSubArrayInArray(horizontal, base);
	}
	
	this.validateVertical = function(chip, x, y) {
		let base = fourInRow.map(fir => chip);
		let vertical = [];
		
		for(let i = 0; i < 4 && (y < WIDTH_LIMIT); i++) {
			fourInLine.push({x: x, y: y});
			vertical.splice(i,0, board[y][x]);
			y++;
		}
		
		return findSubArrayInArray(vertical, base);
	}
	
	this.validateDiagonalRight = function(chip, x, y) {
		let base = fourInRow.map(a => chip);
		let diagonalRight = [];
		
		for(let i = 0; i < 4 && (x < board[0].length && y < board.length - 1); i++) {
			fourInLine.push({x: x, y: y});
			diagonalRight.splice(i,0, board[y][x]);
			x++; y++;
		}
		
		return findSubArrayInArray(diagonalRight, base);
	}
		
	this.validateDiagonalLeft = function(chip, x, y) {
		let base = fourInRow.map(a => chip);
		let diagonalLeft = [];
		
		//board.length - 1: Se le resta uno para que no tenga en cuenta
		//la fila de tope 
		for(let i = 0; i < 4 && (x >= 0 && y < board.length - 1); i++) {
			fourInLine.push({x: x, y: y});
			diagonalLeft.splice(i,0, board[y][x]);
			x--; y++;
		}
				
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

var ChipWinner = function(x, y, chip) {
	this.chip = chip;
	this.x = x;
	this.y = y;
	
	this.drawChipIlumination = function() {
		if(this.chip == 2)
			ctx.drawImage(
				tileMap, X_YELLOW_CHIP_WIN, Y_YELLOW_CHIP_WIN, TILE_WIDTH, TILE_HEIGHT,
				(this.x + 1) * TILE_WIDTH, (this.y + 1) * TILE_HEIGHT, TILE_WIDTH, TILE_HEIGHT
			);
		else
			ctx.drawImage(
				tileMap, X_RED_CHIP_WIN, Y_RED_CHIP_WIN, TILE_WIDTH, TILE_HEIGHT,
				(this.x + 1) * TILE_WIDTH, (this.y + 1) * TILE_HEIGHT, TILE_WIDTH, TILE_HEIGHT
			);
	}
	
}

var Animation = function(x, y, chip) {
	this.chip = chip;
	this.x = x,
	this.y = y;
	this.index = 0;
	this.count = 0;
	this.delay = 10;
	this.step = 0;
	this.frames = 3;
	this.flag = 0;
	
	this.draw = function() {
		if(this.chip == 2)
			ctx.drawImage(
				tileMap, TILE_WIDTH * (this.step + 3), Y_YELLOW_CHIP_WIN, TILE_WIDTH, TILE_HEIGHT,
				(this.x + 1) * TILE_WIDTH, (this.y + 1) * TILE_HEIGHT, TILE_WIDTH, TILE_HEIGHT
			);
		else
			ctx.drawImage(
				tileMap, TILE_WIDTH * (this.step + 3), Y_RED_CHIP_WIN, TILE_WIDTH, TILE_HEIGHT,
				(this.x + 1) * TILE_WIDTH, (this.y + 1) * TILE_HEIGHT, TILE_WIDTH, TILE_HEIGHT
			);
	}
	
	this.update = function() {
		if(this.count < this.delay) {
			this.count++;
		} else {
			this.count = 0;
			this.nextStep();
		}
	}
	
	this.nextStep = function() {
		if(this.flag == 0) {
			if(this.step < this.frames-1) {
				this.step++;
			} else {
				this.step = 0;
				this.flag = 1;
			}
		} else {
			if(this.step > 1) {
				this.step--;
			} else {
				this.flag = 0;
			}
		}
	}
}

var animation = new Animation();
var stage = new Stage();
var chips = new ChipCollection();

function fillChipWinnerCollection(chipWinner) {
	soudWinner.play();
	finish = 1;
	chipWinnerCollection = fourInLine.map(
		position => new Animation(position.x, position.y, chipWinner)
	);
}

function drawChipWinner() {
	for(let chipWinner of chipWinnerCollection) {
		chipWinner.draw();
	}
}

function updateChipWinner() {
	for(let chipWinner of chipWinnerCollection) {
		chipWinner.update();
	}
}

//UTILITIES
function findSubArrayInArray(array, subArray) {
	return (array.toString()).indexOf(subArray.toString()) > -1;
}

function restartGame() {
	finish = 0;
    canvas = document.querySelector('#canvas');
    ctx = canvas.getContext('2d');
    turn = 0;
    rowEmpty = [0,0,0,0,0,0,0];
    fourInRow = [0,0,0,0];
    fourInLine = [];
    chipWinnerCollection = [];
	chipMovedX = 0;
	chipMovedY = 0;
	board = [
		[0,0,0,0,0,0,0],
		[0,0,0,0,0,0,0],
		[0,0,0,0,0,0,0],
		[0,0,0,0,0,0,0],
		[0,0,0,0,0,0,0],
		[0,0,0,0,0,0,0],
		[1,1,1,1,1,1,1],
	];
	stage = new Stage();
	chips = new ChipCollection();
	mainLoop();
}

function getXYTransformation(ex, ey) {
	for(let i = 0; i < board.length+1; i++) {
		for(let j = 0; j < board[0].length+1; j++) {
			if(board[i][j] != 1){
				if(
					ex > j * TILE_WIDTH &&
					ey > i * TILE_HEIGHT &&
					ex < TILE_WIDTH * (j+1) &&
					ey < TILE_HEIGHT * (i+1)
				) {
					return {x: j-1, y: i};
				}
			}
		}
	}
	return {x: 0, y: 0};
}

function drawChipMoved() {
	if(!(
		(chipMovedX > 75 && chipMovedX < 75 * 8) && 
		(chipMovedY >= 0 && chipMovedY <= 75)) || 
		finish == 1) return;
	
	if(turn % 2 != 0) 
		ctx.drawImage(
			tileMap, X_YELLOW_CHIP, Y_YELLOW_CHIP, TILE_WIDTH, TILE_HEIGHT,
			chipMovedX - 37, chipMovedY, TILE_WIDTH, TILE_HEIGHT
		);
	else
		ctx.drawImage(
			tileMap, X_RED_CHIP, Y_RED_CHIP, TILE_WIDTH, TILE_HEIGHT,
			chipMovedX - 37, chipMovedY, TILE_WIDTH, TILE_HEIGHT
		);
}








