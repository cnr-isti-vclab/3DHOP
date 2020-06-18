/*
3DHOP - 3D Heritage Online Presenter
Copyright (c) 2014-2020, Visual Computing Lab, ISTI - CNR
All rights reserved.

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program.  If not, see <http://www.gnu.org/licenses/>.
*/


//------------------------------------------------------
// returns a pastel color. 
// You specify how many unique colors you need, and which color you want to generate
// colorNum is the # of the color you need (0 - NCol-1)
// totalColors is the total number NCol of available colors
//------------------------------------------------------
function pastelColor(colorNum, totalColors) {
	return hsvToRgb(colorNum*(360.0/totalColors), 0.4, 0.8);
}

//------------------------------------------------------
//  HSV space to RGB [0-1]
//------------------------------------------------------
function hsvToRgb(h, s, v) {
    var i,f,p,q,t;

	// Achromatic (grey)
    if(s == 0) return [ v, v, v ];

    h /= 60; // sector 0 to 5
    i = Math.floor(h);
    f = h - i; // factorial part of h
    p = v * (1 - s);
    q = v * (1 - s * f);
    t = v * (1 - s * (1 - f));

    switch(i) {
        case 0:
		    return [ v, t, p ];
            break;
        case 1:
			return [ q, v, p ];		
            break;
        case 2:
			return [ p, v, t ];
            break;
        case 3:
			return [ p, q, v ];
            break;
        case 4:
			return [ t, p, v ];		
            break;
        default: // case 5:
			return [ v, p, q ];		
    }
}

//-----------------------------------------
// return relative mouse coordinates of an event
// i.e. the coordinates in the canvas space
//
// to start using this function, install it like this:
// HTMLCanvasElement.prototype.relMouseCoords = relMouseCoords;
//
//----------------------------------------
function relMouseCoords(event){
    var totalOffsetX = 0;
    var totalOffsetY = 0;
    var canvasX = 0;
    var canvasY = 0;
    var pageX = 0;
    var pageY = 0;
    var currentElement = this;

    do {
        totalOffsetX += currentElement.offsetLeft - currentElement.scrollLeft;
        totalOffsetY += currentElement.offsetTop - currentElement.scrollTop;
    }
    while(currentElement = currentElement.offsetParent)

    (event.touches) ? (pageX = event.touches[0].pageX) : (pageX = event.pageX);
    (event.touches) ? (pageY = event.touches[0].pageY) : (pageY = event.pageY);

    canvasX = pageX - totalOffsetX;
    canvasY = pageY - totalOffsetY;

    return {x:canvasX, y:canvasY}
}

//-----------------------------------------
// parses the URL page parameters, i.e. url like object.html?property1=value1&property2=value2
// fills the "parameters" object with the parsed set of property-value couples
//-----------------------------------------
function parsePageParams() {
	var parsedParameters = [];
    var paramString = document.URL.split('?')[1];
    if(paramString != undefined){
        paramString = paramString.split('&');
        for(var i = 0; i < paramString.length; i++){
            var currParam = paramString[i].split('=');
            parsedParameters[currParam[0]] = currParam[1];
        }
	}
	return parsedParameters;
}

//-----------------------------------------
// creates a copy of a pure JSON structure
//-----------------------------------------
function jsonCopy(src) {
  return JSON.parse(JSON.stringify(src));
}