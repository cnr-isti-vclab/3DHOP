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

/**
 * Constructs a RailTrackball object.
 * @class Interactor which implements a rail-bound path controller.
 */
function RailTrackball() {
}

RailTrackball.prototype = {

	setup : function (options) {
		options = options || {};
		var opt = sglGetDefaultObject({
			startPhi      : 0.0,
			startTheta    : 0.0,
			startOffset   : 0.0,
			minMaxTheta   : [-80.0, 80.0],
			pathPoints    : [ [0.0, 0.0, 0.0] ],
			pathCircular  : false,
			pathLocked    : false,
			useSpaceTransform : true,
			stepLength    : 0.01,
			animationTime : 1.0
		}, options);

		this._action = SGL_TRACKBALL_NO_ACTION;
		this._new_action = true;
		this._matrix = SglMat4.identity();

		// path
		this._pathPoints = opt.pathPoints;
		this._pathCircular = opt.pathCircular;
		this._pathLocked = opt.pathLocked;
		this._useSpaceTransform = opt.useSpaceTransform;
		this._createPath();
		this._stepLength = opt.stepLength;

		// starting/default parameters
		this._startPhi = sglDegToRad(opt.startPhi);   	//phi (horizontal rotation)
		this._startTheta = sglDegToRad(opt.startTheta);	//theta (vertical rotation)
		this._startDistance = 0.0;
		this._startOffset = opt.startOffset;
		if(this._startOffset < 0.0) this._startOffset = 0.0;
		if(this._startOffset > 1.0) this._startOffset = 1.0;

		// current parameters
		this._phi = this._startPhi;
		this._theta = this._startTheta;
		this._distance = this._startDistance;
		this._pathOffset = this._startOffset;

		// target paramenters
		this._targetPhi = this._startPhi;
		this._targetTheta = this._startTheta;
		this._targetOffset = this._startOffset;

		//animation data
		this._isAnimating = false;
		this._speedPhi = 0.0;
		this._speedTheta = 0.0;
		this._speedOffset = 0.0;
		this._isAutoWalking = false;
		this._hasToGoLap = false;
		this._animationTime = this._defaultAnimationTime = opt.animationTime;

		// limits
		this._minMaxTheta = opt.minMaxTheta;
		this._minMaxTheta[0] = sglDegToRad(this._minMaxTheta[0]);
		this._minMaxTheta[1] = sglDegToRad(this._minMaxTheta[1]);

		// scene center/radius
		this._sceneRadiusInv = presenter.sceneRadiusInv;
		this._sceneCenter = presenter.sceneCenter;

		this._start = [0.0, 0.0];
		this.reset();
	},

    _createPath: function() {
		// if circular, add at the end of points a copy of the first one
		if(this._pathCircular)
		{
			this._pathPoints[this._pathPoints.length] = this._pathPoints[0];
		}
		
		this._pathPosNum = this._pathPoints.length;
		this._pathLen = 0.0;

    	var pp = 1;

		// vector with base offset for each path point
    	this._pathBaseOffs = [];
    	this._pathBaseOffs[0] = 0.0;

    	while(pp<this._pathPosNum) {
    		var dd = this._pathBaseOffs[pp-1];
    		dd += SglVec3.length(SglVec3.sub(this._pathPoints[pp], this._pathPoints[pp-1]));
    		this._pathBaseOffs[pp] = dd;
    		pp +=1;
		}

		// total length
    	this._pathLen = this._pathBaseOffs[this._pathPosNum-1];

    	// normalize all base offs
		pp = 1;
    	while(pp<this._pathPosNum) {
    		this._pathBaseOffs[pp] = this._pathBaseOffs[pp]/this._pathLen;
    		pp +=1;
		}
		this._pathBaseOffs[this._pathPosNum-1] = 1.0;

		this._currPosition = this._computeCurrPoint();
    },

    _computeCurrPoint: function() {
		var mypoint = [0.0, 0.0, 0.0];

		// update scene radius
		this._sceneRadiusInv = presenter.sceneRadiusInv;
		this._sceneCenter = presenter.sceneCenter;

		// interpolating
		var pp = 0;

    	while(this._pathBaseOffs[pp+1] <= this._pathOffset) {
    		pp +=1;
    	}

		if(pp==this._pathPosNum-1)
			mypoint = this._pathPoints[this._pathPosNum-1];
		else
		{
			var myoff = (this._pathOffset - this._pathBaseOffs[pp]) / (this._pathBaseOffs[pp+1] - this._pathBaseOffs[pp]);

			mypoint = SglVec3.add(this._pathPoints[pp], SglVec3.muls(SglVec3.sub(this._pathPoints[pp+1],this._pathPoints[pp]), myoff));
		}

		if(this._useSpaceTransform)
		{
			var spaceTr = presenter._scene.space.transform.matrix;
			var pp = SglVec3.to4(mypoint,1);
			pp = SglMat4.mul4(spaceTr, pp);
			mypoint = SglVec4.to3(pp);
		}
		
		return [(mypoint[0]-this._sceneCenter[0])*this._sceneRadiusInv, (mypoint[1]-this._sceneCenter[1])*this._sceneRadiusInv, (mypoint[2]-this._sceneCenter[2])*this._sceneRadiusInv];
	},

    _clamp: function(value, low, high) {
		if(value < low) return low;
		if(value > high) return high;
		return value;
    },

    _computeMatrix: function() {
		var m = SglMat4.identity();	
	
		// update currposition
		this._currPosition = this._computeCurrPoint();
		// zoom
		m = SglMat4.mul(m, SglMat4.translation([0.0, 0.0, -this._distance]));
		// rotation
		m = SglMat4.mul(m, SglMat4.rotationAngleAxis(this._theta, [1.0, 0.0, 0.0]));
		// tilt
		m = SglMat4.mul(m, SglMat4.rotationAngleAxis(this._phi, [0.0, -1.0, 0.0]));
		// centering
		m = SglMat4.mul(m, SglMat4.translation([-this._currPosition[0], -this._currPosition[1], -this._currPosition[2]]));

		this._matrix = m;
		
		if(typeof onTrackballUpdate != "undefined")
			onTrackballUpdate(this.getState());		
    },

	stepFW: function() {
		this._pathOffset += this._stepLength;
		if(this._pathOffset > 1.0)
			if(this._pathCircular)
				this._pathOffset -= 1.0;
			else
				this._pathOffset = 1.0;

		this._computeMatrix();
	},

	stepBW: function() {
		this._pathOffset -= this._stepLength;
		if(this._pathOffset < 0.0)
			if(this._pathCircular)
				this._pathOffset += 1.0;
			else
				this._pathOffset = 0.0;

		this._computeMatrix();
	},

	getState : function () {
		return [sglRadToDeg(this._phi), sglRadToDeg(this._theta), this._pathOffset];
	},

	setState : function (newstate) {
		// stop animation
		this._isAnimating = false;

		this._phi        = sglDegToRad(newstate[0]);
		this._theta      = sglDegToRad(newstate[1]);
		this._pathOffset = newstate[2];

		// avoid eternal accumulation of rotation, just for the sake of cleanliness
		if (this._phi > 20.0) this._phi = this._phi - 20.0;
		if (this._phi < -20.0) this._phi = this._phi + 20.0;
		//check limits
		this._theta = this._clamp(this._theta, this._minMaxTheta[0], this._minMaxTheta[1]);
		this._pathOffset = this._pathOffset % 1.0;
		if(this._pathOffset < 0.0) this._pathOffset = 1.0 - this._pathOffset;

		this._computeMatrix();
	},

	animateToState : function (newstate, newtime) {
		// stop animation
		this._isAnimating = false;

		if(newstate)
		{
			this._isAutoWalking = false;
			this._targetPhi    = sglDegToRad(newstate[0]);
			this._targetTheta  = sglDegToRad(newstate[1]);
			this._targetOffset = newstate[2];

		if(newtime) this._animationTime = newtime;
		else this._animationTime = this._defaultAnimationTime;

			//check limits
			this._targetTheta = this._clamp(this._targetTheta, this._minMaxTheta[0], this._minMaxTheta[1]);
			if(this._targetOffset < 0.0) this._targetOffset = 0.0;
			if(this._targetOffset > 1.0) this._targetOffset = 1.0;

			// setting base velocities
			this._speedPhi    = Math.PI;
			this._speedTheta  = Math.PI;
			this._speedOffset = 1.0/60.0;

			// clamp target phi angle
			while(this._targetPhi > 2*Math.PI)
				this._targetPhi -= 2*Math.PI;
			while(this._targetPhi < 0)
				this._targetPhi += 2*Math.PI;

			// clamp current phi angle, to prevent endless unwinding
			while(this._phi > 2*Math.PI)
				this._phi -= 2*Math.PI;
			while(this._phi < 0)
				this._phi += 2*Math.PI;

			// determine minimal, clamped target phi angle
			var clampedangle = this._targetPhi;
			while(clampedangle > 2*Math.PI)
				clampedangle -= 2*Math.PI;
			while(clampedangle < 0)
				clampedangle += 2*Math.PI;

			if(Math.abs(clampedangle - this._phi) < Math.PI) { // standard rotation
				if(clampedangle > this._phi){
					this.speedphi = Math.PI;
				}
				else{
					this.speedphi = -Math.PI;
				}
			}
			else{
				if(clampedangle > this._phi){
					clampedangle = (clampedangle - 2*Math.PI)
					this.speedphi = -Math.PI;
				}
				else{
					clampedangle = (clampedangle + 2*Math.PI)
					this.speedphi = Math.PI;
				}
			}

			this._targetPhi = clampedangle;

			// determine sign of offset motion
			var offdist = 0.0;
			if(this._pathCircular)
			{
				this._pathOffset = this._pathOffset % 1.0;
				if(this._pathOffset < 0.0) this._pathOffset = 1.0 - this._pathOffset;

				if(this._targetOffset >= this._pathOffset)
				{
					// if more than half path, reverse direction
					if((this._targetOffset - this._pathOffset)<=0.5)
					{
						this._speedOffset = 1.0/30.0;
						this._hasToGoLap = false;
						offdist = this._targetOffset - this._pathOffset;
					}
					else
					{
						this._speedOffset = -1.0/30.0;
						this._hasToGoLap = true;
						offdist = this._pathOffset + (1.0 - this._targetOffset);
					}
				}
				else
				{
					// if more than half path, reverse direction
					if((this._pathOffset - this._targetOffset)<=0.5)
					{
						this._speedOffset = -1.0/30.0;
						this._hasToGoLap = false;
						offdist = this._pathOffset - this._targetOffset;
					}
					else
					{
						this._speedOffset = 1.0/30.0;
						this._hasToGoLap = true;
						offdist = this._targetOffset + (1.0 - this._pathOffset);
					}
				}
			}
			else
			{
				offdist = this._targetOffset - this._pathOffset;
				this._hasToGoLap = false;
				if(this._targetOffset >= this._pathOffset)
					this._speedOffset = 1.0/30.0;
				else
					this._speedOffset = -1.0/30.0;
			}

			// theta direction
			if(this._targetTheta > this._theta)
				this.speedTheta = Math.PI;
			else
				this.speedTheta = -Math.PI;

			// find max animation time to set a time limit and then synchronize all movements
			var timePhi      = Math.abs((this._targetPhi - this._phi) / this._speedPhi);
			var timeTheta    = Math.abs((this._targetTheta - this._theta) / this._speedTheta);
			var timeOffset   = Math.abs(offdist / this._speedOffset);

			var maxtime = Math.max( timePhi, Math.max( timeTheta, timeOffset ));

			maxtime = this._clamp(maxtime, 1.0, 3.0);

			this._speedPhi *= timePhi / maxtime;
			this._speedTheta *= timeTheta / maxtime;
			this._speedOffset *= timeOffset / maxtime;
		}
		else
		{
			this._isAutoWalking = true;
		}

		// start animation
		this._isAnimating = true;
	},

	tick : function (dt) {
		if(!this._isAnimating) return false;

		if(this._isAutoWalking)
		{
			this._pathOffset += (dt / this._animationTime);
			if(this._pathOffset > 1.0) {
				if(this._pathCircular)
					this._pathOffset -= 1.0;
				else
					this._pathOffset = 1.0;
			 if(!this._pathCircular) this._isAutoWalking = this._isAnimating = false;
			}
		}
		else
		{
			var deltaPhi    = this._speedPhi * dt / this._animationTime;
			var deltaTheta  = this._speedTheta * dt / this._animationTime;
			var deltaOffset = this._speedOffset * dt / this._animationTime;

			var diffPhi    = this._targetPhi - this._phi;
			var diffTheta  = this._targetTheta - this._theta;

			if (diffPhi > deltaPhi)
				this._phi += deltaPhi;
			else if (diffPhi < -deltaPhi)
				this._phi -= deltaPhi;
			else
				this._phi = this._targetPhi;

			if (diffTheta > deltaTheta)
				this._theta += deltaTheta;
			else if (diffTheta < -deltaTheta)
				this._theta -= deltaTheta;
			else
				this._theta = this._targetTheta;

			if(this._hasToGoLap)
			{
				this._pathOffset = this._pathOffset + deltaOffset;
				if(this._pathOffset>1.0)
				{
					this._hasToGoLap = false;
					this._pathOffset = this._pathOffset % 1.0;
					if(this._pathOffset > this._targetOffset)
						this._pathOffset = this._targetOffset;
				}
				if(this._pathOffset<0.0)
				{
					this._hasToGoLap = false;
					this._pathOffset = this._pathOffset % 1.0;
					this._pathOffset = 1.0 - this._pathOffset;
					if(this._pathOffset < this._targetOffset)
						this._pathOffset = this._targetOffset;
				}
			}
			else
			{
				if (deltaOffset > 0.0)
				{
					if(this._pathOffset + deltaOffset > this._targetOffset)
						this._pathOffset = this._targetOffset;
					else
						this._pathOffset = this._pathOffset + deltaOffset;
				}
				else
				{
					if(this._pathOffset + deltaOffset < this._targetOffset)
						this._pathOffset = this._targetOffset;
					else
						this._pathOffset = this._pathOffset + deltaOffset;
				}
			}

			if(this._phi == this._targetPhi)
				if(this._theta == this._targetTheta)
					if(this._pathOffset == this._targetOffset)
						{ this._animationTime = this._defaultAnimationTime; this._isAnimating = false; }
		}

		this._computeMatrix();

		return true;
	},

	get action()  { return this._action; },

	set action(a) { if(this._action != a) { this._new_action = true; this._action = a; } },

	get matrix() {
		this._computeMatrix();
		return this._matrix;
	},

	reset : function () {
		this._matrix = SglMat4.identity();
		this._action = SGL_TRACKBALL_NO_ACTION

		this._phi = this._startPhi;
		this._theta = this._startTheta;
		this._pathOffset = this._startOffset;

		this._computeMatrix();

		this._isAnimating = false;
		this._isAutoWalking = false;
		this._hasToGoLap = false;
	},

	track : function(m, x, y, z) {
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
				//this._isAnimating = false; //stopping animation
				this.rotate(m, dx, dy);
				break;
			case SGL_TRACKBALL_PAN:
				break;
			case SGL_TRACKBALL_SCALE:
				if(this._pathLocked) break;
				this._isAnimating = false; //stopping animation
				this.scale(m, z);
				break;
			default:
				break;
		}
		return this._computeMatrix();
	},

	rotate: function(m, dx, dy) {
		this._phi += dx;
		// avoid eternal accumulation of rotation, just for the sake of cleanliness
		if (this._phi > 10.0) this._phi = this._phi - 10.0;
		if (this._phi < -10.0) this._phi = this._phi + 10.0;

		this._theta += dy;
		this._theta = this._clamp(this._theta, this._minMaxTheta[0], this._minMaxTheta[1]);
	},

	scale : function(m, s) {
		if(s < 1.0)
			this.stepFW();
		else
			this.stepBW();
	}
};
/***********************************************************************/
