/*
3DHOP - 3D Heritage Online Presenter
Copyright (c) 2014-2016, Marco Callieri - Visual Computing Lab, ISTI - CNR
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

function init3dhop() {
	var interval, id, ismousedown;
	var button = 0;
	
	$('#toolbar img')
		.mouseenter(function(e) {
			id = $(this).attr('id');
			if(!ismousedown) $(this).css("opacity","0.8");
			else $(this).css("opacity","1.0");
		})
		.mouseout(function(e) {
			clearInterval(interval); 
			$(this).css("opacity","0.5");
		})
		.mousedown(function(e) {
			ismousedown = true;
			if(e.button==button){
				actionsToolbar(id);
				if(id == "zoomin" || id == "zoomout"){
					interval = setInterval(function(){
						actionsToolbar(id);
					}, 100);
				}
				else {
					clearInterval(interval); 
				}
				$(this).css("opacity","1.0");
				button=0;
			}
		})
		.mouseup(function(e) {
			ismousedown = false;
			if(e.button==button){
				clearInterval(interval); 
				$(this).css("opacity","0.8");
				button=0;
			}
		})
		.on('touchstart', function(e) { 
			button=2;
		})
		.on('touchend', function(e) {
			button=0;
		});

	$('#3dhop')
		.on('contextmenu', function(e){ 
			return false; 
		})
		.on('touchstart', function(e) {
			$('#toolbar img').css("opacity","0.5");
		})
		.on('touchend', function(e) {
			clearInterval(interval); 
		})
		.on('touchmove', function(e) {
			clearInterval(interval); 
			$('#toolbar img').css("opacity","0.5");
		});

	$('#draw-canvas')
		.mousedown(function(e) { 
			$('#toolbar img').css("opacity","0.5"); 
			if(e.preventDefault) e.preventDefault(); 
			if (window.getSelection && window.getSelection()!='') window.getSelection().removeAllRanges();
			else if (document.selection && document.selection.createRange()!='') document.selection.empty();
		});

	if (window.navigator.userAgent.indexOf('Trident/') > 0) { //IE fullscreen handler 
		$('#full').click(function(e) {enterFullscreen();});
		$('#full_on').click(function(e) {exitFullscreen();});
	}

	resizeCanvas($('#3dhop').parent().width(),$('#3dhop').parent().height());

	if ($('#pickpoint-box').length) movePickpointbox(($('#pick').offset().left + $('#pick').width() + 5), ($('#pick').offset().top));
	if ($('#measure-box').length) moveMeasurementbox(($('#measure').offset().left + $('#measure').width() + 5), ($('#measure').offset().top));
	if ($('#sections-box').length) moveSectionsbox(($('#sections').offset().left + $('#sections').width() + 5), ($('#sections').offset().top));
	if ($('#pointsize-box').length) movePointsizebox(($('#pointsize').offset().left + $('#pointsize').width() + 5), ($('#pointsize').offset().top));

	set3dhlg();
} 

function lightSwitch() {
  var on = presenter.isLightTrackballEnabled();

  if(on){
    $('#light').css("visibility", "hidden");
    $('#light_on').css("visibility", "visible");
    $('#light_on').css("opacity","1.0");
  }
  else{
    $('#light_on').css("visibility", "hidden");
    $('#light').css("visibility", "visible");
    $('#light').css("opacity","1.0");
  }
}

/*DEPRECATED*/
function measurementSwitch() {
  var on = presenter.isMeasurementToolEnabled();

  if(on){
    $('#measure').css("visibility", "hidden");
    $('#measure_on').css("visibility", "visible");
    $('#measure_on').css("opacity","1.0");
    $('#measurebox').css("visibility","visible");
    $('#draw-canvas').css("cursor","crosshair");
  }
  else{
    if (window.getSelection && window.getSelection()!='') window.getSelection().removeAllRanges();
    else if (document.selection && document.selection.createRange()!='') document.selection.empty();
    $('#measure_on').css("visibility", "hidden");
    $('#measure').css("visibility", "visible");
    $('#measure').css("opacity","1.0");
    $('#measurebox').css("visibility","hidden");
    $('#measure-output').html("0.0");
    if (!presenter.isAnyMeasurementEnabled()) $('#draw-canvas').css("cursor","default");
  }
}

function pickpointSwitch() {
  var on = presenter.isPickpointModeEnabled();

  if(on){
    $('#pick').css("visibility", "hidden");
    $('#pick_on').css("visibility", "visible");
    $('#pick_on').css("opacity","1.0");
    $('#pickpoint-box').css("visibility","visible");
    $('#draw-canvas').css("cursor","crosshair");
  }
  else{
    if (window.getSelection && window.getSelection()!='') window.getSelection().removeAllRanges();
    else if (document.selection && document.selection.createRange()!='') document.selection.empty();
    $('#pick_on').css("visibility", "hidden");
    $('#pick').css("visibility", "visible");
    $('#pick').css("opacity","1.0");
    $('#pickpoint-box').css("visibility","hidden");
    $('#pickpoint-output').html("[ 0 , 0 , 0 ]");
    if (!presenter.isAnyMeasurementEnabled()) $('#draw-canvas').css("cursor","default");
  }
}

