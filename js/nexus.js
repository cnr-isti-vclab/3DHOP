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

var Nexus = { };

Nexus.LITTLE_ENDIAN_DATA = true;
Nexus.PADDING            = 256;

Nexus.Debug = { };
Nexus.Debug.tag = 0;
Nexus.Debug.flags = new Array(10);
for (var i=0; i<Nexus.Debug.flags.length; ++i) {
	Nexus.Debug.flags[i] = false;
}

Nexus.Attribute = function () {
	this.size       = 0;
	this.type       = Nexus.Attribute.NONE;
	this.glType     = Nexus.Attribute._typeGLMap[this.type];
	this.normalized = Nexus.Attribute._typeNormalized[this.type];
	this.stride     = 0;
	this.offset     = 0;
};

Nexus.Attribute.NONE           = 0;
Nexus.Attribute.BYTE           = 1;
Nexus.Attribute.UNSIGNED_BYTE  = 2;
Nexus.Attribute.SHORT          = 3;
Nexus.Attribute.UNSIGNED_SHORT = 4;
Nexus.Attribute.INT            = 5;
Nexus.Attribute.UNSIGNED_INT   = 6;
Nexus.Attribute.FLOAT          = 7;
Nexus.Attribute.DOUBLE         = 8;

Nexus.Attribute._typeSizeMap = { };
Nexus.Attribute._typeSizeMap[Nexus.Attribute.NONE          ] = 0;
Nexus.Attribute._typeSizeMap[Nexus.Attribute.BYTE          ] = 1;
Nexus.Attribute._typeSizeMap[Nexus.Attribute.UNSIGNED_BYTE ] = 1;
Nexus.Attribute._typeSizeMap[Nexus.Attribute.SHORT         ] = 2;
Nexus.Attribute._typeSizeMap[Nexus.Attribute.UNSIGNED_SHORT] = 2;
Nexus.Attribute._typeSizeMap[Nexus.Attribute.INT           ] = 4;
Nexus.Attribute._typeSizeMap[Nexus.Attribute.UNSIGNED_INT  ] = 4;
Nexus.Attribute._typeSizeMap[Nexus.Attribute.FLOAT         ] = 4;
Nexus.Attribute._typeSizeMap[Nexus.Attribute.DOUBLE        ] = 8;

Nexus.Attribute._typeGLMap = { };
Nexus.Attribute._typeGLMap[Nexus.Attribute.NONE          ] = WebGLRenderingContext.NONE;
Nexus.Attribute._typeGLMap[Nexus.Attribute.BYTE          ] = WebGLRenderingContext.BYTE;
Nexus.Attribute._typeGLMap[Nexus.Attribute.UNSIGNED_BYTE ] = WebGLRenderingContext.UNSIGNED_BYTE;
Nexus.Attribute._typeGLMap[Nexus.Attribute.SHORT         ] = WebGLRenderingContext.SHORT;
Nexus.Attribute._typeGLMap[Nexus.Attribute.UNSIGNED_SHORT] = WebGLRenderingContext.UNSIGNED_SHORT;
Nexus.Attribute._typeGLMap[Nexus.Attribute.INT           ] = WebGLRenderingContext.INT;
Nexus.Attribute._typeGLMap[Nexus.Attribute.UNSIGNED_INT  ] = WebGLRenderingContext.UNSIGNED_INT;
Nexus.Attribute._typeGLMap[Nexus.Attribute.FLOAT         ] = WebGLRenderingContext.FLOAT;
Nexus.Attribute._typeGLMap[Nexus.Attribute.DOUBLE        ] = WebGLRenderingContext.DOUBLE;

Nexus.Attribute._typeNormalized = { };
Nexus.Attribute._typeNormalized[Nexus.Attribute.NONE          ] = true;
Nexus.Attribute._typeNormalized[Nexus.Attribute.BYTE          ] = true;
Nexus.Attribute._typeNormalized[Nexus.Attribute.UNSIGNED_BYTE ] = true;
Nexus.Attribute._typeNormalized[Nexus.Attribute.SHORT         ] = true;
Nexus.Attribute._typeNormalized[Nexus.Attribute.UNSIGNED_SHORT] = true;
Nexus.Attribute._typeNormalized[Nexus.Attribute.INT           ] = true;
Nexus.Attribute._typeNormalized[Nexus.Attribute.UNSIGNED_INT  ] = true;
Nexus.Attribute._typeNormalized[Nexus.Attribute.FLOAT         ] = false;
Nexus.Attribute._typeNormalized[Nexus.Attribute.DOUBLE        ] = false;

Nexus.Attribute.prototype = {
	get isNull() {
		return (this.type == Nexus.Attribute.NONE);
	},

	get byteLength() {
		return (Nexus.Attribute._typeSizeMap[this.type] * this.size);
	},

	import : function (view, offset, littleEndian) {
		var s = 0;
		this.type = view.getUint8(offset + s, littleEndian); s += Uint8Array.BYTES_PER_ELEMENT;
		this.size = view.getUint8(offset + s, littleEndian); s += Uint8Array.BYTES_PER_ELEMENT;

		this.glType     = Nexus.Attribute._typeGLMap[this.type];
		this.normalized = Nexus.Attribute._typeNormalized[this.type];
		this.stride     = Nexus.Attribute._typeSizeMap[this.type] * this.size;
		this.offset     = 0;

		return s;
	}
};

Nexus.Attribute.SIZEOF = 2 * Uint8Array.BYTES_PER_ELEMENT;

