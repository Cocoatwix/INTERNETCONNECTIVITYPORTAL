"use strict";

document.body.onload   = page_init;
document.body.onresize = check_layout_switch;

var hamburger; 
var sidebarDiv;
var sidebarX;
var sidebarXSpan;
var sidebarClass;

var sidebarShown = false;


function toggle_sidebar()
/** Toggles the visibility of the mobile layout's sidebar. */
{
	if (!sidebarShown)
	{
		sidebarDiv.style.animation = "slide_in 0.2s";
		sidebarDiv.style.left      = "0px";
		
		sidebarDiv.style.display   = "block";
		sidebarX.style.display     = "block";
		sidebarXSpan.style.display = "inline-block";
	}
	
	else
	{
		for (let element of sidebarClass)
		{
			//Sidebar needs to stay visible for animation
			if (element.id != "sidebarDiv")
				element.style.display = "none";
		}
		
		sidebarDiv.style.animation = "slide_out 0.2s";
		sidebarDiv.style.left = "-250px";
	}

	sidebarShown = !sidebarShown;
}


function check_layout_switch()
/** Checks to see if we've switched from PC to mobile or vice versa. */
{
	//This ensures the sidebar is properly closed when switching layouts
	if (window.innerWidth > 800)
	{
		sidebarShown = true;
		toggle_sidebar();
	}
}


function page_init()
/** Runs when the page is fully loaded. */
{
	hamburger    = document.getElementById("hamburger");
	sidebarDiv   = document.getElementById("sidebarDiv");
	sidebarX     = document.getElementById("sidebarX");
	sidebarXSpan = document.getElementById("sidebarXSpan");
	
	sidebarClass = document.getElementsByClassName("sidebar");
	
	hamburger.onclick = toggle_sidebar;
	sidebarX.onclick  = toggle_sidebar;
}
