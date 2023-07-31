"use strict";

const CANVAS   = document.getElementById("squareCanvas");
const CCONTEXT = CANVAS.getContext("2d");

//How we get all the display settings from the user
const CONTROLDIV        = document.getElementById("controlDiv");
const DISPLAYCONTROLDIV = document.getElementById("displayControlDiv");
const COLOURCONTROLDIV  = document.getElementById("colourControlDiv");

var theState = {"draggingPoint":       false, //Are we currently dragging the point?
                "squareToShow":        "all", //"left", "right", "all", "none"
								"topDividingLines":    true,  //Do we show the dotted lines on top?
								"bottomDividingLines": true,  //Do we show the dotted lines on bottom?
								"innerLine":           true,  //Do we draw the inner line from the true center?
								"topTriangle1":        false, //Do we show the first top triangle?
								"bottomTriangle1":     false, //Do we show the first bottom triangle?
								"topTriangle2":        false, //Do we show the second top triangle?
								"bottomTriangle2":     false, //Do we show the second bottom triangle?
								};

const CDIMS       = [CANVAS.width, CANVAS.height];
var   pointCoords = [CDIMS[0]/2, CDIMS[1]/2]; //This is where the "center" point of the square will be drawn

const CCOORDS = [(window.innerWidth - CDIMS[0])/2, 11]; //Where the canvas is in the window's coords system

const CBACKGROUND      = "#DDDDDD";
const SQUARELINECOLOR  = "#999999";
const SQUARETHICKNESS  = 5;
const SQUAREDASH       = [10, 10];

const POINTRADIUS = 7;
const POINTCOLOR  = "#78CD78";

//I want the square to have a width of 75% the canvas
const SQUARESIZE  = 0.75;
const SQUARESTART = (1-SQUARESIZE)/2;
const SQUAREEND   = (1+SQUARESIZE)/2;

//Thanks, color-name.com
const TOPTRIANGLECOLOR1    = "#78DE56";
const TOPTRIANGLECOLOR2    = "#BCDE56";
const BOTTOMTRIANGLECOLOR1 = "#BC56DE";
const BOTTOMTRIANGLECOLOR2 = "#DE56BC";

/* //I didn't know there was already a way to draw dashed lines lol... 
CCONTEXT.dottedLineTo = function(startX, startY, endX, endY, dashLength)
{
	this.moveTo(startX, startY);
	
	let lineLength = Math.sqrt((endX - startX)**2 + (endY - startY)**2);
	let numOfDashSpaces = lineLength/dashLength;
	
	//How much to increment x and y after each dash we draw
	let deltaX = (endX - startX)/numOfDashSpaces;
	let deltaY = (endY - startY)/numOfDashSpaces;
	
	let currX = startX;
	let currY = startY;
	
	//Draw our dashes
	for (let i = 0; i < Math.round(numOfDashSpaces/2); i += 1)
	{
		this.lineTo(currX + deltaX, currY + deltaY);
		currX += deltaX;
		currY += deltaY;
		this.moveTo(currX + deltaX, currY + deltaY);
		currX += deltaX;
		currY += deltaY;
	}
}
*/


function draw_square()
/** Function to draw the boundary of the square. */
{
	CCONTEXT.lineWidth   = SQUARETHICKNESS;
	CCONTEXT.strokeStyle = SQUARELINECOLOR;

	CCONTEXT.beginPath();
	if ((theState["squareToShow"] == "all") ||
	    (theState["squareToShow"] == "none"))
		CCONTEXT.rect(CDIMS[0]*SQUARESTART, CDIMS[1]*SQUARESTART, CDIMS[0]*SQUARESIZE, CDIMS[1]*SQUARESIZE);
	else
	{
		//Top left and bottom right quadrants
		if (theState["squareToShow"] == "left")
		{
			CCONTEXT.moveTo(CDIMS[0]*SQUARESTART, CDIMS[1]*SQUARESTART);
			CCONTEXT.lineTo(CDIMS[0]/2, CDIMS[1]*SQUARESTART);
			CCONTEXT.moveTo(CDIMS[0]*SQUARESTART, CDIMS[1]*SQUARESTART);
			CCONTEXT.lineTo(CDIMS[0]*SQUARESTART, CDIMS[1]/2);
			
			CCONTEXT.moveTo(CDIMS[0]*SQUAREEND, CDIMS[1]*SQUAREEND);
			CCONTEXT.lineTo(CDIMS[0]/2, CDIMS[1]*SQUAREEND);
			CCONTEXT.moveTo(CDIMS[0]*SQUAREEND, CDIMS[1]*SQUAREEND);
			CCONTEXT.lineTo(CDIMS[0]*SQUAREEND, CDIMS[1]/2);
		}
		
		//Top right and bottom left quadrants
		else if (theState["squareToShow"] == "right")
		{
			CCONTEXT.moveTo(CDIMS[0]*SQUAREEND, CDIMS[1]*SQUARESTART);
			CCONTEXT.lineTo(CDIMS[0]/2, CDIMS[1]*SQUARESTART);
			CCONTEXT.moveTo(CDIMS[0]*SQUAREEND, CDIMS[1]*SQUARESTART);
			CCONTEXT.lineTo(CDIMS[0]*SQUAREEND, CDIMS[1]/2);
			
			CCONTEXT.moveTo(CDIMS[0]*SQUARESTART, CDIMS[1]*SQUAREEND);
			CCONTEXT.lineTo(CDIMS[0]*SQUARESTART, CDIMS[1]/2);
			CCONTEXT.moveTo(CDIMS[0]*SQUARESTART, CDIMS[1]*SQUAREEND);
			CCONTEXT.lineTo(CDIMS[0]/2, CDIMS[1]*SQUAREEND);
		}
	}
	CCONTEXT.stroke();
}


