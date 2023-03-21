/*
3DHOP - 3D Heritage Online Presenter
Copyright (c) 2014-2023, Visual Computing Lab, ISTI - CNR
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
 * Constructs a SphereTrackball object.
 * @class Interactor which implements a full spherical trackball controller.
 */
function SphereTrackball() {
}

SphereTrackball.prototype = {

	setup : function (options,myPresenter) {
		options = options || {};
		var opt = sglGetDefaultObject({
			startCenter   : [ 0.0, 0.0, 0.0 ],
			startMatrix   : [ 1.0, 0.0, 0.0, 0.0, 0.0, 1.0, 0.0, 0.0, 0.0, 0.0, 1.0, 0.0, 0.0, 0.0, 0.0, 1.0 ],
			startPanX     : 0.0,
			startPanY     : 0.0,
			startPanZ     : 0.0,
			startDistance : 2.0,
			minMaxDist    : [0.2, 4.0],
			minMaxPanX    : [-1.0, 1.0],
			minMaxPanY    : [-1.0, 1.0],
			minMaxPanZ    : [-1.0, 1.0]
		}, options);

		this._action = SGL_TRACKBALL_NO_ACTION;
		this._new_action = true;
		this._matrix = SglMat4.identity();

		this.myPresenter = myPresenter;// parent presenter

		// trackball center
		this._center = opt.startCenter;
		
		// starting/default parameters
		this._startMatrix = opt.startMatrix; //matrix
		this._startPanX = opt.startPanX; //panX
		this._startPanY = opt.startPanY; //panY
		this._startPanZ = opt.startPanZ; //panZ
		this._startDistance = opt.startDistance; //distance
		
		// current parameters
		this._rotMatrix = this._startMatrix;
		this._panX = this._startPanX;
		this._panY = this._startPanY;
		this._panZ = this._startPanZ;
		this._distance = this._startDistance;

		//limits
		this._minMaxDist  = opt.minMaxDist;
		this._minMaxPanX  = opt.minMaxPanX;
		this._minMaxPanY  = opt.minMaxPanY;
		this._minMaxPanZ  = opt.minMaxPanZ;
	
		// target paramenters
		this._quatBegin = [0,0,0,1];
		this._quatEnd = [0,0,0,1];
		this._animationStage = 0.0;
		this._targetPanX = this._startPanX;
		this._targetPanY = this._startPanY;
		this._targetPanZ = this._startPanZ;
		this._targetDistance = this._startDistance;
	
		//animation data
		this._isAnimating = false;
		this._speedRot = Math.PI;
		this._speedPanX = 1.0;
		this._speedPanY = 1.0;
		this._speedPanZ = 1.0;
		this._speedDistance = 2.0;
		
		this._pts    = [ [0.0, 0.0], [0.0, 0.0] ];
		this._past = [0.0, 0.0];
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
		// 3-axis rotation
		m = SglMat4.mul(m, this._rotMatrix);
		// panning
		m = SglMat4.mul(m, SglMat4.translation([-this._panX, -this._panY, -this._panZ]));

		this._matrix = m;
	  
		if(typeof onTrackballUpdate != "undefined")
			onTrackballUpdate(this.getState());
	},

	_projectOnSphere : function(x, y) {
		var r = 1.0;
		var z = 0.0;
		var d = sglSqrt(x*x + y*y);

		if (d < (r * 0.70710678118654752440)) {
			/* Inside sphere */
			z = sglSqrt(r*r - d*d);
		}
		else {
			/* On hyperbola */
			t = r / 1.41421356237309504880;
			z = t*t / d;
		}
		return z;
	},

	_transform : function(m, x, y, z) {
		return SglMat4.mul4(m, [x, y, z, 0.0]);
	},

	_transformOnSphere : function(m, x, y) {
		var z = this._projectOnSphere(x, y); //get z value
		return this._transform(m, x, y, z);
	},

	_translate : function(offset, f) {
		var invMat = SglMat4.inverse(this._rotMatrix);
		var t = SglVec3.to4(offset, 0.0);
		t = SglMat4.mul4(invMat, t);
		t = SglVec4.muls(t, f);
		var trMat = SglMat4.translation(t);
		this._rotMatrix = SglMat4.mul(this._rotMatrix, trMat);
	},

	getState : function () {
		return [this._rotMatrix, this._panX, this._panY, this._panZ, this._distance];
	},

	setState : function (newstate) {
		this._rotMatrix = newstate[0];
		this._panX = this._clamp(newstate[1], this._minMaxPanX[0], this._minMaxPanX[1]);
		this._panY = this._clamp(newstate[2], this._minMaxPanY[0], this._minMaxPanY[1]);
		this._panZ = this._clamp(newstate[3], this._minMaxPanZ[0], this._minMaxPanZ[1]);
		this._distance = this._clamp(newstate[4], this._minMaxDist[0], this._minMaxDist[1]);
		this._computeMatrix();
	},

	animateToState : function (newstate, newtime) {
		this._isAnimating = false;	// stop animation
		
		//setup
		this._quatBegin = SglQuat.from44(this._rotMatrix);
		this._quatEnd = SglQuat.from44(newstate[0]);
		this._targetPanX = this._clamp(newstate[1], this._minMaxPanX[0], this._minMaxPanX[1]);
		this._targetPanY = this._clamp(newstate[2], this._minMaxPanY[0], this._minMaxPanY[1]);
		this._targetPanZ = this._clamp(newstate[3], this._minMaxPanZ[0], this._minMaxPanZ[1]);
		this._targetDistance = this._clamp(newstate[4], this._minMaxDist[0], this._minMaxDist[1]);
		
		// setting base velocities
		this._speedRot = Math.PI;
		this._speedPanX = 1.0;
		this._speedPanY = 1.0;
		this._speedPanZ = 1.0;
		this._speedDistance = 2.0;
		
		let timeAngle    = Math.abs(sglDegToRad(this._angle(this._quatBegin,this._quatEnd)) / this._speedRot);
		let timeDistance = Math.abs((this._targetDistance - this._distance) / this._speedDistance);
		let timePanX     = Math.abs((this._targetPanX - this._panX) / this._speedPanX);
		let timePanY     = Math.abs((this._targetPanY - this._panY) / this._speedPanY);
		let timePanZ     = Math.abs((this._targetPanZ - this._panZ) / this._speedPanZ);
		
		let animationtime = 1.0;
		if(newtime) 
			animationtime = newtime;
		else {
			let maxtime = Math.max( timeAngle, Math.max( timeDistance, Math.max( timePanX, Math.max( timePanY, timePanZ ))));
			animationtime = this._clamp(maxtime, 0.5, 2.0);	
		}
		
		this._speedRot     = 1.0 / animationtime;
		this._speedDistance *= timeDistance / animationtime;
		this._speedPanX     *= timePanX / animationtime;
		this._speedPanY     *= timePanY / animationtime;
		this._speedPanZ     *= timePanZ / animationtime;
		
		//start
		this._animationStage = 0.0;
		this._isAnimating = true;
	},

	recenter : function (newpoint) {
		this._isAnimating = false;	// stop animation
		
		var newpanX = (newpoint[0]-this.myPresenter.sceneCenter[0]) * this.myPresenter.sceneRadiusInv;
		var newpanY = (newpoint[1]-this.myPresenter.sceneCenter[1]) * this.myPresenter.sceneRadiusInv;
		var newpanZ = (newpoint[2]-this.myPresenter.sceneCenter[2]) * this.myPresenter.sceneRadiusInv;

		this.animateToState([this._rotMatrix, newpanX, newpanY, newpanZ, (this._distance * 0.6)]);
	},

	tick : function (dt) {
		if(!this._isAnimating) return false;
		
		var deltaRot      = this._speedRot * dt;
		var deltaDistance = this._speedDistance * dt;
		var deltaPanX     = this._speedPanX * dt;
		var deltaPanY     = this._speedPanY * dt;
		var deltaPanZ     = this._speedPanZ * dt;
		
		var diffDistance = this._targetDistance - this._distance;
		var diffPanX     = this._targetPanX - this._panX;
		var diffPanY     = this._targetPanY - this._panY;
		var diffPanZ     = this._targetPanZ - this._panZ;
	
		this._animationStage += deltaRot;
		let quatNow = this._slerp(this._quatBegin, this._quatEnd, this._animationStage);
		this._rotMatrix = SglQuat.to44(quatNow);
	
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
		
		if(this._distance == this._targetDistance)
			if(this._panX == this._targetPanX)
				if(this._panY == this._targetPanY)
					if(this._panZ == this._targetPanZ)
						if(this._animationStage >= 1.0) {
							this._isAnimating = false;
							if(typeof onTrackballArrived != "undefined")
								onTrackballArrived(this.getState());
						}

		this._computeMatrix();
		return true;
	},

	_angle : function (qa, qb) {
		let cosHalfTheta = qa[3] * qb[3] + qa[0] * qb[0] + qa[1] * qb[1] + qa[2] * qb[2];
		if (Math.abs(cosHalfTheta) >= 1.0) return 0.0;
		return sglRadToDeg(2.0 * Math.acos(cosHalfTheta));
	},

	_slerp : function(qa, qb, value) {
		if (value<=0.0) return qa;
		if (value>=1.0) return qb;
		
		let qm = [0.0,0.0,0.0,1.0];
		let cosHalfTheta = qa[3] * qb[3] + qa[0] * qb[0] + qa[1] * qb[1] + qa[2] * qb[2];
		if (Math.abs(cosHalfTheta) >= 1.0){
			return qa;
		}
		
		let halfTheta = Math.acos(cosHalfTheta);
		let sinHalfTheta = Math.sqrt(1.0 - cosHalfTheta*cosHalfTheta);
		if (Math.abs(sinHalfTheta) < 0.001){
			qm[3] = (qa[3] * 0.5 + qb[3] * 0.5);
			qm[0] = (qa[0] * 0.5 + qb[0] * 0.5);
			qm[1] = (qa[1] * 0.5 + qb[1] * 0.5);
			qm[2] = (qa[2] * 0.5 + qb[2] * 0.5);
			return qm;
		}

		let ratioA = Math.sin((1 - value) * halfTheta) / sinHalfTheta;
		let ratioB = Math.sin(value * halfTheta) / sinHalfTheta; 
	
		qm[3] = (qa[3] * ratioA + qb[3] * ratioB);
		qm[0] = (qa[0] * ratioA + qb[0] * ratioB);
		qm[1] = (qa[1] * ratioA + qb[1] * ratioB);
		qm[2] = (qa[2] * ratioA + qb[2] * ratioB);
		return qm;
	},

	set action(a) { if(this._action != a) this._new_action = true; this._action = a;},

	get action()  { return this._action; },

	get matrix() { this._computeMatrix(); return this._matrix; },

	get distance() { return this._distance; },

	reset : function () {
		this._matrix = SglMat4.identity();
		this._action = SGL_TRACKBALL_NO_ACTION;
		this._new_action = true;
		this._pts = [ [0.0, 0.0], [0.0, 0.0] ];
		
		this._rotMatrix = this._startMatrix;
		this._panX = this._startPanX;
		this._panY = this._startPanY;
		this._panZ = this._startPanZ;
		this._distance = this._startDistance;

		this._isAnimating = false;

		this._computeMatrix();
	},

	track : function(m, x, y, z) {
		this._isAnimating = false; //stopping animation
		if(this._new_action) {
			this._past[0] = this.myPresenter.x;
			this._past[1] = this.myPresenter.y;
			this._new_action = false;
		}
		
		this._pts[0][0] = this._past[0];
		this._pts[0][1] = this._past[1];
		this._pts[1][0] = this.myPresenter.x;
		this._pts[1][1] = this.myPresenter.y;

		this._past[0] = this.myPresenter.x;
		this._past[1] = this.myPresenter.y;

		switch (this._action) {
			case SGL_TRACKBALL_ROTATE:
				this.rotate(m);
			break;

			case SGL_TRACKBALL_PAN:
				this.pan(m);
			break;

			case SGL_TRACKBALL_SCALE:
				this.scale(m, z);
			break;

			default:
			break;
		}
	},

	rotate : function(m) {
		if ((this._pts[0][0] == this._pts[1][0]) && (this._pts[0][1] == this._pts[1][1])) return; //if Xold == Xnew && Yold ==Ynew return

		var mInv = SglMat4.inverse(m);

		var v0 = this._transformOnSphere(mInv, this._pts[0][0], this._pts[0][1]); //project on sphere (Xold, Yold)
		var v1 = this._transformOnSphere(mInv, this._pts[1][0], this._pts[1][1]); //project on sphere (Xnew, Ynew)

		var axis   = SglVec3.cross(v0, v1); //axis of rotation
		var angle  = SglVec3.length(axis); //angle of rotation
		var rotMat = SglMat4.rotationAngleAxis(angle, axis);

		this._rotMatrix = SglMat4.mul(rotMat, this._rotMatrix);
		this._computeMatrix();
	},

	pan : function(m) {
		var dx = this._pts[0][0] - this._pts[1][0];
		var dy = this._pts[0][1] - this._pts[1][1];
		
		//determining current X, Y and Z axis
		var Xvec = SglMat4.mul4(this._rotMatrix, [1.0, 0.0, 0.0, 1.0]);
		var Yvec = SglMat4.mul4(this._rotMatrix, [0.0, 1.0, 0.0, 1.0]);
		var Zvec = SglMat4.mul4(this._rotMatrix, [0.0, 0.0, 1.0, 1.0]);

		var panSpeed = Math.max(Math.min(1.5, this._distance),0.05);
		this._panX += ((dx * Xvec[0]) + (dy * Xvec[1])) * panSpeed;
		this._panY += ((dx * Yvec[0]) + (dy * Yvec[1])) * panSpeed;
		this._panZ += ((dx * Zvec[0]) + (dy * Zvec[1])) * panSpeed;

		//clamping
		this._panX = this._clamp(this._panX, this._minMaxPanX[0], this._minMaxPanX[1]);
		this._panY = this._clamp(this._panY, this._minMaxPanY[0], this._minMaxPanY[1]);
		this._panZ = this._clamp(this._panZ, this._minMaxPanZ[0], this._minMaxPanZ[1]);

		this._computeMatrix();
	},

	scale : function(m, s) {
		this._distance *= s;
		this._distance = this._clamp(this._distance, this._minMaxDist[0], this._minMaxDist[1]);
		this._computeMatrix();
	}
};
/***********************************************************************/
