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

var Nexus = { };

Nexus.LITTLE_ENDIAN_DATA = true;
Nexus.PADDING            = 256;

Nexus.Debug = {
	nodes: false,    //color each node
	culling: false,  //visibility culling disabled
	draw: false,     //final rendering call disabled
	extract: false,  //no extraction
	request: false,  //no network requests
	worker: false    //no web workers
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
Nexus.Attribute._typeGLMap[Nexus.Attribute.NONE          ] = WebGLRenderingContext.prototype.NONE;
Nexus.Attribute._typeGLMap[Nexus.Attribute.BYTE          ] = WebGLRenderingContext.prototype.BYTE;
Nexus.Attribute._typeGLMap[Nexus.Attribute.UNSIGNED_BYTE ] = WebGLRenderingContext.prototype.UNSIGNED_BYTE;
Nexus.Attribute._typeGLMap[Nexus.Attribute.SHORT         ] = WebGLRenderingContext.prototype.SHORT;
Nexus.Attribute._typeGLMap[Nexus.Attribute.UNSIGNED_SHORT] = WebGLRenderingContext.prototype.UNSIGNED_SHORT;
Nexus.Attribute._typeGLMap[Nexus.Attribute.INT           ] = WebGLRenderingContext.prototype.INT;
Nexus.Attribute._typeGLMap[Nexus.Attribute.UNSIGNED_INT  ] = WebGLRenderingContext.prototype.UNSIGNED_INT;
Nexus.Attribute._typeGLMap[Nexus.Attribute.FLOAT         ] = WebGLRenderingContext.prototype.FLOAT;
Nexus.Attribute._typeGLMap[Nexus.Attribute.DOUBLE        ] = WebGLRenderingContext.prototype.DOUBLE;

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

Nexus.VertexElement.POSITION  = 0;
Nexus.VertexElement.NORMAL    = 1;
Nexus.VertexElement.COLOR     = 2;
Nexus.VertexElement.TEXCOORD  = 3;
Nexus.VertexElement.DATA0     = 4;

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
			node.index = i;
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
	this.texture      = 0xffffffff;
};

Nexus.Patch.SIZEOF = 3 * Uint32Array.BYTES_PER_ELEMENT;

