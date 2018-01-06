//main.js

document.addEventListener('DOMContentLoaded', main);

function main(){

	const btn = document.querySelector('.playBtn');

	let playerScore = 0
	let computerScore = 0
	let gameOver = false
	let winner = null;

	btn.addEventListener('click',function clicked(evt){

		evt.preventDefault();

		const form = document.querySelector('form');

		form.style.display = 'none';

		const cards = form.startValues.value;

		game = generateGame(cards);
		
		displayCards(game.computerHand,game.playerHand);

		playerScore += computeScore(game.playerHand);
		computerScore += computeScore(game.computerHand);

		displayScore(computerScore,playerScore,false);

		const playerDiv = document.querySelector('.playerHand');

		const hitBtn = document.createElement('BUTTON');
		const standBtn = document.createElement('BUTTON');

		hitText = document.createTextNode("Hit");
		hitBtn.appendChild(hitText);	
		hitBtn.classList.add('hitBtn');	

		standText = document.createTextNode("Stand");
		standBtn.appendChild(standText);
		standBtn.classList.add('standBtn');

		hitBtn.style.display = 'inline-block';
		standBtn.style.display = 'inline-block';
		hitBtn.style.marginRight = '50px';

		playerDiv.appendChild(hitBtn);
		playerDiv.appendChild(standBtn);	


		const hBtn = document.querySelector('.hitBtn');
		const sBtn = document.querySelector('.standBtn');

		console.log(game.deck);

		hBtn.addEventListener('click',function clicked(evt){

			evt.preventDefault();

			playerScore += hit(game.deck,game.playerHand);

			if(playerScore > 21){
				gameOver = true;
				winner = 'Computer';
			}

			updateScore(computerScore,playerScore,gameOver);

			if(gameOver){

				const compHand = document.querySelector('.compHand').firstChild;
				compHand.innerHTML = compHand.id;
				const playerDiv = document.querySelector('.playerHand');
				playerDiv.removeChild(playerDiv.lastChild);
				playerDiv.removeChild(playerDiv.lastChild);
				const outCome = document.createElement('h4');
				const compContent = document.createTextNode("The Computer Wins :(");
				outCome.appendChild(compContent);
				playerDiv.appendChild(outCome);
			}

		});	

		sBtn.addEventListener('click',function clicked(evt){

			evt.preventDefault();

			while(computeScore < 17){

				computerScore += hit(game.deck,game.computerHand);
			}


			gameOver = true;
			updateScore(computerScore,playerScore,gameOver);

			const playerDiv = document.querySelector('.playerHand');
			playerDiv.removeChild(playerDiv.lastChild);
			playerDiv.removeChild(playerDiv.lastChild);
			const compHand = document.querySelector('.compHand').firstChild;
			compHand.innerHTML = compHand.id;

			if(computerScore > 21){

				
				winner = 'Player';
				const outCome = document.createElement('h4');
				const compContent = document.createTextNode("The Player Wins :)");
				outCome.appendChild(compContent);
				playerDiv.appendChild(outCome);				


			}
			else{

				if(computerScore < playerScore){
					winner = 'Player';
					const outCome = document.createElement('h4');
					const compContent = document.createTextNode("The Player Wins :)");
					outCome.appendChild(compContent);
					playerDiv.appendChild(outCome);

				}
				else{
					winner = 'Computer';
					const outCome = document.createElement('h4');
					const compContent = document.createTextNode("The Computer Wins :(");
					outCome.appendChild(compContent);	
					playerDiv.appendChild(outCome);	
				}
			}

		});			

	});



}

