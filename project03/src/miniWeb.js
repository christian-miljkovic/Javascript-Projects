// miniWeb.js
// evenWarmer.js
const net = require('net');
const fs = require('fs');
const HOST = '127.0.0.1';
const PORT = 8080;


/*
Helper funciton to create a response to an HTTP request
@param status: the status
@para body: the body to return
*/
function createResponse(status, body, contentType) {

	//remember that the response needs a whole empty line between the headers
	//and the body 
	return `HTTP/1.1 ${status} OK\r\nContent-Type: `+ contentType +`\r\n\r\n${body}`;

}

/**
 * Request object - takes http request string and parses out path
 * @param httpRequest - http request as string
 */
class Request{
    constructor(httpRequest) {
        
    	const requestStr = httpRequest.split("\r\n");

    	const method = requestStr[0].split(' ')[0];
    	const path = requestStr[0].split(' ')[1];

    	const headers = {};

    	//we stop -2 from the end of the array because the last two elements
    	//are an empty string and then the body, start from 1 because the first
    	//location contains the method and path which we already got
    	for(let i=1; i<requestStr.length-2;i++){

    		const oneHeader = requestStr[i].split(': ');

    		headers[oneHeader[0]] = oneHeader[1];

    	}

    	const body = requestStr[requestStr.length-1];

    	this.path = path;
    	this.method = method;
    	this.headers = headers;

    	if(body !== undefined){
    		this.body = body;	
    	}
    	else{
    		this.body = '';
    	}
    	


    }

    toString(){

    	//have to get the keys of the header object so we can loop through it
    	const header = Object.keys(this.headers);
    	
    	let headerString = '';

    	for(let i=0; i<header.length; i++){
    									//this gets the actual object then uses the keys to get the value
    		headerString += header[i] +': '+ this.headers[header[i]] + '\r\n';

    	}

    	return this.method + ' '+ this.path +' '+ 'HTTP/1.1\r\n' + headerString +'\r\n' + this.body;


    }
}

const codes = {

    200 : 'OK',
    404 : 'Not Found',
    500 : 'Internal Server Error',
    400 : 'Bad Request',
    301 : 'Moved Permanently',
    302 : 'Found',
    303 : 'See Other'
}


class Response{

	constructor(socket){

		this.sock = socket;
		this.headers = {};
		this.body = '';
		this.statusCode = 0;

	}

    

	setHeader(name, value){

        this.headers[name] = value;

    }

    //when an application makes a connection it does it through connecting to the socket
    //therefore when you write data to the socket you are writing to the connection/application
    write(data){

        this.sock.write(data);
    }

    end(s){

        this.sock.end(s);
    }

    send(statusCode, body){

        this.statusCode = statusCode;
        this.body = body;

        const response = this.toString();

        this.sock.end(response);
    }

    writeHead(statusCode){

        const header = Object.keys(this.headers);

        let headerString = '';

        for(let i=0; i<header.length; i++){
                                        //this gets the actual object then uses the keys to get the value
            headerString += header[i] +': '+ this.headers[header[i]] + '\r\n';

        }

        this.statusCode = statusCode;

        const headerStr = 'HTTP/1.1 '+this.statusCode +' '+ codes[this.statusCode] +'\r\n'+
            headerString + '\r\n';

        this.sock.write(headerStr);
    }

    redirect(statusCode, url){

        if(arguments.length !== 2){
        
           this.statusCode = 301;
           this.setHeader('Location', statusCode);

        }

        else{

            this.statusCode = statusCode;
            this.setHeader('Location', url);
        }

        const response = this.toString();


        this.end(response);
    }

    toString(){
        const header = Object.keys(this.headers);

        let headerString = '';

        for(let i=0; i<header.length; i++){
                                        //this gets the actual object then uses the keys to get the value
            headerString += header[i] +': '+ this.headers[header[i]] + '\r\n';

        }        

        return 'HTTP/1.1 ' + this.statusCode + ' ' + codes[this.statusCode] + '\r\n' +
        headerString + '\r\n' + this.body;

    }


    sendFile(fileName){

        const fileAbs = __dirname + '/../public/';
        const fileAbsPath = fileAbs + fileName;

        //get the last four chars then check if the first one is a dot
        let prefix = fileName.split(".")[1];

        //now figure out the extension so that you can add it to the Response object
        const extend = {

            'jpeg': 'image/jpeg',
            'jpg': 'image/jpeg',
            'png': 'image/png',
            'gif': 'image/gif',
            'html': 'text/html',
            'css': 'text/css',
            'txt': 'text/plain'

        };

        //this.contentType = extend[prefix];
      
        this.setHeader('Content-Type', extend[prefix]);

        //depending upon the prefix we will add the context to the read file method
        if(prefix === 'html' || prefix === 'css' || prefix === 'txt'){


            fs.readFile(fileAbsPath,{'encoding':'utf8'},(err, data) => {

                this.handleRead(err,data);
                
            });
            
        }
        else{

            //none if this is an image type
            fs.readFile(fileAbsPath,{},(err, data) => {this.handleRead(err,data);});

        }

        
    };


    //this is the function that we will pass as a callback 
    //to the readFile function in sendFile
    handleRead(err, data) {

        if(err){

            this.send(500, err);

        }

        else{

            this.writeHead(200);

            this.write(data);  

            this.end();  

        }

    };

}

module.exports.App = class{

	constructor(){
		this.server = net.createServer(this.handleConnection.bind(this));
		this.routes = {};
	
	}

	//we will use this to set the callback function which in many cases will just be
	//sending a file or image
	get(path, cb){

		this.routes[path] = cb;
	
	}

	listen(port, host){

		this.server.listen(port, host);
	}

	handleConnection(sock){


		sock.on('data',this.handleRequestData.bind(this, sock));
	}

	handleRequestData(sock, binaryData){


		const httpRequest = binaryData.toString();

		const req = new Request(httpRequest);

		const res = new Response(sock);

		console.log(req.toString())

		//check the host status
		const hostStatus = req.headers['Host'];
		if(hostStatus === 400){

			res.send(400,'Request is not valid');
		}

		else{
			let checkPath = req.path;
			
			if((checkPath.slice(checkPath.length-1)=== '/') && checkPath.length > 1){

				checkPath = checkPath.slice(0,checkPath.length-1);
			}

			const pathKeys = Object.keys(this.routes);

			if(pathKeys.includes(checkPath)){

				//pass the request and response object into the specified callback function
				this.routes[checkPath](req,res);
			}
			else{

				res.setHeader("Content-Type:", "text/html");
				res.statusCode = 404;
				res.send(404, checkPath+'doesn\'t exist.');
			}
		}

		//this is when the connection is closed (whenever we talk about connections
		//we are talking about the socket)
		sock.on('close', this.logResponse.bind(this, req, res));

	}

	logResponse(req, res){

		console.log(req.method + ' ' + req.path + ' ' + res.statusCode + ' ' + codes[res.statusCode]);

	}

}