function measureSwitch() {
  var on = presenter.isMeasurementToolEnabled();

  if(on){
    $('#measure').css("visibility", "hidden");
    $('#measure_on').css("visibility", "visible");
    $('#measure_on').css("opacity","1.0");
    $('#measure-box').css("visibility","visible");
    $('#draw-canvas').css("cursor","crosshair");
  }
  else{
    if (window.getSelection && window.getSelection()!='') window.getSelection().removeAllRanges();
    else if (document.selection && document.selection.createRange()!='') document.selection.empty();
    $('#measure_on').css("visibility", "hidden");
    $('#measure').css("visibility", "visible");
    $('#measure').css("opacity","1.0");
    $('#measure-box').css("visibility","hidden");
    $('#measure-output').html("0.0");
    if (!presenter.isAnyMeasurementEnabled()) $('#draw-canvas').css("cursor","default");
  }
}

function hotspotSwitch() {
  var on = presenter.isSpotVisibilityEnabled();

  if(on){
    $('#hotspot').css("visibility", "hidden");
    $('#hotspot_on').css("visibility", "visible");
    $('#hotspot_on').css("opacity","1.0");
  }
  else{
    $('#hotspot_on').css("visibility", "hidden");
    $('#hotspot').css("visibility", "visible");
    $('#hotspot').css("opacity","1.0");
  }
}

function showSectionTool(on) 
{  
	if(on){
		// default section value
		presenter.setClippingXYZ(0, 0, 0);
		presenter.setClippingPointXYZ(0.5, 0.5, 0.5);	
	
		// setup interface 
		var xplaneSlider = document.getElementById("xplaneSlider");
		xplaneSlider.min = 0.0;
		xplaneSlider.max = 1.0;
		xplaneSlider.step = 0.01;
		xplaneSlider.defaultValue = 0.5;
		xplaneSlider.oninput=function(){presenter.setClippingPointX(this.valueAsNumber);};
		document.getElementById("xplaneFlip").checked = false;		
		document.getElementById("xplaneFlip").onchange=function(){
			if(presenter._clipAxis[0]!=0){
				if(this.checked) presenter.setClippingX(-1);
				else presenter.setClippingX(1);
			}
		};

		var yplaneSlider = document.getElementById("yplaneSlider");
		yplaneSlider.min = 0.0;
		yplaneSlider.max = 1.0;
		yplaneSlider.step = 0.01;		
		yplaneSlider.defaultValue = 0.5;
		yplaneSlider.oninput=function(){presenter.setClippingPointY(this.valueAsNumber);};
		document.getElementById("yplaneFlip").checked = false;
		document.getElementById("yplaneFlip").onchange=function(){
			if(presenter._clipAxis[1]!=0){
				if(this.checked) presenter.setClippingY(-1);
				else presenter.setClippingY(1);
			}
		};

		var zplaneSlider = document.getElementById("zplaneSlider");
		zplaneSlider.min = 0.0;
		zplaneSlider.max = 1.0;
		zplaneSlider.step = 0.01;
		zplaneSlider.defaultValue = 0.5;
		zplaneSlider.oninput=function(){presenter.setClippingPointZ(this.valueAsNumber);};
		document.getElementById("zplaneFlip").checked = false;		
		document.getElementById("zplaneFlip").onchange=function(){
			if(presenter._clipAxis[2]!=0){
				if(this.checked) presenter.setClippingZ(-1);
				else presenter.setClippingZ(1);
			}
		};

		document.getElementById("showPlane").onchange=function(){
			if(this.checked) presenter._scene.config.showClippingPlanes = 1;
			else presenter._scene.config.showClippingPlanes = 0;
			presenter.ui.postDrawEvent();
		};

		document.getElementById("showBorder").onchange=function(){
			if(this.checked) presenter._scene.config.showClippingBorder = 1;
			else presenter._scene.config.showClippingBorder = 0;
			presenter.ui.postDrawEvent();
		}; 	
	
		$('#sections').css("visibility", "hidden");
		$('#sections_on').css("visibility", "visible");
		$('#sections_on').css("opacity","1.0");
		$('#sections-box').css("visibility","visible");
		$('#sections-box .button').css("visibility", "visible");
	}
	else{
		$('#sections_on').css("visibility", "hidden");
		$('#sections').css("visibility", "visible");
		$('#sections').css("opacity","1.0");
		$('#sections-box').css("visibility","hidden");
		$('#sections-box .button, #sections-box .button_on').css("visibility", "hidden");
		presenter.setClippingXYZ(0, 0, 0);
		presenter.setClippingPointXYZ(0.5, 0.5, 0.5);
	}
}

function xSwitch() {
	if(presenter._clipAxis[0]==0) {
		$('#xplane').css("visibility", "hidden");
		$('#xplane_on').css("visibility", "visible");
		if(document.getElementById("xplaneFlip").checked) presenter.setClippingX(-1);
		else presenter.setClippingX(1);
	}
	else {
		$('#xplane_on').css("visibility", "hidden");
		$('#xplane').css("visibility", "visible");
		presenter.setClippingX(0);
	}
}

