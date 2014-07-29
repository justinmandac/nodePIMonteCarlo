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
/*
	Takes in an array to represent a Cartesian point.
*/
function isWithinUnitCircle(point){
  return (point[0] >= -1 && point[0] <= 1 ) && (point[1] >= -1 && point[1] <= 1 );
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

