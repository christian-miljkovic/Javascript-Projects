// //app.js
 var rev = require('./reversi.js');
var fs = require('fs');
var readlineSync = require('readline-sync');

const str_path = process.argv[2];


if(str_path !== undefined){

	console.log('Welcome to Reversi!');


	let data = fs.readFileSync(str_path, 'utf8');

	data = JSON.parse(data);

	const script = data.scriptedMoves;

	let tempPlayerScript = script.player;
	let tempCompScript = script.computer;

	data = data.boardPreset;

	const playerLetter = data.playerLetter;

	let computerLetter;

	if(playerLetter === 'X'){

		computerLetter = 'O';

	}

	else{

		computerLetter= 'X';
	}

	const dim = Math.sqrt(data.board.length);

	let board = rev.generateBoard(dim, dim);


	data.board.forEach(function(letter,i){

	  		const rowCol = rev.indexToRowCol(board,i);

	  		board = rev.setBoardCell(board, letter, rowCol.row, rowCol.col);

	  	});


	let counter = 0;

	let computerPasses = 0;
	let playerPasses = 0;

	while((rev.isBoardFull(board) === false) || (playerPasses === 2) || computerPasses === 2){

		if((counter<tempPlayerScript.length) && (rev.isValidMoveAlgebraicNotation(board, playerLetter,tempPlayerScript[counter]))){

			board = rev.placeLetters(board, playerLetter, tempPlayerScript[counter]);

			const rowCol = rev.algebraicToRowCol(tempPlayerScript[counter]);
				
			board = rev.flipCells(board,rev.getCellsToFlip(board, rowCol["row"], rowCol["col"]));

			playerPasses = 0;

			rev.boardToString(board);
			console.log('Player played: '+tempPlayerScript[counter]);
			console.log();
			const score = rev.getLetterCounts(board);
			console.log();
			console.log('Score');
			console.log('=====');
			console.log('X: '+score.X);
			console.log('O: '+score.O);
			console.log();

			let loop2 = true;
				while(loop2){

					const enter = readlineSync.question('Press <Enter> to see computer move.');

					if(enter === ''){
						loop2 = false;
					}
				}			

		}

		else{

			console.log('No valid user move!');
			console.log();
			playerMove = readlineSync.question('What is your move? ');

			let availableMoves = rev.getValidMoves(board, playerLetter);

			let validMove = rev.isValidMoveAlgebraicNotation(board, playerLetter, playerMove);


			if((validMove === true) && (availableMoves.length > 0)) {

				board = rev.placeLetters(board, playerLetter, playerMove);

				const rowCol = rev.algebraicToRowCol(playerMove);
				

				board = rev.flipCells(board,rev.getCellsToFlip(board, rowCol["row"], rowCol["col"]));

				rev.boardToString(board);

				const score = rev.getLetterCounts(board);
				console.log();
				console.log('Score');
				console.log('=====');
				console.log('X: '+score.X);
				console.log('O: '+score.O);
				console.log();
				
				let loop2 = true;
				while(loop2){

					const enter = readlineSync.question('Press <Enter> to see computer move.');

					if(enter === ''){
						loop2 = false;
					}
				}

				playerPasses = 0;


			}

			else if(availableMoves.length === 0){
				console.log("No valid moves available for you.");
				
				playerPasses++;

				let loop2 = true;
				while(loop2){

					const enter = readlineSync.question('Press <Enter> to pass.');

					if(enter === ''){
						loop2 = false;
					}
				}
			}

			else{
				console.log("That was not a valid move!");
			}						
	}


		if((counter<tempCompScript.length) && (rev.isValidMoveAlgebraicNotation(board, computerLetter,tempCompScript[counter]))){

			board = rev.placeLetters(board, playerLetter, tempCompScript[counter]);

			const rowCol = rev.algebraicToRowCol(tempCompScript[counter]);
				
			board = rev.flipCells(board,rev.getCellsToFlip(board, rowCol["row"], rowCol["col"]));

			rev.boardToString(board);
			console.log();

		}


		else{

			const computerNextMove = rev.computerMove(board, computerLetter);

				if(computerNextMove === undefined){
					computerPasses++;
					console.log('Computer Passes.');

					let loop2 = true;
					while(loop2){

						const enter = readlineSync.question('Press <Enter> to continue.');

						if(enter === ''){
							loop2 = false;
						}
				}	

				}

				else{

					board = rev.setBoardCell(board, computerLetter, computerNextMove[0],computerNextMove[1]);

					board = rev.flipCells(board,rev.getCellsToFlip(board, computerNextMove[0], computerNextMove[1]));

					rev.boardToString(board);

					const score = rev.getLetterCounts(board);
					console.log();
					console.log('Score');
					console.log('=====');
					console.log('X: '+score.X);
					console.log('O: '+score.O);
					console.log();


					let loop2 = true;
					while(loop2){

						const enter = readlineSync.question('Press <Enter> to continue.');

						if(enter === ''){
							loop2 = false;
						}
				}					




					computerPasses = 0;

				}
			}

			counter++;

		}


		

	const score = rev.getLetterCounts(board);
	console.log();
	console.log('Score');
	console.log('=====');
	console.log('X: '+score.X);
	console.log('O: '+score.O);
	if(score.X > score.O){
		if(playerLetter==='X'){
			console.log('You Win!');
		}

		else{
			console.log('Sorry you lost :(');
		}
	}

	else if(score.X === score.O){
		console.log('It\'s a tie!');
	}
		

}

