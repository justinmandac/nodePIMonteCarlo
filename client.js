//takes in one argument from the command line
// http://<hostname or ip>:<port>/
var net    = require('net');
var url    = require('url'); 
var util   = require('./pi_utils'); //functions for data processing
var code   = require('./codes'); //code definitions
var TIMEOUT= 100000; //100s timeout
var URI    = process.argv[2];
var ID     = 0;
var N      = 0;
var NNODES = 0; //max number of nodes
var isInit = false; 
var regExp = '[0-9]+';
var div    = 0;

tmpURL = url.parse(URI,true,false);
ADD = tmpURL.hostname;
PORT= tmpURL.port;

socket = new net.Socket();
socket.setKeepAlive(true,10); //10ms delay
/*
socket.setTimeout(TIMEOUT,function(){
	console.log('Connection timed out');
	socket.end();
});
*/
socket.connect(PORT,ADD,function(e){
	try{
		console.log('Connection to %j at %j successful',ADD,PORT);	
		socket.write(code.RDY); //tell server that client is ready to receive data
	}
	catch(e){
		console.log(e.code);
	}
});

socket.on('data',function(data){
	/*
		incoming initialization data from the server is
		a string formatted as follows:
		(ID:x),(N:n),(MAX:m) where 
			ID - corresponds to the nth connection to the server;
			N  - corresponds to the number of points
			MAX- corresponds to the maximum connections needed
				 by the server
	*/
	if(!isInit){ 
		buff = data.toString().split(',');
		console.log('Bytes read: '+socket.bytesRead);
		console.log('ID  received: '+(ID = buff[0].match(regExp)));
		console.log('N   received: '+(N  =buff[1].match(regExp)));
		console.log('MAX received: '+(NNODES  =buff[2].match(regExp)));
		isInit = true;
		//process data. move to a callback. find out how. 
		
		if(ID <= NNODES){
			div = N/NNODES;
			var min = (ID-1)*div + 1;
			var max = ID*div;
			console.log('Data range from %j to %j',min,max);
			
			//format output data to  DATA:n
			var num = util.estimatePI(min,max)
			socket.write('DATA:'+num);
			console.log('Processing data...');			
			socket.write(code.OKY);		
		}
		else {
		//terminate connection if max number of connections has been reached. 
		//could be set from the server too. 
			console.log('Maximum number of allowable nodes has been reached');
			console.log('Closing connection...');
			socket.end();
		}
	}		
	if(data.toString() == code.EXT){
		socket.end();
	}
});


