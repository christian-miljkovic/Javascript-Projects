// warmUp.js
const net = require('net');
const HOST = '127.0.0.1';
const PORT = 8080;

function createResponse(status, body) {

	//remember that the response needs a whole empty line between the headers
	//and the body 
	return `HTTP/1.1 ${status} OK\r\nContent-Type: text/html\r\n\r\n${body}`;


}

//creating the server 
const server = net.createServer((sock) => {

	//listening to when the binary data comes in
	sock.on('data', (data) => {

		//a new line is represented by \r\n
		const response = createResponse(200,'<em>Hello</em> <strong>World</strong>');

		//write to the client and close the socket once done
		sock.write(response);

		sock.end();
		
	});





});

server.listen(PORT, HOST);

