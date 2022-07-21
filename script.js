"use strict";

document.body.onload   = page_init;
document.body.onresize = check_layout;

var hamburger; 
var sidebarDiv;
var sidebarX;
var sidebarXSpan;
var sidebarClass;

var sidebarTabClass;

var sidebarShown = false;

var navSignDivClass;
var moreSign;

var moreMenu;


function toggle_sidebar()
/** Toggles the visibility of the mobile layout's sidebar. */
{
	if (!sidebarShown)
	{
		sidebarDiv.style.animation = "slide_in 0.2s";
		sidebarDiv.style.left      = "0px";
	}
	
	else
	{		
		sidebarDiv.style.animation = "slide_out 0.2s";
		sidebarDiv.style.left      = "-250px";
	}

	sidebarShown = !sidebarShown;
}


function inspect_signs()
/** Checks to see how much space we have on the viewport, then
	  shows/hides signs as necessary to keep layout snug. */
{
	let signCount = 0;
	
	//One sign every 200 pixels
	//-30 is to give some breathing room (don't want scroll bar to show up)
	let signCapacity = Math.floor((window.innerWidth - 30) / 200);
	
	console.log(signCapacity);
	
	//This hides signs when the screen is too small,
	// as well as manages the "more" sign.
	for (let sign of navSignDivClass)
	{
		if (signCount < signCapacity-1)
		{
			sign.style.display = "block";
		}
		
		else if (signCount < signCapacity)
		{
			sign.style.display = "none";
			moreSign.style.display = "block";
		}
		
		else
		{
			if (sign.id != "moreSign")
			{
				sign.style.display = "none";
			}
		}
		
		signCount += 1;
	}
	
	//Hide more arrow when not needed
	if (signCapacity >= signCount-1)
	{
		moreSign.style.display = "none";
		console.log("???");
	}
	
	if (signCapacity == signCount-1)
		navSignDivClass[signCapacity-1].style.display = "block";
}



function check_layout()
/** When viewport changes size, check to see if we need to make
	  any adjustments to the layout. */
{
	//Always get rid of more menu when resiing the sceen
	hide_more_menu()
	
	//This ensures the sidebar is properly closed when switching layouts
	if (window.innerWidth > 800)
	{
		sidebarShown = false;
		sidebarDiv.style.left = "-250px";
		sidebarDiv.style.animation = "none";
		
		inspect_signs();
	}
}


function show_more_menu()
/** Toggles the "more" menu for showing hidden options. */
{
	moreMenu.style.display = "block";
	moreMenu.style.top = event.clientY + "px";
	moreMenu.style.left = event.clientX + "px";
	
	//Have you ever seen code so elegant in your life?
	setTimeout(function()
	{
		document.body.onclick = hide_more_menu;
	}, 1);
}


function hide_more_menu()
{
	moreMenu.style.display = "none";
	
	setTimeout(function()
	{
		document.body.onclick = null;
	}, 1);
}


function page_init()
/** Runs when the page is fully loaded. Initialises DOM objects and
    their references. */
{
	hamburger      = document.getElementById("hamburger");
	sidebarDiv     = document.getElementById("sidebarDiv");
	sidebarX       = document.getElementById("sidebarX");
	sidebarXSpan   = document.getElementById("sidebarXSpan");
	
	moreSign = document.getElementById("moreSign");
	moreMenu = document.getElementById("moreMenu");
	
	sidebarClass    = document.getElementsByClassName("sidebar");
	sidebarTabClass = document.getElementsByClassName("sidebarTab");
	navSignDivClass = document.getElementsByClassName("navSignDiv");
	
	hamburger.onclick = toggle_sidebar;
	sidebarX.onclick  = toggle_sidebar;
	
	moreSign.onclick  = show_more_menu;
	
	check_layout();
}
