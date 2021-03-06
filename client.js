//takes in two arguments from the command line
//node client http://<hostname or ip>:<port>/ -v
//-v if you want the client to be chatty
var net    = require('net');
var url    = require('url'); 
var util   = require('./utilities/pi_utils'); //functions for data processing
var code   = require('./utilities/codes'); //code definitions
var TIMEOUT= 10000; //10s timeout
var URI    = process.argv[2];
var verbose= process.argv[3];
var ID     = 0;
var N      = 0;
var NNODES = 0; //max number of nodes
var isInit = false; 
var regExp = '[0-9]+';
var div    = 0;

verbose == '-v' ? console.log('>Parsing URI...') : '';
tmpURL = url.parse(URI,true,false);
ADD = tmpURL.hostname;
PORT= tmpURL.port;
verbose == '-v' ? console.log('>Creating socket...'):'';
socket = new net.Socket();
socket.setKeepAlive(true,10); //10ms delay

socket.setTimeout(TIMEOUT,function(){
	console.log('Connection timed out');
	socket.end();
});

verbose == '-v' ? console.log('>Connecting to server...'):'';
socket.connect(PORT,ADD,function(e){
	try{
		console.log('Connection to %j at %j successful',ADD,PORT);	
		socket.write(code.RDY); //tell server that client is ready to receive data
	}
	catch(e){
		
		console.log(e.code);
	}
});

socket.on('error',function(e){
	switch(e.code){
		case 'ECONNREFUSED':
			console.log('[ERROR] Cannot contact server. Check your network.');
			break;
	}
});

socket.on('data',function(data){
	/*
		incoming initialization data from the server is
		a string formatted as follows:
		(ID:x),(N:n),(MAX:m) where 
			ID - corresponds to the nth connection to the server. Used to 
				 compute the min and max range for each node;
			N  - corresponds to the number of points;
			MAX- corresponds to the maximum connections needed
				 by the server. Used as the divisor to compute the max range
				 for each node. 
	*/
	if(!isInit){ 	
		buff    = data.toString().split(',');
		ID      = buff[0].match(regExp);
		N       = buff[1].match(regExp);
		NNODES  = buff[2].match(regExp);
		if(verbose == '-v'){
			console.log('Bytes read: '+socket.bytesRead);
			console.log('ID  received: '+ID);
			console.log('N   received: '+N);
			console.log('MAX received: '+NNODES);
		}
		isInit = true;
		//process data. move to a callback. find out how. 
		if(ID == null || N == null || NNODES == null){
			console.log('Data error');
			socket.end();
		}
		if(ID <= NNODES){
			//the computation below is only valid (I think) for NNODES mod N = 0
			//a more general formula is required to cover most combinations of
			//N and NNODES
			console.time('Time Elapsed');
			div = N/NNODES;
			var min = (ID-1)*div + 1;
			var max = ID*div;
			verbose == '-v' ? console.log('Data range from %j to %j',min,max): '';
			
			//format output data to  DATA:n
			var num = util.estimatePI(min,max)
			socket.write('DATA:'+num);
			verbose == '-v' ? console.log('Processing data...'): '';			
			socket.write(code.OKY);	
			console.timeEnd('Time Elapsed');
		}
		else {
		//terminate connection if max number of connections has been reached. 
		//could be set from the server too. 
			verbose == '-v' ? console.log('Maximum number of allowable nodes has been reached'): '';
			console.log('Closing connection...');
			socket.end();
		}
	}		
	if(data.toString() == code.EXT){//exit code sent by the server
		socket.end();
	}
});