Nexus.Element = function () {
	this.attributes = new Array(8);
	for (var i=0; i<8; ++i) {
		this.attributes[i] = new Nexus.Attribute();
	}
	this.lastAttribute = -1;
};

Nexus.Element.prototype = {
	get byteLength() {
		var s = 0;
		for (var i=0; i<this.attributes.length; ++i) {
			s += this.attributes[i].byteLength;
		}
		return s;
	},

	import : function (view, offset, littleEndian) {
		var s = 0;
		for (var i=0; i<this.attributes.length; ++i) {
			var attrib = this.attributes[i];
			s += attrib.import(view, offset + s, littleEndian);

			if (!attrib.isNull) {
				this.lastAttribute = i;
			}
		}
		return s;
	}
};

Nexus.Element.SIZEOF = 8 * Nexus.Attribute.SIZEOF;

Nexus.VertexElement = function () {
	Nexus.Element.call(this);
};

Nexus.VertexElement.SIZEOF = Nexus.Element.SIZEOF;

Nexus.VertexElement.POSITION = 0;
Nexus.VertexElement.NORMAL   = 1;
Nexus.VertexElement.COLOR    = 2;
Nexus.VertexElement.TEXCOORD = 3;
Nexus.VertexElement.DATA0    = 4;

Nexus.VertexElement.prototype = {
	get hasPosition () { return !this.attributes[Nexus.VertexElement.POSITION].isNull; },
	get hasNormal   () { return !this.attributes[Nexus.VertexElement.NORMAL  ].isNull; },
	get hasColor    () { return !this.attributes[Nexus.VertexElement.COLOR   ].isNull; },
	get hasTexCoord () { return !this.attributes[Nexus.VertexElement.TEXCOORD].isNull; },

	hasData : function (i) { return !this.attributes[Nexus.VertexElement.DATA0 + i].isNull; },

	import : function (view, offset, littleEndian) {
		var r = Nexus.Element.prototype.import.apply(this, arguments);
		var color = this.attributes[Nexus.VertexElement.COLOR];
		if (!color.isNull) {
			if (color.type == Nexus.Attribute.BYTE) {
				color.type   = Nexus.Attribute.UNSIGNED_BYTE;
				color.glType = Nexus.Attribute._typeGLMap[color.type];
			}
		}
		return r;
	}
};

sglExtend(Nexus.VertexElement, Nexus.Element);

Nexus.FaceElement = function () {
	Nexus.Element.call(this);
};

Nexus.FaceElement.SIZEOF = Nexus.Element.SIZEOF;

Nexus.FaceElement.INDEX    = 0;
Nexus.FaceElement.NORMAL   = 1;
Nexus.FaceElement.COLOR    = 2;
Nexus.FaceElement.TEXCOORD = 3;
Nexus.FaceElement.DATA0    = 4;

Nexus.FaceElement.prototype = {
	get hasIndex    () { return !this.attributes[Nexus.FaceElement.INDEX   ].isNull; },
	get hasNormal   () { return !this.attributes[Nexus.FaceElement.NORMAL  ].isNull; },
	get hasColor    () { return !this.attributes[Nexus.FaceElement.COLOR   ].isNull; },
	get hasTexCoord () { return !this.attributes[Nexus.FaceElement.TEXCOORD].isNull; },

	hasData : function (i) { return !this.attributes[Nexus.FaceElement.DATA0 + i].isNull; },

	import : function (view, offset, littleEndian) {
		var r = Nexus.Element.prototype.import.apply(this, arguments);
		var color = this.attributes[Nexus.FaceElement.COLOR];
		if (!color.isNull) {
			if (color.type == Nexus.Attribute.BYTE) {
				color.type   = Nexus.Attribute.UNSIGNED_BYTE;
				color.glType = Nexus.Attribute._typeGLMap[color.type];
			}
		}
		return r;
	}
};

sglExtend(Nexus.FaceElement, Nexus.Element);

Nexus.Signature = function () {
	this.vertex = new Nexus.VertexElement();
	this.face   = new Nexus.FaceElement();
	this.flags  = Nexus.Signature.UNCOMPRESSED;
};

Nexus.Signature.SIZEOF = Nexus.VertexElement.SIZEOF + Nexus.FaceElement.SIZEOF + Uint32Array.BYTES_PER_ELEMENT;

Nexus.Signature.PTEXTURE = (1 << 0);
Nexus.Signature.MECO     = (1 << 1);
Nexus.Signature.CTM1     = (1 << 2);
Nexus.Signature.CTM2     = (1 << 3);

Nexus.Signature.prototype = {
	import : function (view, offset, littleEndian) {
		var s = 0;
		s += this.vertex.import(view, offset + s, littleEndian);
		s += this.face.import(view, offset + s, littleEndian);
		this.flags = view.getUint32(offset + s, littleEndian); s += Uint32Array.BYTES_PER_ELEMENT;
		return s;
	}
};

Nexus.Sphere3f = function () {
	this.center = [0.0, 0.0, 0.0];
	this.radius = 1.0;
};

Nexus.Sphere3f.SIZEOF = 4 * Float32Array.BYTES_PER_ELEMENT;

Nexus.Sphere3f.prototype = {
	import : function (view, offset, littleEndian) {
		var s = 0;
		for (var i=0; i<3; ++i) {
			this.center[i] = view.getFloat32(offset + s, littleEndian);
			s += Float32Array.BYTES_PER_ELEMENT;
		}
		this.radius = view.getFloat32(offset + s, littleEndian); s += Float32Array.BYTES_PER_ELEMENT;
		return s;
	}
};

