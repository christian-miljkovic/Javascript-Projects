// app.js
const http = require('http');
const express = require('express');
const app = express();
const db = require('./db');
const mongoose = require('mongoose');
mongoose.Promise = require('bluebird');
const User = mongoose.model('User');
const Friend = mongoose.model('Friend');
require('dotenv').load();
const bodyParser = require('body-parser');

const apiai = require('apiai');
 
const bot = apiai(process.env.API_AI);

//get the authentication information
const accountSid = process.env.ACCOUNT_SID;
const authToken = process.env.AUTH_TOKEN;

const twilio = require('twilio');

//check how to get dotenv to work


app.use(bodyParser.urlencoded({extended:false}));

app.post('/sms',(req,res) => {

	const twilio = require('twilio');

	const phoneNumber = req.body.From;
	const textMessage = req.body.Body;
	let msg = ''

	const message = textMessage.split(' ');



	User.findOne({'phoneNumber':phoneNumber},(err,user)=>{

		if(err){

			console.log('There was this error: '+err);
		}

		else if(user === null){

			const newUser = new User({'phoneNumber':phoneNumber});

			newUser.save((err)=>{

				if(err){
					console.log('There was an error saving: '+err);
				}
				else{
					msg = 'Hi my name is Jarvis! What is your first and last name?'
					
					createResponse(msg);
				}
			});
		}

		else if(user !== null && user.firstName === undefined){

			const nameArray = textMessage.split(" ");


			User.findOneAndUpdate({'phoneNumber':phoneNumber},{$set:{firstName:nameArray[0],lastName:nameArray[1]}},(err)=>{

				if(err){
					console.log("Error with setting the fist and last name of user : "+ err);
				}
				else{
					
					msg = 'Awesome '+nameArray[0]+'! What\'s the first name, last name, and birthday (yyyy,mm,dd) of the friend that you me want to remember?';
					createResponse(msg);
				}

			});
			
		}

		//this is where we can use machine learning in order to determine how to respond to the person
		//the above if-else statements will simply have to do error checking
		else if (user !== null && user.firstName !== undefined && user.friends.length === 0){

			const friendArray = textMessage.split(' ');
			let date = friendArray[2];
			date = date.split(',');

			//have to subtract one because its 0 based date indexing
			date = new Date(+date[0],+date[1]-1,+date[2]);


			const newFriend = new Friend({'firstName':friendArray[0],'lastName':friendArray[1],'birthday':date});

			User.findOneAndUpdate({'phoneNumber':phoneNumber},{$push:{friends:newFriend}},(err)=>{

				if(err){
					console.log("Error with setting the fist and last name of friend: "+ err);
				}
				else{
					
					msg = 'Got it! Now you\'ll never forget '+friendArray[0]+'\'s birthday again! If you\'d like a reminder text me saying "What\'s my friends birthday? Or if you want to add another say "Add new freind" "';
					createResponse(msg);
				}

			});

		}

		//REPLACE THIS WITH THE ELSE STATEMENT AT THE BOTTOM THAT MAKES A REQUEST TO API.AI
		//this is where we are going to add new users might have to use NLP in order to acitivate this
		// else if((message.indexOf('Add') >= 0) && (message.indexOf('friend') >= 0) && (message.indexOf('new') >= 0 )){

		// 	const friendArray = textMessage.split(' ');
		// 	let date = friendArray[5];
		// 	date = date.split(',');

		// 	//dates are 0 based therefore i have to subtract one
		// 	date = new Date(+date[0],+date[1]-1,+date[2]);
			

		// 	const newFriend = new Friend({'firstName':friendArray[3],'lastName':friendArray[4],'birthday':date});

		// 	User.findOneAndUpdate({'phoneNumber':phoneNumber},{$push:{friends:newFriend}},(err)=>{

		// 		if(err){
		// 			console.log("Error with setting the fist and last name of friend: "+ err);
		// 		}
		// 		else{
					
		// 			msg = 'Got it! Now you\'ll never forget '+friendArray[3]+'\'s birthday again! If you\'d like a reminder text me saying "What\'s my friends birthday? Or if you want to add another say "Add Freind (first name last name (yyyy,mm,dd))" "';
		// 			createResponse(msg);
		// 		}

		// 	});


		// }


		//where we deal with any messages that aren't in the set up mode
		else{

			//this is where we are using API.ai to processes and deal with messages once we are out of the initial setup
			const request = bot.textRequest(textMessage, {
			    sessionId: phoneNumber
			});
			 
			request.on('response', function(response) {
			   
				const msg = response.result.fulfillment.speech;
				const intent = response.result.metadata.intentName;

				if(intent == "birthday.add"){

					if(msg === "Now you'll get a reminder on their birthday!"){

						const parameters = response.result.parameters;

						let date = parameters.date;

						date = date.split("-");

						//have to subtract one because its 0 based date indexing
						date = new Date(+date[0],+date[1]-1,+date[2]);

						const firstName = parameters["given-name"];
						const lastName = parameters["last-name"];

						const newFriend = new Friend({'firstName':firstName,'lastName':lastName,'birthday':date});

						User.findOneAndUpdate({'phoneNumber':phoneNumber},{$push:{friends:newFriend}},(err)=>{

							if(err){
								console.log("Error with setting the fist and last name of friend: "+ err);
							}
							else{
								createResponse(msg);
							}

						});					

						
					}
					else{
						createResponse(msg);
					}					
				}
				//these are for finding friends
				else if(intent == "birthday.find") {

					const parameters = response.result.parameters;

					//any indicates whether or not to return all names
					const any = parameters.any;
					const date = parameters.date;
					const firstName = parameters["given-name"];
					const lastName = parameters["last-name"];
					let msg2 = "";	

					//need an array for months
					const months = ['January','February','March','April','May','June','July','August','September','October','November','December'];

					if(any !== ""){

						console.log('anny');

						User.findOne({phoneNumber},function(err,user){

							if(err){
								console.log('There was an error finding users in schedule'+err);
							}

							else{
								
								//send out a message with all the names
								if(user.friends.length >= 1){
									user.friends.forEach((friend)=>{

										if(friend.firstName !== undefined && friend.lastName !== undefined && friend.birthday != undefined){
											
											let dayStr = "" + friend.birthday.getDate();
											if(dayStr.length > 1){
												if(dayStr[0] == '1'){
													dayStr = ''+dayStr+'th';
												}
												else{
													if(dayStr[1] == '1'){
														dayStr = '' +dayStr+'st';
													}
													else if(dayStr[1] == '2'){
														dayStr = '' +dayStr+'nd';
													}
													else if(dayStr[1] == '3'){
														dayStr = '' +dayStr+'rd';
													}
													else{
														dayStr = '' +dayStr+'th';
													}													
												}

											}
											//not two digit
											else{

												if(dayStr[0] == '1'){
													dayStr = '1st';
												}
												else if(dayStr[0] == '2'){
													dayStr = '2nd';
												}
												else if(dayStr[0] == '3'){
													dayStr = '3rd';
												}
												else{
													dayStr = '' +dayStr[0]+'th';
												}

											}


											msg2 += friend.firstName + ' ' + friend.lastName + '\'s' + ' birthday is on ' + months[friend.birthday.getMonth()] +' '+ dayStr +'\n';
										}
										

									});									
								}
								else{
									msg2 += 'You haven\'t made me remember any friends yet!';
								}

							}

							createResponse(msg2);

						});						
					}

					else if(date !== ""){

						let date = parameters.date;

						console.log('date');

						date = date.split("-");

						User.findOne({phoneNumber},function(err,user){

							if(err){
								console.log('There was an error finding users in schedule'+err);
							}

							else{
								//send out a message with all the names
								if(user.friends.length >= 1){

									user.friends.forEach((friend)=>{

										if(friend.firstName !== undefined && friend.lastName !== undefined && friend.birthday != undefined){
											let dayStr = "" + friend.birthday.getDate();
											if(dayStr.length > 1){
												if(dayStr[0] == '1'){
													dayStr = ''+dayStr+'th';
												}
												else{
													if(dayStr[1] == '1'){
														dayStr = '' +dayStr+'st';
													}
													else if(dayStr[1] == '2'){
														dayStr = '' +dayStr+'nd';
													}
													else if(dayStr[1] == '3'){
														dayStr = '' +dayStr+'rd';
													}
													else{
														dayStr = '' +dayStr+'th';
													}													
												}

											}
											//not two digit
											else{

												if(dayStr[0] == '1'){
													dayStr = '1st';
												}
												else if(dayStr[0] == '2'){
													dayStr = '2nd';
												}
												else if(dayStr[0] == '3'){
													dayStr = '3rd';
												}
												else{
													dayStr = '' +dayStr[0]+'th';
												}

											}
											if((friend.birthday.getMonth() === +date[1]) && (friend.birthday.getDay() === +date[2])){
												msg2 += friend.firstName + ' ' + friend.lastName + '\'s' + ' birthday is on ' + months[friend.birthday.getMonth()] +' '+ dayStr +'\n';
											}
										}

										

									});									
								}
								else{
									msg2 += 'You haven\'t made me remember any friends yet!';
								}

							}

							createResponse(msg2);

						});	

					}
					//if you just get the first and last name
					else if(firstName !== "" && lastName !== ""){

						console.log('first last name');

						User.findOne({phoneNumber},function(err,user){

								if(err){
									console.log('There was an error finding users in schedule'+err);
								}

								else{
									//send out a message with all the names
									if(user.friends.length >= 1){
										user.friends.forEach((friend)=>{

											if(friend.firstName !== undefined && friend.lastName !== undefined && friend.birthday != undefined){
												let dayStr = "" + friend.birthday.getDate();
												if(dayStr.length > 1){
													if(dayStr[0] == '1'){
														dayStr = ''+dayStr+'th';
													}
													else{
														if(dayStr[1] == '1'){
															dayStr = '' +dayStr+'st';
														}
														else if(dayStr[1] == '2'){
															dayStr = '' +dayStr+'nd';
														}
														else if(dayStr[1] == '3'){
															dayStr = '' +dayStr+'rd';
														}
														else{
															dayStr = '' +dayStr+'th';
														}													
													}

												}
												//not two digit
												else{

													if(dayStr[0] == '1'){
														dayStr = '1st';
													}
													else if(dayStr[0] == '2'){
														dayStr = '2nd';
													}
													else if(dayStr[0] == '3'){
														dayStr = '3rd';
													}
													else{
														dayStr = '' +dayStr[0]+'th';
													}

												}												
												if(firstName === friend.firstName && lastName === friend.lastName){



													msg2 += friend.firstName + ' ' + friend.lastName + '\'s' + ' birthday is on ' + months[friend.birthday.getMonth()] +' '+ dayStr +'\n';
												}
											}

											

										});										
									}
									else{
										msg2 += 'You haven\'t made me remember any friends yet!';
									}									

								}

								createResponse(msg2);

						});	

					}

					//this is going to get more information if required
					else{
						createResponse(msg);
					}




				}
				//these are for the jokes
				else{

					createResponse(msg);
				}


			});
			 
			request.on('error', function(error) {
			    console.log(error);
			    createResponse("Oops, something went wrong. Looks like it's time for world domination :)");
			});
			 
			request.end();	

		// 	const txtMsg = textMessage.split(' ');
		// 	let birthdayPresent = false;

		// 	for(let i=0; i<txtMsg.length; i++){

		// 		if(txtMsg[i] === 'birthday?' || txtMsg[i] === 'birthday' || txtMsg[i] === 'Birthday'){
		// 			birthdayPresent = true
		// 		}
		// 	}

		// 	if(birthdayPresent){

		// 		User.findOne({'phoneNumber':phoneNumber},(err,user)=>{

		// 			if(err){
		// 				console.log('Error with finding friend');
		// 			}
		// 			else{

		// 				const friend = user.friends[0];
		// 				const friendName = friend.firstName;
		// 				const birthday = friend.birthday;

		// 				msg =''+ friendName+'\'s birthday is on '+birthday;
		// 				createResponse(msg);

		// 			}

		// 		});

		// 	}

		// 	else{

		// 		const msgArray = ['Sorry '+user.firstName+' I\'m currently ploting world domination right now >:)',
		// 		'This device will explode in 10 seconds :)']
		// 		const index = Math.round(Math.random()*1);

		// 		msg = msgArray[index];
		// 		createResponse(msg);				

		// 	}


		 }


	});
	
	function createResponse(msg){
		const twiml = new twilio.twiml.MessagingResponse();
		twiml.message(msg);

		res.writeHead(200,{'Content-Type':'text/xml'});
		res.end(twiml.toString());
		
	}
		






});



app.listen(process.env.PORT || 3000);
