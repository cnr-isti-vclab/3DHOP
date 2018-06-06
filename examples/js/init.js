/*
3DHOP - 3D Heritage Online Presenter
Copyright (c) 2014-2018, Visual Computing Lab, ISTI - CNR
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
	if (isIOS()) $('head').append('<meta name="viewport" content="width=device-width">'); //IOS DEVICES CHECK

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
			id = $(this).attr('id');
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
		.on('touchstart pointerdown', function(e) {
			$('#toolbar img').css("opacity","0.5");
		})
		.on('touchend pointerup', function(e) {
			clearInterval(interval); 
		})
		.on('touchmove', function(e) {
			clearInterval(interval); 
			$('#toolbar img').css("opacity","0.5");
		});

	$('#3dhop:not(#draw-canvas)').on('contextmenu', function(e) { return false; });

	$('#draw-canvas')
		.on('contextmenu', function(e) {
			if (!isMobile()) return false; //MOBILE DEVICES CHECK
		})
		.on('touchstart pointerdown', function(e) {
			$('#toolbar img').css("opacity","0.5");
		})
		.mousedown(function(e) { 
			$('#toolbar img').css("opacity","0.5"); 
			if(e.preventDefault) e.preventDefault(); 
			if (window.getSelection && window.getSelection()!='') window.getSelection().removeAllRanges();
			else if (document.selection && document.selection.createRange()!='') document.selection.empty();
		});

	$(document).on('MSFullscreenChange mozfullscreenchange webkitfullscreenchange', function(e) { //fullscreen handler 
		if(!document.msFullscreenElement&&!document.mozFullScreen&&!document.webkitIsFullScreen) exitFullscreen();
	});

	if (window.navigator.userAgent.indexOf('Trident/') > 0) { //IE fullscreen handler 
		$('#full').click(function() {enterFullscreen();});
		$('#full_on').click(function() {exitFullscreen();});
	}

	$(window).on('resize', function () {
		if (!presenter._resizable) return;

		var width, height;
		width = Math.max(document.documentElement.clientWidth, window.innerWidth);
		(isIOS()) ? (height = document.documentElement.clientHeight) : (height = window.innerHeight); //IOS DEVICES CHECK

		resizeCanvas(width,height);

		presenter.ui.postDrawEvent();
	});

	$(window).on('load mouseup touchend pointerup dragend', function() { //focus handler
		var x = window.scrollX, y = window.scrollY;
		$('#draw-canvas').focus();
		window.scrollTo(x, y);
	});

	resizeCanvas($('#3dhop').parent().width(),$('#3dhop').parent().height());

	anchorPanels();

	set3dhlg();
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

// +++ INTERFACE SWITCHING FUNCTIONS +++ //

function lightSwitch(on) {
  if(on === undefined) on = presenter.isLightTrackballEnabled();

  if(on){
    $('#light').css("visibility", "hidden");
    $('#light_on').css("visibility", "visible");
    $('#lighting_off').css("visibility", "hidden");	//manage lighting combined interface
    $('#lighting').css("visibility", "visible");	//manage lighting combined interface
  }
  else{
    $('#light_on').css("visibility", "hidden");
    $('#light').css("visibility", "visible");
  }
}

function lightingSwitch(on) {
  if(on === undefined) on = presenter.isSceneLightingEnabled();

  if(on){
    $('#lighting_off').css("visibility", "hidden");
    $('#lighting').css("visibility", "visible");
  }
  else{
    $('#lighting').css("visibility", "hidden");
    $('#lighting_off').css("visibility", "visible");
    $('#light_on').css("visibility", "hidden");	//manage light combined interface
    $('#light').css("visibility", "visible");	//manage light combined interface
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

function cameraSwitch(on) {
  if(on === undefined) on = $('#perspective').css("visibility")=="visible";

  if(on){
    $('#perspective').css("visibility", "hidden");
    $('#orthographic').css("visibility", "visible");
  }
  else{
    $('#orthographic').css("visibility", "hidden");
    $('#perspective').css("visibility", "visible");
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
	xplaneSlider.oninput=function(){ sectionxSwitch(true); presenter.setClippingPointX(this.valueAsNumber);};
	xplaneSlider.onchange=function(){ sectionxSwitch(true); presenter.setClippingPointX(this.valueAsNumber);};

	var yplaneSlider = $('#yplaneSlider')[0];
	yplaneSlider.min = 0.0;
	yplaneSlider.max = 1.0;
	yplaneSlider.step = 0.01;
	yplaneSlider.defaultValue = 0.5;
	yplaneSlider.oninput=function(){ sectionySwitch(true); presenter.setClippingPointY(this.valueAsNumber);};
	yplaneSlider.onchange=function(){ sectionySwitch(true); presenter.setClippingPointY(this.valueAsNumber);};

	var zplaneSlider = $('#zplaneSlider')[0];
	zplaneSlider.min = 0.0;
	zplaneSlider.max = 1.0;
	zplaneSlider.step = 0.01;
	zplaneSlider.defaultValue = 0.5;
	zplaneSlider.oninput=function(){ sectionzSwitch(true); presenter.setClippingPointZ(this.valueAsNumber);};
	zplaneSlider.onchange=function(){ sectionzSwitch(true); presenter.setClippingPointZ(this.valueAsNumber);};

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

function sectionxSwitch(on) {
  if(on === undefined) on = (presenter.getClippingX()==0);

	if(on){
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

function sectionySwitch(on) {
  if(on === undefined) on = (presenter.getClippingY()==0);

	if(on){
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

function sectionzSwitch(on) {
  if(on === undefined) on = (presenter.getClippingZ()==0);

	if(on){
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
  $('#full').css("visibility", "hidden");
  $('#full_on').css("visibility", "visible");

  if (isIOS()) return; //IOS DEVICES CHECK

  presenter._nativeWidth  = presenter.ui.width;
  presenter._nativeHeight = presenter.ui.height;
  presenter._nativeResizable = presenter._resizable;
  presenter._resizable = true;

  var viewer = $('#3dhop')[0];
  if (viewer.msRequestFullscreen) viewer.msRequestFullscreen();
  else if (viewer.mozRequestFullScreen) viewer.mozRequestFullScreen();
  else if (viewer.webkitRequestFullscreen) viewer.webkitRequestFullscreen();

  presenter.ui.postDrawEvent();
}

function exitFullscreen() {
  $('#full_on').css("visibility", "hidden");
  $('#full').css("visibility", "visible");

  if (isIOS()) return; //IOS DEVICES CHECK

  resizeCanvas(presenter._nativeWidth,presenter._nativeHeight)
  presenter._resizable = presenter._nativeResizable;

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

  if (!presenter) return;

  var width, height;
  width = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
  (isIOS()) ? (height = document.documentElement.clientHeight) : (height = window.innerHeight); //IOS DEVICES CHECK

  if (width != w || height != h) presenter._resizable = false;
  else presenter._resizable = true;
}

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

// +++ INTERFACE UTILITY FUNCTIONS +++ //

function isIOS() {
	var isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
	return isIOS;
}

function isMobile() {
	var isMobile = (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(navigator.userAgent||navigator.vendor||window.opera)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test((navigator.userAgent||navigator.vendor||window.opera).substr(0,4)));
	return isMobile;
}