Nexus.Header = function () {
	this.reset();
};

Nexus.Header.SIZEOF = 5 * Uint32Array.BYTES_PER_ELEMENT + 2 * 2 * Uint32Array.BYTES_PER_ELEMENT + Nexus.Signature.SIZEOF + Nexus.Sphere3f.SIZEOF;
Nexus.Header.MAGIC  = 0x4E787320;

Nexus.Header.prototype = {
	_getUint64 : function (view, offset, littleEndian) {
		var s = 0;
		var lo = view.getUint32(offset + s, littleEndian); s += Uint32Array.BYTES_PER_ELEMENT;
		var hi = view.getUint32(offset + s, littleEndian); s += Uint32Array.BYTES_PER_ELEMENT;
		return ((hi * (1 << 32)) + lo);
	},

	get isValid() {
		return (this.version > 0);
	},

	reset : function () {
		this.magic         = 0;
		this.version       = 0;
		this.verticesCount = 0;
		this.facesCount    = 0;
		this.signature     = new Nexus.Signature();
		this.nodesCount    = 0;
		this.patchesCount  = 0;
		this.texturesCount = 0;
		this.sphere        = new Nexus.Sphere3f();
	},

	import : function (view, offset, littleEndian) {
		this.reset();

		var s = 0;

		this.magic          = view.getUint32(offset + s, littleEndian);               s += Uint32Array.BYTES_PER_ELEMENT;
		if (this.magic != Nexus.Header.MAGIC) return 0;

		this.version        = view.getUint32(offset + s, littleEndian);               s += Uint32Array.BYTES_PER_ELEMENT;
		this.verticesCount  = this._getUint64(view, offset + s, littleEndian);        s += Uint32Array.BYTES_PER_ELEMENT * 2;
		this.facesCount     = this._getUint64(view, offset + s, littleEndian);        s += Uint32Array.BYTES_PER_ELEMENT * 2;
		s                  += this.signature.import(view, offset + s, littleEndian);
		this.nodesCount     = view.getUint32(offset + s, littleEndian);               s += Uint32Array.BYTES_PER_ELEMENT;
		this.patchesCount   = view.getUint32(offset + s, littleEndian);               s += Uint32Array.BYTES_PER_ELEMENT;
		this.texturesCount  = view.getUint32(offset + s, littleEndian);               s += Uint32Array.BYTES_PER_ELEMENT;
		s                  += this.sphere.import(view, offset + s, littleEndian);

		return s;
	}
};

Nexus.Cone3s = function () {
	this.n = [0, 0, 0, 0];
};

Nexus.Cone3s.SIZEOF = 4 * Uint16Array.BYTES_PER_ELEMENT;

Nexus.Cone3s.prototype = {
	backFace : function (sphere, view) {
		var n = this.n;

		var norm = [n[0] / 32766.0, n[1] / 32766.0, n[2] / 32766.0];
		var d = [0.0, 0.0, 0.0];
		var f = 0.0;
		var dd = 0.0;

		for (var i=0; i<3; ++i) {
			d[i] = (sphere.center[i] - norm[i] * sphere.radius) - view[i];
			norm[i] *= n[3] / 32766.0;
			f += d[i] * norm[i];
			dd = d[i] * d[i];
		}

		return !((f < 0.001) || ((f * f) < dd));
	},

	frontFace : function (sphere, view) {
		var n = this.n;

		var norm = [n[0] / 32766.0, n[1] / 32766.0, n[2] / 32766.0];
		var d = [0.0, 0.0, 0.0];
		var f = 0.0;
		var dd = 0.0;

		for (var i=0; i<3; ++i) {
			d[i] = (sphere.center[i] + norm[i] * sphere.radius) - view[i];
			norm[i] *= n[3] / 32766.0;
			f += -d[i] * norm[i];
			dd = d[i] * d[i];
		}

		return !((f < 0.001) || ((f * f) < dd));
	},

	import : function (view, offset, littleEndian) {
		var s = 0;
		for (var i=0; i<4; ++i) {
			this.n[i] = view.getInt16(offset + s, littleEndian);
			s += Uint16Array.BYTES_PER_ELEMENT;
		}
		return s;
	}
};

Nexus.Node = function() {
	this.offset        = 0;
	this.verticesCount = 0;
	this.facesCount    = 0;
	this.error         = 0.0;
	this.cone          = new Nexus.Cone3s();
	this.sphere        = new Nexus.Sphere3f();
	this.tightRadius   = 0.0;
	this.firstPatch    = 0;

	// computed
	this.lastPatch     = 0;
	this.lastByte      = 0;
};

Nexus.Node.SIZEOF = 2 * Uint32Array.BYTES_PER_ELEMENT + 2 * Uint16Array.BYTES_PER_ELEMENT + 2 * Float32Array.BYTES_PER_ELEMENT + Nexus.Sphere3f.SIZEOF + Nexus.Cone3s.SIZEOF;

Nexus.Node.prototype = {
	get isEmpty() {
		return (this.end == this.outBegin);
	},

	import : function (view, offset, littleEndian) {
		var s = 0;
		this.offset         = Nexus.PADDING * view.getUint32(offset + s, littleEndian);  s += Uint32Array.BYTES_PER_ELEMENT;
		this.verticesCount  = view.getUint16(offset + s, littleEndian);  s += Uint16Array.BYTES_PER_ELEMENT;
		this.facesCount     = view.getUint16(offset + s, littleEndian);  s += Uint16Array.BYTES_PER_ELEMENT;
		this.error          = view.getFloat32(offset + s, littleEndian); s += Float32Array.BYTES_PER_ELEMENT;
		s                  += this.cone.import(view, offset + s, littleEndian);
		s                  += this.sphere.import(view, offset + s, littleEndian);
		this.tightRadius    = view.getFloat32(offset + s, littleEndian); s += Float32Array.BYTES_PER_ELEMENT;
		this.firstPatch     = view.getUint32(offset + s, littleEndian);  s += Uint32Array.BYTES_PER_ELEMENT;
		return s;
	}
};

