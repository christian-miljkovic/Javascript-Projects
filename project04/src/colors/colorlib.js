//colorlib.js

module.exports.Color = class{

	constructor(name, hex){

		this.name = name;
		this.hex = hex;

		this.r = +this.hexToRed(hex);
		this.g = +this.hexToGreen(hex);
		this.b = +this.hexToBlue(hex);


	}

	hexToRed(hex){

		const rStr = hex.slice(1,3);

		const rDecimal = parseInt(rStr, 16);

		return rDecimal;

	}

	hexToGreen(hex){

		const gStr = hex.slice(3,5);

		const gDecimal = parseInt(gStr, 16);

		return gDecimal;

	}

	hexToBlue(hex){

		const bStr = hex.slice(5,hex.length);

		const bDecimal = parseInt(bStr, 16);

		return bDecimal;

	}

	generateShades(num, colorObj) {

		const shadeArray = [];

		let numShades = 1; //we make this one because we already get one shade from initial input
		while(numShades < num){

			//we use this just to make sure that we don't get the same
			//value by accident
			let checkSame = false;

			let rShade = this.r;
			let gShade = this.g;
			let bShade = this.b;

		
			const rShadeIndex = Math.floor(Math.random()*10);

			//chose random hex values because we only have a limited amount
			//of valid colors that are given to us so choose the most frequently occuring
			const rShadeArr = ['00','FF','FA','F5','F0','EE','DC','DA','D3','A9'];
			rShade = rShadeArr[rShadeIndex];

			if(rShade === (this.r).toString()){
				checkSame = true;
			}
	
		
			const gShadeIndex = Math.floor(Math.random()*10);
			const gShadeArr = ['00','FF','E4','FA','F8','F5','D3','69','A9','FB'];
			gShade = gShadeArr[gShadeIndex];

			if(gShade === (this.g).toString()){
				checkSame = true;
			}
		
		
			const bShadeIndex = Math.floor(Math.random()*10);
			const bShadeArr = ['00','FF','DC','FA','D3','F5','D3','22','A9','FB'];
			bShade = bShadeArr[bShadeIndex];

			if(bShade === (this.b).toString()){
				checkSame = true;
			}

			const colorHex = '#' + rShade + gShade + bShade;	
			
			//if the number was not the same as original and is contained
			//in the colorObject that we have defined in colors.js and that
			//we already didn't create the color previously
			// console.log("rShade: ", rShade);
			// console.log("colorHex: ", colorHex);
			// console.log("checkSame: ",!checkSame);
			// console.log("colorObj.hasOwnProperty(colorHex): ",colorObj.hasOwnProperty(colorHex));
			// console.log("!shadeArray.includes(colorObj[colorHex]): ",!shadeArray.includes(colorObj[colorHex]));

			if(!checkSame && colorObj.hasOwnProperty(colorHex) && (!shadeArray.includes(colorObj[colorHex]))){

				shadeArray.push(colorObj[colorHex]);
				numShades++;
			}
			
		}
		
		return shadeArray;
	}

};








