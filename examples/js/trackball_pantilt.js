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

/**
 * Constructs a PanTiltTrackball object.
 * @class Interactor which implements a pan-tilt trackball controller with bounds.
 */
function PanTiltTrackball() {
}

PanTiltTrackball.prototype = {

	setup : function (options) {
		options = options || {};
		var opt = sglGetDefaultObject({
			startCenter   : [ 0.0, 0.0, 0.0 ],
			startPanX     : 0.0,
			startPanY     : 0.0,
			startAngleX   : 0.0,
			startAngleY   : 0.0,
			startDistance : 2.0,
			minMaxDist    : [0.2, 4.0],
			minMaxPanX    : [-0.7, 0.7],
			minMaxPanY    : [-0.7, 0.7],
			minMaxAngleX  : [-70.0, 70.0],
			minMaxAngleY  : [-70.0, 70.0],
			pathStates      : [ ],	// path points array
			animationLocked : false,// if true disable trackball interactions during animation
			animationTime   : null	// when single position navigation, each to point navigation is # seconds (if null, automatically computed)
		}, options);

		this._action = SGL_TRACKBALL_NO_ACTION;
		this._new_action = true;
		this._matrix = SglMat4.identity();

		// path
		this._pathStates = opt.pathStates;
		this._animationLocked = opt.animationLocked;
		this._pathPosNum = 0;

		// trackball center
		this._center = opt.startCenter;

		// starting/default parameters
		this._startPanX = opt.startPanX;					//pan X
		this._startPanY = opt.startPanY;					//pan Y
		this._startAngleX = sglDegToRad(opt.startAngleX);	//angle X
		this._startAngleY = sglDegToRad(opt.startAngleY);	//angle Y
		this._startDistance = opt.startDistance;			//distance

		// current parameters
		this._panX = this._startPanX;
		this._panY = this._startPanY;
		this._angleX = this._startAngleX;
		this._angleY = this._startAngleY;
		this._distance = this._startDistance;

		// target paramenters
		this._targetPanX = this._startPanX;
		this._targetPanY = this._startPanY;
		this._targetAngleX = this._startAngleX;
		this._targetAngleY = this._startAngleY;
		this._targetDistance = this._startDistance;

		//animation data
		this._isAnimating = false;
		this._speedPanX = 0.0;
		this._speedPanY = 0.0;
		this._speedAngleX = 0.0;
		this._speedAngleY = 0.0;
		this._speedDistance = 0.0;
		this._isAutoWalking = false;
		this._animationTime = opt.animationTime;

		//limits
		this._minMaxDist  = opt.minMaxDist;
		this._minMaxPanX   = opt.minMaxPanX;
		this._minMaxPanY   = opt.minMaxPanY;
		this._minMaxAngleX = opt.minMaxAngleX;
		this._minMaxAngleX[0] = sglDegToRad(this._minMaxAngleX[0]);
		this._minMaxAngleX[1] = sglDegToRad(this._minMaxAngleX[1]);
		this._minMaxAngleY = opt.minMaxAngleY;
		this._minMaxAngleY[0] = sglDegToRad(this._minMaxAngleY[0]);
		this._minMaxAngleY[1] = sglDegToRad(this._minMaxAngleY[1]);

		this._start = [0.0, 0.0];
		this.reset();
	},

	_clamp : function(value, low, high) {
		if(value < low) return low;
		if(value > high) return high;
		return value;
	},

	_computeMatrix: function() {
		var m = SglMat4.identity();

		// centering
		m = SglMat4.mul(m, SglMat4.translation([-this._center[0], -this._center[1], -this._center[2]]));
		// zoom
		m = SglMat4.mul(m, SglMat4.translation([0.0, 0.0, -this._distance]));
		// tilt
		m = SglMat4.mul(m, SglMat4.rotationAngleAxis(this._angleY, [1.0, 0.0, 0.0]));
		m = SglMat4.mul(m, SglMat4.rotationAngleAxis(this._angleX, [0.0, -1.0, 0.0]));
		// pan
		m = SglMat4.mul(m, SglMat4.translation([this._panX, this._panY, 0.0]));

		this._matrix = m;

		if(typeof onTrackballUpdate != "undefined")
			onTrackballUpdate(this.getState());
	},

	getState : function () {
		return [this._panX, this._panY, sglRadToDeg(this._angleX), sglRadToDeg(this._angleY), this._distance];
	},

	setState : function (newstate) {
		// stop animation
		this._isAnimating = this._isAutoWalking = false;

		this._panX     = newstate[0];
		this._panY     = newstate[1];
		this._angleX   = sglDegToRad(newstate[2]);
		this._angleY   = sglDegToRad(newstate[3]);
		this._distance = newstate[4];

		//check limits
		this._panX = this._clamp(this._panX, this._minMaxPanX[0], this._minMaxPanX[1]);
		this._panY = this._clamp(this._panY, this._minMaxPanY[0], this._minMaxPanY[1]);
		this._angleX = this._clamp(this._angleX, this._minMaxAngleX[0], this._minMaxAngleX[1]);
		this._angleY = this._clamp(this._angleY, this._minMaxAngleY[0], this._minMaxAngleY[1]);
		this._distance = this._clamp(this._distance, this._minMaxDist[0], this._minMaxDist[1]);

		this._computeMatrix();
	},

	animateToState : function (newstate, newtime) {
		// stop animation
		this._isAnimating = false;

		if(newstate)
		{
			// stop autoWalking
			this._isAutoWalking = false;

			// setting targets
			this._targetPanX     = newstate[0];
			this._targetPanY     = newstate[1];
			this._targetAngleX   = sglDegToRad(newstate[2]);
			this._targetAngleY   = sglDegToRad(newstate[3]);
			this._targetDistance = newstate[4];

			//check limits
			this._targetPanX = this._clamp(this._targetPanX, this._minMaxPanX[0], this._minMaxPanX[1]);
			this._targetPanY = this._clamp(this._targetPanY, this._minMaxPanY[0], this._minMaxPanY[1]);
			this._targetAngleX = this._clamp(this._targetAngleX, this._minMaxAngleX[0], this._minMaxAngleX[1]);
			this._targetAngleY = this._clamp(this._targetAngleY, this._minMaxAngleY[0], this._minMaxAngleY[1]);
			this._targetDistance = this._clamp(this._targetDistance, this._minMaxDist[0], this._minMaxDist[1]);

			// setting base velocities
			this._speedPanX = 2.0;
			this._speedPanY = 2.0;
			this._speedAngleX = Math.PI;
			this._speedAngleY = Math.PI;
			this._speedDistance = 2.0;

			// find max animation time to set a time limit and then synchronize all movements
			var timePanX = Math.abs((this._targetPanX - this._panX) / this._speedPanX);
			var timePanY = Math.abs((this._targetPanY - this._panY) / this._speedPanY);
			var timeAngleX = Math.abs((this._targetAngleX - this._angleX) / this._speedAngleX);
			var timeAngleY = Math.abs((this._targetAngleY - this._angleY) / this._speedAngleY);
			var timeDistance = Math.abs((this._targetDistance - this._distance) / this._speedDistance);

			var maxtime = Math.max( timePanX, Math.max( timePanY, Math.max( timeAngleX, Math.max( timeAngleY, timeDistance ) ) ));
			var animationtime = this._clamp(maxtime, 0.5, 2.0);

			if(newtime) animationtime = newtime;
			else if (this._animationTime) animationtime = this._animationTime;

			this._speedPanX     *= timePanX / animationtime;
			this._speedPanY     *= timePanY / animationtime;
			this._speedAngleX   *= timeAngleX / animationtime;
			this._speedAngleY   *= timeAngleY / animationtime;
			this._speedDistance *= timeDistance / animationtime;
		}
		else
		{
			if(this._pathPosNum == this._pathStates.length){
				this._isAutoWalking = false;
				this._pathPosNum = 0;
			}
			else {
				var state = this._pathStates[this._pathPosNum][0];
				var time = this._animationTime;
				if(!Array.isArray(state)) state = this._pathStates[this._pathPosNum];
				else if (this._pathStates[this._pathPosNum][1]) time = this._pathStates[this._pathPosNum][1];
				if(!this._isAutoWalking) this.animateToState(state, time);
				this._isAutoWalking = true;
			}
		}

		// start animation
		this._isAnimating = true;
	},

	recenter : function (newpoint) {
		// stop animation
		this._isAnimating = this._isAutoWalking = false;

		var newpanX = -(newpoint[0]-presenter.sceneCenter[0]) * presenter.sceneRadiusInv;
		var newpanY = -(newpoint[1]-presenter.sceneCenter[1]) * presenter.sceneRadiusInv;

		this.animateToState([newpanX, newpanY, sglRadToDeg(this._angleX), sglRadToDeg(this._angleY), (this._distance * 0.6)]);
	},

	tick : function (dt) {
		if(!this._isAnimating) return false;

		var deltaPanX     = this._speedPanX * dt;
		var deltaPanY     = this._speedPanY * dt;
		var deltaAngleX   = this._speedAngleX * dt;
		var deltaAngleY   = this._speedAngleY * dt;
		var deltaDistance = this._speedDistance * dt;

		var diffPanX = this._targetPanX - this._panX;
		var diffPanY = this._targetPanY - this._panY;
		var diffAngleX = this._targetAngleX - this._angleX;
		var diffAngleY = this._targetAngleY - this._angleY;
		var diffDistance = this._targetDistance - this._distance;

		if (diffPanX > deltaPanX)
			this._panX += deltaPanX;
		else if (diffPanX < -deltaPanX)
			this._panX -= deltaPanX;
		else
			this._panX = this._targetPanX;

		if (diffPanY > deltaPanY)
			this._panY += deltaPanY;
		else if (diffPanY < -deltaPanY)
			this._panY -= deltaPanY;
		else
			this._panY = this._targetPanY;

		if (diffAngleX > deltaAngleX)
			this._angleX += deltaAngleX;
		else if (diffAngleX < -deltaAngleX)
			this._angleX -= deltaAngleX;
		else
			this._angleX = this._targetAngleX;

		if (diffAngleY > deltaAngleY)
			this._angleY += deltaAngleY;
		else if (diffAngleY < -deltaAngleY)
			this._angleY -= deltaAngleY;
		else
			this._angleY = this._targetAngleY;

		if (diffDistance > deltaDistance)
			this._distance += deltaDistance;
		else if (diffDistance < -deltaDistance)
			this._distance -= deltaDistance;
		else
			this._distance = this._targetDistance;

		if(this._panX == this._targetPanX)
			if(this._panX == this._targetPanX)
				if(this._angleX == this._targetAngleX)
					if(this._angleY == this._targetAngleY)
						if(this._distance == this._targetDistance){
								this._isAnimating = false; 
								if(this._isAutoWalking) { this._pathPosNum++; this._isAutoWalking = false; this.animateToState(); }
							}

		this._computeMatrix();
		return true;
	},

	set action(a) { if(this._action != a) { this._new_action = true; this._action = a; } },

	get action()  { return this._action; },

	get matrix() { this._computeMatrix(); return this._matrix; },

	get distance() { return this._distance; },

	reset : function () {
		this._matrix = SglMat4.identity();
		this._action = SGL_TRACKBALL_NO_ACTION;
		this._new_action = true;

		this._panX = this._startPanX;
		this._panY = this._startPanY;
		this._angleX = this._startAngleX;
		this._angleY = this._startAngleY;
		this._distance = this._startDistance;

		this._pathPosNum = 0;

		this._isAutoWalking = false;
		this._isAnimating = false;

		this._computeMatrix();
	},

	track : function(m, x, y, z) {
		if(this._animationLocked && this._isAnimating) this._action = SGL_TRACKBALL_NO_ACTION;
		if(this._new_action) {
			this._start[0] = x;
			this._start[1] = y;
			this._new_action = false;
		}

		var dx = this._start[0] - x;
		var dy = this._start[1] - y;
		this._start[0] = x;
		this._start[1] = y;

		switch (this._action) {
			case SGL_TRACKBALL_ROTATE:
				this._isAnimating = this._isAutoWalking = false; //stopping animation
				this.rotate(m, dx, dy);
			break;

			case SGL_TRACKBALL_PAN:
				this._isAnimating = this._isAutoWalking = false; //stopping animation
				this.pan(m, dx, dy);
			break;

			case SGL_TRACKBALL_SCALE:
				this._isAnimating = this._isAutoWalking = false; //stopping animation
				this.scale(m, z);
			break;

			default:
			break;
		}
		return this._computeMatrix();
	},

	rotate: function(m, dx, dy) {
		this._angleX += dx;
		this._angleY += dy;
		this._angleX = this._clamp(this._angleX, this._minMaxAngleX[0], this._minMaxAngleX[1]);
		this._angleY = this._clamp(this._angleY, this._minMaxAngleY[0], this._minMaxAngleY[1]);
	},

	pan: function(m, dx, dy) {
		var panSpeed = Math.max(Math.min(1.5, this._distance),0.05);
		this._panX -= dx/2.0 * panSpeed; 
		this._panY -= dy/2.0 * panSpeed;
		this._panX = this._clamp(this._panX, this._minMaxPanX[0], this._minMaxPanX[1]);
		this._panY = this._clamp(this._panY, this._minMaxPanY[0], this._minMaxPanY[1]);
	},

	scale : function(m, s) {
		this._distance *= s;
		this._distance = this._clamp(this._distance, this._minMaxDist[0], this._minMaxDist[1]);
	}
};
/***********************************************************************/