Nexus.NodeIndex = function() {
	this.items = [ ];
};

Nexus.NodeIndex.prototype = {
	get length() {
		return this.items.length;
	},

	get sink() {
		return (this.items.length - 1);
	},

	import : function (nodesCount, view, offset, littleEndian) {
		this.items = new Array(nodesCount);
		var s = 0;
		for (var i=0; i<nodesCount; ++i) {
			var node = new Nexus.Node();
			s += node.import(view, offset + s, littleEndian);
			this.items[i] = node;
		}
		for (var i=0; i<(nodesCount-1); ++i) {
			var currNode = this.items[i];
			var nextNode = this.items[i+1];
			currNode.lastPatch = nextNode.firstPatch;
			currNode.lastByte  = nextNode.offset - 1;
		}
		return s;
	}
};

Nexus.Patch = function() {
	this.node         = 0;
	this.lastTriangle = 0;
	this.texture      = 0;
};

Nexus.Patch.SIZEOF = 3 * Uint32Array.BYTES_PER_ELEMENT;

Nexus.Patch.prototype = {
	import : function (view, offset, littleEndian) {
		var s = 0;
		this.node           = view.getUint32(offset + s, littleEndian); s += Uint32Array.BYTES_PER_ELEMENT;
		this.lastTriangle = view.getUint32(offset + s, littleEndian); s += Uint32Array.BYTES_PER_ELEMENT;
		this.texture        = view.getUint32(offset + s, littleEndian); s += Uint32Array.BYTES_PER_ELEMENT;
		return s;
	}
};

Nexus.PatchIndex = function() {
	this.items = [ ];
};

Nexus.PatchIndex.prototype = {
	get length() {
		return this.items.length;
	},

	import : function (patchesCount, view, offset, littleEndian) {
		this.items = new Array(patchesCount);
		var s = 0;
		for (var i=0; i<patchesCount; ++i) {
			var patch = new Nexus.Patch();
			s += patch.import(view, offset + s, littleEndian);
			this.items[i] = patch;
		}
		return s;
	}
};

Nexus.Texture = function() {
	this.offset   = 0;
	this.matrix   = new Array(16);

	// computed
	this.lastByte = 0;
};

Nexus.Texture.SIZEOF = 1 * Uint32Array.BYTES_PER_ELEMENT + 16 * Float32Array.BYTES_PER_ELEMENT;

Nexus.Texture.prototype = {
	import : function (view, offset, littleEndian) {
		var s = 0;
		this.offset = view.getUint32(offset + s, littleEndian); s += Uint32Array.BYTES_PER_ELEMENT;
		for (var i=0; i<16; ++i) {
			this.matrix[i] = view.getFloat32(offset + s, littleEndian); s += Float32Array.BYTES_PER_ELEMENT;
		}
		return s;
	}
};

Nexus.TextureIndex = function() {
	this.items = [ ];
};

Nexus.TextureIndex.prototype = {
	get length() {
		return this.items.length;
	},

	import : function (texturesCount, view, offset, littleEndian) {
		this.items = new Array(texturesCount);
		var s = 0;
		for (var i=0; i<texturesCount; ++i) {
			var texture = new Nexus.Texture();
			s += texture.import(view, offset + s, littleEndian);
			this.items[i] = texture;
		}
		for (var i=0; i<(texturesCount-1); ++i) {
			var currTex = this.items[i];
			var nextTex = this.items[i+1];
			currTex.lastByte = nextTex.offset - 1;
		}
		return s;
	}
};

Nexus.BoolArray = function (size) {
	this._size   = size;
	this._buffer = new Uint8Array(this._size);
};

Nexus.BoolArray.prototype = {
	get size() {
		return this._size;
	},

	resetAll : function () {
		this._buffer = new Uint8Array(this._size);
	},

	set : function (i) {
		this._buffer[i] = 1;
	},

	reset : function (i) {
		this._buffer[i] = 0;
	},

	test : function (i) {
		return (this._buffer[i] != 0);
	}
};

Nexus.PriorityQueue = function (compareFunction) {
	this._array   = [ ];
	this._cmpFunc = compareFunction;
};

Nexus.PriorityQueue.prototype = {
	_insert : function (x, a, b) {
		var cmp = this._cmpFunc;
		var arr = this._array;
		var a = 0;
		var b = arr.length - 1;
		var y, h;

		while (a < b) {
			h = sglFloor((a + b) / 2);
			y = arr[h];
			if (cmp(x, y) > 0) { // --> x > y
				a = h + 1;
			}
			else {
				b = h - 1;
			}
		}
		y = arr[a];
		if (cmp(x, y) > 0) { // --> x > y
			a++;
		}
		arr.splice(a, 0, x);
	},

	get length() {
		return this._array.length;
	},

	get isEmpty() {
		return (this._array.length <= 0);
	},

	push : function (x) {
		var len = this._array.length;
		if (len <= 0) {
			this._array.push(x);
		}
		else {
			this._insert(x, 0, len - 1);
		}
	},

	pop : function () {
		if (this._size <= 0) return;
		return this._array.pop();
	}
};

