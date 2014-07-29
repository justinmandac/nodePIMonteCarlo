/*
	From  http://blog.tompawlak.org/how-to-generate-random-values-nodejs-javascript
*/
function random(min,max){
	return Math.random()*(max-min) + min;
}
/*
 * Generates a random point - returned as a 2d array. 
	Returned values can be described as:
   (x_min <= xcoord <= xmax, y_min <= ycoord <= y_max) 
 */
function randomPoint(x_min,y_min,x_max,y_max){
  var point = [' ',' '];
  point[0] = random(x_min,x_max);
  point[1] = random(y_min,y_max);
  return point
}
function distance(x1,y1,x2,y2){
	var x = x2 - x1;
	var y = y2 - y1;
	var dist = Math.sqrt(x*x + y*y);
	return dist;
}
function distanceFromOrigin(point){
	var x1 = 0;
	var y1 = 0;
	
	return distance(x1,y1,point[0],point[1]);
}
/*
	Takes in an array to represent a Cartesian point.
*/
function isWithinUnitCircle(point){
	return distanceFromOrigin(point) < 1;
}

var estimatePI = function (n_start,n_end){
  var inCircle = 0;
  for(i = n_start; i <= n_end; i++){
	if(isWithinUnitCircle(randomPoint(-1,-1,1,1))){
		inCircle++;
	}
  }
  return inCircle;
}

exports.estimatePI = estimatePI;