Nexus.Patch.prototype = {
	import : function (view, offset, littleEndian) {
		var s = 0;
		this.node           = view.getUint32(offset + s, littleEndian); s += Uint32Array.BYTES_PER_ELEMENT;
		this.lastTriangle   = view.getUint32(offset + s, littleEndian); s += Uint32Array.BYTES_PER_ELEMENT;
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
	//cache
	this.status = 0; //NONE
	this.tex = null; //gl stuff
	this.nodes = []; //list of depending nodes
};

Nexus.Texture.SIZEOF = 1 * Uint32Array.BYTES_PER_ELEMENT + 16 * Float32Array.BYTES_PER_ELEMENT;

Nexus.Texture.prototype = {
	import : function (view, offset, littleEndian) {
		var s = 0;
		this.offset = Nexus.PADDING * view.getUint32(offset + s, littleEndian); s += Uint32Array.BYTES_PER_ELEMENT;
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

// takes an array of objects with {data, priority}
Nexus.PriorityQueue = function() {
	this.content = [];
}

Nexus.PriorityQueue.prototype = {
	push: function(node) {
		this.bubbleUp(this.content.push(node) -1);
	},
	pop: function() {
		var result = this.content[0];    
		var end = this.content.pop();
		if (this.content.length > 0) {
			this.content[0] = end;
			this.sinkDown(0);
		}
		return result;
	},
	size: function() { return this.content.length; },
	bubbleUp: function(n) {
		var element = this.content[n];
		while (n > 0) {
			var parentN = ((n+1)>>1) -1; 
			var parent = this.content[parentN];
			if(parent.node.renderError > element.node.renderError)
				break;
			this.content[parentN] = element;
			this.content[n] = parent;
			n = parentN;
		}
	},

	sinkDown: function(n) {
		var length = this.content.length;
		var element = this.content[n]

		while(true) {
			var child2N = (n + 1) * 2;
			var child1N = child2N - 1;
			var swap = null;
      		if (child1N < length) {
				var child1 = this.content[child1N];
				if(child1.node.renderError > element.node.renderError)
					swap = child1N;
			}
			if (child2N < length) {
				var child2 = this.content[child2N];
				if (child2.node.renderError > (swap == null ? element.node.renderError : child1.node.renderError))
					swap = child2N;
			}

			if (swap == null) break;

			this.content[n] = this.content[swap];
			this.content[swap] = element;
			n = swap;
		}
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

	this.targetError        = Nexus.Renderer.DEFAULT_TARGET_ERROR;
	this._targetFps          = null; //Nexus.Renderer.DEFAULT_TARGET_FPS;
	this._maxPendingRequests = Nexus.Renderer.DEFAULT_MAX_PENDING_REQUESTS;
	this._maxCacheSize       = Nexus.Renderer.DEFAULT_CACHE_SIZE;
	this.drawBudget         = Nexus.Renderer.DEFAULT_DRAW_BUDGET;
	this._minDrawBudget      = Nexus.Renderer.DEFAULT_DRAW_BUDGET / 4;
	this._onUpdate           = null;
	this._onSceneReady       = null;

	this._mmat = SglMat4.identity();
	this._vmat = SglMat4.identity();
	this._pmat = SglMat4.identity();
	this._vp   = [ 0.0, 0.0, 1.0, 1.0 ];

	this._mode = 0;

	this._reset();

	this._updateView();
};

Nexus.Renderer.STATUS_NONE    = 0;
Nexus.Renderer.STATUS_OPENING = 1;
Nexus.Renderer.STATUS_OPEN    = 2;

Nexus.Renderer.DEFAULT_TARGET_ERROR         = 1.0;
Nexus.Renderer.DEFAULT_TARGET_FPS           = 20;
Nexus.Renderer.DEFAULT_MAX_PENDING_REQUESTS = 3; // 3 is good for uncompressed online work
Nexus.Renderer.DEFAULT_CACHE_SIZE           = 256 * 1024 * 1024;
Nexus.Renderer.DEFAULT_DRAW_BUDGET          = 2.0 * 1024 * 1024;

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
		this._drawSize        = 0; //number of triangle to be rendered
		this._rendered        = 0; //currently rendered triangles
		this._estimatedTpS    = 200000; //in million triangles
		this._cacheSize       = 0;
		this._cachedNodes     = null;
		this._readyNodes      = null;
		this._frame           = 0;

		this._pendingRequests = 0;
		this._candidateNodes  = null;
		this._redrawOnNewNodes = true;

		var t = this;
		var path;
		$('script').each(function(a) { var str = $(this).attr('src'); if(!str) return; if(str.search('nexus.js') >= 0) path = str; });
		path = path.replace('nexus.js', 'meshcoder_worker.js');
		this._worker = new Worker(path);
		this._worker.onmessage = function(e) { t._workerFinished(e); };

		/**Safari PATCH**/
		/**/(sayswho()[0]==='Safari' && sayswho()[1]<9) ? (this._cachePatch = true) : (this._cachePatch = false);
		/**Safari PATCH**/
	},

	_requestHeader : function () {
		var offset = 0;
		var size   = Nexus.Header.SIZEOF;

		var that = this;
		var r = new XMLHttpRequest();
		r.open('GET', this.url(), true);
		r.responseType = 'arraybuffer';
		r.setRequestHeader("Range", "bytes=" + offset + "-" + (offset + size -1));
		r.onload = function () {
			that._handleHeader(r.response);
			that._requestIndex();
		}
		r.send();
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
		var r = new XMLHttpRequest();
		r.open('GET', this.url(), true);
		r.responseType = 'arraybuffer';
		r.setRequestHeader("Range", "bytes=" + offset + "-" + (offset + size -1));
		r.onload = function () {
			that._handleIndex(r.response);
			that._openReady();
		}
		r.send();
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

		this.renderMode = ["POINT"];
		if (header.signature.face.hasIndex) this.renderMode.unshift("FILL");

		this.setPrimitiveMode(this.renderMode[0]);

		this.hasPosition = header.signature.vertex.hasPosition; 
		this.hasNormal   = header.signature.vertex.hasNormal; 
		this.hasColor    = header.signature.vertex.hasColor; 
		this.hasTexture  = header.signature.vertex.hasTexCoord; 
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

		this._cachedNodes    = [];
		this._readyNodes     = [];
//		this._pendingNodes   = []; not used

		var nodesCount = this._header.nodesCount;
		this._visitedNodes  = new Uint8Array(nodesCount);  //Nexus.BoolArray(nodesCount);
		this._blockedNodes  = new Uint8Array(nodesCount);  //new Nexus.BoolArray(nodesCount);
		this._selectedNodes = new Uint8Array(nodesCount);  //new Nexus.BoolArray(nodesCount);

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

	url: function() {
		var url = this._url;
		/**Safari PATCH**/
		/**/if (this._cachePatch) url = this._url + '?' + Math.random();
		/**Safari PATCH**/
		return url;
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

	get isClosed() {
		return (this._status == Nexus.Renderer.STATUS_NONE);
	},

	get isOpening() {
		return (this._status == Nexus.Renderer.STATUS_OPENING);
	},

	get isOpen() {
		return (this._status == Nexus.Renderer.STATUS_OPEN);
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

		//console.log(readyNodes);

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
				node.buffer = null;
				node.status  = Nexus.Renderer._NODE_NONE;
			}
			newCache = newCache.slice(0, firstVictim);
		}

		var vertexStride = this._header.signature.vertex.byteLength;
		var faceStride   = this._header.signature.face.byteLength;
		var littleEndian = Nexus.LITTLE_ENDIAN_DATA;
		var gl           = this._gl;

		for (var i = 0, n = newNodes.length; i < n; ++i) {
			var node    = newNodes[i];
			//console.log("loading node: " + node.index);
			var compressed = Nexus.Signature.MECO + Nexus.Signature.CTM1 + Nexus.Signature.CTM2;

			if(Nexus.Debug.worker && this._header.signature.flags & compressed) {
				var request = node.request;
				var buffer = request.response;
				var sig = {
					texcoords: this._header.signature.vertex.hasTexCoord,
					normals: this._header.signature.vertex.hasNormal,
					colors:  this._header.signature.vertex.hasColor,
					indices: this._header.signature.face.hasIndex
				};
				var _node = {
					nvert: node.verticesCount,
					nface: node.facesCount,
					firstPatch: 0, 
					lastPatch: node.lastPatch - node.firstPatch,
					buffer: node.request.response
				};
				var p = [];
				for(var k = node.firstPatch; k < node.lastPatch; k++)
					p.push(this._patches.items[k].lastTriangle);

				if(this._header.signature.flags & Nexus.Signature.MECO) {
					var now = window.performance.now();
					var coder = new MeshCoder(sig, _node, p);
					node.buffer = coder.decode(buffer);
					var elapsed = window.performance.now() - now;

					//console.log("Z Time: " + elapsed + " Size: " + size + " KT/s: " + (node.facesCount/(elapsed)) + " Mbps " + (8*1000*node.buffer.byteLength/elapsed)/(1<<20));
	
				} else {
					node.buffer = ctmDecode(sig, _node, p);
				}
			}

			var nv = node.verticesCount;
			var nf = node.facesCount;

			var vertexOffset = 0;
			var vertexSize   = nv * vertexStride;
			var faceOffset   = vertexOffset + vertexSize;
			var faceSize     = nf * faceStride;

			var vertices = new Uint8Array(node.buffer, vertexOffset, vertexSize);
			var indices  = new Uint8Array(node.buffer, faceOffset,   faceSize);

			node.vbo = new SglVertexBuffer (gl, {data : vertices});
			if (this._header.signature.face.hasIndex)
				node.ibo = new SglIndexBuffer  (gl, {data : indices });

			node.request = null;
			//STEP 1: if textures not ready this will be delayed
			var isReady = true;	
			var patches      = this._patches.items;
			for(var k = node.firstPatch; k < node.lastPatch; ++k) {
				var patch = this._patches.items[k];
				if(patch.texture == 0xffffffff) continue;
				if(this._textures.items[patch.texture].status != Nexus.Renderer._NODE_READY)
					isReady = false;
			}
			if(isReady)
				node.status  = Nexus.Renderer._NODE_READY;

			var nsize = node.lastByte - node.offset + 1;
			size += nsize;
		}

		this._readyNodes  = [ ];
		this._cachedNodes = newCache;
		this._cacheSize   = size;
	},

	_hierarchyVisit_isVisible : function (center, radius) {
		if (Nexus.Debug.culling) return true;
		var planes = this._planes;
		for (var i = 0; i < 4; ++i) {
			var plane = planes[i];
			var n = plane._normal;
			var dot = n[0]*center[0] + n[1]*center[1] + n[2]*center[2];
			if(dot - plane._offset + radius < 0.0)
				return false;
		}
		return true;
	},

	_hierarchyVisit_nodeError : function (n) {
		var node   = this._nodes.items[n];
		var sphere = node.sphere;
// inline distance computation
		var a = sphere.center;
		var b = this._viewPoint;
		var d0 = a[0] - b[0];
		var d1 = a[1] - b[1];
		var d2 = a[2] - b[2];
		var dist = Math.sqrt(d0*d0 + d1*d1 + d2*d2) - sphere.radius;
// end inline
		if (dist < 0.1) dist = 0.1;

		var res   = this._resolution * dist;
		var error = node.error / res;

		if (!this._hierarchyVisit_isVisible(sphere.center, sphere.radius)) {
			error /= 1000.0;
		}

		return error;
	},

	_hierarchyVisit_insertNode : function (n, visitQueue) {
		if (n == this._nodes.sink) return;

		if (this._visitedNodes[n]) return;
		this._visitedNodes[n] = 1;

		var error = this._hierarchyVisit_nodeError(n);
		if(error < this.targetError*0.8) return;  //2% speed TODO check if needed

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
		if(node.renderError < this.targetError) {
//			console.log("Stop becaouse of error: " + node.renderError + " < " + this.targetError);
			return false;
		}
		if(this._drawSize > this.drawBudget) {
//			console.log("Stop because of draw budget: " + this._drawSize  + " > " + this.drawBudget);
			return false;
		}


		var sphere = node.sphere
		if(this._hierarchyVisit_isVisible(sphere.center, node.tightRadius))
			this._drawSize += node.verticesCount*0.8; 
			//we are adding half of the new faces. (but we are using the vertices so *2)

		if(node.status != Nexus.Renderer._NODE_READY) {
//			console.log("Stop because node not ready:" + node.status);
//			here: mark a redraw when new nodes available.
			this._redrawOnNewNodes = true;
			return false;
		}
		return true;
	},

	_hierarchyVisit_insertChildren : function (n, visitQueue, block) {
		var nodes        = this._nodes.items;
		var node         = nodes[n];
		var patches      = this._patches.items;
		var blockedNodes = this._blockedNodes;
		for(var i = node.firstPatch; i < node.lastPatch; ++i) {
			var patch = patches[i];
			var child = patch.node;
			if (block) blockedNodes[child] = 1;
			this._hierarchyVisit_insertNode(child, visitQueue);
		}
	},

	_hierarchyVisit : function () {
        if(Nexus.Debug.extract == true)
			return;
		this._redrawOnNewNodes = false;

		var visitQueue    = new Nexus.PriorityQueue();

		var nodesCount = this._nodes.length;
		for(var i = 0; i < nodesCount; i++) {
			this._visitedNodes[i] = 0; 
			this._blockedNodes[i] = 0;
			this._selectedNodes[i] = 0;
		}
		this._hierarchyVisit_insertNode(0, visitQueue);

		var nodes = this._nodes.items;

		var candidatesCount = 0;
		this._candidateNodes = [ ];
		var candidateNodes = this._candidateNodes;

		this.currentError = 1e20;
		this._drawSize = 0;
		var count = 0;
		while (visitQueue.size() && (count < this._maxPendingRequests)) {
			var nodeData = visitQueue.pop();
			var n        = nodeData.index;
			var node     = nodeData.node;
			if ((candidatesCount < this._maxPendingRequests) && (node.status == Nexus.Renderer._NODE_NONE)) {
				candidatesCount++;
				candidateNodes.push(node);
			}
			var blocked = this._blockedNodes[n] || !this._hierarchyVisit_expandNode(nodeData);
			if (blocked) {
				count++;
			}
			else {
				this._selectedNodes[n] = 1;
				this.currentError = nodeData.node.renderError; 
			}
			
			this._hierarchyVisit_insertChildren(n, visitQueue, blocked);
		}
	},

	_createNodeHandler : function (node) {
		//compressed use worker:
		var that = this;
		return function () {
//			console.log("received node: " + node.index);
			node.request.buffer = node.request.response;

			var compressed = Nexus.Signature.MECO + Nexus.Signature.CTM1 + Nexus.Signature.CTM2;
			if(!Nexus.Debug.worker && that._header.signature.flags & compressed) {
				var sig = {
					texcoords: that._header.signature.vertex.hasTexCoord,
					normals: that._header.signature.vertex.hasNormal,
					colors:  that._header.signature.vertex.hasColor,
					indices: that._header.signature.face.hasIndex
				};
				var _node = {
					index: node.index,
					nvert: node.verticesCount,
					nface: node.facesCount,
					firstPatch: 0, 
					lastPatch: node.lastPatch - node.firstPatch,
					buffer: node.request.response
				};
				var p = [];
				for(var k = node.firstPatch; k < node.lastPatch; k++)
					p.push(that._patches.items[k].lastTriangle);
				if(that._header.signature.flags & Nexus.Signature.MECO)
					that._worker.postMessage({signature:sig, node:_node, patches:p });
			} else {
				that._workerFinished({data: {index:node.index, buffer:node.request.response}});
			}
		}
	},

	_workerFinished: function(_node) {
		var node = this._nodes.items[_node.data.index];
		node.buffer = _node.data.buffer;
		this._readyNodes.push(node);
		if(this._redrawOnNewNodes) { //redraw only if new nodes might improve rendering
			this._signalUpdate();
		}
	},

	_createTextureHandler : function (tex) {
		var that = this;

		return function () {
			//TODO USE REF COUNTER INSTEAD OF LIST BOTH FOR NODES AND FOR TEXTURES
			var blob = tex.request.response; 
			var urlCreator = window.URL || window.webkitURL;
			tex.img = document.createElement('img');
			tex.img.onerror = function(e) { console.log("Failed loading texture."); };
			tex.img.src = urlCreator.createObjectURL(blob);

			tex.img.onload = function() { 
				urlCreator.revokeObjectURL(tex.img.src); 

				var gl = that._gl;
				tex.texture = gl.createTexture();
				gl.bindTexture(gl.TEXTURE_2D, tex.texture);
		    	var s = gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, tex.img);
		    	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
		    	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
				gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
				gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
				gl.bindTexture(gl.TEXTURE_2D, null);

				tex.status = Nexus.Renderer._NODE_READY;
				//find all nodes pending
				for(var i = 0; i < tex.nodes.length; i++) {
					var node = tex.nodes[i];
					if(node.vbo === null) continue; //not loaded still
					var isReady = true;
					for(var k = node.firstPatch; k < node.lastPatch; ++k) {
						var patch = that._patches.items[k];
						if(patch.texture == 0xffffffff) continue;
						var t = that._textures.items[patch.texture];
						if(t.status != Nexus.Renderer._NODE_READY) {
							isReady = false;
							break;
						}
					} 
					if(isReady) {
						node.status = Nexus.Renderer._NODE_READY;
						//WAKEUP CALL DRAFT
						that._signalUpdate();
					}
				}
			};
		}
	},

	_requestNodes : function () {
		if(Nexus.Debug.request) {
			this._candidateNodes = [];
			return;
		}
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

		var that = this;
		var url = this.url();
		for (var i=0; i<nodesToRequest; ++i) {
			var node   = candidateNodes[i];
			node.status  = Nexus.Renderer._NODE_PENDING;
			node.request = new XMLHttpRequest();
			node.request.open('GET', url, true);
			node.request.responseType = 'arraybuffer';
			node.request.setRequestHeader("Range", "bytes=" + node.offset + "-" + node.lastByte);
			node.request.onload = this._createNodeHandler(node);
			node.request.onerror= function () { //NODES RECOVERY DRAFT
				for (var j=0, n=candidateNodes.length; j<n; ++j) 
					if(candidateNodes[j].requestError) return;
//				that._updateView();
//				that._updateCache();
//				that._hierarchyVisit();
				that._candidateNodes = candidateNodes;
				for (var j=0, n=candidateNodes.length; j<n; ++j) 
					candidateNodes[j].requestError = true;
				that._requestNodes();
			}
			node.request.onabort= function () { //NODES RECOVERY DRAFT
				for (var j=0, n=candidateNodes.length; j<n; ++j) 
					if(candidateNodes[j].requestCancel) return;
//				that._updateView();
//				that._updateCache();
//				that._hierarchyVisit();
				that._candidateNodes = candidateNodes;
				for (var j=0, n=candidateNodes.length; j<n; ++j) 
					candidateNodes[j].requestCancel = true;
				that._requestNodes();
			}
			node.request.send();

			//check for textures
			var patches      = this._patches.items;
			for(var i = node.firstPatch; i < node.lastPatch; ++i) {
				var patch = patches[i];
				if(patch.texture == 0xffffffff) continue;
				var tex = this._textures.items[patch.texture];
				tex.nodes.push(node);
				var that = this;
				if(tex.status == Nexus.Renderer._NODE_NONE) {
					tex.img = new Image;
					tex.status = Nexus.Renderer._NODE_PENDING;
					tex.request = new XMLHttpRequest();
					tex.request.open('GET', url, true);
					tex.request.responseType = 'blob';
					tex.request.setRequestHeader("Range", "bytes=" + tex.offset + "-" + tex.lastByte);
					tex.request.onload = this._createTextureHandler(tex);
					tex.request.send();
				}
			}
		}
		this._candidateNodes = [];
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
		var order = [0, 3, 1, 2, 4];

		var gl = this._gl;
		gl.glDrawElements = gl._spidergl.wn._ext.glFunctions.drawElements;

		var vertexStride       = this._header.signature.vertex.byteLength;
		var vertexAttributes   = this._header.signature.vertex.attributes;
		var vertexAttribsCount = this._header.signature.vertex.lastAttribute + 1;

		for (var i=0; i<4; ++i) {
			if (vertexAttributes[order[i]].isNull) continue;
			gl.enableVertexAttribArray(order[i]);
		}

		gl.vertexAttrib4fv(Nexus.VertexElement.COLOR, [0.8, 0.8, 0.8, 1.0]);

		if (Nexus.Debug.nodes) {
			if (!vertexAttributes[Nexus.VertexElement.COLOR].isNull) 
				gl.disableVertexAttribArray(Nexus.VertexElement.COLOR);
			if (!vertexAttributes[Nexus.VertexElement.TEXCOORD].isNull) 
				gl.disableVertexAttribArray(Nexus.VertexElement.TEXCOORD);
		}

		var nodes = this._nodes.items;
		var patches = this._patches.items;
		var selectedNodes = this._selectedNodes;
		var nodesCount = nodes.length;
		this._rendered = 0;

		var last_texture = -1;
		for (var i=0; i<nodesCount; ++i) {
			if (!selectedNodes[i]) continue;

			var node    = nodes[i];
			if(this._mode != 0) {
				var skipped = true;
				for (var p = node.firstPatch; p < node.lastPatch; ++p) {
					var patch = patches[p];
					if (!selectedNodes[patch.node]) {
						skipped = false;
						break;
					}
				}
				if (skipped) continue;
			}

			if(!this._hierarchyVisit_isVisible(node.sphere.center, node.tightRadius)) 
				continue;

			node.vbo.bind();
			if(node.ibo) {
				node.ibo.bind();
			}

			var attribOffset = 0;
			//order is needed because attributes are oredere by vertex normal colors tex, while data inverts tex and normal for alignment
			for (var j=0; j<4; ++j) { //vertexAttribsCount; ++j) {
				var attrib = vertexAttributes[order[j]];
				if (attrib.isNull) continue;
				gl.vertexAttribPointer(order[j], attrib.size, attrib.glType, attrib.normalized, attrib.stride, attrib.offset + attribOffset);
				attribOffset += attrib.offset + attrib.stride * node.verticesCount;
			}

			if (Nexus.Debug.nodes) {
				gl.vertexAttrib4fv(Nexus.VertexElement.COLOR, node.color);
			}
			if(this._mode == 0) {
                var pointsize = Math.floor(0.30*node.renderError);
                if(pointsize > 1) pointsize = 1;
				gl.vertexAttrib1fv(Nexus.VertexElement.DATA0, [pointsize]);
			}
			if (Nexus.Debug.draw) continue;

			//point cloud do not need patches
			if(this._mode == 0) {
				var fraction = (node.renderError/this.currentError - 1);
				if(fraction > 1) fraction = 1;

				var count = fraction * (node.verticesCount);
				if(count!=0) {
					gl.drawArrays(gl.POINTS, 0, count);
					this._rendered += count;
				}
				continue;
			}

			//concatenate renderings to remove useless calls. except we have textures.
			var first = 0;
			var last = 0;
			for (var p = node.firstPatch; p < node.lastPatch; ++p) {
				var patch = patches[p];

				if(!selectedNodes[patch.node]) { //skip this patch
					last = patch.lastTriangle;
					if(p < node.lastPatch-1) //if textures we do not join. TODO: should actually check for same texture of last one. 
						continue;
				} 
				if(last > first) {
					//here either we skip or is the last node
					
					if(patch.texture != 0xffffffff && patch.texture != last_texture) { //bind texture
						var tex = this._textures.items[patch.texture].texture;
						gl.activeTexture(gl.TEXTURE0);
						gl.bindTexture(gl.TEXTURE_2D, tex);
						var error = gl.getError(); 
					}
					gl.glDrawElements(gl.TRIANGLES, (last - first) * 3, gl.UNSIGNED_SHORT, first * 3 * Uint16Array.BYTES_PER_ELEMENT);
					this._rendered += last - first;
				}
				first = patch.lastTriangle;
			}
		} 

		for (var i = 0; i < 4; ++i) {
			if (vertexAttributes[order[i]].isNull) continue;
			gl.disableVertexAttribArray(order[i]);
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
	},

	setPrimitiveMode : function (mode) {
		switch(mode) {
			case "POINT":
				this._mode = 0;
				break;
			case "FILL":
				this._mode = 4;
				break;
			default:
				this._mode = 0;
		}
	}
};

sayswho = function() {
	var ua= navigator.userAgent, tem, 
	M= ua.match(/(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i) || [];
	if(/trident/i.test(M[1])){
		tem=  /\brv[ :]+(\d+)/g.exec(ua) || [];
		return 'IE '+(tem[1] || '');
	}
	if(M[1]=== 'Chrome'){
		tem= ua.match(/\b(OPR|Edge)\/(\d+)/);
		if(tem!= null) return tem.slice(1).join(' ').replace('OPR', 'Opera');
	}
	M= M[2]? [M[1], M[2]]: [navigator.appName, navigator.appVersion, '-?'];
	if((tem= ua.match(/version\/(\d+)/i))!= null) M.splice(1, 1, tem[1]);
	return M;
};
