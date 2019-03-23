/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


__webpack_require__(1)


self.addLine = __webpack_require__(2).addLine

//Defines self.TopBar and self.triangle
Object.assign(self, __webpack_require__(3))

self.River = __webpack_require__(4).River

self.sort = __webpack_require__(6).sort

//Defines self.normalSearch and self.advanedSearch
Object.assign(self, __webpack_require__(7))




if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        navigator.serviceWorker.register('/sw.js');
    });
}



//ItemHolder is a list of all the DOM elements objects. New objects should be pushed into the list. 
self.ItemHolder = []
riverarray.map(function(event, index) {
    ItemHolder[index] = new River(index, event)
})


//Fetch data from USGS
//ItemHolder has been filled, so this can be run here (and needs to be.... Otherwise self.usgsarray is undefined)
__webpack_require__(8).loadUSGS()


var oldresult;    
window.NewList = function(query, type, reverse) {
    if (typeof(query) === "string") {
        query = query.toLowerCase()
    }
    //Location searching uses numbers.

    let orderedlist = ItemHolder.slice(0); //Clone the array
    if (!(String(query).length === 0 || !query || !type)) {

        if (type === "sort") {
            //Obey other filters
            if (oldresult) {
                orderedlist = oldresult
            }
            
            orderedlist = sort(query, orderedlist, reverse)
        }
        if (type === "normal") {
            orderedlist = normalSearch(orderedlist, query)
        }
        if (type === "advanced") { 
            orderedlist = advancedSearch(orderedlist, query)
        }    
        if (type === "location") {
            if (oldresult) {
                orderedlist = oldresult
            }

            var nlist = []
            orderedlist.forEach(function(value){
                if (value.plat && value.plon) {
                    if (distanceto(value.plat, value.plon) < query) {
                        nlist.push(value)
                    }
                }
            })
            orderedlist = nlist
        }


    }//Closing for if a query is present

    //Clear Current
    ItemHolder.forEach(function(event) {
        event.delete()
    }) 
    //Append New
    var div = document.getElementById("Rivers")
    //Everything else    
    orderedlist.forEach(function(event){
        div.appendChild(event.create())
    })

    if (type !== "sort") {
        oldresult = orderedlist
    }
}


document.getElementById("Rivers").appendChild(new TopBar().create())
NewList("alphabetical", "sort")


let searchbox = document.getElementById("searchbox")
searchbox.addEventListener("keydown", function() {setTimeout(function(){NewList(searchbox.value, "normal")}, 20)})







//Check if there is a search query
if (window.location.hash.length > 0) {
    let search = window.location.hash.slice(1)
    document.getElementById("searchbox").value = search
    NewList(search, "normal")
}




