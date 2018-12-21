/*
3DHOP - 3D Heritage Online Presenter
Copyright (c) 2014-2019, Visual Computing Lab, ISTI - CNR
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
// creates a copy of a pure JSON structure
//-----------------------------------------
function jsonCopy(src) {
  return JSON.parse(JSON.stringify(src));
}