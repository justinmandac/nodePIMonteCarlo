nodePIMonteCarlo
================

Distributed computation of PI estimation using Montecarlo method implemented using sockets. <br>
Custom 'headers' used.<br>
Server runs on port _9001_. Modify the port as you wish. Indicate `-v` upon invocation to activate verbose mode. <br>
The client requires one argument from the command line - the server's URI e.g. `http:\\10.100.205.49:9001\`. 
Run the files in their own CLI. <br>
Use `index.js` to spawn child processes. Ensure that the server is running first.<br>
`index.js` accepts two command line arguments: the number of processes to spawn and the socket address.