/***/ }),
/* 1 */
/***/ (function(module, exports) {

//This is extremely sensitive to the design of the CSS
//The @media query must be last rule in first stylesheet for this to work
let styleSheet = document.styleSheets[0]



//Determine if the user wants dark mode
//If prefers-color-scheme does not exist, the user needs to manually select dark/light mode
//If prefers-color-scheme does exist, we follow it, unless the user wants to override it

try {
    //Basic checking to make sure we don't mess with/error on pages that don't support dark mode
    if (styleSheet.cssRules[styleSheet.cssRules.length - 1] instanceof CSSMediaRule) {
        window.darkMode = localStorage.getItem("prefersDarkMode")
        //Convert string to boolean
        if (window.darkMode === "null") {window.darkMode = null}
        if (window.darkMode === "false") {window.darkMode = false}
        if (window.darkMode === "true") {window.darkMode = true}


        if (window.darkMode === null) {
            window.darkMode = window.matchMedia('(prefers-color-scheme: dark)').matches
        }

        //Override browser to engage or disengage dark mode
        if (window.darkMode === true && window.matchMedia('(prefers-color-scheme: dark)').matches === false) {
            let cssText = styleSheet.cssRules[styleSheet.cssRules.length-1].cssText
            //Trim off the @media ... { and trailing }
            cssText = cssText.slice(cssText.indexOf("{") + 1, -1)
            let darkModeRules = cssText.split("\n")
            for (let i=0;i<darkModeRules.length;i++) {
                let rule = darkModeRules[i]
                if (rule.trim() === "") {continue}
                styleSheet.insertRule(rule, styleSheet.cssRules.length)
            }    
        }

        if (window.darkMode === false && window.matchMedia('(prefers-color-scheme: dark)').matches === true) {
            styleSheet.removeRule(styleSheet.cssRules.length - 1)
        }
		
		if (window.darkMode) {
			//Style links so that they are visible in dark mode
			
			//Unvisited Link
			styleSheet.insertRule("a:link {color: #3333FF;}", styleSheet.cssRules.length)
			//Visited link
			styleSheet.insertRule("a:visited {color: purple;}", styleSheet.cssRules.length)
			//Hovering over link
			styleSheet.insertRule("a:hover {color: green;}", styleSheet.cssRules.length)
			//Quick flash of color when link clicked
			styleSheet.insertRule("a:active {color: red;}", styleSheet.cssRules.length)
		}
    }
}
catch (e) {
    console.error(e)
}






//Make sure I don't hate the font
styleSheet.insertRule("html body {font-family: Arial, Helvetica, sans-serif}", styleSheet.cssRules.length)




//Create navigation bar
//Where rivers.run is located
//This should allow rivers.run to the run from a directory
let root = window.location.href
root = root.slice(0,root.lastIndexOf("/") + 1) //Add 1 so we don't clip trailing slash
	
let topnav = document.createElement("div")
topnav.className = "topnav"

let items = []

let item1 = document.createElement("a")
item1.href = root
item1.innerHTML = "River Info"
items.push(item1)

let item2 = document.createElement("a")
item2.href = root + "about.html"
item2.innerHTML = "About"
items.push(item2)

let item3 = document.createElement("a")
item3.href = root + "FAQ.html"
item3.innerHTML = "FAQ"
items.push(item3)

let item4 = document.createElement("a")
item4.href = root + "settings.html"
item4.innerHTML = "Settings"
items.push(item4)


for (let i=0;i<items.length;i++) {
    let item = items[i]

	let target = item.href.slice(root.length)
	let location = window.location.href.slice(root.length)
	
	
    if (target === location) {
        item.className = "topnavcurrent"
    }
    topnav.appendChild(item)
}

document.body.insertBefore(topnav, document.body.firstChild)

styleSheet.insertRule(".topnav {overflow: hidden}", styleSheet.cssRules.length)
styleSheet.insertRule(".topnav {background-color: #24b9cc}", styleSheet.cssRules.length)
styleSheet.insertRule(".topnav {margin:0px}", styleSheet.cssRules.length)

styleSheet.insertRule(".topnav a {float: left}", styleSheet.cssRules.length)
styleSheet.insertRule(".topnav a {display: block}", styleSheet.cssRules.length)
styleSheet.insertRule(".topnav a {color: black}", styleSheet.cssRules.length)
styleSheet.insertRule(".topnav a {text-align: center}", styleSheet.cssRules.length)
styleSheet.insertRule(".topnav a {padding: 12px 13px}", styleSheet.cssRules.length)
//Not sure what the one below is for
styleSheet.insertRule(".topnav a {text-decoration: none}", styleSheet.cssRules.length)
styleSheet.insertRule(".topnav a {font-size: 17px}", styleSheet.cssRules.length)


styleSheet.insertRule(".topnav a:hover {background-color: #359daa}", styleSheet.cssRules.length)
styleSheet.insertRule(".topnavcurrent {background-color: #25d1a7}", styleSheet.cssRules.length)







/***/ }),
/* 2 */
/***/ (function(module, exports) {

//Graph Code
//It's Ugly... It should be fixed
//BUT IT WORKS

//addline(canvas, horizontal, vertical, color, graphtype, numplace)

//canvas - HTML canvas element
//horizontal - array of horizontal values. Pass 0 and it will evenly space.
//vertical - array of vertical values

//color - Optional. Color of line. Default black
//graphtype - Optional. Specify 2 to put 2 lines and 2 scales on one graph. See numplace below
//numplace - Use only if you are using graphtype = 2. 
//If you specify 0 or do not pass a value, the line's scale will be on the left side of the graph.
//If you specify 1, the line's scale will be on the right side of the graph.

module.exports.addLine = function (GraphName, timeframe, Source, canvas, horizontal, vertical, color, graphtype, numplace) {
    if (graphtype === 3) {
        var endcolor = numplace
        }
    if (graphtype !== 2) {
        numplace = 0
    }
    var height = canvas.height*0.80
    var width = canvas.width

    var ctx = canvas.getContext('2d');  



    if (!isNaN(Number(horizontal))) {
        horizontal = []
        for (var i = 0;i<vertical.length;i++) {
            horizontal.push(i*width)
        }
    }
    if (horizontal.length !== vertical.length) {
        console.warn("Uneven amount of datapoints. " + horizontal.length + " horizontal points found, but " + vertical.length + " vertical points found.")
    }

    if (color === undefined) {
        color = "#000000"
    }
    ctx.strokeStyle = color
    ctx.lineWidth = Math.ceil(Math.min(width, height)/120)
    ctx.beginPath();

    if (graphtype === 2) {
        width = width*0.86
    }
    else {
        width = width*0.93
    }

    var calcvertical = []
    for (var i = 0;i<vertical.length;i++) {
        if (!isNaN(Number(vertical[i])) && (vertical[i]) !== "") {
            calcvertical.push(vertical[i])
        }
        //else {
        //This is a valid warning - It just got TOO ANNOYING
        //console.warn("Element " + i + " in list is an invalid number. It had a value of: " + vertical[i])
        //}
    }

    var vscale = Math.max(...calcvertical) - Math.min(...calcvertical)
    var hscale = Math.max(...horizontal) - Math.min(...horizontal)
    vscale = height/vscale
    hscale = width/hscale
    var voffset = Math.min(...calcvertical)
    var hoffset = Math.min(...horizontal)

    hoffset -= (Math.max(...horizontal) - Math.min(...horizontal))*0.07

    var px = Math.floor(((canvas.width)*0.07)/2.6)
    ctx.font = (px + 'px serif')
    if (color.length === 9) {
        color = color.slice(0,7)
    }
    ctx.fillStyle = color
    if (graphtype === 3) {
        var grd = ctx.createLinearGradient(0, 0, 0, height);
        grd.addColorStop(0, color);   
        grd.addColorStop(1, endcolor);
        ctx.strokeStyle = grd;
        ctx.fillStyle = grd;
    }    

    if (numplace === 0 || numplace === undefined) {
        var start = 1
        }
    else {
        var start = canvas.width-(canvas.width*0.07)
        }
    for(var i = 1;i<11;i++) {
        var Text = ((Math.max(...calcvertical) - Math.min(...calcvertical))*((i-1)/10))+Math.min(...calcvertical)

        let precision = Math.max(0, 3-String(Math.round(Text)).length)
        
        Text = Number(Text.toFixed(precision))

        ctx.fillText(Text, start, (height*(11-i))/10-5);
    }

    //Top one
    Text = ((Math.max(...calcvertical) - Math.min(...calcvertical))*((i-1)/10))+Math.min(...calcvertical)
    
    let precision = Math.max(0, 3-String(Math.round(Text)).length)
        
    Text = Number(Text.toFixed(precision))
    
    ctx.fillText(Text, start, 27);





    var px = Math.floor(((canvas.width)*0.07)/2.8)
    ctx.font = (px + 'px serif')
    if (color.length === 9) {
        color = color.slice(0,7)
    }


    if (!window.darkMode) {
        ctx.fillStyle = "black"
    }
    else {
        //Dark Mode
        ctx.fillStyle = "#cccccc"
    }    



	function formatDate(date) {
    	var time = String(date.getHours())
	
		if (date.getHours() < 10) {
			time += "0"
		}
		time += ":" + date.getMinutes()
		if (date.getMinutes() < 10) {
			time += "0"
		}
		time += " " + (date.getMonth()+1) + "/" + date.getDate() + "/" +date.getFullYear()
		return time
	}
	
    var time1 = new Date(timeframe[0])
    var time2 = new Date(timeframe[timeframe.length - 1])
    var time3 = new Date(((time2-time1)/2)+time1.getTime())
	
    var starttime = formatDate(time1)
    var endtime = formatDate(time2)
    var midtime = formatDate(time3)

    ctx.fillText(starttime, 10, (canvas.height*(11/12))-(canvas.height*0.06)-12)

    ctx.textAlign = "end"; 
    ctx.fillText(endtime, canvas.width-10, (canvas.height*(11/12))-(canvas.height*0.06)-12)

    ctx.textAlign = "center"; 
    ctx.fillText(midtime, canvas.width/2, (canvas.height*(11/12))-(canvas.height*0.06)-12)

    ctx.textAlign = "start";     



    var px = Math.floor(((canvas.width)*0.07)/2.4)
    ctx.font = (px + 'px serif')
    ctx.fillStyle = color
    //We need to create a gradient for just the text "Water Temperature (F)"
    if (graphtype === 3) {
        var grd = ctx.createLinearGradient(0, height, 200, height);
        grd.addColorStop(0, color);   
        grd.addColorStop(1, endcolor);
        ctx.strokeStyle = grd;
        ctx.fillStyle = grd;
    }

    if (graphtype === 2) {
        if (numplace === 0 || numplace === undefined) {
            ctx.fillText("Flow (Cubic Feet/Second)", start+5, (canvas.height*(11/12)));    
        }
        else {
            ctx.textAlign = "right"; 
            ctx.fillText("Gauge Height (Feet)", start-5, (canvas.height*(11/12)));
            ctx.textAlign = "start"; 
        } 
    }
    else if (graphtype === 3) {
        ctx.fillText("Water Temperature (°F)", start+5, (canvas.height*(11/12)));    
    }
    else {
        if (GraphName === "Precipitation") {
            ctx.fillText("Precipitation (Inches)", start+5, (canvas.height*(11/12))); 
            var fulldayprecip = 0
            var halfdayprecip = 0
            var preciplist = vertical.slice(-96)
            var preciplist = preciplist.map(Number)
            //convert strings to numbers
            preciplist.forEach(function(value){
                fulldayprecip += value
            })
            preciplist = preciplist.slice(-48)
            preciplist.forEach(function(value){
                halfdayprecip += value
            })

            fulldayprecip = fulldayprecip.toFixed(2)
            halfdayprecip = halfdayprecip.toFixed(2)

            ctx.fillText("Last 24 Hours: " + fulldayprecip + " in", canvas.width-700, (canvas.height*(11/12))); 
            ctx.fillText("Last 12 Hours: " + halfdayprecip + " in", canvas.width-330, (canvas.height*(11/12))); 
        }
        else if (GraphName === "cfs") {
            ctx.fillText("Flow (Cubic Feet/Second)", start+5, (canvas.height*(11/12)));    
        }
        else if (GraphName === "height") {
            ctx.fillText("Gauge Height (Feet)", start+5, (canvas.height*(11/12)));    
        }
        else {
            ctx.fillText("Labeling Error...", start+5, (canvas.height*(11/12)));    
        }    
    }

    //set it back    
    if (graphtype === 3) {
        //The area that actually has the graph is the top 80% height wise
        var grd = ctx.createLinearGradient(0, 0, 0, canvas.height*0.8);
        grd.addColorStop(0, color);   
        grd.addColorStop(1, endcolor);
        ctx.strokeStyle = grd;
        ctx.fillStyle = grd;
    }

    if (!window.darkMode) {
        ctx.fillStyle = "black"
    }
    else {
        //Dark Mode
        ctx.fillStyle = "#cccccc"
    }

    ctx.textAlign = "center"; 
    ctx.fillText(Source, canvas.width/2 , canvas.height-10);  
    ctx.textAlign = "start"; 




    function H(Value) {
        return Math.round((Value-hoffset)*hscale)
    }

    function V(Value) {
        return Math.round(height-((Value-voffset)*vscale))
    }


    for (var p = 0;p<Math.min(vertical.length, horizontal.length);p++) {
        if (!isNaN(Number(vertical[p])) && vertical[p] !== "") {
            ctx.moveTo(H(horizontal[p]), V(vertical[p]))
            break;
        }    
    }


    var valid = 1

    for (var i = p;i<Math.min(vertical.length, horizontal.length);i++) {
        if (!isNaN(Number(vertical[i])) && vertical[i] !== "") {
            if (valid === 1) {
                ctx.lineTo(H(horizontal[i]), V(vertical[i]))
            }
            else {
                ctx.moveTo(H(horizontal[i]), V(vertical[i])+10)
                ctx.lineTo(H(horizontal[i]), V(vertical[i]))
                valid = 1
            }
        }
        else {
            valid = 0
        }
    }


    ctx.stroke();
    ctx.beginPath()

    ctx.lineWidth = Math.ceil(ctx.lineWidth/10)

    if (!window.darkMode) {
        ctx.strokeStyle = "000000AA"
    }
    else {
        //Dark Mode
        ctx.strokeStyle = "#ccccccAA"
    }

    for (var i = 1;i<11;i++) {
        ctx.moveTo(0, height*(11-i)/10)
        ctx.lineTo(canvas.width, height*(11-i)/10)
    }
    ctx.stroke()
}    


/***/ }),
/* 3 */
/***/ (function(module, exports) {

function NewSpan(Text) {
    let span = document.createElement("span")
    span.className = "riverspan"
    span.innerHTML = Text
    return span
}

function addSorting(span, type) {
    span.onclick = function() {
        if (this.value === 1) {
            NewList(type, "sort", true) //Reversed
            this.value = 0
        }
        else {
            NewList(type, "sort")
            this.value = 1
        }
    }
}


function TopBar() {
    this.create = function() {
        let button = document.createElement("button")
        button.id = "topbar"
        button.className = "riverbutton"


        let span = NewSpan("River⇅")
        addSorting(span, "alphabetical")
        span.value = 1//Starts sorted alphabetically, a-z. The first sort needs to reverse that.
        button.appendChild(span)

        button.appendChild(NewSpan("Section"))

        span = NewSpan("Skill⇅")
        addSorting(span, "skill")
        span.value = 0
        button.appendChild(span) 

        span = NewSpan("Rating⇅")
        addSorting(span, "rating")
        span.value = 1 //We want greatest first, not least first, on the first sort
        button.appendChild(span) 

        button.appendChild(NewSpan("Flow Info/Trend"))

        return button
    }

    this.delete = function() {
        let Node = document.getElementById("topbar")
        if (Node) {
            Node.parentNode.removeChild(Node)
        }
    }
}


module.exports = {
    TopBar
}


/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {


let addGraphs = __webpack_require__(5).addGraphs



function addClickHandler(button, locate) {
    //Code that runs when the button is clicked
    button.onclick = function () {
        let river = ItemHolder[locate]
        if (river.expanded === 0) {
            river.expanded = 1
            var div = document.createElement("div")
            div.innerHTML = river.writeup + "<br>"

            if (river.plat && river.plon) {
                div.innerHTML += "<br>Put-In GPS Coordinates: " + river.plat + ", " + river.plon
            }

            if (river.tlat && river.tlon) {
                div.innerHTML += "<br>Take-Out GPS Coordinates: " + river.tlat + ", " + river.tlon
            }

            if (river.aw) {
                div.innerHTML += "<br><br><a href='https://www.americanwhitewater.org/content/River/detail/id/" + river.aw + "'>Click here to view this river on American Whitewater</a>"
            }

            //USGS data may not have loaded yet
            if (self.usgsarray) {
                data = self.usgsarray[river.usgs] 
                addGraphs(div, data)
            }

            div.style.padding = "6px"
            div.id = river.base + 2
            if (!window.darkMode) {
                button.style.backgroundColor = "#e3e3e3"
            }
            else {
                //Dark Mode
                button.style.backgroundColor = "#333333"
            }
            button.parentNode.insertBefore(div, button.nextSibling)
        }
        else {
            river.expanded = 0
            button.style.backgroundColor = ""//Let the button inherit the default color
            var elem = document.getElementById(river.base + 2)
            if (elem) {
                elem.parentNode.removeChild(elem)
            }

        }        
    }    
}




function calculateDirection(usgsNumber) {
	let usgsData = usgsarray[usgsNumber]
	if (usgsData) {
		let data;
		
		if (usgsData["00060"]) {data = usgsData["00060"].values}
		else if (usgsData["00065"]) {data = usgsData["00065"].values}
		
		if (data) {
			let current;
			let previous;
			
			//We will go back 4 datapoints (1 hour) if possible. 
			//Do this because USGS sometimes does 1 hour intervals instead of 15 minutes
			let stop = Math.max(data.length-5, 0)
			for (let i=data.length;i>stop;i--) {
				let item = data[i]
				if (!item) {continue}
				let value = item.value
				if (!current) {
					current = value
				}
				else {
					previous = value
				}
			}
			
			if (current > previous) {
				//Water level rising
				return "⬆"
			}
			else if (previous > current) {
				//Water level falling
				return "⬇"
			}
			else if (current === previous) {
				//Water level stable
				return "-"
			}
			
		}
	}
	return; //If we got here, there is not enough USGS data. 
}







module.exports.River = function(locate, event) {
	
	//Copies name, section, skill, rating, writeup, tags, usgs, plat,plon, tlat,tlon, aw
	Object.assign(this, event)
	//tags needs to be a string. It can't be undefined
    this.tags = this.tags || ""
	//Convert the numeric value to the filename
    switch (Number(this.rating)) {
        case 1:
            this.rating = "1Star";
            break;
        case 2:
        case 3:
        case 4:
        case 5:
            this.rating = event.rating + "Stars";
            break;
        default:
            this.rating = "Error"
    }
    if (!this.rating) {
        this.rating = "Error"
    }


    this.base = "b" + locate
    this.expanded = 0
    this.index = locate


    this.create = function (forceregenerate) {
        //Only create the button once - It's about 3 times faster.
        if (!this.finished || forceregenerate) {
            var button = document.createElement("button")
            button.id = this.base + 1

            function AddSpan(text) {
                let span = document.createElement("span")
                span.innerHTML = text
                span.className = "riverspan"
                button.appendChild(span)
            }

            AddSpan(this.name)
            AddSpan(this.section)
            AddSpan(this.skill)

            //Star images for rating
            if (this.rating === "Error") {
                AddSpan("???") 
            }
            else {
                let img = document.createElement("img")
                img.src = "resources/" + this.rating + ".png"
                img.alt = this.rating[0] + " Stars"
                img.className = "starimg"
                let span = document.createElement("span")
                span.appendChild(img)
                span.className = "riverspan"
                button.appendChild(span)
            }



            if (this.flow) {
                AddSpan(this.flow + " " + calculateDirection(this.usgs))
            }
            

            
            button.className = "riverbutton"
            //Add the click handler
            addClickHandler(button, locate)


            //Make content available to Googlebot for indexing
            if (navigator.userAgent.toLowerCase().indexOf("google") !== -1) {
                try {
                    setTimeout(function(){button.dispatchEvent(new Event("click"))}, 100)
                }
                catch(e) {}
            }
            //The code directly above this is used to allow Googlebot to index content. 
            //Shall it result in an SEO hit, or shall Googlebot be improved to handle content inside of JavaScript,
            //It can safely be removed.    


            //Store button for reuse later   
            this.finished = button

        }    

        //Return finished button
        return this.finished

    }


    this.delete = function () {
        let river = ItemHolder[locate]
        function Remove(Code) {
            let ToDelete = document.getElementById(river.base + Code)
            if (ToDelete) {
                ToDelete.parentNode.removeChild(ToDelete)
            }
        }

        //Reset background color
        let reset = document.getElementById(river.base + 1)
        if (reset) {
            reset.style.backgroundColor = ""
        }

        Remove(2)
        Remove(1)   

    } 
}



/***/ }),
/* 5 */
/***/ (function(module, exports) {


//Auxillary Function
//Creates the canvas used by each of the graphs
function createcanvas() {
    let canvas = document.createElement("canvas")
    canvas.width = 1200
    canvas.height = 800 

    //Make sure the background is not transparent
    let ctx = canvas.getContext("2d");
    if (!window.darkMode) {
        ctx.fillStyle = "white";
    }
    else {
        //Dark Mode
        ctx.fillStyle = "black"
    }
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    return canvas
}


//Auxillary Function
function toparts(arr) {
    let values = []
    let timestamps = []

    for (let i=0;i<arr.length;i++) {
        let obj = arr[i]
        values.push(obj.value)
        timestamps.push(obj.dateTime)
    }

    return {values:values,timestamps:timestamps}
}


function addFlowGraph(div, cfs, height) {
    //Make sure we actually have some data, and don't create an empty graph
    if (!(cfs || height)) {return}

    let canvas = createcanvas()
    //Time to create a dual lined graph!
    if (cfs && height) {
        let parts = toparts(cfs.values)
        addLine("cfs", parts.timestamps, data.name, canvas, 0, parts.values, "#00AAFFa0", 2)
        parts = toparts(height.values)
        addLine("height", parts.timestamps, data.name, canvas, 0, parts.values, "#2222FFa0", 2, 1)                
    }
    //We won't have both cfs and height. Draw a single line graph for whichever we have.
    else if (cfs) {
        let parts = toparts(cfs.values)
        addLine("cfs", parts.timestamps, data.name, canvas, 0, parts.values, "#00AAFF")
    }
    else {
        let parts = toparts(height.values)
        addLine("height", parts.timestamps, data.name, canvas, 0, parts.values, "#2222FF")    
    }

    //For some reason, only the last canvas was showing. Use images
    //Images also allow "Save Image As"
    let img = document.createElement("img")
    img.className = "graph"
    //Blobs may be faster - but I don't know of a synchronus method
    img.src = canvas.toDataURL("image/png")

    div.appendChild(img)
}


function addTempGraph(div, temp) {
    if (temp) {
        let canvas = createcanvas()

        let parts = toparts(temp.values)
        addLine("", parts.timestamps, data.name, canvas, 0, parts.values, "#FF0000", 3, "#0000FF")

        //For some reason, only the last canvas was showing. Use images
        //Images also allow "Save Image As"
        let img = document.createElement("img")
        img.className = "graph"
        img.src = canvas.toDataURL("image/png")
        div.appendChild(img)
    }
}



function addPrecipGraph(div, precip) {
    if (precip) {
        let canvas = createcanvas() 

        let parts = toparts(precip.values)
        addLine("Precipitation", parts.timestamps, data.name, canvas, 0, parts.values, "#0066FF")

        //For some reason, only the last canvas was showing. Use images
        //Images also allow "Save Image As"
        let img = document.createElement("img")
        img.className = "graph"
        img.src = canvas.toDataURL("image/png")
        div.appendChild(img)
    }
}


module.exports.addGraphs = function(div, data) {

    //The graphing is wrapped in a try-catch statement because USGS often supplies invalid data
    //for a specific river due to gauge problems.
    //Each canvas is wrapped individually because sometimes only some graphs have invalid data
    div.innerHTML += "<br><br>" //Space the first canvas

    let temp = data["00010"]
    let precip = data["00045"]
    let cfs = data["00060"]
    let height = data["00065"]


    try {
        addFlowGraph(div, cfs, height)
    }
    catch(e){console.warn("Error creating flow graph: " + e)}

    try {
        addTempGraph(div, temp)
    }
    catch(e){console.warn("Error creating temperature graph: " + e)}

    try {
        addPrecipGraph(div, precip)
    }
    catch(e){console.warn("Error creating precipitation graph: " + e)}
}


/***/ }),
/* 6 */
/***/ (function(module, exports) {

function simpleSort(list, propertyName) {
    list.sort(function(a,b) {
        if (a[propertyName] > b[propertyName]) {
            return 1;
        }
        if (a[propertyName] < [propertyName]) {
            return -1;
        }
        return 0;
    })
    return list
}


function alphabeticalsort(list, reverse) {
    list = simpleSort(list, "name")

    if (reverse) {
        list.reverse()
    }
    
    return list
}

function ratingsort(list, reverse) {
    list = simpleSort(list, "rating")

    if (reverse) {
        list.reverse()
    }
    //Move error values to end
    while (list[0].rating === "Error") {
        list.push(list.shift())
    }  
    return list
}


function skillsort(list, reverse) {
    list.sort(function(a,b) {

        function ToNum(value) {

            switch (value.skill) {
                case "FW":
                    value = 1;
                    break;
                case "B":
                    value = 2;
                    break;
                case "N":
                    value = 3;
                    break;
                case "LI":
                    value = 4;
                    break;
                case "I":
                    value = 5;
                    break;
                case "HI":
                    value = 6;
                    break;
                case "A":
                    value = 7;
                    break;
                case "E":
                    value = 8;
                    break;
                default:
                    value = 9;
            }
            return value
        }       
        return ToNum(a)-ToNum(b)
    })


    if (reverse) {
        list.reverse()
        while (list[0].skill === "?") {
            list.push(list.shift())
        }
    }

    return list
}




function sort(method, list, reverse) {
    if (method === "alphabetical") {
        list = alphabeticalsort(list, reverse)
    }
    else if (method === "rating") {
        list = ratingsort(list, reverse)
    }
    else if (method === "skill") {
        list = skillsort(list, reverse)
    }
    else {
        throw "Unknown sorting method " + method
    }
    return list
}


module.exports = {
    ratingsort,
    alphabeticalsort,
    skillsort,
    sort
}

/***/ }),
/* 7 */
/***/ (function(module, exports) {

function normalSearch(list, query) {
    let l = [[],[],[],[],[]]
    list.forEach(function(event){
        if(event.tags.toLowerCase().indexOf(query) !== -1) {
            if (event.name.toLowerCase().indexOf(query) !== -1) {
                l[0].push(event)
            }
            else {
                l[1].push(event)
            }
        }
        else if (event.name.toLowerCase().indexOf(query) !== -1) {
            l[2].push(event)
        }
        else if (event.section.toLowerCase().indexOf(query) !== -1) {
            l[3].push(event)
        }
        else if (event.writeup.toLowerCase().indexOf(query) !== -1) {
            l[4].push(event)
        }
    })

    list = l[0].concat(l[1],l[2],l[3])

    //Add the less relevant results below
    list = list.concat(l[4])
    
    return list
}

function advancedSearch(list) {
    //Passthrough function
    return list
}



module.exports = {
    normalSearch,
    advancedSearch
}

/***/ }),
/* 8 */
/***/ (function(module, exports) {

self.usgsarray = {} 

module.exports.loadUSGS = async function() {
    
    var sites = []
    for (let i=0;i<riverarray.length;i++) {
        let val = riverarray[i].usgs
        //Check for accuracy
        if (val && val.length > 7 && val.length < 16) {
            sites.push(val)
        }
    }
    let url = "https://waterservices.usgs.gov/nwis/iv/?format=json&sites=" + sites.join(",") +  "&startDT=" + new Date(Date.now()-1000*86400).toISOString()  + "&parameterCd=00060,00065,00010,00045&siteStatus=all"

    let response = await fetch(url)
    let usgsdata = await response.json()    

    //Iterate through all known conditions
    usgsdata.value.timeSeries.forEach(function(event){
        let obj2 = {}
        obj2.values = event.values[0].value //The values - ex. Gauge Height Array
      
        if (obj2.values.length === 0) {
          console.log("Empty Array. Skipping")
          return;
        }
      
        obj2.units = event.variable.variableDescription //Units of values
        
        let sitecode = event.sourceInfo.siteCode[0].value
        //See if the site is already in the array.
        //If the site code is not in the array, add it. 
        if (!usgsarray[sitecode]) {
            let obj3 = {}
            obj3.name = event.sourceInfo.siteName
            usgsarray[sitecode] = obj3
        }
      
        let variablecode = event.variable.variableCode[0].value

        //Convert celcius to farenheight
        if (variablecode === "00010" && obj2.units === "Temperature, water, degrees Celsius") {
          for (let i=0;i<obj2.values.length;i++) {
            obj2.values[i].value = obj2.values[i].value * 1.8 + 32
          }
          
          obj2.units = "Temperature, water, degrees Fahrenheit"
        }
      
         
        //Add the values onto the site code object
        usgsarray[sitecode][variablecode] = obj2
    })
  
    //Add USGS Data to Graph
    for (let i=0;i<ItemHolder.length;i++) {
      let item = ItemHolder[i]
      let data = usgsarray[item.usgs]
      
      if (data) {
        let cfs = data["00060"]
        let feet = data["00065"]
        
        //Prevent "TypeError: Can't Read Property 'values' of undefined"
        if (cfs) {cfs = cfs.values}
        if (feet) {feet = feet.values}

        if (cfs && feet) {
          item.flow = cfs[cfs.length - 1].value + " cfs, " + feet[feet.length - 1].value + " ft"
        }
        else if (cfs) {
          item.flow = cfs[cfs.length - 1].value + " cfs"
        }
        else if (feet) {
          item.flow = feet[feet.length - 1].value + " ft" 
        }

        //item.create(true) will force regeneration of the button
        //Replace the current button so that the flow info shows 
        let elem = document.getElementById(item.base + "1")
        let expanded = item.expanded
        console.log(expanded)
        let replacement = item.create(true) //Update the version in cache
        try {
            elem.parentNode.replaceChild(replacement, elem)
            //If the river was expanded before, keep it expanded
            if (expanded) {
                replacement.dispatchEvent(new Event("click"))
                //For some reason, the automatically opened buttons and the manually opened buttons behave different.
                if (navigator.userAgent.toLowerCase().indexOf("google") === -1) {
                    replacement.dispatchEvent(new Event("click"))
                }
            }
        }
        catch (e) {} //The list must have been sorted - the node was not currently in list
      }
    }
    
}


/***/ })
/******/ ]);
//# sourceMappingURL=index.js.map