function generateGame(cards){

	function generateCard(deck){

		const index = Math.floor((Math.random()* 51)+1) 

		const card = deck[index];

		return card;
	}


	const deck = [];

	const topOfDeck = [];

	const player = [];
	const computer = [];

	for(let i=1;i<=13;i++){

		const spades = {'spades':i};
		const diamonds = {'diamonds':i};
		const hearts = {'hearts':i};
		const clubs = {'clubs':i};

		deck.push(spades);
		deck.push(diamonds);
		deck.push(hearts);
		deck.push(clubs);

	}

	
	const cardArray = cards.split(',');

	let cardLen = 0;

	if(cardArray[0] === ""){
		cardLen = 0;
	}
	else{
		cardLen = cardArray.length;
	}


	if(cardLen.length === 4){

		for(let i=0;i<cardLen;i++){

			if(i%2 === 1){
				if(cardArray[i] === 'J'){
					computer.push({'spades':11});
				}
				else if(cardArray[i] === 'Q'){
					computer.push({'spades':12});
				}				
				else if(cardArray[i] === 'K'){
					computer.push({'spades':11});
				}
				else if(cardArray[i] === 'A'){
					computer.push({'spades':1});
				}
				else{
					computer.push({'spades':+cardArray[i]});	
				}				
				
			}
			else{
				if(cardArray[i] === 'J'){
					player.push({'spades':11});
				}
				else if(cardArray[i] === 'Q'){
					player.push({'spades':12});
				}				
				else if(cardArray[i] === 'K'){
					player.push({'spades':13});
				}
				else if(cardArray[i] === 'A'){
					player.push({'spades':1});
				}
				else{
					player.push({'spades':+cardArray[i]});	
				}					
			}
		}

	}

	else if(cardLen < 4){

		const leftOver = 4 - cardLen;

		for(let i=0;i<cardLen;i++){
			if(i%2 === 1){
				if(cardArray[i] === 'J'){
					computer.push({'spades':11});
				}
				else if(cardArray[i] === 'Q'){
					computer.push({'spades':12});
				}				
				else if(cardArray[i] === 'K'){
					computer.push({'spades':13});
				}
				else if(cardArray[i] === 'A'){
					computer.push({'spades':1});
				}
				else{
					computer.push({'spades':+cardArray[i]});	
				}				
				
			}
			else{
				if(cardArray[i] === 'J'){
					player.push({'spades':11});
				}
				else if(cardArray[i] === 'Q'){
					player.push({'spades':12});
				}				
				else if(cardArray[i] === 'K'){
					player.push({'spades':13});
				}
				else if(cardArray[i] === 'A'){
					player.push({'spades':1});
				}
				else{
					player.push({'spades':+cardArray[i]});	
				}					
			}

		}
		for(let i=cardLen;i<(cardLen + leftOver);i++){
			if(i%2 === 1){
				computer.push(generateCard(deck));
			}
			else{
				player.push(generateCard(deck));
			}			
		}


	}
	else if (cardLen > 4){

		const extraCards = cardLen - 4;
		for(let i=0;i<4;i++){
			if(i%2 === 1){
				if(cardArray[i] === 'J'){
					computer.push({'spades':11});
				}
				else if(cardArray[i] === 'Q'){
					computer.push({'spades':12});
				}				
				else if(cardArray[i] === 'K'){
					computer.push({'spades':13});
				}
				else if(cardArray[i] === 'A'){
					computer.push({'spades':1});
				}
				else{
					computer.push({'spades':+cardArray[i]});	
				}				
				
			}
			else{
				if(cardArray[i] === 'J'){
					player.push({'spades':11});
				}
				else if(cardArray[i] === 'Q'){
					player.push({'spades':12});
				}				
				else if(cardArray[i] === 'K'){
					player.push({'spades':13});
				}
				else if(cardArray[i] === 'A'){
					player.push({'spades':1});
				}
				else{
					player.push({'spades':+cardArray[i]});	
				}					
			}

		}
		for(let i=0;i<extraCards;i++){
			
			topOfDeck.push(generateCard(deck));
		}

	}
	else{
		for(let i=0;i<cardLen;i++){
			
			player.push(generateCard(deck));
			computer.push(generateCard(deck));
		}

	}

	topOfDeck.forEach((card)=>{

		deck.unshift(card);
	});

	const game = {'playerHand':player,'computerHand':computer,'deck':deck};

	return game;
}


function displayCards(computerHand,playerHand){


	const game = document.querySelector('.game');
	const compHand = document.createElement('h3');
	compHand.classList.add('compHand');

	//create the hand for the computer
	for(let i = 0; i<computerHand.length; i++){

		
		const card = document.createElement('p');
		let content = "";
		let value = "";

		let suit = Object.keys(computerHand[i])
		suit = suit[0];

		if(computerHand[i][suit] === 11){
			value = "J";
		}
		else if(computerHand[i][suit] === 12){
			value = "Q";
		}
		else if(computerHand[i][suit] === 13){
			value = "K";
		}
		else if(computerHand[i][suit] === 1){
			value = "A";
		}
		else{
		
			value = "" + computerHand[i][suit];
		}	
		
		
		if(suit === "hearts"){

			
			content = document.createTextNode(value+" \u2665");
			card.appendChild(content);
		}
		else if(suit === "diamonds"){

			
			content = document.createTextNode(value+ " \u2666");
			card.appendChild(content);
		}
		else if(suit === "clubs"){

			
			content = document.createTextNode(value+" \u2664");
			card.appendChild(content);
		}
		else if(suit === "spades"){

			
			content = document.createTextNode(value+" \u2663");
			card.appendChild(content);
		}
	
		card.style.display = 'inline-block';
		card.style.borderStyle = 'solid';
		card.style.paddingBottom = '150px';
		
		card.style.marginRight = '50px';

		if(i==0){
			card.setAttribute("id",card.innerText);
			card.innerText = '  \u0000';
			card.style.paddingLeft = '100px';
		}
		else{
			card.style.paddingLeft = '75px';
		}


		compHand.appendChild(card);

	}

	game.appendChild(compHand);

	const playHand = document.createElement('h3');
	playHand.classList.add('playerHand');

	//create the hand for the computer
	for(let i = 0; i<computerHand.length; i++){

		
		const card = document.createElement('p');
		let content = "";
		let value = ""

		let suit = Object.keys(playerHand[i])
		suit = suit[0];	

		if(playerHand[i][suit] === 11){
			value = "J";
		}
		else if(playerHand[i][suit] === 12){
			value = "Q";
		}
		else if(playerHand[i][suit] === 13){
			value = "K";
		}
		else if(playerHand[i][suit] === 1){
			value = "A";
		}
		else{

			value = "" + playerHand[i][suit];
		}	
					
		
		if(suit === "hearts"){

			
			content = document.createTextNode(value+" \u2665");
			card.appendChild(content);
		}
		else if(suit === "diamonds"){

			
			content = document.createTextNode(value+ " \u2666");
			card.appendChild(content);
		}
		else if(suit === "clubs"){

			
			content = document.createTextNode(value+" \u2663");
			card.appendChild(content);
		}
		else if(suit === "spades"){

			
			content = document.createTextNode(value+" \u2664");
			card.appendChild(content);
		}
	
		card.style.display = 'inline-block';
		card.style.borderStyle = 'solid';
		card.style.paddingBottom = '150px';
		card.style.paddingLeft = '75px';
		card.style.marginRight = '50px';
		playHand.appendChild(card);

	}

	game.appendChild(playHand);
}


