nodePIMonteCarlo
================

Distributed computation of PI estimation using Montecarlo method implemented using sockets. <br>
Custom 'headers' used.<br>
Server runs on port _9001_. Modify the port as you wish. Indicate `-v` upon invocation to activate verbose mode. <br>
The client requires one argument from the command line - the server's URI e.g. `http:\\10.100.205.49:9001\`. 
Run the files in their own CLI. <br>
Use `index.js` to spawn child processes. Starts the server upon execution<br>
`index.js` accepts 5 command line arguments: **the no. of processes to spawn**,**the socket address**, **the no. of points to use**,**verbosity toggle for clients**, and **verbosity toggle for server**.
