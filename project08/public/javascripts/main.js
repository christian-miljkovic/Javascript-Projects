//main.js
function main(){

	const btn = document.getElementById('filterBtn');

	btn.addEventListener('click',function clicked(evt){

		evt.preventDefault();

		const form = document.getElementById('filter-div');

		let location = form.loc.value;

		//just in case there are spaces in location
		//we will make it querystring friendly
		location = location.split(' ').join('%');

		//this is the cuisine
		const selector = form.sel.value;

		const req = new XMLHttpRequest();

		let url = 'http://localhost:3000/api/places';


		if(selector === ''){

			if(location !== ''){
				url += '?location='+location;
			}

		}
		else{

			url += '?';

			if(location !== ''){
				url += 'location='+location+'&';
			}

			url += 'cuisine='+selector;
		}
		

		//open the object to configure it
		req.open('GET',url,true);

		req.addEventListener('load', function(){

			if (req.status >= 200 && req.status < 400) {
				const messages = JSON.parse(req.responseText);
				
				const tdBody = document.getElementById('places-list');

				//first check to see if there are any existing nodes that must be removed to then update the table
				if(tdBody.childNodes.length >= 1){

					while (tdBody.hasChildNodes()){
						tdBody.removeChild(tdBody.lastChild);
					}
				}

				for(let i=0; i<messages.length;i++){

					const row = document.createElement('tr');


					for(let j=0; j<3;j++){

						const cell = document.createElement('td');

						let cellText = '';


						if(j===0){

							cellText = document.createTextNode(messages[i].name);
						}
						else if(j===1){

							cellText = document.createTextNode(messages[i].cuisine);

						}
						else{

							cellText = document.createTextNode(messages[i].location);

						}

						cell.appendChild(cellText);
						row.appendChild(cell);


						
					}

					tdBody.appendChild(row);

				}


			}
		});

		req.addEventListener('error', function(e) {
			console.log('uh-oh, something went wrong ' + e);
		});

		req.send();

	});

	const addBtn = document.getElementById('addBtn');

	addBtn.addEventListener('click',function clicked(evt){

		evt.preventDefault();

		const form = document.getElementById('create-div');

		const location = form.location.value;

		//just in case there are spaces in location
		//we will make it querystring friendly
		//location = location.split(' ').join('%');

		const name = form.name.value;

		const cuisine = form.cuisine.value;

		const req = new XMLHttpRequest();

		const url = 'http://localhost:3000/api/places/create';

		//open the object to configure it
		req.open('POST',url,true);

		req.setRequestHeader("Content-type", "application/x-www-form-urlencoded");

		req.addEventListener('load', function(){

			if (req.status >= 200 && req.status < 400) {

				const tdBody = document.getElementById('places-list');

				//first check to see if there are any existing nodes that must be removed to then update the table
				if(tdBody.childNodes.length >= 1){

					while(tdBody.hasChildNodes()){
						tdBody.removeChild(tdBody.lastChild);
					}
				}


				//adding all of the other restaurants available
				const req2 = new XMLHttpRequest();

				const url2 = 'http://localhost:3000/api/places';

				//open the object to configure it
				req2.open('GET',url2,true);

				req2.addEventListener('load',function(){

					if (req.status >= 200 && req.status < 400) {
						const messages2 = JSON.parse(req2.responseText);
						
						const tdBody = document.getElementById('places-list');

						for(let i=0; i<messages2.length;i++){

							const row = document.createElement('tr');


							for(let j=0; j<3;j++){

								const cell = document.createElement('td');

								let cellText = '';


								if(j===0){

									cellText = document.createTextNode(messages2[i].name);
								}
								else if(j===1){

									cellText = document.createTextNode(messages2[i].cuisine);

								}
								else{

									cellText = document.createTextNode(messages2[i].location);

								}

								cell.appendChild(cellText);
								row.appendChild(cell);


								
							}

							tdBody.appendChild(row);

						}


					}

				});	

				req2.addEventListener('error', function(e) {
					console.log('uh-oh, something went wrong in req2' + e);
				});

				req2.send();							

			}
		});

		req.addEventListener('error', function(e) {
			console.log('uh-oh, something went wrong in post req' + e);
		});		
		
		req.send('name=' + name+'&location='+location+'&cuisine='+cuisine);

	});
}

document.addEventListener('DOMContentLoaded', main);




