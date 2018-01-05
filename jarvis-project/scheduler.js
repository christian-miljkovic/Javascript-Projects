//scheduler.js
const http = require('http');
const express = require('express');
const app = express();
const db = require('./dbScheduler.js');
const mongoose = require('mongoose');
mongoose.Promise = require('bluebird');
const User = mongoose.model('User');
const Friend = mongoose.model('Friend');
const bodyParser = require('body-parser');



//get the authentication information
const accountSid = process.env.ACCOUNT_SID;
const authToken = process.env.AUTH_TOKEN;

const twilio = require('twilio');

//will need this information for when we begin to send messages to people
//Test credentials: ACd5d36af35598d0e55688beb8206a7f03,e8cfe1239a574c6a2446c9d6d111156d
//Original credentials: AC656657ac6fe18d7197bc7379b96357a2, b90572f77203a360efa8750f07efe9b8
const client = new twilio("ACd5d36af35598d0e55688beb8206a7f03","e8cfe1239a574c6a2446c9d6d111156d");

app.use(bodyParser.urlencoded({extended:false}));


//this will be the current day that we will be using to compare
const currentDate = new Date();


//we will hold the numbers that we will need to text, and the names of the people with birthdays that day
const birthdayDictionary = {};

//this function will be used to determine whether the current day is 
function compareDates(currentDate,compDate){

	if((currentDate.getDay() === compDate.getDay()) && (currentDate.getMonth() === compDate.getMonth())){
		return true;
	}
	else{
		return false;
	}

}

//now lets get all of the users then look through their friends' list in order to populate the birthdayDictionary
User.find({},(err,users)=>{



	if(err){
		console.log('There was an error finding users in schedule'+err);
	}

	else{

		//now loop through each user and then their friends to find one that has a birthday today
		//HERE WE SHOULD MAKE MORE FLEXIBLE IN ORDER TO BE ABLE TO DEAL WITH MULTIPLE BIRTHDAYS ON SAME DAY
		users.forEach((user)=>{

			if(user.friends.length >= 1){

				//USE THE COUNT VARIABLE IN ORDER TO MAKE THE RESPONSE DIFFERENT HERE
				//FOR MULTIPLE BIRTHDAYS
				user.friends.forEach((friend)=>{

					if(friend.birthday !== undefined){

						if(compareDates(currentDate,friend.birthday)){
							birthdayDictionary[user.phoneNumber] = 'Hi there, '+user.firstName + ' it\'s ' + friend.firstName + ' ' + friend.lastName + ' birthday today! Don\'t forget to say happy birthday to them!';
						}						
					}
					else{
						console.log('Invalid friend birthday for friend: '+ friend.firstName);
					}


				});

			}
			else{

				console.log('The user '+ user.firstName +' ' + user.lastName  +' does not have any friends');
			}

		});


	//now we will send the messages to the users with friends that have birthday on the current day
	if(Object.keys(birthdayDictionary).length > 0){

		//this is an array of user phone numbers that we will send messages to 
		const phoneNumbers = Object.keys(birthdayDictionary);

		phoneNumbers.forEach((phone)=>{

			//get the name of the friend
			const msg = birthdayDictionary[phone];


			//create the actual message to be sent and send it using twilio API
			client.messages.create({

				//test phone number is: +1 203 427-0564
				//original phone number is: +1 203-349-6342
				body:msg,
				to:phone,
				from:'+12034270564'
				
			})
			.then((message)=> {console.log('This is message id:' + message.sid + 'sent to '+phone)});
			//this is so we can end the process when it is done
			 

		});

	}
	else{

		console.log('There are no birthday\'s today!');
		//this is so we can end the process when it is done
		
	}		

	}
});


app.listen(process.env.PORT || 3000);