function draw_inner_squares()
/** Function to draw dashed line inside the square for explanation purposes. */
{
	CCONTEXT.setLineDash(SQUAREDASH);
	
	//Top left and bottom right quadrants
	if (theState["squareToShow"] == "left")
	{
		if (theState["topDividingLines"])
		{
			CCONTEXT.beginPath();
			CCONTEXT.moveTo(CDIMS[0]/2, CDIMS[1]*SQUARESTART);
			CCONTEXT.lineTo(CDIMS[0]/2, CDIMS[1]/2);
			CCONTEXT.lineTo(CDIMS[0]*SQUARESTART, CDIMS[1]/2);
			CCONTEXT.stroke();
		}
		
		if (theState["bottomDividingLines"])
		{
			CCONTEXT.beginPath();
			CCONTEXT.moveTo(CDIMS[0]/2, CDIMS[1]*SQUAREEND);
			CCONTEXT.lineTo(CDIMS[0]/2, CDIMS[1]/2);
			CCONTEXT.lineTo(CDIMS[0]*SQUAREEND, CDIMS[1]/2);
			CCONTEXT.stroke();
		}
	}
	
	//Top right and bottom left quadrants
	else if (theState["squareToShow"] == "right")
	{
		if (theState["topDividingLines"])
		{
			CCONTEXT.beginPath();
			CCONTEXT.moveTo(CDIMS[0]/2, CDIMS[1]*SQUARESTART);
			CCONTEXT.lineTo(CDIMS[0]/2, CDIMS[1]/2);
			CCONTEXT.lineTo(CDIMS[0]*SQUAREEND, CDIMS[1]/2);
			CCONTEXT.stroke();
		}
		
		if (theState["bottomDividingLines"])
		{
			CCONTEXT.beginPath();
			CCONTEXT.moveTo(CDIMS[0]/2, CDIMS[1]*SQUAREEND);
			CCONTEXT.lineTo(CDIMS[0]/2, CDIMS[1]/2);
			CCONTEXT.lineTo(CDIMS[0]*SQUARESTART, CDIMS[1]/2);
			CCONTEXT.stroke();
		}
	}
	
	CCONTEXT.setLineDash([]); //Hopefully this is okay
}


function draw_inner_line()
/** Draws a line from the "center" point to the true center. */
{
	CCONTEXT.beginPath();
	CCONTEXT.setLineDash(SQUAREDASH);
	CCONTEXT.moveTo(CDIMS[0]/2, CDIMS[1]/2);
	CCONTEXT.lineTo(pointCoords[0], pointCoords[1]);
	CCONTEXT.stroke();
	CCONTEXT.setLineDash([]);
}


function draw_point()
/** Function to draw the "center" point of the square. */
{
	CCONTEXT.fillStyle = POINTCOLOR;
	
	CCONTEXT.beginPath();
	CCONTEXT.arc(pointCoords[0], pointCoords[1], POINTRADIUS, 0, 2*Math.PI);
	CCONTEXT.fill();
}


