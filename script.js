"use strict";

document.body.onload   = page_init;
document.body.onresize = check_layout;

var hamburger; 
var sidebarDiv;
var sidebarX;
var sidebarXSpan;
var sidebarClass;

var sidebarTabClass;

var navSignDivClass;

var sidebarShown = false;


function toggle_sidebar()
/** Toggles the visibility of the mobile layout's sidebar. */
{
	if (!sidebarShown)
	{
		sidebarDiv.style.animation = "slide_in 0.2s";
		sidebarDiv.style.left      = "0px";
		
		//This allows me to automatically know how to bring
		// hidden elements back
		
		/*
		for (let element of sidebarClass)
		{
			if (element.classList.contains("blockStyle"))
				element.style.display = "block";
			else if (element.classList.contains("inlineblockStyle"))
				element.style.display = "inline-block";
			
			else if (element.classList.contains("sidebarIcon") ||
							 element.classList.contains("sidebarLabel"))
				element.style.display = "inline-block";
		}
		*/
	}
	
	else
	{		
		sidebarDiv.style.animation = "slide_out 0.2s";
		sidebarDiv.style.left = "-250px";
	}

	sidebarShown = !sidebarShown;
}


function inspect_signs()
/** Checks to see how much space we have on the viewport, then
	  shows/hides signs as necessary to keep layout snug. */
{
	let signCount = 0;
	
	//One sign every 200 pixels
	//-50 is to give some breathing room (don't want scroll bar to show up)
	let signCapacity = Math.floor((window.innerWidth - 30) / 200);
	
	console.log(signCapacity);
	
	for (let sign of navSignDivClass)
	{
		if (signCount < signCapacity)
			sign.style.display = "block";
		
		else
			sign.style.display = "none";
		
		signCount += 1;
	}
}



function check_layout()
/** When viewport changes size, check to see if we need to make
	  any adjustments to the layout. */
{
	//This ensures the sidebar is properly closed when switching layouts
	if (window.innerWidth > 800)
	{
		sidebarShown = false;
		sidebarDiv.style.left = "-250px";
		sidebarDiv.style.animation = "none";
		
		inspect_signs();
	}
}


function page_init()
/** Runs when the page is fully loaded. */
{
	hamburger      = document.getElementById("hamburger");
	sidebarDiv     = document.getElementById("sidebarDiv");
	sidebarX       = document.getElementById("sidebarX");
	sidebarXSpan   = document.getElementById("sidebarXSpan");
	
	sidebarClass    = document.getElementsByClassName("sidebar");
	sidebarTabClass = document.getElementsByClassName("sidebarTab");
	navSignDivClass = document.getElementsByClassName("navSignDiv");
	
	hamburger.onclick = toggle_sidebar;
	sidebarX.onclick  = toggle_sidebar;
	
	check_layout();
}
