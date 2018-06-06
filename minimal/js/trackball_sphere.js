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
 * Constructs a SphereTrackball object.
 * @class Interactor which implements a full spherical trackball controller.
 */
function SphereTrackball() {
}

SphereTrackball.prototype = {

	setup : function (options) {
		options = options || {};
		var opt = sglGetDefaultObject({
			startCenter   : [ 0.0, 0.0, 0.0 ],
			startDistance : 2.0,
			minMaxDist    : [0.2, 4.0],
		}, options);

		this._action = SGL_TRACKBALL_NO_ACTION;
		this._new_action = true;
		this._matrix = SglMat4.identity();
		this._sphereMatrix = SglMat4.identity();

		// starting/default parameters
		this._startDistance = opt.startDistance; //distance

		// current parameters
		this._distance = this._startDistance;

		//limits
		this._minMaxDist  = opt.minMaxDist;

		this._pts    = [ [0.0, 0.0], [0.0, 0.0] ];
		this._start = [0.0, 0.0];
		this.reset();
	},

	clamp : function(value, low, high) {
		if(value < low) return low;
		if(value > high) return high;
		return value;
	},

	_computeMatrix: function() {
		var m = SglMat4.identity();

		// zoom
		m = SglMat4.mul(m, SglMat4.translation([0.0, 0.0, -this._distance]));
		// spheretrack
		m = SglMat4.mul(m, this._sphereMatrix);

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
		var z = this._projectOnSphere(x, y);
		return this._transform(m, x, y, z);
	},

	_translate : function(offset, f) {
		var invMat = SglMat4.inverse(this._sphereMatrix);
		var t = SglVec3.to4(offset, 0.0);
		t = SglMat4.mul4(invMat, t);
		t = SglVec4.muls(t, f);
		var trMat = SglMat4.translation(t);
		this._sphereMatrix = SglMat4.mul(this._sphereMatrix, trMat);
	},

	getState : function () {
		return this._sphereMatrix;
	},

	setState : function (newstate) {
		this._sphereMatrix = newstate;
		this._computeMatrix();
	},

	animateToState : function (newstate) {
		this._sphereMatrix = newstate;
		this._computeMatrix();
	},

	recenter : function (newpoint) {
		var newpanX = (newpoint[0]-presenter.sceneCenter[0]) * presenter.sceneRadiusInv;
		var newpanY = (newpoint[1]-presenter.sceneCenter[1]) * presenter.sceneRadiusInv;
		var newpanZ = (newpoint[2]-presenter.sceneCenter[2]) * presenter.sceneRadiusInv;

		this._sphereMatrix[12] = -newpanX;
		this._sphereMatrix[13] = -newpanY;
		this._sphereMatrix[14] = -newpanZ;
		this._distance *= 0.6;
		this._distance = this.clamp(this._distance, this._minMaxDist[0], this._minMaxDist[1]);
		this._computeMatrix();
	},

	tick : function (dt) {
		return false;
	},

	set action(a) { if(this._action != a) this._new_action = true; this._action = a; },

	get action()  { return this._action; },

	get matrix() { this._computeMatrix(); return this._matrix; },

	get distance() { return this._distance; },

	reset : function () {
		this._matrix = SglMat4.identity();
		this._sphereMatrix = SglMat4.identity();
		this._action = SGL_TRACKBALL_NO_ACTION;
		this._new_action = true;

		this._distance = this._startDistance;

		this._pts    = [ [0.0, 0.0], [0.0, 0.0] ];

		this._computeMatrix();
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

		this._pts[0][0] = this._pts[1][0] + dx;
		this._pts[0][1] = this._pts[1][1] + dy;
		this._pts[1][0] = dx;
		this._pts[1][1] = dy;

		switch (this._action) {
			case SGL_TRACKBALL_ROTATE:
				this.rotate(m);
			break;

			case SGL_TRACKBALL_PAN:
				this.pan(m);
			break;

			case SGL_TRACKBALL_DOLLY:
				this.dolly(m, z);
			break;

			case SGL_TRACKBALL_SCALE:
				this.scale(m, z);
			break;

			default:
			break;
		}
	},

	rotate : function(m) {
		if ((this._pts[0][0] == this._pts[1][0]) && (this._pts[0][1] == this._pts[1][1])) return;

		var mInv = SglMat4.inverse(m);

		var v0 = this._transformOnSphere(mInv, this._pts[0][0], this._pts[0][1]);
		var v1 = this._transformOnSphere(mInv, this._pts[1][0], this._pts[1][1]);
		var v1 = this._transformOnSphere(mInv, this._pts[1][0], this._pts[1][1]);
		var v1 = this._transformOnSphere(mInv, this._pts[1][0], this._pts[1][1]);

		var axis   = SglVec3.cross(v0, v1);
		var angle  = SglVec3.length(axis);
		var rotMat = SglMat4.rotationAngleAxis(angle, axis);

		this._sphereMatrix = SglMat4.mul(rotMat, this._sphereMatrix);
		this._computeMatrix();
	},

	pan : function(m) {
		var mInv = SglMat4.inverse(m);
		var v0 = this._transform(mInv, this._pts[0][0], this._pts[0][1], -1.0);
		var v1 = this._transform(mInv, this._pts[1][0], this._pts[1][1], -1.0);
		var offset = SglVec3.sub(v1, v0);
		this._translate(offset, 2.0);
		this._computeMatrix();
	},

	dolly : function(m, dz) {
		var mInv = SglMat4.inverse(m);
		var offset = this._transform(mInv, 0.0, 0.0, dz);
		this._translate(offset, 1.0);
		this._computeMatrix();
	},

	scale : function(m, s) {
		this._distance *= s;
		this._distance = this.clamp(this._distance, this._minMaxDist[0], this._minMaxDist[1]);
		this._computeMatrix();
	}
};
/***********************************************************************/