function draw_dividers()
/** Function for drawing the sections inside the square. */
{
	CCONTEXT.beginPath();
	CCONTEXT.moveTo(CDIMS[0]/2, CDIMS[1]*SQUARESTART);
	CCONTEXT.lineTo(pointCoords[0], pointCoords[1]);
	CCONTEXT.moveTo(CDIMS[0]*SQUARESTART, CDIMS[1]/2);
	CCONTEXT.lineTo(pointCoords[0], pointCoords[1]);
	CCONTEXT.moveTo(CDIMS[0]/2, CDIMS[1]*SQUAREEND);
	CCONTEXT.lineTo(pointCoords[0], pointCoords[1]);
	CCONTEXT.moveTo(CDIMS[0]*SQUAREEND, CDIMS[1]/2);
	CCONTEXT.lineTo(pointCoords[0], pointCoords[1]);
	CCONTEXT.stroke();
}


function draw_triangles()
/** Draws coloured triangles inside the square to help with visualisation. */
{
	CCONTEXT.globalAlpha = 0.5;
	
	//Top left, bottom right
	if (theState["squareToShow"] == "left")
	{
		if (theState["topTriangle1"])
		{
			CCONTEXT.fillStyle = TOPTRIANGLECOLOR1;
			CCONTEXT.beginPath();
			CCONTEXT.moveTo(CDIMS[0]*SQUARESTART, CDIMS[1]/2);
			CCONTEXT.lineTo(CDIMS[0]/2, CDIMS[1]/2);
			CCONTEXT.lineTo(pointCoords[0], pointCoords[1]);
			CCONTEXT.closePath();
			CCONTEXT.fill();
		}
		
		if (theState["topTriangle2"])
		{
			CCONTEXT.fillStyle = TOPTRIANGLECOLOR2;
			CCONTEXT.beginPath();
			CCONTEXT.moveTo(CDIMS[0]/2, CDIMS[1]*SQUARESTART);
			CCONTEXT.lineTo(CDIMS[0]/2, CDIMS[1]/2);
			CCONTEXT.lineTo(pointCoords[0], pointCoords[1]);
			CCONTEXT.closePath();
			CCONTEXT.fill();
		}
		
		if (theState["bottomTriangle1"])
		{
			CCONTEXT.fillStyle = BOTTOMTRIANGLECOLOR1;
			CCONTEXT.beginPath();
			CCONTEXT.moveTo(CDIMS[0]*SQUAREEND, CDIMS[1]/2);
			CCONTEXT.lineTo(CDIMS[0]/2, CDIMS[1]/2);
			CCONTEXT.lineTo(pointCoords[0], pointCoords[1]);
			CCONTEXT.closePath();
			CCONTEXT.fill();
		}
		
		if (theState["bottomTriangle2"])
		{
			CCONTEXT.fillStyle = BOTTOMTRIANGLECOLOR2;
			CCONTEXT.beginPath();
			CCONTEXT.moveTo(CDIMS[0]/2, CDIMS[1]*SQUAREEND);
			CCONTEXT.lineTo(CDIMS[0]/2, CDIMS[1]/2);
			CCONTEXT.lineTo(pointCoords[0], pointCoords[1]);
			CCONTEXT.closePath();
			CCONTEXT.fill();
		}
	}
	
	//Top right, bottom left
	else if (theState["squareToShow"] == "right")
	{
		if (theState["topTriangle1"])
		{
			CCONTEXT.fillStyle = TOPTRIANGLECOLOR1;
			CCONTEXT.beginPath();
			CCONTEXT.moveTo(CDIMS[0]*SQUAREEND, CDIMS[1]/2);
			CCONTEXT.lineTo(CDIMS[0]/2, CDIMS[1]/2);
			CCONTEXT.lineTo(pointCoords[0], pointCoords[1]);
			CCONTEXT.closePath();
			CCONTEXT.fill();
		}
		
		if (theState["topTriangle2"])
		{
			CCONTEXT.fillStyle = TOPTRIANGLECOLOR2;
			CCONTEXT.beginPath();
			CCONTEXT.moveTo(CDIMS[0]/2, CDIMS[1]*SQUARESTART);
			CCONTEXT.lineTo(CDIMS[0]/2, CDIMS[1]/2);
			CCONTEXT.lineTo(pointCoords[0], pointCoords[1]);
			CCONTEXT.closePath();
			CCONTEXT.fill();
		}
		
		if (theState["bottomTriangle1"])
		{
			CCONTEXT.fillStyle = BOTTOMTRIANGLECOLOR1;
			CCONTEXT.beginPath();
			CCONTEXT.moveTo(CDIMS[0]*SQUARESTART, CDIMS[1]/2);
			CCONTEXT.lineTo(CDIMS[0]/2, CDIMS[1]/2);
			CCONTEXT.lineTo(pointCoords[0], pointCoords[1]);
			CCONTEXT.closePath();
			CCONTEXT.fill();
		}
		
		if (theState["bottomTriangle2"])
		{
			CCONTEXT.fillStyle = BOTTOMTRIANGLECOLOR2;
			CCONTEXT.beginPath();
			CCONTEXT.moveTo(CDIMS[0]/2, CDIMS[1]*SQUAREEND);
			CCONTEXT.lineTo(CDIMS[0]/2, CDIMS[1]/2);
			CCONTEXT.lineTo(pointCoords[0], pointCoords[1]);
			CCONTEXT.closePath();
			CCONTEXT.fill();
		}
	}
	
	CCONTEXT.globalAlpha = 1.0;
}


