// reversi.js

const rev = {

	repeat: function(value, n) {

	//create the array
	const array = [];

	//use n to add the value n times
	for(let i=0; i < n; i++) {

		//push the value onto the array
		array.push(value);

	}

	return array;

	},

	generateBoard: function(rows, cols, initialCellValue) {


	//calculate the neccesary amount of spaces needed
	const space = rows * cols;

	//create the array using the previous function
	const array = rev.repeat(initialCellValue, space);

	return array;

	},

	rowColToIndex: function(board, rowNumber, columnNumber) {

		//get the dimensions of the board
		const dim = Math.sqrt(board.length);

		//now calculate the index
		const rowIndex = dim*rowNumber;

		return rowIndex + columnNumber;

	},

	indexToRowCol: function(board, i){

		//get the dimensions of the board
		const dim = Math.sqrt(board.length);

		//calculate the col and row
		const col = i % dim;

		const row = Math.floor((i-col)/dim);

		const RowCol = {

			"row":row,
			"col":col
		};

		return RowCol;
	},

	setBoardCell: function(board, letter, row, col) {

		const tempBoard = board.slice();

		const index = rev.rowColToIndex(board, row, col);

		tempBoard[index] = letter;

		return tempBoard;

	},

	algebraicToRowCol: function(algebraicNotation) {

		//create the dictionary for converting columns



		const dict = {
			'A':0,
			'B':1,
			'C':2,
			'D':3,
			'E':4,
			'F':5,
			'G':6,
			'H':7,
			'I':8,
			'J':9,
			'K':10,
			'L':11,
			'M':12,
			'N':13,
			'O':14,
			'P':15,
			'Q':16,
			'R':17,
			'S':18,
			'T':19,
			'U':20,
			'V':21,
			'W':22,
			'X':23,
			'Y':24,
			'Z':25,
		};

		//check to see if the input is valid
		if (algebraicNotation.length !== 2){
			return undefined;
		}

		else if (!(algebraicNotation[0].match(/[A-Z]/))){
			return undefined;
		}

		else if(!(algebraicNotation[1].match(/\d/))){
			return undefined;
		}

		else {

			//create the response using the dictionary
			const col = dict[algebraicNotation[0]];
			const row = algebraicNotation[1] -1 ;

			const response = {"row":row, "col":col};

			return response; 
		} 

	},

	placeLetters: function(board, letter, ...algebraicNotation){

		const tempBoard = board.slice();

		for(let i=0; i < algebraicNotation.length; i++) {

			const rowCol = rev.algebraicToRowCol(algebraicNotation[i]);

			const index = rev.rowColToIndex(board, rowCol["row"], rowCol["col"]);

			tempBoard[index] = letter;
	}

		return tempBoard;
	},

	boardToString: function(board) {

		//get the dimensions
		const dim = Math.sqrt(board.length);

		//create a line function to generate the lines
		function lines(dim) {

			let line = "  ";

			for(let i=0; i < dim; i++){

				line += '+---';
			}

			line += '+';

			return line;
		}

		let header = "   ";

		//to count the rows we will use a counter
		let counter = 1;

		//print out the col names
		for(let i=0; i < dim; i++) {

			header += " "+String.fromCodePoint(65+i) + "  ";


		}

		console.log(header);

	


		let rowLine = "";

		//print out the middle part and the row number
		for(let i=0; i < board.length; i++) {

			

			//print out the row number
			if(i%dim===0) {
				rowLine += lines(dim) +'\n';
				rowLine += counter.toString() + ' ';
				counter += 1;	
			}

			if(board[i] === ' '){
				rowLine += '|   ';
			}

			else{
				rowLine += '| '+board[i]+' ';
			}

			if((i%dim)===(dim-1)){
				rowLine += '|\n';
			}

		}

		rowLine += lines(dim);

		console.log(rowLine);

	},

	isBoardFull: function(board){

		let full = true;

		for(let i=0; i < board.length; i++) {

			if(board[i] === ' '){
				full = false;
			}

		}

		return full;

	},

	flip: function(board, row, col) {

		//get the index so we can change the color
		const index = rev.rowColToIndex(board, row, col);


		if(board[index]==='X'){
			board[index] = 'O';
		}

		else if(board[index]==='O'){
			board[index] = 'X';
		}


		return board;

	},

	flipCells: function(board, cellsToFlip) {

	
		//loop through the cellsToFlip array
		for (const level1 of cellsToFlip) {
			for(const level2 of level1){

				//convert the row col combination to an index and flip the pieces
				board = rev.flip(board,level2[0],level2[1]);
			}
		}

		return board;

	},

	getCellsToFlip: function(board, lastRow, lastCol) {

		//figure out what was the last piece
		const index = rev.rowColToIndex(board, lastRow, lastCol);
		const lastPiece = board[index];

		const dim = Math.sqrt(board.length);


		//create the groups that will hold the potential flipped cells
		let horizontalGroup = [];
		let verticalGroup = [];
		let diagonalGroup = [];

		//need two different groups since we are going in two different direcitons everytime
		let horizontalGroup2 = [];
		let verticalGroup2 = [];
		let diagonalGroup2 = [];

		let diagonalGroup3 = [];
		let diagonalGroup4 = [];

		//get the diagonal shift dimension because dim+1= a diagonal shift
		const diagonalShift = dim + 1;

		//this is to check if you go outside the border and don't complete a line correctly
		//for example XOOO and then no X again
		let finalPiece;

		//check the horizontal-right direction
		//here you have to make sure that you dont go outside the board dimensions
		let i = index;

		while((++i <= board.length) && (rev.indexToRowCol(board, i).row === lastRow) &&
			board[i] !== lastPiece){

			const nextPiece = board[i];
			const tempArray = []; //this is so we can put it in the correct format

			if((nextPiece !== lastPiece) && (nextPiece !== ' ')) {

				const response = rev.indexToRowCol(board, i);

				tempArray.push(response.row,response.col);
				horizontalGroup.push(tempArray);
			}

			else if(nextPiece === ' '){
				horizontalGroup = [];
				break; //this is so that you dont keep looking past the blank spot
			}

			
		}

		finalPiece = board[i];


		if(finalPiece !== lastPiece){
			horizontalGroup = [];
		}






		//check the horizontal-left direction
		//here you have to make sure that you dont go into the negative
		let left = index-1;
		while((left >= 0) && (rev.indexToRowCol(board, left).row === lastRow) &&
			board[left] !== lastPiece){

			const nextPiece = board[left];
			const tempArray2 = [];

			if((nextPiece !== lastPiece) && (nextPiece !== ' ')) {

				const response2 = rev.indexToRowCol(board, left);

				tempArray2.push(response2.row,response2.col);
				horizontalGroup2.push(tempArray2);
			}

			else if(nextPiece === ' ') {
				horizontalGroup2 = [];	
				break;
			}

			left = left - 1;
		}

		finalPiece = board[left];



		if(finalPiece !== lastPiece){
			horizontalGroup2 = [];
		}

		horizontalGroup = horizontalGroup.concat(horizontalGroup2);

		
		//check the vertical up direction and shift it already by the dimension
		let up = index - dim;
		while((up >= 0) && (rev.indexToRowCol(board, up).col === lastCol) &&
			(board[up] !== lastPiece)){

			const nextPiece = board[up];

			const tempArray3 = [];


			if((nextPiece !== lastPiece) && (nextPiece !== ' ')){

				const response3 = rev.indexToRowCol(board, up);

				tempArray3.push(response3.row,response3.col);
				verticalGroup.push(tempArray3);
			}

			else if(nextPiece === ' '){
				verticalGroup = [];
				break;
			}

			up -= dim;

		}

		finalPiece = board[up];


		if(finalPiece !== lastPiece){
			verticalGroup = [];			
		}

		//check the vertical down direction and shift it already by the dimension
		let down = index + dim;
		while((down < board.length) && (rev.indexToRowCol(board, down).col === lastCol)&&
			board[down] !== lastPiece){

			const nextPiece = board[down];
			const tempArray4 = [];

			if((nextPiece !== lastPiece) && (nextPiece !== ' ')) {

				const response4 = rev.indexToRowCol(board, down);

				tempArray4.push(response4.row,response4.col);
				verticalGroup2.push(tempArray4);
			}

			else if(nextPiece === ' '){
				verticalGroup2 = [];
				break;
			}

					

			down += dim;
		}

		finalPiece = board[down];

		if(finalPiece !== lastPiece){
			verticalGroup2 = [];
		}

		verticalGroup = verticalGroup.concat(verticalGroup2);

		//check the diagonal NW direction
		let dagNW = index - diagonalShift;
		
		while((dagNW >= 0) && board[dagNW] !== lastPiece ){

			const nextPiece = board[dagNW];
			const tempArray5 = [];

			if((nextPiece !== lastPiece) && (nextPiece !== ' ')){

				const response5 = rev.indexToRowCol(board, dagNW);

				tempArray5.push(response5.row,response5.col);
				diagonalGroup.push(tempArray5);
			}

			else if(nextPiece === ' '){
				diagonalGroup = [];
				break;	
			}



			dagNW -= diagonalShift;
		}

		//this is to make sure that you don't go outside the board and dont get
		//rid of a piece that didn't have an end
		finalPiece = board[dagNW];


		//now we check to see if the final piece matched the lastPiece (the first one)
		//if not then we know it went outside the border stopped the while loop and is incorrect
		if(finalPiece !== lastPiece){
			diagonalGroup = [];
		}

		//check the diagonal SE direction
		let dagSE = index + diagonalShift;
		while((dagSE <= board.length) && board[dagSE] !== lastPiece){

			const nextPiece = board[dagSE];
			const tempArray6 = [];

			if((nextPiece !== lastPiece) && (nextPiece !== ' ')){

				const response6 = rev.indexToRowCol(board, dagSE);

				tempArray6.push(response6.row,response6.col);
				diagonalGroup2.push(tempArray6);
			}

			else if(nextPiece === ' '){
				diagonalGroup2 = [];
				break;
			}
			

			dagSE += diagonalShift;
		}

		finalPiece = board[dagSE];


		if(finalPiece !== lastPiece){
			diagonalGroup2 = [];
		}

		//check the diagonal NE direction
		let dagNE = index - dim + 1;
		while((dagNE >= 0) && board[dagNE] !== lastPiece){

			const nextPiece = board[dagNE];
			const tempArray7 = [];

			if((nextPiece !== lastPiece) && (nextPiece !== ' ')){

				const response7 = rev.indexToRowCol(board, dagNE);

				tempArray7.push(response7.row,response7.col);
				diagonalGroup3.push(tempArray7);
			}

			else if(nextPiece === ' '){
				diagonalGroup3 = [];
				break;
			}
				

			dagNE = dagNE - dim + 1;
		}

		finalPiece = board[dagNE];


		if(finalPiece !== lastPiece){
			diagonalGroup3 = [];
		}

		//check the diagonal SW direction
		let dagSW = index + dim - 1;
		while((dagSW <= board.length) && board[dagSW] !== lastPiece){

			const nextPiece = board[dagSW];
			const tempArray8 = [];

			if((nextPiece !== lastPiece) && (nextPiece !== ' ')){

				const response8 = rev.indexToRowCol(board, dagSW);

				tempArray8.push(response8.row,response8.col);
				diagonalGroup4.push(tempArray8);
			}

			else if(nextPiece === ' '){
				diagonalGroup4 = [];
				break;
			}

	

			dagSW = dagSW + dim - 1;
		}

		finalPiece = board[dagSW];

		if(finalPiece !== lastPiece){
			diagonalGroup4 = [];
		}


		diagonalGroup = diagonalGroup.concat(diagonalGroup2,diagonalGroup3,diagonalGroup4);


		//now create the array that will be returned
		const ret = [];

		if(diagonalGroup.length !== 0){
			ret.push(diagonalGroup);
		}

		if(verticalGroup.length !== 0){
			ret.push(verticalGroup);
		}

		if(horizontalGroup.length !== 0){
			ret.push(horizontalGroup);		
		}


		return ret;

	},


	isValidMove: function(board, letter, row, col) {

		let answer;


		const index = rev.rowColToIndex(board, row, col);

		//get the dimension so you can determine the boundaries of the board
		//and also see based on previous moves if there are any flips available
		const dim = Math.sqrt(board.length);

		//get each position in all the directions and see if there are
		//cells that you can flip by copying the board with the potential move

		let tempBoard = board.slice();

		tempBoard = rev.setBoardCell(tempBoard, letter, row, col);

		const potentialFlips = rev.getCellsToFlip(tempBoard, row, col);


		
		//now check in each direction whether there should be flip-able cells

		if((row < 0) || (row > dim)){
			answer = false;
		}


		else if((col < 0) || (col > dim)){
			answer = false;
		}


		else if(board[index] !== ' '){
			answer = false;
		}

		else if(potentialFlips.length === 0){
			answer = false;
		}

		else{
			answer = true;
		}

		return answer;
	},

	isValidMoveAlgebraicNotation: function(board, letter, algebraicNotation){

		let answer;

		//get the row,col combination from previous functions
		const position = rev.algebraicToRowCol(algebraicNotation);

		if(position === undefined){
			answer = false;
		}

		else{

			answer = rev.isValidMove(board, letter, position.row, position.col);
		}

		return answer;

	},

	getLetterCounts: function(board){

		const retObj = {'X':0 , 'O':0};

		for(let i = 0; i < board.length; i++){

			if(board[i]==='X') {

				const sum = retObj.X + 1;
				retObj.X = sum;
			}

			else if(board[i]==='O') {

				const sum = retObj.O + 1;
				retObj.O = sum;
			}			

		}

		return retObj;

	},

	getValidMoves: function(board, letter){

		const answer = [];

		//loop through the entire board and try every position and see if it is valid or not
		for(let i = 0; i<board.length; i++){

			const tempArray = [];

			if(board[i] === ' '){

				const rowCol = rev.indexToRowCol(board,i);

				tempArray.push(rowCol.row,rowCol.col);

				if(rev.isValidMove(board, letter, rowCol.row, rowCol.col)){
					answer.push(tempArray); 
				}
			}
		}

		return answer;
	},


	computerMove: function(board, computerLetter) {

	const validMoves = rev.getValidMoves(board, computerLetter);


	let compMove = undefined;
	let cellsFlipped = 0;

	validMoves.forEach(function(moves){	

		const temp = rev.getCellsToFlip(board, moves[0], moves[1]);

		if(temp.length === 3){
			if((temp[0].length + temp[1].length + temp[2].length) > cellsFlipped){
				compMove = moves;
			}
		}

		else if(temp.length === 2){
			if((temp[0].length + temp[1].length) > cellsFlipped){
				compMove = moves;
			}
		}

		else if(temp.length === 1){
			if((temp[0].length) > cellsFlipped){
				compMove = moves;
			}
		}					

	});

	return compMove;

}

};

module.exports = rev;