function ySwitch() {
	if(presenter._clipAxis[1]==0) {
		$('#yplane').css("visibility", "hidden");
		$('#yplane_on').css("visibility", "visible");
		if(document.getElementById("yplaneFlip").checked) presenter.setClippingY(-1);
		else presenter.setClippingY(1);
	}
	else {
		$('#yplane_on').css("visibility", "hidden");
		$('#yplane').css("visibility", "visible");
		presenter.setClippingY(0);
	}
}

function zSwitch() {
	if(presenter._clipAxis[2]==0) {
		$('#zplane').css("visibility", "hidden");
		$('#zplane_on').css("visibility", "visible");
		if(document.getElementById("zplaneFlip").checked) presenter.setClippingZ(-1);
		else presenter.setClippingZ(1);
	}
	else {
		$('#zplane_on').css("visibility", "hidden");
		$('#zplane').css("visibility", "visible");
		presenter.setClippingZ(0);
	}
}

function fullscreenSwitch() {
  if($('#full').css("visibility")=="visible"){
    if (window.navigator.userAgent.indexOf('Trident/') < 0) enterFullscreen();
  }
  else{
    if (window.navigator.userAgent.indexOf('Trident/') < 0) exitFullscreen();
  }
}

function enterFullscreen() {
  var el = document.getElementById('3dhop');
  presenter.native_width  = presenter.ui.width;
  presenter.native_height = presenter.ui.height;
  $('#full').css("visibility", "hidden");
  $('#full_on').css("visibility", "visible");
  $('#full_on').css("opacity","0.5");
  resizeCanvas(screen.width,screen.height);

  if (el.msRequestFullscreen) el.msRequestFullscreen();
  else if (el.mozRequestFullScreen) el.mozRequestFullScreen();
  else if (el.webkitRequestFullscreen) el.webkitRequestFullscreen();

  presenter.ui.postDrawEvent();
}

function exitFullscreen() {
  $('#full_on').css("visibility", "hidden");
  $('#full').css("visibility", "visible");
  $('#full').css("opacity","0.5");
  resizeCanvas(presenter.native_width,presenter.native_height);

  if (document.msExitFullscreen) document.msExitFullscreen();  
  else if (document.mozCancelFullScreen) document.mozCancelFullScreen();
  else if (document.webkitExitFullscreen) document.webkitExitFullscreen();

  presenter.ui.postDrawEvent(); 
}

function moveToolbar(l,t) {
  $('#toolbar').css('left', l);
  $('#toolbar').css('top', t);
  if ($('#pickpoint-box').length) movePickpointbox(l,t);
  if ($('#measure-box').length) moveMeasurementbox(l,t);
  if ($('#sections-box').length) moveSectionsbox(l,t);
  if ($('#pointsize-box').length) movePointsizebox(l,t);
}

function movePickpointbox(l,t) {
  $('#pickpoint-box').css('left', $('#pickpoint-box').offset().left+l);
  $('#pickpoint-box').css('top', $('#pickpoint-box').offset().top+t);
}

/*DEPRECATED*/
function moveMeasurebox(r,t) {
  $('#measurebox').css('right', r);
  $('#measurebox').css('top', t);
}

function moveMeasurementbox(l,t) {
  $('#measure-box').css('left', $('#measure-box').offset().left+l);
  $('#measure-box').css('top', $('#measure-box').offset().top+t);
}

function moveSectionsbox(l,t) {
  $('#sections-box').css('left', $('#sections-box').offset().left+l);
  $('#sections-box').css('top', $('#sections-box').offset().top+t);
}

function movePointsizebox(l,t) {
  $('#pointsize-box').css('left', $('#pointsize-box').offset().left+l);
  $('#pointsize-box').css('top', $('#pointsize-box').offset().top+t);
}

function resizeCanvas(w,h) {
  $('#draw-canvas').attr('width', w);
  $('#draw-canvas').attr('height',h);
  $('#3dhop').css('width', w);
  $('#3dhop').css('height', h);  
}

function set3dhlg() {
  $('#tdhlg').html("Powered by 3DHOP</br>&nbsp;C.N.R. &nbsp;&ndash;&nbsp; I.S.T.I.");
  $('#tdhlg').mouseover(function() {
	 $('#tdhlg').animate({ 
		height: "25px"
	  }, "fast" );
	 })
	.mouseout(function() {
	 $('#tdhlg').animate({ 
		height: "13px"
	  }, "slow" );
	 });
  $('#tdhlg').click(function() { window.open('http://vcg.isti.cnr.it/3dhop/', '_blank') });
}

document.addEventListener("MSFullscreenChange", function () {
    if(!document.msFullscreenElement) exitFullscreen();
}, false);
document.addEventListener("mozfullscreenchange", function () {
    if(!document.mozFullScreen) exitFullscreen();
}, false);
document.addEventListener("webkitfullscreenchange", function () {
    if(!document.webkitIsFullScreen) exitFullscreen();
}, false);
