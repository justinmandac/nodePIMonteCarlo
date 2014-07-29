var process = require('child_process');
var cmd_str = 'node client.js http://localhost:9001/';

for(var i = 0 ; i < 5; i++){
	var client = process.exec(cmd_str, function(error,stdout,stderr){
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