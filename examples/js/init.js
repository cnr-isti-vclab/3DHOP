/*
3DHOP - 3D Heritage Online Presenter
Copyright (c) 2014-2016, Visual Computing Lab, ISTI - CNR
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

	$('.output-table td:has(.output-text,.output-input)').css("border-radius", "5px").css("background-color", "rgba(125,125,125,0.25)");

	$('#3dhop')
		.on('contextmenu', function(e) { 
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

	$(document).on('MSFullscreenChange mozfullscreenchange webkitfullscreenchange', function() { //fullscreen handler 
		if(!document.msFullscreenElement&&!document.mozFullScreen&&!document.webkitIsFullScreen) exitFullscreen();
	});

	if (window.navigator.userAgent.indexOf('Trident/') > 0) { //IE fullscreen handler 
		$('#full').click(function() {enterFullscreen();});
		$('#full_on').click(function() {exitFullscreen();});
	}

	$(window).on('load mouseup touchend dragend', function() { //focus handler
		var x = window.scrollX, y = window.scrollY;
		$('#draw-canvas').focus();
		window.scrollTo(x, y);
	});

	resizeCanvas($('#3dhop').parent().width(),$('#3dhop').parent().height());

	anchorPanels();
	
	set3dhlg();
}

// anchor pickpoint, measurement and sections panels to the respective buttons
function anchorPanels() {
	if ($('#pickpoint-box')[0] && $('#pick')[0]) 
	{
		$('#pickpoint-box').css('left', ($('#pick').position().left + $('#pick').width() + $('#toolbar').position().left + 5));
		$('#pickpoint-box').css('top', ($('#pick').position().top + $('#toolbar').position().top));
	}
	if ($('#measure-box')[0] && $('#measure')[0])
	{
		$('#measure-box').css('left', ($('#measure').position().left + $('#measure').width() + $('#toolbar').position().left + 5));
		$('#measure-box').css('top', ($('#measure').position().top + $('#toolbar').position().top));
	}
	if ($('#sections-box')[0] && $('#sections')[0]) 
	{
		$('#sections-box').css('left', ($('#sections').position().left + $('#sections').width() + $('#toolbar').position().left + 5));
		$('#sections-box').css('top', ($('#sections').position().top + $('#toolbar').position().top));
	}
}

// +++ INTERFACE SWITCHING FUNCTIONS +++ //

function lightSwitch(on) {
  if(on === undefined) on = presenter.isLightTrackballEnabled();

  if(on){
    $('#light').css("visibility", "hidden");
    $('#light_on').css("visibility", "visible");
  }
  else{
    $('#light_on').css("visibility", "hidden");
    $('#light').css("visibility", "visible");
  }
}

function hotspotSwitch(on) {
  if(on === undefined) on = presenter.isSpotVisibilityEnabled();

  if(on){
    $('#hotspot').css("visibility", "hidden");
    $('#hotspot_on').css("visibility", "visible");
  }
  else{
    $('#hotspot_on').css("visibility", "hidden");
    $('#hotspot').css("visibility", "visible");
  }
}

function pickpointSwitch(on) {
  if(on === undefined) on = presenter.isPickpointModeEnabled();

  if(on){  
    $('#pick').css("visibility", "hidden");
    $('#pick_on').css("visibility", "visible");
    $('#pickpoint-box').fadeIn().css("display","table");
    $('#draw-canvas').css("cursor","crosshair");
  }
  else{
    if (window.getSelection && window.getSelection()!='') window.getSelection().removeAllRanges();
    else if (document.selection && document.selection.createRange()!='') document.selection.empty();
    $('#pick_on').css("visibility", "hidden");
    $('#pick').css("visibility", "visible");
    $('#pickpoint-box').css("display","none");
    $('#pickpoint-output').html("[ 0 , 0 , 0 ]");
    if (!presenter.isAnyMeasurementEnabled()) $('#draw-canvas').css("cursor","default");
  }
}

function measureSwitch(on) {
  if(on === undefined) on = presenter.isMeasurementToolEnabled();

  if(on){  
    $('#measure').css("visibility", "hidden");
    $('#measure_on').css("visibility", "visible");
    $('#measure-box').fadeIn().css("display","table");
    $('#draw-canvas').css("cursor","crosshair");
  }
  else{
    if (window.getSelection && window.getSelection()!='') window.getSelection().removeAllRanges();
    else if (document.selection && document.selection.createRange()!='') document.selection.empty();
    $('#measure_on').css("visibility", "hidden");
    $('#measure').css("visibility", "visible");
    $('#measure-box').css("display","none");
    $('#measure-output').html("0.0");
    if (!presenter.isAnyMeasurementEnabled()) $('#draw-canvas').css("cursor","default");
  }
}

function colorSwitch(on) {
  if(on === undefined) on = $('#color').css("visibility")=="visible";

  if(on) {
	$('#color').css("visibility", "hidden");
	$('#color_on').css("visibility", "visible");
  }
  else {
	$('#color_on').css("visibility", "hidden");
	$('#color').css("visibility", "visible");
  }
}

function sectiontoolSwitch(on) {
  if(on === undefined) on = $('#sections').css("visibility")=="visible";

  if(on){
	$('#sections').css("visibility", "hidden");
	$('#sections_on').css("visibility", "visible");
	$('#sections-box').fadeIn().css("display","table");
	$('#xplane, #yplane, #zplane').css("visibility", "visible");
  }
  else{
	$('#sections_on').css("visibility", "hidden");
	$('#sections').css("visibility", "visible");
	$('#sections-box').css("display","none");
	$('#sections-box img').css("visibility", "hidden");
	presenter.setClippingXYZ(0, 0, 0);
  }
}

function sectiontoolInit() {
	// set sections value
	presenter.setClippingPointXYZ(0.5, 0.5, 0.5);

	// set sliders 
	var xplaneSlider = $('#xplaneSlider')[0];
	xplaneSlider.min = 0.0;
	xplaneSlider.max = 1.0;
	xplaneSlider.step = 0.01;
	xplaneSlider.defaultValue = 0.5;
	xplaneSlider.oninput=function(){presenter.setClippingPointX(this.valueAsNumber);};

	var yplaneSlider = $('#yplaneSlider')[0];
	yplaneSlider.min = 0.0;
	yplaneSlider.max = 1.0;
	yplaneSlider.step = 0.01;
	yplaneSlider.defaultValue = 0.5;
	yplaneSlider.oninput=function(){presenter.setClippingPointY(this.valueAsNumber);};

	var zplaneSlider = $('#zplaneSlider')[0];
	zplaneSlider.min = 0.0;
	zplaneSlider.max = 1.0;
	zplaneSlider.step = 0.01;
	zplaneSlider.defaultValue = 0.5;
	zplaneSlider.oninput=function(){presenter.setClippingPointZ(this.valueAsNumber);};

	// set checkboxes
	var xplaneFlip = $('#xplaneFlip')[0];
	xplaneFlip.defaultChecked = false;
	xplaneFlip.onchange=function(){
		if(presenter.getClippingX()!=0){
			if(this.checked) presenter.setClippingX(-1);
			else presenter.setClippingX(1);
		}
	};

	var yplaneFlip = $('#yplaneFlip')[0];
	yplaneFlip.defaultChecked = false;
	yplaneFlip.onchange=function(){
		if(presenter.getClippingY()!=0){
			if(this.checked) presenter.setClippingY(-1);
			else presenter.setClippingY(1);
		}
	};

	var zplaneFlip = $('#zplaneFlip')[0];
	zplaneFlip.defaultChecked = false;
	zplaneFlip.onchange=function(){
		if(presenter.getClippingZ()!=0){
			if(this.checked) presenter.setClippingZ(-1);
			else presenter.setClippingZ(1);
		}
	};
	
	var planesCheck = $('#showPlane')[0];
	planesCheck.defaultChecked = presenter.getClippingRendermode()[0];
	planesCheck.onchange = function(){ presenter.setClippingRendermode(this.checked, presenter.getClippingRendermode()[1]); };

	var edgesCheck = $('#showBorder')[0];
	edgesCheck.defaultChecked = presenter.getClippingRendermode()[1];
	edgesCheck.onchange=function(){ presenter.setClippingRendermode(presenter.getClippingRendermode()[0], this.checked); };
}

function sectiontoolReset() {
	// reset sections value
	presenter.setClippingPointXYZ(0.5, 0.5, 0.5);

	// reset sliders 
	var xplaneSlider = $('#xplaneSlider')[0];
	xplaneSlider.value = xplaneSlider.defaultValue;

	var yplaneSlider = $('#yplaneSlider')[0];
	yplaneSlider.value = yplaneSlider.defaultValue;

	var zplaneSlider = $('#zplaneSlider')[0]; 
	zplaneSlider.value = zplaneSlider.defaultValue;

	// reset checkboxes
	var xplaneFlip = $('#xplaneFlip')[0];
	xplaneFlip.checked = xplaneFlip.defaultChecked;

	var yplaneFlip = $('#yplaneFlip')[0];
	yplaneFlip.checked = xplaneFlip.defaultChecked;

	var zplaneFlip = $('#zplaneFlip')[0];
	zplaneFlip.checked = xplaneFlip.defaultChecked;

	var planesCheck = $('#showPlane')[0];
	planesCheck.checked = planesCheck.defaultChecked;
	presenter.setClippingRendermode(planesCheck.checked, presenter.getClippingRendermode()[1]);

	var edgesCheck = $('#showBorder')[0];
	edgesCheck.checked = edgesCheck.defaultChecked;
	presenter.setClippingRendermode(presenter.getClippingRendermode()[0], edgesCheck.checked);
}

function sectionxSwitch() {
	if(presenter.getClippingX()==0) {
		$('#xplane').css("visibility", "hidden");
		$('#xplane_on').css("visibility", "visible");
		var xplaneFlip = $('#xplaneFlip')[0]; 
		if(xplaneFlip.checked) presenter.setClippingX(-1);
		else presenter.setClippingX(1);
	}
	else {
		$('#xplane_on').css("visibility", "hidden");
		$('#xplane').css("visibility", "visible");
		presenter.setClippingX(0);
	}
}

function sectionySwitch() {
	if(presenter.getClippingY()==0) {
		$('#yplane').css("visibility", "hidden");
		$('#yplane_on').css("visibility", "visible");
		var yplaneFlip = $('#yplaneFlip')[0];
		if(yplaneFlip.checked) presenter.setClippingY(-1);
		else presenter.setClippingY(1);
	}
	else {
		$('#yplane_on').css("visibility", "hidden");
		$('#yplane').css("visibility", "visible");
		presenter.setClippingY(0);
	}
}

function sectionzSwitch() {
	if(presenter.getClippingZ()==0) {
		$('#zplane').css("visibility", "hidden");
		$('#zplane_on').css("visibility", "visible");
		var zplaneFlip = $('#zplaneFlip')[0];
		if(zplaneFlip.checked) presenter.setClippingZ(-1);
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
  var viewer = $('#3dhop')[0];
  presenter.native_width  = presenter.ui.width;
  presenter.native_height = presenter.ui.height;
  $('#full').css("visibility", "hidden");
  $('#full_on').css("visibility", "visible");
  resizeCanvas(screen.width,screen.height);

  if (viewer.msRequestFullscreen) viewer.msRequestFullscreen();
  else if (viewer.mozRequestFullScreen) viewer.mozRequestFullScreen();
  else if (viewer.webkitRequestFullscreen) viewer.webkitRequestFullscreen();

  presenter.ui.postDrawEvent();
}

function exitFullscreen() {
  $('#full_on').css("visibility", "hidden");
  $('#full').css("visibility", "visible");
  resizeCanvas(presenter.native_width,presenter.native_height);

  if (document.msExitFullscreen) document.msExitFullscreen();  
  else if (document.mozCancelFullScreen) document.mozCancelFullScreen();
  else if (document.webkitExitFullscreen) document.webkitExitFullscreen();

  presenter.ui.postDrawEvent(); 
}

/*DEPRECATED*/
function measurementSwitch() {
  var on = presenter.isMeasurementToolEnabled();

  if(on){
    $('#measure').css("visibility", "hidden");
    $('#measure_on').css("visibility", "visible");
    $('#measurebox').css("visibility","visible");
    $('#draw-canvas').css("cursor","crosshair");
  }
  else{
    if (window.getSelection && window.getSelection()!='') window.getSelection().removeAllRanges();
    else if (document.selection && document.selection.createRange()!='') document.selection.empty();
    $('#measure_on').css("visibility", "hidden");
    $('#measure').css("visibility", "visible");
    $('#measurebox').css("visibility","hidden");
    $('#measure-output').html("0.0");
    if (!presenter.isAnyMeasurementEnabled()) $('#draw-canvas').css("cursor","default");
  }
}

// +++ INTERFACE POSITIONING FUNCTIONS +++ //

function moveToolbar(l,t) {
	$('#toolbar').css('left', l);
	$('#toolbar').css('top', t);
	anchorPanels();
}

function movePickpointbox(l,t) {
	$('#pickpoint-box').css('left', l);
	$('#pickpoint-box').css('top', t);
}

function moveMeasurementbox(l,t) {
	$('#measure-box').css('left', l);
	$('#measure-box').css('top', t);
}

function moveSectionsbox(l,t) {
	$('#sections-box').css('left', l);
	$('#sections-box').css('top', t);
}

/*DEPRECATED*/
function moveMeasurebox(r,t) {
  $('#measurebox').css('right', r);
  $('#measurebox').css('top', t);
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
