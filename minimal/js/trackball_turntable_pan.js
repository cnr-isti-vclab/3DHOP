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

/**
 * Constructs a TurntableCylTrackball object.
 * @class Interactor which implements a Turntable controller + cylindrical pan with bounds.
 */
function TurntablePanTrackball() {
}

TurntablePanTrackball.prototype = {

	setup : function (options) {
		options = options || {};
		var opt = sglGetDefaultObject({
			startCenter   : [ 0.0, 0.0, 0.0 ],
			startPhi      : 0.0,
			startTheta    : 0.0,
			startDistance : 2.0,
			startPanX     : 0.0,
			startPanY     : 0.0,
			startPanZ     : 0.0,
			minMaxDist    : [0.2, 4.0],
			minMaxPhi     : [-180, 180],
			minMaxTheta   : [-80.0, 80.0],
			minMaxPanX    : [-1.0, 1.0],
			minMaxPanY    : [-1.0, 1.0],
			minMaxPanZ    : [-1.0, 1.0],
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
		this._startPhi = sglDegToRad(opt.startPhi);		//phi (horizontal rotation)
		this._startTheta = sglDegToRad(opt.startTheta);	//theta (vertical rotation)
		this._startPanX = opt.startPanX;				//panX
		this._startPanY = opt.startPanY;				//panY
		this._startPanZ = opt.startPanZ;				//panZ
		this._startDistance = opt.startDistance;		//distance

		// current parameters
		this._phi = this._startPhi;
		this._theta = this._startTheta;
		this._panX = this._startPanX;
		this._panY = this._startPanY;
		this._panZ = this._startPanZ;
		this._distance = this._startDistance;

		// target paramenters
		this._targetPhi = this._startPhi;
		this._targetTheta = this._startTheta;
		this._targetPanX = this._startPanX;
		this._targetPanY = this._startPanY;
		this._targetPanZ = this._startPanZ;
		this._targetDistance = this._startDistance;

		//animation data
		this._isAnimating = false;
		this._speedPhi = 0.0;
		this._speedTheta = 0.0;
		this._speedPanX = 0.0;
		this._speedPanY = 0.0;
		this._speedPanZ = 0.0;
		this._speedDistance = 0.0;
		this._isAutoWalking = false;
		this._animationTime = opt.animationTime;

		// limits
		this._minMaxDist  = opt.minMaxDist;
		if((opt.minMaxPhi[0] == -180)&&(opt.minMaxPhi[1] == 180))
			this._limitPhi = false;
		else
			this._limitPhi = true;
		this._minMaxPhi   = opt.minMaxPhi;
		this._minMaxPhi[0] = sglDegToRad(this._minMaxPhi[0]);
		this._minMaxPhi[1] = sglDegToRad(this._minMaxPhi[1]);
		this._minMaxTheta = opt.minMaxTheta;
		this._minMaxTheta[0] = sglDegToRad(this._minMaxTheta[0]);
		this._minMaxTheta[1] = sglDegToRad(this._minMaxTheta[1]);
		this._minMaxPanX  = opt.minMaxPanX;
		this._minMaxPanY  = opt.minMaxPanY;
		this._minMaxPanZ  = opt.minMaxPanZ;

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
		// rotation
		m = SglMat4.mul(m, SglMat4.rotationAngleAxis(this._theta, [1.0, 0.0, 0.0]));
		// tilt
		m = SglMat4.mul(m, SglMat4.rotationAngleAxis(this._phi, [0.0, -1.0, 0.0]));
		// panning
		m = SglMat4.mul(m, SglMat4.translation([-this._panX, -this._panY, -this._panZ]));

		this._matrix = m;

		if(typeof onTrackballUpdate != "undefined")
			onTrackballUpdate(this.getState());							  
	},

	getState : function () {
		return [sglRadToDeg(this._phi), sglRadToDeg(this._theta), this._panX, this._panY, this._panZ, this._distance];
	},

	setState : function (newstate) {
		// stop animation
		this._isAnimating = this._isAutoWalking = false;

		this._phi      = sglDegToRad(newstate[0]);
		this._theta    = sglDegToRad(newstate[1]);
		this._panX     = newstate[2];
		this._panY     = newstate[3];
		this._panZ     = newstate[4];
		this._distance = newstate[5];

		//check limits
		if(this._limitPhi)
			this._phi = this._clamp(this._phi, this._minMaxPhi[0], this._minMaxPhi[1]);
		this._theta = this._clamp(this._theta, this._minMaxTheta[0], this._minMaxTheta[1]);
		this._distance = this._clamp(this._distance, this._minMaxDist[0], this._minMaxDist[1]);
		this._panX = this._clamp(this._panX, this._minMaxPanX[0], this._minMaxPanX[1]);
		this._panY = this._clamp(this._panY, this._minMaxPanY[0], this._minMaxPanY[1]);
		this._panZ = this._clamp(this._panZ, this._minMaxPanZ[0], this._minMaxPanZ[1]);

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
			this._targetPhi      = sglDegToRad(newstate[0]);
			this._targetTheta    = sglDegToRad(newstate[1]);
			this._targetPanX     = newstate[2];
			this._targetPanY     = newstate[3];
			this._targetPanZ     = newstate[4];
			this._targetDistance = newstate[5];

			//check limits
			if(this._limitPhi)
				this._targetPhi = this._clamp(this._targetPhi, this._minMaxPhi[0], this._minMaxPhi[1]);
			this._targetPhi = this._targetPhi % (2*Math.PI);
			this._targetTheta = this._clamp(this._targetTheta, this._minMaxTheta[0], this._minMaxTheta[1]);
			this._targetPanX = this._clamp(this._targetPanX, this._minMaxPanX[0], this._minMaxPanX[1]);
			this._targetPanY = this._clamp(this._targetPanY, this._minMaxPanY[0], this._minMaxPanY[1]);
			this._targetPanZ = this._clamp(this._targetPanZ, this._minMaxPanZ[0], this._minMaxPanZ[1]);
			this._targetDistance = this._clamp(this._targetDistance, this._minMaxDist[0], this._minMaxDist[1]);

			// setting base velocities
			this._speedPhi = Math.PI;
			this._speedTheta = Math.PI;
			this._speedPanX = 1.0;
			this._speedPanY = 1.0;
			this._speedPanZ = 1.0;
			this._speedDistance = 2.0;

			//if phi unconstrained rotation, it is necessary to find a good rotation direction
			if(!this._limitPhi){
				// normalize (-2pi 2pi) current phi angle, to prevent endless unwinding
				this._phi = this._phi % (2*Math.PI);

				// determine minimal, normalized target phi angle, to prevent endless unwinding
				var clampedangle = this._targetPhi;
				clampedangle = clampedangle % (2*Math.PI);

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
			}

			// find max animation time to set a time limit and then synchronize all movements
			var timePhi      = Math.abs((this._targetPhi - this._phi) / this._speedPhi);
			var timeTheta    = Math.abs((this._targetTheta - this._theta) / this._speedTheta);
			var timeDistance = Math.abs((this._targetDistance - this._distance) / this._speedDistance);
			var timePanX     = Math.abs((this._targetPanX - this._panX) / this._speedPanX);
			var timePanY     = Math.abs((this._targetPanY - this._panY) / this._speedPanY);
			var timePanZ     = Math.abs((this._targetPanZ - this._panZ) / this._speedPanZ);

			var maxtime = Math.max( timePhi, Math.max( timeTheta, Math.max( timeDistance, Math.max( timePanX, Math.max( timePanY, timePanZ )))));
			var animationtime = this._clamp(maxtime, 0.5, 2.0);

			if(newtime) animationtime = newtime;
			else if (this._animationTime) animationtime = this._animationTime;

			this._speedPhi      *= timePhi / animationtime;
			this._speedTheta    *= timeTheta / animationtime;
			this._speedDistance *= timeDistance / animationtime;
			this._speedPanX     *= timePanX / animationtime;
			this._speedPanY     *= timePanY / animationtime;
			this._speedPanZ     *= timePanZ / animationtime;
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

		var newpanX = (newpoint[0]-presenter.sceneCenter[0]) * presenter.sceneRadiusInv;
		var newpanY = (newpoint[1]-presenter.sceneCenter[1]) * presenter.sceneRadiusInv;
		var newpanZ = (newpoint[2]-presenter.sceneCenter[2]) * presenter.sceneRadiusInv;

		this.animateToState([sglRadToDeg(this._phi), sglRadToDeg(this._theta), newpanX, newpanY, newpanZ, (this._distance * 0.6)]);
	},

	tick : function (dt) {
		if(!this._isAnimating) return false;

		var deltaPhi      = this._speedPhi * dt;
		var deltaTheta    = this._speedTheta * dt;
		var deltaDistance = this._speedDistance * dt;
		var deltaPanX     = this._speedPanX * dt;
		var deltaPanY     = this._speedPanY * dt;
		var deltaPanZ     = this._speedPanZ * dt;

		var diffPhi      = this._targetPhi - this._phi;
		var diffTheta    = this._targetTheta - this._theta;
		var diffDistance = this._targetDistance - this._distance;
		var diffPanX     = this._targetPanX - this._panX;
		var diffPanY     = this._targetPanY - this._panY;
		var diffPanZ     = this._targetPanZ - this._panZ;

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

		if (diffDistance > deltaDistance)
			this._distance += deltaDistance;
		else if (diffDistance < -deltaDistance)
			this._distance -= deltaDistance;
		else
			this._distance = this._targetDistance;

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

		if (diffPanZ > deltaPanZ)
			this._panZ += deltaPanZ;
		else if (diffPanZ < -deltaPanZ)
			this._panZ -= deltaPanZ;
		else
			this._panZ = this._targetPanZ;

		if(this._phi == this._targetPhi)
			if(this._theta == this._targetTheta)
				if(this._distance == this._targetDistance)
					if(this._panX == this._targetPanX)
						if(this._panY == this._targetPanY)
							if(this._panZ == this._targetPanZ){
								this._isAnimating = false;
								if(typeof onTrackballArrived != "undefined")
									onTrackballArrived(this.getState());
								if(this._isAutoWalking) { this._pathPosNum++; this._isAutoWalking = false; this.animateToState(); }
							}

		this._computeMatrix();
		return true;
	},

	set action(a) { if(this._action != a) { this._new_action = true; this._action = a; } },

	get action() { return this._action; },

	get matrix() { this._computeMatrix(); return this._matrix; },

	get distance() { return this._distance; },

	reset : function () {
		this._matrix = SglMat4.identity();
		this._action = SGL_TRACKBALL_NO_ACTION;
		this._new_action = true;

		this._phi = this._startPhi;
		this._theta = this._startTheta;
		this._distance = this._startDistance;
		this._panX = this._startPanX;
		this._panY = this._startPanY;
		this._panZ = this._startPanZ;

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

	pan: function(m, dx, dy) {
		//determining current X, Y and Z axis
		var Xvec = [1.0, 0.0, 0.0, 1.0];
		var Yvec = [0.0, 1.0, 0.0, 1.0];
		var Zvec = [0.0, 0.0, 1.0, 1.0];
		Xvec = SglMat4.mul4(SglMat4.rotationAngleAxis(this._phi, [0.0, -1.0, 0.0]), Xvec);
		Yvec = SglMat4.mul4(SglMat4.rotationAngleAxis(this._phi, [0.0, -1.0, 0.0]), Yvec);
		Zvec = SglMat4.mul4(SglMat4.rotationAngleAxis(this._phi, [0.0, -1.0, 0.0]), Zvec);
		Xvec = SglMat4.mul4(SglMat4.rotationAngleAxis(this._theta, [1.0, 0.0, 0.0]), Xvec);
		Yvec = SglMat4.mul4(SglMat4.rotationAngleAxis(this._theta, [1.0, 0.0, 0.0]), Yvec);
		Zvec = SglMat4.mul4(SglMat4.rotationAngleAxis(this._theta, [1.0, 0.0, 0.0]), Zvec);

		var panSpeed = Math.max(Math.min(1.5, this._distance),0.05);
		this._panX += ((dx * Xvec[0]) + (dy * Xvec[1])) * panSpeed;
		this._panY += ((dx * Yvec[0]) + (dy * Yvec[1])) * panSpeed;
		this._panZ += ((dx * Zvec[0]) + (dy * Zvec[1])) * panSpeed;

		//clamping
		this._panX = this._clamp(this._panX, this._minMaxPanX[0], this._minMaxPanX[1]);
		this._panY = this._clamp(this._panY, this._minMaxPanY[0], this._minMaxPanY[1]);
		this._panZ = this._clamp(this._panZ, this._minMaxPanZ[0], this._minMaxPanZ[1]);
	},

	rotate: function(m, dx, dy) {
		this._phi += dx;
		if(this._limitPhi)
			this._phi = this._clamp(this._phi, this._minMaxPhi[0], this._minMaxPhi[1]);

		// avoid eternal accumulation of rotation, just for the sake of cleanliness
		if (this._phi > 10.0) this._phi = this._phi - 10.0;
		if (this._phi < -10.0) this._phi = this._phi + 10.0;

		this._theta += dy;
		this._theta = this._clamp(this._theta, this._minMaxTheta[0], this._minMaxTheta[1]);
	},

	scale : function(m, s) {
		this._distance *= s;
		this._distance = this._clamp(this._distance, this._minMaxDist[0], this._minMaxDist[1]);
	}
};
/***********************************************************************/