Nexus.Plane3f = function (p0, p1, p2) {
	this._normal = SglVec3.normalize(SglVec3.cross(SglVec3.sub(p1, p0), SglVec3.sub(p2, p0)));
	this._offset = SglVec3.dot(p0, this._normal);
};

Nexus.Plane3f.prototype = {
	get normal() {
		return this._normal.slice();
	},

	get offset() {
		return this._offset;
	},

	signedDistanceToPoint : function (p) {
		return (SglVec3.dot(this._normal, p) - this._offset);
	}
};

Nexus.Renderer = function (gl) {
	this._gl = gl;

	this._targetError        = Nexus.Renderer.DEFAULT_TARGET_ERROR;
	this._maxPendingRequests = Nexus.Renderer.DEFAULT_MAX_PENDING_REQUESTS;
	this._maxCacheSize       = Nexus.Renderer.DEFAULT_CACHE_SIZE;
	this._onUpdate           = null;
	this._onSceneReady       = null;

	this._mmat = SglMat4.identity();
	this._vmat = SglMat4.identity();
	this._pmat = SglMat4.identity();
	this._vp   = [ 0.0, 0.0, 1.0, 1.0 ];

	this._reset();

	this._updateView();
};

Nexus.Renderer.STATUS_NONE    = 0;
Nexus.Renderer.STATUS_OPENING = 1;
Nexus.Renderer.STATUS_OPEN    = 2;

Nexus.Renderer.DEFAULT_TARGET_ERROR         = 3.0;
Nexus.Renderer.DEFAULT_MAX_PENDING_REQUESTS = 3;
Nexus.Renderer.DEFAULT_CACHE_SIZE           = 228 * 1024 * 1024;3

Nexus.Renderer._NODE_NONE    = 0;
Nexus.Renderer._NODE_PENDING = 1;
Nexus.Renderer._NODE_READY   = 2;

Nexus.Renderer._sortPatchesFunction = function (a, b) {
	return ((a.frame != b.frame) ? (b.frame - a.frame) : (b.error - a.error));
};

Nexus.Renderer._sortNodesFunction = function (a, b) {
	return a.node.renderError - b.node.renderError;
};

Nexus.Renderer._sortNodeCacheFunction = function (a, b) {
	return ((a.renderFrame != b.renderFrame) ? (b.renderFrame - a.renderFrame) : (b.renderError - a.renderError));
    //return b.renderError - a.renderError;
};


