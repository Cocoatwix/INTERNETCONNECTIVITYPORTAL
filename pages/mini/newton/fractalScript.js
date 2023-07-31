
"use strict"

const fractalCanvas = document.getElementById("fractalCanvas");
const ctx = fractalCanvas.getContext("2d");

//var canvasWidth  = 0.5*window.innerWidth;
//var canvasHeight = 0.5*window.innerHeight;

var canvasWidth = 1280;
var canvasHeight = 720;
var aspectRatio = canvasHeight/canvasWidth;

var iterations = 1000;
var xFocus = -0.003;
var yFocus = 0.075;
var zoom = 128; //0.03125

var xWidth = zoom;
var yWidth = zoom*aspectRatio;
var xStart = xFocus - xWidth/2;
var yStart = yFocus - yWidth/2;

var foundRoots = []; //Will hold all the noticably different roots
var colours = ["#339933", "#993399", "#993311", "#113399"]

const pixelSize = 1;
const minRootDifference = 0.1; //How far away roots need to be to be considered different

const log3 = Math.log(3);


function iteration_function(coords)
/** Our function to use for generating the Newton fractal. */
{
	//coords = [x, y]
	const x = coords[0];
	const y = coords[1];
	return [Math.exp(x*log3)*Math.cos(y*log3) - x*x*x + 3*x*y*y,
	        Math.exp(x*log3)*Math.sin(y*log3) - 3*x*x*y + y*y*y]
}

function iteration_derivative(coords)
/** Our derivative to use for generating the Newton fractal. */
{
	const x = coords[0];
	const y = coords[1];
	return [log3*Math.exp(x*log3)*Math.cos(y*log3) - 3*x*x + 3*y*y,
	        log3*Math.exp(x*log3)*Math.sin(y*log3) - 6*x*y];
}


function newton_method(f, df, coords, iterations)
/** Performs Newton's Method on the given functions and input x.
    Returns the resulting number. */
{
	let tempX = coords[0];
	let tempY = coords[1];
	let func, deriv;
	
	for (let i = 0; i < iterations; i += 1)
	{
		func  = f([tempX, tempY]);
		deriv = df([tempX, tempY]);
		
		//If the derivative isn't real
		//This prevents division by zero issues.
		if (deriv[1] != 0)
		{
			tempX = (deriv[0]*func[0]/deriv[1] + func[1]) / (deriv[0]*deriv[0]/deriv[1] + deriv[1]);
			tempY = (deriv[0]*tempX - func[0])/deriv[1];
		}
		
		else
		{
			tempX = func[0]/deriv[0];
			tempY = func[1]/deriv[0];
		}
		
		if (isNaN(tempX) || isNaN(tempY))
			break;
	}
	
	return [tempX, tempY];
}

//Here's where the actual drawing happens
let iterDest;   //Holds the value our points iterate to
let xPos, yPos; //Holds the actual coordinates of the point we want to iterate
let newRoot;    //Whether the root we found is new or not
let rootIndex;  //Holds the position of our root in the list

for (let yPixel = 0; yPixel < canvasHeight; yPixel += pixelSize)
{
	yPos = yStart + yWidth*yPixel/canvasHeight;
	
	for (let xPixel = 0; xPixel < canvasWidth; xPixel += pixelSize)
	{
		xPos = xStart + xWidth*xPixel/canvasWidth;
		iterDest = [xPos, yPos];
		
		iterDest = newton_method(iteration_function, iteration_derivative, iterDest, iterations);
		
		if ((!isNaN(iterDest[0])) && (!isNaN(iterDest[1])) &&
		    (iterDest[1] != 0))
		{
			if (foundRoots.length == 0)
			{
				foundRoots.push([iterDest[0], iterDest[1]]);
				rootIndex = 0;
			}
			
			else //Check to see if our destination is close enough to a root we've already found
			{
				newRoot = true;
				rootIndex = 0;
				for (let root of foundRoots)
				{
					if ((Math.abs(root[0] - iterDest[0]) < minRootDifference) &&
							(Math.abs(root[1] - iterDest[1]) < minRootDifference))
					{
						newRoot = false;
						break;
					}
					rootIndex += 1;
				}
				
				if (newRoot)
					foundRoots.push([iterDest[0], iterDest[1]]);
			}
			
			ctx.fillStyle = colours[rootIndex];
			ctx.fillRect(xPixel, yPixel, pixelSize, pixelSize);
		}
	}
}

console.log(foundRoots);
