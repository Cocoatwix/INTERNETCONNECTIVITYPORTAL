"use strict";

document.body.onload   = page_init;
document.body.onresize = check_layout;

var footer;
var footerImg;
var loadingCircle;
var content;

var hamburger; 
var sidebarDiv;
var tabSpan;
var sidebarX;
var sidebarXSpan;
var sidebarClass;

var sidebarTabClass;

var sidebarShown = false;

var navDiv;
var navSignDivClass;
var moreSign;

var moreMenu;
var moreMenuHeight;

//Name, page link, label link, icon link
const pageDetails = 
[
	["About", "about.html", "assets/aboutLabel.png", "assets/question.png"],
	["Education", "education.html", "assets/educationLabel.png", "assets/education.png"],
	["Projects", "projects.html", "assets/projectsLabel.png", "assets/gears.png"],
	["Videos", "videos.html", "assets/videosLabel.png", "assets/television.png"],
	["Music", "music.html", "assets/musicLabel.png", "assets/musicnote.png"]
];


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


function toggle_collapsedOld()
/** Toggles a collapsed old into/out of view. */
{
	let collapsedOldID      = this.parentNode.id;
	let collapsedOldContent = this.parentNode.children["oldContent" + collapsedOldID];
	let fadeTime = 0.5;
	
	//If we need to expand the old
	if (this.innerHTML == "+")
	{
		this.innerHTML = "-";
		
		//This may break if we add more styling to the oldContent span
		collapsedOldContent.style.display = "block";
		collapsedOldContent.style.opacity = "1";
		collapsedOldContent.style.animation = "fade_in " + fadeTime + "s";
	}
	
	else
	{
		this.innerHTML = "+";
		
		//This may break if we add more styling to the oldContent span
		collapsedOldContent.style.animation = "fade_out " + fadeTime + "s";
		
		setTimeout(function()
		{
			collapsedOldContent.style.display = "none";
			collapsedOldContent.style.opacity = "0";
		}, fadeTime*1000 - 100);
		
	}
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
			if (signChildren.length != 0)
				moreMenu.innerHTML += create_moreMenu_link(sign, signChildren[2].src, sign.children[0].href);
			
			moreSign.style.display = "block";
		}
		
		else
		{
			if (sign.id != "moreSign")
			{
				//Adding more menu elements
				if (signChildren.length != 0)
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
	//Always get rid of more menu when resizing the screen
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


function create_page(arrowSign, name, pageLink, labelLink, iconLink)
/** Function to semi-automate the process of creating pages and adding them
    to the navigation bar and sidebar. */
{
	//Create naviagtion sign
	let DOMsign = "<div name=\"" + name + "\" ";
	DOMsign += "class=\"PCLayout navSignDiv\">";
	DOMsign += "<a href=\"" + pageLink + "\" class=\"PCLayout navbarAnchor\">";
	DOMsign += "<img src=\"" + arrowSign + "\" alt=\"Arrow Sign\" class=\"PCLayout navbarItem navSign\">";
	DOMsign += "<img src=\"" + labelLink + "\" alt=\"" + name + "\" class=\"PCLayout navbarItem navLabel\">";
	DOMsign += "<img src=\"" + iconLink + "\" class=\"PCLayout navbarItem navIcon\">";
	DOMsign += "</a>";
	DOMsign += "</div>";
	
	navDiv.innerHTML += DOMsign;
	
	//Create sidebar tab
	let DOMtab = "<a href=\"" + pageLink + "\" class=\"mobileLayout\">";
	DOMtab += "<div class=\"sidebar mobileLayout sidebarTab inlineblockStyle\">";
	DOMtab += "<img src=\"" + iconLink + "\" class=\"sidebar mobileLayout sidebarIcon\">";
	DOMtab += "<img src=\"" + labelLink + "\" alt=\"" + name + "\" class=\"sidebar mobileLayout sidebarLabel\">";
	DOMtab += "</div>";
	DOMtab += "</a>";
	
	tabSpan.innerHTML += DOMtab;
}


function page_init()
/** Runs when the page is fully loaded. Initialises DOM objects and
    their references. */
{
	footer         = document.getElementsByTagName("footer")[0];
	loadingCircle  = document.getElementById("loadingCircle");
	content        = document.getElementById("content");
	
	hamburger      = document.getElementById("hamburger");
	sidebarDiv     = document.getElementById("sidebarDiv");
	sidebarX       = document.getElementById("sidebarX");
	sidebarXSpan   = document.getElementById("sidebarXSpan");
	
	sidebarClass    = document.getElementsByClassName("sidebar");
	sidebarTabClass = document.getElementsByClassName("sidebarTab");
	
	//Add links to all available pages
	navDiv  = document.getElementById("navDiv");
	tabSpan = document.getElementById("tabSpan");
	
	//Now, depending on whether we're on index.html or some nested page.
	// change the file paths.
	
	let relURL = window.location.href.split("/");
	relURL = relURL[relURL.length - 1];
	//console.log(relURL);
	
	//Now, add the links
	for (let page of pageDetails)
	{
		if ((relURL == "index.html") || (relURL == ""))
		{
			page[1] = "pages/" + page[1];
			
			create_page("assets/arrowSignDrop.png", page[0], page[1], page[2], page[3]);
		}
		
		//On a subpage
		else
		{
			page[2] = "../" + page[2];
			page[3] = "../" + page[3];
			
			create_page("../assets/arrowSignDrop.png", page[0], page[1], page[2], page[3]);
		}
	}
	
	//Adding more sign separately since it's different in structure
	//Also getting any other data that changes between locations
	//Will rewrite this better later
	if ((relURL == "index.html") || (relURL == ""))
	{
		navDiv.innerHTML += "<div id=\"moreSign\" class=\"PCLayout navSignDiv\">" +
					"<img src=\"assets/arrowSignDown.png\" alt=\"Arrow Sign\" class=\"PCLayout navbarItem navSign\">" +
					"<img src=\"assets/moreLabel.png\" alt=\"More\" id=\"moreLabel\" class=\"PCLayout navbarItem navLabel\">" +
					"<img src=\"assets/exclamation.png\" id=\"moreIcon\" class=\"PCLayout navbarItem navIcon\">" +
				"</div>";
				
		footerImg = "assets/ZS.png";
	}
	
	else
	{
		navDiv.innerHTML += "<div id=\"moreSign\" class=\"PCLayout navSignDiv\">" +
					"<img src=\"../assets/arrowSignDown.png\" alt=\"Arrow Sign\" class=\"PCLayout navbarItem navSign\">" +
					"<img src=\"../assets/moreLabel.png\" alt=\"More\" id=\"moreLabel\" class=\"PCLayout navbarItem navLabel\">" +
					"<img src=\"../assets/exclamation.png\" id=\"moreIcon\" class=\"PCLayout navbarItem navIcon\">" +
				"</div>";
				
		footerImg = "../assets/ZS.png";
	}
	
	//Assign references to newly-added signs
	navSignDivClass = document.getElementsByClassName("navSignDiv");
	
	moreSign = document.getElementById("moreSign");
	moreMenu = document.getElementById("moreMenu");
	moreMenuHeight = 0;
	
	
	//Event handlers
	hamburger.onclick = toggle_sidebar;
	sidebarX.onclick  = toggle_sidebar;
	
	moreSign.onclick  = show_more_menu;
	
	//For collapsed olds, add functionality to each + button
	if ((relURL == "index.html") || (relURL == ""))
	{
		let olds = document.getElementsByClassName("collapsedOld");
		
		//Iterate through each old, add button functionality
		for (let old of olds)
			old.children["oldButton" + old.id].onclick = toggle_collapsedOld;
	}
	
	//Add footer data
	footer.innerHTML += "Zach Strong<br>";
	//let currDate = new Date();
	//footer.innerHTML += currDate.toDateString();
	footer.innerHTML += "Jul 31, 2023<br>";
	footer.innerHTML += "<img src=\"" + footerImg + "\" alt=\"ZS\">";
	
	check_layout();
	
	//After page is done loading, remove loading GIF, show content
	loadingCircle.style.display = "none";
}
