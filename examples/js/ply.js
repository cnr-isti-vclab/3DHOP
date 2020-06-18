/*
3DHOP - 3D Heritage Online Presenter
Copyright (c) 2014-2020, Visual Computing Lab, ISTI - CNR
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

var parsePly = (function(){
	var canonicTypes = {
		"char"    : "int8",
		"int8"    : "int8",
		"uchar"   : "uint8",
		"uint8"   : "uint8",
		"short"   : "int16",
		"int16"   : "int16",
		"ushort"  : "uint16",
		"uint16"  : "uint16",
		"int"     : "int32",
		"int32"   : "int32",
		"uint"    : "uint32",
		"uint32"  : "uint32",
		"float"   : "float32",
		"float32" : "float32",
		"double"  : "float64",
		"float64" : "float64"
	};

	function trim(s) {
		var r = s;
		var n = r.length;
		var i = 0;
		var blanks = " \n\r\t";
		while ((i < n) && (blanks.indexOf(r.charAt(i)) >= 0)) { i++; }
		r = r.substring(i, r.length);
		i = r.length - 1;
		while ((i > 0) && (blanks.indexOf(r.charAt(i)) >= 0)) { i--; }
		r = r.substring(0, i+1);
		return r;
	}

	function extractHeader(data) {
		if (!data || !data.view || !data.view.buffer) return null;

		var u8 = new Uint8Array(data.view.buffer);
		var endHeaderToken = "end_header";
		var header = "";
		var found  = false;
		var currC  = null;
		var prevC  = null;
		var pos    = data.pos;
		var p      = 0;
		var n      = 0;

		for (pos=0, n=u8.byteLength; pos<n; ++pos) {
			currC = String.fromCharCode(u8[pos]);
			header += currC;
			if (currC === "\n") {
				if (pos >= endHeaderToken.length) {
					p = pos - endHeaderToken.length;
					if (prevC == "\r") p--;
					if (header.substring(p, p + endHeaderToken.length) == endHeaderToken) {
						found = true;
						break;
					}
				}
			}
			prevC = currC;
		}

		data.pos = pos;

		if (!found) {
			return null;
		}

		data.pos++;
		return header;
	}

	function splitHeader(header) {
		var lines  = header.split("\n");
		var trimmed = [ ];
		var tokens  = null;
		var s = null;
		for (var i=0, n=lines.length; i<n; ++i) {
			s = trim(lines[i]);
			if (s) {
				tokens = s.split(" ");
				if (tokens.length > 0) {
					for (var j=0, m=tokens.length; j<m; ++j) {
						tokens[j] = trim(tokens[j]);
					}
					trimmed.push(tokens);
				}
			}
		}
		return trimmed;
	}

	function parseHeader(header) {
		if (!header || header.length <= 0) return null;
		if (header[0][0] != "ply") return null;

		var elem   = null;
		var prop   = null;
		var tokens = null;
		var token  = null;
		var tn     = 0;

		var info = {
			format     : null,
			elements   : [ ],
			elementMap : { },
			comments   : [ ],
			others     : [ ]
		};

		for (var i=1; i<header.length-1; ++i) {
			tokens = header[i];
			tn = tokens.length;
			token  = tokens[0].toLowerCase();
			switch (token) {
				case "format":
					if (tn >= 3) {
						info.format = {
							name    : tokens[1],
							version : tokens[2],
							binary  : (tokens[1].toLowerCase().indexOf("binary") >= 0),
							littleEndian : ((tokens[1].toLowerCase()) == "binary_little_endian")
						};
					}
				break;

				case "comment":
					info.comments.push(tokens.slice(1));
				break;

				case "element":
					if (tn >= 3) {
						elem = {
							name  : tokens[1],
							count : parseInt(tokens[2]),
							properties  : [ ],
							propertyMap : { }
						};
						info.elements.push(elem);
						info.elementMap[elem.name.toLowerCase()] = elem;
					}
				break;

				case "property":
					if (elem && (tn >= 3)) {
						prop = {
							name : tokens[tn-1],
							type : tokens.slice(1, tn - 1)
						};
						elem.properties.push(prop);
						elem.propertyMap[prop.name.toLowerCase()] = prop;
					}
				break;

				default:
					info.others.push(tokens.slice());
				break;
			}
		}

		if (!info.format) {
			return false;
		}

		return info;
	}

	var tabStr = "\t";

	function setupLines(lines, tabs) {
		for (var i=0, n=lines.length; i<n; ++i) {
			lines[i] = tabs + lines[i];
		}
		return lines;
	}

	function generateReadValue(assignExpr, types, index, binary, littleEndian, tabs, level, newIdentifiers) {
		var lines = [ ];
		var type  = types[index];

		if (type.toLowerCase() == "list") {
			var nIde = "n" + level;
			var vIde = "v" + level;
			var iIde = "i" + level;

			newIdentifiers[nIde] = true;
			newIdentifiers[vIde] = true;
			newIdentifiers[iIde] = true;

			level++;
			index++;

			lines = lines.concat(lines, generateReadValue(/*"var " + */ "" + nIde, types, index, binary, littleEndian, "", level, newIdentifiers));
			index++;
	
			lines.push(/*"var " + */ vIde + " = new Array(" + nIde + ");");
			lines.push("for (" + /*"var " + */ iIde +"=0; " + iIde + "<" + nIde + "; ++" + iIde + ") {");
			lines = lines.concat(generateReadValue(vIde + "[" + iIde + "]", types, index, binary, littleEndian, tabStr, level, newIdentifiers));
			//lines.push("");
			lines.push("}");
			lines.push(assignExpr + " = " + vIde + ";");
		}
		else {
			if (binary) {
				switch (type) {
					case "char":
					case "int8":
						lines.push(assignExpr + " = view.getInt8(pos, " + littleEndian + ");");
						lines.push("pos += 1;");
					break;

					case "uchar":
					case "uint8":
						lines.push(assignExpr + " = view.getUint8(pos, " + littleEndian + ");");
						lines.push("pos += 1;");
					break;

					case "short":
					case "int16":
						lines.push(assignExpr + " = view.getInt16(pos, " + littleEndian + ");");
						lines.push("pos += 2;");
					break;

					case "ushort":
					case "uint16":
						lines.push(assignExpr + " = view.getUint16(pos, " + littleEndian + ");");
						lines.push("pos += 2;");
					break;

					case "int":
					case "int32":
						lines.push(assignExpr + " = view.getInt32(pos, " + littleEndian + ");");
						lines.push("pos += 4;");
					break;

					case "uint":
					case "uint32":
						lines.push(assignExpr + " = view.getUint32(pos, " + littleEndian + ");");
						lines.push("pos += 4;");
					break;

					case "float":
					case "float32":
						lines.push(assignExpr + " = view.getFloat32(pos, " + littleEndian + ");");
						lines.push("pos += 4;");
					break;

					case "double":
					case "float64":
						lines.push(assignExpr + " = view.getFloat64(pos, " + littleEndian + ");");
						lines.push("pos += 8;");
					break;

					default:
					break;
				}
			}
			else {
				switch (type) {
					case "char"   :
					case "int8"   :
					case "uchar"  :
					case "uint8"  :
					case "short"  :
					case "int16"  :
					case "ushort" :
					case "uint16" :
					case "int"    :
					case "int32"  :
					case "uint"   :
					case "uint32" :
						lines.push(assignExpr + " = parseInt(view[pos]);");
						lines.push("pos += 1;");
					break;

					case "float"   :
					case "float32" :
					case "double"   :
					case "float64" :
						lines.push(assignExpr + " = parseFloat(view[pos]);");
						lines.push("pos += 1;");
					break;

					default:
					break;
				}
			}
		}

		setupLines(lines, tabs);
		return lines;
	}

	function generateReadProperty(assignExpr, types, binary, littleEndian, tabs, level, newIdentifiers) {
		var lines = generateReadValue(assignExpr, types, 0, binary, littleEndian, "", level, newIdentifiers);
		return lines;
	}

	function generateReadElement(assignExpr, props, binary, littleEndian, tabs, level, newIdentifiers) {
		var p  = null;
		var lines = [ ];
		for (var i=0, n=props.length; i<n; ++i) {
			p = props[i];
			lines = lines.concat(generateReadProperty(assignExpr + "[\"" + p.name + "\"]", p.type, binary, littleEndian, "", level, newIdentifiers));
			lines.push("");
		}
		setupLines(lines, tabs);
		return lines;
	}

	function generateReadElements(elemIndex, elem, binary, littleEndian, tabs, level, newIdentifiers) {
		var lines = [ ];
		var nIde  = "n" + level;
		var iIde  = "i" + level;
		level++;

		newIdentifiers[nIde]      = true;
		newIdentifiers[iIde]      = true;
		newIdentifiers["element"] = true;
		newIdentifiers["elem"]    = true;
		newIdentifiers["args"]    = true;

		lines.push(/*"var " + */ "element = info.elements[" + elemIndex + "];");
		lines.push(/*"var " + */ nIde + " = element.count;");
		lines.push(/*"var " + */ "elem = { };");
		lines.push(/*"var " + */ "args = [ info, element, 0, elem];");

		lines.push("callbacks.onBeginElements.call(handler, info, element);");

		lines.push("for (" + /*"var " + */ iIde +"=0; " + iIde + "<" + nIde + "; ++" + iIde + ") {");
		lines = lines.concat(generateReadElement("elem", elem.properties, binary, littleEndian, tabStr, level, newIdentifiers));
		lines.push(tabStr + "args[2] = " + iIde + ";");
		lines.push(tabStr + "callbacks.onElement.apply(handler, args);");
		lines.push("}");

		lines.push("callbacks.onEndElements.call(handler, info, element);");

		setupLines(lines, tabs);
		return lines;
	}

	function generateReadMesh(elems, binary, littleEndian) {
		var lines = [ ];
		lines.push("function (data, info, callbacks, handler) {");
		lines.push(tabStr + "var view = data.view;");
		lines.push(tabStr + "var pos  = data.pos;");
		lines.push("");

		var newIdentifiers = { };

		var elementLines = [ ];
		for (var i=0, n=elems.length; i<n; ++i) {
			elementLines = elementLines.concat(generateReadElements(i, elems[i], binary, littleEndian, tabStr, 0, newIdentifiers));
			elementLines.push("");
		}

		var ides = [ ];
		for (var ide in newIdentifiers) {
			ides.push(ide);
		}
		ides.sort();
		lines.push(tabStr + "var " + ides.join(", ") + ";");
		lines.push("");

		lines.push(tabStr + "callbacks.onBeginContent.call(handler, info);");
		lines = lines.concat(elementLines);
		lines.push(tabStr + "callbacks.onEndContent.call(handler, info);");

		lines.push(tabStr + "data.pos = pos;");
		lines.push("}");

		setupLines(lines, "");
		var s = "";
		for (var i=0, n=lines.length; i<n; ++i) {
			s += lines[i] + "\n";
		}
		return s;
	}

	function getMeshInfo(data) {
		if (!data) return null;

		var header = extractHeader(data);
		if (!header) return null;

		var tokens = splitHeader(header);
		if (!tokens) return null;

		var info = parseHeader(tokens);
		if (!info) return null;

		return info;
	}

	function mainParsePly(buffer, handler) {
		if (!buffer) return null;

		function emptyFunc() { };

		handler = handler || { };
		var callbacks = {
			onBegin                 : (handler.onBegin         || emptyFunc),
				onHeader            : (handler.onHeader        || emptyFunc),
				onBeginContent      : (handler.onBeginContent  || emptyFunc),
					onBeginElements : (handler.onBeginElements || emptyFunc),
						onElement   : (handler.onElement       || emptyFunc),
					onEndElements   : (handler.onEndElements   || emptyFunc),
				onEndContent        : (handler.onEndContent    || emptyFunc),
			onEnd                   : (handler.onEnd           || emptyFunc)
		};

		var dataView = new DataView(buffer);
		var data = {
			view : dataView,
			pos  : 0
		};

		var info = getMeshInfo(data);
		if (!info) return false;

		if (!info.format.binary) {
			data.view = Array.prototype.map.call(
				new Uint8Array(buffer, data.pos),
				function (x) {
					return String.fromCharCode(x);
				}
			).join("").split(" ");
			data.pos = 0;
		}

		for (var i in info.comments) {
			if (info.comments[i][0]=="TextureFile") handler._textureUrl = info.comments[i][1];
		}

		var readMeshStr  = generateReadMesh(info.elements, info.format.binary, info.format.littleEndian);
		var readMeshFunc = eval("(" + readMeshStr + ")");

		for (var e in info.elements) {
			for (var p in info.elements[e].propertyMap) {
				info.elements[e].propertyMap[p].canonicType = canonicTypes[info.elements[e].propertyMap[p].type];
			}
		}

		callbacks.onBegin.call(handler);
			callbacks.onHeader.call(handler, info);
			readMeshFunc(data, info, callbacks, handler);
		callbacks.onEnd.call(handler);

		return true;
	}

	return mainParsePly;
})();

