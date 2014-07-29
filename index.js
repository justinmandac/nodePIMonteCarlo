var spawn = require('child_process');
var CHILD_COUNT = process.argv[2];
var SOCKET_ADDR = process.argv[3];
var cmd_str = 'node client.js '+SOCKET_ADDR;

for(var i = 0 ; i < CHILD_COUNT; i++){
	var client = spawn.exec(cmd_str, function(error,stdout,stderr){
		if(error){
			console.log(error.stack);
		}
		console.log('stdout: '+stdout);
		console.log('stderr: '+stderr);
	});
	client.on('exit',function(code){
		console.log('Child process exited with code '+code);
	});
}