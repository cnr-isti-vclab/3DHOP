/*
3DHOP - 3D Heritage Online Presenter
Copyright (c) 2014-2025, Visual Computing Lab, ISTI - CNR
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
	// IOS DEVICES CHECK: add viewport meta
	if (isIOS()) {
		var meta = document.createElement('meta');
		meta.name = 'viewport';
		meta.content = 'width=device-width';
		document.head.appendChild(meta);
	}

	var interval, id, ismousedown;
	var button = 0;

	// Toolbar buttons behavior (hover/click/touch)
	var toolbarImgs = document.querySelectorAll('#toolbar img');
	toolbarImgs.forEach(function(img) {
		img.addEventListener('mouseenter', function(e) {
			id = e.currentTarget.id;
			e.currentTarget.style.opacity = ismousedown ? '1.0' : '0.8';
		});
		img.addEventListener('mouseout', function(e) {
			clearInterval(interval);
			e.currentTarget.style.opacity = '0.5';
		});
		img.addEventListener('mousedown', function(e) {
			id = e.currentTarget.id;
			ismousedown = true;
			if (e.button === button) {
				actionsToolbar(id);
				if (id === 'zoomin' || id === 'zoomout') {
					interval = setInterval(function() { actionsToolbar(id); }, 150);
				} else {
					clearInterval(interval);
				}
				e.currentTarget.style.opacity = '1.0';
				button = 0;
			}
		});
		img.addEventListener('mouseup', function(e) {
			ismousedown = false;
			if (e.button === button) {
				clearInterval(interval);
				e.currentTarget.style.opacity = '0.8';
				button = 0;
			}
		});
		img.addEventListener('touchstart', function() { button = 2; }, { passive: true });
		img.addEventListener('touchend', function() { button = 0; }, { passive: true });
	});

	// Style td that contains .output-text/.output-input (no :has in older engines)
	document.querySelectorAll('.output-table td').forEach(function(td) {
		if (td.querySelector('.output-text, .output-input')) {
			td.style.borderRadius = '5px';
			td.style.backgroundColor = 'rgba(125,125,125,0.25)';
		}
	});

	// Container events (#3dhop id starts with a digit -> use getElementById)
	var viewer = document.getElementById('3dhop');
	var setToolbarOpacity = function(val) {
		document.querySelectorAll('#toolbar img').forEach(function(img) { img.style.opacity = val; });
	};
	if (viewer) {
		['touchstart','pointerdown'].forEach(function(evt) {
			viewer.addEventListener(evt, function() { setToolbarOpacity('0.5'); }, { passive: true });
		});
		['touchend','pointerup'].forEach(function(evt) {
			viewer.addEventListener(evt, function() { clearInterval(interval); }, { passive: true });
		});
		viewer.addEventListener('touchmove', function() {
			clearInterval(interval);
			setToolbarOpacity('0.5');
		}, { passive: true });

		viewer.addEventListener('contextmenu', function(e) { e.preventDefault(); });
	}

	// Canvas events
	var canvas = document.getElementById('draw-canvas');
	if (canvas) {
		canvas.addEventListener('contextmenu', function(e) {
			if (!isMobile()) e.preventDefault(); // prevent on desktop as in original
		});
		['touchstart','pointerdown'].forEach(function(evt) {
			canvas.addEventListener(evt, function() { setToolbarOpacity('0.5'); }, { passive: true });
		});
		canvas.addEventListener('mousedown', function(e) {
			setToolbarOpacity('0.5');
			if (e.preventDefault) e.preventDefault();
			if (window.getSelection && window.getSelection() != '') window.getSelection().removeAllRanges();
			else if (document.selection && document.selection.createRange() != '') document.selection.empty();
		});
	}

	// Fullscreen handlers (vendor variants)
	var onFsChange = function() {
		if (!(document.fullscreenElement || document.msFullscreenElement || document.mozFullScreen || document.webkitIsFullScreen)) {
			exitFullscreen();
		}
	};
	['fullscreenchange', 'MSFullscreenChange', 'mozfullscreenchange', 'webkitfullscreenchange']
		.forEach(function(evt) { document.addEventListener(evt, onFsChange); });

	// IE-specific fullscreen buttons
	if (window.navigator.userAgent.indexOf('Trident/') > 0) {
		var full = document.getElementById('full');
		var fullOn = document.getElementById('full_on');
		if (full) full.addEventListener('click', function() { enterFullscreen(); });
		if (fullOn) fullOn.addEventListener('click', function() { exitFullscreen(); });
	}

	// Window resize -> resize viewer/canvas
	window.addEventListener('resize', function() {
		if (!presenter._resizable) return;

		var width, height;
		if (document.fullscreenElement || document.mozFullScreenElement || document.webkitFullscreenElement) {
			width = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
			height = window.innerHeight;
		} else if (viewer && viewer.parentElement) {
			width = viewer.parentElement.clientWidth;
			height = viewer.parentElement.clientHeight;
		}

		if (canvas && width != null && height != null) {
			canvas.width = width;
			canvas.height = height;
		}
		if (viewer && width != null && height != null) {
			viewer.style.width = width + 'px';
			viewer.style.height = height + 'px';
		}

		presenter.ui.postDrawEvent();
	});

	// Close button hover behavior
	var closes = document.querySelectorAll('.close');
	var closesOn = document.querySelectorAll('.close_on');
	closes.forEach(function(el) {
		el.addEventListener('mouseenter', function() {
			closes.forEach(function(c) { c.style.display = 'none'; });
			closesOn.forEach(function(c) { c.style.display = 'inline'; });
		});
	});
	closesOn.forEach(function(el) {
		el.addEventListener('mouseleave', function() {
			closesOn.forEach(function(c) { c.style.display = 'none'; });
			closes.forEach(function(c) { c.style.display = 'inline'; });
		});
	});

	// Initial sizing
	if (viewer && viewer.parentElement && canvas) {
		canvas.width = viewer.parentElement.clientWidth;
		canvas.height = viewer.parentElement.clientHeight;
		viewer.style.width = viewer.parentElement.clientWidth + 'px';
		viewer.style.height = viewer.parentElement.clientHeight + 'px';
	}

	anchorPanels();
	set3dhlg();
}

function set3dhlg() {
	var tdhlg = document.getElementById('tdhlg');
	if (!tdhlg) return;
	tdhlg.style.right = '2px';
	tdhlg.style.bottom = '2px';
	tdhlg.innerHTML = 'Powered by 3DHOP</br>CNR &nbsp;&ndash;&nbsp; ISTI';
	tdhlg.style.transition = 'height 0.2s ease';

	tdhlg.addEventListener('mouseover', function() {
		tdhlg.style.transition = 'height 0.2s ease';
		tdhlg.style.height = '25px';
	});
	tdhlg.addEventListener('mouseout', function() {
		tdhlg.style.transition = 'height 0.4s ease';
		tdhlg.style.height = '13px';
	});
	tdhlg.addEventListener('click', function() { window.open('http://vcg.isti.cnr.it/3dhop/', '_blank'); });
}

// +++ INTERFACE SWITCHING FUNCTIONS +++ //

function lightSwitch(on) {
	if (on === undefined) on = presenter.isLightTrackballEnabled();
	var light = document.getElementById('light');
	var lightOn = document.getElementById('light_on');
	var lightingOff = document.getElementById('lighting_off');
	var lighting = document.getElementById('lighting');
	if (!light || !lightOn) return;

	if (on) {
		light.style.visibility = 'hidden';
		lightOn.style.visibility = 'visible';
		if (lightingOff) lightingOff.style.visibility = 'hidden';
		if (lighting) lighting.style.visibility = 'visible';
	} else {
		lightOn.style.visibility = 'hidden';
		light.style.visibility = 'visible';
	}
}

function lightingSwitch(on) {
	if (on === undefined) on = presenter.isSceneLightingEnabled();
	var lightingOff = document.getElementById('lighting_off');
	var lighting = document.getElementById('lighting');

	if (on) {
		if (lightingOff) lightingOff.style.visibility = 'hidden';
		if (lighting) lighting.style.visibility = 'visible';
	} else {
		if (lighting) lighting.style.visibility = 'hidden';
		if (lightingOff) lightingOff.style.visibility = 'visible';
		var lightOn = document.getElementById('light_on');
		var light = document.getElementById('light');
		if (lightOn) lightOn.style.visibility = 'hidden';
		if (light) light.style.visibility = 'visible';
	}
}

function hotspotSwitch(on) {
	if (on === undefined) on = presenter.isSpotVisibilityEnabled();
	var hot = document.getElementById('hotspot');
	var hotOn = document.getElementById('hotspot_on');
	if (!hot || !hotOn) return;

	if (on) {
		hot.style.visibility = 'hidden';
		hotOn.style.visibility = 'visible';
	} else {
		hotOn.style.visibility = 'hidden';
		hot.style.visibility = 'visible';
	}
}

function pickpointSwitch(on) {
	if (on === undefined) on = presenter.isPickpointModeEnabled();
	var pick = document.getElementById('pick');
	var pickOn = document.getElementById('pick_on');
	var box = document.getElementById('pickpoint-box');
	var out = document.getElementById('pickpoint-output');
	var canvas = document.getElementById('draw-canvas');

	if (on) {
		if (pick) pick.style.visibility = 'hidden';
		if (pickOn) pickOn.style.visibility = 'visible';
		if (box) box.style.display = 'table';
		if (canvas) canvas.style.cursor = 'crosshair';
	} else {
		if (window.getSelection && window.getSelection() != '') window.getSelection().removeAllRanges();
		else if (document.selection && document.selection.createRange() != '') document.selection.empty();
		if (pickOn) pickOn.style.visibility = 'hidden';
		if (pick) pick.style.visibility = 'visible';
		if (box) box.style.display = 'none';
		if (out) out.innerHTML = '[ 0 , 0 , 0 ]';
		if (canvas && !presenter.isAnyMeasurementEnabled()) canvas.style.cursor = 'default';
	}
}

function measureSwitch(on) {
	if (on === undefined) on = presenter.isMeasurementToolEnabled();
	var measure = document.getElementById('measure');
	var measureOn = document.getElementById('measure_on');
	var box = document.getElementById('measure-box');
	var out = document.getElementById('measure-output');
	var canvas = document.getElementById('draw-canvas');

	if (on) {
		if (measure) measure.style.visibility = 'hidden';
		if (measureOn) measureOn.style.visibility = 'visible';
		if (box) box.style.display = 'table';
		if (canvas) canvas.style.cursor = 'crosshair';
	} else {
		if (window.getSelection && window.getSelection() != '') window.getSelection().removeAllRanges();
		else if (document.selection && document.selection.createRange() != '') document.selection.empty();
		if (measureOn) measureOn.style.visibility = 'hidden';
		if (measure) measure.style.visibility = 'visible';
		if (box) box.style.display = 'none';
		if (out) out.innerHTML = '0.0';
		if (canvas && !presenter.isAnyMeasurementEnabled()) canvas.style.cursor = 'default';
	}
}

function colorSwitch(on) {
	if (on === undefined) on = getComputedStyle(document.getElementById('color')).visibility === 'visible';
	var color = document.getElementById('color');
	var colorOn = document.getElementById('color_on');
	if (!color || !colorOn) return;

	if (on) {
		color.style.visibility = 'hidden';
		colorOn.style.visibility = 'visible';
	} else {
		colorOn.style.visibility = 'hidden';
		color.style.visibility = 'visible';
	}
}

function cameraSwitch(on) {
	var persp = document.getElementById('perspective');
	var ortho = document.getElementById('orthographic');
	if (!persp || !ortho) return;
	if (on === undefined) on = getComputedStyle(persp).visibility === 'visible';

	if (on) {
		persp.style.visibility = 'hidden';
		ortho.style.visibility = 'visible';
	} else {
		ortho.style.visibility = 'hidden';
		persp.style.visibility = 'visible';
	}
}

function helpSwitch(on) {
	var help = document.getElementById('help');
	var helpOn = document.getElementById('help_on');
	if (!help || !helpOn) return;
	if (on === undefined) on = getComputedStyle(help).visibility === 'visible';

	if (on) {
		help.style.visibility = 'hidden';
		helpOn.style.visibility = 'visible';
	} else {
		helpOn.style.visibility = 'hidden';
		help.style.visibility = 'visible';
	}
}

function sectiontoolSwitch(on) {
	var sections = document.getElementById('sections');
	var sectionsOn = document.getElementById('sections_on');
	var box = document.getElementById('sections-box');
	var xplane = document.getElementById('xplane');
	var yplane = document.getElementById('yplane');
	var zplane = document.getElementById('zplane');
	if (!sections || !sectionsOn) return;
	if (on === undefined) on = getComputedStyle(sections).visibility === 'visible';

	if (on) {
		sections.style.visibility = 'hidden';
		sectionsOn.style.visibility = 'visible';
		if (box) box.style.display = 'table';
		if (xplane) xplane.style.visibility = 'visible';
		if (yplane) yplane.style.visibility = 'visible';
		if (zplane) zplane.style.visibility = 'visible';
	} else {
		sectionsOn.style.visibility = 'hidden';
		sections.style.visibility = 'visible';
		if (box) box.style.display = 'none';
		document.querySelectorAll('#sections-box img').forEach(function(img) { img.style.visibility = 'hidden'; });
		presenter.setClippingXYZ(0, 0, 0);
	}
}

function sectiontoolInit() {
	// set sections value
	presenter.setClippingPointXYZ(0.5, 0.5, 0.5);

	// sliders
	var xplaneSlider = document.getElementById('xplaneSlider');
	if (xplaneSlider) {
		xplaneSlider.min = 0.0; xplaneSlider.max = 1.0; xplaneSlider.step = 0.01; xplaneSlider.defaultValue = 0.5;
		xplaneSlider.oninput = function(){ sectionxSwitch(true); presenter.setClippingPointX(this.valueAsNumber); };
		xplaneSlider.onchange = function(){ sectionxSwitch(true); presenter.setClippingPointX(this.valueAsNumber); };
	}
	var yplaneSlider = document.getElementById('yplaneSlider');
	if (yplaneSlider) {
		yplaneSlider.min = 0.0; yplaneSlider.max = 1.0; yplaneSlider.step = 0.01; yplaneSlider.defaultValue = 0.5;
		yplaneSlider.oninput = function(){ sectionySwitch(true); presenter.setClippingPointY(this.valueAsNumber); };
		yplaneSlider.onchange = function(){ sectionySwitch(true); presenter.setClippingPointY(this.valueAsNumber); };
	}
	var zplaneSlider = document.getElementById('zplaneSlider');
	if (zplaneSlider) {
		zplaneSlider.min = 0.0; zplaneSlider.max = 1.0; zplaneSlider.step = 0.01; zplaneSlider.defaultValue = 0.5;
		zplaneSlider.oninput = function(){ sectionzSwitch(true); presenter.setClippingPointZ(this.valueAsNumber); };
		zplaneSlider.onchange = function(){ sectionzSwitch(true); presenter.setClippingPointZ(this.valueAsNumber); };
	}

	// checkboxes
	var xplaneFlip = document.getElementById('xplaneFlip');
	if (xplaneFlip) {
		xplaneFlip.defaultChecked = false;
		xplaneFlip.onchange = function() {
			if (presenter.getClippingX() != 0) presenter.setClippingX(this.checked ? -1 : 1);
		};
	}
	var yplaneFlip = document.getElementById('yplaneFlip');
	if (yplaneFlip) {
		yplaneFlip.defaultChecked = false;
		yplaneFlip.onchange = function() {
			if (presenter.getClippingY() != 0) presenter.setClippingY(this.checked ? -1 : 1);
		};
	}
	var zplaneFlip = document.getElementById('zplaneFlip');
	if (zplaneFlip) {
		zplaneFlip.defaultChecked = false;
		zplaneFlip.onchange = function() {
			if (presenter.getClippingZ() != 0) presenter.setClippingZ(this.checked ? -1 : 1);
		};
	}
	var planesCheck = document.getElementById('showPlane');
	if (planesCheck) {
		planesCheck.defaultChecked = presenter.getClippingRendermode()[0];
		planesCheck.onchange = function(){ presenter.setClippingRendermode(this.checked, presenter.getClippingRendermode()[1]); };
	}
	var edgesCheck = document.getElementById('showBorder');
	if (edgesCheck) {
		edgesCheck.defaultChecked = presenter.getClippingRendermode()[1];
		edgesCheck.onchange = function(){ presenter.setClippingRendermode(presenter.getClippingRendermode()[0], this.checked); };
	}
}

function sectiontoolReset() {
	// reset sections value
	presenter.setClippingPointXYZ(0.5, 0.5, 0.5);

	// reset sliders
	var xplaneSlider = document.getElementById('xplaneSlider'); if (xplaneSlider) xplaneSlider.value = xplaneSlider.defaultValue;
	var yplaneSlider = document.getElementById('yplaneSlider'); if (yplaneSlider) yplaneSlider.value = yplaneSlider.defaultValue;
	var zplaneSlider = document.getElementById('zplaneSlider'); if (zplaneSlider) zplaneSlider.value = zplaneSlider.defaultValue;

	// reset checkboxes
	var xplaneFlip = document.getElementById('xplaneFlip'); if (xplaneFlip) xplaneFlip.checked = xplaneFlip.defaultChecked;
	var yplaneFlip = document.getElementById('yplaneFlip'); if (yplaneFlip) yplaneFlip.checked = xplaneFlip ? xplaneFlip.defaultChecked : yplaneFlip.defaultChecked;
	var zplaneFlip = document.getElementById('zplaneFlip'); if (zplaneFlip) zplaneFlip.checked = xplaneFlip ? xplaneFlip.defaultChecked : zplaneFlip.defaultChecked;

	var planesCheck = document.getElementById('showPlane');
	if (planesCheck) {
		planesCheck.checked = planesCheck.defaultChecked;
		presenter.setClippingRendermode(planesCheck.checked, presenter.getClippingRendermode()[1]);
	}
	var edgesCheck = document.getElementById('showBorder');
	if (edgesCheck) {
		edgesCheck.checked = edgesCheck.defaultChecked;
		presenter.setClippingRendermode(presenter.getClippingRendermode()[0], edgesCheck.checked);
	}
}

function sectionxSwitch(on) {
	if (on === undefined) on = (presenter.getClippingX() == 0);
	var xplane = document.getElementById('xplane');
	var xplaneOn = document.getElementById('xplane_on');
	if (!xplane || !xplaneOn) return;

	if (on) {
		xplane.style.visibility = 'hidden';
		xplaneOn.style.visibility = 'visible';
		var flip = document.getElementById('xplaneFlip');
		if (flip && flip.checked) presenter.setClippingX(-1);
		else presenter.setClippingX(1);
	} else {
		xplaneOn.style.visibility = 'hidden';
		xplane.style.visibility = 'visible';
		presenter.setClippingX(0);
	}
}

function sectionySwitch(on) {
	if (on === undefined) on = (presenter.getClippingY() == 0);
	var yplane = document.getElementById('yplane');
	var yplaneOn = document.getElementById('yplane_on');
	if (!yplane || !yplaneOn) return;

	if (on) {
		yplane.style.visibility = 'hidden';
		yplaneOn.style.visibility = 'visible';
		var flip = document.getElementById('yplaneFlip');
		if (flip && flip.checked) presenter.setClippingY(-1);
		else presenter.setClippingY(1);
	} else {
		yplaneOn.style.visibility = 'hidden';
		yplane.style.visibility = 'visible';
		presenter.setClippingY(0);
	}
}

function sectionzSwitch(on) {
	if (on === undefined) on = (presenter.getClippingZ() == 0);
	var zplane = document.getElementById('zplane');
	var zplaneOn = document.getElementById('zplane_on');
	if (!zplane || !zplaneOn) return;

	if (on) {
		zplane.style.visibility = 'hidden';
		zplaneOn.style.visibility = 'visible';
		var flip = document.getElementById('zplaneFlip');
		if (flip && flip.checked) presenter.setClippingZ(-1);
		else presenter.setClippingZ(1);
	} else {
		zplaneOn.style.visibility = 'hidden';
		zplane.style.visibility = 'visible';
		presenter.setClippingZ(0);
	}
}

function fullscreenSwitch() {
	var full = document.getElementById('full');
	if (!full) return;
	if (getComputedStyle(full).visibility === 'visible') {
		if (window.navigator.userAgent.indexOf('Trident/') < 0) enterFullscreen();
	} else {
		if (window.navigator.userAgent.indexOf('Trident/') < 0) exitFullscreen();
	}
}

function enterFullscreen() {
	var full = document.getElementById('full');
	var fullOn = document.getElementById('full_on');
	if (full) full.style.visibility = 'hidden';
	if (fullOn) fullOn.style.visibility = 'visible';

	if (isIOS()) return; //IOS DEVICES CHECK

	presenter._nativeWidth  = presenter.ui.width;
	presenter._nativeHeight = presenter.ui.height;
	presenter._nativeResizable = presenter._resizable;
	presenter._resizable = true;

	var viewer = document.getElementById('3dhop');
	if (!viewer) return;
	if (viewer.msRequestFullscreen) viewer.msRequestFullscreen();
	else if (viewer.mozRequestFullScreen) viewer.mozRequestFullScreen();
	else if (viewer.webkitRequestFullscreen) viewer.webkitRequestFullscreen();
	else if (viewer.requestFullscreen) viewer.requestFullscreen();

	presenter.ui.postDrawEvent();
}

function exitFullscreen() {
	var full = document.getElementById('full');
	var fullOn = document.getElementById('full_on');
	if (fullOn) fullOn.style.visibility = 'hidden';
	if (full) full.style.visibility = 'visible';

	if (isIOS()) return; //IOS DEVICES CHECK

	var viewer = document.getElementById('3dhop');
	var canvas = document.getElementById('draw-canvas');
	if (canvas) {
		canvas.width = presenter._nativeWidth;
		canvas.height = presenter._nativeHeight;
	}
	if (viewer) {
		viewer.style.width = presenter._nativeWidth + 'px';
		viewer.style.height = presenter._nativeHeight + 'px';
	}
	presenter._resizable = presenter._nativeResizable;

	if (document.msExitFullscreen) document.msExitFullscreen();
	else if (document.mozCancelFullScreen) document.mozCancelFullScreen();
	else if (document.webkitExitFullscreen) document.webkitExitFullscreen();
	else if (document.exitFullscreen) document.exitFullscreen();

	presenter.ui.postDrawEvent();
}

function showPanel(id) {
	var cover = document.getElementById('cover');
	if (cover) cover.style.display = 'table';
	document.querySelectorAll('.panel').forEach(function(p) { p.style.display = 'none'; });
	var panel = document.getElementById(id);
	if (panel) panel.style.display = 'table';
}

/*DEPRECATED*/
function measurementSwitch() {
	var on = presenter.isMeasurementToolEnabled();
	var measure = document.getElementById('measure');
	var measureOn = document.getElementById('measure_on');
	var box = document.getElementById('measurebox');
	var out = document.getElementById('measure-output');
	var canvas = document.getElementById('draw-canvas');

	if (on) {
		if (measure) measure.style.visibility = 'hidden';
		if (measureOn) measureOn.style.visibility = 'visible';
		if (box) box.style.visibility = 'visible';
		if (canvas) canvas.style.cursor = 'crosshair';
	} else {
		if (window.getSelection && window.getSelection() != '') window.getSelection().removeAllRanges();
		else if (document.selection && document.selection.createRange() != '') document.selection.empty();
		if (measureOn) measureOn.style.visibility = 'hidden';
		if (measure) measure.style.visibility = 'visible';
		if (box) box.style.visibility = 'hidden';
		if (out) out.innerHTML = '0.0';
		if (canvas && !presenter.isAnyMeasurementEnabled()) canvas.style.cursor = 'default';
	}
}