var importPly = (function(){
	function emptyFunction() {
	}

	function propertiesTypes() {
		var r = [ ];
		var m = { };
		var a = null;
		for (var i=0; i<arguments.length; ++i) {
			a = arguments[i];
			if (!a) return r;
			m[a.canonicType] = 1;
		}
		for (var t in m) {
			r.push(t);
		}
		return r;
	}

	function PlyHandler(buffer) {
		this._buffer           = buffer;

		this._modelDescriptor  = null;

		this._verticesCount    = 0;
		this._vertexAttributes = null;
		this._vertexStride     = 0;
		this._vertexBuffer     = null;
		this._handleVertex     = emptyFunction;

		this._facesCount       = 0;
		this._indexBuffer      = null;
		this._handleFace       = emptyFunction;

		this._view             = null;

		this._hasPosition      = null;
		this._hasNormal        = null;
		this._hasColor         = null;
		this._hasTexCoord      = null;

		this._textureUrl       = null;

		this._renderMode       = ["POINT"];

		this._boundingBox      = { 
			min: [ 1000000.0, 1000000.0, 1000000.0], 
			max: [-1000000.0,-1000000.0,-1000000.0]
		};
	}

	PlyHandler.prototype = {
		get modelDescriptor() {
			return this._modelDescriptor;
		},

		onBegin : function () {
		},

		onHeader : function (header) {
			var tabStr = "\t";

			var elem   = null;
			var props  = null;
			var ptypes = null;

			var verticesCount    = 0;
			var vertexLines      = null;
			var vertexAttributes = { };
			var vertexStride     = 0;

			var hasPosition = false;
			var hasNormal   = false;
			var hasColor    = false;
			var hasTexCoord = false;

			elem  = header.elementMap["vertex"];
			if (elem && elem.count > 0) {
				verticesCount = elem.count;
				props = elem.propertyMap;

				vertexLines = [ ];

				vertexLines.push("function (header, elementInfo, index, element) {");
				vertexLines.push(tabStr + "var littleEndian = SpiderGL.Type.LITTLE_ENDIAN;");
				vertexLines.push(tabStr + "var sf32         = SpiderGL.Type.SIZEOF_FLOAT32;");
				vertexLines.push(tabStr + "var sui8         = SpiderGL.Type.SIZEOF_UINT8;");
				vertexLines.push(tabStr + "var offset       = index * this._vertexStride;");
				vertexLines.push(tabStr + "var view         = this._view;");
				vertexLines.push("");

				ptypes = propertiesTypes(props["x"], props["y"], props["z"]);
				if (ptypes.length == 1) {
					hasPosition = true;
					switch (ptypes[0]) {
						case "float32":
							vertexLines.push(tabStr + "view.setFloat32(offset, element.x, littleEndian); offset += sf32;");
							vertexLines.push(tabStr + "view.setFloat32(offset, element.y, littleEndian); offset += sf32;");
							vertexLines.push(tabStr + "view.setFloat32(offset, element.z, littleEndian); offset += sf32;");
							vertexLines.push("");
							vertexAttributes["position"] = {
								size   : 3,
								type   : SpiderGL.Type.FLOAT32,
								offset : vertexStride
							};
							vertexStride += 3 * SpiderGL.Type.SIZEOF_FLOAT32;
						break;
						default: break;
					}
				}

				ptypes = propertiesTypes(props["nx"], props["ny"], props["nz"]);
				if (ptypes.length == 1) {
					hasNormal = true;
					switch (ptypes[0]) {
						case "float32":
							vertexLines.push(tabStr + "view.setFloat32(offset, element.nx, littleEndian); offset += sf32;");
							vertexLines.push(tabStr + "view.setFloat32(offset, element.ny, littleEndian); offset += sf32;");
							vertexLines.push(tabStr + "view.setFloat32(offset, element.nz, littleEndian); offset += sf32;");
							vertexLines.push("");
							vertexAttributes["normal"] = {
								size   : 3,
								type   : SpiderGL.Type.FLOAT32,
								offset : vertexStride
							};
							vertexStride += 3 * SpiderGL.Type.SIZEOF_FLOAT32;
						break;
						default: break;
					}
				}

				ptypes = propertiesTypes(props["red"], props["green"], props["blue"]);
				if (ptypes.length == 1) {
					hasColor = true;
					switch (ptypes[0]) {
						case "uint8":
							vertexLines.push(tabStr + "view.setUint8(offset, element.red  ); offset += sui8;");
							vertexLines.push(tabStr + "view.setUint8(offset, element.green); offset += sui8;");
							vertexLines.push(tabStr + "view.setUint8(offset, element.blue ); offset += sui8;");
							vertexLines.push(tabStr + "view.setUint8(offset, 255          ); offset += sui8;");
							vertexLines.push("");
							vertexAttributes["color"] = {
								size   : 4,
								type   : SpiderGL.Type.UINT8,
								offset : vertexStride,
								normalized : true
							};
							vertexStride += 4 * SpiderGL.Type.SIZEOF_UINT8;
						break;
						case "float32":
							vertexLines.push(tabStr + "view.setFloat32(offset, element.red,   littleEndian); offset += sf32;");
							vertexLines.push(tabStr + "view.setFloat32(offset, element.green, littleEndian); offset += sf32;");
							vertexLines.push(tabStr + "view.setFloat32(offset, element.blue,  littleEndian); offset += sf32;");
							vertexLines.push(tabStr + "view.setFloat32(offset, 1.0,           littleEndian); offset += sf32;");
							vertexLines.push("");
							vertexAttributes["color"] = {
								size   : 4,
								type   : SpiderGL.Type.FLOAT32,
								offset : vertexStride
							};
							vertexStride += 4 * SpiderGL.Type.SIZEOF_FLOAT32;
						break;
						default: break;
					}
				}

				ptypes = propertiesTypes(props["texture_u"], props["texture_v"]);
				if (ptypes.length == 1) {
					hasTexCoord = true;
					switch (ptypes[0]) {
						case "float32":
							vertexLines.push(tabStr + "view.setFloat32(offset, element.texture_u, littleEndian); offset += sf32;");
							vertexLines.push(tabStr + "view.setFloat32(offset, element.texture_v, littleEndian); offset += sf32;");
							vertexLines.push("");
							vertexAttributes["texturecoord"] = {
								size   : 2,
								type   : SpiderGL.Type.FLOAT32,
								offset : vertexStride
							};
							vertexStride += 2 * SpiderGL.Type.SIZEOF_FLOAT32;
						break;
						default: break;
					}
				}

				vertexLines.push("}");
			}

			var facesCount = 0;
			var faceLines  = null;

			elem  = header.elementMap["face"];
			if (elem && elem.count > 0) {
				facesCount = elem.count;
				props = elem.propertyMap;

				faceLines = [ ];

				faceLines.push("function (header, elementInfo, index, element) {");
				faceLines.push(tabStr + "var littleEndian = SpiderGL.Type.LITTLE_ENDIAN;");
				faceLines.push(tabStr + "var sui32        = SpiderGL.Type.SIZEOF_UINT32;");
				faceLines.push(tabStr + "var offset       = index * 3 * sui32;");
				faceLines.push(tabStr + "var view         = this._view;");
				faceLines.push("");

				if (props["vertex_indices"]) {
					faceLines.push(tabStr + "view.setUint32(offset, element.vertex_indices[0], littleEndian); offset += sui32;");
					faceLines.push(tabStr + "view.setUint32(offset, element.vertex_indices[1], littleEndian); offset += sui32;");
					faceLines.push(tabStr + "view.setUint32(offset, element.vertex_indices[2], littleEndian); offset += sui32;");
				}
				else if (props["vertex_index"]) {
					faceLines.push(tabStr + "view.setUint32(offset, element.vertex_index[0], littleEndian); offset += sui32;");
					faceLines.push(tabStr + "view.setUint32(offset, element.vertex_index[1], littleEndian); offset += sui32;");
					faceLines.push(tabStr + "view.setUint32(offset, element.vertex_index[2], littleEndian); offset += sui32;");
				}
				else {
					facesCount = 0;
				}

				faceLines.push("}");
			}

			this._mesh = null;

			this._hasPosition      = hasPosition;
			this._hasNormal        = hasNormal;
			this._hasColor         = hasColor;
			this._hasTexCoord      = hasTexCoord;

			this._verticesCount    = verticesCount;
			this._vertexAttributes = vertexAttributes;
			this._vertexStride     = vertexStride;
			this._vertexBuffer     = null;
			this._handleVertex     = emptyFunction;

			if (vertexStride > 0) {
				var vertexFuncStr = vertexLines.join("\n");
				this._handleVertex = eval("(" + vertexFuncStr + ")");
			}

			this._facesCount   = facesCount;
			this._indexBuffer  = null;
			this._handleFace   = emptyFunction;

			if (facesCount > 0) {
				var faceFuncStr = faceLines.join("\n");
				this._handleFace = eval("(" + faceFuncStr + ")");
			}
		},

		onBeginContent : function (header) {
		},

		onBeginElements : function (header, elementInfo) {
			switch (elementInfo.name) {
				case "vertex":
					this._vertexBuffer  = new ArrayBuffer(this._verticesCount * this._vertexStride);
					this._view          = new DataView(this._vertexBuffer);
					this._handleElement = this._handleVertex;
				break;
				case "face":
					this._indexBuffer   = new ArrayBuffer(this._facesCount * 3 * SpiderGL.Type.SIZEOF_UINT32);
					this._view          = new DataView(this._indexBuffer);
					this._handleElement = this._handleFace;
				break;
				default:
					this._view          = null;
					this._handleElement = emptyFunction;
				break;
			}
		},

		onElement : function (header, elementInfo, index, element) {
			// bounding box calculation
			if (elementInfo.name=="vertex"){
				if(element.x < this._boundingBox.min[0])
					this._boundingBox.min[0] = element.x;
				if(element.y < this._boundingBox.min[1])
					this._boundingBox.min[1] = element.y;
				if(element.z < this._boundingBox.min[2])
					this._boundingBox.min[2] = element.z;
					
				if(element.x > this._boundingBox.max[0])
					this._boundingBox.max[0] = element.x;
				if(element.y > this._boundingBox.max[1])
					this._boundingBox.max[1] = element.y;
				if(element.z > this._boundingBox.max[2])
					this._boundingBox.max[2] = element.z;
			}

			this._handleElement(header, elementInfo, index, element);
		},

		onEndElements : function (header, elementInfo) {
			this._view          = null;
			this._handleElement = emptyFunction;
		},

		onEndContent : function () {
		},

		onEnd : function () {
			if ((this._verticesCount <= 0) && (this._facesCount <= 0)) return;

//			var gl = this._gl;
			var modelDescriptor = {
				version : "0.0.1.0 EXP",
				meta : {
				},
				data : {
					vertexBuffers : {
					},
					indexBuffers : {
					}
				},
				access : {
					vertexStreams : {
					},
					primitiveStreams : {
					}
				},
				semantic : {
					bindings : {
					},
					chunks : {
					}
				},
				logic : {
					parts : {
					}
				},
				control : {
				},
				extra : {
				}
			};

			var modelVertexBuffers    = modelDescriptor.data.vertexBuffers;
			var modelIndexBuffers     = modelDescriptor.data.indexBuffers;
			var modelVertexStreams    = modelDescriptor.access.vertexStreams;
			var modelPrimitiveStreams = modelDescriptor.access.primitiveStreams;
			var modelBindings         = modelDescriptor.semantic.bindings;
			var modelChunks           = modelDescriptor.semantic.chunks;
			var modelParts            = modelDescriptor.logic.parts;

			modelDescriptor.extra.boundingBox = this._boundingBox;

			modelDescriptor.extra.renderMode = this._renderMode;

			modelDescriptor.extra.hasPosition = this._hasPosition;
			modelDescriptor.extra.hasNormal   = this._hasNormal;
			modelDescriptor.extra.hasColor    = this._hasColor;
			modelDescriptor.extra.hasTexCoord = this._hasTexCoord;

			modelDescriptor.extra.textureUrl = this._textureUrl;

			var maxVerticesCount = (1 << 16) - 1;

			var baseVertexBufferName = "mainVertexBuffer";
			var baseIndexBufferName  = "mainIndexBuffer";
			var baseBindingName      = "mainBinding";
			var baseChunkName        = "mainChunk";
			var basePointStreamName  = "vertices";
			var baseTriStreamName    = "triangles";
			var basePartName         = "mainPart";

			if (this._facesCount > 0) {
				var littleEndian = SpiderGL.Type.LITTLE_ENDIAN;
				var indexStride  = SpiderGL.Type.SIZEOF_UINT32;
				var wholeSize    = Float64Array.BYTES_PER_ELEMENT;

				var stride       = this._vertexStride;
				var partCount    = stride % wholeSize;
				var wholeCount   = (stride - partCount) / wholeSize;

				var vertexBufferView = new Uint8Array(this._vertexBuffer);
				var indexBufferView  = new Uint32Array(this._indexBuffer);

				var chunksCount        = 0;
				var chunkVertexBuffers = [ ];
				var chunkVerticesCount = [ ];
				var chunkIndexBuffers  = [ ];
				var chunkIndicesCount  = [ ];

				var facesLeft        = this._facesCount;
				var currFaceIndex    = 0;

				var indicesBuffer = new Uint32Array(this._facesCount * 3);

				while (facesLeft > 0) {
					var verticesMap   = new Uint32Array(this._verticesCount);
					var verticesNew   = new Uint32Array(maxVerticesCount);
					var verticesCount = 0;
					var indicesCount  = 0;
					var facesCount    = 0;

					while ((verticesCount <= (maxVerticesCount - 3)) && (facesLeft > 0)) {
						for (var k=0; k<3; ++k, ++currFaceIndex) {
							var v = indexBufferView[currFaceIndex];
							var r = verticesMap[v];
							if (!r) {
								verticesNew[verticesCount++] = v;
								verticesMap[v] = verticesCount;
							}
							indicesBuffer[indicesCount++] = v;
						}
						facesLeft--;
						facesCount++;
					}

					if (facesCount <= 0) continue;

					var chunkVertexBuffer     = new ArrayBuffer(verticesCount * stride);
					var chunkVertexBufferView = new Uint8Array(chunkVertexBuffer);
					var chunkIndexBuffer      = new Uint16Array(indicesCount);

					for (var i=0; i<indicesCount; ++i) {
						chunkIndexBuffer[i] = verticesMap[indicesBuffer[i]] - 1;
					}

					var s = 0;
					for (var i=0, d=0; i<verticesCount; ++i, d+=stride) {
						s = verticesNew[i] * stride;
						chunkVertexBufferView.set(vertexBufferView.subarray(s, s + stride), d);
					}

					chunkVertexBuffers.push(chunkVertexBuffer);
					chunkVerticesCount.push(verticesCount);
					chunkIndexBuffers.push(chunkIndexBuffer);
					chunkIndicesCount.push(indicesCount);
					chunksCount++;
				}

				var partChunks = new Array(chunksCount);

				for (var i=0; i<chunksCount; ++i) {
					var vertexBufferName = baseVertexBufferName + i;
					var indexBufferName  = baseIndexBufferName  + i;
					var bindingName      = baseBindingName      + i;
					var chunkName        = baseChunkName        + i;

					modelVertexBuffers[vertexBufferName] = {
						typedArray : chunkVertexBuffers[i]
					};

					var binding = {
						vertexStreams : {
						},
						primitiveStreams : {
						}
					};
					modelBindings[bindingName] = binding;

					for (var a in this._vertexAttributes) {
						var attr = this._vertexAttributes[a];
						var vertexStreamName = a + i;
						modelVertexStreams[vertexStreamName] = {
							buffer : vertexBufferName,
							size   : attr.size,
							type   : attr.type,
							stride : this._vertexStride,
							offset : attr.offset,
							normalized : !!attr.normalized
						};
						binding.vertexStreams[a.toUpperCase()] = [vertexStreamName];
					}

					modelIndexBuffers[indexBufferName] = {
						typedArray : chunkIndexBuffers[i]
					};

					var pointStreamName = basePointStreamName + i;
					modelPrimitiveStreams[pointStreamName] = {
						mode  : SpiderGL.Type.POINTS,
						count : chunkVerticesCount[i]
					};
					binding.primitiveStreams["POINT"] = [pointStreamName];

					var triStreamName = baseTriStreamName + i;
					modelPrimitiveStreams[triStreamName] = {
						buffer : indexBufferName,
						mode   : SpiderGL.Type.TRIANGLES,
						count  : chunkIndicesCount[i],
						type   : SpiderGL.Type.UINT16,
						offset : 0
					};
					binding.primitiveStreams["FILL"] = [triStreamName];

					var chunk = {
						techniques : {
							"common" : {
								binding : bindingName
							}
						}
					};
					modelChunks[chunkName] = chunk;

					partChunks[i] = chunkName;
				}

				modelParts[basePartName] = {
					chunks : partChunks
				};

				this._renderMode.unshift("FILL");
			}
			else {
				var binding = {
					vertexStreams : {
					},
					primitiveStreams : {
					}
				};
				modelBindings[baseBindingName] = binding;

				if (this._verticesCount > 0) {
					var vertexBufferName = baseVertexBufferName;
					modelVertexBuffers[vertexBufferName] = {
						typedArray : this._vertexBuffer
					};

					for (var a in this._vertexAttributes) {
						var attr = this._vertexAttributes[a];
						modelVertexStreams[a] = {
							buffer : vertexBufferName,
							size   : attr.size,
							type   : attr.type,
							stride : this._vertexStride,
							offset : attr.offset,
							normalized : !!attr.normalized
						};
						binding.vertexStreams[a.toUpperCase()] = [a];
					}

					modelPrimitiveStreams[basePointStreamName] = {
						mode   : SpiderGL.Type.POINTS,
						count  : this._verticesCount
					};
					binding.primitiveStreams["POINT"] = [basePointStreamName];
				}

				if ((this._verticesCount > 0) || (this._facesCount > 0)) {
					modelChunks[baseChunkName] = {
						techniques : {
							"common" : {
								binding : baseBindingName
							}
						}
					};

					modelParts[basePartName] = {
						chunks : [baseChunkName]
					};
				}
			}

			this._modelDescriptor = modelDescriptor;
		}
	};

	function mainImportPly(buffer) {
		var handler = new PlyHandler(buffer);
		parsePly(buffer, handler);
		var modelDescriptor = handler.modelDescriptor;
		return modelDescriptor;
	};

	return mainImportPly;
})();