else {

	console.log('Welcome to REVERSI? ');
	console.log();
	
	let loop = true;

	let width;
	let playerLetter;
	let computerLetter;

	while(loop) {
		width = readlineSync.question('How wide should the board be? (even numbers between 4 and 26, inclusive)? ');

		if(width<4 || width>26){
			loop = true;
		}

		else if(isNaN(width)){
			loop = true;
		}

		else if(width%2 !== 0){
			loop = true
		}

		else{
			loop = false;
		}
	}

	loop = true;

	while(loop){

		playerLetter = readlineSync.question('Pick your letter: X (black) or O (white) ');

		if(playerLetter ==='X'){
			computerLetter = 'O';
			console.log('Player is: ' + playerLetter);
			console.log();
			loop = false;
		}

		else if(playerLetter ==='O'){
			computerLetter = 'X';
			console.log('Player is: ' + playerLetter);
			console.log();
			loop = false;
		}

		else{
			loop = true;
		}		

	}

	let board = rev.generateBoard(width, width, ' ');


	let start_moves = [['O',(width/2)-1,(width/2)-1],['X',(width/2)-1,(width/2)],['X',(width/2),(width/2)-1],['O',(width/2),(width/2)]];


	start_moves.forEach(function(moves){

		board = rev.setBoardCell(board, moves[0], moves[1], moves[2]);

	});	

	rev.boardToString(board);

	let playerPasses = 0;
	let computerPasses = 0;


	while((rev.isBoardFull(board) === false) || (playerPasses === 2) || computerPasses === 2){



		let loop = true;
		let playerMove;

		while(loop){
			
			playerMove = readlineSync.question('What is your move? ');

			let availableMoves = rev.getValidMoves(board, playerLetter);

			let validMove = rev.rev.isValidMoveAlgebraicNotation(board, playerLetter, playerMove);


			if((validMove === true) && (availableMoves.length > 0)) {

				board = rev.placeLetters(board, playerLetter, playerMove);

				const rowCol = rev.algebraicToRowCol(playerMove);
				

				board = rev.flipCells(board,rev.getCellsToFlip(board, rowCol["row"], rowCol["col"]));

				rev.boardToString(board);

				const score = rev.getLetterCounts(board);
				console.log();
				console.log('Score');
				console.log('=====');
				console.log('X: '+score.X);
				console.log('O: '+score.O);
				console.log();
				readlineSync.question('Press <ENTER> to show computer\'s move...');

				playerPasses = 0;

				const computerNextMove = rev.computerMove(board, computerLetter);


				if(computerNextMove === undefined){
					computerPasses++;
					console.log('Computer Passes.');
					loop = false
				}

				else{


					board = rev.setBoardCell(board, computerLetter, computerNextMove[0],computerNextMove[1]);

					board = rev.flipCells(board,rev.getCellsToFlip(board, computerNextMove[0], computerNextMove[1]));

					rev.boardToString(board);

					const score = rev.getLetterCounts(board);
					console.log();
					console.log('Score');
					console.log('=====');
					console.log('X: '+score.X);
					console.log('O: '+score.O);
					console.log();


					computerPasses = 0;
					loop = false;

				}


				loop = false;
			}

			else if(availableMoves.length === 0){
				console.log("No valid moves available for you.");
				
				playerPasses++;

				let loop2 = true;
				while(loop2){

					const enter = readlineSync.question('Press <Enter> to pass.');

					if(enter === ''){
						loop2 = false;
					}
				}

				const computerNextMove = rev.computerMove(board, computerLetter);

				if(computerNextMove === undefined){
					computerPasses++;
					console.log('Computer Passes.');
				}

				else{

					board = rev.setBoardCell(board, computerLetter, computerNextMove[0],computerNextMove[1]);

					board = rev.flipCells(board,rev.getCellsToFlip(board, computerNextMove[0], computerNextMove[1]));

					rev.boardToString(board);

					const score = rev.getLetterCounts(board);
					console.log();
					console.log('Score');
					console.log('=====');
					console.log('X: '+score.X);
					console.log('O: '+score.O);
					console.log();


					computerPasses = 0;
					loop = false;

				}
				

			}

			else{
				console.log("That was not a valid move!");
			}
		}

	}

	const score = rev.getLetterCounts(board);
	console.log();
	console.log('Score');
	console.log('=====');
	console.log('X: '+score.X);
	console.log('O: '+score.O);
	if(score.X > score.O){
		if(playerLetter==='X'){
			console.log('You Win!');
		}

		else{
			console.log('Sorry you lost :(');
		}
	}

	else if(score.X === score.O){
		console.log('It\'s a tie!');
	}




}






