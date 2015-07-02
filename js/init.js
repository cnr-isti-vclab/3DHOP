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
	$('#toolbar img')
		.hover(function(){
			$(this).animate({opacity:'0.8'}, {queue:false,duration:100});
			}, function(){
			$(this).animate({opacity:'0.5'}, {queue:true,duration:100});
			})
		.click(function() {
			actionsToolbar($(this).attr('id'));
			$(this).animate({opacity:'1.0'}, {queue:true,duration:100});
			$(this).animate({opacity:'0.8'}, {queue:true,duration:100});
			return false;
		});

	$('#3dhop')
		.on('contextmenu', function(e){ //don't allow to open contextual menu (right click)
			return false; 
		});	

    resizeCanvas($(window).width(),$(window).height());
	
	set3dhlg();	
} 

function lightSwitch() {
  var on = presenter.isLightTrackballEnabled();

  var pat = new RegExp(".*/","g");
  var base = pat.exec(String($('#light').attr("src")));
  if(on)
    $('#light').attr("src", base + "light_on.png");
  else 
    $('#light').attr("src", base + "light.png");
} 

function moveToolbar(l,t) {
  $('#toolbar').css('margin-left', l);
  $('#toolbar').css('margin-top', t);	
} 

function resizeCanvas(w,h) {
  $('#draw-canvas').attr('width', w);
  $('#draw-canvas').attr('height',h);
  $('#3dhop').css('width', w);
  $('#3dhop').css('height', h);  
  $('#tdhlg').css('margin-left', w-115);
  $('#tdhlg').css('margin-top', h-15);
}

function set3dhlg() {	
  $('#tdhlg').text("Powered by 3DHOP");	
  $('#tdhlg').click(function() { window.open('http://vcg.isti.cnr.it/3dhop/', '_blank') }); 	  
} 
