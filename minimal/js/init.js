/*
3DHOP - 3D Heritage Online Presenter
Copyright (c) 2014, Marco Callieri - Visual Computing Lab, ISTI - CNR
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

	$('#measure-output')
		.on('contextmenu', function(e){ 
			e.stopPropagation();
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
//		.css("cursor","default")
		.mousedown(function() { $('#toolbar img').css("opacity","0.5"); });

	if (window.navigator.userAgent.indexOf('Trident/') > 0) { //IE fullscreen handler 
		$('#full').click(function(e) {enterFullscreen();});
		$('#full_on').click(function(e) {exitFullscreen();});
	}

	resizeCanvas($('#3dhop').parent().width(),$('#3dhop').parent().height());

	set3dhlg();
} 

function lightSwitch() {
  var on = presenter.isLightTrackballEnabled();

  if(on){
    $('#light').css("visibility", "hidden");
    $('#light_on').css("visibility", "visible");
    $('#light_on').css("opacity","1.0");
//    $('#draw-canvas').css("cursor","url(./skins/icons/cursor_light.png), auto");
  }
  else{
    $('#light_on').css("visibility", "hidden");
    $('#light').css("visibility", "visible");
    $('#light').css("opacity","1.0");
//    $('#draw-canvas').css("cursor","default");
  }
}

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
    $('#measure_on').css("visibility", "hidden");
    $('#measure').css("visibility", "visible");
    $('#measure').css("opacity","1.0");
    $('#measurebox').css("visibility","hidden");
    $('#measure-output').html("0.0");
    $('#draw-canvas').css("cursor","default");
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
}

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

document.addEventListener("MSFullscreenChange", function () {
    if(!document.msFullscreenElement) exitFullscreen();
}, false);
document.addEventListener("mozfullscreenchange", function () {
    if(!document.mozFullScreen) exitFullscreen();
}, false);
document.addEventListener("webkitfullscreenchange", function () {
    if(!document.webkitIsFullScreen) exitFullscreen();
}, false);
