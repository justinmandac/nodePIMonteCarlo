//http://jlunaquiroga.blogspot.com/2014/03/creating-processes-in-nodejs.html

var spawn = require('child_process');
var CHILD_COUNT  = process.argv[2];
var SOCKET_ADDR  = process.argv[3];
var CLIENT_OPTION= process.argv[4];
var SERVER_OPTION= process.argv[5];
var client_scr = 'client.js';
var server_scr = 'server.js';
var client_str = 'node '+client_scr+' '+SOCKET_ADDR+' '+CLIENT_OPTION;
var server_str = 'node '+server_scr+' '+CHILD_COUNT+' '+SERVER_OPTION;

var server = spawn.exec(server_str,function(error,stdout,stderr){
	if(error){
		console.log(error.stack);
	}
	console.log('stdout: '+stdout);
	console.log('stderr: '+stderr);
});
server.on('exit',function(code){
	console.log('[SERVER] Child process exited with code '+code);
});

for(var i = 0 ; i < CHILD_COUNT; i++){
	var client = spawn.fork(client_scr,[SOCKET_ADDR,CLIENT_OPTION]);
	client.on('exit',function(code){
		console.log('[CLIENT] Child process exited with code '+code);
	});
}