Nexus.Renderer.prototype = {
	_reset : function () {
		this._status  = Nexus.Renderer.STATUS_NONE;

		this._inBegin = false;

		this._url     = null;

		this._header   = null;
		this._nodes    = null;
		this._patches  = null;
		this._textures = null;

		this._visitedNodes    = null;
		this._blockedNodes    = null;
		this._selectedNodes   = null;
		this._cacheSize       = 0;
		this._cachedNodes     = null;
		this._readyNodes      = null;
		this._frame           = 0;

		this._pendingRequests = 0;
		this._candidateNodes  = null;
	},

	_requestHeader : function () {
		var offset = 0;
		var size   = Nexus.Header.SIZEOF;

		var that = this;
		var r = new SglBinaryRequest(this._url, {
			range : [offset, offset+size-1],
			onSuccess : function () {
				that._handleHeader(r.buffer);
				that._requestIndex();
			}
		});
	},

	_handleHeader : function (buffer) {
		var view         = new DataView(buffer);
		var offset       = 0;
		var littleEndian = Nexus.LITTLE_ENDIAN_DATA;

		var header = new Nexus.Header();
		header.import(view, offset, littleEndian);
		this._header = header;
	},

	_requestIndex : function () {
		var header = this._header;
		var offset = Nexus.Header.SIZEOF;
		var size   = header.nodesCount * Nexus.Node.SIZEOF + header.patchesCount * Nexus.Patch.SIZEOF + header.texturesCount * Nexus.Texture.SIZEOF;

		var that = this;
		var r = new SglBinaryRequest(this._url, {
			range : [offset, offset+size-1],
			onSuccess : function () {
				that._handleIndex(r.buffer);
				that._openReady();
			}
		});
	},

	_handleIndex : function (buffer) {
		var header       = this._header;
		var view         = new DataView(buffer);
		var offset       = 0;
		var littleEndian = Nexus.LITTLE_ENDIAN_DATA;

		var offset = 0;

		this._nodes = new Nexus.NodeIndex();
		offset += this._nodes.import(header.nodesCount, view, offset, littleEndian);

		this._patches = new Nexus.PatchIndex();
		offset += this._patches.import(header.patchesCount, view, offset, littleEndian);

		this._textures = new Nexus.TextureIndex();
		offset += this._textures.import(header.texturesCount, view, offset, littleEndian);
	},

	_openReady : function() {
		var nodesCount = this._nodes.length;
		var nodes      = this._nodes.items;
		for (var i=0; i<nodesCount; ++i) {
			var node = nodes[i];
			node.status      = Nexus.Renderer._NODE_NONE;
			node.request     = null;
			node.vbo         = null;
			node.ibo         = null;
			node.color       = [sglRandom01(), sglRandom01(), sglRandom01(), 1.0];
			node.renderError = 0.0;
			node.renderFrame = 0;
		}

		this._cachedNodes  = [ ];
		this._readyNodes   = [ ];
		this._pendingNodes = [ ];

		var nodesCount = this._header.nodesCount;
		this._visitedNodes  = new Nexus.BoolArray(nodesCount);
		this._blockedNodes  = new Nexus.BoolArray(nodesCount);
		this._selectedNodes = new Nexus.BoolArray(nodesCount);

		this._status = Nexus.Renderer.STATUS_OPEN;

		if (this._onSceneReady) {
			this._onSceneReady();
		}
	},

	_signalUpdate : function () {
		var upd = this._onUpdate;
		if (upd) {
			upd();
		}
	},

	get gl() {
		return this._gl;
	},

	get isValid() {
		return !!this._gl;
	},

	get onSceneReady() {
		return this._onSceneReady;
	},

	set onSceneReady(f) {
		this._onSceneReady = f;
	},

	get onUpdate() {
		return this._onUpdate;
	},

	set onUpdate(f) {
		this._onUpdate = f;
	},

	get status() {
		return this._status;
	},

	get isClosed() {
		return (this._status == Nexus.Renderer.STATUS_NONE);
	},

	get isOpening() {
		return (this._status == Nexus.Renderer.STATUS_OPENING);
	},

	get isOpen() {
		return (this._status == Nexus.Renderer.STATUS_OPEN);
	},

	get url() {
		return this._url;
	},

	get isReady() {
		return this.isOpen;
	},

	get datasetCenter() {
		if (!this.isReady) return [0, 0, 0];
		return this._header.sphere.center.slice(0, 3);
	},

	get datasetRadius() {
		if (!this.isReady) return 1.0;
		return this._header.sphere.radius;
	},

	get inBegin() {
		return this._inBegin;
	},

	get maxPendingRequests() {
		return this._maxPendingRequests;
	},

	set maxPendingRequests(r) {
		this._maxPendingRequests = r;
	},

	get targetError() {
		return this._targetError;
	},

	set targetError(e) {
		return this._targetError = e;
	},

	get modelMatrix() {
		return this._mmat.slice(0, 16);
	},

	set modelMatrix(m) {
		if (this.inBegin) return;
		this._mmat = m.slice(0, 16);
	},

	get viewMatrix() {
		return this._vmat.slice(0, 16);
	},

	set viewMatrix(m) {
		if (this.inBegin) return;
		this._vmat = m.slice(0, 16);
	},

	get projectionMatrix() {
		return this._pmat.slice(0, 16);
	},

	set projectionMatrix(m) {
		if (this.inBegin) return;
		this._pmat = m.slice(0, 16);
	},

	get viewport() {
		return this._vp.slice(0, 4);
	},

	set viewport(v) {
		if (this.inBegin) return;
		this._vp = v.slice(0, 4);
	},

	destroy : function () {
		this.close();
	},

	open : function (url) {
		if (!this.isValid) return;
		this.close();
		this._status = Nexus.Renderer.STATUS_OPENING;
		this._url    = url;
		this._requestHeader();
	},

	close : function () {
		if (this.isClosed) return;

		if (this.isOpening) {
		}
		else if (this.isOpen) {
		}

		this._reset();
	},

	_updateCache : function () {
		var readyNodes = this._readyNodes;
		if (readyNodes.length <= 0) return;

		var cachedNodes = this._cachedNodes;

		var newCache = cachedNodes.concat(readyNodes);
		newCache.sort(Nexus.Renderer._sortNodeCacheFunction);

		var maxSize = this._maxCacheSize;
		var size    = 0;

		var firstVictim = -1;
		var newNodes  = [ ];

		for (var i=0, n=newCache.length; i<n; ++i) {
			var node  = newCache[i];
			var nsize = node.lastByte - node.offset + 1;
			if ((size + nsize) > maxSize) {
				firstVictim = i;
				break;
			}
			if (node.request) {
				newNodes.push(node);
			}
			else {
				size += nsize
			}
		}

		if (firstVictim >= 0) {
			for (var i=firstVictim, n=newCache.length; i<n; ++i) {
				var node = newCache[i];
				if (node.vbo) {
					node.vbo.destroy();
					node.vbo = null;
				}
				if (node.ibo) {
					node.ibo.destroy();
					node.ibo = null;
				}
				node.request = null;
				node.status  = Nexus.Renderer._NODE_NONE;
			}
			newCache = newCache.slice(0, firstVictim);
		}

		var vertexStride = this._header.signature.vertex.byteLength;
		var faceStride   = this._header.signature.face.byteLength;
		var littleEndian = Nexus.LITTLE_ENDIAN_DATA;
		var gl           = this._gl;

		for (var i=0, n=newNodes.length; i<n; ++i) {
			var node    = newNodes[i];
			var request = node.request;

			var buffer = request.buffer;
			var view   = new DataView(buffer, 0, 2 * Uint16Array.BYTES_PER_ELEMENT);
			var offset = 0;

			var nv = node.verticesCount;
			var nf = node.facesCount;

			var vertexOffset = offset;
			var vertexSize   = nv * vertexStride;
			var faceOffset   = vertexOffset + vertexSize;
			var faceSize     = nf * faceStride;

			var vertices = new Uint8Array(buffer, vertexOffset, vertexSize);
			var indices  = new Uint8Array(buffer, faceOffset,   faceSize);

			node.vbo = new SglVertexBuffer (gl, {data : vertices});
			node.ibo = new SglIndexBuffer  (gl, {data : indices });

			node.request = null;
			node.status  = Nexus.Renderer._NODE_READY;

			var nsize = node.lastByte - node.offset + 1;
			size += nsize;
		}

		this._readyNodes  = [ ];
		this._cachedNodes = newCache;
		this._cacheSize   = size;
	},

	_hierarchyVisit_isVisible : function (sphere) {
		if (Nexus.Debug.flags[2]) return true;
		var planes = this._planes;
		for (var i=0; i<6; ++i) {
			if ((planes[i].signedDistanceToPoint(sphere.center) + sphere.radius) < 0.0) return false;
		}
		return true;
	},

	_hierarchyVisit_nodeError : function (n) {
		var node   = this._nodes.items[n];
		var sphere = node.sphere;

		var dist = SglVec3.length(SglVec3.sub(sphere.center, this._viewPoint)) - sphere.radius;
		if (dist < 0.1) dist = 0.1;

		var res   = this._resolution * dist;
		var error = node.error / res;

		if (!this._hierarchyVisit_isVisible(sphere)) {
			error /= 1000.0;
		}

		return error;
	},

	_hierarchyVisit_insertNode : function (n, visitQueue) {
		if (n == this._nodes.sink) return;

		if (this._visitedNodes.test(n)) return;
		this._visitedNodes.set(n);

		var error = this._hierarchyVisit_nodeError(n);
		var node  = this._nodes.items[n];
		node.renderError = error;
		node.renderFrame = this._frame;

		var nodeData = {
			node  : node,
            index : n
		};
		visitQueue.push(nodeData);
	},

	_hierarchyVisit_expandNode : function (nodeData) {

		var node  = nodeData.node;
		if (node.renderError < this._targetError) return false;

		return (node.status == Nexus.Renderer._NODE_READY);
	},

	_hierarchyVisit_insertChildren : function (n, visitQueue, block) {
		var nodes        = this._nodes.items;
		var node         = nodes[n];
		var patches      = this._patches.items;
		var blockedNodes = this._blockedNodes;
		for (var i=node.firstPatch; i<node.lastPatch; ++i) {
			var patch = patches[i];
			var child = patch.node;
			if (block) blockedNodes.set(child);
			this._hierarchyVisit_insertNode(child, visitQueue);
		}
	},

	_hierarchyVisit : function () {
		var visitQueue    = new Nexus.PriorityQueue(Nexus.Renderer._sortNodesFunction);
		var visitedNodes  = this._visitedNodes;
		var blockedNodes  = this._blockedNodes;
		var selectedNodes = this._selectedNodes;

		visitedNodes  .resetAll();
		blockedNodes  .resetAll();
		selectedNodes .resetAll();
		this._hierarchyVisit_insertNode(0, visitQueue);

		var nodes = this._nodes.items;

		var candidatesCount = 0;
		this._candidateNodes = [ ];
		var candidateNodes = this._candidateNodes;

		var count = 0;
		while (!visitQueue.isEmpty && (count < 100)) {
			var nodeData = visitQueue.pop();
			var n        = nodeData.index;
			var node     = nodeData.node;
			if ((candidatesCount < this._maxPendingRequests) && (node.status == Nexus.Renderer._NODE_NONE)) {
				candidatesCount++;
				candidateNodes.push(node);
			}
			var blocked = blockedNodes.test(n) || !this._hierarchyVisit_expandNode(nodeData);
			if (blocked) {
				count++;
			}
			else {
				selectedNodes.set(n);
			}
			
			this._hierarchyVisit_insertChildren(n, visitQueue, blocked);
		}
	},

	_createNodeHandler : function (node) {
		var that = this;
		return function () {
			that._readyNodes.push(node);
			that._signalUpdate();
		};
	},

	_requestNodes : function () {
		var candidateNodes = this._candidateNodes;
		if (candidateNodes.length <= 0) return;

		var cachedNodes = this._cachedNodes.slice();
		cachedNodes.sort(Nexus.Renderer._sortNodeCacheFunction);

		var nodesToRequest = 0;
		var cacheSize = this._cacheSize;
		for (var i=0, n=candidateNodes.length; i<n; ++i) {
			var c = candidateNodes[i];
			var s = this._maxCacheSize - cacheSize;
			var freed = 0;
			var csize = c.lastByte - c.offset + 1;
			var k = cachedNodes.length;
			if (s < csize) {
				for (var j=cachedNodes.length-1; j>=0; --j) {
					var p = cachedNodes[j];
					var psize = p.lastByte - p.offset + 1;
					k = j;
					if (Nexus.Renderer._sortNodeCacheFunction(c, p) >= 0) break;
					s += psize;
					freed += psize;
					if (s >= csize) break;
				}
			}

			if (s >= csize) {
				nodesToRequest++;
				cachedNodes = cachedNodes.slice(0, k);
				cachedNodes.push(c);
				cacheSize -= freed;
				cacheSize += csize;
			}
			else {
				break;
			}
		}

		for (var i=0; i<nodesToRequest; ++i) {
			var node   = candidateNodes[i];
			node.status  = Nexus.Renderer._NODE_PENDING;
			node.request = new SglBinaryRequest(this._url, {
				range : [node.offset, node.lastByte],
				onSuccess : this._createNodeHandler(node)
			});
		}
	},

	_unproject : function (p) {
		var a = [
			((p[0] - this._vp[0]) / (this._vp[2] / 2.0) - 1.0),
			((p[1] - this._vp[1]) / (this._vp[3] / 2.0) - 1.0),
			(2.0 * p[2] - 1.0),
			1.0
		];

		a = SglMat4.mul4(this._mvpmati, a);
		a = SglVec3.divs(SglVec4.to3(a), a[3]);

		return a;
	},

	_updateView : function () {
		this._mvmat      = SglMat4.mul(this._vmat, this._mmat);
		this._mvpmat     = SglMat4.mul(this._pmat, this._mvmat);
		this._mvpmati    = SglMat4.inverse(this._mvpmat);
		this._viewPoint  = SglVec4.to3(SglMat4.col(SglMat4.inverse(this._mvmat), 3));

		var l = this._vp[0];
		var r = this._vp[0] + this._vp[2];
		var b = this._vp[1];
		var t = this._vp[1] + this._vp[3];
  
		var nsw = this._unproject([l, b, 0.0]);
		var nse = this._unproject([r, b, 0.0]);
		var nnw = this._unproject([l, t, 0.0]);
		var nne = this._unproject([r, t, 0.0]);
		var fsw = this._unproject([l, b, 1.0]);
		var fse = this._unproject([r, b, 1.0]);
		var fnw = this._unproject([l, t, 1.0]);
		var fne = this._unproject([r, t, 1.0]);

		var planes = new Array(6);
		this._planes = planes;

		planes[0] = new Nexus.Plane3f(nnw, nsw, fnw); // +X (points toward left)
		planes[1] = new Nexus.Plane3f(nse, nne, fse); // -X (points toward rigth)
		planes[2] = new Nexus.Plane3f(nsw, nse, fsw); // +Y (points toward top)
		planes[3] = new Nexus.Plane3f(nne, nnw, fne); // -Y (points toward bottom)
		planes[4] = new Nexus.Plane3f(fsw, fse, fnw); // +Z (points toward far)
		planes[5] = new Nexus.Plane3f(nse, nsw, nne); // -Z (points toward near)

		this._resolution = SglVec3.length(SglVec3.sub(SglVec3.divs(SglVec3.add(nse, fse), 2.0), SglVec3.divs(SglVec3.add(nsw, fsw), 2.0))) / (this._vp[2] * SglVec3.length(SglVec3.sub(SglVec3.divs(SglVec3.add(nse, SglVec3.add(fse, SglVec3.add(nsw, fsw))), 4.0), this._viewPoint)));
	},

	_prepare : function () {
		this._updateView();
		this._updateCache();
		this._hierarchyVisit();
		this._requestNodes();
	},

	_beginRender : function () {
	},

	_endRender : function () {
	},

	_render : function () {
		var gl = this._gl;

		gl.glDrawElements = gl._spidergl.wn._ext.glFunctions.drawElements;

		var vertexStride = this._header.signature.vertex.byteLength;

		var vertexAttributes   = this._header.signature.vertex.attributes;
		var vertexAttribsCount = this._header.signature.vertex.lastAttribute + 1;

		for (var i=0; i<vertexAttribsCount; ++i) {
			if (vertexAttributes[i].isNull) continue;
			gl.enableVertexAttribArray(i);
		}

		gl.vertexAttrib4fv(Nexus.VertexElement.COLOR, [0.8, 0.8, 0.8, 1.0]);

		if (Nexus.Debug.flags[1]) {
			if (!vertexAttributes[Nexus.VertexElement.COLOR].isNull) {
				gl.disableVertexAttribArray(Nexus.VertexElement.COLOR);
			}
		}

		var nodes = this._nodes.items;
		var patches = this._patches.items;
		var selectedNodes = this._selectedNodes;
		var nodesCount = nodes.length;
		for (var i=0; i<nodesCount; ++i) {
			if (!selectedNodes.test(i)) continue;

			var node    = nodes[i];
			var skipped = true;
			for (var p=node.firstPatch; p<node.lastPatch; ++p) {
				var patch = patches[p];
				if (!selectedNodes.test(patch.node)) {
					skipped = false;
					break;
				}
			}
			if (skipped) continue;

			if (Nexus.Debug.flags[3]) continue;
			node.vbo.bind();
			node.ibo.bind();

			var attribOffset = 0;
			for (var j=0; j<vertexAttribsCount; ++j) {
				var attrib = vertexAttributes[j];
				if (attrib.isNull) continue;
				gl.vertexAttribPointer(j, attrib.size, attrib.glType, attrib.normalized, attrib.stride, attrib.offset + attribOffset);
				attribOffset += attrib.offset + attrib.stride * node.verticesCount;
			}

			if (Nexus.Debug.flags[1]) {
				gl.vertexAttrib4fv(Nexus.VertexElement.COLOR, node.color);
			}

			var firstTriangle = 0;
			for (var p=node.firstPatch; p<node.lastPatch; ++p) {
				var patch = patches[p];
				if (!selectedNodes.test(patch.node)) {
					if (!Nexus.Debug.flags[4]) {
						gl.glDrawElements(gl.TRIANGLES, (patch.lastTriangle - firstTriangle) * 3, gl.UNSIGNED_SHORT, firstTriangle * 3 * Uint16Array.BYTES_PER_ELEMENT);
					}
				}
				firstTriangle = patch.lastTriangle;
			}
		}

		for (var i=0; i<vertexAttribsCount; ++i) {
			if (vertexAttributes[i].isNull) continue;
			gl.disableVertexAttribArray(i);
		}

		SglVertexBuffer.unbind(gl);
		SglIndexBuffer.unbind(gl);
	},

	begin : function () {
		if (!this.isOpen) return;
		if (this.inBegin) return;
		this._inBegin = true;
		if (this._header.nodesCount <= 0) return;
		this._prepare();
	},

	end : function () {
		if (!this.inBegin) return;
		this._frame++;
		this._inBegin = false;
	},

	render : function () {
		if (!this.inBegin) return;
		this._beginRender();
		this._render();
		this._endRender();
	}
};
