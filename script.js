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
var moreMenuHeight;


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


function create_moreMenu_link(sign, signIconSrc, signLink)
/** Creates a moreMenu link element as a string and
    returns it. */
{
	//Increment height of menu
	moreMenuHeight += 34;
	
	return "<div class=\"PClayout moreMenuLink\">" +
		"<a href=\"" + signLink + "\" class=\"PClayout moreMenuAnchor\">" + 
			"<img src=\"" + signIconSrc + "\" alt=\"icon\" class=\"PClayout moreMenuIcon\">" +
			"<span class=\"moreMenuText\">" + sign.getAttribute("name") + "</span>" + 
		"</a>" + 
	"</div>";
}


function inspect_signs()
/** Checks to see how much space we have on the viewport, then
	  shows/hides signs as necessary to keep layout snug. */
{
	let signCount = 0;
	
	//One sign every 200 pixels
	//-30 is to give some breathing room (don't want scroll bar to show up)
	let signCapacity = Math.floor((window.innerWidth - 30) / 200);
	
	//Clear more menu for adding the elements again
	moreMenu.innerHTML = "";
	
	//Reset size
	moreMenuHeight = 0;
	
	//This hides signs when the screen is too small,
	// as well as manages the "more" sign.
	for (let sign of navSignDivClass)
	{
		//Lets us access icons from signs
		let signChildren = sign.children[0].children;
		
		if (signCount < signCapacity-1)
		{
			sign.style.display = "block";
		}
		
		else if (signCount < signCapacity)
		{
			sign.style.display = "none";
			
			//Adding more menu elements
			moreMenu.innerHTML += create_moreMenu_link(sign, signChildren[2].src, sign.children[0].href);
			
			moreSign.style.display = "block";
		}
		
		else
		{
			if (sign.id != "moreSign")
			{
				//Adding more menu elements
				moreMenu.innerHTML += create_moreMenu_link(sign, signChildren[2].src, sign.children[0].href);
				
				sign.style.display = "none";
			}
		}
		
		signCount += 1;
	}
	
	//Hide more arrow when not needed
	if (signCapacity >= signCount-1)
		moreSign.style.display = "none";
	
	if (signCapacity == signCount-1)
		navSignDivClass[signCapacity-1].style.display = "block";
	
	//Add a bit of leeway for moreMenu
	moreMenuHeight += 5;
	
	moreMenu.style.height = moreMenuHeight + "px";
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
	let mouseY = event.clientY;
	let mouseX = event.clientX;
	
	moreMenu.style.display = "block";
	
	if (mouseX + 200 > window.innerWidth)
		moreMenu.style.left = window.innerWidth - 200 + "px";
	else
		moreMenu.style.left = mouseX + "px";
	
	moreMenu.style.top = event.clientY + "px";
	
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
	moreMenuHeight = 0;
	
	sidebarClass    = document.getElementsByClassName("sidebar");
	sidebarTabClass = document.getElementsByClassName("sidebarTab");
	navSignDivClass = document.getElementsByClassName("navSignDiv");
	
	hamburger.onclick = toggle_sidebar;
	sidebarX.onclick  = toggle_sidebar;
	
	moreSign.onclick  = show_more_menu;
	
	check_layout();
	
	//I'd like to make index.html a template, but I don't have a web service to host pages
}
