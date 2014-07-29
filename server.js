var PORT    = 9001; 
var NPOINTS = 10000; //only use numbers divisible by 10 for simplicity. Please?
var NNODES  = 5; //number of required connections to finish processing
var CNODES  = 0; //number of connections.
var DONE    = 0;
var PSUM    = 0; //total of processed points from the nodes. 
var net = require('net');
var code   = require('./codes');
var dataPattern= new RegExp(/DATA:[0-9]+/);
var doWrite  = false;

var server = net.createServer(function(socket){
	socket.on('data',function(input){
		console.log('data received: '+input.toString());
		_tmp = input.toString();
		switch(_tmp){
			case code.RDY: //client is ready to receive task
				CNODES++;
				data = '(ID:'+CNODES+'),(N:'+NPOINTS+'),(MAX:'+NNODES+')';				
				doWrite = true; 
				break;
			case code.OKY: //client has finished task
				data = code.EXT;// tell client to close connection
				doWrite = true;
				break;
			default:
				if(dataPattern.test(_tmp)){
					DONE++;
					PSUM+= parseFloat(_tmp.split(':')[1]);					
					console.log('PSUM = '+PSUM);	
					if(DONE == NNODES)
					{
						console.log('RESULT: '+PSUM*4/NPOINTS);
						server.close(function(){
							console.log('Closing server...');
						});
					}
				}
			break;		
		}		
		if(doWrite){
			console.log('writing '+data);
			socket.write(data);
			data = '';
			doWrite = false; //reset
		}			
	});
});

server.listen(PORT,function(e){
	address = server.address();
	console.log('Server opened on %j',address);
});