function draw_diagram()
/** Draws the full diagram. */
{
	CCONTEXT.fillStyle = CBACKGROUND;
	CCONTEXT.fillRect(0, 0, CDIMS[0], CDIMS[1]);
	
	if ((theState["squareToShow"] != "all") &&
	    (theState["squareToShow"] != "none"))
	{
		if (theState["innerLine"])
			draw_inner_line();
		
		draw_inner_squares();
	}
	
	draw_square();
	
	if (theState["squareToShow"] != "none")
		draw_dividers();
	
	if ((theState["squareToShow"] != "all") &&
	    (theState["squareToShow"] != "none"))
		draw_triangles();
		
	draw_point();
}


function check_mouse_hover(e, x, y, width, height)
/** Function to check whether the mouse is hovering over the rectangle specified 
    in the function's arguments. x, y, width, and height are given in the canvas'
		coordinate system. Returns true if it's hovering inside the area,
		false otherwise. */
{
	if ((e.clientX - CCOORDS[0] >= x)         &&
	    (e.clientX - CCOORDS[0] <= x + width) &&
			(e.clientY - CCOORDS[1] >= y)         &&
			(e.clientY - CCOORDS[1] <= y + height))
		return true;
	else
		return false;
}


function check_settings()
/** This is called whenever a control button is clicked.
    Will make sure the values are set according to what
		the user inputs. */
{
	//Look in radiobuttons to see which parts of the square to show
	for (let span of DISPLAYCONTROLDIV.children)
		if (span.className != "controlHeader")
		{
			let radio = span.firstElementChild;
			if (radio.checked)
			{
				theState["squareToShow"] = radio.value;
				break;
			}
		}
		
	//Check checkbuttons to toggle appropriate values
	for (let span of COLOURCONTROLDIV.children)
	{
		if (span.className != "controlHeader")
		{
			let check = span.firstElementChild;
			theState[check.value] = check.checked;
		}
	}
	
	draw_diagram();
}


function move_point(e)
/** Moves the square's "center" point to wherever the user drags it. */
{
	pointCoords[0] = e.clientX - CCOORDS[0];
	pointCoords[1] = e.clientY - CCOORDS[1];
	
	//Draw updated things
	draw_diagram();
}


//Is the user still dragging the point?
window.addEventListener("mouseup", function()
{
	theState["draggingPoint"] = false;
});

//Check whether we need to move the "center" point
CANVAS.addEventListener("mousemove", function(event)
{
	//Only move point if user is dragging it
	if (theState["draggingPoint"])
		move_point(event);
});

//Check whether the user is clicking the "center" point,
// toggle theState["draggingPoint"] if so
CANVAS.addEventListener("mousedown", function(event)
{
	//The bounding box for the circle isn't perfect, but it's
	// a good-enough size
	if (check_mouse_hover(event, pointCoords[0]-POINTRADIUS, 
	                             pointCoords[1]-POINTRADIUS, 
															 POINTRADIUS+2*SQUARETHICKNESS, 
															 POINTRADIUS+2*SQUARETHICKNESS))
	{
		theState["draggingPoint"] = true;
	}
});

//Adding listeners to all control buttons
for (let subDiv of CONTROLDIV.children)
	for (let control of subDiv.children)
		if ((control.className != "controlHeader") && (control.className != "controlIgnore")) //Only care about buttons
			control.firstElementChild.addEventListener("click", check_settings);


/* Draw the diagram so the user doesn't have to move the mouse first.
   This also makes sure values between refreshes carry over. */
check_settings();

/* TO-DO:
 * - Add labels in each quadrant saying how much area they take up (maybe)
 * - Might be good to have a "save point" feature to restore where the point was previously...
 */
 