function hit(deck,playerHand){

	playerHand.push(deck[0]);

	const playHand = document.querySelector('.playerHand');

	const card = document.createElement('p');
	let content = "";
	let value = "";

	let suit = Object.keys(deck[0])
	suit = suit[0];	

	if(deck[0][suit] === 11){
		value = "J";
	}
	else if(deck[0][suit] === 12){
		value = "Q";
	}
	else if(deck[0][suit] === 13){
		value = "K";
	}
	else if(deck[0][suit] === 1){
		value = "A";
	}
	else{
		
		value = "" + deck[0][suit];
	}	
				
	
	if(suit === "hearts"){

		
		content = document.createTextNode(value+" \u2665");
		card.appendChild(content);
	}
	else if(suit === "diamonds"){

		
		content = document.createTextNode(value+ " \u2666");
		card.appendChild(content);
	}
	else if(suit === "clubs"){

		
		content = document.createTextNode(value+" \u2663");
		card.appendChild(content);
	}
	else if(suit === "spades"){

		
		content = document.createTextNode(value+" \u2664");
		card.appendChild(content);
	}

	card.style.display = 'inline-block';
	card.style.borderStyle = 'solid';
	card.style.paddingBottom = '150px';
	card.style.paddingLeft = '75px';
	card.style.marginRight = '50px';
	playHand.insertBefore(card,playHand.firstChild);

	deck = deck.shift();
	

	const score = computeScore(playerHand);

	return score;

}

function computeScore(hand){

	let value = 0;
	let tempValue = 0;
	let actualValue = 0;

	hand.forEach((card)=>{

		const key = Object.keys(card)[0];
		

		if(card[key] === 1){

			value += 1;

			if(tempValue + 11 < 21){
				tempValue += 11;	
			}
			else{
				tempValue += 1;
			}
			

		}
		else if (card[key] > 10){
			value += 10;
			tempValue += 10;
		}
		else{

			value += card[key];
			tempValue += card[key];
		}

		if(tempValue <= 21 && tempValue > value){
			actualValue = tempValue;
		}
		else{
			actualValue = value;
		}

	});

	return actualValue;

}

function displayScore(computerScore,playerScore,gameOver){

	const compDiv = document.querySelector('.compHand');
	const playerDiv = document.querySelector('.playerHand');

	let score = '';

	if(gameOver === false){

		score = document.createElement('h4');

		const compContent = document.createTextNode("Computer Hand - Total: ?");
		score.classList.add('compScore');
		score.appendChild(compContent);		
	}
	else{

		score = document.createElement('h4');

		const compContent = document.createTextNode("Computer Hand - Total: " + computeScore);
		score.appendChild(compContent);	

	}

	compDiv.appendChild(score);

	const userScore = document.createElement('h4');
	userScore.classList.add('userScore');

	const playerContent = document.createTextNode("Player Hand - Total: "+playerScore);
	userScore.appendChild(playerContent);		

	playerDiv.appendChild(userScore);

}

function updateScore(computerScore,playerScore,gameOver){

	const compScore = document.querySelector('.compScore');	

	const userScore = document.querySelector('.userScore');

	if(gameOver === false){
		compScore.innerHTML = "Computer Hand - Total: ?";
	}
	else{
		compScore.innerHTML = "Computer Hand - Total: "+computerScore;	
	}
	
	userScore.innerHTML = 'Player Hand - Total:' + playerScore;

}











