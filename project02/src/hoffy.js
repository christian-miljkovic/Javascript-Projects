// hoffy.js
var fs = require('fs');

	module.exports.sum = function(num1, num2, ...numn){

		if(numn === undefined || num1 === undefined || num2 === undefined){
			return 0;
		}

		const arr = [num1,num2,...numn];

		const answer = arr.reduce(function(sum, num){

			return sum + num;

		},0);

		return answer;
	}

	module.exports.repeatCall = function(fn, n, arg){

		const arr = Array(n).fill(arg);
		

		arr.map(function(arg){

			fn(arg);

		});

	}

	module.exports.repeatCallAllArgs = function(fn, n, args1, ...argsn){

		const arr = [args1,...argsn];
		const arr2 = Array(n).fill(arr);

		arr2.map(function(args){

			//when you have an array and then use the spread operator 
			//it automatically spreads out the array into individual items
			fn(...args);

		});


	}

	module.exports.maybe = function(fn){

		return function(fx){

			//check if the arguments are valid
			const args = [...arguments];
			
			//if they aren't then return undefined
			if(args.indexOf(undefined) > -1 || args.indexOf(null) > -1){

				return undefined;
			}

			else{

				//if they are valid then return the function
				return fn(...args);

			}


		};

	}

	module.exports.constrainDecorator = function(fn, min, max){


		const args = [...arguments];
		

		if(args.length>1){

			return function(...arguments){


				//have to place arguments into an array if you want
				//to later pass them into the function
				let arr = [...arguments];

				let answer = fn(arr);

				if(answer > max){

					return max;
				}

				else if(answer < min){

					return min;
				}

				else{

					return answer;
				}


			};
		}


		else{

			return fn;
	}
}


	module.exports.limitCallsDecorator = function(fn, n){

		//a function is an object and we are incrementing its "data field"
		//0 here
		let count = 0;

		//whenever we call our function "object" it returns something
		return function(fn){


			if(count>=n){

				return undefined;
			}

			else{

				count++;
				const answer = fn;

				return answer;
			}


		};
	}


	//{return n % 2 === 0;} 


	module.exports.filterWith = function(fn){

		//we get the arguments aka the function 
		const func = [...arguments];

		//then we get the second input and filter it with original function
		return function(args){

			const answer = args.filter(fn);

			return answer;

		}



	}

	module.exports.simpleINIParse= function(s){


		const splitBySlash = s.split("\n");


		let array = splitBySlash.filter(function(group){


			if(group.indexOf('=')){

				return group;

			}


		});

		
		 array = splitBySlash.map(function(pairs){

			const temp = pairs + "";
			return pairs.split('=');



		});

		array = array + '';
		array = array.split(',');


		//get rid of any words that either had only one or not the other half of the correct
		//set up
		let cleanArray = array.filter(function(group){

				if(group !== ''){

					return group;

				}
				else{
					return '';
				}
			
		});


		//get rid of any duplicates
		cleanArray = array.filter(function(word, index, array){

		
			

			if((array.indexOf(word) < index) && (word!== '')){

				array = array.splice(array.indexOf(word),2);

			}

			return array;

		});


		const obj = {};

		//now reduce the array into an object
		const answer = cleanArray.reduce(function(obj, word, index, arr){

			if(index%2 === 0 && index < arr.length-1){

				

				obj[word] = arr[index+1];

			}

			return obj;

		},{})

		return answer;


	}

	module.exports.readFileWith= function(fn){


		return function(fileName, callback){


			const fsBuffer = {};

			fs.readFile(fileName, 'utf8', function(err, data) {
				if(err){

					console.log('Unable to read this file');
					callback(err,undefined);

				}

				else{

					fsBuffer = fn(data);
					callback(err, fsBuffer);

				}

		});

		};


	}

















