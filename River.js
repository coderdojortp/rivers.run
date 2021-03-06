
let addGraphs = require("./addGraphs.js").addGraphs



function addHandlers(button, locate) {
	let river = ItemHolder[locate]

			if (river.minrun && river.maxrun) {
				window.addEventListener("colorSchemeChanged", function() {
					button.style.backgroundColor = calculateColor(river)
				})

				button.addEventListener("mouseover", function(){
					button.style.backgroundColor =  calculateColor(river, {highlighted: true})
				})

				button.addEventListener("mouseout", function(){
					button.style.backgroundColor = calculateColor(river)
				})
			}
	
			if (river.dam) {
				window.addEventListener("colorSchemeChanged", function() {
					button.style.backgroundColor = createStripes()
				})
			}

    //Code that runs when the button is clicked
    button.onclick = function () {
        if (river.expanded === 0) {
            river.expanded = 1
            var div = document.createElement("div")

			div.innerHTML = ""

			if (river.dam) {
                //Adding to div.innerHTML works, but logs CSP errors
                let link = document.createElement("a")
                link.target = "_blank"
                link.rel = "noopener"
                link.href = river.dam
                link.innerHTML = "This river has a dam. View information."
                div.appendChild(link)
				div.appendChild(document.createElement("br"))
				div.appendChild(document.createElement("br"))
            }

			div.innerHTML += river.writeup + "<br><br>"

            if (river.plat && river.plon) {
                div.innerHTML += "Put-In GPS Coordinates: " + river.plat + ", " + river.plon + "<br>"
            }

            if (river.tlat && river.tlon) {
                div.innerHTML += "Take-Out GPS Coordinates: " + river.tlat + ", " + river.tlon + "<br>"
            }

            let values = ["minrun", "lowflow", "midflow", "highflow", "maxrun"]
            for (let i=0;i<values.length;i++) {
                let name = values[i]
                if (river[name]) {
                    div.innerHTML += name + ":" + river[name] + " "
                }
            }


            if (river.aw) {
                div.appendChild(document.createElement("br"))
                let link = document.createElement("a")
                link.target = "_blank"
                link.rel = "noopener"
                link.href = "https://www.americanwhitewater.org/content/River/detail/id/" + river.aw
                link.innerHTML = "Click here to view this river on American Whitewater"
                div.appendChild(link)
            }


            if (river.usgs) {
                //Adding to div.innerHTML works, but logs CSP errors
                div.appendChild(document.createElement("br"))
                let link = document.createElement("a")
                link.target = "_blank"
                link.rel = "noopener"
                link.href = "https://waterdata.usgs.gov/nwis/uv?site_no=" + river.usgs
                link.innerHTML = "View flow information on USGS"
                div.appendChild(link)
            }


            //USGS data may not have loaded yet
			if (self.usgsarray && river.usgs) {
				//Alert the user if the data is (at least 2 hours) old

				let dataAge
                try {
                    dataAge = calculateAge(river.usgs)
                }
                catch(e) {
                    console.error(e)
                    dataAge = null
                }
                let maxAge = 1000*60*60*2
                let oldDataWarning;
				if (dataAge > maxAge) {
					oldDataWarning = document.createElement("p")
					oldDataWarning.innerHTML = "Check the dates! This river data is more than " + Math.floor(dataAge/1000/60/60) + " hours old!"

					oldDataWarning.className = "oldDataWarning"
					div.appendChild(oldDataWarning)
				}

                let data = self.usgsarray[river.usgs]
                if (data) {
                    let disclaimer = document.createElement("p")
                    disclaimer.style.fontWeight = "bold"
                    disclaimer.style.textAlign = "center"
                    disclaimer.innerHTML = "Disclaimer: USGS Gauge data is provisional, and MIGHT be incorrect. Use at your own risk."
                    div.appendChild(disclaimer)

                    if (!(dataAge > maxAge)) {
                        disclaimer.style.marginTop = "2em" //Space the disclaimer from the content above
                    }
                    else {
                        disclaimer.style.marginTop = "0.5em" //Make the disclaimer closer to the warning
                        oldDataWarning.style.marginBottom = "0.5em"

                    }
                    addGraphs(div, data)
                }
			}


            div.style.padding = "6px"
            div.id = river.base + 2
            button.parentNode.insertBefore(div, button.nextSibling)
        }
        else {
            river.expanded = 0
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



function calculateAge(usgsNumber) {
	//Returns millseconds old that USGS data is
    let usgsData = window.usgsarray[usgsNumber]
    if (usgsData) {
        let data;

        if (usgsData["00060"]) {data = usgsData["00060"].values}
        else if (usgsData["00065"]) {data = usgsData["00065"].values}
        else if (usgsData["00010"]) {data = usgsData["00010"].values}
        else if (usgsData["00045"]) {data = usgsData["00045"].values}

        if (data) {
            for (let i=data.length;i>=0;i--) {
                let item = data[i]
                if (!item) {continue}
                return Date.now() - Number(new Date(item.dateTime))
            }
        }
    }
    return null; //If we got here, there is not enough USGS data.
}



function calculateColor(river, options) {
    //hsla color values
    //hsla(hue, saturation, lightness, opacity)
    //Saturation hue is 0 red 120 green 240 blue
    //Saturation - use 100%
    //Lightness - use 50%
    //Opacity - Decimal 0 to 1


    //Defines river.running
    //0-4
    //0 is too low, 4 is too high, other values in between


    let values = ["minrun", "lowflow", "midflow", "highflow", "maxrun"]

    let type; //Currently, we skip a value if one datapoint is cfs and another feet

    for (let i=0;i<values.length;i++) {

        let str = river[values[i]]
        if (!str) {
            values[i] = undefined
            continue;
        }

        str = str.trim()
        let value = parseFloat(str)
        let currentType = str.match(/[^\d|.]+/) //Match the integer or decimal number

        if (currentType) {
            currentType = currentType[0].trim() //Match a string of non-digits
        }

        if (!type && currentType) {
            type = currentType
        }
        else if (type === currentType) {}
        else {
            console.warn(values[i] + " on " + river.name + " " + river.section + " has a different extension and has been skipped")
            values[i] = undefined
            continue;
        }

        values[i] = value
    }

    let flow;
    if (type === "cfs") {
        flow = river.cfs
    }
    else if (type === "feet" || type==="ft") {
        flow = river.feet
    }


    //Use or equal to
    //While that technically may not be correct (says that river is too low at minrun), it makes no significant difference
    //In addition, values equal to minrun or maxrun result in a river.running of 0 or 4
    //Meaning that they may be included in the middle of a darker highlighted rivers
    //When sorting by runnability is used.

    //It would be better if rivers that are too high or too low are still given river.running values
    //related to their level. This would also help in determining if something is just barely
    //too low, and may come up with rain, or is truely too low.


    if (flow <= values[0]) {
        //Too low
        river.running = 0
	    let lightness = (options && options.highlighted)? (window.darkMode? "28%": "63%"):  window.darkMode? "23%": "67%"
        return "hsl(0,100%," + lightness + ")"
    }
    else if (flow >= values[4]) {0
        //Too high
        river.running = 4
    	let lightness = (options && options.highlighted)? (window.darkMode? "30%": "67%"):  window.darkMode? "20%": "69%"
        return "hsl(240,100%," + lightness + ")"
    }
    else {

		//Normal Flow lightness values
		//Tough to see a difference when highlighted amount the more middle values in light mode.
    	let lightness = (options && options.highlighted)? (window.darkMode? "30%": "65%"): window.darkMode? "25%": "70%"

		//If we don't have some values, fill them in using logarithms
        //TODO: Do some analyzsis and figure out the best way to do these calculations

        let minrun = values[0]
        let maxrun = values[4]
        let midflow = values[2] || 10**((Math.log10(minrun) + Math.log10(maxrun))/2)
        let lowflow = values[1] || 10**((Math.log10(minrun) + Math.log10(midflow))/2)
        let highflow = values[3] || 10**((Math.log10(midflow) + Math.log10(maxrun))/2)

        //We display these so people can tell what values the computer has generated.
        river.lowflow = parseFloat(lowflow.toFixed(3)) + type
        river.midflow = parseFloat(midflow.toFixed(3)) + type
        river.highflow = parseFloat(highflow.toFixed(3)) + type

        function calculateRatio(low, high, current) {
            low = Math.log(low)
            high = Math.log(high)

            current = Math.log(current)


            let range = high-low
            let value = current-low

            return value/range

        }

        if (flow < lowflow) {
            river.running = calculateRatio(minrun, lowflow, flow)
        }
        else if (flow < midflow) {
            river.running = 1+calculateRatio(lowflow, midflow, flow)
        }
        else if (flow < highflow) {
            river.running = 2+calculateRatio(midflow, highflow, flow)
        }
        else {
            river.running = 3+calculateRatio(highflow, maxrun, flow)
        }

        return "hsl(" + (0 + 60*river.running) + ",100%," + lightness + ")"
    }
}


function createStripes(newColor = window.darkMode ? "rgba(256,256,256,0.2)":"#aaaaaa55", oldColor = "rgba(0,0,0,0)") {
		//If the river has a dam, stripe it.

		let background = "linear-gradient(150deg"

		for (let i=0;i<19;i++) {
			background += ", "
			background += i % 3 ? oldColor:newColor
		}
		
		return background
}




module.exports.River = function(locate, event) {

    //Copies name, section, skill, rating, writeup, tags, usgs, plat,plon, tlat,tlon, aw, dam
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

    this.skill = this.skill || "?"

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
                return span
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
                let flowSpan = AddSpan(this.flow + calculateDirection(this.usgs) + (this.dam ? "Dam" : ""))
            }
			else if (this.dam) {AddSpan("Dam")}


            button.className = "riverbutton"
            //Add the click handler
            addHandlers(button, locate)

            //Store button for reuse later
            this.finished = button

        }

		this.updateExpansion = function() {
			//Do not use "this". If called from event listener on window it will fail.
			let river = ItemHolder[locate]
			//Make sure it is expanded. Otherwise, there is no need to update the expansion - and
			//updating the expansion can take a lot of time, expecially if it causes reflow.
			if (river.expanded) {
				river.finished.onclick()
				river.finished.onclick()
			}
		}

		window.addEventListener("colorSchemeChanged", this.updateExpansion)

		if (this.dam) {
			this.finished.style.background = createStripes()
		}
		
		if (this.minrun && this.maxrun && this.flow) {
			this.finished.style.backgroundColor = calculateColor(this)
		}
		else if (this.dam) {
			//Background color gets overwrote by background. This class uses !important to prevent that.
			this.finished.classList.add("riverbuttonDam")
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
