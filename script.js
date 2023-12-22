"use strict";

var darkMode = false;
const darkModeBG = "#111111";
const lightModeBG = "#EEEEEE";

//Checking dark mode stuff early to try and prevent flashbangs
//This isn't great, but hopefully it'll work better
if (document.cookie != "")
{
	let c = document.cookie.split(";");
	for (let pair of c)
	{
		let cc = pair.split("=");
		if (cc[0] == "darkMode")
			if (cc[1] == "true")
				document.getElementsByTagName("BODY")[0].style.background = darkModeBG;
	}
}

//Check whether we're on index.html or some nested page.
let relURL = window.location.href.split("/");
relURL = relURL[relURL.length - 1];
//console.log(relURL);

//Get location of various folders (location of assets and pages changes between pages)
let assetsLocation = "";
let pagesLocation = "";

if ((relURL == "index.html") || (relURL == ""))
{
	assetsLocation = "assets/";
	pagesLocation = "pages/";
}

else
{
	assetsLocation = "../assets/";
}

document.body.onload   = page_init;
document.body.onresize = check_layout;
document.body.onscroll = check_layout;

//This cookie stuff has to be specified here so that check_layout() can find them
var cookieBanner = document.createElement("div"); //For telling the user about cookies
cookieBanner.id = "cookieBannerDiv";
cookieBanner.style.width = window.innerWidth + "px";

let cookieSpan = document.createElement("span");
cookieSpan.id = "cookieSpan";
cookieSpan.style.width = 0.6*window.innerWidth + "px";

let cookieMessage = document.createElement("p");
cookieMessage.innerHTML += "This site uses a single cookie to keep track of whether dark mode is enabled or not.";
cookieMessage.style.marginTop = "5px";

let cookieButton = document.createElement("span");
cookieButton.id = "cookieButton";
cookieButton.onclick = create_dark_mode_cookie
cookieButton.innerHTML += "Cool!";

cookieSpan.append(cookieMessage);
cookieBanner.append(cookieSpan);
cookieBanner.append(cookieButton);

var footer;
var footerImg;
var loadingCircle;
var content;

var hamburger; 
var sidebarDiv;
var tabSpan;
var topSpan; //Holds the span that holds divider bar, dark mode switch, etc.
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

