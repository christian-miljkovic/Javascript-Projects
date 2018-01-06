const uuid = require('node-uuid');

sessionStore = {};


// manageSession and parseCookies
const cookieid = {

	parseCookies: function(req,res,next){

		let cookies = req.header('Cookie');
		req.hwCookies = {};
		//otherwise do nothing
		if(cookies !== undefined){
			

			cookies = cookies.split(';');
			

			for (let i = 0; i < cookies.length; i++) {
				
				const cookieArray = cookies[i].split('=');
				req.hwCookies[cookieArray[0].trim()] = cookieArray[1];
				
			}

			}


		next();

	},

	manageSession: function(req,res,next){


		let checkSession = false;

		let session = '';

		if(req.hwCookies['sessionId'] !== undefined){

			session = req.hwCookies['sessionId'];

			if(sessionStore[session] !== undefined){
				checkSession = true;
			}
	
		}

		let currentSessionId = '';

		if(checkSession){
			req.hwSession = sessionStore[session];
			currentSessionId = session
			console.log('Session already exists.')
		}

		else{

			const uuid1 = uuid.v4();
			console.log('Session-generated:' + uuid1);
			currentSessionId = uuid1;
			sessionStore[uuid1] = {};
			req.hwSession = {};
			

			res.append('Set-Cookie','sessionId='+currentSessionId);

		}

		req.hwSession['sessionId'] = currentSessionId;
		

		next();

	}


}

module.exports = cookieid;