// +++ INTERFACE POSITIONING FUNCTIONS +++ //

function moveToolbar(l, t) {
	var toolbar = document.getElementById('toolbar');
	if (!toolbar) return;
	toolbar.style.left = l + 'px';
	toolbar.style.top = t + 'px';
	anchorPanels();
}

function movePickpointbox(l, t) {
	var el = document.getElementById('pickpoint-box');
	if (el) { el.style.left = l + 'px'; el.style.top = t + 'px'; }
}

function moveMeasurementbox(l, t) {
	var el = document.getElementById('measure-box');
	if (el) { el.style.left = l + 'px'; el.style.top = t + 'px'; }
}

function moveSectionsbox(l, t) {
	var el = document.getElementById('sections-box');
	if (el) { el.style.left = l + 'px'; el.style.top = t + 'px'; }
}

/*DEPRECATED*/
function moveMeasurebox(r, t) {
	var el = document.getElementById('measurebox');
	if (el) { el.style.right = r + 'px'; el.style.top = t + 'px'; }
}

function resizeCanvas(w, h) {
	var viewer = document.getElementById('3dhop');
	var canvas = document.getElementById('draw-canvas');
	if (canvas) { canvas.width = w; canvas.height = h; }
	if (viewer) { viewer.style.width = w + 'px'; viewer.style.height = h + 'px'; }
	presenter._resizable = false;
}

function anchorPanels() {
	var toolbar = document.getElementById('toolbar');
	if (!toolbar) return;

	var pick = document.getElementById('pick');
	var pickBox = document.getElementById('pickpoint-box');
	if (pick && pickBox) {
		pickBox.style.left = (pick.offsetLeft + pick.offsetWidth + toolbar.offsetLeft + 5) + 'px';
		pickBox.style.top = (pick.offsetTop + toolbar.offsetTop) + 'px';
	}

	var measure = document.getElementById('measure');
	var measureBox = document.getElementById('measure-box');
	if (measure && measureBox) {
		measureBox.style.left = (measure.offsetLeft + measure.offsetWidth + toolbar.offsetLeft + 5) + 'px';
		measureBox.style.top = (measure.offsetTop + toolbar.offsetTop) + 'px';
	}

	var sections = document.getElementById('sections');
	var sectionsBox = document.getElementById('sections-box');
	if (sections && sectionsBox) {
		sectionsBox.style.left = (sections.offsetLeft + sections.offsetWidth + toolbar.offsetLeft + 5) + 'px';
		sectionsBox.style.top = (sections.offsetTop + toolbar.offsetTop) + 'px';
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