//Note: "assets/" or "..assets/" is added to the image links in page_init()
const pageDetails = 
[
	{
		"name":      "About", 
		"pageLink":  "about.html",
		"labelLink": "aboutLabel.png",
		"iconLink":  "question.png"
	},
	{
		"name":      "Education",
		"pageLink":  "education.html",
		"labelLink": "educationLabel.png", 
		"iconLink":  "education.png"
	},
	{
		"name":      "Projects", 
		"pageLink":  "projects.html",
		"labelLink": "projectsLabel.png",
		"iconLink":  "gears.png"
	},
	{
		"name":      "Videos",
		"pageLink":  "videos.html",
		"labelLink": "videosLabel.png",
		"iconLink":  "television.png"
	},
	{
		"name":      "Music", 
		"pageLink":  "music.html",
		"labelLink": "musicLabel.png",
		"iconLink":  "musicnote.png"
	}
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
	
	if (darkMode)
	{
		return "<div class=\"PClayout moreMenuLink darkMode\">" +
			"<a href=\"" + signLink + "\" class=\"PClayout moreMenuAnchor\">" + 
				"<img src=\"" + signIconSrc + "\" alt=\"icon\" class=\"PClayout moreMenuIcon darkMode\">" +
				"<span class=\"moreMenuText darkMode\">" + sign.getAttribute("name") + "</span>" + 
			"</a>" + 
		"</div>";
	}
	
	else
	{
		return "<div class=\"PClayout moreMenuLink\">" +
			"<a href=\"" + signLink + "\" class=\"PClayout moreMenuAnchor\">" + 
				"<img src=\"" + signIconSrc + "\" alt=\"icon\" class=\"PClayout moreMenuIcon\">" +
				"<span class=\"moreMenuText\">" + sign.getAttribute("name") + "</span>" + 
			"</a>" + 
		"</div>";
	}
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
	
	//Adjust cookieBanner
	cookieBanner.style.width = window.innerWidth + "px";
	cookieSpan.style.width = Math.floor(0.6*window.innerWidth) + "px";
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


function create_page(arrowSign, page)
/** Function to semi-automate the process of creating pages and adding them
    to the navigation bar and sidebar. */
{
	//Create naviagtion sign
	let DOMsign = "<div name=\"" + page["name"] + "\" ";
	DOMsign += "class=\"PCLayout navSignDiv\">";
	DOMsign += "<a href=\"" + page["pageLink"] + "\" class=\"PCLayout navbarAnchor\">";
	DOMsign += "<img src=\"" + arrowSign + "\" alt=\"Arrow Sign\" class=\"PCLayout navbarItem navSign\">";
	DOMsign += "<img src=\"" + page["labelLink"] + "\" alt=\"" + page["name"] + "\" class=\"PCLayout navbarItem navLabel\">";
	DOMsign += "<img src=\"" + page["iconLink"] + "\" class=\"PCLayout navbarItem navIcon\">";
	DOMsign += "</a>";
	DOMsign += "</div>";
	
	navDiv.innerHTML += DOMsign;
	
	//Create sidebar tab
	let DOMtab = "<a href=\"" + page["pageLink"] + "\" class=\"mobileLayout\">";
	DOMtab += "<div class=\"sidebar mobileLayout sidebarTab inlineblockStyle\">";
	DOMtab += "<img src=\"" + page["iconLink"] + "\" class=\"sidebar mobileLayout sidebarIcon\">";
	DOMtab += "<img src=\"" + page["labelLink"] + "\" alt=\"" + page["name"] + "\" class=\"sidebar mobileLayout sidebarLabel\">";
	DOMtab += "</div>";
	DOMtab += "</a>";
	
	tabSpan.innerHTML += DOMtab;
}


function create_dark_mode_cookie()
/** Function to create a cookie that keeps track of whether dark mode's 
    been enabled or not. */
{
	document.cookie = "darkMode=" + darkMode + "; path=/; SameSite=Lax;";
	
	close_cookie_banner();
}


function delete_all_cookies()
/** For testing. */
{
	let cookies = document.cookie.split(";");
	for (let c of cookies)
	{
		let cc = c.split("=");
		document.cookie = cc[0] + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; SameSite=Strict; Secure";
	}
}


function close_cookie_banner()
/** Subfunction to hide the "we use cookies" banner. */
{
	cookieBanner.style.display = "none";
}


function toggle_dark_mode()
/** Called whenever darkModeButton is clicked. */
{
	darkMode = !darkMode;
	
	//Only create a cookie if the user agrees
	if (document.cookie != "")
		document.cookie = "darkMode=" + darkMode + "; expires=; path=/; SameSite=Strict; Secure";
	
	inspect_signs(); //Ensures moreMenu items update properly
	update_dark_mode();
}


function update_dark_mode()
/** Function to add "darkMode" class to all applicable objects. */
{
	//Update darkModeButton image
	if (darkMode)
		darkModeButton.src = assetsLocation + "sun.png";
	else
		darkModeButton.src = assetsLocation + "moon.png";
	
	const dMT = "darkMode";
	if (darkMode)
	{
		//Inverting text
		for (let e of document.getElementsByTagName("p"))
			e.classList.add(dMT);
		
		for (let e of document.getElementsByTagName("h1"))
			e.classList.add(dMT);
		
		content.classList.add(dMT);
		
		navDiv.style.background = darkModeBG;
		document.getElementById("topCoverDiv").style.background = darkModeBG;
		document.getElementById("topRuleDiv").classList.add(dMT);
		document.getElementById("contentCover").classList.add(dMT);
		
		moreMenu.classList.add(dMT);
		
		hamburger.classList.add(dMT);
		hamburger.parentNode.classList.add(dMT);
		darkModeButton.classList.add(dMT);
		
		sidebarDiv.classList.add(dMT);
		sidebarXDiv.classList.add(dMT);
		sidebarX.classList.add(dMT);
		sidebarX.parentNode.classList.add(dMT);
		
		//Darkening mobile layout buttons
		for (let e of tabSpan.childNodes)
		{
			e.childNodes[0].classList.add(dMT);
			for (let ee of e.childNodes[0].childNodes)
				ee.classList.add(dMT);
		}
		
		//Inverting signs
		for (let sign of navSignDivClass)
			for (let signImg of sign.childNodes[0].childNodes)
				signImg.classList.add(dMT);
			
		//Inverting more sign
		for (let img of moreSign.childNodes)
			img.classList.add(dMT);
		
		//Inverting specific images
		loadingCircle.classList.add(dMT);
		document.getElementById("headImg").classList.add(dMT);
		
		//Softening collapsedOlds buttons
		for (let e of document.getElementsByClassName("collapsedOldButton"))
			e.classList.add(dMT);
		
		//Inverting body colour
		document.getElementsByTagName("BODY")[0].style.background = darkModeBG;
	}
	
	else
	{	
		//Inverting text
		for (let e of document.getElementsByTagName("p"))
			e.classList.remove(dMT);
		
		for (let e of document.getElementsByTagName("h1"))
			e.classList.remove(dMT);
		
		content.classList.remove(dMT);
		
		navDiv.style.background = lightModeBG;
		document.getElementById("topCoverDiv").style.background = lightModeBG;
		document.getElementById("topRuleDiv").classList.remove(dMT);
		document.getElementById("contentCover").classList.remove(dMT);
		
		moreMenu.classList.remove(dMT);
		
		hamburger.classList.remove(dMT);
		hamburger.parentNode.classList.remove(dMT);
		darkModeButton.classList.remove(dMT);
		
		sidebarDiv.classList.remove(dMT);
		sidebarXDiv.classList.remove(dMT);
		sidebarX.classList.remove(dMT);
		sidebarX.parentNode.classList.remove(dMT);
		
		//Darkening mobile layout buttons
		for (let e of tabSpan.childNodes)
		{
			e.childNodes[0].classList.remove(dMT);
			for (let ee of e.childNodes[0].childNodes)
				ee.classList.remove(dMT);
		}
		
		//Inverting signs
		for (let sign of navSignDivClass)
			for (let signImg of sign.childNodes[0].childNodes)
				signImg.classList.remove(dMT);
			
		//Inverting more sign
		for (let img of moreSign.childNodes)
			img.classList.remove(dMT);
		
		//Inverting specific images
		loadingCircle.classList.remove(dMT);
		document.getElementById("headImg").classList.remove(dMT);
		
		//Softening collapsedOlds buttons
		for (let e of document.getElementsByClassName("collapsedOldButton"))
			e.classList.remove(dMT);
		
		//Inverting body colour
		document.getElementsByTagName("BODY")[0].style.background = lightModeBG;
	}
}


function page_init()
/** Runs when the page is fully loaded. Initialises DOM objects and
    their references. */
{
	//After page is done loading, remove loading GIF
	loadingCircle.style.display = "none";
}

footer         = document.getElementsByTagName("footer")[0];
loadingCircle  = document.getElementById("loadingCircle");
content        = document.getElementById("content");

hamburger      = document.getElementById("hamburger");
sidebarDiv     = document.getElementById("sidebarDiv");
sidebarX       = document.getElementById("sidebarX");
sidebarXSpan   = document.getElementById("sidebarXSpan");

sidebarClass    = document.getElementsByClassName("sidebar");
sidebarTabClass = document.getElementsByClassName("sidebarTab");

navDiv  = document.getElementById("navDiv");
tabSpan = document.getElementById("tabSpan");

topSpan = document.getElementById("topSpan");

//First, we check to see if the darkMode cookie exists.
//If not, we ask the user if it's okay to create it
let cookies = document.cookie;
if (cookies == "")
{
	document.body.prepend(cookieBanner);
	darkMode = false;
}
//Get cookies
else
{
	//Get value of darkMode cookie, set darkMode to it
	let c = document.cookie.split(";");
	for (let pair of c)
	{
		let cc = pair.split("=");
		if (cc[0] == "darkMode")
		{
			//Converting strings to booleans
			if (cc[1] == "false")
				darkMode = false;
			else
				darkMode = true;
		}
	}
}

//Adding the dark mode switch
let darkModeDiv    = document.createElement("div");
let darkModeButton = document.createElement("img");

darkModeDiv.id    = "darkModeDiv";
darkModeButton.id = "darkModeButton";

darkModeDiv.style.height = "50px";

darkModeButton.src     = assetsLocation + "moon.png";
darkModeButton.title   = "Toggle Dark Mode";
darkModeButton.onclick = toggle_dark_mode;

topSpan.before(darkModeDiv);
darkModeDiv.append(darkModeButton);

//Now, add the links to all available pages
for (let page of pageDetails)
{
	page["pageLink"]  = pagesLocation  + page["pageLink"];
	page["labelLink"] = assetsLocation + page["labelLink"];
	page["iconLink"]  = assetsLocation + page["iconLink"];
	
	create_page(assetsLocation + "arrowSignDrop.png", page);
}

//Adding more sign separately since it's different in structure
navDiv.innerHTML += "<div id=\"moreSign\" class=\"PCLayout navSignDiv\">" +
			"<img src=\"" + assetsLocation + "arrowSignDown.png\" alt=\"Arrow Sign\" class=\"PCLayout navbarItem navSign\">" +
			"<img src=\"" + assetsLocation + "moreLabel.png\" alt=\"More\" id=\"moreLabel\" class=\"PCLayout navbarItem navLabel\">" +
			"<img src=\"" + assetsLocation + "exclamation.png\" id=\"moreIcon\" class=\"PCLayout navbarItem navIcon\">" +
		"</div>";
		
footerImg = assetsLocation + "ZS.png";

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
footer.innerHTML += "Dec 22, 2023<br>";
footer.innerHTML += "<img src=\"" + footerImg + "\" alt=\"ZS\">";

check_layout();
update_dark_mode();
