/*
SpiderGL Computer Graphics Library
Copyright (c) 2010, Marco Di Benedetto - Visual Computing Lab, ISTI - CNR
All rights reserved.

Redistribution and use in source and binary forms, with or without
modification, are permitted provided that the following conditions are met:
    * Redistributions of source code must retain the above copyright
      notice, this list of conditions and the following disclaimer.
    * Redistributions in binary form must reproduce the above copyright
      notice, this list of conditions and the following disclaimer in the
      documentation and/or other materials provided with the distribution.
    * Neither the name of SpiderGL nor the
      names of its contributors may be used to endorse or promote products
      derived from this software without specific prior written permission.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
DISCLAIMED. IN NO EVENT SHALL PAUL BRUNT BE LIABLE FOR ANY
DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
(INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
(INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
*/

/**
 * @fileOverview Namespace
 */

/**
 * The SpiderGL namespace.
 *
 * @namespace The SpiderGL namespace.
 */
var SpiderGL = { };

/**
 * Utility tag for any use.
 *
 * @type any
 */
SpiderGL.TAG = 0;

/**
 * Publishes SpiderGL modules content to a global object.
 *
 * The effect is to pollute the global object with the SpiderGL symbols. At the same time, it allows a faster and less verbose code.
 *
 * @param {object} [options] Symbols publishing options.
 * @param {object} [options.globalObject=SpiderGL.openNamespace.DEFAULT_GLOBAL_OBJECT] The global object to which inject SpiderGL symbols.
 * @param {string} [options.constantPrefix=SpiderGL.openNamespace.DEFAULT_CONSTANT_PREFIX] String prefix for constants.
 * @param {string} [options.functionPrefix=SpiderGL.openNamespace.DEFAULT_FUNCTION_PREFIX] String prefix for functions. The first letter of the function identifier will be made capital.
 * @param {string} [options.classPrefix=SpiderGL.openNamespace.DEFAULT_CLASS_PREFIX] String prefix for classes and sub-modules.
 */
SpiderGL.openNamespace = function (options) {
	options = SpiderGL.Utility.getDefaultObject({
		globalObject   : SpiderGL.openNamespace.DEFAULT_GLOBAL_OBJECT,
		constantPrefix : SpiderGL.openNamespace.DEFAULT_CONSTANT_PREFIX,
		functionPrefix : SpiderGL.openNamespace.DEFAULT_FUNCTION_PREFIX,
		classPrefix    : SpiderGL.openNamespace.DEFAULT_CLASS_PREFIX
	}, options);

	var constantRegExp = new RegExp("^(([_\$0-9A-Z])+)$");
	function isConstant(name) {
		return constantRegExp.test(name);
	}

	var namespaceOrClassRegExp = new RegExp("^([A-Z])");
	function isNamespaceOrClass(name) {
		return (namespaceOrClassRegExp.test(name) && !isConstant(name));
	}

	var functionRegExp = new RegExp("^(([a-z])+([_\$0-9A-Za-z])*)$");
	function isFunction(name) {
		return functionRegExp.test(name);
	}

	function initialCap(name) {
		return (name.substr(0, 1).toUpperCase() + name.substr(1));
	}

	var classes    = { };
	var functions  = { };
	var constants  = { };

	function collect(module) {
		if (!module) return;
		for (var x in module) {
			if (x.substr(0, 1) == "_") continue;
			var y = module[x];
			if (isNamespaceOrClass(x)) {
				//if (classes[x]) log("Duplicate: " + x);
				classes[x] = y;
			}
			else if (isFunction(x)) {
				//if (functions[x]) log("Duplicate: " + x);
				functions[x] = y;
			}
			else if (isConstant(x)) {
				//if (constants[x]) log("Duplicate: " + x);
				constants[x] = y;
			}
			else {
				//log("Unknown : " + x);
			}
		}
	}

	var modules = [
		"Core",
		"DOM",
		"IO",
		"Math",
		"Mesh",
		"Model",
		"Semantic",
		"Space",
		"Type",
		"UserInterface",
		"Utility",
		"Version",
		"WebGL"
	];

	for (var x in modules) {
		collect(SpiderGL[modules[x]]);
	}

	for (var x in classes) {
		var name = options.classPrefix + initialCap(x);
		//log("CLASS    : " + name);
		options.globalObject[name] = classes[x];
	}

	for (var x in functions) {
		var name = options.functionPrefix + initialCap(x);
		//log("FUNCTION : " + name);
		options.globalObject[name] = functions[x];
	}

	for (var x in constants) {
		var name = options.constantPrefix + initialCap(x);
		//log("CONSTANT : " + name);
		options.globalObject[name] = constants[x];
	}
};

/**
 * Default publishing global object.
 *
 * @type object
 *
 * @default window
 */
SpiderGL.openNamespace.DEFAULT_GLOBAL_OBJECT = window;

/**
 * Default publishing prefix for constant symbols.
 *
 * @type string
 *
 * @default "SGL_"
 */
SpiderGL.openNamespace.DEFAULT_CONSTANT_PREFIX = "SGL_";

/**
 * Default publishing prefix for function symbols.
 *
 * @type string
 *
 * @default "sgl"
 */
SpiderGL.openNamespace.DEFAULT_FUNCTION_PREFIX = "sgl";

/**
 * Default publishing prefix for classes and sub-modules symbols.
 *
 * @type string
 *
 * @default "Sgl"
 */
SpiderGL.openNamespace.DEFAULT_CLASS_PREFIX = "Sgl";
/*
SpiderGL Computer Graphics Library
Copyright (c) 2010, Marco Di Benedetto - Visual Computing Lab, ISTI - CNR
All rights reserved.

Redistribution and use in source and binary forms, with or without
modification, are permitted provided that the following conditions are met:
    * Redistributions of source code must retain the above copyright
      notice, this list of conditions and the following disclaimer.
    * Redistributions in binary form must reproduce the above copyright
      notice, this list of conditions and the following disclaimer in the
      documentation and/or other materials provided with the distribution.
    * Neither the name of SpiderGL nor the
      names of its contributors may be used to endorse or promote products
      derived from this software without specific prior written permission.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
DISCLAIMED. IN NO EVENT SHALL PAUL BRUNT BE LIABLE FOR ANY
DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
(INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
(INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
*/

/**
 * @fileOverview Version
 */

/**
 * The SpiderGL.Version namespace.
 *
 * @namespace The SpiderGL.Version namespace.
 */
SpiderGL.Version = { };

/**
 * Major version number.
 *
 * @constant
 * @type number
 */
SpiderGL.Version.VERSION_MAJOR = 0;

/**
 * Minor version number.
 *
 * @constant
 * @type number
 */
SpiderGL.Version.VERSION_MINOR = 2;

/**
 * Revision version number.
 *
 * @constant
 * @type number
 */
SpiderGL.Version.VERSION_REVISION = 1;

/**
 * Version string.
 *
 * The version string is: "{@link SpiderGL.Version.VERSION_MAJOR}.{@link SpiderGL.Version.VERSION_MINOR}.{@link SpiderGL.Version.VERSION_REVISION}"
 *
 * @constant
 * @type string
 */
SpiderGL.Version.VERSION_STRING = SpiderGL.Version.VERSION_MAJOR + "." + SpiderGL.Version.VERSION_MINOR + "." + SpiderGL.Version.VERSION_REVISION;

/*
SpiderGL Computer Graphics Library
Copyright (c) 2010, Marco Di Benedetto - Visual Computing Lab, ISTI - CNR
All rights reserved.

Redistribution and use in source and binary forms, with or without
modification, are permitted provided that the following conditions are met:
    * Redistributions of source code must retain the above copyright
      notice, this list of conditions and the following disclaimer.
    * Redistributions in binary form must reproduce the above copyright
      notice, this list of conditions and the following disclaimer in the
      documentation and/or other materials provided with the distribution.
    * Neither the name of SpiderGL nor the
      names of its contributors may be used to endorse or promote products
      derived from this software without specific prior written permission.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
DISCLAIMED. IN NO EVENT SHALL PAUL BRUNT BE LIABLE FOR ANY
DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
(INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
(INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
*/

/**
 * @fileOverview Core
 */

/**
 * The SpiderGL.Core namespace.
 *
 * @namespace The SpiderGL.Core namespace.
 */
SpiderGL.Core = { };

/**
 * Default token.
 *
 * This constant can be used to set a parameter to its default value.
 *
 * @constant
 * @type object
 *
 * @example
 * texture.setSampler({
 *   wrapS : gl.REPEAT,
 *   wrapT : SpiderGL.Core.DEFAULT // set to the default value gl.CLAMP_TO_EDGE
 * });
 */
SpiderGL.Core.DEFAULT = { };

/**
 * Don't care token.
 *
 * This constant can be used to avoid setting policy/behavior parameter.
 *
 * @constant
 * @type object
 *
 * @example
 * texture.setImage({
 *   data  : image,
 *   flipY : SpiderGL.Core.DONT_CARE // overrides the texture automatic flipY policy and keeps current gl setting
 * });
 */
SpiderGL.Core.DONT_CARE = { };

/**
 * Alias for "".
 *
 * @constant
 * @type string
 */
SpiderGL.Core.EMPTY_STRING = "";

/**
 * Alias for { }.
 *
 * @constant
 * @type object
*/
SpiderGL.Core.EMPTY_OBJECT = { };

/**
 * Alias for [ ].
 *
 * @constant
 * @type array
*/
SpiderGL.Core.EMPTY_ARRAY = [ ];

/**
 * Alias for function () { }.
 *
 * It can be used as a function parameter or event handler to avoid checking whether the provided function is not null or undefined.
 *
 * @constant
 * @type function
 *
 * @example
 * // avoid test for null/undefined when invoking an event handler
 * someObject.onSomeEvent = SpiderGL.Core.EMPTY_FUNCTION;
 */
SpiderGL.Core.EMPTY_FUNCTION = function () { };

/**
 * Generates a unique id.
 *
 * @returns {number} A unique id.
 */
SpiderGL.Core.generateUID = function () {
	SpiderGL.Core.generateUID._lastUID++;
	return SpiderGL.Core.generateUID._lastUID;
}

SpiderGL.Core.generateUID._lastUID = 0;

/**
 * Creates a SpiderGL.Core.ObjectBase
 *
 * SpiderGL.Core.ObjectBase is the base class for all SpiderGL classes.
 *
 * @class The SpiderGL.Core.ObjectBase is the base class for all SpiderGL classes.
 */
SpiderGL.Core.ObjectBase = function () {
	this._uid = SpiderGL.Core.generateUID();
};

SpiderGL.Core.ObjectBase.prototype = {
	/**
	 * The object unique identifier.
	 *
	 * @type number
	 *
	 * @readonly
	 */
	get uid() {
		return this._uid;
	}
};
/*
SpiderGL Computer Graphics Library
Copyright (c) 2010, Marco Di Benedetto - Visual Computing Lab, ISTI - CNR
All rights reserved.

Redistribution and use in source and binary forms, with or without
modification, are permitted provided that the following conditions are met:
    * Redistributions of source code must retain the above copyright
      notice, this list of conditions and the following disclaimer.
    * Redistributions in binary form must reproduce the above copyright
      notice, this list of conditions and the following disclaimer in the
      documentation and/or other materials provided with the distribution.
    * Neither the name of SpiderGL nor the
      names of its contributors may be used to endorse or promote products
      derived from this software without specific prior written permission.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
DISCLAIMED. IN NO EVENT SHALL PAUL BRUNT BE LIABLE FOR ANY
DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
(INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
(INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
*/

/**
 * @fileOverview Type
 */

/**
 * The SpiderGL.Type namespace.
 *
 * @namespace The SpiderGL.Type namespace.
 */
SpiderGL.Type = { };

/**
 * Little-Endian flag.
 * It is true if the host system is little endian, false otherwise.
 *
 * @constant
 * @type bool
 *
 * @see SpiderGL.Type.BIG_ENDIAN
 */
SpiderGL.Type.LITTLE_ENDIAN = (function(){
	var a = new Uint8Array([0x12, 0x34]);
	var b = new Uint16Array(a.buffer);
	return (b[0] == 0x3412);
})();

/**
 * Big-Endian flag.
 * It is true if the host system is big endian, false otherwise.
 *
 * @constant
 * @type bool
 *
 * @see SpiderGL.Type.LITTLE_ENDIAN
 */
SpiderGL.Type.BIG_ENDIAN = !SpiderGL.Type.BIG_ENDIAN;

/**
 * Constant for undefined (void) type.
 *
 * @constant
 * @type number
 */
SpiderGL.Type.NO_TYPE = 0;

/**
 * Constant for 8-bit signed integer type.
 *
 * @constant
 * @type number
 */
SpiderGL.Type.INT8 = 1;

/**
 * Constant for 8-bit unsigned integer type.
 *
 * @constant
 * @type number
 */
SpiderGL.Type.UINT8 = 2;

/**
 * Constant for 16-bit signed integer type.
 *
 * @constant
 * @type number
 */
SpiderGL.Type.INT16 = 3;

/**
 * Constant for 16-bit unsigned integer type.
 *
 * @constant
 * @type number
 */
SpiderGL.Type.UINT16 = 4;

/**
 * Constant for 32-bit signed integer type.
 *
 * @constant
 * @type number
 */
SpiderGL.Type.INT32 = 5;

/**
 * Constant for 32-bit unsigned integer type.
 *
 * @constant
 * @type number
 */
SpiderGL.Type.UINT32 = 6;

/**
 * Constant for 32-bit floating point type.
 *
 * @constant
 * @type number
 */
SpiderGL.Type.FLOAT32 = 7;

/**
 * Alias for Int8Array.BYTES_PER_ELEMENT.
 *
 * @constant
 * @type number
 */
SpiderGL.Type.SIZEOF_INT8 = Int8Array.BYTES_PER_ELEMENT;

/**
 * Alias for Uint8Array.BYTES_PER_ELEMENT.
 *
 * @constant
 * @type number
 */
SpiderGL.Type.SIZEOF_UINT8 = Uint8Array.BYTES_PER_ELEMENT;

/**
 * Alias for Int16Array.BYTES_PER_ELEMENT.
 *
 * @constant
 * @type number
 */
SpiderGL.Type.SIZEOF_INT16 = Int16Array.BYTES_PER_ELEMENT;

/**
 * Alias for Uint16Array.BYTES_PER_ELEMENT.
 *
 * @constant
 * @type number
 */
SpiderGL.Type.SIZEOF_UINT16 = Uint16Array.BYTES_PER_ELEMENT;

/**
 * Alias for Int32Array.BYTES_PER_ELEMENT.
 *
 * @constant
 * @type number
 */
SpiderGL.Type.SIZEOF_INT32 = Int32Array.BYTES_PER_ELEMENT;

/**
 * Alias for Uint32Array.BYTES_PER_ELEMENT.
 *
 * @constant
 * @type number
 */
SpiderGL.Type.SIZEOF_UINT32 = Uint32Array.BYTES_PER_ELEMENT;

/**
 * Alias for Float32Array.BYTES_PER_ELEMENT.
 *
 * @constant
 * @type number
 */
SpiderGL.Type.SIZEOF_FLOAT32 = Float32Array.BYTES_PER_ELEMENT;

/* *
 * Alias for Float64Array.BYTES_PER_ELEMENT.
 *
 * @constant
 * @type number
 */
//var SpiderGL.Type.SIZEOF_FLOAT64 = Float64Array.BYTES_PER_ELEMENT;

/**
 * Returns the size of the type expressed by the passed symbolic constant.
 *
 * @param {number} sglType A SpiderGL type symbolic constants, i.e. SpiderGL.Type.UINT8.
 * @return {number} The size in bytes of the type.
 */
SpiderGL.Type.typeSize = (function(){
	var typeMap = { };
	typeMap[SpiderGL.Type.NO_TYPE] = 0;
	typeMap[SpiderGL.Type.INT8   ] = SpiderGL.Type.SIZEOF_INT8;
	typeMap[SpiderGL.Type.UINT8  ] = SpiderGL.Type.SIZEOF_UINT8;
	typeMap[SpiderGL.Type.INT16  ] = SpiderGL.Type.SIZEOF_INT16;
	typeMap[SpiderGL.Type.UINT16 ] = SpiderGL.Type.SIZEOF_UINT16;
	typeMap[SpiderGL.Type.INT32  ] = SpiderGL.Type.SIZEOF_INT32;
	typeMap[SpiderGL.Type.UINT32 ] = SpiderGL.Type.SIZEOF_UINT32;
	typeMap[SpiderGL.Type.FLOAT32] = SpiderGL.Type.SIZEOF_FLOAT32;
	return function (sglType) {
		return typeMap[sglType];
	};
})();

/**
 * Maps a SpiderGL type symbolic constant to a WebGL type constant.
 * For example, calling this function with SpiderGL.Type.UINT8 as argument will return WebGLRenderingContext.UNSIGNED_BYTE.
 *
 * @param {number} sglType A SpiderGL type symbolic constants, i.e. SpiderGL.Type.UINT8.
 * @return {number} The corresponding WebGLRenderingContext type constant, i.e. WebGLRenderingContext.UNSIGNED_BYTE.
 */
SpiderGL.Type.typeToGL = (function(){
	var typeMap = { };
	typeMap[SpiderGL.Type.NO_TYPE] = WebGLRenderingContext.NONE;
	typeMap[SpiderGL.Type.INT8   ] = WebGLRenderingContext.BYTE;
	typeMap[SpiderGL.Type.UINT8  ] = WebGLRenderingContext.UNSIGNED_BYTE;
	typeMap[SpiderGL.Type.INT16  ] = WebGLRenderingContext.SHORT;
	typeMap[SpiderGL.Type.UINT16 ] = WebGLRenderingContext.UNSIGNED_SHORT;
	typeMap[SpiderGL.Type.INT32  ] = WebGLRenderingContext.INT;
	typeMap[SpiderGL.Type.UINT32 ] = WebGLRenderingContext.UNSIGNED_INT;
	typeMap[SpiderGL.Type.FLOAT32] = WebGLRenderingContext.FLOAT;
	return function (sglType) {
		return typeMap[sglType];
	};
})();

/**
 * Maps a WebGL type constant to a WebGL type constant.
 * For example, calling this function with WebGLRenderingContext.UNSIGNED_BYTE as argument will return SpiderGL.Type.UINT8.
 *
 * @param {number} glType A WebGL type symbolic constants, i.e. WebGLRenderingContext.UNSIGNED_BYTE.
 * @return {number} The corresponding SpiderGL type constant, i.e. SpiderGL.Type.UINT8.
 */
SpiderGL.Type.typeFromGL = (function(){
	var typeMap = { };
	typeMap[WebGLRenderingContext.NONE          ] = SpiderGL.Type.NO_TYPE;
	typeMap[WebGLRenderingContext.BYTE          ] = SpiderGL.Type.INT8;
	typeMap[WebGLRenderingContext.UNSIGNED_BYTE ] = SpiderGL.Type.UINT8;
	typeMap[WebGLRenderingContext.SHORT         ] = SpiderGL.Type.INT16;
	typeMap[WebGLRenderingContext.UNSIGNED_SHORT] = SpiderGL.Type.UINT16;
	typeMap[WebGLRenderingContext.INT           ] = SpiderGL.Type.INT32;
	typeMap[WebGLRenderingContext.UNSIGNED_INT  ] = SpiderGL.Type.UINT32;
	typeMap[WebGLRenderingContext.FLOAT         ] = SpiderGL.Type.FLOAT32;
	return function (glType) {
		return typeMap[glType];
	};
})();

/**
 * Returns the size of the type expressed by the passed WebGL type symbolic constant.
 *
 * @param {number} glType A WebGL type symbolic constants, i.e. WebGLRenderingContext.UNSIGNED_BYTE.
 * @return {number} The size in bytes of the type.
 */
SpiderGL.Type.typeSizeFromGL = function (glType) {
	var sglType = SpiderGL.Type.typeFromGL(glType);
	return SpiderGL.Type.typeSize(sglType);
};

/**
 * Maps a SpiderGL type symbolic constant to a TypedArray constructor.
 * For example, calling this function with SpiderGL.Type.UINT8 as argument will return Uint8Array.
 *
 * @param {number} sglType A SpiderGL type symbolic constants, i.e. SpiderGL.Type.UINT8.
 * @return {function} The corresponding TypedArray constructor function, i.e. Uint8Array.
 */
SpiderGL.Type.typeToTypedArrayConstructor = (function(){
	var typeMap = { };
	typeMap[SpiderGL.Type.NO_TYPE] = ArrayBuffer;
	typeMap[SpiderGL.Type.INT8   ] = Int8Array;
	typeMap[SpiderGL.Type.UINT8  ] = Uint8Array;
	typeMap[SpiderGL.Type.INT16  ] = Int16Array;
	typeMap[SpiderGL.Type.UINT16 ] = Uint16Array;
	typeMap[SpiderGL.Type.INT32  ] = Int32Array;
	typeMap[SpiderGL.Type.UINT32 ] = Uint32Array;
	typeMap[SpiderGL.Type.FLOAT32] = Float32Array;
	return function (sglType) {
		return typeMap[sglType];
	};
})();

SpiderGL.Type.POINTS         = 0;
SpiderGL.Type.LINES          = 1;
SpiderGL.Type.LINE_LOOP      = 2;
SpiderGL.Type.LINE_STRIP     = 3;
SpiderGL.Type.TRIANGLES      = 4;
SpiderGL.Type.TRIANGLE_FAN   = 5;
SpiderGL.Type.TRIANGLE_STRIP = 6;

SpiderGL.Type.primitiveToGL = (function(){
	var enumMap = { };
	enumMap[SpiderGL.Type.POINTS        ] = WebGLRenderingContext.POINTS;
	enumMap[SpiderGL.Type.LINES         ] = WebGLRenderingContext.LINES;
	enumMap[SpiderGL.Type.LINE_LOOP     ] = WebGLRenderingContext.LINE_LOOP;
	enumMap[SpiderGL.Type.LINE_STRIP    ] = WebGLRenderingContext.LINE_STRIP;
	enumMap[SpiderGL.Type.TRIANGLES     ] = WebGLRenderingContext.TRIANGLES;
	enumMap[SpiderGL.Type.TRIANGLE_FAN  ] = WebGLRenderingContext.TRIANGLE_FAN;
	enumMap[SpiderGL.Type.TRIANGLE_STRIP] = WebGLRenderingContext.TRIANGLE_STRIP;
	return function (sglEnum) {
		return enumMap[sglEnum];
	};
})();

/**
 * Tests the instance.
 *
 * The arg is tested to belong to a ctor function constructor.
 *
 * @param {any} arg The object to check.
 * @param {constructor} ctor The class (i.e. the function constructor) that is tested for creating the object.
 * @return {bool} True if arg is an instance of ctor, false otherwise.
 */
SpiderGL.Type.instanceOf = function (arg, ctor) {
	return (arg instanceof ctor);
}

/**
 * Tests whether the argument is a number.
 *
 * @param {any} arg The object to check.
 * @return {bool} True if arg is a number, false otherwise.
 */
SpiderGL.Type.isNumber = function (arg) {
	return (typeof arg == "number");
}

/**
 * Tests whether the argument is a string.
 *
 * @param {any} arg The object to check.
 * @return {bool} True if arg is a string, false otherwise.
 */
SpiderGL.Type.isString = function (arg) {
	return (typeof arg == "string");
}

/**
 * Tests whether the argument is a function.
 *
 * @param {any} arg The object to check.
 * @return {bool} True if arg is a function, false otherwise.
 */
SpiderGL.Type.isFunction = function (arg) {
	return (typeof arg == "function");
}

/**
 * Tests whether the argument is an array.
 *
 * @param {any} arg The object to check.
 * @return {bool} True if arg is an array, false otherwise.
 */
SpiderGL.Type.isArray = function (arg) {
	return (arg && arg.constructor === Array);
}

/**
 * Tests whether the argument is a typed array.
 *
 * @param {any} arg The object to check.
 * @return {bool} True if arg is a typed array, false otherwise.
 */
SpiderGL.Type.isTypedArray = function (arg) {
	return (arg && (typeof arg.buffer != "undefined") && (arg.buffer instanceof ArrayBuffer));
}

/**
 * Implements inheritance.
 *
 * A class derivation is established between derived and base. The derived object can be successfully tested as being a base instance and inherits base properties and methods.
 * It is possible to override base properties and methods by redefining them.
 * This function must be called after assigning the derived prototype object.
 *
 * @param {constructor} derived The derived class.
 * @param {constructor} base The base class.
 *
 * @example
 * function Base(x, y) {
 *   this.x = x;
 *   this.y = y;
 * };
 *
 * Base.prototype = {
 *   alertX : function () { alert("Base X: " + this.x); },
 *   alertY : function () { alert("Base Y: " + this.y); }
 * };
 *
 * function Derived(x, y, z) {
 *   Base.call(this, x, y);
 *   this.z = z;
 * };
 *
 * Derived.prototype = {
 *   alertY : function () { alert("Derived Y: " + this.y); },
 *   alertZ : function () { alert("Derived Z: " + this.z); },
 * };
 *
 * SpiderGL.Type.extend(base, derived);
 *
 * var b = new Base(1, 2);
 * b.alertX(); // alerts "Base X: 1"
 * b.alertY(); // alerts "Base Y: 2"
 *
 * var d = new Base(3, 4, 5);
 * d.alertX(); // alerts "Base X: 3"     (base method is kept)
 * d.alertY(); // alerts "Derived Y: 4"  (base method is overridden)
 * d.alertZ(); // alerts "Derived Y: 5"  (new derived method is called)
 */
SpiderGL.Type.extend = function(derived, base /*, installBaseInfo*/) {
	function inheritance() { }
	inheritance.prototype = base.prototype;

	var dproto = derived.prototype;
	var iproto = new inheritance();
	iproto.constructor = derived;

	var getter = null;
	var setter = null;
	for (var p in dproto) {
		getter = dproto.__lookupGetter__(p);
		if (getter) { iproto.__defineGetter__(p, getter); }

		setter = dproto.__lookupSetter__(p);
		if (setter) { iproto.__defineSetter__(p, setter); }

		if (!getter && !setter) { iproto[p] = dproto[p]; }
	}

	derived.prototype = iproto;

	/*
	if (installBaseInfo) {
		derived.superConstructor = base;
		derived.superClass       = base.prototype;
	}
	*/
}

SpiderGL.Type.defineClassGetter = function(ctor, name, func) {
	ctor.prototype.__defineGetter__(name, func);
}

SpiderGL.Type.defineClassSetter = function(ctor, name, func) {
	ctor.prototype.__defineSetter__(name, func);
}

SpiderGL.Type.defineObjectGetter = function(obj, name, func) {
	obj.__defineGetter__(name, func);
}

SpiderGL.Type.defineObjectSetter = function(obj, name, func) {
	obj.__defineSetter__(name, func);
}

/*
SpiderGL Computer Graphics Library
Copyright (c) 2010, Marco Di Benedetto - Visual Computing Lab, ISTI - CNR
All rights reserved.

Redistribution and use in source and binary forms, with or without
modification, are permitted provided that the following conditions are met:
    * Redistributions of source code must retain the above copyright
      notice, this list of conditions and the following disclaimer.
    * Redistributions in binary form must reproduce the above copyright
      notice, this list of conditions and the following disclaimer in the
      documentation and/or other materials provided with the distribution.
    * Neither the name of SpiderGL nor the
      names of its contributors may be used to endorse or promote products
      derived from this software without specific prior written permission.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
DISCLAIMED. IN NO EVENT SHALL PAUL BRUNT BE LIABLE FOR ANY
DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
(INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
(INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
*/

/**
 * @fileOverview Utility
 */

/**
 * The SpiderGL.Utility namespace.
 *
 * @namespace The SpiderGL.Utility namespace.
 */
SpiderGL.Utility = { };

/**
 * Gets default value for varibles.
 *
 * This function is used to get default values for optional variables.
 * If arg is undefined or is {@link SpiderGL.Core.DEFAULT}, then defaultValue will be returned. Otherwise, arg will be returned.
 *
 * @returns {any} Returns arg if arg is not undefined and is not {@link SpiderGL.Core.DEFAULT}, otherwise returns defaultValue.
 *
 * @example
 * var DEFAULT_V = 1;
 *
 * var v = null;
 * v = SpiderGL.Utility.getDefaultValue(someVar, DEFAULT_V); // someVar is undefined, so v = DEFAULT_V
 *
 * var someVar = 2;
 * v = SpiderGL.Utility.getDefaultValue(someVar, DEFAULT_V); // someVar is defined, so v = someVar
 *
 * var someVar = SpiderGL.Core.DEFAULT;
 * v = SpiderGL.Utility.getDefaultValue(someVar, DEFAULT_V); // someVar is SpiderGL.Core.DEFAULT, so v = DEFAULT_V
 *
 * @example
 * var DEFAULT_Y = 1;
 * var DEFAULT_Z = 2;
 *
 * function setObject(obj, x, options) {
 *   options = options || { }; // create an empty object to avoid testing for null
 *   obj.x = x;
 *   obj.y = SpiderGL.Utility.getDefaultValue(options.y, DEFAULT_Y);
 *   obj.z = SpiderGL.Utility.getDefaultValue(options.z, DEFAULT_Z);
 * }
 *
 * var obj = {
 *   x : 0,
 *   y : 1,
 *   z : 2
 * };
 *
 * setObject(obj, 3);        // obj = { x:3, y:DEFAULT_Y, z:DEFAULT_Z }
 * setObject(obj, 4, {z:5}); // obj = { x:4, y:DEFAULT_Y, z:5         }
 */
SpiderGL.Utility.getDefaultValue = function (arg, defaultValue) {
	if ((arg === undefined) || (arg === SpiderGL.Core.DEFAULT)) { return defaultValue; }
	return arg;
}

/**
 * Gets default values for objects.
 *
 * @param {object} defaultObj The object containing the default values.
 * @param {object} obj The object from which values are extracted.
 *
 * @returns {object} The modified defaultObj.
 */
SpiderGL.Utility.getDefaultObject = function (defaultObj, obj) {
	if (obj) {
		var sDefault = SpiderGL.Core.DEFAULT;
		//var getter = null;
		for (var p in obj) {
			/* getter = obj.__lookupGetter__(p);
			if (getter) {
				defaultObj.__defineGetter__(p, getter);
			}
			else */ if (obj[p] != sDefault) {
				defaultObj[p] = obj[p];
			}
		}
	}
	return defaultObj;
};

/**
 * Sets default values for the passed object.
 *
 * @param {object} defaultObj The object containing the default values.
 * @param {object} obj The object from which values are extracted.
 *
 * @returns {object} The modified obj. If obj is null, defaultObj will be returned.
 */
SpiderGL.Utility.setDefaultValues = function (defaultObj, obj) {
	if (!obj) return defaultObj;

	var sDefault = SpiderGL.Core.DEFAULT;
	for (var p in obj) {
		if (obj[p] == sDefault) {
			if (typeof defaultObj[p] != "undefined") {
				obj[p] = defaultObj[p];
			}
		}
	}
	for (var p in defaultObj) {
		if (typeof obj[p] == "undefined") {
			obj[p] = defaultObj[p];
		}
	}
	return obj;
};

/**
 * Converts the input arguments to a 4-component Float32Array.
 * The input value is handled like WebGL handles constant vertex attributes,
 * that is, if the input parameter is null, a number, or an array with less than four components,
 * missing values are taken from the array [0, 0, 0, 1] at the respective position. 
 *
 * @param {null|undefined|number|array|Float32Array} x The input value.
 *
 * @returns {array} a 4-component array.
 *
 * @example
 * x = SpiderGL.Utility.getAttrib4fv();                        // x = [0, 0, 0, 1]
 * x = SpiderGL.Utility.getAttrib4fv(null);                    // x = [0, 0, 0, 1]
 * x = SpiderGL.Utility.getAttrib4fv(undefined);               // x = [0, 0, 0, 1]
 * x = SpiderGL.Utility.getAttrib4fv(0);                       // x = [0, 0, 0, 1]
 * x = SpiderGL.Utility.getAttrib4fv(7);                       // x = [7, 0, 0, 1]
 * x = SpiderGL.Utility.getAttrib4fv([]);                      // x = [0, 0, 0, 1]
 * x = SpiderGL.Utility.getAttrib4fv([1]);                     // x = [1, 0, 0, 1]
 * x = SpiderGL.Utility.getAttrib4fv([1, 2]);                  // x = [1, 2, 0, 1]
 * x = SpiderGL.Utility.getAttrib4fv([1, 2, 3]);               // x = [1, 2, 3, 1]
 * x = SpiderGL.Utility.getAttrib4fv([1, 2, 3, 4, 5, 6]);      // x = [1, 2, 3, 4]
 * x = SpiderGL.Utility.getAttrib4fv(new Float32Array([0,9]);  // x = [0, 9, 0, 1]
 */
SpiderGL.Utility.getAttrib4fv = function (x) {
	if (SpiderGL.Type.isNumber(x)) return [x, 0, 0, 1];
	if (!x) return [0, 0, 0, 1];
	return [
		(x[0] != undefined) ? x[0] : 0,
		(x[1] != undefined) ? x[1] : 0,
		(x[2] != undefined) ? x[2] : 0,
		(x[3] != undefined) ? x[3] : 1
	];
}

/**
 * Gets the number of milliseconds elapsed since January 1, 1970 at 00:00.
 * It is a utility function for (new Date()).getTime().
 *
 * @returns {number} The number of milliseconds elapsed since January 1, 1970 at 00:00.
 */
SpiderGL.Utility.getTime = function () {
	return (new Date()).getTime();
};

SpiderGL.Utility.Timer = function () {
	this._tStart   = -1;
	this._tElapsed = 0;
}

SpiderGL.Utility.Timer.prototype = {
	_accumElapsed : function () {
		this._tElapsed += this.now - this._tStart;
	},

	get now() {
		return Date.now();
	},

	start : function () {
		if (this.isStarted) return;
		if (this.isPaused)  return;
		this._tStart   = this.now;
		this._tElapsed = 0;
	},

	restart : function () {
		var r = this.elapsed;
		this._tStart   = this.now;
		this._tElapsed = 0;
		return r;
	},

	stop : function () {
		if (!this.isStarted) return;
		if (this.isPaused)   return;
		this._accumElapsed();
		this._tStart = -1;
	},

	get isStarted() {
		return (this._tStart >= 0);
	},

	pause : function () {
		if (!this.isStarted) return;
		if (this.isPaused)   return;
		this._accumElapsed();
		this._tStart = -2;
	},

	resume : function () {
		if (!this.isStarted) return;
		if (!this.isPaused)  return;
		this._tStart = this.now;
	},

	get isPaused() {
		return (this._tStart == -2);
	},

	get elapsed() {
		return ((this.isStarted) ? (this._tElapsed + (this.now - this._tStart)) : (this._tElapsed))
	}
};
/*
SpiderGL Computer Graphics Library
Copyright (c) 2010, Marco Di Benedetto - Visual Computing Lab, ISTI - CNR
All rights reserved.

Redistribution and use in source and binary forms, with or without
modification, are permitted provided that the following conditions are met:
    * Redistributions of source code must retain the above copyright
      notice, this list of conditions and the following disclaimer.
    * Redistributions in binary form must reproduce the above copyright
      notice, this list of conditions and the following disclaimer in the
      documentation and/or other materials provided with the distribution.
    * Neither the name of SpiderGL nor the
      names of its contributors may be used to endorse or promote products
      derived from this software without specific prior written permission.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
DISCLAIMED. IN NO EVENT SHALL PAUL BRUNT BE LIABLE FOR ANY
DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
(INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
(INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
*/

/**
 * @fileOverview DOM
 */

/**
 * The SpiderGL.DOM namespace.
 *
 * @namespace The SpiderGL.DOM namespace.
 */
SpiderGL.DOM = { };

/**
 * Gets a document element object by id.
 *
 * The returned element object is retrieved by a direct call to document.getElementById(id).
 *
 * @param {string} id The element id.
 * @return {Element} The document element.
 */
SpiderGL.DOM.getElementById = function (elementId) {
	return document.getElementById(elementId);
}

/**
 * Gets the text of a document element.
 *
 * The returned text is retrieved by concatenating the text content of internal element nodes.
 *
 * @param {string} id The element id.
 * @return {string} The text contained in the document element.
 */
SpiderGL.DOM.getElementText = function (elementId) {
	var elem = document.getElementById(elementId);
	if (!elem) return null;

	var str = "";
	elem = elem.firstChild;
	while (elem) {
		if (elem.nodeType == 3) {
			str += elem.textContent;
		}
		elem = elem.nextSibling;
	}

	return str;
}

/*
SpiderGL Computer Graphics Library
Copyright (c) 2010, Marco Di Benedetto - Visual Computing Lab, ISTI - CNR
All rights reserved.

Redistribution and use in source and binary forms, with or without
modification, are permitted provided that the following conditions are met:
    * Redistributions of source code must retain the above copyright
      notice, this list of conditions and the following disclaimer.
    * Redistributions in binary form must reproduce the above copyright
      notice, this list of conditions and the following disclaimer in the
      documentation and/or other materials provided with the distribution.
    * Neither the name of SpiderGL nor the
      names of its contributors may be used to endorse or promote products
      derived from this software without specific prior written permission.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
DISCLAIMED. IN NO EVENT SHALL PAUL BRUNT BE LIABLE FOR ANY
DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
(INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
(INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
*/

/**
 * @fileOverview IO
 */

/**
 * The SpiderGL.IO namespace.
 *
 * @namespace The SpiderGL.IO namespace.
 */
SpiderGL.IO = { };

/**
 * Creates a SpiderGL.IO.Request.
 *
 * SpiderGL.IO.Request is the base class for I/O requests.
 *
 * @class The SpiderGL.IO.Request is the base class for I/O requests.
 *
 * @augments SpiderGL.Core.ObjectBase
 */
SpiderGL.IO.Request = function (url, options) {
	SpiderGL.Core.ObjectBase.call(this);

	options = SpiderGL.Utility.getDefaultObject({
		async      : SpiderGL.IO.Request.DEFAULT_ASYNC,
		send       : SpiderGL.IO.Request.DEFAULT_SEND,
		onProgress : null,
		onCancel   : null,
		onError    : null,
		onSuccess  : null,
		onFinish   : null
	}, options);

	this._url     = url;
	this._async   = options.async;
	this._status  = SpiderGL.IO.Request.NONE;
	this._sent    = false;
	this._aborted = false;
	this._data    = null;
	this._loaded  = 0;
	this._total   = 0;

	this._events = {
		progress : { main : null, listeners : [ ] },
		cancel   : { main : null, listeners : [ ] },
		error    : { main : null, listeners : [ ] },
		success  : { main : null, listeners : [ ] },
		finish   : { main : null, listeners : [ ] }
	};

	this.onProgress = options.onProgress;
	this.onCancel   = options.onCancel;
	this.onError    = options.onError;
	this.onSuccess  = options.onSuccess;
	this.onFinish   = options.onFinish;
};

SpiderGL.IO.Request.NONE      = 0;
SpiderGL.IO.Request.ONGOING   = 1;
SpiderGL.IO.Request.CANCELLED = 2;
SpiderGL.IO.Request.FAILED    = 3;
SpiderGL.IO.Request.SUCCEEDED = 4;

SpiderGL.IO.Request.DEFAULT_ASYNC = true;
SpiderGL.IO.Request.DEFAULT_SEND  = true;

SpiderGL.IO.Request.prototype = {
	_indexOf : function (handlers, h) {
		for (var i=0, n=handlers.length; i<n; ++i) {
			if (handlers[i] == h) {
				return i;
			}
		}
		return -1;
	},

	_setMainListener : function (eventName, eventHandler) {
		var evt = this._events[eventName];
		if (!evt) return;
		if (evt.main == eventHandler) return;
		if (eventHandler) { this.addEventListener(eventName, eventHandler); }
		else { this.removeEventListener(eventName, eventHandler); }
		evt.main = eventHandler;
	},

	_dispatch : function () {
		var name = arguments[0];
		var evt  = this._events[name];
		if (!evt) return;
		var args = Array.prototype.slice.call(arguments, 1);
		args.push(this);
		var lst  = evt.listeners;
		for (var i=0, n=lst.length; i<n; ++i) {
			lst[i].apply(null, args);
		}
	},

	_doPostProgress : function () {
	},

	_doPostCancel : function () {
	},

	_doPostError : function () {
	},

	_doPostSuccess : function () {
	},

	_doPostFinish : function () {
	},

	_doOnProgress : function (loaded, total) {
		if (this._aborted) return;
		this._loaded = loaded;
		this._total  = total;
		this._doPostProgress();
		this._dispatch("progress", this._loaded, this._total);
	},

	_doOnCancel : function () {
		if (this._aborted) return;
		this._status = SpiderGL.IO.Request.CANCELLED;
		this._finishTime = SpiderGL.Utility.getTime();
		this._doPostCancel();
		this._dispatch("cancel");
	},

	_doOnError : function () {
		if (this._aborted) return;
		this._status = SpiderGL.IO.Request.FAILED;
		this._finishTime = SpiderGL.Utility.getTime();
		this._doPostError();
		this._dispatch("error");
	},

	_doOnSuccess : function () {
		if (this._aborted) return;
		this._status = SpiderGL.IO.Request.SUCCEEDED;
		this._finishTime = SpiderGL.Utility.getTime();
		this._doPostSuccess();
		this._dispatch("success");
	},

	_doOnFinish : function () {
		this._doPostFinish();
		this._dispatch("finish");
	},

	_doSend : function () {
		return false;
	},

	_doCancel : function () {
		return false;
	},

	get canSend() {
		return (this._url && !this._sent);
	},

	get url() {
		return this._url;
	},

	set url(s) {
		this.cancel();
		this._url = s;
	},

	get status() {
		return this._status;
	},

	get data() {
		return this._data;
	},

	get bytesLoaded() {
		return this._loaded;
	},

	get bytesTotal() {
		return this._total;
	},

	get sent() {
		return this._sent;
	},

	get ongoing() {
		return (this._status == SpiderGL.IO.Request.ONGOING);
	},

	get cancelled() {
		return (this._status == SpiderGL.IO.Request.CANCELLED);
	},

	get failed() {
		return (this._status == SpiderGL.IO.Request.FAILED);
	},

	get succeeded() {
		return (this._status == SpiderGL.IO.Request.SUCCEEDED);
	},

	get finished() {
		return (this.succeeded || this.failed || this.cancelled);
	},

	get startTime() {
		return this._startTime;
	},

	get finishTime() {
		return this._finishTime;
	},

	get elapsedTime() {
		if (this._startTime < 0) return 0;
		if (this._finishTime < 0) return (SpiderGL.Utility.getTime() - this._startTime);
		return (this._finishTime - this._startTime);
	},

	addEventListener : function (eventName, eventHandler) {
		if (!eventHandler) return;
		var evt = this._events[eventName];
		if (!evt) return;
		var idx = this._indexOf(evt.listeners, eventHandler);
		if (idx >= 0) return;
		evt.listeners.push(eventHandler);
	},

	removeEventListener : function (eventName, eventHandler) {
		var evt = this._events[eventName];
		if (!evt) return;
		var idx = this._indexOf(evt.listeners, eventHandler);
		if (idx < 0) return;
		evt.listeners.splice(idx, 1);
	},

	get onProgress() {
		return this._events.progress.main;
	},

	set onProgress(f) {
		this._setMainListener("progress", f);
	},

	get onCancel() {
		return this._events.cancel.main;
	},

	set onCancel(f) {
		this._setMainListener("cancel", f);
	},

	get onError() {
		return this._events.error.main;
	},

	set onError(f) {
		this._setMainListener("error", f);
	},

	get onSuccess() {
		return this._events.success.main;
	},

	set onSuccess(f) {
		this._setMainListener("success", f);
	},

	get onFinish() {
		return this._events.finish.main;
	},

	set onFinish(f) {
		this._setMainListener("finish", f);
	},

	cancel : function () {
		if (!this.ongoing) { return false; }
		this._status  = SpiderGL.IO.Request.CANCELLED;
		this._aborted = true;
		var r = this._doCancel();
		this._finishTime = SpiderGL.Utility.getTime();
		return r;
	},

	send : function () {
		if (!this.canSend) { return false; }
		this._data       = null;
		this._status     = SpiderGL.IO.Request.ONGOING;
		this._aborted    = false;
		this._sent       = true;
		this._finishTime = -1;
		this._startTime  = SpiderGL.Utility.getTime();
		var r = this._doSend();
		if (!r) {
			this._startTime = -1;
			this._status = SpiderGL.IO.Request.NONE;
			this._sent = false;
		};
		return r;
	}
};

SpiderGL.Type.extend(SpiderGL.IO.Request, SpiderGL.Core.ObjectBase);

/**
 * Creates a SpiderGL.IO.XHRRequestBase.
 *
 * SpiderGL.IO.XHRRequestBase is the base class for I/O requests.
 *
 * @class The SpiderGL.IO.XHRRequestBase is the base class for I/O requests.
 *
 * @augments SpiderGL.IO.Request
 */
SpiderGL.IO.XHRRequestBase = function (url, options) {
	options = options || { };
	SpiderGL.IO.Request.call(this, url, options);

	var that = this;

	var xhr = new XMLHttpRequest();
	this._xhr = xhr;

	xhr.onprogress = function (evt) { that._xhrOnProgress(evt); };
	xhr.onabort    = function ()    { that._doOnCancel(); that._doOnFinish(); };
	xhr.onerror    = function ()    { that._doOnError();  that._doOnFinish(); };
	xhr.onload     = function ()    {
		var status = xhr.status;
		if ((status === 0) || (status === 200) || (!!that._range && (status == 206))) {
			that._doOnSuccess();
		}
		else {
			that._doOnError();
		}
		that._doOnFinish();
	};

	this._range = null;

	this._xhr.open("GET", this._url, this._async);

	if ("range" in options) {
		this._range = [ options.range[0], options.range[1] ];
		var rangeStr = "bytes=" + options.range[0] + "-" + options.range[1];
		xhr.setRequestHeader("Range", rangeStr);
	}

	this._prepareXHR();

	var send = SpiderGL.Utility.getDefaultValue(options.send, SpiderGL.IO.Request.DEFAULT_SEND);
	if (send) {
		this.send();
	}
};

SpiderGL.IO.XHRRequestBase.prototype = {
	_prepareXHR : function () {
	},

	_doCancel : function () {
		this._xhr.abort();
		this._xhr = new XMLHttpRequest();
		this._xhr.open("GET", this._url, this._async);
		this._prepareXHR();
		return true;
	},

	_doSend : function () {
		this._xhr.send();
		return true;
	},

	_xhrOnProgress : function (evt) {
		var loaded = 0;
		var total  = 0;
		if (evt && evt.lengthComputable) {
			loaded = evt.loaded;
			total  = evt.total;
		}
		this._doOnProgress(loaded, total);
	}
};

SpiderGL.Type.extend(SpiderGL.IO.XHRRequestBase, SpiderGL.IO.Request);

/**
 * Creates a SpiderGL.IO.XHRRequest.
 *
 * SpiderGL.IO.XHRRequest is the base class for I/O requests.
 *
 * @class The SpiderGL.IO.XHRRequest is the base class for I/O requests.
 *
 * @augments SpiderGL.IO.XHRRequestBase
 */
SpiderGL.IO.XHRRequest = function (url, options) {
	SpiderGL.IO.XHRRequestBase.call(this, url, options);
};

SpiderGL.IO.XHRRequest.prototype = {
	_doPostSuccess : function () {
		this._data = this._xhr.responseText;
	},

	get xhr() {
		return this._xhr;
	},

	get response() {
		return this.data;
	}
};

SpiderGL.Type.extend(SpiderGL.IO.XHRRequest, SpiderGL.IO.XHRRequestBase);

/**
 * Creates a SpiderGL.IO.TextRequest.
 *
 * SpiderGL.IO.TextRequest is the base class for I/O requests.
 *
 * @class The SpiderGL.IO.TextRequest is the base class for I/O requests.
 *
 * @augments SpiderGL.IO.XHRRequestBase
 */
SpiderGL.IO.TextRequest = function (url, options) {
	SpiderGL.IO.XHRRequestBase.call(this, url, options);
};

SpiderGL.IO.TextRequest.prototype = {
	_doPostSuccess : function () {
		this._data = this._xhr.responseText;
	},

	get text() {
		return this.data;
	}
};

SpiderGL.Type.extend(SpiderGL.IO.TextRequest, SpiderGL.IO.XHRRequestBase);

/**
 * Synchronous text read.
 * This function is equivalent to issuing a SpiderGL.IO.TextRequest with the async flag set to false and no callbacks, and then reading its text property.
 *
 * @param {string} url The URL of the content
 *
 * @returns {string} The text content, or null on failure.
 */
SpiderGL.IO.readText = function (url) {
	var r = new SpiderGL.IO.TextRequest(url, {async:false});
	return r.text;
};

/**
 * Asynchronous text read.
 * This function creates a SpiderGL.IO.TextRequest with the async and seng flags set to true, overriding their values in the options parameter.
 *
 * @param {string} url The URL of the content
 * @param {object} options The request options.
 *
 * @returns {SpiderGL.IO.TextRequest} The internally generated SpiderGL.IO.TextRequest.
 */
SpiderGL.IO.requestText = function (url, options) {
	options = SpiderGL.Utility.getDefaultObject({ }, options);
	options.async = true;
	options.send  = true;
	var r = new SpiderGL.IO.TextRequest(url, options);
	return r;
};

/**
 * Creates a SpiderGL.IO.JSONRequest.
 *
 * SpiderGL.IO.JSONRequest is the base class for I/O requests.
 *
 * @class The SpiderGL.IO.JSONRequest is the base class for I/O requests.
 *
 * @augments SpiderGL.IO.XHRRequestBase
 */
SpiderGL.IO.JSONRequest = function (url, options) {
	SpiderGL.IO.XHRRequestBase.call(this, url, options);
};

SpiderGL.IO.JSONRequest.prototype = {
	_doPostSuccess : function () {
		this._data = JSON.parse(this._xhr.responseText);
	},

	get text() {
		return this._xhr.responseText;
	},

	get json() {
		return this.data;
	}
};

SpiderGL.Type.extend(SpiderGL.IO.JSONRequest, SpiderGL.IO.XHRRequestBase);

/**
 * Synchronous JSON object read.
 * This function is equivalent to issuing a SpiderGL.IO.JSONRequest with the async flag set to false and no callbacks, and then reading its json property.
 *
 * @param {string} url The URL of the content
 *
 * @returns {object} The JSON-parsed object, or null on failure.
 */
SpiderGL.IO.readJSON = function (url) {
	var r = new SpiderGL.IO.JSONRequest(url, {async:false});
	return r.json;
};

/**
 * Asynchronous JSON read.
 * This function creates a SpiderGL.IO.JSONRequest with the async and seng flags set to true, overriding their values in the options parameter.
 *
 * @param {string} url The URL of the content
 * @param {object} options The request options.
 *
 * @returns {SpiderGL.IO.JSONRequest} The internally generated SpiderGL.IO.JSONRequest.
 */
SpiderGL.IO.requestJSON = function (url, options) {
	options = SpiderGL.Utility.getDefaultObject({ }, options);
	options.async = true;
	options.send  = true;
	var r = new SpiderGL.IO.JSONRequest(url, options);
	return r;
};

/**
 * Creates a SpiderGL.IO.BinaryRequest.
 *
 * SpiderGL.IO.BinaryRequest is the base class for I/O requests.
 *
 * @class The SpiderGL.IO.BinaryRequest is the base class for I/O requests.
 *
 * @augments SpiderGL.IO.XHRRequestBase
 */
SpiderGL.IO.BinaryRequest = function (url, options) {
	SpiderGL.IO.XHRRequestBase.call(this, url, options);
};

SpiderGL.IO.BinaryRequest.prototype = {
	_prepareXHR : function () {
		var xhr = this._xhr;
		var overrideMime = false;

		/*
		if (xhr.hasOwnProperty("responseType")) {
			try {
				xhr.responseType = "arraybuffer";
			}
			catch (e) {
				overrideMime = true;
			}
		}
		else {
				overrideMime = true;
		}
		*/

		if (overrideMime) {
			xhr.overrideMimeType("text/plain; charset=x-user-defined");
		}

		xhr.responseType = "arraybuffer";
	},

	_setArrayBuffer : function () {
		var xhr = this._xhr;

		if (xhr.responseType == "arraybuffer") {
			this._data = xhr.response;
		}
		else if (xhr.mozResponseArrayBuffer != null) {
			this._data = xhr.mozResponseArrayBuffer;
		}
		else if (xhr.responseText != null) {
			var data = new String(xhr.responseText);
			var arr  = new Array(data.length);
			for (var i=0, n=data.length; i<n; ++i) {
				arr[i] = data.charCodeAt(i) & 0xff;
			}
			this._data = (new Uint8Array(arr)).buffer;
		}
		else {
			this._data = null;
		}
	},

	_doPostSuccess : function () {
		this._setArrayBuffer();
	},

	get data() {
		if (this.ongoing) {
			this._setArrayBuffer();
		}
		return this._data;
	},

	get buffer() {
		return this.data;
	}
};

SpiderGL.Type.extend(SpiderGL.IO.BinaryRequest, SpiderGL.IO.XHRRequestBase);

/**
 * Synchronous binary data read.
 * This function is equivalent to issuing a SpiderGL.IO.BinaryRequest with the async flag set to false and no callbacks, and then reading its buffer property.
 *
 * @param {string} url The URL of the content
 *
 * @returns {ArrayBuffer} The content binary data, or null on failure.
 */
SpiderGL.IO.readBinary = function (url) {
	var r = new SpiderGL.IO.BinaryRequest(url, {async:false});
	return r.buffer;
};

/**
 * Asynchronous binary read.
 * This function creates a SpiderGL.IO.BinaryRequest with the async and seng flags set to true, overriding their values in the options parameter.
 *
 * @param {string} url The URL of the content
 * @param {object} options The request options.
 *
 * @returns {SpiderGL.IO.BinaryRequest} The internally generated SpiderGL.IO.BinaryRequest.
 */
SpiderGL.IO.requestBinary = function (url, options) {
	options = SpiderGL.Utility.getDefaultObject({ }, options);
	options.async = true;
	options.send  = true;
	var r = new SpiderGL.IO.BinaryRequest(url, options);
	return r;
};

/**
 * Creates a SpiderGL.IO.ImageRequest.
 *
 * SpiderGL.IO.ImageRequest is the base class for I/O requests.
 * The request is always asynchronous, meaning that the async flag is ignored.
 *
 * @class The SpiderGL.IO.ImageRequest is the base class for I/O requests.
 *
 * @augments SpiderGL.IO.Request
 */
SpiderGL.IO.ImageRequest = function (url, options) {
	options = options || { };
	SpiderGL.IO.Request.call(this, url, options);

	var that = this;

	var img = new Image();
	this._img  = img;
	this._data = img;

	img.onabort = function () { that._doOnCancel();  that._doOnFinish(); };
	img.onerror = function () { that._doOnError();   that._doOnFinish(); };
	img.onload  = function () { that._doOnSuccess(); that._doOnFinish(); };

	if (typeof img.onprogress != "undefined") {
		img.onprogress = function (evt) { that._imgOnProgress(evt); };
	}

	var send = SpiderGL.Utility.getDefaultValue(options.send, SpiderGL.IO.Request.DEFAULT_SEND);
	if (send) {
		this.send();
	}
};

SpiderGL.IO.ImageRequest.prototype = {
	_doPostSuccess : function () {
		this._data = this._img;
	},

	_doCancel : function () {
		this._img.src = null;
		this._img = new Image();
		return true;
	},

	_doSend : function () {
		this._img.src = this._url;
		return true;
	},

	_imgOnProgress : function (evt) {
		var loaded = 0;
		var total  = 0;
		if (evt && evt.lengthComputable) {
			loaded = evt.loaded;
			total  = evt.total;
		}
		this._doOnProgress(loaded, total);
	},

	get image() {
		return this.data;
	}
};

SpiderGL.Type.extend(SpiderGL.IO.ImageRequest, SpiderGL.IO.Request);

/**
 * Asynchronous image read.
 * This function creates a SpiderGL.IO.ImageRequest with the async and seng flags set to true, overriding their values in the options parameter.
 *
 * @param {string} url The URL of the content
 * @param {object} options The request options.
 *
 * @returns {SpiderGL.IO.ImageRequest} The internally generated SpiderGL.IO.ImageRequest.
 */
SpiderGL.IO.requestImage = function (url, options) {
	options = SpiderGL.Utility.getDefaultObject({ }, options);
	options.async = true;
	options.send  = true;
	var r = new SpiderGL.IO.ImageRequest(url, options);
	return r;
};

/**
 * Creates a SpiderGL.IO.AggregateRequest.
 *
 * SpiderGL.IO.AggregateRequest is the base class for I/O requests.
 *
 * @class The SpiderGL.IO.AggregateRequest is the base class for I/O requests.
 *
 * @augments SpiderGL.IO.Request
 */
SpiderGL.IO.AggregateRequest = function (options) {
	options = options || { };
	SpiderGL.IO.Request.call(this, "*", options);

	var that = this;

	this._proxyOnProgress = function (loaded, total, req) {
		that._reqOnProgress(loaded, total, req);
	};

	this._proxyOnCancel = function (req) {
		that._reqOnCancel(req);
	};

	this._proxyOnError = function (req) {
		that._reqOnError(req);
	};

	this._proxyOnSuccess = function (req) {
		that._reqOnSuccess(req);
	};

	this._proxyOnFinish = function (req) {
		that._reqOnFinish(req);
	};

	this._aggrStartTime  = -1;
	this._aggrFinishTime = -1;

	this._eventReq = null;
	this._cancelledReqs = 0;
	this._failedReqs    = 0;
	this._succeededReqs = 0;
	this._requests = [ ];
	var requests = options.requests;
	if (requests) {
		for (var i=0, n=requests.length; i<n; ++i) {
			var r = requests[i];
			if (r && !r.sent) {
				this._installProxies(r);
				this.addRequest(r);
			}
		}
	}

	var send = SpiderGL.Utility.getDefaultValue(options.send, SpiderGL.IO.Request.DEFAULT_SEND);
	if (send) {
		this.send();
	}
};

SpiderGL.IO.AggregateRequest.prototype = {
	_doPostCancel : function () {
		if (!this._requestsFinished) {
			this._status = SpiderGL.IO.Request.ONGOING;
		}
	},

	_doPostError : function () {
		if (!this._requestsFinished) {
			this._status = SpiderGL.IO.Request.ONGOING;
		}
	},

	_doPostSuccess : function () {
		if (!this._requestsFinished) {
			this._status = SpiderGL.IO.Request.ONGOING;
		}
	},

	_doCancel : function () {
		var requests = this._requests;
		for (var i=0, n=requests.length; i<n; ++i) {
			requests[i].cancel();
		}
		this._aggrFinishTime = SpiderGL.Utility.getTime();
	},

	_doSend : function () {
		this._aggrStartTime = SpiderGL.Utility.getTime();
		var requests = this._requests;
		for (var i=0, n=requests.length; i<n; ++i) {
			requests[i].send();
		}
	},

	get _requestsFinished() {
		return ((this._cancelledReqs + this._failedReqs + this._succeededReqs) == this._requests.length);
	},

	_installProxies : function (req) {
		req.addEventListener("progress", this._proxyOnProgress);
		req.addEventListener("cancel",   this._proxyOnCancel);
		req.addEventListener("error",    this._proxyOnError);
		req.addEventListener("success",  this._proxyOnSuccess);
		req.addEventListener("finish",   this._proxyOnFinish);
	},

	_uninstallProxies : function (req) {
		req.removeEventListener("progress", this._proxyOnProgress);
		req.removeEventListener("cancel",   this._proxyOnCancel);
		req.removeEventListener("error",    this._proxyOnError);
		req.removeEventListener("success",  this._proxyOnSuccess);
		req.removeEventListener("finish",   this._proxyOnFinish);
	},

	_reqOnProgress : function (loaded, total, req) {
		var idx = this._indexOf(this._requests, req);
		if (idx < 0) return;
		this._eventReq = req;
		this._doOnProgress(loaded, total);
		this._eventReq = null;
	},

	_reqOnCancel : function (req) {
		var idx = this._indexOf(this._requests, req);
		if (idx < 0) return;
		this._eventReq = req;
		//this._doOnCancel();
		this._cancelledReqs++;
		if (this._requestsFinished) {
			this._aggrFinishTime = SpiderGL.Utility.getTime();
			if (this._cancelledReqs == this._requests.length) {
				this._eventReq = this;
				this._doOnCancel();
			}
		}
		else {
		}
		this._eventReq = null;
	},

	_reqOnError : function (req) {
		var idx = this._indexOf(this._requests, req);
		if (idx < 0) return;
		this._eventReq = req;
		//this._doOnError();
		this._failedReqs++;
		if (this._requestsFinished) {
			this._aggrFinishTime = SpiderGL.Utility.getTime();
			this._eventReq = this;
			this._doOnError();
		}
		this._eventReq = null;
	},

	_reqOnSuccess : function (req) {
		var idx = this._indexOf(this._requests, req);
		if (idx < 0) return;
		this._eventReq = req;
		//this._doOnSuccess();
		this._succeededReqs++;
		if (this._requestsFinished) {
			this._aggrFinishTime = SpiderGL.Utility.getTime();
			this._eventReq = this;
			if (this._failedReqs > 0) {
				this._doOnError();
			}
			else {
				this._doOnSuccess();
			}
		}
		this._eventReq = null;
	},

	_reqOnFinish : function (req) {
		var idx = this._indexOf(this._requests, req);
		if (idx < 0) return;
		this._uninstallProxies(req);
		this._eventReq = req;
		//this._doOnFinish();
		if (this._requestsFinished) {
			this._eventReq = this;
			this._doOnFinish();
		}
		this._eventReq = null;
	},

	get eventSenderRequest() {
		return this._eventReq;
	},

	get requests() {
		return this._requests.slice();
	},

	get requests$() {
		return this._requests;
	},

	get startTime() {
		return this._aggrStartTime;
	},

	get finishTime() {
		return this._aggrFinishTime;
	},

	get elapsedTime() {
		if (this._aggrStartTime < 0) return 0;
		if (this._aggrFinishTime < 0) return (SpiderGL.Utility.getTime() - this._aggrStartTime);
		return (this._aggrFinishTime - this._aggrStartTime);
	},

	addRequest : function (r) {
		if (!r || this._sent) return;
		var idx = this._indexOf(this._requests, r);
		if (idx >= 0) return;
		this._requests.push(r);
	},

	removeRequest : function (r) {
		if (!r || this._sent) return;
		var idx = this._indexOf(this._requests, r);
		if (idx < 0) return;
		this._requests.splice(idx, 1);
	}
};

SpiderGL.Type.extend(SpiderGL.IO.AggregateRequest, SpiderGL.IO.Request);

/*
SpiderGL Computer Graphics Library
Copyright (c) 2010, Marco Di Benedetto - Visual Computing Lab, ISTI - CNR
All rights reserved.

Redistribution and use in source and binary forms, with or without
modification, are permitted provided that the following conditions are met:
    * Redistributions of source code must retain the above copyright
      notice, this list of conditions and the following disclaimer.
    * Redistributions in binary form must reproduce the above copyright
      notice, this list of conditions and the following disclaimer in the
      documentation and/or other materials provided with the distribution.
    * Neither the name of SpiderGL nor the
      names of its contributors may be used to endorse or promote products
      derived from this software without specific prior written permission.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
DISCLAIMED. IN NO EVENT SHALL PAUL BRUNT BE LIABLE FOR ANY
DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
(INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
(INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
*/

/**
 * @fileOverview Math
 */

/**
 * The SpiderGL.Math namespace.
 *
 * @namespace The SpiderGL.Math namespace.
 */
SpiderGL.Math = { };

// constants
/*---------------------------------------------------------*/

/**
 * Scale factor for degrees to radians conversion.
 * It is equal to PI / 180.
 *
 * @constant
 *
 * @type number
 */
SpiderGL.Math.DEG_TO_RAD = (Math.PI / 180.0);

/**
 * Alias for Math.E.
 *
 * @constant
 *
 * @type number
 */
SpiderGL.Math.E = Math.E;

/**
 * Alias for Math.LN2.
 *
 * @constant
 *
 * @type number
 */
SpiderGL.Math.LN2 = Math.LN2;

/**
 * Alias for Math.LN10.
 *
 * @constant
 *
 * @type number
 */
SpiderGL.Math.LN10 = Math.LN10;

/**
 * Alias for Math.LOG2E.
 *
 * @constant
 *
 * @type number
 */
SpiderGL.Math.LOG2E = Math.LOG2E;

/**
 * Alias for Math.LOG10E.
 *
 * @constant
 *
 * @type number
 */
SpiderGL.Math.LOG10E = Math.LOG10E;

/**
 * Alias for Math.PI.
 *
 * @constant
 *
 * @type number
 */
SpiderGL.Math.PI = Math.PI;

/**
 * Scale factor for radians to degrees conversion.
 * It is equal to 180 / PI.
 *
 * @constant
 *
 * @type number
 */
SpiderGL.Math.RAD_TO_DEG = (180.0 / Math.PI);

/**
 * Alias for Math.SQRT2.
 *
 * @constant
 *
 * @type number
 */
SpiderGL.Math.SQRT2 = Math.SQRT2;


/**
 * Alias for Number.MAX_VALUE.
 *
 * @constant
 *
 * @type number
 */
SpiderGL.Math.MAX_VALUE = Number.MAX_VALUE;

/**
 * Alias for Number.MIN_VALUE.
 *
 * @constant
 *
 * @type number
 */
SpiderGL.Math.MIN_VALUE = Number.MIN_VALUE;

/**
 * Alias for SpiderGL.Math.MAX_VALUE.
 *
 * @constant
 *
 * @type number
 */
SpiderGL.Math.MAX_NUMBER = SpiderGL.Math.MAX_VALUE;

/**
 * Alias for -SpiderGL.Math.MAX_VALUE.
 *
 * @constant
 *
 * @type number
 */
SpiderGL.Math.MIN_NUMBER = -SpiderGL.Math.MAX_VALUE;

/**
 * Alias for Number.NaN.
 *
 * @constant
 *
 * @type number
 */
SpiderGL.Math.NAN = Number.NaN;

/**
 * Alias for global Infinity.
 *
 * @constant
 *
 * @type number
 */
SpiderGL.Math.INFINITY = Infinity;

/*---------------------------------------------------------*/



// functions on scalars
/*---------------------------------------------------------*/

/**
 * Alias for Math.abs.
 *
 * @param {number} x A number.
 *
 * @returns {number} The absolute value of x.
 */
SpiderGL.Math.abs = function (x) {
	return Math.abs(x);
}

/**
 * Alias for Math.acos.
 *
 * @param {number} x The input cosine.
 *
 * @returns {number} The arccosine of x, in radians.
 */
SpiderGL.Math.acos = function (x) {
	return Math.acos(x);
}

/**
 * Alias for Math.asin.
 *
 * @param {number} x The input sine.
 *
 * @returns {number} The arcsine of x, in radians.
 */
SpiderGL.Math.asin = function (x) {
	return Math.asin(x);
}

/**
 * Alias for Math.atan2.
 *
 * @param {number} x The input number.
 *
 * @returns {number} The arctangent of x as a numeric value between -PI/2 and PI/2 radians.
 */
SpiderGL.Math.atan = function (x) {
	return Math.atan(x);
}

/**
 * Alias for Math.atan2.
 *
 * @param {number} y A number.
 * @param {number} x A number.
 *
 * @returns {number} The the arctangent of the quotient of its arguments as a numeric value between PI and -PI.
 */
SpiderGL.Math.atan2 = function (y, x) {
	return Math.atan2(y, x);
}

/**
 * Alias for Math.ceil.
 *
 * @param {number} x The input number.
 *
 * @returns {number} x rounded upwards to the nearest integer.
 */
SpiderGL.Math.ceil = function (x) {
	return Math.ceil(x);
}

/**
 * Clamps a number over a range.
 *
 * @param {number} x The number to clamp.
 * @param {number} min The lower bound.
 * @param {number} max The upper bound.
 *
 * @returns {number} min if x < min, max if x > max, x otherwise.
 */
SpiderGL.Math.clamp = function (x, min, max) {
	return ((x <= min) ? (min) : ((x >= max) ? (max) : (x)));
}

/**
 * Alias for Math.cos.
 *
 * @param {number} x The input angle, in radians.
 *
 * @returns {number} The cosine of x.
 */
SpiderGL.Math.cos = function (x) {
	return Math.cos(x);
}

/**
 * Converts degrees to radians.
 *
 * @param {number} x The input angle, in degrees.
 *
 * @returns {number} x in radians.
 */
SpiderGL.Math.degToRad = function (x) {
	return (x * SpiderGL.Math.DEG_TO_RAD);
}

/**
 * Alias for Math.exp.
 *
 * @param {number} x The input number.
 *
 * @returns {number} E raised to x.
 */
SpiderGL.Math.exp = function (x) {
	return Math.exp(x);
}

/**
 * Alias for Math.floor.
 *
 * @param {number} x The input number.
 *
 * @returns {number} x rounded downwards to the nearest integer.
 */
SpiderGL.Math.floor = function (x) {
	return Math.floor(x);
}

/**
 * Linear interpolation between two numbers.
 *
 * @param {number} x The start interpolation bound.
 * @param {number} y The stop interpolation bound.
 * @param {number} t The interpolation factor, between 0 and 1..
 *
 * @returns {number} The interpolated value (1-t)*x + t*y.
 */
SpiderGL.Math.lerp = function (x, y, t) {
	return x + t * (y - x);
}

/**
 * Alias for Math.log.
 * Same as {@link SpiderGL.Math.log}.
 *
 * @param {number} x The input number.
 *
 * @returns {number} The natural logarithm (base E) of x.
 */
SpiderGL.Math.ln = function (x) {
	return Math.log(x);
}

/**
 * Alias for Math.log.
 *
 * @param {number} x The input number.
 *
 * @returns {number} The natural logarithm (base E) of x.
 */
SpiderGL.Math.log = function (x) {
	return Math.log(x);
}

/**
 * Logarithm base 2.
 *
 * @param {number} x The input number.
 *
 * @returns {number} The base 2 logarithm of x.
 */
SpiderGL.Math.log2 = function (x) {
	return (SpiderGL.Math.log(x) / SpiderGL.Math.LN2);
}

/**
 * Logarithm base 10.
 *
 * @param {number} x The input number.
 *
 * @returns {number} The base 10 logarithm of x.
 */
SpiderGL.Math.log10 = function (x) {
	return (SpiderGL.Math.log(x) / SpiderGL.Math.LN10);
}

/**
 * Alias for Math.max.
 *
 * @param {number} args Variable number of arguments
 *
 * @returns {number} The number with the highest value.
 *
 * @example
 * var x = SpiderGL.Math.max(3, 1.56, 2.1); // x == 3
 */
SpiderGL.Math.max = function (args) {
	return Math.max.apply(Math, arguments);
}

/**
 * Alias for Math.min.
 *
 * @param {number} args Variable number of arguments
 *
 * @returns {number} The number with the lowest value.
 *
 * @example
 * var x = SpiderGL.Math.min(3, 1.56, 2.1); // x == 1.56
 */
SpiderGL.Math.min = function (args) {
	return Math.min.apply(Math, arguments);
}

/**
 * Alias for Math.pow.
 *
 * @param {number} x The base number.
 * @param {number} x The exponent number.
 *
 * @returns {number} The value of x to the power of y.
 */
SpiderGL.Math.pow = function (x, y) {
	return Math.pow(x, y);
}

/**
 * Converts radians to degrees.
 *
 * @param {number} x The input angle, in radians.
 *
 * @returns {number} x in degrees.
 */
SpiderGL.Math.radToDeg = function (x) {
	return (x * SpiderGL.Math.RAD_TO_DEG);
}

/**
 * Alias for Math.random.
 *
 * @returns {number} A random number between 0.0 and 1.0, inclusive.
 */
SpiderGL.Math.random = function () {
	return Math.random();
}

/**
 * Alias for SpiderGL.Math.random.
 *
 * @returns {number} A random number between 0.0 and 1.0, inclusive.
 */
SpiderGL.Math.random01 = function () {
	return SpiderGL.Math.random();
}

/**
 * Generates a random number between -1.0 and 1.0.
 *
 * @returns {number} A random number between -1.0 and 1.0, inclusive.
 */
SpiderGL.Math.random11 = function () {
	return (SpiderGL.Math.random() * 2 - 1);
}

/**
 * Generates a random number between a and b.
 *
 * @param {number} min The range low end-point.
 * @param {number} max The range high end-point.
 *
 * @returns {number} A random number between min and max, inclusive.
 */
SpiderGL.Math.randomRange = function (min, max) {
	return (min + SpiderGL.Math.random() * (max - min));
}

/**
 * Alias for Math.round.
 *
 * @param {number} x The input number.
 *
 * @returns {number} x rounded to the nearest integer.
 *
 * @example
 * var a = SpiderGL.Math.round(    3); // a ==  3
 * var b = SpiderGL.Math.round(   -4); // b == -4
 * var c = SpiderGL.Math.round( 7.21); // c ==  7
 * var d = SpiderGL.Math.round( 7.56); // d ==  8
 * var e = SpiderGL.Math.round(-7.56); // e == -8
 * var f = SpiderGL.Math.round(-7.21); // f == -7
 */
SpiderGL.Math.round = function (x) {
	return Math.sqrt(x);
}

/**
 * Alias for Math.sin.
 *
 * @param {number} x The input angle, in radians.
 *
 * @returns {number} The sine of x.
 */
SpiderGL.Math.sin = function (x) {
	return Math.sin(x);
}

/**
 * Alias for Math.sqrt.
 *
 * @param {number} x The input number.
 *
 * @returns {number} The square root of x.
 */
SpiderGL.Math.sqrt = function (x) {
	return Math.sqrt(x);
}

/**
 * Alias for Math.tan.
 *
 * @param {number} x The input angle, in radians.
 *
 * @returns {number} The tangent of x.
 */
SpiderGL.Math.tan = function (x) {
	return Math.tan(x);
}

/*---------------------------------------------------------*/



// 2-dimensional vector
/*---------------------------------------------------------*/

/**
 * The SpiderGL.Math.Vec2 namespace.
 * The provided functions operate on 2-dimensional vectors, represented as standard JavaScript arrays of length 2.
 * In general, vectors are considered as column vectors.
 *
 * @namespace The SpiderGL.Math.Vec2 namespace defines operations on 2-dimensional vectors.
 */
SpiderGL.Math.Vec2 = { };

/**
 * Duplicates the input 2-dimensional vector.
 *
 * @param {array} v The input vector.
 *
 * @returns {array} A new 2-dimensional array r, where r[i] = v[i] (same as v.slice(0, 2)).
 */
SpiderGL.Math.Vec2.dup = function (v) {
	return v.slice(0, 2);
}

/**
 * Creates a 2-dimensional vector initialized with a scalar.
 *
 * @param {number} s The input scalar.
 *
 * @returns {array} A new 2-dimensional array r, where r[i] = s.
 */
SpiderGL.Math.Vec2.scalar = function (s) {
	return [s, s];
}

/**
 * Creates a 2-dimensional vector initialized with zero.
 *
 * @returns {array} A new 2-dimensional array r, where r[i] = 0.
 */
SpiderGL.Math.Vec2.zero = function () {
	return [0, 0];
}

/**
 * Creates a 2-dimensional vector initialized with one.
 *
 * @returns {array} A new 2-dimensional array r, where r[i] = 1.0.
 */
SpiderGL.Math.Vec2.one = function () {
	return [1, 1];
}

/**
 * Creates a 2-dimensional vector initialized with SpiderGL.Math.MAX_NUMBER.
 *
 * @returns {array} A new 2-dimensional array r, where r[i] = SpiderGL.Math.MAX_NUMBER.
 */
SpiderGL.Math.Vec2.maxNumber = function () {
	return [SpiderGL.Math.MAX_NUMBER, SpiderGL.Math.MAX_NUMBER];
}

/**
 * Creates a 2-dimensional vector initialized with SpiderGL.Math.MIN_NUMBER.
 *
 * @returns {array} A new 2-dimensional array r, where r[i] = SpiderGL.Math.MIN_NUMBER.
 */
SpiderGL.Math.Vec2.minNumber = function () {
	return [SpiderGL.Math.MIN_NUMBER, SpiderGL.Math.MIN_NUMBER];
}

/**
 * Creates a 3-dimensional vector from a 2-dimensional vector.
 *
 * @param {array} v The input vector.
 * @param {number} [z=0.0] The 3th component.
 *
 * @returns {array} A new 3-dimensional array r equal to v extended with z as 3rd component.
 */
SpiderGL.Math.Vec2.to3 = function (v, z) {
	return [v[0], v[1], (z != undefined) ? z : 0];
}

/**
 * Creates a 4-dimensional vector from a 2-dimensional vector.
 *
 * @param {array} v The input vector.
 * @param {number} [z=0.0] The 3th component.
 * @param {number} [w=1.0] The 4th component.
 *
 * @returns {array} A new 4-dimensional array r equal to v extended with z as 3rd component and w as 4th component.
 */
SpiderGL.Math.Vec2.to4 = function (v, z, w) {
	return [v[0], v[1], v[2], (z != undefined) ? z : 0, (w != undefined) ? w : 1];
}

/**
 * Component-wise negation of a 2-dimensional vector.
 *
 * @param {array} v The input vector.
 *
 * @returns {array} A new 2-dimensionals vector r, where r[i] = -v[i].
 */
SpiderGL.Math.Vec2.neg = function (v) {
	return [-v[0], -v[1]];
}

/**
 * Component-wise addition of two 2-dimensional vectors.
 *
 * @param {array} u The first addition operand.
 * @param {array} v The second addition operand.
 *
 * @returns {array} A new 2-dimensionals vector r, where r[i] = u[i] + v[i].
 */
SpiderGL.Math.Vec2.add = function (u, v) {
	return [u[0]+v[0], u[1]+v[1]];
}

/**
 * Component-wise addition of a 2-dimensional vector and a scalar.
 *
 * @param {array} v The vector addition operand.
 * @param {number} s The scalar addition operand.
 *
 * @returns {array} A new 2-dimensionals vector r, where r[i] = v[i] + s.
 */
SpiderGL.Math.Vec2.adds = function (v, s) {
	return [v[0]+s, v[1]+s];
}

/**
 * Component-wise subtraction of two 2-dimensional vectors.
 *
 * @param {array} u The first subtraction operand.
 * @param {array} v The second subtraction operand.
 *
 * @returns {array} A new 2-dimensionals vector r, where r[i] = u[i] - v[i].
 */
SpiderGL.Math.Vec2.sub = function (u, v) {
	return [u[0]-v[0], u[1]-v[1]];
}

/**
 * Component-wise subtraction of a 2-dimensional vector and a scalar.
 *
 * @param {array} v The vector subtraction operand.
 * @param {number} s The scalar subtraction operand.
 *
 * @returns {array} A new 2-dimensionals vector r, where r[i] = v[i] - s.
 */
SpiderGL.Math.Vec2.subs = function (v, s) {
	return [v[0]-s, v[1]-s];
}

/**
 * Component-wise subtraction of a scalar and a 2-dimensional.
 *
 * @param {number} s The scalar subtraction operand.
 * @param {array} v The vector subtraction operand.
 *
 * @returns {array} A new 2-dimensionals vector r, where r[i] = s - v[i].
 */
SpiderGL.Math.Vec2.ssub = function (s, v) {
	return [s-v[0], s-v[1]];
}

/**
 * Component-wise multiplication of two 2-dimensional vectors.
 *
 * @param {array} u The first multiplication operand.
 * @param {array} v The second multiplication operand.
 *
 * @returns {array} A new 2-dimensionals vector r, where r[i] = u[i] * v[i].
 */
SpiderGL.Math.Vec2.mul = function (u, v) {
	return [u[0]*v[0], u[1]*v[1]];
}

/**
 * Component-wise multiplication of a 2-dimensional vector and a scalar.
 *
 * @param {array} v The vector multiplication operand.
 * @param {number} s The scalar multiplication operand.
 *
 * @returns {array} A new 2-dimensionals vector r, where r[i] = v[i] * s.
 */
SpiderGL.Math.Vec2.muls = function (v, s) {
	return [v[0]*s, v[1]*s];
}

/**
 * Component-wise division of two 2-dimensional vectors.
 *
 * @param {array} u The numerator vector.
 * @param {array} v The denominator vector.
 *
 * @returns {array} A new 2-dimensionals vector r, where r[i] = u[i] / v[i].
 */
SpiderGL.Math.Vec2.div = function (u, v) {
	return [u[0]/v[0], u[1]/v[1]];
}

/**
 * Component-wise division of a 2-dimensional vector by a scalar.
 *
 * @param {array} v The numerator vector.
 * @param {number} s The scalar denominator.
 *
 * @returns {array} A new 2-dimensionals vector r, where r[i] = v[i] / s.
 */
SpiderGL.Math.Vec2.divs = function (v, s) {
	return [v[0]/s, v[1]/s];
}

/**
 * Component-wise division of a scalar by a 2-dimensional vector.
 *
 * @param {number} s The denominator scalar.
 * @param {array} v The numerator vector.
 *
 * @returns {array} A new 2-dimensionals vector r, where r[i] = s / v[i].
 */
SpiderGL.Math.Vec2.sdiv = function (s, v) {
	return [s/v[0], s/v[1]];
}

/**
 * Component-wise reciprocal of a 2-dimensional vector.
 *
 * @param {array} v The input (denominator) vector.
 *
 * @returns {array} A new 2-dimensionals vector r, where r[i] = 1.0 / v[i].
 */
SpiderGL.Math.Vec2.rcp = function (v) {
	return [1.0/v[0], 1.0/v[1]];
}

/**
 * Dot product of two 2-dimensional vectors.
 *
 * @param {array} u The first vector operand.
 * @param {array} v The second vector operand.
 *
 * @returns {number} The dot product of u and v.
 */
SpiderGL.Math.Vec2.dot = function (u, v) {
	return (u[0]*v[0] + u[1]*v[1]);
}

/**
 * Cross product of two 2-dimensional vectors.
 *
 * @param {array} u The first vector operand.
 * @param {array} v The second vector operand.
 *
 * @returns {array} A new 2-dimensional array equal to the cross product of u and v.
 */
SpiderGL.Math.Vec2.cross = function (u, v) {
	return (u[0]*v[1] - u[1]*v[0]);
}

/**
 * Perp operation.
 * Returns a 2-dimensional vector which is orthogonal to the input vector and lies in the right halfspace.
 *
 * @param {array} v The input vector.
 *
 * @returns {array} A new 2-dimensional array r, where r = [v[1], -v[0]].
 */
SpiderGL.Math.Vec2.perp = function (v) {
	return [v[1], -v[0]];
}

/**
 * Squared length of a 2-dimensional vector.
 *
 * @param {array} v The input vector.
 *
 * @returns {number} The squared length of v, same as the dot product of v with itself.
 */
SpiderGL.Math.Vec2.sqLength = function (v) {
	return SpiderGL.Math.Vec2.dot(v, v);
}

/**
 * Length of a 2-dimensional vector.
 *
 * @param {array} v The input vector.
 *
 * @returns {number} The length of v.
 */
SpiderGL.Math.Vec2.length = function (v) {
	return SpiderGL.Math.sqrt(SpiderGL.Math.Vec2.sqLength(v));
}

/**
 * Creates a normalized 2-dimensional vector.
 *
 * @param {array} v The input vector.
 *
 * @returns {array} A new 2-dimensional array r representing the normalized v, where r[i] = v[i] / {@link SpiderGL.Math.Vec2.length}(v).
 */
SpiderGL.Math.Vec2.normalize = function (v) {
	var f = 1.0 / SpiderGL.Math.Vec2.length(v);
	return SpiderGL.Math.Vec2.muls(v, f);
}

/**
 * Component-wise absolute value of a 2-dimensional vector.
 *
 * @param {array} v The input vector.
 *
 * @returns {array} A new 2-dimensional array r, where r[i] = {@link SpiderGL.Math.abs}(v[i]).
 */
SpiderGL.Math.Vec2.abs = function (v) {
	return [SpiderGL.Math.abs(v[0]), SpiderGL.Math.abs(v[1])];
}

/**
 * Component-wise arccosine of a 2-dimensional vector.
 *
 * @param {array} v The input vector.
 *
 * @returns {array} A new 2-dimensional array r, where r[i] = {@link SpiderGL.Math.acos}(v[i]), in radians.
 */
SpiderGL.Math.Vec2.acos = function (v) {
	return [SpiderGL.Math.acos(v[0]), SpiderGL.Math.acos(v[1])];
}

/**
 * Component-wise arcsine of a 2-dimensional vector.
 *
 * @param {array} v The input vector.
 *
 * @returns {array} A new 2-dimensional array r, where r[i] = {@link SpiderGL.Math.asin}(v[i]), in radians.
 */
SpiderGL.Math.Vec2.asin = function (v) {
	return [SpiderGL.Math.asin(v[0]), SpiderGL.Math.asin(v[1])];
}

/**
 * Component-wise arctangent of a 2-dimensional vector.
 *
 * @param {array} v The input vector.
 *
 * @returns {array} A new 2-dimensional array r, where r[i] = {@link SpiderGL.Math.atan}(v[i]), between -PI/2 and PI/2 radians.
 */
SpiderGL.Math.Vec2.atan = function (v) {
	return [SpiderGL.Math.atan(v[0]), SpiderGL.Math.atan(v[1])];
}

/**
 * Component-wise arctangent of the quotient of two 2-dimensional vectors.
 *
 * @param {array} y The numerator vector.
 * @param {array} x The denominator vector.
 *
 * @returns {array} A new 2-dimensional array r, where r[i] = {@link SpiderGL.Math.atan2}(y[i], x[i]), between PI and -PI radians.
 */
SpiderGL.Math.Vec2.atan2 = function (y, x) {
	return [SpiderGL.Math.atan2(y[0], x[0]), SpiderGL.Math.atan2(y[1], x[1])];
}

/**
 * Component-wise ceil of a 2-dimensional vector.
 *
 * @param {array} v The input vector.
 *
 * @returns {array} A new 2-dimensional array r, where r[i] = {@link SpiderGL.Math.ceil}(v[i]).
 */
SpiderGL.Math.Vec2.ceil = function (v) {
	return [SpiderGL.Math.ceil(v[0]), SpiderGL.Math.ceil(v[1])];
}

/**
 * Component-wise clamp of a 2-dimensional vector with vector bounds.
 *
 * @param {array} v The input vector.
 * @param {array} min The lower 2-dimensional bound.
 * @param {array} max The upper 2-dimensional bound.
 *
 * @returns {array} A new 2-dimensional array r, where r[i] = {@link SpiderGL.Math.clamp}(v[i], min[i], max[i]).
 */
SpiderGL.Math.Vec2.clamp = function (v, min, max) {
	return [SpiderGL.Math.clamp(v[0], min[0], max[0]), SpiderGL.Math.clamp(v[1], min[1], max[1])];
}

/**
 * Component-wise cosine of a 2-dimensional vector.
 *
 * @param {array} v The input vector, in radians.
 *
 * @returns {array} A new 2-dimensional array r, where r[i] = {@link SpiderGL.Math.cos}(v[i]).
 */
SpiderGL.Math.Vec2.cos = function (v) {
	return [SpiderGL.Math.cos(v[0]), SpiderGL.Math.cos(v[1])];
}

/**
 * Component-wise conversion of a 2-dimensional vector from degrees to radians.
 *
 * @param {array} v The input vector, in radians.
 *
 * @returns {array} A new 2-dimensional array r, where r[i] = {@link SpiderGL.Math.degToRad}(v[i]).
 */
SpiderGL.Math.Vec2.degToRad = function (v) {
	return [SpiderGL.Math.degToRad(v[0]), SpiderGL.Math.degToRad(v[1])];
}

/**
 * Component-wise exponential of a 2-dimensional vector.
 *
 * @param {array} v The input vector.
 *
 * @returns {array} A new 2-dimensional array r, where r[i] = {@link SpiderGL.Math.exp}(v[i]).
 */
SpiderGL.Math.Vec2.exp = function (v) {
	return [SpiderGL.Math.exp(v[0]), SpiderGL.Math.exp(v[1])];
}

/**
 * Component-wise floor of a 2-dimensional vector.
 *
 * @param {array} v The input vector.
 *
 * @returns {array} A new 2-dimensional array r, where r[i] = {@link SpiderGL.Math.floor}(v[i]).
 */
SpiderGL.Math.Vec2.floor = function (v) {
	return [SpiderGL.Math.floor(v[0]), SpiderGL.Math.floor(v[1])];
}

/**
 * Linear interpolation between two 2-dimensional vectors.
 *
 * @param {array} u The start interpolation bound.
 * @param {array} v The stop interpolation bound.
 * @param {number} t The interpolation factor, between 0 and 1.
 *
 * @returns {array} A new 2-dimensional array r, where r[i] = (1-t)*u[i] + t*v[i].
 */
SpiderGL.Math.Vec2.lerp = function (u, v, t) {
	return [
		SpiderGL.Math.lerp(u[0], v[0], t),
		SpiderGL.Math.lerp(u[1], v[1], t)
	];
}

/**
 * Component-wise natural (base E) logarithm of a 2-dimensional vector.
 * Same as {@link SpiderGL.Math.Vec2.log}.
 *
 * @param {array} v The input vector.
 *
 * @returns {array} A new 2-dimensional array r, where r[i] = {@link SpiderGL.Math.ln}(v[i]).
 */
SpiderGL.Math.Vec2.ln = function (v) {
	return [SpiderGL.Math.ln(v[0]), SpiderGL.Math.ln(v[1])];
}

/**
 * Component-wise natural (base E) logarithm of a 2-dimensional vector.
 *
 * @param {array} v The input vector.
 *
 * @returns {array} A new 2-dimensional array r, where r[i] = {@link SpiderGL.Math.log}(v[i]).
 */
SpiderGL.Math.Vec2.log = function (v) {
	return [SpiderGL.Math.log(v[0]), SpiderGL.Math.log(v[1])];
}

/**
 * Component-wise base 2 logarithm of a 2-dimensional vector.
 *
 * @param {array} v The input vector.
 *
 * @returns {array} A new 2-dimensional array r, where r[i] = {@link SpiderGL.Math.log2}(v[i]).
 */
SpiderGL.Math.Vec2.log2 = function (v) {
	return [SpiderGL.Math.log2(v[0]), SpiderGL.Math.log2(v[1])];
}

/**
 * Component-wise base 10 logarithm of a 2-dimensional vector.
 *
 * @param {array} v The input vector.
 *
 * @returns {array} A new 2-dimensional array r, where r[i] = {@link SpiderGL.Math.log10}(v[i]).
 */
SpiderGL.Math.Vec2.log10 = function (v) {
	return [SpiderGL.Math.log10(v[0]), SpiderGL.Math.log10(v[1])];
}

/**
 * Component-wise maximum of two 2-dimensional vectors.
 *
 * @param {array} u The first vector.
 * @param {array} v The second vector.
 *
 * @returns {array} A new 2-dimensional array r, where r[i] = {@link SpiderGL.Math.max}(u[i], v[i]).
 */
SpiderGL.Math.Vec2.max = function (u, v) {
	return [SpiderGL.Math.max(u[0], v[0]), SpiderGL.Math.max(u[1], v[1])];
}

/**
 * Component-wise minimum of two 2-dimensional vectors.
 *
 * @param {array} u The first vector.
 * @param {array} v The second vector.
 *
 * @returns {array} A new 2-dimensional array r, where r[i] = {@link SpiderGL.Math.min}(u[i], v[i]).
 */
SpiderGL.Math.Vec2.min = function (u, v) {
	return [SpiderGL.Math.min(u[0], v[0]), SpiderGL.Math.min(u[1], v[1])];
}

/**
 * Component-wise power of two 2-dimensional vectors.
 *
 * @param {array} u The base vector.
 * @param {array} v The exponent vector.
 *
 * @returns {array} A new 2-dimensional array r, where r[i] = {@link SpiderGL.Math.pow}(u[i], v[i]).
 */
SpiderGL.Math.Vec2.pow = function (u, v) {
	return [SpiderGL.Math.pow(u[0], v[0]), SpiderGL.Math.pow(u[1], v[1])];
}

/**
 * Component-wise conversion of a 2-dimensional vector from radians to degrees.
 *
 * @param {array} v The input vector, in degrees.
 *
 * @returns {array} A new 2-dimensional array r, where r[i] = {@link SpiderGL.Math.pow}(v[i]).
 */
SpiderGL.Math.Vec2.radToDeg = function (v) {
	return [SpiderGL.Math.radToDeg(v[0]), SpiderGL.Math.radToDeg(v[1])];
}

/**
 * Creates a random 2-dimensional vector between 0 and 1.
 *
 * @returns {array} A new 2-dimensional array r, where r[i] = {@link SpiderGL.Math.random}().
 */
SpiderGL.Math.Vec2.random = function () {
	return [SpiderGL.Math.random(), SpiderGL.Math.random()];
}

/**
 * Creates a random 2-dimensional vector between 0 and 1.
 * Same as {@link SpiderGL.Math.Vec2.random}.
 *
 * @returns {array} A new 2-dimensional array r, where r[i] = {@link SpiderGL.Math.random01}().
 */
SpiderGL.Math.Vec2.random01 = function () {
	return [SpiderGL.Math.random01(), SpiderGL.Math.random01()];
}

/**
 * Creates a random 2-dimensional vector between -1 and 1.
 *
 * @returns {array} A new 2-dimensional array r, where r[i] = {@link SpiderGL.Math.random11}().
 */
SpiderGL.Math.Vec2.random11 = function () {
	return [SpiderGL.Math.random11(), SpiderGL.Math.random11()];
}

/**
 * Creates a random 2-dimensional vector inside a range.
 *
 * @param {array} min The range vector lower bound.
 * @param {array} max The range vector upper bound.
 *
 * @returns {array} A new 2-dimensional array r, where r[i] = {@link SpiderGL.Math.randomRange}(min[i], max[i]).
 */
SpiderGL.Math.Vec2.randomRange = function (min, max) {
	return [SpiderGL.Math.randomRange(min[0], max[0]), SpiderGL.Math.randomRange(min[1], max[1])];
}

/**
 * Component-wise round of a 2-dimensional vector.
 *
 * @param {array} v The input vector.
 *
 * @returns {array} A new 2-dimensional array r, where r[i] = {@link SpiderGL.Math.round}(v[i]).
 */
SpiderGL.Math.Vec2.round = function (v) {
	return [SpiderGL.Math.round(v[0]), SpiderGL.Math.round(v[1])];
}

/**
 * Component-wise sine of a 2-dimensional vector.
 *
 * @param {array} v The input vector, in radians.
 *
 * @returns {array} A new 2-dimensional array r, where r[i] = {@link SpiderGL.Math.sin}(v[i]).
 */
SpiderGL.Math.Vec2.sin = function (v) {
	return [SpiderGL.Math.sin(v[0]), SpiderGL.Math.sin(v[1])];
}

/**
 * Component-wise square root of a 2-dimensional vector.
 *
 * @param {array} v The input vector.
 *
 * @returns {array} A new 2-dimensional array r, where r[i] = {@link SpiderGL.Math.sqrt}(v[i]).
 */
SpiderGL.Math.Vec2.sqrt = function (v) {
	return [SpiderGL.Math.sqrt(v[0]), SpiderGL.Math.sqrt(v[1])];
}

/**
 * Component-wise tangent root of a 2-dimensional vector.
 *
 * @param {array} v The input vector, in radians.
 *
 * @returns {array} A new 2-dimensional array r, where r[i] = {@link SpiderGL.Math.tan}(v[i]).
 */
SpiderGL.Math.Vec2.tan = function (v) {
	return [SpiderGL.Math.tan(v[0]), SpiderGL.Math.tan(v[1])];
}

/**
 * In-place component-wise copy of two 2-dimensional vectors.
 *
 * @param {array} u The destination vector.
 * @param {array} v The source vector.
 *
 * @returns {array} The destination vector u, where u[i] = v[i].
 */
SpiderGL.Math.Vec2.copy$ = function (u, v) {
	u[0] = v[0];
	u[1] = v[1];
	return u;
}

/**
 * In-place component-wise negation of a 2-dimensional vector.
 *
 * @param {array} v The input vector.
 *
 * @returns {array} The input vector v, where v[i] = -v[i].
 */
SpiderGL.Math.Vec2.neg$ = function (v) {
	v[0] = -v[0];
	v[1] = -v[1];
	return v;
}

/**
 * In-place component-wise addition of two 2-dimensional vectors.
 *
 * @param {array} u The first addition operand.
 * @param {array} v The second addition operand
 *
 * @returns {array} The input vector u, where u[i] = u[i] + v[i].
 */
SpiderGL.Math.Vec2.add$ = function (u, v) {
	u[0] += v[0];
	u[1] += v[1];
	return u;
}

/**
 * In-place component-wise addition of a 2-dimensional vector and a scalar.
 *
 * @param {array} v The vector addition operand.
 * @param {number} s The scalar addition operand
 *
 * @returns {array} The input vector v, where v[i] = v[i] + s.
 */
SpiderGL.Math.Vec2.adds$ = function (v, s) {
	v[0] += s;
	v[1] += s;
	return v;
}

/**
 * In-place component-wise subtraction of two 2-dimensional vectors.
 *
 * @param {array} u The first addition operand.
 * @param {array} v The second addition operand
 *
 * @returns {array} The input vector u, where u[i] = u[i] - v[i].
 */
SpiderGL.Math.Vec2.sub$ = function (u, v) {
	u[0] -= v[0];
	u[1] -= v[1];
	return u;
}

/**
 * In-place component-wise subtraction of a 2-dimensional vector and a scalar.
 *
 * @param {array} v The vector subtraction operand.
 * @param {number} s The scalar subtraction operand
 *
 * @returns {array} The input vector v, where v[i] = v[i] - s.
 */
SpiderGL.Math.Vec2.subs$ = function (v, s) {
	v[0] -= s;
	v[1] -= s;
	return v;
}

/**
 * In-place component-wise subtraction of a scalar and a 2-dimensional vector.
 *
 * @param {number} s The scalar subtraction operand
 * @param {array} v The vector subtraction operand.
 *
 * @returns {array} The input vector v, where v[i] = s - v[i].
 */
SpiderGL.Math.Vec2.ssub$ = function (s, v) {
	v[0] = s - v[0];
	v[1] = s - v[1];
	return v;
}

/**
 * In-place component-wise multiplication of two 2-dimensional vectors.
 *
 * @param {array} u The first multiplication operand.
 * @param {array} v The second multiplication operand
 *
 * @returns {array} The input vector u, where u[i] = u[i] * v[i].
 */
SpiderGL.Math.Vec2.mul$ = function (u, v) {
	u[0] *= v[0];
	u[1] *= v[1];
	return u;
}

/**
 * In-place component-wise multiplication of a 2-dimensional vector and a scalar.
 *
 * @param {array} v The first multiplication operand.
 * @param {number} s The second multiplication operand
 *
 * @returns {array} The input vector v, where v[i] = v[i] * s.
 */
SpiderGL.Math.Vec2.muls$ = function (v, s) {
	v[0] *= s;
	v[1] *= s;
	return v;
}

/**
 * In-place component-wise division of two 2-dimensional vectors.
 *
 * @param {array} u The numerator vector.
 * @param {array} v The denominator vector.
 *
 * @returns {array} The input vector u, where u[i] = u[i] / v[i].
 */
SpiderGL.Math.Vec2.div$ = function (u, v) {
	u[0] /= v[0];
	u[1] /= v[1];
	return u;
}

/**
 * In-place component-wise division of a 2-dimensional vector by a scalar.
 *
 * @param {array} v The numerator vector.
 * @param {number} s The scalar denominator.
 *
 * @returns {array} The input vector v, where v[i] = v[i] / s.
 */
SpiderGL.Math.Vec2.divs$ = function (v, s) {
	v[0] /= s;
	v[1] /= s;
	return v;
}

/**
 * In-place component-wise division of a scalar by a 2-dimensional.
 *
 * @param {number} s The scalar numerator.
 * @param {array} v The denominator vector.
 *
 * @returns {array} The input vector v, where v[i] = s / v[i].
 */
SpiderGL.Math.Vec2.sdiv$ = function (v, s) {
	v[0] = s / v[0];
	v[1] = s / v[1];
	return v;
}

/**
 * In-place perp operation.
 * Returns a 2-dimensional vector which is orthogonal to the input vector and lies in the right halfspace.
 *
 * @param {array} v The input vector.
 *
 * @returns {array} The input vector v, where v = [v[1], -v[0]].
 */
SpiderGL.Math.Vec2.perp$ = function (v) {
	var v0 = v[0];
	v[0] = v[1];
	v[1] = -v0;
	return v;
}

/**
 * In-place 2-dimensional vector normalization.
 *
 * @param {array} v The input vector.
 *
 * @returns {array} The input vector v, where v[i] = v[i] / {@link SpiderGL.Math.Vec2.length}(v).
 */
SpiderGL.Math.Vec2.normalize$ = function (v) {
	var f = 1.0 / SpiderGL.Math.Vec2.length(v);
	return SpiderGL.Math.Vec2.muls$(v, f);
}

/*---------------------------------------------------------*/



// 3-dimensional vector
/*---------------------------------------------------------*/

/**
 * The SpiderGL.Math.Vec3 namespace.
 * The provided functions operate on 3-dimensional vectors, represented as standard JavaScript arrays of length 3.
 * In general, vectors are considered as column vectors.
 *
 * @namespace The SpiderGL.Math.Vec3 namespace defines operations on 3-dimensional vectors.
 */
SpiderGL.Math.Vec3 = { };

/**
 * Duplicates the input 3-dimensional vector.
 *
 * @param {array} v The input vector.
 *
 * @returns {array} A new 3-dimensional array r, where r[i] = v[i] (same as v.slice(0, 3)).
 */
SpiderGL.Math.Vec3.dup = function (v) {
	return v.slice(0, 3);
}

/**
 * Creates a 3-dimensional vector initialized with a scalar.
 *
 * @param {number} s The input scalar.
 *
 * @returns {array} A new 3-dimensional array r, where r[i] = s.
 */
SpiderGL.Math.Vec3.scalar = function (s) {
	return [s, s, s];
}

/**
 * Creates a 3-dimensional vector initialized with zero.
 *
 * @returns {array} A new 3-dimensional array r, where r[i] = 0.
 */
SpiderGL.Math.Vec3.zero = function () {
	return [0, 0, 0];
}

/**
 * Creates a 3-dimensional vector initialized with one.
 *
 * @returns {array} A new 3-dimensional array r, where r[i] = 1.0.
 */
SpiderGL.Math.Vec3.one = function () {
	return [1, 1, 1];
}

/**
 * Creates a 3-dimensional vector initialized with SpiderGL.Math.MAX_NUMBER.
 *
 * @returns {array} A new 3-dimensional array r, where r[i] = SpiderGL.Math.MAX_NUMBER.
 */
SpiderGL.Math.Vec3.maxNumber = function () {
	return [SpiderGL.Math.MAX_NUMBER, SpiderGL.Math.MAX_NUMBER, SpiderGL.Math.MAX_NUMBER];
}

/**
 * Creates a 3-dimensional vector initialized with SpiderGL.Math.MIN_NUMBER.
 *
 * @returns {array} A new 3-dimensional array r, where r[i] = SpiderGL.Math.MIN_NUMBER.
 */
SpiderGL.Math.Vec3.minNumber = function () {
	return [SpiderGL.Math.MIN_NUMBER, SpiderGL.Math.MIN_NUMBER, SpiderGL.Math.MIN_NUMBER];
}

/**
 * Creates a 2-dimensional vector from a 3-dimensional vector.
 *
 * @param {array} v The input vector.
 *
 * @returns {array} A new 2-dimensional array r equal to v with the 3rd component dropped.
 */
SpiderGL.Math.Vec3.to2 = function (v) {
	return [v[0], v[1]];
}

/**
 * Creates a 4-dimensional vector from a 3-dimensional vector.
 *
 * @param {array} v The input vector.
 * @param {number} [w=1.0] The 4th component.
 *
 * @returns {array} A new 4-dimensional array r equal to v extended with w as 4th component.
 */
SpiderGL.Math.Vec3.to4 = function (v, w) {
	return [v[0], v[1], v[2], (w != undefined) ? w : 1];
}

/**
 * Component-wise negation of a 3-dimensional vector.
 *
 * @param {array} v The input vector.
 *
 * @returns {array} A new 3-dimensionals vector r, where r[i] = -v[i].
 */
SpiderGL.Math.Vec3.neg = function (v) {
	return [-v[0], -v[1], -v[2]];
}

/**
 * Component-wise addition of two 3-dimensional vectors.
 *
 * @param {array} u The first addition operand.
 * @param {array} v The second addition operand.
 *
 * @returns {array} A new 3-dimensionals vector r, where r[i] = u[i] + v[i].
 */
SpiderGL.Math.Vec3.add = function (u, v) {
	return [u[0]+v[0], u[1]+v[1], u[2]+v[2]];
}

/**
 * Component-wise addition of a 3-dimensional vector and a scalar.
 *
 * @param {array} v The vector addition operand.
 * @param {number} s The scalar addition operand.
 *
 * @returns {array} A new 3-dimensionals vector r, where r[i] = v[i] + s.
 */
SpiderGL.Math.Vec3.adds = function (v, s) {
	return [v[0]+s, v[1]+s, v[2]+s];
}

/**
 * Component-wise subtraction of two 3-dimensional vectors.
 *
 * @param {array} u The first subtraction operand.
 * @param {array} v The second subtraction operand.
 *
 * @returns {array} A new 3-dimensionals vector r, where r[i] = u[i] - v[i].
 */
SpiderGL.Math.Vec3.sub = function (u, v) {
	return [u[0]-v[0], u[1]-v[1], u[2]-v[2]];
}

/**
 * Component-wise subtraction of a 3-dimensional vector and a scalar.
 *
 * @param {array} v The vector subtraction operand.
 * @param {number} s The scalar subtraction operand.
 *
 * @returns {array} A new 3-dimensionals vector r, where r[i] = v[i] - s.
 */
SpiderGL.Math.Vec3.subs = function (v, s) {
	return [v[0]-s, v[1]-s, v[2]-s];
}

/**
 * Component-wise subtraction of a scalar and a 3-dimensional.
 *
 * @param {number} s The scalar subtraction operand.
 * @param {array} v The vector subtraction operand.
 *
 * @returns {array} A new 3-dimensionals vector r, where r[i] = s - v[i].
 */
SpiderGL.Math.Vec3.ssub = function (s, v) {
	return [s-v[0], s-v[1], s-v[2]];
}

/**
 * Component-wise multiplication of two 3-dimensional vectors.
 *
 * @param {array} u The first multiplication operand.
 * @param {array} v The second multiplication operand.
 *
 * @returns {array} A new 3-dimensionals vector r, where r[i] = u[i] * v[i].
 */
SpiderGL.Math.Vec3.mul = function (u, v) {
	return [u[0]*v[0], u[1]*v[1], u[2]*v[2]];
}

/**
 * Component-wise multiplication of a 3-dimensional vector and a scalar.
 *
 * @param {array} v The vector multiplication operand.
 * @param {number} s The scalar multiplication operand.
 *
 * @returns {array} A new 3-dimensionals vector r, where r[i] = v[i] * s.
 */
SpiderGL.Math.Vec3.muls = function (v, s) {
	return [v[0]*s, v[1]*s, v[2]*s];
}

/**
 * Component-wise division of two 3-dimensional vectors.
 *
 * @param {array} u The numerator vector.
 * @param {array} v The denominator vector.
 *
 * @returns {array} A new 3-dimensionals vector r, where r[i] = u[i] / v[i].
 */
SpiderGL.Math.Vec3.div = function (u, v) {
	return [u[0]/v[0], u[1]/v[1], u[2]/v[2]];
}

/**
 * Component-wise division of a 3-dimensional vector by a scalar.
 *
 * @param {array} v The numerator vector.
 * @param {number} s The scalar denominator.
 *
 * @returns {array} A new 3-dimensionals vector r, where r[i] = v[i] / s.
 */
SpiderGL.Math.Vec3.divs = function (v, s) {
	return [v[0]/s, v[1]/s, v[2]/s];
}

/**
 * Component-wise division of a scalar by a 3-dimensional vector.
 *
 * @param {number} s The denominator scalar.
 * @param {array} v The numerator vector.
 *
 * @returns {array} A new 3-dimensionals vector r, where r[i] = s / v[i].
 */
SpiderGL.Math.Vec3.sdiv = function (s, v) {
	return [s/v[0], s/v[1], s/v[2]];
}

/**
 * Component-wise reciprocal of a 3-dimensional vector.
 *
 * @param {array} v The input (denominator) vector.
 *
 * @returns {array} A new 3-dimensionals vector r, where r[i] = 1.0 / v[i].
 */
SpiderGL.Math.Vec3.rcp = function (v) {
	return [1.0/v[0], 1.0/v[1], 1.0/v[2]];
}

/**
 * Dot product of two 3-dimensional vectors.
 *
 * @param {array} u The first vector operand.
 * @param {array} v The second vector operand.
 *
 * @returns {number} The dot product of u and v.
 */
SpiderGL.Math.Vec3.dot = function (u, v) {
	return (u[0]*v[0] + u[1]*v[1] + u[2]*v[2]);
}

/**
 * Cross product of two 3-dimensional vectors.
 *
 * @param {array} u The first vector operand.
 * @param {array} v The second vector operand.
 *
 * @returns {array} A new 3-dimensional array equal to the cross product of u and v.
 */
SpiderGL.Math.Vec3.cross = function (u, v) {
	return [u[1]*v[2] - u[2]*v[1], u[2]*v[0] - u[0]*v[2], u[0]*v[1] - u[1]*v[0]];
}

/**
 * Squared length of a 3-dimensional vector.
 *
 * @param {array} v The input vector.
 *
 * @returns {number} The squared length of v, same as the dot product of v with itself.
 */
SpiderGL.Math.Vec3.sqLength = function (v) {
	return SpiderGL.Math.Vec3.dot(v, v);
}

/**
 * Length of a 3-dimensional vector.
 *
 * @param {array} v The input vector.
 *
 * @returns {number} The length of v.
 */
SpiderGL.Math.Vec3.length = function (v) {
	return SpiderGL.Math.sqrt(SpiderGL.Math.Vec3.sqLength(v));
}

/**
 * Creates a normalized 3-dimensional vector.
 *
 * @param {array} v The input vector.
 *
 * @returns {array} A new 3-dimensional array r representing the normalized v, where r[i] = v[i] / {@link SpiderGL.Math.Vec3.length}(v).
 */
SpiderGL.Math.Vec3.normalize = function (v) {
	var f = 1.0 / SpiderGL.Math.Vec3.length(v);
	return SpiderGL.Math.Vec3.muls(v, f);
}

/**
 * Component-wise absolute value of a 3-dimensional vector.
 *
 * @param {array} v The input vector.
 *
 * @returns {array} A new 3-dimensional array r, where r[i] = {@link SpiderGL.Math.abs}(v[i]).
 */
SpiderGL.Math.Vec3.abs = function (v) {
	return [SpiderGL.Math.abs(v[0]), SpiderGL.Math.abs(v[1]), SpiderGL.Math.abs(v[2])];
}

/**
 * Component-wise arccosine of a 3-dimensional vector.
 *
 * @param {array} v The input vector.
 *
 * @returns {array} A new 3-dimensional array r, where r[i] = {@link SpiderGL.Math.acos}(v[i]), in radians.
 */
SpiderGL.Math.Vec3.acos = function (v) {
	return [SpiderGL.Math.acos(v[0]), SpiderGL.Math.acos(v[1]), SpiderGL.Math.acos(v[2])];
}

/**
 * Component-wise arcsine of a 3-dimensional vector.
 *
 * @param {array} v The input vector.
 *
 * @returns {array} A new 3-dimensional array r, where r[i] = {@link SpiderGL.Math.asin}(v[i]), in radians.
 */
SpiderGL.Math.Vec3.asin = function (v) {
	return [SpiderGL.Math.asin(v[0]), SpiderGL.Math.asin(v[1]), SpiderGL.Math.asin(v[2])];
}

/**
 * Component-wise arctangent of a 3-dimensional vector.
 *
 * @param {array} v The input vector.
 *
 * @returns {array} A new 3-dimensional array r, where r[i] = {@link SpiderGL.Math.atan}(v[i]), between -PI/2 and PI/2 radians.
 */
SpiderGL.Math.Vec3.atan = function (v) {
	return [SpiderGL.Math.atan(v[0]), SpiderGL.Math.atan(v[1]), SpiderGL.Math.atan(v[2])];
}

/**
 * Component-wise arctangent of the quotient of two 3-dimensional vectors.
 *
 * @param {array} y The numerator vector.
 * @param {array} x The denominator vector.
 *
 * @returns {array} A new 3-dimensional array r, where r[i] = {@link SpiderGL.Math.atan2}(y[i], x[i]), between PI and -PI radians.
 */
SpiderGL.Math.Vec3.atan2 = function (y, x) {
	return [SpiderGL.Math.atan2(y[0], x[0]), SpiderGL.Math.atan2(y[1], x[1]), SpiderGL.Math.atan2(y[2], x[2])];
}

/**
 * Component-wise ceil of a 3-dimensional vector.
 *
 * @param {array} v The input vector.
 *
 * @returns {array} A new 3-dimensional array r, where r[i] = {@link SpiderGL.Math.ceil}(v[i]).
 */
SpiderGL.Math.Vec3.ceil = function (v) {
	return [SpiderGL.Math.ceil(v[0]), SpiderGL.Math.ceil(v[1]), SpiderGL.Math.ceil(v[2])];
}

/**
 * Component-wise clamp of a 3-dimensional vector with vector bounds.
 *
 * @param {array} v The input vector.
 * @param {array} min The lower 3-dimensional bound.
 * @param {array} max The upper 3-dimensional bound.
 *
 * @returns {array} A new 3-dimensional array r, where r[i] = {@link SpiderGL.Math.clamp}(v[i], min[i], max[i]).
 */
SpiderGL.Math.Vec3.clamp = function (v, min, max) {
	return [SpiderGL.Math.clamp(v[0], min[0], max[0]), SpiderGL.Math.clamp(v[1], min[1], max[1]), SpiderGL.Math.clamp(v[2], min[2], max[2])];
}

/**
 * Component-wise cosine of a 3-dimensional vector.
 *
 * @param {array} v The input vector, in radians.
 *
 * @returns {array} A new 3-dimensional array r, where r[i] = {@link SpiderGL.Math.cos}(v[i]).
 */
SpiderGL.Math.Vec3.cos = function (v) {
	return [SpiderGL.Math.cos(v[0]), SpiderGL.Math.cos(v[1]), SpiderGL.Math.cos(v[2])];
}

/**
 * Component-wise conversion of a 3-dimensional vector from degrees to radians.
 *
 * @param {array} v The input vector, in radians.
 *
 * @returns {array} A new 3-dimensional array r, where r[i] = {@link SpiderGL.Math.degToRad}(v[i]).
 */
SpiderGL.Math.Vec3.degToRad = function (v) {
	return [SpiderGL.Math.degToRad(v[0]), SpiderGL.Math.degToRad(v[1]), SpiderGL.Math.degToRad(v[2])];
}

/**
 * Component-wise exponential of a 3-dimensional vector.
 *
 * @param {array} v The input vector.
 *
 * @returns {array} A new 3-dimensional array r, where r[i] = {@link SpiderGL.Math.exp}(v[i]).
 */
SpiderGL.Math.Vec3.exp = function (v) {
	return [SpiderGL.Math.exp(v[0]), SpiderGL.Math.exp(v[1]), SpiderGL.Math.exp(v[2])];
}

/**
 * Component-wise floor of a 3-dimensional vector.
 *
 * @param {array} v The input vector.
 *
 * @returns {array} A new 3-dimensional array r, where r[i] = {@link SpiderGL.Math.floor}(v[i]).
 */
SpiderGL.Math.Vec3.floor = function (v) {
	return [SpiderGL.Math.floor(v[0]), SpiderGL.Math.floor(v[1]), SpiderGL.Math.floor(v[2])];
}

/**
 * Linear interpolation between two 3-dimensional vectors.
 *
 * @param {array} u The start interpolation bound.
 * @param {array} v The stop interpolation bound.
 * @param {number} t The interpolation factor, between 0 and 1.
 *
 * @returns {array} A new 3-dimensional array r, where r[i] = (1-t)*u[i] + t*v[i].
 */
SpiderGL.Math.Vec3.lerp = function (u, v, t) {
	return [
		SpiderGL.Math.lerp(u[0], v[0], t),
		SpiderGL.Math.lerp(u[1], v[1], t),
		SpiderGL.Math.lerp(u[2], v[2], t)
	];
}

/**
 * Component-wise natural (base E) logarithm of a 3-dimensional vector.
 * Same as {@link SpiderGL.Math.Vec3.log}.
 *
 * @param {array} v The input vector.
 *
 * @returns {array} A new 3-dimensional array r, where r[i] = {@link SpiderGL.Math.ln}(v[i]).
 */
SpiderGL.Math.Vec3.ln = function (v) {
	return [SpiderGL.Math.ln(v[0]), SpiderGL.Math.ln(v[1]), SpiderGL.Math.ln(v[2])];
}

/**
 * Component-wise natural (base E) logarithm of a 3-dimensional vector.
 *
 * @param {array} v The input vector.
 *
 * @returns {array} A new 3-dimensional array r, where r[i] = {@link SpiderGL.Math.log}(v[i]).
 */
SpiderGL.Math.Vec3.log = function (v) {
	return [SpiderGL.Math.log(v[0]), SpiderGL.Math.log(v[1]), SpiderGL.Math.log(v[2])];
}

/**
 * Component-wise base 2 logarithm of a 3-dimensional vector.
 *
 * @param {array} v The input vector.
 *
 * @returns {array} A new 3-dimensional array r, where r[i] = {@link SpiderGL.Math.log2}(v[i]).
 */
SpiderGL.Math.Vec3.log2 = function (v) {
	return [SpiderGL.Math.log2(v[0]), SpiderGL.Math.log2(v[1]), SpiderGL.Math.log2(v[2])];
}

/**
 * Component-wise base 10 logarithm of a 3-dimensional vector.
 *
 * @param {array} v The input vector.
 *
 * @returns {array} A new 3-dimensional array r, where r[i] = {@link SpiderGL.Math.log10}(v[i]).
 */
SpiderGL.Math.Vec3.log10 = function (v) {
	return [SpiderGL.Math.log10(v[0]), SpiderGL.Math.log10(v[1]), SpiderGL.Math.log10(v[2])];
}

/**
 * Component-wise maximum of two 3-dimensional vectors.
 *
 * @param {array} u The first vector.
 * @param {array} v The second vector.
 *
 * @returns {array} A new 3-dimensional array r, where r[i] = {@link SpiderGL.Math.max}(u[i], v[i]).
 */
SpiderGL.Math.Vec3.max = function (u, v) {
	return [SpiderGL.Math.max(u[0], v[0]), SpiderGL.Math.max(u[1], v[1]), SpiderGL.Math.max(u[2], v[2])];
}

/**
 * Component-wise minimum of two 3-dimensional vectors.
 *
 * @param {array} u The first vector.
 * @param {array} v The second vector.
 *
 * @returns {array} A new 3-dimensional array r, where r[i] = {@link SpiderGL.Math.min}(u[i], v[i]).
 */
SpiderGL.Math.Vec3.min = function (u, v) {
	return [SpiderGL.Math.min(u[0], v[0]), SpiderGL.Math.min(u[1], v[1]), SpiderGL.Math.min(u[2], v[2])];
}

/**
 * Component-wise power of two 3-dimensional vectors.
 *
 * @param {array} u The base vector.
 * @param {array} v The exponent vector.
 *
 * @returns {array} A new 3-dimensional array r, where r[i] = {@link SpiderGL.Math.pow}(u[i], v[i]).
 */
SpiderGL.Math.Vec3.pow = function (u, v) {
	return [SpiderGL.Math.pow(u[0], v[0]), SpiderGL.Math.pow(u[1], v[1]), SpiderGL.Math.pow(u[2], v[2])];
}

/**
 * Component-wise conversion of a 3-dimensional vector from radians to degrees.
 *
 * @param {array} v The input vector, in degrees.
 *
 * @returns {array} A new 3-dimensional array r, where r[i] = {@link SpiderGL.Math.pow}(v[i]).
 */
SpiderGL.Math.Vec3.radToDeg = function (v) {
	return [SpiderGL.Math.radToDeg(v[0]), SpiderGL.Math.radToDeg(v[1]), SpiderGL.Math.radToDeg(v[2])];
}

/**
 * Creates a random 3-dimensional vector between 0 and 1.
 *
 * @returns {array} A new 3-dimensional array r, where r[i] = {@link SpiderGL.Math.random}().
 */
SpiderGL.Math.Vec3.random = function () {
	return [SpiderGL.Math.random(), SpiderGL.Math.random(), SpiderGL.Math.random()];
}

/**
 * Creates a random 3-dimensional vector between 0 and 1.
 * Same as {@link SpiderGL.Math.Vec3.random}.
 *
 * @returns {array} A new 3-dimensional array r, where r[i] = {@link SpiderGL.Math.random01}().
 */
SpiderGL.Math.Vec3.random01 = function () {
	return [SpiderGL.Math.random01(), SpiderGL.Math.random01(), SpiderGL.Math.random01()];
}

/**
 * Creates a random 3-dimensional vector between -1 and 1.
 *
 * @returns {array} A new 3-dimensional array r, where r[i] = {@link SpiderGL.Math.random11}().
 */
SpiderGL.Math.Vec3.random11 = function () {
	return [SpiderGL.Math.random11(), SpiderGL.Math.random11(), SpiderGL.Math.random11()];
}

/**
 * Creates a random 3-dimensional vector inside a range.
 *
 * @param {array} min The range vector lower bound.
 * @param {array} max The range vector upper bound.
 *
 * @returns {array} A new 3-dimensional array r, where r[i] = {@link SpiderGL.Math.randomRange}(min[i], max[i]).
 */
SpiderGL.Math.Vec3.randomRange = function (min, max) {
	return [SpiderGL.Math.randomRange(min[0], max[0]), SpiderGL.Math.randomRange(min[1], max[1]), SpiderGL.Math.randomRange(min[2], max[2])];
}

/**
 * Component-wise round of a 3-dimensional vector.
 *
 * @param {array} v The input vector.
 *
 * @returns {array} A new 3-dimensional array r, where r[i] = {@link SpiderGL.Math.round}(v[i]).
 */
SpiderGL.Math.Vec3.round = function (v) {
	return [SpiderGL.Math.round(v[0]), SpiderGL.Math.round(v[1]), SpiderGL.Math.round(v[2])];
}

/**
 * Component-wise sine of a 3-dimensional vector.
 *
 * @param {array} v The input vector, in radians.
 *
 * @returns {array} A new 3-dimensional array r, where r[i] = {@link SpiderGL.Math.sin}(v[i]).
 */
SpiderGL.Math.Vec3.sin = function (v) {
	return [SpiderGL.Math.sin(v[0]), SpiderGL.Math.sin(v[1]), SpiderGL.Math.sin(v[2])];
}

/**
 * Component-wise square root of a 3-dimensional vector.
 *
 * @param {array} v The input vector.
 *
 * @returns {array} A new 3-dimensional array r, where r[i] = {@link SpiderGL.Math.sqrt}(v[i]).
 */
SpiderGL.Math.Vec3.sqrt = function (v) {
	return [SpiderGL.Math.sqrt(v[0]), SpiderGL.Math.sqrt(v[1]), SpiderGL.Math.sqrt(v[2])];
}

/**
 * Component-wise tangent root of a 3-dimensional vector.
 *
 * @param {array} v The input vector, in radians.
 *
 * @returns {array} A new 3-dimensional array r, where r[i] = {@link SpiderGL.Math.tan}(v[i]).
 */
SpiderGL.Math.Vec3.tan = function (v) {
	return [SpiderGL.Math.tan(v[0]), SpiderGL.Math.tan(v[1]), SpiderGL.Math.tan(v[2])];
}

/**
 * In-place component-wise copy of two 3-dimensional vectors.
 *
 * @param {array} u The destination vector.
 * @param {array} v The source vector.
 *
 * @returns {array} The destination vector u, where u[i] = v[i].
 */
SpiderGL.Math.Vec3.copy$ = function (u, v) {
	u[0] = v[0];
	u[1] = v[1];
	u[2] = v[2];
	return u;
}

/**
 * In-place component-wise negation of a 3-dimensional vector.
 *
 * @param {array} v The input vector.
 *
 * @returns {array} The input vector v, where v[i] = -v[i].
 */
SpiderGL.Math.Vec3.neg$ = function (v) {
	v[0] = -v[0];
	v[1] = -v[1];
	v[2] = -v[2];
	return v;
}

/**
 * In-place component-wise addition of two 3-dimensional vectors.
 *
 * @param {array} u The first addition operand.
 * @param {array} v The second addition operand
 *
 * @returns {array} The input vector u, where u[i] = u[i] + v[i].
 */
SpiderGL.Math.Vec3.add$ = function (u, v) {
	u[0] += v[0];
	u[1] += v[1];
	u[2] += v[2];
	return u;
}

/**
 * In-place component-wise addition of a 3-dimensional vector and a scalar.
 *
 * @param {array} v The vector addition operand.
 * @param {number} s The scalar addition operand
 *
 * @returns {array} The input vector v, where v[i] = v[i] + s.
 */
SpiderGL.Math.Vec3.adds$ = function (v, s) {
	v[0] += s;
	v[1] += s;
	v[2] += s;
	return v;
}

/**
 * In-place component-wise subtraction of two 3-dimensional vectors.
 *
 * @param {array} u The first addition operand.
 * @param {array} v The second addition operand
 *
 * @returns {array} The input vector u, where u[i] = u[i] - v[i].
 */
SpiderGL.Math.Vec3.sub$ = function (u, v) {
	u[0] -= v[0];
	u[1] -= v[1];
	u[2] -= v[2];
	return u;
}

/**
 * In-place component-wise subtraction of a 3-dimensional vector and a scalar.
 *
 * @param {array} v The vector subtraction operand.
 * @param {number} s The scalar subtraction operand
 *
 * @returns {array} The input vector v, where v[i] = v[i] - s.
 */
SpiderGL.Math.Vec3.subs$ = function (v, s) {
	v[0] -= s;
	v[1] -= s;
	v[2] -= s;
	return v;
}

/**
 * In-place component-wise subtraction of a scalar and a 3-dimensional vector.
 *
 * @param {number} s The scalar subtraction operand
 * @param {array} v The vector subtraction operand.
 *
 * @returns {array} The input vector v, where v[i] = s - v[i].
 */
SpiderGL.Math.Vec3.ssub$ = function (s, v) {
	v[0] = s - v[0];
	v[1] = s - v[1];
	v[2] = s - v[2];
	return v;
}

/**
 * In-place component-wise multiplication of two 3-dimensional vectors.
 *
 * @param {array} u The first multiplication operand.
 * @param {array} v The second multiplication operand
 *
 * @returns {array} The input vector u, where u[i] = u[i] * v[i].
 */
SpiderGL.Math.Vec3.mul$ = function (u, v) {
	u[0] *= v[0];
	u[1] *= v[1];
	u[2] *= v[2];
	return u;
}

/**
 * In-place component-wise multiplication of a 3-dimensional vector and a scalar.
 *
 * @param {array} v The first multiplication operand.
 * @param {number} s The second multiplication operand
 *
 * @returns {array} The input vector v, where v[i] = v[i] * s.
 */
SpiderGL.Math.Vec3.muls$ = function (v, s) {
	v[0] *= s;
	v[1] *= s;
	v[2] *= s;
	return v;
}

/**
 * In-place component-wise division of two 3-dimensional vectors.
 *
 * @param {array} u The numerator vector.
 * @param {array} v The denominator vector.
 *
 * @returns {array} The input vector u, where u[i] = u[i] / v[i].
 */
SpiderGL.Math.Vec3.div$ = function (u, v) {
	u[0] /= v[0];
	u[1] /= v[1];
	u[2] /= v[2];
	return u;
}

/**
 * In-place component-wise division of a 3-dimensional vector by a scalar.
 *
 * @param {array} v The numerator vector.
 * @param {number} s The scalar denominator.
 *
 * @returns {array} The input vector v, where v[i] = v[i] / s.
 */
SpiderGL.Math.Vec3.divs$ = function (v, s) {
	v[0] /= s;
	v[1] /= s;
	v[2] /= s;
	return v;
}

/**
 * In-place component-wise division of a scalar by a 3-dimensional.
 *
 * @param {number} s The scalar numerator.
 * @param {array} v The denominator vector.
 *
 * @returns {array} The input vector v, where v[i] = s / v[i].
 */
SpiderGL.Math.Vec3.sdiv$ = function (v, s) {
	v[0] = s / v[0];
	v[1] = s / v[1];
	v[2] = s / v[2];
	return v;
}

/**
 * In-place 3-dimensional vector normalization.
 *
 * @param {array} v The input vector.
 *
 * @returns {array} The input vector v, where v[i] = v[i] / {@link SpiderGL.Math.Vec3.length}(v)
 */
SpiderGL.Math.Vec3.normalize$ = function (v) {
	var f = 1.0 / SpiderGL.Math.Vec3.length(v);
	return SpiderGL.Math.Vec3.muls$(v, f);
}

/*---------------------------------------------------------*/



// 4-dimensional vector
/*---------------------------------------------------------*/

/**
 * The SpiderGL.Math.Vec4 namespace.
 * The provided functions operate on 4-dimensional vectors, represented as standard JavaScript arrays of length 4.
 * In general, vectors are considered as column vectors.
 *
 * @namespace The SpiderGL.Math.Vec4 namespace defines operations on 4-dimensional vectors.
 */
SpiderGL.Math.Vec4 = { };

/**
 * Duplicates the input 4-dimensional vector.
 *
 * @param {array} v The input vector.
 *
 * @returns {array} A new 4-dimensional array r, where r[i] = v[i] (same as v.slice(0, 4)).
 */
SpiderGL.Math.Vec4.dup = function (v) {
	return v.slice(0, 4);
}

/**
 * Creates a 4-dimensional vector initialized with a scalar.
 *
 * @param {number} s The input scalar.
 *
 * @returns {array} A new 4-dimensional array r, where r[i] = s.
 */
SpiderGL.Math.Vec4.scalar = function (s) {
	return [s, s, s, s];
}

/**
 * Creates a 4-dimensional vector initialized with zero.
 *
 * @returns {array} A new 4-dimensional array r, where r[i] = 0.
 */
SpiderGL.Math.Vec4.zero = function () {
	return [0, 0, 0, 0];
}

/**
 * Creates a 4-dimensional vector initialized with one.
 *
 * @returns {array} A new 4-dimensional array r, where r[i] = 1.0.
 */
SpiderGL.Math.Vec4.one = function () {
	return [1, 1, 1, 1];
}

/**
 * Creates a 4-dimensional vector initialized with SpiderGL.Math.MAX_NUMBER.
 *
 * @returns {array} A new 4-dimensional array r, where r[i] = SpiderGL.Math.MAX_NUMBER.
 */
SpiderGL.Math.Vec4.maxNumber = function () {
	return [SpiderGL.Math.MAX_NUMBER, SpiderGL.Math.MAX_NUMBER, SpiderGL.Math.MAX_NUMBER, SpiderGL.Math.MAX_NUMBER];
}

/**
 * Creates a 4-dimensional vector initialized with SpiderGL.Math.MIN_NUMBER.
 *
 * @returns {array} A new 4-dimensional array r, where r[i] = SpiderGL.Math.MIN_NUMBER.
 */
SpiderGL.Math.Vec4.minNumber = function () {
	return [SpiderGL.Math.MIN_NUMBER, SpiderGL.Math.MIN_NUMBER, SpiderGL.Math.MIN_NUMBER, SpiderGL.Math.MIN_NUMBER];
}

/**
 * Creates a 2-dimensional vector from a 4-dimensional vector.
 *
 * @param {array} v The input vector.
 *
 * @returns {array} A new 2-dimensional array r equal to v with the 3rd and 4th components dropped.
 */
SpiderGL.Math.Vec4.to2 = function (v) {
	return [v[0], v[1]];
}

/**
 * Creates a 3-dimensional vector from a 4-dimensional vector.
 *
 * @param {array} v The input vector.
 *
 * @returns {array} A new 3-dimensional array r equal to v with the 4th component dropped.
 */
SpiderGL.Math.Vec4.to3 = function (v) {
	return [v[0], v[1], v[2]];
}

/**
 * Component-wise negation of a 4-dimensional vector.
 *
 * @param {array} v The input vector.
 *
 * @returns {array} A new 4-dimensionals vector r, where r[i] = -v[i].
 */
SpiderGL.Math.Vec4.neg = function (v) {
	return [-v[0], -v[1], -v[2], -v[3]];
}

/**
 * Component-wise addition of two 4-dimensional vectors.
 *
 * @param {array} u The first addition operand.
 * @param {array} v The second addition operand.
 *
 * @returns {array} A new 4-dimensionals vector r, where r[i] = u[i] + v[i].
 */
SpiderGL.Math.Vec4.add = function (u, v) {
	return [u[0]+v[0], u[1]+v[1], u[2]+v[2], u[3]+v[3]];
}

/**
 * Component-wise addition of a 4-dimensional vector and a scalar.
 *
 * @param {array} v The vector addition operand.
 * @param {number} s The scalar addition operand.
 *
 * @returns {array} A new 4-dimensionals vector r, where r[i] = v[i] + s.
 */
SpiderGL.Math.Vec4.adds = function (v, s) {
	return [v[0]+s, v[1]+s, v[2]+s, v[3]+s];
}

/**
 * Component-wise subtraction of two 4-dimensional vectors.
 *
 * @param {array} u The first subtraction operand.
 * @param {array} v The second subtraction operand.
 *
 * @returns {array} A new 4-dimensionals vector r, where r[i] = u[i] - v[i].
 */
SpiderGL.Math.Vec4.sub = function (u, v) {
	return [u[0]-v[0], u[1]-v[1], u[2]-v[2], u[3]-v[3]];
}

/**
 * Component-wise subtraction of a 4-dimensional vector and a scalar.
 *
 * @param {array} v The vector subtraction operand.
 * @param {number} s The scalar subtraction operand.
 *
 * @returns {array} A new 4-dimensionals vector r, where r[i] = v[i] - s.
 */
SpiderGL.Math.Vec4.subs = function (v, s) {
	return [v[0]-s, v[1]-s, v[2]-s, v[3]-s];
}

/**
 * Component-wise subtraction of a scalar and a 4-dimensional.
 *
 * @param {number} s The scalar subtraction operand.
 * @param {array} v The vector subtraction operand.
 *
 * @returns {array} A new 4-dimensionals vector r, where r[i] = s - v[i].
 */
SpiderGL.Math.Vec4.ssub = function (s, v) {
	return [s-v[0], s-v[1], s-v[2], s-v[3]];
}

/**
 * Component-wise multiplication of two 4-dimensional vectors.
 *
 * @param {array} u The first multiplication operand.
 * @param {array} v The second multiplication operand.
 *
 * @returns {array} A new 4-dimensionals vector r, where r[i] = u[i] * v[i].
 */
SpiderGL.Math.Vec4.mul = function (u, v) {
	return [u[0]*v[0], u[1]*v[1], u[2]*v[2], u[3]*v[3]];
}

/**
 * Component-wise multiplication of a 4-dimensional vector and a scalar.
 *
 * @param {array} v The vector multiplication operand.
 * @param {number} s The scalar multiplication operand.
 *
 * @returns {array} A new 4-dimensionals vector r, where r[i] = v[i] * s.
 */
SpiderGL.Math.Vec4.muls = function (v, s) {
	return [v[0]*s, v[1]*s, v[2]*s, v[3]*s];
}

/**
 * Component-wise division of two 4-dimensional vectors.
 *
 * @param {array} u The numerator vector.
 * @param {array} v The denominator vector.
 *
 * @returns {array} A new 4-dimensionals vector r, where r[i] = u[i] / v[i].
 */
SpiderGL.Math.Vec4.div = function (u, v) {
	return [u[0]/v[0], u[1]/v[1], u[2]/v[2], u[3]/v[3]];
}

/**
 * Component-wise division of a 4-dimensional vector by a scalar.
 *
 * @param {array} v The numerator vector.
 * @param {number} s The scalar denominator.
 *
 * @returns {array} A new 4-dimensionals vector r, where r[i] = v[i] / s.
 */
SpiderGL.Math.Vec4.divs = function (v, s) {
	return [v[0]/s, v[1]/s, v[2]/s, v[3]/s];
}

/**
 * Component-wise division of a scalar by a 4-dimensional vector.
 *
 * @param {number} s The denominator scalar.
 * @param {array} v The numerator vector.
 *
 * @returns {array} A new 4-dimensionals vector r, where r[i] = s / v[i].
 */
SpiderGL.Math.Vec4.sdiv = function (s, v) {
	return [s/v[0], s/v[1], s/v[2], s/v[3]];
}

/**
 * Component-wise reciprocal of a 4-dimensional vector.
 *
 * @param {array} v The input (denominator) vector.
 *
 * @returns {array} A new 4-dimensionals vector r, where r[i] = 1.0 / v[i].
 */
SpiderGL.Math.Vec4.rcp = function (v) {
	return [1.0/v[0], 1.0/v[1], 1.0/v[2], 1.0/v[3]];
}

/**
 * Dot product of two 4-dimensional vectors.
 *
 * @param {array} u The first vector operand.
 * @param {array} v The second vector operand.
 *
 * @returns {number} The dot product of u and v.
 */
SpiderGL.Math.Vec4.dot = function (u, v) {
	return (u[0]*v[0] + u[1]*v[1] + u[2]*v[2] + u[3]*v[3]);
}

/**
 * Cross product of three 4-dimensional vectors.
 *
 * @param {array} u The first vector operand.
 * @param {array} v The second vector operand.
 * @param {array} w The third vector operand.
 *
 * @returns {array} A new 4-dimensional array equal to the cross product of u, v and w.
 */
SpiderGL.Math.Vec4.cross = function (u, v, w) {
	var a = v[0]*w[1] - v[1]*w[0];
	var b = v[0]*w[2] - v[2]*w[0];
	var c = v[0]*w[3] - v[3]*w[0];
	var d = v[1]*w[2] - v[2]*w[1];
	var e = v[1]*w[3] - v[3]*w[1];
	var f = v[2]*w[3] - v[3]*w[2];

	return [
		u[1]*f - u[2]*e + u[3]*d,
		u[0]*f + u[2]*c - u[3]*b,
		u[0]*e - u[1]*c + u[3]*a,
		u[0]*d + u[1]*b - u[2]*a
	];
}

/**
 * Squared length of a 4-dimensional vector.
 *
 * @param {array} v The input vector.
 *
 * @returns {number} The squared length of v, same as the dot product of v with itself.
 */
SpiderGL.Math.Vec4.sqLength = function (v) {
	return SpiderGL.Math.Vec4.dot(v, v);
}

/**
 * Length of a 4-dimensional vector.
 *
 * @param {array} v The input vector.
 *
 * @returns {number} The length of v.
 */
SpiderGL.Math.Vec4.length = function (v) {
	return SpiderGL.Math.sqrt(SpiderGL.Math.Vec4.sqLength(v));
}

/**
 * Creates a normalized 4-dimensional vector.
 *
 * @param {array} v The input vector.
 *
 * @returns {array} A new 4-dimensional array r representing the normalized v, where r[i] = v[i] / {@link SpiderGL.Math.Vec4.length}(v).
 */
SpiderGL.Math.Vec4.normalize = function (v) {
	var f = 1.0 / SpiderGL.Math.Vec4.length(v);
	return SpiderGL.Math.Vec4.muls(v, f);
}

/**
 * Projects a homogeneous 4-dimensional vector.
 *
 * @param {array} v The input vector.
 *
 * @returns {array} A new 4-dimensional array r, where r[i] = v[i] / v[3].
 */
SpiderGL.Math.Vec4.project = function (v) {
	var f = 1.0 / v[3];
	return [v[0]*f, v[1]*f, v[2]*f, 1.0];
}

/**
 * Component-wise absolute value of a 4-dimensional vector.
 *
 * @param {array} v The input vector.
 *
 * @returns {array} A new 4-dimensional array r, where r[i] = {@link SpiderGL.Math.abs}(v[i]).
 */
SpiderGL.Math.Vec4.abs = function (v) {
	return [SpiderGL.Math.abs(v[0]), SpiderGL.Math.abs(v[1]), SpiderGL.Math.abs(v[2]), SpiderGL.Math.abs(v[3])];
}

/**
 * Component-wise arccosine of a 4-dimensional vector.
 *
 * @param {array} v The input vector.
 *
 * @returns {array} A new 4-dimensional array r, where r[i] = {@link SpiderGL.Math.acos}(v[i]), in radians.
 */
SpiderGL.Math.Vec4.acos = function (v) {
	return [SpiderGL.Math.acos(v[0]), SpiderGL.Math.acos(v[1]), SpiderGL.Math.acos(v[2]), SpiderGL.Math.acos(v[3])];
}

/**
 * Component-wise arcsine of a 4-dimensional vector.
 *
 * @param {array} v The input vector.
 *
 * @returns {array} A new 4-dimensional array r, where r[i] = {@link SpiderGL.Math.asin}(v[i]), in radians.
 */
SpiderGL.Math.Vec4.asin = function (v) {
	return [SpiderGL.Math.asin(v[0]), SpiderGL.Math.asin(v[1]), SpiderGL.Math.asin(v[2]), SpiderGL.Math.asin(v[3])];
}

/**
 * Component-wise arctangent of a 4-dimensional vector.
 *
 * @param {array} v The input vector.
 *
 * @returns {array} A new 4-dimensional array r, where r[i] = {@link SpiderGL.Math.atan}(v[i]), between -PI/2 and PI/2 radians.
 */
SpiderGL.Math.Vec4.atan = function (v) {
	return [SpiderGL.Math.atan(v[0]), SpiderGL.Math.atan(v[1]), SpiderGL.Math.atan(v[2]), SpiderGL.Math.atan(v[3])];
}

/**
 * Component-wise arctangent of the quotient of two 4-dimensional vectors.
 *
 * @param {array} y The numerator vector.
 * @param {array} x The denominator vector.
 *
 * @returns {array} A new 4-dimensional array r, where r[i] = {@link SpiderGL.Math.atan2}(y[i], x[i]), between PI and -PI radians.
 */
SpiderGL.Math.Vec4.atan2 = function (y, x) {
	return [SpiderGL.Math.atan2(y[0], x[0]), SpiderGL.Math.atan2(y[1], x[1]), SpiderGL.Math.atan2(y[2], x[2]), SpiderGL.Math.atan2(y[3], x[3])];
}

/**
 * Component-wise ceil of a 4-dimensional vector.
 *
 * @param {array} v The input vector.
 *
 * @returns {array} A new 4-dimensional array r, where r[i] = {@link SpiderGL.Math.ceil}(v[i]).
 */
SpiderGL.Math.Vec4.ceil = function (v) {
	return [SpiderGL.Math.ceil(v[0]), SpiderGL.Math.ceil(v[1]), SpiderGL.Math.ceil(v[2]), SpiderGL.Math.ceil(v[3])];
}

/**
 * Component-wise clamp of a 4-dimensional vector with vector bounds.
 *
 * @param {array} v The input vector.
 * @param {array} min The lower 4-dimensional bound.
 * @param {array} max The upper 4-dimensional bound.
 *
 * @returns {array} A new 4-dimensional array r, where r[i] = {@link SpiderGL.Math.clamp}(v[i], min[i], max[i]).
 */
SpiderGL.Math.Vec4.clamp = function (v, min, max) {
	return [SpiderGL.Math.clamp(v[0], min[0], max[0]), SpiderGL.Math.clamp(v[1], min[1], max[1]), SpiderGL.Math.clamp(v[2], min[2], max[2]), SpiderGL.Math.clamp(v[3], min[3], max[3])];
}

/**
 * Component-wise cosine of a 4-dimensional vector.
 *
 * @param {array} v The input vector, in radians.
 *
 * @returns {array} A new 4-dimensional array r, where r[i] = {@link SpiderGL.Math.cos}(v[i]).
 */
SpiderGL.Math.Vec4.cos = function (v) {
	return [SpiderGL.Math.cos(v[0]), SpiderGL.Math.cos(v[1]), SpiderGL.Math.cos(v[2]), SpiderGL.Math.cos(v[3])];
}

/**
 * Component-wise conversion of a 4-dimensional vector from degrees to radians.
 *
 * @param {array} v The input vector, in radians.
 *
 * @returns {array} A new 4-dimensional array r, where r[i] = {@link SpiderGL.Math.degToRad}(v[i]).
 */
SpiderGL.Math.Vec4.degToRad = function (v) {
	return [SpiderGL.Math.degToRad(v[0]), SpiderGL.Math.degToRad(v[1]), SpiderGL.Math.degToRad(v[2]), SpiderGL.Math.degToRad(v[3])];
}

/**
 * Component-wise exponential of a 4-dimensional vector.
 *
 * @param {array} v The input vector.
 *
 * @returns {array} A new 4-dimensional array r, where r[i] = {@link SpiderGL.Math.exp}(v[i]).
 */
SpiderGL.Math.Vec4.exp = function (v) {
	return [SpiderGL.Math.exp(v[0]), SpiderGL.Math.exp(v[1]), SpiderGL.Math.exp(v[2]), SpiderGL.Math.exp(v[3])];
}

/**
 * Component-wise floor of a 4-dimensional vector.
 *
 * @param {array} v The input vector.
 *
 * @returns {array} A new 4-dimensional array r, where r[i] = {@link SpiderGL.Math.floor}(v[i]).
 */
SpiderGL.Math.Vec4.floor = function (v) {
	return [SpiderGL.Math.floor(v[0]), SpiderGL.Math.floor(v[1]), SpiderGL.Math.floor(v[2]), SpiderGL.Math.floor(v[3])];
}

/**
 * Linear interpolation between two 4-dimensional vectors.
 *
 * @param {array} u The start interpolation bound.
 * @param {array} v The stop interpolation bound.
 * @param {number} t The interpolation factor, between 0 and 1.
 *
 * @returns {array} A new 4-dimensional array r, where r[i] = (1-t)*u[i] + t*v[i].
 */
SpiderGL.Math.Vec4.lerp = function (u, v, t) {
	return [
		SpiderGL.Math.lerp(u[0], v[0], t),
		SpiderGL.Math.lerp(u[1], v[1], t),
		SpiderGL.Math.lerp(u[2], v[2], t),
		SpiderGL.Math.lerp(u[3], v[3], t)
	];
}

/**
 * Component-wise natural (base E) logarithm of a 4-dimensional vector.
 * Same as {@link SpiderGL.Math.Vec4.log}.
 *
 * @param {array} v The input vector.
 *
 * @returns {array} A new 4-dimensional array r, where r[i] = {@link SpiderGL.Math.ln}(v[i]).
 */
SpiderGL.Math.Vec4.ln = function (v) {
	return [SpiderGL.Math.ln(v[0]), SpiderGL.Math.ln(v[1]), SpiderGL.Math.ln(v[2]), SpiderGL.Math.ln(v[3])];
}

/**
 * Component-wise natural (base E) logarithm of a 4-dimensional vector.
 *
 * @param {array} v The input vector.
 *
 * @returns {array} A new 4-dimensional array r, where r[i] = {@link SpiderGL.Math.log}(v[i]).
 */
SpiderGL.Math.Vec4.log = function (v) {
	return [SpiderGL.Math.log(v[0]), SpiderGL.Math.log(v[1]), SpiderGL.Math.log(v[2]), SpiderGL.Math.log(v[3])];
}

/**
 * Component-wise base 2 logarithm of a 4-dimensional vector.
 *
 * @param {array} v The input vector.
 *
 * @returns {array} A new 4-dimensional array r, where r[i] = {@link SpiderGL.Math.log2}(v[i]).
 */
SpiderGL.Math.Vec4.log2 = function (v) {
	return [SpiderGL.Math.log2(v[0]), SpiderGL.Math.log2(v[1]), SpiderGL.Math.log2(v[2]), SpiderGL.Math.log2(v[3])];
}

/**
 * Component-wise base 10 logarithm of a 4-dimensional vector.
 *
 * @param {array} v The input vector.
 *
 * @returns {array} A new 4-dimensional array r, where r[i] = {@link SpiderGL.Math.log10}(v[i]).
 */
SpiderGL.Math.Vec4.log10 = function (v) {
	return [SpiderGL.Math.log10(v[0]), SpiderGL.Math.log10(v[1]), SpiderGL.Math.log10(v[2]), SpiderGL.Math.log10(v[3])];
}

/**
 * Component-wise maximum of two 4-dimensional vectors.
 *
 * @param {array} u The first vector.
 * @param {array} v The second vector.
 *
 * @returns {array} A new 4-dimensional array r, where r[i] = {@link SpiderGL.Math.max}(u[i], v[i]).
 */
SpiderGL.Math.Vec4.max = function (u, v) {
	return [SpiderGL.Math.max(u[0], v[0]), SpiderGL.Math.max(u[1], v[1]), SpiderGL.Math.max(u[2], v[2]), SpiderGL.Math.max(u[3], v[3])];
}

/**
 * Component-wise minimum of two 4-dimensional vectors.
 *
 * @param {array} u The first vector.
 * @param {array} v The second vector.
 *
 * @returns {array} A new 4-dimensional array r, where r[i] = {@link SpiderGL.Math.min}(u[i], v[i]).
 */
SpiderGL.Math.Vec4.min = function (u, v) {
	return [SpiderGL.Math.min(u[0], v[0]), SpiderGL.Math.min(u[1], v[1]), SpiderGL.Math.min(u[2], v[2]), SpiderGL.Math.min(u[3], v[3])];
}

/**
 * Component-wise power of two 4-dimensional vectors.
 *
 * @param {array} u The base vector.
 * @param {array} v The exponent vector.
 *
 * @returns {array} A new 4-dimensional array r, where r[i] = {@link SpiderGL.Math.pow}(u[i], v[i]).
 */
SpiderGL.Math.Vec4.pow = function (u, v) {
	return [SpiderGL.Math.pow(u[0], v[0]), SpiderGL.Math.pow(u[1], v[1]), SpiderGL.Math.pow(u[2], v[2]), SpiderGL.Math.pow(u[3], v[3])];
}

/**
 * Component-wise conversion of a 4-dimensional vector from radians to degrees.
 *
 * @param {array} v The input vector, in degrees.
 *
 * @returns {array} A new 4-dimensional array r, where r[i] = {@link SpiderGL.Math.pow}(v[i]).
 */
SpiderGL.Math.Vec4.radToDeg = function (v) {
	return [SpiderGL.Math.radToDeg(v[0]), SpiderGL.Math.radToDeg(v[1]), SpiderGL.Math.radToDeg(v[2]), SpiderGL.Math.radToDeg(v[3])];
}

/**
 * Creates a random 4-dimensional vector between 0 and 1.
 *
 * @returns {array} A new 4-dimensional array r, where r[i] = {@link SpiderGL.Math.random}().
 */
SpiderGL.Math.Vec4.random = function () {
	return [SpiderGL.Math.random(), SpiderGL.Math.random(), SpiderGL.Math.random(), SpiderGL.Math.random()];
}

/**
 * Creates a random 4-dimensional vector between 0 and 1.
 * Same as {@link SpiderGL.Math.Vec4.random}.
 *
 * @returns {array} A new 4-dimensional array r, where r[i] = {@link SpiderGL.Math.random01}().
 */
SpiderGL.Math.Vec4.random01 = function () {
	return [SpiderGL.Math.random01(), SpiderGL.Math.random01(), SpiderGL.Math.random01(), SpiderGL.Math.random01()];
}

/**
 * Creates a random 4-dimensional vector between -1 and 1.
 *
 * @returns {array} A new 4-dimensional array r, where r[i] = {@link SpiderGL.Math.random11}().
 */
SpiderGL.Math.Vec4.random11 = function () {
	return [SpiderGL.Math.random11(), SpiderGL.Math.random11(), SpiderGL.Math.random11(), SpiderGL.Math.random11()];
}

/**
 * Creates a random 4-dimensional vector inside a range.
 *
 * @param {array} min The range vector lower bound.
 * @param {array} max The range vector upper bound.
 *
 * @returns {array} A new 4-dimensional array r, where r[i] = {@link SpiderGL.Math.randomRange}(min[i], max[i]).
 */
SpiderGL.Math.Vec4.randomRange = function (min, max) {
	return [SpiderGL.Math.randomRange(min[0], max[0]), SpiderGL.Math.randomRange(min[1], max[1]), SpiderGL.Math.randomRange(min[2], max[2]), SpiderGL.Math.randomRange(min[3], max[3])];
}

/**
 * Component-wise round of a 4-dimensional vector.
 *
 * @param {array} v The input vector.
 *
 * @returns {array} A new 4-dimensional array r, where r[i] = {@link SpiderGL.Math.round}(v[i]).
 */
SpiderGL.Math.Vec4.round = function (v) {
	return [SpiderGL.Math.round(v[0]), SpiderGL.Math.round(v[1]), SpiderGL.Math.round(v[2]), SpiderGL.Math.round(v[3])];
}

/**
 * Component-wise sine of a 4-dimensional vector.
 *
 * @param {array} v The input vector, in radians.
 *
 * @returns {array} A new 4-dimensional array r, where r[i] = {@link SpiderGL.Math.sin}(v[i]).
 */
SpiderGL.Math.Vec4.sin = function (v) {
	return [SpiderGL.Math.sin(v[0]), SpiderGL.Math.sin(v[1]), SpiderGL.Math.sin(v[2]), SpiderGL.Math.sin(v[3])];
}

/**
 * Component-wise square root of a 4-dimensional vector.
 *
 * @param {array} v The input vector.
 *
 * @returns {array} A new 4-dimensional array r, where r[i] = {@link SpiderGL.Math.sqrt}(v[i]).
 */
SpiderGL.Math.Vec4.sqrt = function (v) {
	return [SpiderGL.Math.sqrt(v[0]), SpiderGL.Math.sqrt(v[1]), SpiderGL.Math.sqrt(v[2]), SpiderGL.Math.sqrt(v[3])];
}

/**
 * Component-wise tangent root of a 4-dimensional vector.
 *
 * @param {array} v The input vector, in radians.
 *
 * @returns {array} A new 4-dimensional array r, where r[i] = {@link SpiderGL.Math.tan}(v[i]).
 */
SpiderGL.Math.Vec4.tan = function (v) {
	return [SpiderGL.Math.tan(v[0]), SpiderGL.Math.tan(v[1]), SpiderGL.Math.tan(v[2]), SpiderGL.Math.tan(v[3])];
}

/**
 * In-place component-wise copy of two 4-dimensional vectors.
 *
 * @param {array} u The destination vector.
 * @param {array} v The source vector.
 *
 * @returns {array} The destination vector u, where u[i] = v[i].
 */
SpiderGL.Math.Vec4.copy$ = function (u, v) {
	u[0] = v[0];
	u[1] = v[1];
	u[2] = v[2];
	u[3] = v[3];
	return u;
}

/**
 * In-place component-wise negation of a 4-dimensional vector.
 *
 * @param {array} v The input vector.
 *
 * @returns {array} The input vector v, where v[i] = -v[i].
 */
SpiderGL.Math.Vec4.neg$ = function (v) {
	v[0] = -v[0];
	v[1] = -v[1];
	v[2] = -v[2];
	v[3] = -v[3];
	return v;
}

/**
 * In-place component-wise addition of two 4-dimensional vectors.
 *
 * @param {array} u The first addition operand.
 * @param {array} v The second addition operand
 *
 * @returns {array} The input vector u, where u[i] = u[i] + v[i].
 */
SpiderGL.Math.Vec4.add$ = function (u, v) {
	u[0] += v[0];
	u[1] += v[1];
	u[2] += v[2];
	u[3] += v[3];
	return u;
}

/**
 * In-place component-wise addition of a 4-dimensional vector and a scalar.
 *
 * @param {array} v The vector addition operand.
 * @param {number} s The scalar addition operand
 *
 * @returns {array} The input vector v, where v[i] = v[i] + s.
 */
SpiderGL.Math.Vec4.adds$ = function (v, s) {
	v[0] += s;
	v[1] += s;
	v[2] += s;
	v[3] += s;
	return v;
}

/**
 * In-place component-wise subtraction of two 4-dimensional vectors.
 *
 * @param {array} u The first addition operand.
 * @param {array} v The second addition operand
 *
 * @returns {array} The input vector u, where u[i] = u[i] - v[i].
 */
SpiderGL.Math.Vec4.sub$ = function (u, v) {
	u[0] -= v[0];
	u[1] -= v[1];
	u[2] -= v[2];
	u[3] -= v[3];
	return u;
}

/**
 * In-place component-wise subtraction of a 4-dimensional vector and a scalar.
 *
 * @param {array} v The vector subtraction operand.
 * @param {number} s The scalar subtraction operand
 *
 * @returns {array} The input vector v, where v[i] = v[i] - s.
 */
SpiderGL.Math.Vec4.subs$ = function (v, s) {
	v[0] -= s;
	v[1] -= s;
	v[2] -= s;
	v[3] -= s;
	return v;
}

/**
 * In-place component-wise subtraction of a scalar and a 4-dimensional vector.
 *
 * @param {number} s The scalar subtraction operand
 * @param {array} v The vector subtraction operand.
 *
 * @returns {array} The input vector v, where v[i] = s - v[i].
 */
SpiderGL.Math.Vec4.ssub$ = function (s, v) {
	v[0] = s - v[0];
	v[1] = s - v[1];
	v[2] = s - v[2];
	v[3] = s - v[3];
	return v;
}

/**
 * In-place component-wise multiplication of two 4-dimensional vectors.
 *
 * @param {array} u The first multiplication operand.
 * @param {array} v The second multiplication operand
 *
 * @returns {array} The input vector u, where u[i] = u[i] * v[i].
 */
SpiderGL.Math.Vec4.mul$ = function (u, v) {
	u[0] *= v[0];
	u[1] *= v[1];
	u[2] *= v[2];
	u[3] *= v[3];
	return u;
}

/**
 * In-place component-wise multiplication of a 4-dimensional vector and a scalar.
 *
 * @param {array} v The first multiplication operand.
 * @param {number} s The second multiplication operand
 *
 * @returns {array} The input vector v, where v[i] = v[i] * s.
 */
SpiderGL.Math.Vec4.muls$ = function (v, s) {
	v[0] *= s;
	v[1] *= s;
	v[2] *= s;
	v[3] *= s;
	return v;
}

/**
 * In-place component-wise division of two 4-dimensional vectors.
 *
 * @param {array} u The numerator vector.
 * @param {array} v The denominator vector.
 *
 * @returns {array} The input vector u, where u[i] = u[i] / v[i].
 */
SpiderGL.Math.Vec4.div$ = function (u, v) {
	u[0] /= v[0];
	u[1] /= v[1];
	u[2] /= v[2];
	u[3] /= v[3];
	return u;
}

/**
 * In-place component-wise division of a 4-dimensional vector by a scalar.
 *
 * @param {array} v The numerator vector.
 * @param {number} s The scalar denominator.
 *
 * @returns {array} The input vector v, where v[i] = v[i] / s.
 */
SpiderGL.Math.Vec4.divs$ = function (v, s) {
	v[0] /= s;
	v[1] /= s;
	v[2] /= s;
	v[3] /= s;
	return v;
}

/**
 * In-place component-wise division of a scalar by a 4-dimensional.
 *
 * @param {number} s The scalar numerator.
 * @param {array} v The denominator vector.
 *
 * @returns {array} The input vector v, where v[i] = s / v[i].
 */
SpiderGL.Math.Vec4.sdiv$ = function (v, s) {
	v[0] = s / v[0];
	v[1] = s / v[1];
	v[2] = s / v[2];
	v[3] = s / v[3];
	return v;
}

/**
 * In-place 4-dimensional vector normalization.
 *
 * @param {array} v The input vector.
 *
 * @returns {array} The input vector v, where v[i] = v[i] / {@link SpiderGL.Math.Vec4.length}(v)
 */
SpiderGL.Math.Vec4.normalize$ = function (v) {
	var f = 1.0 / SpiderGL.Math.Vec4.length(v);
	return SpiderGL.Math.Vec4.muls$(v, f);
}

/*---------------------------------------------------------*/



// 3x3 matrix
/*---------------------------------------------------------*/

/**
 * The SpiderGL.Math.Mat3 namespace.
 * The provided functions operate on 3x3 matrices, represented as standard JavaScript arrays of length 9.
 * In general, matrices are considered in column-major format.
 *
 * @namespace The SpiderGL.Math.Mat3 namespace defines operations on 3x3 matrices.
 */
SpiderGL.Math.Mat3 = { };

/**
 * Duplicates the input 3x3 matrix.
 *
 * @param {array} n The input matrix.
 *
 * @returns {array} A new 9-component array r, where r[i] = m[i] (same as m.slice(0, 9)).
 */
SpiderGL.Math.Mat3.dup = function (m) {
	return m.slice(0, 9);
}

/**
 * Creates a 3x3 matrix initialized with a scalar.
 *
 * @param {number} s The input scalar.
 *
 * @returns {array} A new 9-component array r, where r[i] = s.
 */
SpiderGL.Math.Mat3.scalar = function (s) {
	return [
		s, s, s,
		s, s, s,
		s, s, s
	];
}

/**
 * Creates a 3x3 matrix initialized with zero.
 *
 * @returns {array} A new 9-component array r, where r[i] = 0.
 */
SpiderGL.Math.Mat3.zero = function () {
	return [
		0, 0, 0,
		0, 0, 0,
		0, 0, 0
	];
}

/**
 * Creates a 3x3 matrix initialized with one.
 *
 * @returns {array} A new 9-component array r, where r[i] = 1.
 */
SpiderGL.Math.Mat3.one = function () {
	return [
		1, 1, 1,
		1, 1, 1,
		1, 1, 1
	];
}

/**
 * Creates a diagonal 3x3 matrix.
 *
 * @param {array} d A 3-dimensional vector
 *
 * @returns {array} A new 9-component array representing a 3x3 matrix with diagonal elements set to d.
 */
SpiderGL.Math.Mat3.diag = function (d) {
	return [
		d[0],    0,    0,
		0,    d[0],    0,
		0,       0, d[0]
	];
}

/**
 * Creates an identity 3x3 matrix.
 *
 * @returns {array} A new 9-component array representing an identity 3x3 matrix.
 */
SpiderGL.Math.Mat3.identity = function () {
	return [
		1, 0, 0,
		0, 1, 0,
		0, 0, 1
	];
}

/**
 * Extends a 3x3 matrix to a 4x4 matrix.
 *
 * @param {array} m The input matrix.
 *
 * @returns {array} A new 16-component array representing a 4x4 matrix r, with the input 3x3 matrix as tue upper-left 3x3 region with [0, 0, 0, 1] as last row and column.
 */
SpiderGL.Math.Mat3.to44 = function (m) {
	return [
		m[0], m[1], m[2], 0,
		m[3], m[4], m[5], 0,
		m[6], m[7], m[8], 0,
		   0,    0,    0, 1
	];
}

/**
 * Pre-multiplies a 2-dimensional vector by a column-major 3x3 matrix.
 *
 * @param {array} m The input column-major 3x3 matrix.
 * @param {array} v The input 2-dimensional vector.
 * @param {number} [z=0] The 3rd component of the input 2-dimensional vector.
 *
 * @return {array} A new 2-dimensional vector r, where r = m * v.
 */
SpiderGL.Math.Mat3.mul2 = function (m, v, z) {
	z = (z == undefined) ? (0) : (z);
	return [
		m[0]*v[0] + m[3]*v[1] + m[6]*z,
		m[1]*v[0] + m[4]*v[1] + m[7]*z /* ,
		m[2]*v[0] + m[5]*v[1] + m[8]*z */
	];
}

/**
 * Pre-multiplies a 3-dimensional vector by a column-major 3x3 matrix.
 *
 * @param {array} m The input column-major 3x3 matrix.
 * @param {array} v The input 3-dimensional vector.
 *
 * @return {array} A new 3-dimensional vector r, where r = m * v.
 */
SpiderGL.Math.Mat3.mul3 = function (m, v) {
	return [
		m[0]*v[0] + m[3]*v[1] + m[6]*v[2],
		m[1]*v[0] + m[4]*v[1] + m[7]*v[2],
		m[2]*v[0] + m[5]*v[1] + m[8]*v[2]
	];
}

/**
 * Creates the transpose of a 3x3 matrix.
 *
 * @param {array} m The input matrix.
 *
 * @returns {array} A new 3x3 matrix representing the transpose of m.
 */
SpiderGL.Math.Mat3.transpose = function (m) {
	return [
		m[0], m[3], m[6],
		m[1], m[4], m[7],
		m[2], m[5], m[8]
	];
}
/*---------------------------------------------------------*/



// 4x4 matrix
/*---------------------------------------------------------*/

/**
 * The SpiderGL.Math.Mat4 namespace.
 * The provided functions operate on 4x4 matrices, represented as standard JavaScript arrays of length 16.
 * In general, matrices are considered in column-major format.
 *
 * @namespace The SpiderGL.Math.Mat4 namespace defines operations on 4x4 matrices.
 */
SpiderGL.Math.Mat4 = { };

/**
 * Duplicates the input 4x4 matrix.
 *
 * @param {array} n The input matrix.
 *
 * @returns {array} A new 16-component array r, where r[i] = m[i] (same as m.slice(0, 16)).
 */
SpiderGL.Math.Mat4.dup = function (m) {
	return m.slice(0, 16);
}

/**
 * Creates a 4x4 matrix initialized with a scalar.
 *
 * @param {number} s The input scalar.
 *
 * @returns {array} A new 16-component array r, where r[i] = s.
 */
SpiderGL.Math.Mat4.scalar = function (s) {
	return [
		s, s, s, s,
		s, s, s, s,
		s, s, s, s,
		s, s, s, s
	];
}

/**
 * Creates a 4x4 matrix initialized with zero.
 *
 * @returns {array} A new 16-component array r, where r[i] = 0.
 */
SpiderGL.Math.Mat4.zero = function () {
	return [
		0, 0, 0, 0,
		0, 0, 0, 0,
		0, 0, 0, 0,
		0, 0, 0, 0
	];
}

/**
 * Creates a 4x4 matrix initialized with one.
 *
 * @returns {array} A new 16-component array r, where r[i] = 1.
 */
SpiderGL.Math.Mat4.one = function () {
	return [
		1, 1, 1, 1,
		1, 1, 1, 1,
		1, 1, 1, 1,
		1, 1, 1, 1
	];
}

/**
 * Creates a diagonal 4x4 matrix.
 *
 * @param {array} d A 4-dimensional vector
 *
 * @returns {array} A new 16-component array representing a 4x4 matrix with diagonal elements set to d.
 */
SpiderGL.Math.Mat4.diag = function (d) {
	return [
		d[0],    0,    0,    0,
		0,    d[0],    0,    0,
		0,       0, d[0],    0,
		0,       0,    0, d[0]
	];
}

/**
 * Creates an identity 4x4 matrix.
 *
 * @returns {array} A new 16-component array representing an identity 4x4 matrix.
 */
SpiderGL.Math.Mat4.identity = function () {
	return [
		1, 0, 0, 0,
		0, 1, 0, 0,
		0, 0, 1, 0,
		0, 0, 0, 1
	];
}

/**
 * Extracts the upper-left 3x3 matrix from a 4x4 matrix.
 *
 * @param {array} m The input matrix.
 *
 * @returns {array} A new 9-component array representing the upper-left 3x3 matrix.
 */
SpiderGL.Math.Mat4.to33 = function (m) {
	return [
		m[ 0], m[ 1], m[ 2],
		m[ 4], m[ 5], m[ 6],
		m[ 8], m[ 9], m[10]
	];
}

/**
 * Gets an element of a 4x4 matrix.
 *
 * @param {array} m The input matrix.
 * @param {number} row The element row index.
 * @param {number} col The element column index.
 *
 * @returns {number} The value of the (i-th, j-th) element of m.
 */
SpiderGL.Math.Mat4.elem = function (m, row, col) {
	return m[row+col*4];
}

/**
 * Sets an element of a 4x4 matrix.
 *
 * @param {array} m The input matrix.
 * @param {number} row The element row index.
 * @param {number} col The element column index.
 * @param {number} value The element value to set.
 */
SpiderGL.Math.Mat4.elem$ = function (m, row, col, value) {
	m[row+col*4] = value;
}

/**
 * Gets a row of a 4x4 matrix.
 *
 * @param {array} m The input matrix.
 * @param {number} row The row index.
 *
 * @returns {array} A new 4-component array representing the row-th row of m.
 */
SpiderGL.Math.Mat4.row = function (m, row) {
	return [m[row+0], m[row+4], m[row+8], m[row+12]];
}

/**
 * Sets a row of a 4x4 matrix.
 *
 * @param {array} m The input matrix.
 * @param {number} row The row index.
 * @param {array} v A 4-component array that will be copied to the row-th row of m.
 */
SpiderGL.Math.Mat4.row$ = function (m, row, v) {
	m[row+ 0] = v[0];
	m[row+ 4] = v[1];
	m[row+ 8] = v[2];
	m[row+12] = v[3];
}

/**
 * Gets a column of a 4x4 matrix.
 *
 * @param {array} m The input matrix.
 * @param {number} col The column index.
 *
 * @returns {array} A new 4-component array representing the col-th column of m.
 */
SpiderGL.Math.Mat4.col = function (m, col) {
	var i = col * 4;
	return [m[i+0], m[i+1], m[i+2], m[i+3]];
}

/**
 * Sets a column of a 4x4 matrix.
 *
 * @param {array} m The input matrix.
 * @param {number} col The column index.
 * @param {array} v A 4-component array that will be copied to the col-th column of m.
 */
SpiderGL.Math.Mat4.col$ = function (m, col, v) {
	var i = col * 4;
	m[i+0] = v[0];
	m[i+1] = v[1];
	m[i+2] = v[2];
	m[i+3] = v[3];
}

/**
 * Tests whether a 4x4 matrix is the identity matrix.
 *
 * @param {array} m The input matrix.
 *
 * @return {bool} True if the input matrix is the identity matrix, false otherwise.
 */
SpiderGL.Math.Mat4.isIdentity = function (m) {
	return ((m[ 0] === 1) && (m[ 1] === 0) && (m[ 2] === 0) && (m[ 3] === 0) &&
	        (m[ 4] === 0) && (m[ 5] === 1) && (m[ 6] === 0) && (m[ 7] === 0) &&
	        (m[ 8] === 0) && (m[ 9] === 0) && (m[10] === 1) && (m[11] === 0) &&
	        (m[12] === 0) && (m[13] === 0) && (m[14] === 0) && (m[15] === 1));
}

/**
 * Component-wise negation of a 4x4 matrix.
 *
 * @param {array} m The input matrix.
 *
 * @return {array} A new 4x4 matrix r, where r[i] = -m[i].
 */
SpiderGL.Math.Mat4.neg = function (m) {
	return [
		-m[ 0], -m[ 1], -m[ 2], -m[ 3],
		-m[ 4], -m[ 5], -m[ 6], -m[ 7],
		-m[ 8], -m[ 9], -m[10], -m[11],
		-m[12], -m[13], -m[14], -m[15]
	];
}

/**
 * Component-wise addition of two 4x4 matrices.
 *
 * @param {array} a The first input matrix.
 * @param {array} b The first input matrix.
 *
 * @return {array} A new 4x4 matrix r, where r[i] = a[i] + b[i].
 */
SpiderGL.Math.Mat4.add = function (a, b) {
	return [
		a[ 0]+b[ 0], a[ 1]+b[ 1], a[ 2]+b[ 2], a[ 3]+b[ 3],
		a[ 4]+b[ 4], a[ 5]+b[ 5], a[ 6]+b[ 6], a[ 7]+b[ 7],
		a[ 8]+b[ 8], a[ 9]+b[ 9], a[10]+b[10], a[11]+b[11],
		a[12]+b[12], a[13]+b[13], a[14]+b[14], a[15]+b[15]
	];
}

/**
 * Component-wise addition of two 4x4 matrices.
 *
 * @param {array} a The first input matrix.
 * @param {array} b The first input matrix.
 *
 * @return {array} A new 4x4 matrix r, where r[i] = a[i] - b[i].
 */
SpiderGL.Math.Mat4.sub = function (a, b) {
	return [
		a[ 0]-b[ 0], a[ 1]-b[ 1], a[ 2]-b[ 2], a[ 3]-b[ 3],
		a[ 4]-b[ 4], a[ 5]-b[ 5], a[ 6]-b[ 6], a[ 7]-b[ 7],
		a[ 8]-b[ 8], a[ 9]-b[ 9], a[10]-b[10], a[11]-b[11],
		a[12]-b[12], a[13]-b[13], a[14]-b[14], a[15]-b[15]
	];
}

/**
 * Multiplies of two column-major 4x4 matrices.
 *
 * @param {array} a The first input matrix.
 * @param {array} b The first input matrix.
 *
 * @return {array} A new 4x4 matrix r, result of matrix multiplication r = a * b.
 */
SpiderGL.Math.Mat4.mul = function (a, b) {
	var a0  = a[ 0], a1  = a[ 1],  a2 = a[ 2], a3  = a[ 3],
	    a4  = a[ 4], a5  = a[ 5],  a6 = a[ 6], a7  = a[ 7],
	    a8  = a[ 8], a9  = a[ 9], a10 = a[10], a11 = a[11],
	    a12 = a[12], a13 = a[13], a14 = a[14], a15 = a[15],

	    b0  = b[ 0], b1  = b[ 1], b2  = b[ 2], b3  = b[ 3],
	    b4  = b[ 4], b5  = b[ 5], b6  = b[ 6], b7  = b[ 7],
	    b8  = b[ 8], b9  = b[ 9], b10 = b[10], b11 = b[11],
	    b12 = b[12], b13 = b[13], b14 = b[14], b15 = b[15];

	return [
		a0*b0  + a4*b1  + a8*b2   + a12*b3,
		a1*b0  + a5*b1  + a9*b2   + a13*b3,
		a2*b0  + a6*b1  + a10*b2  + a14*b3,
		a3*b0  + a7*b1  + a11*b2  + a15*b3,

		a0*b4  + a4*b5  + a8*b6   + a12*b7,
		a1*b4  + a5*b5  + a9*b6   + a13*b7,
		a2*b4  + a6*b5  + a10*b6  + a14*b7,
		a3*b4  + a7*b5  + a11*b6  + a15*b7,

		a0*b8  + a4*b9  + a8*b10  + a12*b11,
		a1*b8  + a5*b9  + a9*b10  + a13*b11,
		a2*b8  + a6*b9  + a10*b10 + a14*b11,
		a3*b8  + a7*b9  + a11*b10 + a15*b11,

		a0*b12 + a4*b13 + a8*b14  + a12*b15,
		a1*b12 + a5*b13 + a9*b14  + a13*b15,
		a2*b12 + a6*b13 + a10*b14 + a14*b15,
		a3*b12 + a7*b13 + a11*b14 + a15*b15
	];
}

/**
 * Component-wise multiplication of a 4x4 matrix and a scalar.
 *
 * @param {array} m The matrix operand.
 * @param {number} s The scalar operand.
 *
 * @returns {array} A new 4x4 matrix r, where r[i] = m[i] * s.
 */
SpiderGL.Math.Mat4.muls = function (m, s) {
	return [
		m[ 0]*s, m[ 1]*s, m[ 2]*s, m[ 3]*s,
		m[ 4]*s, m[ 5]*s, m[ 6]*s, m[ 7]*s,
		m[ 8]*s, m[ 9]*s, m[10]*s, m[11]*s,
		m[12]*s, m[13]*s, m[14]*s, m[15]*s
	];
}

/**
 * Pre-multiplies a 3-dimensional vector by a column-major 4x4 matrix.
 *
 * @param {array} m The input column-major 4x4 matrix.
 * @param {array} v The input 3-dimensional vector.
 * @param {number} [w=1] The 4th component of the input 3-dimensional vector.
 *
 * @return {array} A new 3-dimensional vector r, where r = m * v.
 */
SpiderGL.Math.Mat4.mul3 = function (m, v, w) {
	w = (w == undefined) ? (1) : (w);
	return [
		m[ 0]*v[0] + m[ 4]*v[1] + m[ 8]*v[2] + m[12]*w,
		m[ 1]*v[0] + m[ 5]*v[1] + m[ 9]*v[2] + m[13]*w,
		m[ 2]*v[0] + m[ 6]*v[1] + m[10]*v[2] + m[14]*w /* ,
		m[ 3]*v[0] + m[ 7]*v[1] + m[11]*v[2] + m[15]*w */
	];
}

/**
 * Pre-multiplies a 4-dimensional vector by a column-major 4x4 matrix.
 *
 * @param {array} m The input column-major 4x4 matrix.
 * @param {array} v The input 4-dimensional vector.
 *
 * @return {array} A new 4-dimensional vector r, where r = m * v.
 */
SpiderGL.Math.Mat4.mul4 = function (m, v) {
	return [
		m[ 0]*v[0] + m[ 4]*v[1] + m[ 8]*v[2] + m[12]*v[3],
		m[ 1]*v[0] + m[ 5]*v[1] + m[ 9]*v[2] + m[13]*v[3],
		m[ 2]*v[0] + m[ 6]*v[1] + m[10]*v[2] + m[14]*v[3],
		m[ 3]*v[0] + m[ 7]*v[1] + m[11]*v[2] + m[15]*v[3]
	];
}

/**
 * Component-wise reciprocal of a 4x4 matrix.
 *
 * @param {array} m The input matrix.
 *
 * @returns {array} A new 4x4 matrix r, where r[i] = 1 / m[i].
 */
SpiderGL.Math.Mat4.rcp = function (m) {
	return [
		1/m[ 0], 1/m[ 1], 1/m[ 2], 1/m[ 3],
		1/m[ 4], 1/m[ 5], 1/m[ 6], 1/m[ 7],
		1/m[ 8], 1/m[ 9], 1/m[10], 1/m[11],
		1/m[12], 1/m[13], 1/m[14], 1/m[15]
	];
}

/**
 * Component-wise multiplication of two 4x4 matrices.
 *
 * @param {array} a The first matrix.
 * @param {array} b The second matrix.
 *
 * @returns {array} A new 4x4 matrix r, where r[i] = a[i] * b[i].
 */
SpiderGL.Math.Mat4.compMul = function (a, b) {
	return [
		a[ 0]*b[ 0], a[ 1]*b[ 1], a[ 2]*b[ 2], a[ 3]*b[ 3],
		a[ 4]*b[ 4], a[ 5]*b[ 5], a[ 6]*b[ 6], a[ 7]*b[ 7],
		a[ 8]*b[ 8], a[ 9]*b[ 9], a[10]*b[10], a[11]*b[11],
		a[12]*b[12], a[13]*b[13], a[14]*b[14], a[15]*b[15]
	];
}

/**
 * Component-wise division of two 4x4 matrices.
 *
 * @param {array} a The first matrix.
 * @param {array} b The second matrix.
 *
 * @returns {array} A new 4x4 matrix r, where r[i] = a[i] / b[i].
 */
SpiderGL.Math.Mat4.compDiv = function (a, b) {
	return [
		a[ 0]/b[ 0], a[ 1]/b[ 1], a[ 2]/b[ 2], a[ 3]/b[ 3],
		a[ 4]/b[ 4], a[ 5]/b[ 5], a[ 6]/b[ 6], a[ 7]/b[ 7],
		a[ 8]/b[ 8], a[ 9]/b[ 9], a[10]/b[10], a[11]/b[11],
		a[12]/b[12], a[13]/b[13], a[14]/b[14], a[15]/b[15]
	];
}

/**
 * Creates the transpose of a 4x4 matrix.
 *
 * @param {array} m The input matrix.
 *
 * @returns {array} A new 4x4 matrix representing the transpose of m.
 */
SpiderGL.Math.Mat4.transpose = function (m) {
	return [
		m[ 0], m[ 4], m[ 8], m[12],
		m[ 1], m[ 5], m[ 9], m[13],
		m[ 2], m[ 6], m[10], m[14],
		m[ 3], m[ 7], m[11], m[15]
	];
}

/**
 * Calculates the determinant of a 4x4 matrix.
 *
 * @param {array} m The input matrix.
 *
 * @returns {number} The determinant of m.
 */
SpiderGL.Math.Mat4.determinant = function (m) {
	var m0  = m[ 0], m1  = m[ 1], m2  = m[ 2], m3  = m[ 3],
	    m4  = m[ 4], m5  = m[ 5], m6  = m[ 6], m7  = m[ 7],
	    m8  = m[ 8], m9  = m[ 9], m10 = m[10], m11 = m[11],
	    m12 = m[12], m13 = m[13], m14 = m[14], m15 = m[15];

	return (m12 * m9 * m6 * m3 - m8 * m13 * m6 * m3 - m12 * m5 * m10 * m3 + m4 * m13 * m10 * m3 +
	        m8 * m5 * m14 * m3 - m4 * m9 * m14 * m3 - m12 * m9 * m2 * m7 + m8 * m13 * m2 * m7 +
	        m12 * m1 * m10 * m7 - m0 * m13 * m10 * m7 - m8 * m1 * m14 * m7 + m0 * m9 * m14 * m7 +
	        m12 * m5 * m2 * m11 - m4 * m13 * m2 * m11 - m12 * m1 * m6 * m11 + m0 * m13 * m6 * m11 +
	        m4 * m1 * m14 * m11 - m0 * m5 * m14 * m11 - m8 * m5 * m2 * m15 + m4 * m9 * m2 * m15 +
	        m8 * m1 * m6 * m15 - m0 * m9 * m6 * m15 - m4 * m1 * m10 * m15 + m0 * m5 * m10 * m15);
}

/**
 * Calculates the inverse of a 4x4 matrix.
 *
 * @param {array} m The input matrix.
 *
 * @returns {array} A new 4x4 matrix representing the inverse of m.
 */
SpiderGL.Math.Mat4.inverse = function (m) {
	var m0  = m[ 0], m1  = m[ 1], m2  = m[ 2], m3  = m[ 3],
	    m4  = m[ 4], m5  = m[ 5], m6  = m[ 6], m7  = m[ 7],
	    m8  = m[ 8], m9  = m[ 9], m10 = m[10], m11 = m[11],
	    m12 = m[12], m13 = m[13], m14 = m[14], m15 = m[15];

	var d = 1 / (
		m12 * m9 * m6 * m3 - m8 * m13 * m6 * m3 - m12 * m5 * m10 * m3 + m4 * m13 * m10 * m3 +
		m8 * m5 * m14 * m3 - m4 * m9 * m14 * m3 - m12 * m9 * m2 * m7 + m8 * m13 * m2 * m7 +
		m12 * m1 * m10 * m7 - m0 * m13 * m10 * m7 - m8 * m1 * m14 * m7 + m0 * m9 * m14 * m7 +
		m12 * m5 * m2 * m11 - m4 * m13 * m2 * m11 - m12 * m1 * m6 * m11 + m0 * m13 * m6 * m11 +
		m4 * m1 * m14 * m11 - m0 * m5 * m14 * m11 - m8 * m5 * m2 * m15 + m4 * m9 * m2 * m15 +
		m8 * m1 * m6 * m15 - m0 * m9 * m6 * m15 - m4 * m1 * m10 * m15 + m0 * m5 * m10 * m15);

	return [
		d * (m9*m14*m7-m13*m10*m7+m13*m6*m11-m5*m14*m11-m9*m6*m15+m5*m10*m15),
		d * (m13*m10*m3-m9*m14*m3-m13*m2*m11+m1*m14*m11+m9*m2*m15-m1*m10*m15),
		d * (m5*m14*m3-m13*m6*m3+m13*m2*m7-m1*m14*m7-m5*m2*m15+m1*m6*m15),
		d * (m9*m6*m3-m5*m10*m3-m9*m2*m7+m1*m10*m7+m5*m2*m11-m1*m6*m11),

		d * (m12*m10*m7-m8*m14*m7-m12*m6*m11+m4*m14*m11+m8*m6*m15-m4*m10*m15),
		d * (m8*m14*m3-m12*m10*m3+m12*m2*m11-m0*m14*m11-m8*m2*m15+m0*m10*m15),
		d * (m12*m6*m3-m4*m14*m3-m12*m2*m7+m0*m14*m7+m4*m2*m15-m0*m6*m15),
		d * (m4*m10*m3-m8*m6*m3+m8*m2*m7-m0*m10*m7-m4*m2*m11+m0*m6*m11),

		d * (m8*m13*m7-m12*m9*m7+m12*m5*m11-m4*m13*m11-m8*m5*m15+m4*m9*m15),
		d * (m12*m9*m3-m8*m13*m3-m12*m1*m11+m0*m13*m11+m8*m1*m15-m0*m9*m15),
		d * (m4*m13*m3-m12*m5*m3+m12*m1*m7-m0*m13*m7-m4*m1*m15+m0*m5*m15),
		d * (m8*m5*m3-m4*m9*m3-m8*m1*m7+m0*m9*m7+m4*m1*m11-m0*m5*m11),

		d * (m12*m9*m6-m8*m13*m6-m12*m5*m10+m4*m13*m10+m8*m5*m14-m4*m9*m14),
		d * (m8*m13*m2-m12*m9*m2+m12*m1*m10-m0*m13*m10-m8*m1*m14+m0*m9*m14),
		d * (m12*m5*m2-m4*m13*m2-m12*m1*m6+m0*m13*m6+m4*m1*m14-m0*m5*m14),
		d * (m4*m9*m2-m8*m5*m2+m8*m1*m6-m0*m9*m6-m4*m1*m10+m0*m5*m10)
	];
}

/**
 * Calculates the inverse transpose of the upper-left 3x3 matrix of a 4x4 matrix.
 *
 * @param {array} m The input matrix.
 *
 * @returns {array} A new 3x3 matrix representing the inverse transpose of the upper-left 3x3 matrix of m.
 */
SpiderGL.Math.Mat4.inverseTranspose33 = function (m) {
	var m11 = m[ 0], m21 = m[ 1], m31 = m[ 2],
	    m12 = m[ 4], m22 = m[ 5], m32 = m[ 6],
	    m13 = m[ 8], m23 = m[ 9], m33 = m[10];

	var d =  1 / (m11*(m33*m22 - m32*m23) - m21*(m33*m12 - m32*m13) + m31*(m23*m12 - m22*m13));

	return [
		d * (m33*m22 - m32*m23), d * (m32*m13 - m33*m12), d * (m23*m12 - m22*m13),
		d * (m31*m23 - m33*m21), d * (m33*m11 - m31*m13), d * (m21*m13 - m23*m11),
		d * (m32*m21 - m31*m22), d * (m31*m12 - m32*m11), d * (m22*m11 - m21*m12)
	];
}

/**
 * Calculates the trace (i.e. the sum of the diagonal elements) of a 4x4 matrix.
 *
 * @param {array} m The input matrix.
 *
 * @returns {number} The trace of m.
 */
SpiderGL.Math.Mat4.trace = function (m) {
	return (m[0] + m[5] + m[10] + m[15]);
}

/**
 * Creates a column-major 4x4 translation matrix.
 * The input translation vector will be placed on the 4th column of an identity matrix.
 *
 * @param {array} v A 3-dimensional vector with translation offsets.
 *
 * @returns {array} A new column-major 4x4 translation matrix.
 */
SpiderGL.Math.Mat4.translation = function (v) {
	return [
		   1,    0,    0, 0,
		   0,    1,    0, 0,
		   0,    0,    1, 0,
		v[0], v[1], v[2], 1
	];
}

/**
 * Creates a column-major 4x4 rotation matrix.
 * The returned matrix will represent a counter-clockwise rotation about the input axis by the input angle in radians.
 * The input axis need not to be normalized.
 *
 * @param {number} angle The counter-clockwise rotation angle, in radians.
 * @param {array} axis A 3-dimensional vector representing the rotation axis.
 *
 * @returns {array} A new column-major 4x4 rotation matrix.
 */
SpiderGL.Math.Mat4.rotationAngleAxis = function (angle, axis) {
	var ax = SpiderGL.Math.Vec3.normalize(axis);
	var s  = SpiderGL.Math.sin(angle);
	var c  = SpiderGL.Math.cos(angle);
	var q   = 1 - c;

	var x = ax[0];
	var y = ax[1];
	var z = ax[2];

	var xx, yy, zz, xy, yz, zx, xs, ys, zs;

	xx = x * x;
	yy = y * y;
	zz = z * z;
	xy = x * y;
	yz = y * z;
	zx = z * x;
	xs = x * s;
	ys = y * s;
	zs = z * s;

	return [
		(q * xx) + c,  (q * xy) + zs, (q * zx) - ys, 0,
		(q * xy) - zs, (q * yy) + c,  (q * yz) + xs, 0,
		(q * zx) + ys, (q * yz) - xs, (q * zz) + c,  0,
		            0,             0,            0,  1
	];
}

/**
 * Creates a column-major 4x4 scaling matrix.
 *
 * @param {array} v The scaling amount as a 3-dimensional array.
 *
 * @returns {array} A new column-major 4x4 scaling matrix.
 */
SpiderGL.Math.Mat4.scaling = function (v) {
	return [
		v[0],    0,    0, 0,
		   0, v[1],    0, 0,
		   0,    0, v[2], 0,
		   0,    0,    0, 1
	];
}

/**
 * Creates a column-major 4x4 look-at matrix.
 *
 * @param {array} position The viewer's position as a 3-dimensional vector.
 * @param {array} target The viewer's look-at point as a 3-dimensional vector.
 * @param {array} position The viewer's up vector as a 3-dimensional vector.
 *
 * @returns {array} A new column-major 4x4 look-at matrix.
 */
SpiderGL.Math.Mat4.lookAt = function (position, target, up) {
	var v = SpiderGL.Math.Vec3.normalize(SpiderGL.Math.Vec3.sub(target, position));
	var u = SpiderGL.Math.Vec3.normalize(up);
	var s = SpiderGL.Math.Vec3.normalize(SpiderGL.Math.Vec3.cross(v, u));

	u = SpiderGL.Math.Vec3.cross(s, v);

	var m = [
		 s[0], u[0], -v[0], 0,
		 s[1], u[1], -v[1], 0,
		 s[2], u[2], -v[2], 0,
		    0,    0,    0,  1
	];

	return SpiderGL.Math.Mat4.translate$(m, SpiderGL.Math.Vec3.neg(position));
}

/**
 * Creates a column-major 4x4 orthographic projection matrix.
 *
 * @param {array} min A 3-component array with the minimum coordinates of the parallel viewing volume.
 * @param {array} max A 3-component array with the maximum coordinates of the parallel viewing volume.
 *
 * @returns {array} A new column-major 4x4 orthographic projection matrix.
 */
SpiderGL.Math.Mat4.ortho = function (min, max) {
	var sum = SpiderGL.Math.Vec3.add(max, min);
	var dif = SpiderGL.Math.Vec3.sub(max, min);

	return [
		     2 / dif[0],                 0,           0,      0,
		               0,       2 / dif[1],           0,      0,
		               0,                0, -2 / dif[2],      0,
		-sum[0] / dif[0], -sum[1] / dif[1], -sum[2] / dif[2], 1
	];
}

/**
 * Creates a column-major 4x4 frustum matrix.
 *
 * @param {array} min A 3-component array with the minimum coordinates of the frustum volume.
 * @param {array} max A 3-component array with the maximum coordinates of the frustum volume.
 *
 * @returns {array} A new column-major 4x4 frustum matrix.
 */
SpiderGL.Math.Mat4.frustum = function (min, max) {
	var sum = SpiderGL.Math.Vec3.add(max, min);
	var dif = SpiderGL.Math.Vec3.sub(max, min);
	var t   = 2.0 * min[2];

	return [
		     t / dif[0],               0,                     0,  0,
		              0,      t / dif[1],                     0,  0,
		sum[0] / dif[0], sum[1] / dif[1],      -sum[2] / dif[2], -1,
		              0,               0, -t *  max[2] / dif[2],  0
	];
}

/**
 * Creates a column-major 4x4 perspective projection matrix.
 *
 * @param {number} fovY The vertical field-of-view angle, in radians.
 * @param {number} aspectRatio The projection plane aspect ratio.
 * @param {number} zNear The distance of the near clipping plane.
 * @param {number} zFar The distance of the far clipping plane.
 *
 * @returns {array} A new column-major 4x4 perspective projection matrix.
 */
SpiderGL.Math.Mat4.perspective = function (fovY, aspectRatio, zNear, zFar) {
	var a = zNear * SpiderGL.Math.tan(fovY / 2);
	var b = a * aspectRatio;

	return SpiderGL.Math.Mat4.frustum([-b, -a, zNear], [b, a, zFar]);
}

/**
 * Copies a 4x4 matrix.
 *
 * @param {array} dst The destination 4x4 matrix.
 * @param {array} src The source 4x4 matrix.
 *
 * @returns {array} The input matrix dst, where dst[i] = src[i].
 */
SpiderGL.Math.Mat4.copy$ = function (dst, src) {
	for (var i=0; i<16; ++i) {
		dst[i] = src[i];
	}
	return dst;
}

/**
 * Sets a 4x4 matrix as the identity matrix.
 *
 * @param {array} m The input 4x4 matrix to be set as identity.
 *
 * @returns {array} The input matrix m.
 */
SpiderGL.Math.Mat4.identity$ = function (m) {
	m[ 0] = 1; m[ 1] = 0; m[ 2] = 0; m[ 3] = 0;
	m[ 4] = 0; m[ 5] = 1; m[ 6] = 0; m[ 7] = 0;
	m[ 8] = 0; m[ 9] = 0; m[10] = 1; m[11] = 0;
	m[12] = 0; m[13] = 0; m[14] = 0; m[15] = 1;
	return m;
}

/**
 * In-place negation of a 4x4 matrix.
 *
 * @param {array} m The input 4x4 matrix.
 *
 * @returns {array} The input matrix m, where m[i] = -m[i].
 */
SpiderGL.Math.Mat4.neg$ = function (m) {
	for (var i=0; i<16; ++i) {
		m[i] = -m[i];
	}
	return m;
}

/**
 * In-place addition of two 4x4 matrices.
 *
 * @param {array} a The first 4x4 input matrix.
 * @param {array} b The second 4x4 input matrix.
 *
 * @returns {array} The input matrix a, where a[i] = a[i] + b[i].
 */
SpiderGL.Math.Mat4.add$ = function (a, b) {
	for (var i=0; i<16; ++i) {
		a[i] += b[i];
	}
	return a;
}

/**
 * In-place subtraction of two 4x4 matrices.
 *
 * @param {array} a The first 4x4 input matrix.
 * @param {array} b The second 4x4 input matrix.
 *
 * @returns {array} The input matrix a, where a[i] = a[i] - b[i].
 */
SpiderGL.Math.Mat4.sub$ = function (a, b) {
	for (var i=0; i<16; ++i) {
		a[i] -= b[i];
	}
	return a;
}

/**
 * In-place multiplication of two 4x4 matrices.
 *
 * @param {array} a The first 4x4 input matrix.
 * @param {array} b The second 4x4 input matrix.
 *
 * @returns {array} The input matrix a, where a = a * b.
 */
SpiderGL.Math.Mat4.mul$ = function (a, b) {
	var a0  = a[ 0], a1  = a[ 1],  a2 = a[ 2], a3  = a[ 3],
	    a4  = a[ 4], a5  = a[ 5],  a6 = a[ 6], a7  = a[ 7],
	    a8  = a[ 8], a9  = a[ 9], a10 = a[10], a11 = a[11],
	    a12 = a[12], a13 = a[13], a14 = a[14], a15 = a[15],

	    b0  = b[ 0], b1  = b[ 1], b2  = b[ 2], b3  = b[ 3],
	    b4  = b[ 4], b5  = b[ 5], b6  = b[ 6], b7  = b[ 7],
	    b8  = b[ 8], b9  = b[ 9], b10 = b[10], b11 = b[11],
	    b12 = b[12], b13 = b[13], b14 = b[14], b15 = b[15];

	a[ 0] = a0*b0 + a4*b1 + a8*b2  + a12*b3;
	a[ 1] = a1*b0 + a5*b1 + a9*b2  + a13*b3;
	a[ 2] = a2*b0 + a6*b1 + a10*b2 + a14*b3;
	a[ 3] = a3*b0 + a7*b1 + a11*b2 + a15*b3;

	a[ 4] = a0*b4 + a4*b5 + a8*b6  + a12*b7;
	a[ 5] = a1*b4 + a5*b5 + a9*b6  + a13*b7;
	a[ 6] = a2*b4 + a6*b5 + a10*b6 + a14*b7;
	a[ 7] = a3*b4 + a7*b5 + a11*b6 + a15*b7;

	a[ 8] = a0*b8 + a4*b9 + a8*b10  + a12*b11;
	a[ 9] = a1*b8 + a5*b9 + a9*b10  + a13*b11;
	a[10] = a2*b8 + a6*b9 + a10*b10 + a14*b11;
	a[11] = a3*b8 + a7*b9 + a11*b10 + a15*b11;

	a[12] = a0*b12 + a4*b13 + a8*b14  + a12*b15;
	a[13] = a1*b12 + a5*b13 + a9*b14  + a13*b15;
	a[14] = a2*b12 + a6*b13 + a10*b14 + a14*b15;
	a[15] = a3*b12 + a7*b13 + a11*b14 + a15*b15;

	return a;
}

/**
 * In-place subtraction of a 4x4 matrix and a scalar.
 *
 * @param {array} m The 4x4 input matrix.
 * @param {number} s The input scalar.
 *
 * @returns {array} The input matrix m, where m[i] = m[i] * s.
 */
SpiderGL.Math.Mat4.muls$ = function (m, s) {
	for (var i=0; i<16; ++i) {
		m[i] *= s;
	}
	return m;
}

/**
 * In-place component-wise multiplication of two 4x4 matrices.
 *
 * @param {array} a The first 4x4 input matrix.
 * @param {array} b The second 4x4 input matrix.
 *
 * @returns {array} The input matrix a, where a[i] = a[i] * b[i].
 */
SpiderGL.Math.Mat4.compMul$ = function (a, b) {
	for (var i=0; i<16; ++i) {
		a[i] *= b[i];
	}
	return a;
}

/**
 * In-place component-wise division of two 4x4 matrices.
 *
 * @param {array} a The first 4x4 input matrix.
 * @param {array} b The second 4x4 input matrix.
 *
 * @returns {array} The input matrix a, where a[i] = a[i] / b[i].
 */
SpiderGL.Math.Mat4.compDiv$ = function (a, b) {
	for (var i=0; i<16; ++i) {
		a[i] /= b[i];
	}
	return a;
}

/**
 * In-place transpose of a 4x4 matrix.
 *
 * @param {array} m The 4x4 input matrix.
 *
 * @returns {array} The transposed input matrix m.
 */
SpiderGL.Math.Mat4.transpose$ = function (m) {
	var t;
	t = m[ 1]; m[ 1] = m[ 4]; m[ 4] = t;
	t = m[ 2]; m[ 2] = m[ 8]; m[ 8] = t;
	t = m[ 3]; m[ 3] = m[12]; m[12] = t;
	t = m[ 6]; m[ 6] = m[ 9]; m[ 9] = t;
	t = m[ 7]; m[ 7] = m[13]; m[13] = t;
	t = m[11]; m[11] = m[14]; m[14] = t;
	return m;
}

/**
 * In-place inversion of a 4x4 matrix.
 *
 * @param {array} m The 4x4 input matrix.
 *
 * @returns {array} The inverted input matrix m.
 */
SpiderGL.Math.Mat4.invert$ = function (m) {
	var m0  = m[ 0], m1  = m[ 1], m2  = m[ 2], m3  = m[ 3],
	    m4  = m[ 4], m5  = m[ 5], m6  = m[ 6], m7  = m[ 7],
	    m8  = m[ 8], m9  = m[ 9], m10 = m[10], m11 = m[11],
	    m12 = m[12], m13 = m[13], m14 = m[14], m15 = m[15];

	var d = 1.0 / (
		m12 * m9 * m6 * m3 - m8 * m13 * m6 * m3 - m12 * m5 * m10 * m3 + m4 * m13 * m10 * m3 +
		m8 * m5 * m14 * m3 - m4 * m9 * m14 * m3 - m12 * m9 * m2 * m7 + m8 * m13 * m2 * m7 +
		m12 * m1 * m10 * m7 - m0 * m13 * m10 * m7 - m8 * m1 * m14 * m7 + m0 * m9 * m14 * m7 +
		m12 * m5 * m2 * m11 - m4 * m13 * m2 * m11 - m12 * m1 * m6 * m11 + m0 * m13 * m6 * m11 +
		m4 * m1 * m14 * m11 - m0 * m5 * m14 * m11 - m8 * m5 * m2 * m15 + m4 * m9 * m2 * m15 +
		m8 * m1 * m6 * m15 - m0 * m9 * m6 * m15 - m4 * m1 * m10 * m15 + m0 * m5 * m10 * m15);

	m[ 0] = d * (m9*m14*m7-m13*m10*m7+m13*m6*m11-m5*m14*m11-m9*m6*m15+m5*m10*m15);
	m[ 1] = d * (m13*m10*m3-m9*m14*m3-m13*m2*m11+m1*m14*m11+m9*m2*m15-m1*m10*m15);
	m[ 2] = d * (m5*m14*m3-m13*m6*m3+m13*m2*m7-m1*m14*m7-m5*m2*m15+m1*m6*m15);
	m[ 3] = d * (m9*m6*m3-m5*m10*m3-m9*m2*m7+m1*m10*m7+m5*m2*m11-m1*m6*m11);

	m[ 4] = d * (m12*m10*m7-m8*m14*m7-m12*m6*m11+m4*m14*m11+m8*m6*m15-m4*m10*m15);
	m[ 5] = d * (m8*m14*m3-m12*m10*m3+m12*m2*m11-m0*m14*m11-m8*m2*m15+m0*m10*m15);
	m[ 6] = d * (m12*m6*m3-m4*m14*m3-m12*m2*m7+m0*m14*m7+m4*m2*m15-m0*m6*m15);
	m[ 7] = d * (m4*m10*m3-m8*m6*m3+m8*m2*m7-m0*m10*m7-m4*m2*m11+m0*m6*m11);

	m[ 8] = d * (m8*m13*m7-m12*m9*m7+m12*m5*m11-m4*m13*m11-m8*m5*m15+m4*m9*m15);
	m[ 9] = d * (m12*m9*m3-m8*m13*m3-m12*m1*m11+m0*m13*m11+m8*m1*m15-m0*m9*m15);
	m[10] = d * (m4*m13*m3-m12*m5*m3+m12*m1*m7-m0*m13*m7-m4*m1*m15+m0*m5*m15);
	m[11] = d * (m8*m5*m3-m4*m9*m3-m8*m1*m7+m0*m9*m7+m4*m1*m11-m0*m5*m11);

	m[12] = d * (m12*m9*m6-m8*m13*m6-m12*m5*m10+m4*m13*m10+m8*m5*m14-m4*m9*m14);
	m[13] = d * (m8*m13*m2-m12*m9*m2+m12*m1*m10-m0*m13*m10-m8*m1*m14+m0*m9*m14);
	m[14] = d * (m12*m5*m2-m4*m13*m2-m12*m1*m6+m0*m13*m6+m4*m1*m14-m0*m5*m14);
	m[15] = d * (m4*m9*m2-m8*m5*m2+m8*m1*m6-m0*m9*m6-m4*m1*m10+m0*m5*m10);

	return m;
}

/**
 * In-place column-major translation of a 4x4 matrix.
 *
 * @param {array} m The 4x4 input matrix.
 * @param {array} v The 3-dimensional translation vector.
 *
 * @returns {array} The translated input matrix m with the same result as m = m * t, where t is a translation matrix.
 */
SpiderGL.Math.Mat4.translate$ = function (m, v) {
	var x = v[0],
	    y = v[1],
	    z = v[2];

	m[12] = m[ 0]*x + m[ 4]*y + m[ 8]*z + m[12];
	m[13] = m[ 1]*x + m[ 5]*y + m[ 9]*z + m[13];
	m[14] = m[ 2]*x + m[ 6]*y + m[10]*z + m[14];
	m[15] = m[ 3]*x + m[ 7]*y + m[11]*z + m[15];

	return m;
}

/**
 * In-place column-major rotation of a 4x4 matrix.
 * The input matrix m will be post-multiplied by a matrix r representing a counter-clockwise rotation about the input axis by the input angle in radians.
 * The input axis need not to be normalized.
 *
 * @param {array} m The input 4x4 matrix.
 * @param {number} angle The counter-clockwise rotation angle, in radians.
 * @param {array} axis A 3-dimensional vector representing the rotation axis.
 *
 * @returns {array} The rotated input matrix m with the same result as m = m * r, where r is a rotation matrix.
 */
SpiderGL.Math.Mat4.rotateAngleAxis$ = function (m, angle, axis) {
	var r = SpiderGL.Math.Mat4.rotationAngleAxis(angle, axis);
	return SpiderGL.Math.Mat4.mul$(m, r);
}

/**
 * In-place column-major scaling of a 4x4 matrix.
 *
 * @param {array} m The 4x4 input matrix.
 * @param {array} v The scaling amount as a 3-dimensional array.
 *
 * @returns {array} The scaled input matrix m with the same result as m = m * s, where s is a scaling matrix.
 */
SpiderGL.Math.Mat4.scale$ = function (m, v) {
	var x = v[0],
	    y = v[1],
	    z = v[2];

	m[ 0] *= x; m[ 1] *= x; m[ 2] *= x; m[ 3] *= x;
	m[ 4] *= y; m[ 5] *= y; m[ 6] *= y; m[ 7] *= y;
	m[ 8] *= z; m[ 9] *= z; m[10] *= z; m[11] *= z;

	return m;
}

/*---------------------------------------------------------*/



// quaternion
/*---------------------------------------------------------*/

/**
 * The SpiderGL.Math.Quat namespace.
 * The provided functions operate on quaternions, represented as standard JavaScript arrays of length 4.
 * The identity quaternion is represented as the vector [0, 0, 0, 1].
 *
 * @namespace The SpiderGL.Math.Quat namespace defines operations on quaternions.
 */
SpiderGL.Math.Quat = { };

/**
 * Duplicates the input quaternion.
 *
 * @param {array} q The input quaternion.
 *
 * @returns {array} A new 4-component array r, where r[i] = q[i] (same as q.slice(0, 4)).
 */
SpiderGL.Math.Quat.dup = function (q) {
	return q.slice(0, 4);
}

/**
 * Creates an identity quaternion.
 * The identity quaternion is represented as the vector [0, 0, 0, 1].
 *
 * @returns {array} A new 4-component array r, where r = [0, 0, 0, 1].
 */
SpiderGL.Math.Quat.identity = function () {
	return [0, 0, 0, 1];
}

/**
 * Inverts a quaternion.
 *
 * @param {array} q The input quaternion.
 *
 * @returns {array} A new 4-component array r, where r = [-q[0], -q[1], -q[2], q[3]].
 */
SpiderGL.Math.Quat.inverse = function (q) {
	return [-q[0], -q[1], -q[2], q[3]];
}

/**
 * Multiplies two quaternions.
 *
 * @param {array} p The first quaternion multiplication operand.
 * @param {array} q The second quaternion multiplication quaternion.
 *
 * @returns {array} A new 4-component array r, where r = [-q[0], -q[1], -q[2], q[3]].
 */
SpiderGL.Math.Quat.mul = function (p, q) {
	var px = p[0],
	    py = p[1],
	    pz = p[2],
	    pw = p[3];

	var qx = q[0],
	    qy = q[1],
	    qz = q[2],
	    qw = q[3];

	return [
		px*qw + pw*qx + pz*qy - py*qz,
		py*qw + pw*qy + px*qz - pz*qx,
		pz*qw + pw*qz + py*qx - px*qy,
		pw*qw - px*qx - py*qy - pz*qz
	];
}

/**
 * Multiplies a quaternion by a scalar.
 *
 * @param {array} q The first quaternion multiplication operand.
 * @param {number} s The second scalar multiplication operand.
 *
 * @returns {array} A new 4-component array r, where r[i] = q[i]*s.
 */
SpiderGL.Math.Quat.muls = function (q, s) {
	return [q[0]*s, q[1]*s, q[2]*s, q[3]*s];
}

SpiderGL.Math.Quat.normalize = function (q) {
	var s = 1 / SpiderGL.Math.sqrt(q[0]*q[0] + q[1]*q[1] + q[2]*q[2] + q[3]*q[3]);
	return SpiderGL.Math.Quat.muls(q, s);
}

SpiderGL.Math.Quat.from33 = function (m) {
	var m00 = m[0],
	    m10 = m[1],
	    m20 = m[2];

	var m01 = m[3],
	    m11 = m[4],
	    m21 = m[5];

	var m02 = m[6],
	    m12 = m[7],
	    m22 = m[8];

	var t = m00 + m11 + m22;
	var s;

	if (t > 0) {
		t = t + 1;
		s = 0.5 / SpiderGL.Math.sqrt(t);
		return [
			(m21 - m12) * s,
			(m02 - m20) * s,
			(m10 - m01) * s,
			t * s
		];
	} else if ((m00 > m11) && (m00 > m22)) {
		t = m00 - m11 - m22 + 1;
		s = 0.5 / SpiderGL.Math.sqrt(t);
		return [
			t * s,
			(m10 + m01) * s,
			(m02 + m20) * s,
			(m21 - m12) * s,
		];
	}
	else if (m11 > m22) {
		t = -m00 + m11 - m22 + 1;
		s = 0.5 / SpiderGL.Math.sqrt(t);
		return [
			(m10 + m01) * s,
			t * s,
			(m21 + m12) * s,
			(m02 - m20) * s
		];
	}
	else {
		t = -m00 - m11 + m22 + 1;
		s = 0.5 / SpiderGL.Math.sqrt(t);
		return [
			(m02 + m20) * s,
			(m21 + m12) * s,
			t * s,
			(m10 - m01) * s
		];
	}

	return null;
}

SpiderGL.Math.Quat.to33 = function (q) {
	var x  = q[0],
	    y  = q[1],
	    z  = q[2],
	    w  = q[3];

	var xx = x*x,
	    xy = x*y,
	    xz = x*z,
	    xw = x*w;

	var yy = y*y,
	    yz = y*z,
	    yw = y*w;

	var zz = z*z,
	    zw = z*w;

	return [
		1 - 2 * ( yy + zz ),
		    2 * ( xy + zw ),
		    2 * ( xz - yw ),

		    2 * ( xy - zw ),
		1 - 2 * ( xx + zz ),
		    2 * ( yz + xw ),

		    2 * ( xz + yw ),
		    2 * ( yz - xw ),
		1 - 2 * ( xx + yy )
	];
}

SpiderGL.Math.Quat.from44 = function (m) {
	return SpiderGL.Math.Quat.from33(SpiderGL.Math.Mat4.to33(m));
}

SpiderGL.Math.Quat.to44 = function (q) {
	return SpiderGL.Math.Mat3.to44(SpiderGL.Math.Quat.to33(q));
}

SpiderGL.Math.Quat.fromAngleAxis = function (angle, axis) {
	return [0, 0, 0, 1];
}

SpiderGL.Math.Quat.toAngleAxis = function (q) {
	return [0, 0, 0, 1];
}

SpiderGL.Math.Quat.fromEulerAngles = function (x, y, z) {
	return [0, 0, 0, 1];
}

SpiderGL.Math.Quat.toEulerAngles = function (q) {
	return [0, 0, 0, 1];
}

SpiderGL.Math.Quat.copy$ = function (p, q) {
	p[0] = q[0];
	p[1] = q[1];
	p[2] = q[2];
	p[3] = q[3];
	return p;
}

SpiderGL.Math.Quat.identity$ = function (q) {
	q[0] = 0;
	q[1] = 0;
	q[2] = 0;
	q[3] = 1;
	return q;
}

SpiderGL.Math.Quat.invert$ = function (q) {
	q[0] = -q[0];
	q[1] = -q[1];
	q[2] = -q[2];
	return q;
}

SpiderGL.Math.Quat.mul$ = function (q) {
	var px = p[0],
	    py = p[1],
	    pz = p[2],
	    pw = p[3];

	var qx = q[0],
	    qy = q[1],
	    qz = q[2],
	    qw = q[3];

	q[0] = px*qw + pw*qx + pz*qy - py*qz;
	q[1] = py*qw + pw*qy + px*qz - pz*qx;
	q[2] = pz*qw + pw*qz + py*qx - px*qy;
	q[3] = pw*qw - px*qx - py*qy - pz*qz;

	return q;
}

SpiderGL.Math.Quat.muls$ = function (q, s) {
	q[0] *= s;
	q[1] *= s;
	q[2] *= s;
	q[3] *= s;
	return q;
}

SpiderGL.Math.Quat.normalize$ = function (q) {
	var s = 1 / SpiderGL.Math.sqrt(q[0]*q[0] + q[1]*q[1] + q[2]*q[2] + q[3]*q[3]);
	return SpiderGL.Math.Quat.muls$(q, s);
}

/*---------------------------------------------------------*/



// general
/*---------------------------------------------------------*/

SpiderGL.Math.project = function (xyzw, modelViewProjectionMatrix, viewport, depthRange) {
	var v3 = SpiderGL.Math.Vec3;
	var m4 = SpiderGL.Math.Mat4;

	var r    = m4.mul4(modelViewProjectionMatrix, xyzw);
	var invW = 1 / r[3];
	r[3]     = invW;

	v3.muls$(r, invW / 2);
	v3.adds$(r, 0.5);

	v3.mul$(r, [viewport[2], viewport[3], depthRange[1] - depthRange[0]]);
	v3.add$(r, [viewport[0], viewport[1], depthRange[0]]);

	return r;
};

SpiderGL.Math.unproject = function (xyz, modelViewProjectionMatrixInverse, viewport, depthRange) {
	var v3 = SpiderGL.Math.Vec3;
	var m4 = SpiderGL.Math.Mat4;

	var r = v3.to4(xyz, 1.0);

	v3.sub$(r, [viewport[0], viewport[1], depthRange[0]]);
	v3.div$(r, [viewport[2], viewport[3], depthRange[1] - depthRange[0]]);

	v3.muls$(r, 2);
	v3.subs$(r, 1);

	r        = m4.mul4(modelViewProjectionMatrixInverse, r);
	var invW = 1 / r[3];
	r[3]     = invW;

	v3.muls$(r, invW);

	return r;
};

/*---------------------------------------------------------*/
/*
SpiderGL Computer Graphics Library
Copyright (c) 2010, Marco Di Benedetto - Visual Computing Lab, ISTI - CNR
All rights reserved.

Redistribution and use in source and binary forms, with or without
modification, are permitted provided that the following conditions are met:
    * Redistributions of source code must retain the above copyright
      notice, this list of conditions and the following disclaimer.
    * Redistributions in binary form must reproduce the above copyright
      notice, this list of conditions and the following disclaimer in the
      documentation and/or other materials provided with the distribution.
    * Neither the name of SpiderGL nor the
      names of its contributors may be used to endorse or promote products
      derived from this software without specific prior written permission.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
DISCLAIMED. IN NO EVENT SHALL PAUL BRUNT BE LIABLE FOR ANY
DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
(INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
(INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
*/

/**
 * @fileOverview Space
 */

/**
 * The SpiderGL.Space namespace.
 *
 * @namespace The SpiderGL.Space namespace.
 */
SpiderGL.Space = { };

/**
 * Creates a SpiderGL.Space.MatrixStack.
 *
 * SpiderGL.Space.MatrixStack is a stack for 4x4 matrices. Initially, the stack depth is one and contains an identity matrix.
 * Every method or getter to access the top matrix (or a derivation like inverse or transpose) returns a copy of the internal matrix.
 * For performance reasons, variants of the above accessors (having the same identifier with the postfix "$" appended) that return a reference to the internal matrix are also present.
 * The transpose, inverse, and inverse-transpose of the top matrix are calculated and cached when they are accessed.
 *
 * @class The SpiderGL.Space.MatrixStack is a stack for 4x4 matrices.
 *
 * @augments SpiderGL.Core.ObjectBase
 *
 * @param {function(this)} [onChange] A callback function called whenever the stack is modified.
 *
 * @example
 * var s = new SpiderGL.Space.MatrixStack();
 * s.loadIdentity();
 * s.scale([2, 0.5, 2]);
 * for (var i=0; i<n; ++i) {
 * 	s.push();
 * 		s.translate(positions[i]);
 * 		matrices[i] = {
 * 			m  : s.matrix,
 * 			i  : s.inverse,
 * 			t  : s.transpose,
 * 			it : s.inverseTranspose
 * 		};
 * 	s.pop();
 * }
 *
 * @see reset
 * @see SpiderGL.Space.TransformationStack
 */
SpiderGL.Space.MatrixStack = function (onChange) {
	SpiderGL.Core.ObjectBase.call(this);

	this._onChange = null;
	this.reset();
	this._onChange = onChange;
}

SpiderGL.Space.MatrixStack.prototype = {
	_invalidate : function () {
		this._i  = null;
		this._t  = null;
		this._it = null;
		if (this._onChange) {
			this._onChange(this);
		}
	},

	/**
	 * Resets the stack.
	 * The stack is reset to its initial state, that is, a stack with depth one containing the identity matrix.
	 *
	 * @see SpiderGL.Math.Mat4.identity
	 */
	reset : function () {
		var m = SpiderGL.Math.Mat4.identity();
		this._s  = [ m ];
		this._l  = 1;
		this._m  = m;
		this._i  = m;
		this._t  = m;
		this._it = m;
		if (this._onChange) {
			this._onChange(this);
		}
	},

	/**
	 * Gets/Sets the callback invoked whenever the top matrix changes.
	 * Initially, no callback is defined.
	 *
	 * @event
	 */
	get onChange() {
		return this._onChange;
	},

	set onChange(f) {
		this._onChange = f;
	},

	/**
	 * Gets the stack depth.
	 * Initially, the stack contains an identity matrix, so its depth is one.
	 *
	 * @type number
	 *
	 * @readonly
	 */
	get size() {
		return this._l;
	},

	/**
	 * Gets a reference to the matrix at the top of the stack.
	 * The returned array MUST NOT be changed.
	 * Initially, the stack has depth one and contains an identity matrix.
	 *
	 * @type array
	 *
	 * @readonly
	 *
	 * @see #matrix
	 */
	get matrix$() {
		return this._m;
	},

	/**
	 * Gets a copy of the matrix at the top of the stack.
	 * Initially, the stack has depth one and contains an identity matrix.
	 *
	 * @type array
	 *
	 * @readonly
	 *
	 * @see #matrix$
	 */
	get matrix() {
		return SpiderGL.Math.Mat4.dup(this.matrix$);
	},

	/**
	 * Alias for #matrix$.
	 *
	 * @type array
	 *
	 * @readonly
	 *
	 * @see #top
	 * @see #matrix$
	 */
	get top$() {
		return this.matrix$;
	},

	/**
	 * Alias for #matrix.
	 *
	 * @type array
	 *
	 * @readonly
	 *
	 * @see #top$
	 * @see #matrix
	 */
	get top() {
		return this.matrix;
	},

	/**
	 * Gets a reference to the inverse of the matrix at the top of the stack.
	 * The returned array MUST NOT be changed.
	 *
	 * @type array
	 *
	 * @readonly
	 *
	 * @see #inverse
	 */
	get inverse$() {
		return (this._i || (this._i = SpiderGL.Math.Mat4.inverse(this._m)));
	},

	/**
	 * Gets a copy of the inverse of the matrix at the top of the stack.
	 *
	 * @type array
	 *
	 * @readonly
	 *
	 * @see #inverse$
	 */
	get inverse() {
		return SpiderGL.Math.Mat4.dup(this.inverse$);
	},

	/**
	 * Gets a reference to the transpose of the matrix at the top of the stack.
	 * The returned array MUST NOT be changed.
	 *
	 * @type array
	 *
	 * @readonly
	 *
	 * @see #transpose
	 */
	get transpose$() {
		return (this._t || (this._t = SpiderGL.Math.Mat4.transpose(this._m)));
	},

	/**
	 * Gets a copy of the transpose of the matrix at the top of the stack.
	 *
	 * @type array
	 *
	 * @readonly
	 *
	 * @see #transpose$
	 */
	get transpose() {
		return SpiderGL.Math.Mat4.dup(this.transpose$);
	},

	/**
	 * Gets a reference to the transpose of the inverse of the matrix at the top of the stack.
	 * The returned array MUST NOT be changed.
	 *
	 * @type array
	 *
	 * @readonly
	 *
	 * @see #inverseTranspose
	 */
	get inverseTranspose$() {
		return (this._it || (this._it = SpiderGL.Math.Mat4.transpose(this.inverse$)));
	},

	/**
	 * Gets a copy of the transpose of the inverse of the matrix at the top of the stack.
	 *
	 * @type array
	 *
	 * @readonly
	 *
	 * @see #inverseTranspose$
	 */
	get inverseTranspose() {
		return SpiderGL.Math.Mat4.dup(this.inverseTranspose$);
	},

	/**
	 * Pushes into the stack the matrix at its top.
	 * After a push operation, the stack depth is incremented by one and the two matrices at its top are identical.
	 * There is no limit on the depth the stack can reach.
	 *
	 * @see #pop
	 */
	push : function () {
		var m = SpiderGL.Math.Mat4.dup(this._m);
		this._s.push(m);
		this._l++;
		this._m = m;
	},

	/**
	 * Pops the stack.
	 * After a pop operation, the stack depth is decremented by one.
	 * Nothing is done if the stack has only one element.
	 *
	 * @see #push
	 */
	pop : function () {
		if (this._l <= 1) return;
		this._s.pop();
		this._l--;
		this._m = this._s[this._l - 1];
		this._invalidate();
	},

	/**
	 * Replaces the matrix at the top with a clone of the passed matrix.
	 *
	 * @param {array} m The matrix whose clone will be set as the top of the stack.
	 *
	 * @see #loadIdentity
	 * @see #multiply
	 * @see SpiderGL.Math.Mat4.dup
	 */
	load : function (m) {
		m = SpiderGL.Math.Mat4.dup(m);
		this._s[this._l - 1] = m;
		this._m = m;
		this._invalidate();
	},

	/**
	 * Replaces the matrix at the top with an identity matrix.
	 *
	 * @see #load
	 * @see #multiply
	 * @see SpiderGL.Math.Mat4.identity
	 * @see SpiderGL.Math.Mat4.identity$
	 */
	loadIdentity : function () {
		var m = SpiderGL.Math.Mat4.identity$(this._m);
		this._i  = m;
		this._t  = m;
		this._it = m;
	},

	/**
	 * Post-multiplies the matrix at the top with the passed matrix
	 * The matrix a at the top will be replaced by a * m.
	 *
	 * @param {array} m The matrix to post-multiply.
	 *
	 * @see #load
	 * @see SpiderGL.Math.Mat4.mul
	 * @see SpiderGL.Math.Mat4.mul$
	 */
	multiply : function (m) {
		SpiderGL.Math.Mat4.mul$(this._m, m);
		this._invalidate();
	},

	/**
	 * Post-multiplies the matrix at the top with an ortographic projection matrix.
	 *
	 * @param {array} min The minimum coordinates of the parallel viewing volume.
	 * @param {array} max The maximum coordinates of the parallel viewing volume.
	 *
	 * @see #frustum
	 * @see #perspective
	 * @see SpiderGL.Math.Mat4.ortho
	 * @see SpiderGL.Math.Mat4.mul$
	 */
	ortho : function (min, max) {
		SpiderGL.Math.Mat4.mul$(this._m, SpiderGL.Math.Mat4.ortho(min, max));
		this._invalidate();
	},

	/**
	 * Post-multiplies the matrix at the top with a frustum matrix.
	 *
	 * @param {array} min A 3-component array with the minimum coordinates of the frustum volume.
	 * @param {array} max A 3-component array with the maximum coordinates of the frustum volume.
	 *
	 * @see #perspective
	 * @see #ortho
	 * @see SpiderGL.Math.Mat4.frustum
	 * @see SpiderGL.Math.Mat4.mul$
	 */
	frustum : function (min, max) {
		SpiderGL.Math.Mat4.mul$(this._m, SpiderGL.Math.Mat4.frustum(min, max));
		this._invalidate();
	},

	/**
	 * Post-multiplies the matrix at the top with a perspective projection matrix.
	 *
	 * @param {number} fovY The vertical field-of-view angle, in radians.
	 * @param {number} aspectRatio The projection plane aspect ratio.
	 * @param {number} zNear The distance of the near clipping plane.
	 * @param {number} zFar The distance of the far clipping plane.
	 *
	 * @see #frustum
	 * @see #ortho
	 * @see SpiderGL.Math.Mat4.perspective
	 * @see SpiderGL.Math.Mat4.mul$
	 */
	perspective : function (fovY, aspectRatio, zNear, zFar) {
		SpiderGL.Math.Mat4.mul$(this._m, SpiderGL.Math.Mat4.perspective(fovY, aspectRatio, zNear, zFar));
		this._invalidate();
	},

	/**
	 * Post-multiplies the matrix at the top with a look-at matrix.
	 *
	 * @param {array} position The viewer's position as a 3-dimensional vector.
	 * @param {array} target The viewer's look-at point as a 3-dimensional vector.
	 * @param {array} position The viewer's up vector as a 3-dimensional vector.
	 *
	 * @see SpiderGL.Math.Mat4.lookAt
	 * @see SpiderGL.Math.Mat4.mul$
	 */
	lookAt : function (position, target, up) {
		SpiderGL.Math.Mat4.mul$(this._m, SpiderGL.Math.Mat4.lookAt(position, target, up));
		this._invalidate();
	},

	/**
	 * Post-multiplies the matrix at the top with a translation matrix.
	 *
	 * @param {array} v A 3-dimensional vector with translation offsets.
	 *
	 * @see #rotate
	 * @see #scale
	 * @see SpiderGL.Math.Mat4.translation
	 * @see SpiderGL.Math.Mat4.translate$
	 */
	translate : function (v) {
		SpiderGL.Math.Mat4.translate$(this._m, v);
		this._invalidate();
	},

	/**
	 * Post-multiplies the matrix at the top with a rotation matrix.
	 *
	 * @param {number} angle The counter-clockwise rotation angle, in radians.
	 * @param {array} axis A 3-dimensional vector representing the rotation axis.
	 *
	 * @see #translate
	 * @see #scale
	 * @see SpiderGL.Math.Mat4.rotationAngleAxis
	 * @see SpiderGL.Math.Mat4.rotateAngleAxis$
	 */
	rotate : function (angle, axis) {
		SpiderGL.Math.Mat4.rotateAngleAxis$(this._m, angle, axis);
		this._invalidate();
	},

	/**
	 * Post-multiplies the matrix at the top with a scaling matrix.
	 *
	 * @param {array} v The scaling amount as a 3-dimensional array.
	 *
	 * @see #translate
	 * @see #rotate
	 * @see SpiderGL.Math.Mat4.scaling
	 * @see SpiderGL.Math.Mat4.scale$
	 */
	scale : function (v) {
		SpiderGL.Math.Mat4.scale$(this._m, v);
		this._invalidate();
	}
};

SpiderGL.Type.extend(SpiderGL.Space.MatrixStack, SpiderGL.Core.ObjectBase);

/**
 * Creates a SpiderGL.Space.ViewportStack.
 *
 * SpiderGL.Space.ViewportStack is a stack for viewport rectangles, specified with lower and left coordinates, width and height.
 * Initially, the stack depth is one and contains a rectangle with lower-eft coordinates equal to zero and width and height equal to one, that is, the array [0, 0, 1, 1].
 * Every method or getter to access the top rectangle returns a copy of the internal rectangle.
 * For performance reasons, variants of the above accessors (having the same identifier with the postfix "$" appended) that return a reference to the internal rectangle are also present.
 *
 * @class The SpiderGL.Space.ViewportStack is a stack for viewport rectangles.
 *
 * @augments SpiderGL.Core.ObjectBase
 *
 * @param {function(this)} [onChange] A callback function called whenever the stack is modified.
 *
 * @example
 * var s  = new SpiderGL.Space.ViewportStack();
 * var dw = width  / nx;
 * var dh = height / ny;
 * s.load(x, y, width, height);
 * for (var x=0; x<nx; ++x) {
 * 	for (var y=0; y<ny; ++y) {
 * 	s.push();
		s.inner([x*dw, y*dh, dw, dh]);
		viewports.push(s.rect);
 * 	s.pop();
 * }
 *
 * @see reset
 * @see SpiderGL.Space.TransformationStack
 */
SpiderGL.Space.ViewportStack = function (onChange) {
	SpiderGL.Core.ObjectBase.call(this);

	this._onChange = null;
	this.reset();
	this._onChange = onChange;
}

SpiderGL.Space.ViewportStack.prototype = {
	_invalidate : function () {
		if (this._onChange) {
			this._onChange(this);
		}
	},

	/**
	 * Resets the stack.
	 * The stack is reset to its initial state, that is, a stack with depth one containing the identity rectangle, that is, [0, 0, 1, 1].
	 *
	 * @see #loadIdentity
	 */
	reset : function () {
		var r = [0, 0, 1, 1];
		this._s  = [ r ];
		this._l  = 1;
		this._r  = r;
		if (this._onChange) {
			this._onChange(this);
		}
	},

	/**
	 * Gets/Sets the callback invoked whenever the top rectangle changes.
	 * Initially, no callback is defined.
	 *
	 * @event
	 */
	get onChange() {
		return this._onChange;
	},

	set onChange(f) {
		this._onChange = f;
	},

	/**
	 * Gets the stack depth.
	 * Initially, the stack contains the identity rectangle, that is, [0, 0, 1, 1].
	 *
	 * @type number
	 *
	 * @readonly
	 */
	get size() {
		return this._l;
	},

	/**
	 * Gets a reference to the rectangle at the top of the stack.
	 * The returned array MUST NOT be changed.
	 * Initially, the stack has depth one and contains the identity rectangle, that is, [0, 0, 1, 1].
	 *
	 * @type array
	 *
	 * @readonly
	 *
	 * @see #rect
	 */
	get rect$() {
		return this._r;
	},

	/**
	 * Gets a copy of the matrix at the top of the stack.
	 * Initially, the stack has depth one and contains the identity rectangle, that is, [0, 0, 1, 1].
	 *
	 * @type array
	 *
	 * @readonly
	 *
	 * @see #rect$
	 */
	get rect() {
		return this.rect$.slice(0, 4);
	},

	/**
	 * Alias for #rect$.
	 *
	 * @type array
	 *
	 * @readonly
	 *
	 * @see #top
	 * @see #rect$
	 */
	get top$() {
		return this.rect$;
	},

	/**
	 * Alias for #rect.
	 *
	 * @type array
	 *
	 * @readonly
	 *
	 * @see #top$
	 * @see #rect
	 */
	get top() {
		return this.rect;
	},

	/**
	 * Pushes into the stack the rectangle at its top.
	 * After a push operation, the stack depth is incremented by one and the two rectangle at its top are identical.
	 * There is no limit on the depth the stack can reach.
	 *
	 * @see #pop
	 */
	push : function () {
		var r = this._r.slice(0, 4);
		this._s.push(r);
		this._l++;
		this._r = r;
	},

	/**
	 * Pops the stack.
	 * After a pop operation, the stack depth is decremented by one.
	 * Nothing is done if the stack has only one element.
	 *
	 * @see #push
	 */
	pop : function () {
		if (this._l <= 1) return;
		this._s.pop();
		this._l--;
		this._r = this._s[this._l - 1];
		this._invalidate();
	},

	/**
	 * Replaces the rectangle at the top with a clone of the passed rectangle.
	 *
	 * @param {array} m The rectangle whose clone will be set as the top of the stack.
	 *
	 * @see #loadIdentity
	 * @see #inner
	 */
	load : function (r) {
		r = r.slice(0, 4);
		this._s[this._l - 1] = r;
		this._r = r;
		this._invalidate();
	},

	/**
	 * Replaces the rectangle at the top with the identity rectangle, that is, [0, 0, 1, 1].
	 *
	 * @see #load
	 * @see #inner
	 */
	loadIdentity : function () {
		var r = [0, 0, 1, 1];
		this._r  = r;
	},

	/**
	 * Replace the rectangle r at the top of the stack with Post-multiplies the matrix at the top with the passed matrix
	 * The matrix a at the top will be replaced by a * m.
	 *
	 * @param {array} m The matrix to post-multiply.
	 *
	 * @see #load
	 */
	inner : function (r) {
		this._r[0] += r[0];
		this._r[1] += r[1];
		this._r[2]  = r[2];
		this._r[3]  = r[3];
		this._invalidate();
	}
};

SpiderGL.Type.extend(SpiderGL.Space.ViewportStack, SpiderGL.Core.ObjectBase);

/**
 * Creates a SpiderGL.Space.ViewportStack.
 *
 * SpiderGL.Space.ViewportStack is a stack for viewport rectangles, specified with lower and left coordinates, width and height.
 * Initially, the stack depth is one and contains a rectangle with lower-eft coordinates equal to zero and width and height equal to one, that is, the array [0, 0, 1, 1].
 * Every method or getter to access the top rectangle returns a copy of the internal rectangle.
 * For performance reasons, variants of the above accessors (having the same identifier with the postfix "$" appended) that return a reference to the internal rectangle are also present.
 *
 * @class The SpiderGL.Space.ViewportStack is a stack for viewport rectangles.
 *
 * @augments SpiderGL.Core.ObjectBase
 *
 * @param {function(this)} [onChange] A callback function called whenever the stack is modified.
 *
 * @example
 * var s  = new SpiderGL.Space.ViewportStack();
 * var dw = width  / nx;
 * var dh = height / ny;
 * s.load(x, y, width, height);
 * for (var x=0; x<nx; ++x) {
 * 	for (var y=0; y<ny; ++y) {
 * 	s.push();
		s.inner([0, 0, dw, dh]);
		viewports.push(s.rect);
 * 	s.pop();
 * }
 *
 * @see reset
 * @see SpiderGL.Space.TransformationStack
 */
SpiderGL.Space.DepthRangeStack = function (onChange) {
	SpiderGL.Core.ObjectBase.call(this);

	this._onChange = null;
	this.reset();
	this._onChange = onChange;
}

SpiderGL.Space.DepthRangeStack.prototype = {
	_invalidate : function () {
		if (this._onChange) {
			this._onChange(this);
		}
	},

	/**
	 * Resets the stack.
	 * The stack is reset to its initial state, that is, a stack with depth one containing the identity rectangle, that is, [0, 0, 1, 1].
	 *
	 * @see #loadIdentity
	 */
	reset : function () {
		var r = [0, 1];
		this._s  = [ r ];
		this._l  = 1;
		this._r  = r;
		if (this._onChange) {
			this._onChange(this);
		}
	},

	/**
	 * Gets/Sets the callback invoked whenever the top rectangle changes.
	 * Initially, no callback is defined.
	 *
	 * @event
	 */
	get onChange() {
		return this._onChange;
	},

	set onChange(f) {
		this._onChange = f;
	},

	/**
	 * Gets the stack depth
	 * Initially, the stack contains an identity matrix, so its depth is one.
	 *
	 * @type number
	 *
	 * @readonly
	 */
	get size() {
		return this._l;
	},

	/**
	 * Gets a reference to the matrix at the top of the stack.
	 * The returned array MUST NOT be changed.
	 * Initially, the stack has depth one and contains an identity matrix.
	 *
	 * @type array
	 *
	 * @readonly
	 *
	 * @see #matrix
	 */
	get range$() {
		return this._r;
	},

	/**
	 * Gets a copy of the matrix at the top of the stack.
	 * Initially, the stack has depth one and contains an identity matrix.
	 *
	 * @type array
	 *
	 * @readonly
	 *
	 * @see #matrix$
	 */
	get range() {
		return this.range$.slice(0, 2);
	},

	/**
	 * Alias for #rect$.
	 *
	 * @type array
	 *
	 * @readonly
	 *
	 * @see #top
	 * @see #rect$
	 */
	get top$() {
		return this.range$;
	},

	/**
	 * Alias for #rect.
	 *
	 * @type array
	 *
	 * @readonly
	 *
	 * @see #top$
	 * @see #rect
	 */
	get top() {
		return this.range;
	},

	/**
	 * Pushes into the stack the range at its top.
	 * After a push operation, the stack depth is incremented by one and the two rectangle at its top are identical.
	 * There is no limit on the depth the stack can reach.
	 *
	 * @see #pop
	 */
	push : function () {
		var r = this._r.slice(0, 2);
		this._s.push(r);
		this._l++;
		this._r = r;
	},

	/**
	 * Pops the stack.
	 * After a pop operation, the stack depth is decremented by one.
	 * Nothing is done if the stack has only one element.
	 *
	 * @see #push
	 */
	pop : function () {
		if (this._l <= 1) return;
		this._s.pop();
		this._l--;
		this._r = this._s[this._l - 1];
		this._invalidate();
	},

	/**
	 * Replaces the matrix at the top with a clone of the passed matrix.
	 *
	 * @param {array} m The matrix to push on the stack. The matrix actually pushed is a clone of m.
	 *
	 * @see #loadIdentity
	 * @see #multiply
	 * @see SpiderGL.Math.Mat4.dup
	 */
	load : function (r) {
		r = r.slice(0, 2);
		this._s[this._l - 1] = r;
		this._r = r;
		this._invalidate();
	},

	/**
	 * Replaces the matrix at the top with an identity matrix.
	 *
	 * @see #load
	 * @see #multiply
	 * @see SpiderGL.Math.Mat4.identity
	 * @see SpiderGL.Math.Mat4.identity$
	 */
	loadIdentity : function () {
		var r = [0, 1];
		this._r  = r;
	},

	/**
	 * Post-multiplies the matrix at the top with the passed matrix
	 * The matrix a at the top will be replaced by a * m.
	 *
	 * @param {array} m The matrix to post-multiply.
	 *
	 * @see #load
	 */
	inner : function (r) {
		this._r[0] += r[0];
		this._r[1]  = r[1];
		this._invalidate();
	}
};

SpiderGL.Type.extend(SpiderGL.Space.DepthRangeStack, SpiderGL.Core.ObjectBase);

/**
 * Creates a SpiderGL.Space.TransformationStack.
 *
 * The purpose of SpiderGL.Space.TransformationStack is to provide transformation stack similar to the one in the fixed-pipeline versions of OpenGL.
 * Differently from OpenGL, which has two stacks, namely MODELVIEW and PRIJECTION, the SpiderGL.Space.TransformationStack is composed of three SpiderGL.Space.MatrixStack stacks: model, view and projection.
 * All three stacks can be directly accessed, as well as utility getters to obtain compositions of matrices, e.g. model-view-projection, model-view-inverse etc.
 * To avoid recalculation of several sub-products, matrix compositions and variations are cached and updated when stack operations occur.
 *
 * @class The SpiderGL.Space.TransformationStack holds the model, view and projection matrix stacks and calculates their matrix compositions.
 *
 * @augments SpiderGL.Core.ObjectBase
 *
 * @example
 * var xform = new SpiderGL.Space.TransformationStack();
 *
 * var uniforms = {
 * 	uModelViewprojection : null,
 * 	uNormalMatrix        : null,
 * 	uColor               : null
 * };
 *
 * program.bind();
 *
 * xform.projection.loadIdentity();
 * xform.projection.perspective(SpiderGL.Math.degToRad(60.0), width/height, 0.1, 100.0);
 *
 * xform.view.loadIdentity();
 * xform.view.lookAt([0, 0, 10], [0, 0, 0], [0, 1, 0]);
 *
 * xform.model.loadIdentity();
 * xform.model.scale([0.1, 0.1, 0.1]);
 *
 * for (var i=0; i<n; ++i) {
 * 	s.push();
 * 		s.translate(models[i].positions);
 * 		uniforms.uModelViewProjection = xform.modelViewProjectionMatrix;
 * 		uniforms.uNormalMatrix        = xform.modelSpaceNormalMatrix;
 * 		uniforms.uColor               = models[i].color;
 * 		program.setUniforms(uniforms);
 * 		drawModel(models[i]);
 * 	s.pop();
 * }
 *
 * @see reset
 * @see SpiderGL.Space.MatrixStack
 */
SpiderGL.Space.TransformationStack = function () {
	SpiderGL.Core.ObjectBase.call(this);

	var that = this;

	this._mv  = { };
	this._vp  = { };
	this._mvp = { };
	this._n   = { };
	this._c   = { };

	this._m = new SpiderGL.Space.MatrixStack(function(){
		that._mv  = { };
		that._mvp = { };
		that._n   = { };
		that._c   = { };
	});

	this._v = new SpiderGL.Space.MatrixStack(function(){
		that._mv  = { };
		that._vp  = { };
		that._mvp = { };
		that._n   = { };
		that._c   = { };
	});

	this._p = new SpiderGL.Space.MatrixStack(function(){
		that._vp  = { };
		that._mvp = { };
	});

	this._viewport = new SpiderGL.Space.ViewportStack(function(){
	});

	this._depth = new SpiderGL.Space.DepthRangeStack(function(){
	});
}

SpiderGL.Space.TransformationStack.prototype = {
	/**
	 * Resets the three stacks.
	 *
	 * @see SpiderGL.Space.MatrixStack.reset
	 */
	reset : function () {
		this._m.reset();
		this._v.reset();
		this._p.reset();
	},

	/**
	 * Gets the viewport stack.
	 *
	 * @type SpiderGL.Space.ViewportStack
	 *
	 * @see depthRange
	 */
	get viewport() {
		return this._viewport;
	},

	get viewportRect$() {
		return this._viewport.rect$;
	},

	get viewportRect() {
		return this._viewport.rect;
	},

	/**
	 * Gets the depth range stack.
	 *
	 * @type SpiderGL.Space.DepthRangeStack
	 *
	 * @see viewport
	 */
	get depth() {
		return this._depth;
	},

	get depthRange$() {
		return this._depth.range$;
	},

	get depthRange() {
		return this._depth.range;
	},

	/**
	 * Gets the model stack.
	 *
	 * @type SpiderGL.Space.MatrixStack
	 *
	 * @see view
	 * @see projection
	 */
	get model() {
		return this._m;
	},

	/**
	 * Gets a reference to the top matrix of the model stack.
	 * The returned array MUST NOT be changed.
	 *
	 * @see modelMatrix
	 * @see SpiderGL.Space.MatrixStack.matrix$
	 */
	get modelMatrix$() {
		return this._m.matrix$;
	},

	/**
	 * Gets a copy of the top matrix of the model stack.
	 *
	 * @type array
	 *
	 * @see modelMatrix$
	 * @see SpiderGL.Space.MatrixStack.matrix
	 */
	get modelMatrix() {
		return this._m.matrix;
	},

	/**
	 * Gets a reference to the inverse of the top matrix of the model stack.
	 * The returned array MUST NOT be changed.
	 *
	 * @type array
	 *
	 * @see modelMatrixInverse
	 * @see SpiderGL.Space.MatrixStack.inverse$
	 */
	get modelMatrixInverse$() {
		return this._m.inverse$;
	},

	/**
	 * Gets a copy of the inverse of the top matrix of the model stack.
	 *
	 * @type array
	 *
	 * @see modelMatrixInverse$
	 * @see SpiderGL.Space.MatrixStack.inverse
	 */
	get modelMatrixInverse() {
		return this._m.inverse;
	},

	/**
	 * Gets a reference to the transpose of the top matrix of the model stack.
	 * The returned array MUST NOT be changed.
	 *
	 * @type array
	 *
	 * @see modelMatrixTranspose
	 * @see SpiderGL.Space.MatrixStack.transpose$
	 */
	get modelMatrixTranspose$() {
		return this._m.transpose$;
	},

	/**
	 * Gets a copy of the transpose of the top matrix of the model stack.
	 *
	 * @type array
	 *
	 * @see modelMatrixTranspose$
	 * @see SpiderGL.Space.MatrixStack.transpose
	 */
	get modelMatrixTranspose() {
		return this._m.transpose;
	},

	/**
	 * Gets a reference to the transpose of the inverse of the top matrix of the model stack.
	 * The returned array MUST NOT be changed.
	 *
	 * @type array
	 *
	 * @see modelMatrixInverseTranspose
	 * @see SpiderGL.Space.MatrixStack.inverseTranspose$
	 */
	get modelMatrixInverseTranspose$() {
		return this._m.inverseTranspose$;
	},

	/**
	 * Gets a copy of the transpose of the inverse of the top matrix of the model stack.
	 *
	 * @type array
	 *
	 * @see modelMatrixInverseTranspose$
	 * @see SpiderGL.Space.MatrixStack.inverseTranspose
	 */
	get modelMatrixInverseTranspose() {
		return this._m.inverseTranspose;
	},

	/**
	 * Gets the view stack.
	 *
	 * @type SpiderGL.Space.MatrixStack
	 *
	 * @see model
	 * @see projection
	 */
	get view() {
		return this._v;
	},

	/**
	 * Gets a reference to the top matrix of the view stack.
	 * The returned array MUST NOT be changed.
	 *
	 * @type array
	 *
	 * @see viewMatrix
	 * @see SpiderGL.Space.MatrixStack.matrix$
	 */
	get viewMatrix$() {
		return this._v.matrix$;
	},

	/**
	 * Gets a copy of the top matrix of the view stack.
	 *
	 * @type array
	 *
	 * @see viewMatrix$
	 * @see SpiderGL.Space.MatrixStack.matrix
	 */
	get viewMatrix() {
		return this._v.matrix;
	},

	/**
	 * Gets a reference to the inverse of the top matrix of the view stack.
	 * The returned array MUST NOT be changed.
	 *
	 * @type array
	 *
	 * @see viewMatrixInverse
	 * @see SpiderGL.Space.MatrixStack.inverse$
	 */
	get viewMatrixInverse$() {
		return this._v.inverse$;
	},

	/**
	 * Gets a copy of the inverse of the top matrix of the view stack.
	 *
	 * @type array
	 *
	 * @see viewMatrixInverse$
	 * @see SpiderGL.Space.MatrixStack.inverse
	 */
	get viewMatrixInverse() {
		return this._v.inverse;
	},

	/**
	 * Gets a reference to the transpose of the top matrix of the view stack.
	 * The returned array MUST NOT be changed.
	 *
	 * @type array
	 *
	 * @see viewMatrixTranspose
	 * @see SpiderGL.Space.MatrixStack.transpose$
	 */
	get viewMatrixTranspose$() {
		return this._v.transpose$;
	},

	/**
	 * Gets a copy of the transpose of the top matrix of the view stack.
	 *
	 * @type array
	 *
	 * @see viewMatrixTranspose$
	 * @see SpiderGL.Space.MatrixStack.transpose
	 */
	get viewMatrixTranspose() {
		return this._v.transpose;
	},

	/**
	 * Gets a reference to the transpose of the inverse of the top matrix of the view stack.
	 * The returned array MUST NOT be changed.
	 *
	 * @type array
	 *
	 * @see viewMatrixInverseTranspose
	 * @see SpiderGL.Space.MatrixStack.inverseTranspose$
	 */
	get viewMatrixInverseTranspose$() {
		return this._v.inverseTranspose$;
	},

	/**
	 * Gets a copy of the transpose of the inverse of the top matrix of the view stack.
	 *
	 * @type array
	 *
	 * @see viewMatrixInverseTranspose$
	 * @see SpiderGL.Space.MatrixStack.inverseTranspose
	 */
	get viewMatrixInverseTranspose() {
		return this._v.inverseTranspose;
	},

	/**
	 * Gets the projection stack.
	 *
	 * @type SpiderGL.Space.MatrixStack
	 *
	 * @see model
	 * @see view
	 */
	get projection() {
		return this._p;
	},

	/**
	 * Gets a reference to the top matrix of the projection stack.
	 * The returned array MUST NOT be changed.
	 *
	 * @type array
	 *
	 * @see projectionMatrix
	 * @see SpiderGL.Space.MatrixStack.matrix$
	 */
	get projectionMatrix$() {
		return this._p.matrix$;
	},

	/**
	 * Gets a copy of the top matrix of the projection stack.
	 *
	 * @type array
	 *
	 * @see projectionMatrix$
	 * @see SpiderGL.Space.MatrixStack.matrix
	 */
	get projectionMatrix() {
		return this._p.matrix;
	},

	/**
	 * Gets a reference to the inverse of the top matrix of the projection stack.
	 * The returned array MUST NOT be changed.
	 *
	 * @type array
	 *
	 * @see projectionMatrixInverse
	 * @see SpiderGL.Space.MatrixStack.inverse$
	 */
	get projectionMatrixInverse$() {
		return this._p.inverse$;
	},

	/**
	 * Gets a copy of the inverse of the top matrix of the projection stack.
	 *
	 * @type array
	 *
	 * @see projectionMatrixInverse$
	 * @see SpiderGL.Space.MatrixStack.inverse
	 */
	get projectionMatrixInverse() {
		return this._p.inverse;
	},

	/**
	 * Gets a reference to the transpose of the top matrix of the projection stack.
	 * The returned array MUST NOT be changed.
	 *
	 * @type array
	 *
	 * @see projectionMatrixTranspose
	 * @see SpiderGL.Space.MatrixStack.transpose$
	 */
	get projectionMatrixTranspose$() {
		return this._p.transpose$;
	},

	/**
	 * Gets a copy of the transpose of the top matrix of the projection stack.
	 *
	 * @type array
	 *
	 * @see projectionMatrixTranspose$
	 * @see SpiderGL.Space.MatrixStack.transpose
	 */
	get projectionMatrixTranspose() {
		return this._p.transpose;
	},

	/**
	 * Gets a reference to the transpose of the inverse of the top matrix of the projection stack.
	 * The returned array MUST NOT be changed.
	 *
	 * @type array
	 *
	 * @see projectionMatrixInverseTranspose
	 * @see SpiderGL.Space.MatrixStack.inverseTranspose$
	 */
	get projectionMatrixInverseTranspose$() {
		return this._p.inverseTranspose$;
	},

	/**
	 * Gets a copy of the transpose of the inverse of the top matrix of the projection stack.
	 *
	 * @type array
	 *
	 * @see projectionMatrixInverseTranspose$
	 * @see SpiderGL.Space.MatrixStack.inverseTranspose
	 */
	get projectionMatrixInverseTranspose() {
		return this._p.inverseTranspose;
	},

	/**
	 * Gets a reference to the matrix T = V * M, where V is the view matrix and M the model matrix.
	 * The returned array MUST NOT be changed.
	 *
	 * @type array
	 *
	 * @see modelViewMatrix
	 */
	get modelViewMatrix$() {
		return (this._mv.m || (this._mv.m = SpiderGL.Math.Mat4.mul(this.viewMatrix$, this.modelMatrix$)));
	},

	/**
	 * Gets a copy of the matrix T = V * M, where V is the view matrix and M the model matrix.
	 *
	 * @type array
	 *
	 * @see modelViewMatrix$
	 */
	get modelViewMatrix() {
		return SpiderGL.Math.Mat4.dup(this.modelViewMatrix$);
	},

	/**
	 * Gets a reference to the inverse of the matrix T = V * M, where V is the view matrix and M the model matrix.
	 * The returned array MUST NOT be changed.
	 *
	 * @type array
	 *
	 * @see modelViewMatrixInverse
	 */
	get modelViewMatrixInverse$() {
		return (this._mv.i || (this._mv.i = SpiderGL.Math.Mat4.mul(this.modelMatrixInverse$, this.viewMatrixInverse$)));
	},

	/**
	 * Gets a copy of the inverse of the matrix T = V * M, where V is the view matrix and M the model matrix.
	 *
	 * @type array
	 *
	 * @see modelViewMatrixInverse$
	 */
	get modelViewMatrixInverse() {
		return SpiderGL.Math.Mat4.dup(this.modelViewMatrixInverse$);
	},

	/**
	 * Gets a reference to the transpose of the matrix T = V * M, where V is the view matrix and M the model matrix.
	 * The returned array MUST NOT be changed.
	 *
	 * @type array
	 *
	 * @see modelViewMatrixTranspose
	 */
	get modelViewMatrixTranspose$() {
		return (this._mv.t || (this._mv.t = SpiderGL.Math.Mat4.transpose(this.modelViewMatrix$)));
	},

	/**
	 * Gets a copy of the transpose of the matrix T = V * M, where V is the view matrix and M the model matrix.
	 *
	 * @type array
	 *
	 * @see modelViewMatrixTranspose$
	 */
	get modelViewMatrixTranspose() {
		return SpiderGL.Math.Mat4.dup(this.modelViewMatrixTranspose$);
	},

	/**
	 * Gets a reference to the transpose of the inverse of the matrix T = V * M, where V is the view matrix and M the model matrix.
	 * The returned array MUST NOT be changed.
	 *
	 * @type array
	 *
	 * @see modelViewMatrixInverseTranspose
	 */
	get modelViewMatrixInverseTranspose$() {
		return (this._mv.it || (this._mv.it = SpiderGL.Math.Mat4.transpose(this.modelViewMatrixInverse$)));
	},

	/**
	 * Gets a copy of the transpose of the inverse of the matrix T = V * M, where V is the view matrix and M the model matrix.
	 *
	 * @type array
	 *
	 * @see modelViewMatrixInverseTranspose$
	 */
	get modelViewMatrixInverseTranspose() {
		return SpiderGL.Math.Mat4.dup(this.modelViewMatrixInverseTranspose$);
	},

	/**
	 * Gets a reference to the matrix T = P * V, where P is the projection matrix and V the view matrix.
	 * The returned array MUST NOT be changed.
	 *
	 * @type array
	 *
	 * @see viewProjectionMatrix
	 */
	get viewProjectionMatrix$() {
		return (this._vp.m || (this._vp.m = SpiderGL.Math.Mat4.mul(this.projectionMatrix$, this.viewMatrix$)));
	},

	/**
	 * Gets a copy of the matrix T = P * V, where P is the projection matrix and V the view matrix.
	 *
	 * @type array
	 *
	 * @see viewProjectionMatrix$
	 */
	get viewProjectionMatrix() {
		return SpiderGL.Math.Mat4.dup(this.viewProjectionMatrix$);
	},

	/**
	 * Gets a reference to the inverse of the matrix T = P * V, where P is the projection matrix and V the view matrix.
	 * The returned array MUST NOT be changed.
	 *
	 * @type array
	 *
	 * @see viewProjectionMatrixInverse
	 */
	get viewProjectionMatrixInverse$() {
		return (this._vp.i || (this._vp.i = SpiderGL.Math.Mat4.mul(this.viewMatrixInverse$, this.projectionMatrixInverse$)));
	},

	/**
	 * Gets a copy of the inverse of the matrix T = P * V, where P is the projection matrix and V the view matrix.
	 *
	 * @type array
	 *
	 * @see viewProjectionMatrixInverse$
	 */
	get viewProjectionMatrixInverse() {
		return SpiderGL.Math.Mat4.dup(this.viewProjectionMatrixInverse$);
	},

	/**
	 * Gets a reference to the transpose of the matrix T = P * V, where P is the projection matrix and V the view matrix.
	 * The returned array MUST NOT be changed.
	 *
	 * @type array
	 *
	 * @see viewProjectionMatrixTranspose
	 */
	get viewProjectionMatrixTranspose$() {
		return (this._vp.t || (this._vp.t = SpiderGL.Math.Mat4.transpose(this.viewProjectionMatrix$)));
	},

	/**
	 * Gets a copy of the transpose of the matrix T = P * V, where P is the projection matrix and V the view matrix.
	 *
	 * @type array
	 *
	 * @see viewProjectionMatrixTranspose$
	 */
	get viewProjectionMatrixTranspose() {
		return SpiderGL.Math.Mat4.dup(this.viewProjectionMatrixTranspose$);
	},

	/**
	 * Gets a reference to the transpose of the inverse of the matrix T = P * V, where P is the projection matrix and V the view matrix.
	 * The returned array MUST NOT be changed.
	 *
	 * @type array
	 *
	 * @see viewProjectionMatrixInverseTranspose
	 */
	get viewProjectionMatrixInverseTranspose$() {
		return (this._vp.it || (this._vp.it = SpiderGL.Math.Mat4.transpose(this.viewProjectionMatrixInverse$)));
	},

	/**
	 * Gets a copy of the transpose of the inverse of the matrix T = P * V, where P is the projection matrix and V the view matrix.
	 *
	 * @type array
	 *
	 * @see viewProjectionMatrixInverseTranspose$
	 */
	get viewProjectionMatrixInverseTranspose() {
		return SpiderGL.Math.Mat4.dup(this.viewProjectionMatrixInverseTranspose$);
	},

	/**
	 * Gets a reference to the matrix T = P * V * M, where P is the projection matrix, V the view matrix and M the model matrix.
	 * The returned array MUST NOT be changed.
	 *
	 * @type array
	 *
	 * @see modelViewProjectionMatrix
	 */
	get modelViewProjectionMatrix$() {
		return (this._mvp.m || (this._mvp.m = SpiderGL.Math.Mat4.mul(this.viewProjectionMatrix$, this.modelMatrix$)));
	},

	/**
	 * Gets a copy of the matrix T = P * V * M, where P is the projection matrix, V the view matrix and M the model matrix.
	 *
	 * @type array
	 *
	 * @see modelViewProjectionMatrix$
	 */
	get modelViewProjectionMatrix() {
		return SpiderGL.Math.Mat4.dup(this.modelViewProjectionMatrix$);
	},

	/**
	 * Gets a reference to the inverse of the matrix T = P * V * M, where P is the projection matrix, V the view matrix and M the model matrix.
	 * The returned array MUST NOT be changed.
	 *
	 * @type array
	 *
	 * @see modelViewProjectionMatrix
	 */
	get modelViewProjectionMatrixInverse$() {
		return (this._mvp.i || (this._mvp.i = SpiderGL.Math.Mat4.inverse(this.modelViewProjectionMatrix$)));
	},

	/**
	 * Gets a copy of the inverse of the matrix T = P * V * M, where P is the projection matrix, V the view matrix and M the model matrix.
	 *
	 * @type array
	 *
	 * @see modelViewProjectionMatrix$
	 */
	get modelViewProjectionMatrixInverse() {
		return SpiderGL.Math.Mat4.dup(this.modelViewProjectionMatrixInverse$);
	},

	/**
	 * Gets a reference to the transpose of the matrix T = P * V * M, where P is the projection matrix, V the view matrix and M the model matrix.
	 * The returned array MUST NOT be changed.
	 *
	 * @type array
	 *
	 * @see modelViewProjectionMatrixTranspose
	 */
	get modelViewProjectionMatrixTranspose$() {
		return (this._mvp.t || (this._mvp.t = SpiderGL.Math.Mat4.transpose(this.modelViewProjectionMatrix$)));
	},

	/**
	 * Gets a copy of the transpose of the matrix T = P * V * M, where P is the projection matrix, V the view matrix and M the model matrix.
	 *
	 * @type array
	 *
	 * @see modelViewProjectionMatrixTranspose$
	 */
	get modelViewProjectionMatrixTranspose() {
		return SpiderGL.Math.Mat4.dup(this.modelViewProjectionMatrixTranspose$);
	},

	/**
	 * Gets a reference to the transpose of the inverse of the matrix T = P * V * M, where P is the projection matrix, V the view matrix and M the model matrix.
	 * The returned array MUST NOT be changed.
	 *
	 * @type array
	 *
	 * @see modelViewProjectionMatrixInverseTranspose
	 */
	get modelViewProjectionMatrixInverseTranspose$() {
		return (this._mvp.it || (this._mvp.it = SpiderGL.Math.Mat4.transpose(this.modelViewProjectionMatrixInverse$)));
	},

	/**
	 * Gets a copy of the transpose of the inverse of the matrix T = P * V * M, where P is the projection matrix, V the view matrix and M the model matrix.
	 *
	 * @type array
	 *
	 * @see modelViewProjectionMatrixInverseTranspose$
	 */
	get modelViewProjectionMatrixInverseTranspose() {
		return SpiderGL.Math.Mat4.dup(this.modelViewProjectionMatrixInverseTranspose$);
	},

	/**
	 * Gets a reference to the transpose of the inverse of the upper-left 3x3 matrix of the model matrix.
	 * The returned array MUST NOT be changed.
	 *
	 * @type array
	 *
	 * @see worldSpaceNormalMatrix
	 * @see viewSpaceNormalMatrix$
	 */
	get worldSpaceNormalMatrix$() {
		return (this._n.m || (this._n.m = SpiderGL.Math.Mat4.inverseTranspose33(this.modelMatrix$)));
	},

	/**
	 * Gets a copy of the transpose of the inverse of the upper-left 3x3 matrix of the model matrix.
	 *
	 * @type array
	 *
	 * @see worldSpaceNormalMatrix$
	 * @see viewSpaceNormalMatrix
	 */
	get worldSpaceNormalMatrix() {
		return SpiderGL.Math.Mat4.dup(this.worldSpaceNormalMatrix$);
	},

	/**
	 * Gets a reference to the transpose of the inverse of the upper-left 3x3 matrix of the model-view matrix.
	 * The returned array MUST NOT be changed.
	 *
	 * @type array
	 *
	 * @see viewSpaceNormalMatrix
	 * @see worldSpaceNormalMatrix$
	 */
	get viewSpaceNormalMatrix$() {
		return (this._n.v || (this._n.v = SpiderGL.Math.Mat4.inverseTranspose33(this.modelViewMatrix$)));
	},

	/**
	 * Gets a copy of the transpose of the inverse of the upper-left 3x3 matrix of the model matrix.
	 *
	 * @type array
	 *
	 * @see viewSpaceNormalMatrix$
	 * @see worldSpaceNormalMatrix
	 */
	get viewSpaceNormalMatrix() {
		return SpiderGL.Math.Mat4.dup(this.viewSpaceNormalMatrix$);
	},

	/**
	 * Gets a reference to the 3-dimensional vector representing the 4th column of the inverse of the model-view matrix.
	 * The returned array MUST NOT be changed.
	 *
	 * @type array
	 *
	 * @see modelSpaceViewerPosition
	 * @see modelSpaceViewDirection$
	 * @see worldSpaceViewerPosition$
	 */
	get modelSpaceViewerPosition$() {
		return (this._c.mp || (this._c.mp = SpiderGL.Math.Vec4.to3(SpiderGL.Math.Mat4.col(this.modelViewMatrixInverse$, 3))));
	},

	/**
	 * Gets a copy of the 3-dimensional vector representing the 4th column of the inverse of the model-view matrix.
	 *
	 * @type array
	 *
	 * @see modelSpaceViewerPosition$
	 * @see modelSpaceViewDirection$
	 * @see worldSpaceViewerPosition
	 */
	get modelSpaceViewerPosition() {
		return SpiderGL.Math.Vec3.dup(this.modelSpaceViewerPosition$);
	},

	/**
	 * Gets a reference to the 3-dimensional vector representing the 4th column of the inverse of the view matrix.
	 * The returned array MUST NOT be changed.
	 *
	 * @type array
	 *
	 * @see worldSpaceViewerPosition
	 * @see worldSpaceViewDirection$
	 * @see modelSpaceViewerPosition$
	 */
	get worldSpaceViewerPosition$() {
		return (this._c.wp || (this._c.wp = SpiderGL.Math.Vec4.to3(SpiderGL.Math.Mat4.col(this.viewMatrixInverse$, 3))));
	},

	/**
	 * Gets a copy of the 3-dimensional vector representing the 4th column of the inverse of the model-view matrix.
	 *
	 * @type array
	 *
	 * @see worldSpaceViewerPosition$
	 * @see worldSpaceViewDirection
	 * @see modelSpaceViewerPosition
	 */
	get worldSpaceViewerPosition() {
		return SpiderGL.Math.Vec3.dup(this.worldSpaceViewerPosition$);
	},

	/**
	 * Gets a reference to the 3-dimensional vector representing the negated 3rd row of the inverse of the model-view matrix.
	 * The returned array MUST NOT be changed.
	 *
	 * @type array
	 *
	 * @see modelSpaceViewDirection
	 * @see modelSpaceViewerPosition$
	 * @see worldSpaceViewDirection$
	 */
	get modelSpaceViewDirection$() {
		return (this._c.md || (this._c.md = SpiderGL.Math.Vec3.normalize$(SpiderGL.Math.Vec3.neg$(SpiderGL.Math.Vec4.to3(SpiderGL.Math.Mat4.row(this.modelViewMatrixInverse$, 2))))));
	},

	/**
	 * Gets a copy of the 3-dimensional vector representing the negated 3rd row of the inverse of the model-view matrix.
	 *
	 * @type array
	 *
	 * @see modelSpaceViewDirection$
	 * @see modelSpaceViewerPosition
	 * @see worldSpaceViewDirection
	 */
	get modelSpaceViewDirection() {
		return SpiderGL.Math.Vec3.dup(this.modelSpaceViewDirection$);
	},

	/**
	 * Gets a reference to the 3-dimensional vector representing the negated 3rd row of the inverse of the view matrix.
	 * The returned array MUST NOT be changed.
	 *
	 * @type array
	 *
	 * @see worldSpaceViewDirection
	 * @see worldSpaceViewerPosition$
	 * @see modelSpaceViewDirection$
	 */
	get worldSpaceViewDirection$() {
		return (this._c.wd || (this._c.wd = SpiderGL.Math.Vec3.normalize$(SpiderGL.Math.Vec3.neg$(SpiderGL.Math.Vec4.to3(SpiderGL.Math.Mat4.row(this.viewMatrixInverse$, 2))))));
	},

	/**
	 * Gets a reference to the 3-dimensional vector representing the negated 3rd row of the inverse of the model-view matrix.
	 *
	 * @type array
	 *
	 * @see worldSpaceViewDirection$
	 * @see worldSpaceViewerPosition
	 * @see modelSpaceViewDirection
	 */
	get worldSpaceViewDirection() {
		return SpiderGL.Math.Vec3.dup(this.worldSpaceViewDirection$);
	},

	project : function(xyzw) {
		return SpiderGL.Math.project(xyzw, this.modelViewProjectionMatrix$, this.viewportRect$, this.depthRange$);
	},

	unproject : function(xyz) {
		return SpiderGL.Math.unproject(xyz, this.modelViewProjectionMatrixInverse$, this.viewportRect$, this.depthRange$);
	}
};

SpiderGL.Type.extend(SpiderGL.Space.TransformationStack, SpiderGL.Core.ObjectBase);

/*
SpiderGL Computer Graphics Library
Copyright (c) 2010, Marco Di Benedetto - Visual Computing Lab, ISTI - CNR
All rights reserved.

Redistribution and use in source and binary forms, with or without
modification, are permitted provided that the following conditions are met:
    * Redistributions of source code must retain the above copyright
      notice, this list of conditions and the following disclaimer.
    * Redistributions in binary form must reproduce the above copyright
      notice, this list of conditions and the following disclaimer in the
      documentation and/or other materials provided with the distribution.
    * Neither the name of SpiderGL nor the
      names of its contributors may be used to endorse or promote products
      derived from this software without specific prior written permission.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
DISCLAIMED. IN NO EVENT SHALL PAUL BRUNT BE LIABLE FOR ANY
DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
(INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
(INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
*/

/**
 * @fileOverview WebGL
 */

/**
 * The SpiderGL.WebGL namespace.
 *
 * @namespace The SpiderGL.WebGL namespace.
 * 
 * The SpiderGL.WebGL namespace gives access to WebGL functionalities in terms of context creation and enhancement, and object wrappers.
 * The main purpose of the module is to provide a robust and intuitive way of dealing with all native WebGL objects (e.g., textures, framebuffers, etc.).
 * Each specialized wrapper handles creation/destruction, edit operations (i.e. parameter settings), and binding of the underlying native WebGL object (the GL handle).
 * To allow low level access and integration with existing code, the native handle is exposed. On the other side, wrappers can be created for already existing native objects,
 * ensuring that the same wrapper will be used for multiple wraps of the same object.
 * To create a robust interoperability between wrapper usage and native WebGL calls on handles, wrappers must be informed whenever any single native call operates on the wrapped handle.
 * SpiderGL handles this task by hijacking the WebGLRenderingContext object, and installing on it a set of extensions that use callback mechanisms to report changes to wrappers.
 * Moreover, to overcome the bind-to-edit/bind-to-use paradigm typical of the OpenGL API family, SpiderGL injects an extension that is insired by GL_EXT_direct_state_access extension.
 */
SpiderGL.WebGL = { };

/**
 * The SpiderGL.WebGL.Context namespace.
 *
 * @namespace The SpiderGL.WebGL.Context namespace.
 */
SpiderGL.WebGL.Context = { };

/**
 * The string for obtaining a WebGLRenderingContext from a canvas.
 *
 * @constant
 *
 * @see SpiderGL.WebGL.Context.get
 */
SpiderGL.WebGL.Context.WEBGL_STRING = "experimental-webgl";

/**
 * Default value for pixel unpack parameter WebGLRenderingContext.UNPACK_FLIP_Y_WEBGL.
 *
 * @default true
 *
 * @see SpiderGL.WebGL.Context.DEFAULT_UNPACK_PREMULTIPLY_ALPHA
 * @see SpiderGL.WebGL.Context.DEFAULT_UNPACK_COLORSPACE_CONVERSION
 * @see SpiderGL.WebGL.Context.setStandardGLUnpack
 */
SpiderGL.WebGL.Context.DEFAULT_UNPACK_FLIP_Y = true;

/**
 * Default value for pixel unpack parameter WebGLRenderingContext.UNPACK_PREMULTIPLY_ALPHA_WEBGL.
 *
 * @default true
 *
 * @see SpiderGL.WebGL.Context.DEFAULT_UNPACK_FLIP_Y
 * @see SpiderGL.WebGL.Context.DEFAULT_UNPACK_COLORSPACE_CONVERSION
 * @see SpiderGL.WebGL.Context.setStandardGLUnpack
 */
SpiderGL.WebGL.Context.DEFAULT_UNPACK_PREMULTIPLY_ALPHA = false;

/**
 * Default value for pixel unpack parameter WebGLRenderingContext.UNPACK_COLORSPACE_CONVERSION_WEBGL.
 *
 * @default WebGLRenderingContext.NONE
 *
 * @see SpiderGL.WebGL.Context.DEFAULT_UNPACK_FLIP_Y
 * @see SpiderGL.WebGL.Context.DEFAULT_UNPACK_PREMULTIPLY_ALPHA
 * @see SpiderGL.WebGL.Context.setStandardGLUnpack
 */
SpiderGL.WebGL.Context.DEFAULT_UNPACK_COLORSPACE_CONVERSION = WebGLRenderingContext.NONE;

/**
 * Retrieves the WebGLRenderingContext from a canvas.
 *
 * The WebGLRenderingContext is obtained by calling the getContext() method of the canvas object.
 *
 * @param {HTMLCanvasElement} canvas The HTMLCanvasElement from which retrieve the WebGL context.
 * @param {object} args The optional WebGL context arguments.
 *
 * @returns {WebGLRenderingContext} The canvas WebGL rendering context.
 *
 * @see SpiderGL.WebGL.Context.hijack
 * @see SpiderGL.WebGL.Context.getHijacked
 */
SpiderGL.WebGL.Context.get = function (canvas, args) {
	var c = canvas;
	if (SpiderGL.Type.isString(c)) { c = SpiderGL.DOM.getElementById(c); }
	if (!SpiderGL.Type.instanceOf(c, HTMLCanvasElement)) { return null; }
	var ctx = c.getContext(SpiderGL.WebGL.Context.WEBGL_STRING, args);
	return ctx;
}

SpiderGL.WebGL.Context._prepareContex = function (gl) {
	if (!gl) return;

	var sgl = gl._spidergl;
	if (sgl) return;

	sgl = { };
	gl._spidergl = sgl;
	sgl.TAG = 0;
	sgl.gl = gl;

	var glFunctions = { };
	sgl.glFunctions = glFunctions;
	for (var f in gl) {
		var fn = gl[fn];
		if (typeof fn == "function") {
			glFunctions[f] = fn;
		}
	}
};

SpiderGL.WebGL.Context._addExtension = function (gl, extName, propName, setupFunc) {
	if (!gl) return;

	var getExtension = gl.getExtension;
	gl.getExtension = function (name) {
		if (name == extName) {
			var sgl = this._spidergl;
			if (!sgl) return null;
			var pubExt = sgl[propName];
			if (!pubExt) {
				pubExt = { };

				pubExt.TAG = 0;

				var ext = { };
				pubExt._ext = ext;

				ext[propName] = pubExt;
				ext.sgl = sgl;
				ext.gl  = gl;

				var glFunctions = { };
				ext.glFunctions = glFunctions;

				if (!setupFunc(gl, pubExt)) return null;

				sgl[propName] = pubExt;
			}
			return pubExt;
		}
		return getExtension.call(this, name);
	};
};

SpiderGL.WebGL.Context._setup_SGL_current_binding = function (gl, pubExt) {
	if (!gl) return false;
	if (!pubExt) return false;
	if (!gl._spidergl) return false;
	if (gl._spidergl.cb) return false;

	var cb = pubExt;
	var ext = cb._ext;
	var glFunctions = ext.glFunctions;



	// buffer
	//////////////////////////////////////////////////////////////////////////////////////////
	ext.currentBuffer = { };
	ext.currentBuffer[gl.ARRAY_BUFFER        ] = gl.getParameter(gl.ARRAY_BUFFER_BINDING);
	ext.currentBuffer[gl.ELEMENT_ARRAY_BUFFER] = gl.getParameter(gl.ELEMENT_ARRAY_BUFFER_BINDING);

	ext.bufferStack = { };
	ext.bufferStack[gl.ARRAY_BUFFER        ] = [ ];
	ext.bufferStack[gl.ELEMENT_ARRAY_BUFFER] = [ ];

	glFunctions.bindBuffer = gl.bindBuffer;
	gl.bindBuffer = function (target, buffer) {
		var ext = this._spidergl.cb._ext;
		var current = ext.currentBuffer[target];
		if (current == buffer) return;
		ext.currentBuffer[target] = buffer;
		ext.glFunctions.bindBuffer.call(this, target, buffer);
	};

	cb.getCurrentBuffer = function (target) {
		return this._ext.currentBuffer[target];
	};

	cb.pushBuffer = function (target) {
		var ext = this._ext;
		var stack  = ext.bufferStack[target];
		var buffer = ext.currentBuffer[target];
		stack.push(buffer);
	};

	cb.popBuffer = function (target) {
		var ext = this._ext;
		var stack = ext.bufferStack[target];
		if (stack.length <= 0) return;
		var buffer = stack.pop();
		ext.gl.bindBuffer(target, buffer);
	};
	//////////////////////////////////////////////////////////////////////////////////////////



	// framebuffer
	//////////////////////////////////////////////////////////////////////////////////////////
	ext.currentFramebuffer = { };
	ext.currentFramebuffer[gl.FRAMEBUFFER] = gl.getParameter(gl.FRAMEBUFFER_BINDING);

	ext.framebufferStack = { };
	ext.framebufferStack[gl.FRAMEBUFFER] = [ ];

	glFunctions.bindFramebuffer = gl.bindFramebuffer;
	gl.bindFramebuffer = function (target, framebuffer) {
		var ext = this._spidergl.cb._ext;
		var current = ext.currentFramebuffer[target];
		if (current == framebuffer) return;
		ext.currentFramebuffer[target] = framebuffer;
		ext.glFunctions.bindFramebuffer.call(this, target, framebuffer);
	};

	cb.getCurrentFramebuffer = function (target) {
		return this._ext.currentFramebuffer[target];
	};

	cb.pushFramebuffer = function (target) {
		var ext = this._ext;
		var stack  = ext.framebufferStack[target];
		var framebuffer = ext.currentFramebuffer[target];
		stack.push(framebuffer);
	};

	cb.popFramebuffer = function (target) {
		var ext = this._ext;
		var stack = ext.framebufferStack[target];
		if (stack.length <= 0) return;
		var framebuffer = stack.pop();
		ext.gl.bindFramebuffer(target, framebuffer);
	};
	//////////////////////////////////////////////////////////////////////////////////////////



	// program
	//////////////////////////////////////////////////////////////////////////////////////////
	ext.currentProgram = gl.getParameter(gl.CURRENT_PROGRAM);

	ext.programStack = [ ];

	glFunctions.useProgram = gl.useProgram;
	gl.useProgram = function (program) {
		var ext = this._spidergl.cb._ext;
		var current = ext.currentProgram;
		if (current == program) return;
		ext.currentProgram = program;
		ext.glFunctions.useProgram.call(this, program);
	};

	cb.getCurrentProgram = function () {
		return this._ext.currentProgram;
	};

	cb.pushProgram = function () {
		var ext = this._ext;
		var stack = ext.programStack;
		var program = ext.currentProgram;
		stack.push(program);
	};

	cb.popProgram = function () {
		var ext = this._ext;
		var stack = ext.programStack;
		if (stack.length <= 0) return;
		var program = stack.pop();
		ext.gl.useProgram(program);
	};
	//////////////////////////////////////////////////////////////////////////////////////////



	// renderbuffer
	//////////////////////////////////////////////////////////////////////////////////////////
	ext.currentRenderbuffer = { };
	ext.currentRenderbuffer[gl.RENDERBUFFER] = gl.getParameter(gl.RENDERBUFFER_BINDING);

	ext.renderbufferStack = { };
	ext.renderbufferStack[gl.RENDERBUFFER] = [ ];

	glFunctions.bindRenderbuffer = gl.bindRenderbuffer;
	gl.bindRenderbuffer = function (target, renderbuffer) {
		var ext = this._spidergl.cb._ext;
		var current = ext.currentRenderbuffer[target];
		if (current == renderbuffer) return;
		ext.currentRenderbuffer[target] = renderbuffer;
		ext.glFunctions.bindRenderbuffer.call(this, target, renderbuffer);
	};

	cb.getCurrentRenderbuffer = function (target) {
		return this._ext.currentRenderbuffer[target];
	};

	cb.pushRenderbuffer = function (target) {
		var ext = this._ext;
		var stack  = ext.renderbufferStack[target];
		var renderbuffer = ext.currentRenderbuffer[target];
		stack.push(renderbuffer);
	};

	cb.popRenderbuffer = function (target) {
		var ext = this._ext;
		var stack = ext.renderbufferStack[target];
		if (stack.length <= 0) return;
		var renderbuffer = stack.pop();
		ext.gl.bindRenderbuffer(target, renderbuffer);
	};
	//////////////////////////////////////////////////////////////////////////////////////////



	// shader
	//////////////////////////////////////////////////////////////////////////////////////////
	ext.currentShader = { };
	ext.currentShader[gl.VERTEX_SHADER  ] = null;
	ext.currentShader[gl.FRAGMENT_SHADER] = null;

	ext.shaderStack = { };
	ext.shaderStack[gl.VERTEX_SHADER  ] = [ ];
	ext.shaderStack[gl.FRAGMENT_SHADER] = [ ];

	ext.glFunctions.bindShader = function (target, shader) { };
	cb.bindShader = function (target, shader) {
		var ext = this._ext;
		var current = ext.currentShader[target];
		if (current == shader) return;
		ext.currentShader[target] = shader;
		ext.glFunctions.bindShader.call(ext.gl, target, shader);
	};

	cb.getCurrentShader = function (target) {
		return this._ext.currentShader[target];
	};

	cb.pushShader = function (target) {
		var ext = this._ext;
		var stack  = ext.shaderStack[target];
		var shader = ext.currentShader[target];
		stack.push(shader);
	};

	cb.popShader = function (target) {
		var ext = this._ext;
		var stack = ext.shaderStack[target];
		if (stack.length <= 0) return;
		var shader = stack.pop();
		ext.gl.bindShader(target, shader);
	};
	//////////////////////////////////////////////////////////////////////////////////////////



	// texture
	//////////////////////////////////////////////////////////////////////////////////////////
	ext.currentTexture = { };

	var currentTextureUnit = gl.getParameter(gl.ACTIVE_TEXTURE);
	var textureUnitsCount  = gl.getParameter(gl.MAX_TEXTURE_IMAGE_UNITS);
	ext.currentTexture = { };
	ext.textureStack = { };
	ext.textureUnitStack = [ ];
	for (var i=0; i<textureUnitsCount; ++i) {
		var textureUnit = gl.TEXTURE0 + i;
		gl.activeTexture(textureUnit);

		var textureBindings = { }
		textureBindings[gl.TEXTURE_2D      ] = gl.getParameter(gl.TEXTURE_BINDING_2D);
		textureBindings[gl.TEXTURE_CUBE_MAP] = gl.getParameter(gl.TEXTURE_BINDING_CUBE_MAP);
		ext.currentTexture[textureUnit] = textureBindings;

		var textureStacks = { }
		textureStacks[gl.TEXTURE_2D      ] = [ ];
		textureStacks[gl.TEXTURE_CUBE_MAP] = [ ];
		ext.textureStack[textureUnit] = textureStacks;
	}
	gl.activeTexture(currentTextureUnit);
	ext.currentTextureUnit = currentTextureUnit;

	glFunctions.activeTexture = gl.activeTexture;
	gl.activeTexture = function (texture) {
		var ext = this._spidergl.cb._ext;
		var current = ext.currentTextureUnit;
		if (current == texture) return;
		ext.currentTextureUnit = texture;
		ext.glFunctions.activeTexture.call(this, texture);
	};

	cb.getCurrentTextureUnit = function () {
		return this._ext.currentTextureUnit;
	};

	cb.pushTextureUnit = function () {
		var ext = this._ext;
		var stack  = ext.textureUnitStack;
		var unit = ext.currentTextureUnit;
		stack.push(unit);
	};

	cb.popTextureUnit = function () {
		var ext = this._ext;
		var stack  = ext.textureUnitStack;
		if (stack.length <= 0) return;
		var unit = stack.pop();
		ext.gl.activeTexture(unit);
	};

	glFunctions.bindTexture = gl.bindTexture;
	gl.bindTexture = function (target, texture) {
		var ext = this._spidergl.cb._ext;
		var unit = ext.currentTextureUnit;
		var current = ext.currentTexture[unit][target];
		if (current == texture) return;
		ext.currentTexture[unit][target] = texture;
		ext.glFunctions.bindTexture.call(this, target, texture);
	};

	cb.getCurrentTexture = function (target) {
		var ext = this._ext;
		var unit = ext.currentTextureUnit;
		return ext.currentTexture[unit][target];
	};

	cb.pushTexture = function (target) {
		var ext = this._ext;
		var unit = ext.currentTextureUnit;
		var stack  = ext.textureStack[unit][target];
		var texture = ext.currentTexture[unit][target];
		stack.push(texture);
	};

	cb.popTexture = function (target) {
		var ext = this._ext;
		var unit = ext.currentTextureUnit;
		var stack  = ext.textureStack[unit][target];
		if (stack.length <= 0) return;
		var texture = stack.pop();
		ext.gl.bindTexture(target, texture);
	};
	//////////////////////////////////////////////////////////////////////////////////////////

	return true;
};

SpiderGL.WebGL.Context._setup_SGL_wrapper_notify = function (gl, pubExt) {
	if (!gl) return false;
	if (!pubExt) return false;
	if (!gl._spidergl) return false;
	if (gl._spidergl.wn) return false;

	var wn = pubExt;
	var ext = wn._ext;
	var glFunctions = ext.glFunctions;

	ext.cb = gl.getExtension("SGL_current_binding");
	if (!ext.cb) return false;



	// buffer
	//////////////////////////////////////////////////////////////////////////////////////////
	glFunctions.deleteBuffer = gl.deleteBuffer;
	gl.deleteBuffer = function (buffer) {
		var ext = this._spidergl.wn._ext;
		ext.glFunctions.deleteBuffer.apply(this, arguments);
		var current = buffer;
		(current && current._spidergl && current._spidergl._gl_deleteBuffer.apply(current._spidergl, arguments));
	};

	glFunctions.isBuffer = gl.isBuffer;
	gl.isBuffer = function (buffer) {
		var ext = this._spidergl.wn._ext;
		var r = ext.glFunctions.isBuffer.apply(this, arguments);
		var current = buffer;
		(current && current._spidergl && current._spidergl._gl_isBuffer.apply(current._spidergl, arguments));
		return r;
	};

	glFunctions.bindBuffer = gl.bindBuffer;
	gl.bindBuffer = function (target) {
		var ext = this._spidergl.wn._ext;
		ext.glFunctions.bindBuffer.apply(this, arguments);
		var current = ext.cb.getCurrentBuffer(target);
		(current && current._spidergl && current._spidergl._gl_bindBuffer.apply(current._spidergl, arguments));
	};

	glFunctions.getBufferParameter = gl.getBufferParameter;
	gl.getBufferParameter = function (target) {
		var ext = this._spidergl.wn._ext;
		var r = ext.glFunctions.getBufferParameter.apply(this, arguments);
		var current = ext.cb.getCurrentBuffer(target);
		(current && current._spidergl && current._spidergl._gl_getBufferParameter.apply(current._spidergl, arguments));
		return r;
	};

	glFunctions.bufferData = gl.bufferData;
	gl.bufferData = function (target) {
		var ext = this._spidergl.wn._ext;
		ext.glFunctions.bufferData.apply(this, arguments);
		var current = ext.cb.getCurrentBuffer(target);
		(current && current._spidergl && current._spidergl._gl_bufferData.apply(current._spidergl, arguments));
	}

	glFunctions.bufferSubData = gl.bufferSubData;
	gl.bufferSubData = function (target) {
		var ext = this._spidergl.wn._ext;
		ext.glFunctions.bufferSubData.apply(this, arguments);
		var current = ext.cb.getCurrentBuffer(target);
		(current && current._spidergl && current._spidergl._gl_bufferSubData.apply(current._spidergl, arguments));
	}

	glFunctions.vertexAttribPointer = gl.vertexAttribPointer;
	gl.vertexAttribPointer = function () {
		var ext = this._spidergl.wn._ext;
		ext.glFunctions.vertexAttribPointer.apply(this, arguments);
		var target  = this.ARRAY_BUFFER;
		var current = ext.cb.getCurrentBuffer(target);
		(current && current._spidergl && current._spidergl._gl_vertexAttribPointer.apply(current._spidergl, arguments));
	};

	glFunctions.drawElements = gl.drawElements;
	gl.drawElements = function (buffer, mode, count, type, offset) {
		var ext = this._spidergl.wn._ext;
		ext.glFunctions.drawElements.apply(this, arguments);
		var target  = this.ELEMENT_ARRAY_BUFFER;
		var current = ext.cb.getCurrentBuffer(target);
		(current && current._spidergl && current._spidergl._gl_drawElements.apply(current._spidergl, arguments));
	};
	//////////////////////////////////////////////////////////////////////////////////////////



	// framebuffer
	//////////////////////////////////////////////////////////////////////////////////////////
	glFunctions.deleteFramebuffer = gl.deleteFramebuffer;
	gl.deleteFramebuffer = function (framebuffer) {
		var ext = this._spidergl.wn._ext;
		ext.glFunctions.deleteFramebuffer.apply(this, arguments);
		var current = framebuffer;
		(current && current._spidergl && current._spidergl._gl_deleteFramebuffer.apply(current._spidergl, arguments));
	};

	glFunctions.isFramebuffer = gl.isFramebuffer;
	gl.isFramebuffer = function (framebuffer) {
		var ext = this._spidergl.wn._ext;
		var r = ext.glFunctions.isFramebuffer.apply(this, arguments);
		var current = framebuffer;
		(current && current._spidergl && current._spidergl._gl_isFramebuffer.apply(current._spidergl, arguments));
		return r;
	};

	glFunctions.bindFramebuffer = gl.bindFramebuffer;
	gl.bindFramebuffer = function (target) {
		var ext = this._spidergl.wn._ext;
		ext.glFunctions.bindFramebuffer.apply(this, arguments);
		var current = ext.cb.getCurrentFramebuffer(target);
		(current && current._spidergl && current._spidergl._gl_bindFramebuffer.apply(current._spidergl, arguments));
	};

	glFunctions.checkFramebufferStatus = gl.checkFramebufferStatus;
	gl.checkFramebufferStatus = function (target) {
		var ext = this._spidergl.wn._ext;
		var r = ext.glFunctions.checkFramebufferStatus.apply(this, arguments);
		var current = ext.cb.getCurrentFramebuffer(target);
		(current && current._spidergl && current._spidergl._gl_checkFramebufferStatus.apply(current._spidergl, arguments));
		return r;
	};

	glFunctions.getFramebufferAttachmentParameter = gl.getFramebufferAttachmentParameter;
	gl.getFramebufferAttachmentParameter = function (target) {
		var ext = this._spidergl.wn._ext;
		var r = ext.glFunctions.getFramebufferAttachmentParameter.apply(this, arguments);
		var current = ext.cb.getCurrentFramebuffer(target);
		(current && current._spidergl && current._spidergl._gl_getFramebufferAttachmentParameter.apply(current._spidergl, arguments));
		return r;
	};

	glFunctions.framebufferRenderbuffer = gl.framebufferRenderbuffer;
	gl.framebufferRenderbuffer = function (target) {
		var ext = this._spidergl.wn._ext;
		ext.glFunctions.framebufferRenderbuffer.apply(this, arguments);
		var current = ext.cb.getCurrentFramebuffer(target);
		(current && current._spidergl && current._spidergl._gl_framebufferRenderbuffer.apply(current._spidergl, arguments));
	}

	glFunctions.framebufferTexture2D = gl.framebufferTexture2D;
	gl.framebufferTexture2D = function (target) {
		var ext = this._spidergl.wn._ext;
		ext.glFunctions.framebufferTexture2D.apply(this, arguments);
		var current = ext.cb.getCurrentFramebuffer(target);
		(current && current._spidergl && current._spidergl._gl_framebufferTexture2D.apply(current._spidergl, arguments));
	};

	glFunctions.clear = gl.clear;
	gl.clear = function () {
		var ext = this._spidergl.wn._ext;
		ext.glFunctions.clear.apply(this, arguments);
		var target = this.FRAMEBUFFER;
		var current = ext.cb.getCurrentFramebuffer(target);
		(current && current._spidergl && current._spidergl._gl_clear.apply(current._spidergl, arguments));
	};

	glFunctions.readPixels = gl.readPixels;
	gl.readPixels = function () {
		var ext = this._spidergl.wn._ext;
		ext.glFunctions.readPixels.apply(this, arguments);
		var target = this.FRAMEBUFFER;
		var current = ext.cb.getCurrentFramebuffer(target);
		(current && current._spidergl && current._spidergl._gl_readPixels.apply(current._spidergl, arguments));
	};
	//////////////////////////////////////////////////////////////////////////////////////////



	// program
	//////////////////////////////////////////////////////////////////////////////////////////
	glFunctions.deleteProgram = gl.deleteProgram;
	gl.deleteProgram = function (program) {
		var ext = this._spidergl.wn._ext;
		ext.glFunctions.deleteProgram.apply(this, arguments);
		var current = program;
		(current && current._spidergl && current._spidergl._gl_deleteProgram.apply(current._spidergl, arguments));
	};

	glFunctions.isProgram = gl.isProgram;
	gl.isProgram = function (program) {
		var ext = this._spidergl.wn._ext;
		var r = ext.glFunctions.isProgram.apply(this, arguments);
		var current = program;
		(current && current._spidergl && current._spidergl._gl_isProgram.apply(current._spidergl, arguments));
		return r;
	};

	glFunctions.useProgram = gl.useProgram;
	gl.useProgram = function () {
		var ext = this._spidergl.wn._ext;
		ext.glFunctions.useProgram.apply(this, arguments);
		var current = ext.cb.getCurrentProgram();
		(current && current._spidergl && current._spidergl._gl_useProgram.apply(current._spidergl, arguments));
	};

	glFunctions.getActiveAttrib = gl.getActiveAttrib;
	gl.getActiveAttrib = function (program) {
		var ext = this._spidergl.wn._ext;
		var r = ext.glFunctions.getActiveAttrib.apply(this, arguments);
		var current = program;
		(current && current._spidergl && current._spidergl._gl_getActiveAttrib.apply(current._spidergl, arguments));
		return r;
	};

	glFunctions.getActiveUniform = gl.getActiveUniform;
	gl.getActiveUniform = function (program) {
		var ext = this._spidergl.wn._ext;
		var r = ext.glFunctions.getActiveUniform.apply(this, arguments);
		var current = program;
		(current && current._spidergl && current._spidergl._gl_getActiveUniform.apply(current._spidergl, arguments));
		return r;
	};

	glFunctions.getAttachedShaders = gl.getAttachedShaders;
	gl.getAttachedShaders = function (program) {
		var ext = this._spidergl.wn._ext;
		var r = ext.glFunctions.getAttachedShaders.apply(this, arguments);
		var current = program;
		(current && current._spidergl && current._spidergl._gl_getAttachedShaders.apply(current._spidergl, arguments));
		return r;
	};

	glFunctions.getAttribLocation = gl.getAttribLocation;
	gl.getAttribLocation = function (program) {
		var ext = this._spidergl.wn._ext;
		var r = ext.glFunctions.getAttribLocation.apply(this, arguments);
		var current = program;
		(current && current._spidergl && current._spidergl._gl_getAttribLocation.apply(current._spidergl, arguments));
		return r;
	};

	glFunctions.getProgramParameter = gl.getProgramParameter;
	gl.getProgramParameter = function (program) {
		var ext = this._spidergl.wn._ext;
		var r = ext.glFunctions.getProgramParameter.apply(this, arguments);
		var current = program;
		(current && current._spidergl && current._spidergl._gl_getProgramParameter.apply(current._spidergl, arguments));
		return r;
	};

	glFunctions.getProgramInfoLog = gl.getProgramInfoLog;
	gl.getProgramInfoLog = function (program) {
		var ext = this._spidergl.wn._ext;
		var r = ext.glFunctions.getProgramInfoLog.apply(this, arguments);
		var current = program;
		(current && current._spidergl && current._spidergl._gl_getProgramInfoLog.apply(current._spidergl, arguments));
		return r;
	};

	glFunctions.getUniform = gl.getUniform;
	gl.getUniform = function (program) {
		var ext = this._spidergl.wn._ext;
		var r = ext.glFunctions.getUniform.apply(this, arguments);
		var current = program;
		(current && current._spidergl && current._spidergl._gl_getUniform.apply(current._spidergl, arguments));
		return r;
	};

	glFunctions.getUniformLocation = gl.getUniformLocation;
	gl.getUniformLocation = function (program) {
		var ext = this._spidergl.wn._ext;
		var r = ext.glFunctions.getUniformLocation.apply(this, arguments);
		var current = program;
		(current && current._spidergl && current._spidergl._gl_getUniformLocation.apply(current._spidergl, arguments));
		return r;
	};

	glFunctions.attachShader = gl.attachShader;
	gl.attachShader = function (program) {
		var ext = this._spidergl.wn._ext;
		ext.glFunctions.attachShader.apply(this, arguments);
		var current = program;
		(current && current._spidergl && current._spidergl._gl_attachShader.apply(current._spidergl, arguments));
	};

	glFunctions.bindAttribLocation = gl.bindAttribLocation;
	gl.bindAttribLocation = function (program) {
		var ext = this._spidergl.wn._ext;
		ext.glFunctions.bindAttribLocation.apply(this, arguments);
		var current = program;
		(current && current._spidergl && current._spidergl._gl_bindAttribLocation.apply(current._spidergl, arguments));
	};

	glFunctions.detachShader = gl.detachShader;
	gl.detachShader = function (program) {
		var ext = this._spidergl.wn._ext;
		ext.glFunctions.detachShader.apply(this, arguments);
		var current = program;
		(current && current._spidergl && current._spidergl._gl_detachShader.apply(current._spidergl, arguments));
	};

	glFunctions.linkProgram = gl.linkProgram;
	gl.linkProgram = function (program) {
		var ext = this._spidergl.wn._ext;
		ext.glFunctions.linkProgram.apply(this, arguments);
		var current = program;
		(current && current._spidergl && current._spidergl._gl_linkProgram.apply(current._spidergl, arguments));
	};

	glFunctions.uniform1f = gl.uniform1f;
	gl.uniform1f = function () {
		var ext = this._spidergl.wn._ext;
		ext.glFunctions.uniform1f.apply(this, arguments);
		var current = ext.cb.getCurrentProgram();
		(current && current._spidergl && current._spidergl._gl_uniform1f.apply(current._spidergl, arguments));
	};

	glFunctions.uniform1fv = gl.uniform1fv;
	gl.uniform1fv = function () {
		var ext = this._spidergl.wn._ext;
		ext.glFunctions.uniform1fv.apply(this, arguments);
		var current = ext.cb.getCurrentProgram();
		(current && current._spidergl && current._spidergl._gl_uniform1fv.apply(current._spidergl, arguments));
	};

	glFunctions.uniform1i = gl.uniform1i;
	gl.uniform1i = function () {
		var ext = this._spidergl.wn._ext;
		ext.glFunctions.uniform1i.apply(this, arguments);
		var current = ext.cb.getCurrentProgram();
		(current && current._spidergl && current._spidergl._gl_uniform1i.apply(current._spidergl, arguments));
	};

	glFunctions.uniform1iv = gl.uniform1iv;
	gl.uniform1iv = function () {
		var ext = this._spidergl.wn._ext;
		ext.glFunctions.uniform1iv.apply(this, arguments);
		var current = ext.cb.getCurrentProgram();
		(current && current._spidergl && current._spidergl._gl_uniform1iv.apply(current._spidergl, arguments));
	};

	glFunctions.uniform2f = gl.uniform2f;
	gl.uniform2f = function () {
		var ext = this._spidergl.wn._ext;
		ext.glFunctions.uniform2f.apply(this, arguments);
		var current = ext.cb.getCurrentProgram();
		(current && current._spidergl && current._spidergl._gl_uniform2f.apply(current._spidergl, arguments));
	};

	glFunctions.uniform2fv = gl.uniform2fv;
	gl.uniform2fv = function () {
		var ext = this._spidergl.wn._ext;
		ext.glFunctions.uniform2fv.apply(this, arguments);
		var current = ext.cb.getCurrentProgram();
		(current && current._spidergl && current._spidergl._gl_uniform2fv.apply(current._spidergl, arguments));
	};

	glFunctions.uniform2i = gl.uniform2i;
	gl.uniform2i = function () {
		var ext = this._spidergl.wn._ext;
		ext.glFunctions.uniform2i.apply(this, arguments);
		var current = ext.cb.getCurrentProgram();
		(current && current._spidergl && current._spidergl._gl_uniform2i.apply(current._spidergl, arguments));
	};

	glFunctions.uniform2iv = gl.uniform2iv;
	gl.uniform2iv = function () {
		var ext = this._spidergl.wn._ext;
		ext.glFunctions.uniform2iv.apply(this, arguments);
		var current = ext.cb.getCurrentProgram();
		(current && current._spidergl && current._spidergl._gl_uniform2iv.apply(current._spidergl, arguments));
	};

	glFunctions.uniform3f = gl.uniform3f;
	gl.uniform3f = function () {
		var ext = this._spidergl.wn._ext;
		ext.glFunctions.uniform3f.apply(this, arguments);
		var current = ext.cb.getCurrentProgram();
		(current && current._spidergl && current._spidergl._gl_uniform3f.apply(current._spidergl, arguments));
	};

	glFunctions.uniform3fv = gl.uniform3fv;
	gl.uniform3fv = function () {
		var ext = this._spidergl.wn._ext;
		ext.glFunctions.uniform3fv.apply(this, arguments);
		var current = ext.cb.getCurrentProgram();
		(current && current._spidergl && current._spidergl._gl_uniform3fv.apply(current._spidergl, arguments));
	};

	glFunctions.uniform3i = gl.uniform3i;
	gl.uniform3i = function () {
		var ext = this._spidergl.wn._ext;
		ext.glFunctions.uniform3i.apply(this, arguments);
		var current = ext.cb.getCurrentProgram();
		(current && current._spidergl && current._spidergl._gl_uniform3i.apply(current._spidergl, arguments));
	};

	glFunctions.uniform3iv = gl.uniform3iv;
	gl.uniform3iv = function () {
		var ext = this._spidergl.wn._ext;
		ext.glFunctions.uniform3iv.apply(this, arguments);
		var current = ext.cb.getCurrentProgram();
		(current && current._spidergl && current._spidergl._gl_uniform3iv.apply(current._spidergl, arguments));
	};

	glFunctions.uniform4f = gl.uniform4f;
	gl.uniform4f = function () {
		var ext = this._spidergl.wn._ext;
		ext.glFunctions.uniform4f.apply(this, arguments);
		var current = ext.cb.getCurrentProgram();
		(current && current._spidergl && current._spidergl._gl_uniform4f.apply(current._spidergl, arguments));
	};

	glFunctions.uniform4fv = gl.uniform4fv;
	gl.uniform4fv = function () {
		var ext = this._spidergl.wn._ext;
		ext.glFunctions.uniform4fv.apply(this, arguments);
		var current = ext.cb.getCurrentProgram();
		(current && current._spidergl && current._spidergl._gl_uniform4fv.apply(current._spidergl, arguments));
	};

	glFunctions.uniform4i = gl.uniform4i;
	gl.uniform4i = function () {
		var ext = this._spidergl.wn._ext;
		ext.glFunctions.uniform4i.apply(this, arguments);
		var current = ext.cb.getCurrentProgram();
		(current && current._spidergl && current._spidergl._gl_uniform4i.apply(current._spidergl, arguments));
	};

	glFunctions.uniform4iv = gl.uniform4iv;
	gl.uniform4iv = function () {
		var ext = this._spidergl.wn._ext;
		ext.glFunctions.uniform4iv.apply(this, arguments);
		var current = ext.cb.getCurrentProgram();
		(current && current._spidergl && current._spidergl._gl_uniform4iv.apply(current._spidergl, arguments));
	};

	glFunctions.uniformMatrix2fv = gl.uniformMatrix2fv;
	gl.uniformMatrix2fv = function () {
		var ext = this._spidergl.wn._ext;
		ext.glFunctions.uniformMatrix2fv.apply(this, arguments);
		var current = ext.cb.getCurrentProgram();
		(current && current._spidergl && current._spidergl._gl_uniformMatrix2fv.apply(current._spidergl, arguments));
	};

	glFunctions.uniformMatrix3fv = gl.uniformMatrix3fv;
	gl.uniformMatrix3fv = function () {
		var ext = this._spidergl.wn._ext;
		ext.glFunctions.uniformMatrix3fv.apply(this, arguments);
		var current = ext.cb.getCurrentProgram();
		(current && current._spidergl && current._spidergl._gl_uniformMatrix3fv.apply(current._spidergl, arguments));
	};

	glFunctions.uniformMatrix4fv = gl.uniformMatrix4fv;
	gl.uniformMatrix4fv = function () {
		var ext = this._spidergl.wn._ext;
		ext.glFunctions.uniformMatrix4fv.apply(this, arguments);
		var current = ext.cb.getCurrentProgram();
		(current && current._spidergl && current._spidergl._gl_uniformMatrix4fv.apply(current._spidergl, arguments));
	};

	glFunctions.validateProgram = gl.validateProgram;
	gl.validateProgram = function (program) {
		var ext = this._spidergl.wn._ext;
		ext.glFunctions.validateProgram.apply(this, arguments);
		var current = program;
		(current && current._spidergl && current._spidergl._gl_validateProgram.apply(current._spidergl, arguments));
	};
	//////////////////////////////////////////////////////////////////////////////////////////



	// renderbuffer
	//////////////////////////////////////////////////////////////////////////////////////////
	glFunctions.deleteRenderbuffer = gl.deleteRenderbuffer;
	gl.deleteRenderbuffer = function (renderbuffer) {
		var ext = this._spidergl.wn._ext;
		ext.glFunctions.deleteRenderbuffer.apply(this, arguments);
		var current = renderbuffer;
		(current && current._spidergl && current._spidergl._gl_deleteRenderbuffer.apply(current._spidergl, arguments));
	};

	glFunctions.isRenderbuffer = gl.isRenderbuffer;
	gl.isRenderbuffer = function (renderbuffer) {
		var ext = this._spidergl.wn._ext;
		var r = ext.glFunctions.isRenderbuffer.apply(this, arguments);
		var current = renderbuffer;
		(current && current._spidergl && current._spidergl._gl_isRenderbuffer.apply(current._spidergl, arguments));
		return r;
	};

	glFunctions.bindRenderbuffer = gl.bindRenderbuffer;
	gl.bindRenderbuffer = function (target) {
		var ext = this._spidergl.wn._ext;
		ext.glFunctions.bindRenderbuffer.apply(this, arguments);
		var current = ext.cb.getCurrentRenderbuffer(target);
		(current && current._spidergl && current._spidergl._gl_bindRenderbuffer.apply(current._spidergl, arguments));
	};

	glFunctions.getRenderbufferParameter = gl.getRenderbufferParameter;
	gl.getRenderbufferParameter = function (target) {
		var ext = this._spidergl.wn._ext;
		var r = ext.glFunctions.getRenderbufferParameter.apply(this, arguments);
		var current = ext.cb.getCurrentRenderbuffer(target);
		(current && current._spidergl && current._spidergl._gl_getRenderbufferParameter.apply(current._spidergl, arguments));
		return r;
	};

	glFunctions.renderbufferStorage = gl.renderbufferStorage;
	gl.renderbufferStorage = function (target) {
		var ext = this._spidergl.wn._ext;
		ext.glFunctions.renderbufferStorage.apply(this, arguments);
		var current = ext.cb.getCurrentRenderbuffer(target);
		(current && current._spidergl && current._spidergl._gl_renderbufferStorage.apply(current._spidergl, arguments));
	}
	//////////////////////////////////////////////////////////////////////////////////////////



	// shader
	//////////////////////////////////////////////////////////////////////////////////////////
	glFunctions.deleteShader = gl.deleteShader;
	gl.deleteShader = function (shader) {
		var ext = this._spidergl.wn._ext;
		ext.glFunctions.deleteShader.apply(this, arguments);
		var current = shader;
		(current && current._spidergl && current._spidergl._gl_deleteShader.apply(current._spidergl, arguments));
	};

	glFunctions.isShader = gl.isShader;
	gl.isShader = function (shader) {
		var ext = this._spidergl.wn._ext;
		var r = ext.glFunctions.isShader.apply(this, arguments);
		var current = shader;
		(current && current._spidergl && current._spidergl._gl_isShader.apply(current._spidergl, arguments));
		return r;
	};

	glFunctions.getShaderParameter = gl.getShaderParameter;
	gl.getShaderParameter = function (shader) {
		var ext = this._spidergl.wn._ext;
		var r = ext.glFunctions.getShaderParameter.apply(this, arguments);
		var current = shader;
		(current && current._spidergl && current._spidergl._gl_getShaderParameter.apply(current._spidergl, arguments));
		return r;
	};

	glFunctions.getShaderInfoLog = gl.getShaderInfoLog;
	gl.getShaderInfoLog = function (shader) {
		var ext = this._spidergl.wn._ext;
		var r = ext.glFunctions.getShaderInfoLog.apply(this, arguments);
		var current = shader;
		(current && current._spidergl && current._spidergl._gl_getShaderInfoLog.apply(current._spidergl, arguments));
		return r;
	};

	glFunctions.getShaderSource = gl.getShaderSource;
	gl.getShaderSource = function (shader) {
		var ext = this._spidergl.wn._ext;
		var r = ext.glFunctions.getShaderSource.apply(this, arguments);
		var current = shader;
		(current && current._spidergl && current._spidergl._gl_getShaderSource.apply(current._spidergl, arguments));
		return r;
	};

	glFunctions.compileShader = gl.compileShader;
	gl.compileShader = function (shader) {
		var ext = this._spidergl.wn._ext;
		ext.glFunctions.compileShader.apply(this, arguments);
		var current = shader;
		(current && current._spidergl && current._spidergl._gl_compileShader.apply(current._spidergl, arguments));
	}

	glFunctions.shaderSource = gl.shaderSource;
	gl.shaderSource = function (shader) {
		var ext = this._spidergl.wn._ext;
		ext.glFunctions.shaderSource.apply(this, arguments);
		var current = shader;
		(current && current._spidergl && current._spidergl._gl_shaderSource.apply(current._spidergl, arguments));
	}
	//////////////////////////////////////////////////////////////////////////////////////////



	// texture
	//////////////////////////////////////////////////////////////////////////////////////////
	ext.textureTargetMap = { };
	ext.textureTargetMap[gl.TEXTURE_2D                 ] = gl.TEXTURE_2D;
	ext.textureTargetMap[gl.TEXTURE_CUBE_MAP           ] = gl.TEXTURE_CUBE_MAP;
	ext.textureTargetMap[gl.TEXTURE_CUBE_MAP_POSITIVE_X] = gl.TEXTURE_CUBE_MAP;
	ext.textureTargetMap[gl.TEXTURE_CUBE_MAP_NEGATIVE_X] = gl.TEXTURE_CUBE_MAP;
	ext.textureTargetMap[gl.TEXTURE_CUBE_MAP_POSITIVE_Y] = gl.TEXTURE_CUBE_MAP;
	ext.textureTargetMap[gl.TEXTURE_CUBE_MAP_NEGATIVE_Y] = gl.TEXTURE_CUBE_MAP;
	ext.textureTargetMap[gl.TEXTURE_CUBE_MAP_POSITIVE_Z] = gl.TEXTURE_CUBE_MAP;
	ext.textureTargetMap[gl.TEXTURE_CUBE_MAP_NEGATIVE_Z] = gl.TEXTURE_CUBE_MAP;

	glFunctions.deleteTexture = gl.deleteTexture;
	gl.deleteTexture = function (texture) {
		var ext = this._spidergl.wn._ext;
		ext.glFunctions.deleteTexture.apply(this, arguments);
		var current = texture;
		(current && current._spidergl && current._spidergl._gl_deleteTexture.apply(current._spidergl, arguments));
	};

	glFunctions.isTexture = gl.isTexture;
	gl.isTexture = function (texture) {
		var ext = this._spidergl.wn._ext;
		var r = ext.glFunctions.isTexture.apply(this, arguments);
		var current = texture;
		(current && current._spidergl && current._spidergl._gl_isTexture.apply(current._spidergl, arguments));
		return r;
	};

	glFunctions.bindTexture = gl.bindTexture;
	gl.bindTexture = function (target) {
		var ext = this._spidergl.wn._ext;
		ext.glFunctions.bindTexture.apply(this, arguments);
		var current = ext.cb.getCurrentTexture(target);
		(current && current._spidergl && current._spidergl._gl_bindTexture.apply(current._spidergl, arguments));
	};

	glFunctions.getTexParameter = gl.getTexParameter;
	gl.getTexParameter = function (target) {
		var ext = this._spidergl.wn._ext;
		var r = ext.glFunctions.getTexParameter.apply(this, arguments);
		var current = ext.cb.getCurrentTexture(target);
		(current && current._spidergl && current._spidergl._gl_getTexParameter.apply(current._spidergl, arguments));
		return r;
	};

	glFunctions.copyTexImage2D = gl.copyTexImage2D;
	gl.copyTexImage2D = function (target) {
		var ext = this._spidergl.wn._ext;
		ext.glFunctions.copyTexImage2D.apply(this, arguments);
		var texTarget = ext.textureTargetMap[target];
		var current = ext.cb.getCurrentTexture(texTarget);
		(current && current._spidergl && current._spidergl._gl_copyTexImage2D.apply(current._spidergl, arguments));
	}

	glFunctions.copyTexSubImage2D = gl.copyTexSubImage2D;
	gl.copyTexSubImage2D = function (target) {
		var ext = this._spidergl.wn._ext;
		ext.glFunctions.copyTexSubImage2D.apply(this, arguments);
		var texTarget = ext.textureTargetMap[target];
		var current = ext.cb.getCurrentTexture(texTarget);
		(current && current._spidergl && current._spidergl._gl_copyTexSubImage2D.apply(current._spidergl, arguments));
	}

	glFunctions.generateMipmap = gl.generateMipmap;
	gl.generateMipmap = function (target) {
		var ext = this._spidergl.wn._ext;
		ext.glFunctions.generateMipmap.apply(this, arguments);
		var current = ext.cb.getCurrentTexture(target);
		(current && current._spidergl && current._spidergl._gl_generateMipmap.apply(current._spidergl, arguments));
	}

	glFunctions.texImage2D = gl.texImage2D;
	gl.texImage2D = function (target) {
		var ext = this._spidergl.wn._ext;
		ext.glFunctions.texImage2D.apply(this, arguments);
		var texTarget = ext.textureTargetMap[target];
		var current = ext.cb.getCurrentTexture(texTarget);
		(current && current._spidergl && current._spidergl._gl_texImage2D.apply(current._spidergl, arguments));
	}

	glFunctions.texParameterf = gl.texParameterf;
	gl.texParameterf = function (target) {
		var ext = this._spidergl.wn._ext;
		ext.glFunctions.texParameterf.apply(this, arguments);
		var current = ext.cb.getCurrentTexture(target);
		(current && current._spidergl && current._spidergl._gl_texParameterf.apply(current._spidergl, arguments));
	}

	glFunctions.texParameteri = gl.texParameteri;
	gl.texParameteri = function (target) {
		var ext = this._spidergl.wn._ext;
		ext.glFunctions.texParameteri.apply(this, arguments);
		var current = ext.cb.getCurrentTexture(target);
		(current && current._spidergl && current._spidergl._gl_texParameteri.apply(current._spidergl, arguments));
	}

	glFunctions.texSubImage2D = gl.texSubImage2D;
	gl.texSubImage2D = function (target) {
		var ext = this._spidergl.wn._ext;
		ext.glFunctions.texSubImage2D.apply(this, arguments);
		var texTarget = ext.textureTargetMap[target];
		var current = ext.cb.getCurrentTexture(texTarget);
		(current && current._spidergl && current._spidergl._gl_texSubImage2D.apply(current._spidergl, arguments));
	}
	//////////////////////////////////////////////////////////////////////////////////////////

	return true;
};

SpiderGL.WebGL.Context._setup_SGL_direct_state_access = function (gl, pubExt) {
	if (!gl) return false;
	if (!pubExt) return false;
	if (!gl._spidergl) return false;
	if (gl._spidergl.dsa) return false;

	var dsa = pubExt;
	var ext = dsa._ext;
	var glFunctions = ext.glFunctions;

	ext.cb = gl.getExtension("SGL_current_binding");
	if (!ext.cb) return false;

	// buffer
	//////////////////////////////////////////////////////////////////////////////////////////
	dsa.getBufferParameter = function (buffer, target, pname) {
		var ext = this._ext;
		var gl  = ext.gl;
		var current = ext.cb.getCurrentBuffer(target);
		(current != buffer) && gl.bindBuffer(target, buffer);
		var r = gl.getBufferParameter(target, pname);
		(current != buffer) && gl.bindBuffer(target, current);
		return r;
	};

	dsa.bufferData = function (buffer, target, dataOrSize, usage) {
		var ext = this._ext;
		var gl  = ext.gl;
		var current = ext.cb.getCurrentBuffer(target);
		(current != buffer) && gl.bindBuffer(target, buffer);
		gl.bufferData(target, dataOrSize, usage);
		(current != buffer) && gl.bindBuffer(target, current);
	}

	dsa.bufferSubData = function (buffer, target, offset, data) {
		var ext = this._ext;
		var gl  = ext.gl;
		var current = ext.cb.getCurrentBuffer(target);
		(current != buffer) && gl.bindBuffer(target, buffer);
		gl.bufferSubData(target, offset, data);
		(current != buffer) && gl.bindBuffer(target, current);
	}

	dsa.vertexAttribPointer = function (buffer, indx, size, type, normalized, stride, offset) {
		var ext = this._ext;
		var gl  = ext.gl;
		var target  = gl.ARRAY_BUFFER;
		var current = ext.cb.getCurrentBuffer(target);
		(current != buffer) && gl.bindBuffer(target, buffer);
		gl.vertexAttribPointer(indx, size, type, normalized, stride, offset);
		(current != buffer) && gl.bindBuffer(target, current);
	};

	dsa.drawElements = function (buffer, mode, count, type, offset) {
		var ext = this._ext;
		var gl  = ext.gl;
		var target  = gl.ELEMENT_ARRAY_BUFFER;
		var current = ext.cb.getCurrentBuffer(target);
		(current != buffer) && gl.bindBuffer(target, buffer);
		gl.drawElements(mode, count, type, offset);
		(current != buffer) && gl.bindBuffer(target, current);
	};
	//////////////////////////////////////////////////////////////////////////////////////////



	// framebuffer
	//////////////////////////////////////////////////////////////////////////////////////////
	dsa.checkFramebufferStatus = function (framebuffer, target) {
		var ext = this._ext;
		var gl  = ext.gl;
		var current = ext.cb.getCurrentFramebuffer(target);
		(current != framebuffer) && gl.bindFramebuffer(target, framebuffer);
		var r = gl.checkFramebufferStatus(target);
		(current != framebuffer) && gl.bindFramebuffer(target, current);
		return r;
	};

	dsa.getFramebufferAttachmentParameter = function (framebuffer, target, attachment, pname) {
		var ext = this._ext;
		var gl  = ext.gl;
		var current = ext.cb.getCurrentFramebuffer(target);
		(current != framebuffer) && gl.bindFramebuffer(target, framebuffer);
		var r = gl.getFramebufferAttachmentParameter(target, attachment, pname);
		(current != framebuffer) && gl.bindFramebuffer(target, current);
		return r;
	};

	dsa.framebufferRenderbuffer = function (framebuffer, target, attachment, renderbuffertarget, renderbuffer) {
		var ext = this._ext;
		var gl  = ext.gl;
		var current = ext.cb.getCurrentFramebuffer(target);
		(current != framebuffer) && gl.bindFramebuffer(target, framebuffer);
		gl.framebufferRenderbuffer(target, attachment, renderbuffertarget, renderbuffer);
		(current != framebuffer) && gl.bindFramebuffer(target, current);
	};

	dsa.framebufferTexture2D = function (framebuffer, target, attachment, textarget, texture, level) {
		var ext = this._ext;
		var gl  = ext.gl;
		var current = ext.cb.getCurrentFramebuffer(target);
		(current != framebuffer) && gl.bindFramebuffer(target, framebuffer);
		gl.framebufferTexture2D(target, attachment, textarget, texture, level);
		(current != framebuffer) && gl.bindFramebuffer(target, current);
	};

	dsa.clear = function (framebuffer, mask) {
		var ext = this._ext;
		var gl  = ext.gl;
		var target = gl.FRAMEBUFFER
		var current = ext.cb.getCurrentFramebuffer(target);
		(current != framebuffer) && gl.bindFramebuffer(target, framebuffer);
		gl.clear(mask);
		(current != framebuffer) && gl.bindFramebuffer(target, current);
	};

	dsa.readPixels = function (framebuffer, x, y, width, height, format, type, pixels) {
		var ext = this._ext;
		var gl  = ext.gl;
		var target = gl.FRAMEBUFFER
		var current = ext.cb.getCurrentFramebuffer(target);
		(current != framebuffer) && gl.bindFramebuffer(target, framebuffer);
		gl.readPixels(x, y, width, height, format, type, pixels);
		(current != framebuffer) && gl.bindFramebuffer(target, current);
	};
	//////////////////////////////////////////////////////////////////////////////////////////



	// program
	//////////////////////////////////////////////////////////////////////////////////////////
	dsa.uniform1f = function (program, location, x) {
		var ext = this._ext;
		var gl  = ext.gl;
		var current = ext.cb.getCurrentProgram();
		(current != program) && gl.useProgram(program);
		gl.uniform1f(location, x);
		(current != program) && gl.useProgram(current);
	};

	dsa.uniform1fv = function (program, location, v) {
		var ext = this._ext;
		var gl  = ext.gl;
		var current = ext.cb.getCurrentProgram();
		(current != program) && gl.useProgram(program);
		gl.uniform1fv(location, v);
		(current != program) && gl.useProgram(current);
	};

	dsa.uniform1i = function (program, location, x) {
		var ext = this._ext;
		var gl  = ext.gl;
		var current = ext.cb.getCurrentProgram();
		(current != program) && gl.useProgram(program);
		gl.uniform1i(location, x);
		(current != program) && gl.useProgram(current);
	};

	dsa.uniform1iv = function (program, location, v) {
		var ext = this._ext;
		var gl  = ext.gl;
		var current = ext.cb.getCurrentProgram();
		(current != program) && gl.useProgram(program);
		gl.uniform1iv(location, v);
		(current != program) && gl.useProgram(current);
	};

	dsa.uniform2f = function (program, location, x, y) {
		var ext = this._ext;
		var gl  = ext.gl;
		var current = ext.cb.getCurrentProgram();
		(current != program) && gl.useProgram(program);
		gl.uniform2f(location, x, y);
		(current != program) && gl.useProgram(current);
	};

	dsa.uniform2fv = function (program, location, v) {
		var ext = this._ext;
		var gl  = ext.gl;
		var current = ext.cb.getCurrentProgram();
		(current != program) && gl.useProgram(program);
		gl.uniform2fv(location, v);
		(current != program) && gl.useProgram(current);
	};

	dsa.uniform2i = function (program, location, x, y) {
		var ext = this._ext;
		var gl  = ext.gl;
		var current = ext.cb.getCurrentProgram();
		(current != program) && gl.useProgram(program);
		gl.uniform2i(location, x, y);
		(current != program) && gl.useProgram(current);
	};

	dsa.uniform2iv = function (program, location, v) {
		var ext = this._ext;
		var gl  = ext.gl;
		var current = ext.cb.getCurrentProgram();
		(current != program) && gl.useProgram(program);
		gl.uniform2iv(location, v);
		(current != program) && gl.useProgram(current);
	};

	dsa.uniform3f = function (program, location, x, y, z) {
		var ext = this._ext;
		var gl  = ext.gl;
		var current = ext.cb.getCurrentProgram();
		(current != program) && gl.useProgram(program);
		gl.uniform3f(location, x, y, z);
		(current != program) && gl.useProgram(current);
	};

	dsa.uniform3fv = function (program, location, v) {
		var ext = this._ext;
		var gl  = ext.gl;
		var current = ext.cb.getCurrentProgram();
		(current != program) && gl.useProgram(program);
		gl.uniform3fv(location, v);
		(current != program) && gl.useProgram(current);
	};

	dsa.uniform3i = function (program, location, x, y, z) {
		var ext = this._ext;
		var gl  = ext.gl;
		var current = ext.cb.getCurrentProgram();
		(current != program) && gl.useProgram(program);
		gl.uniform3i(location, x, y, z);
		(current != program) && gl.useProgram(current);
	};

	dsa.uniform3iv = function (program, location, v) {
		var ext = this._ext;
		var gl  = ext.gl;
		var current = ext.cb.getCurrentProgram();
		(current != program) && gl.useProgram(program);
		gl.uniform3iv(location, v);
		(current != program) && gl.useProgram(current);
	};

	dsa.uniform4f = function (program, location, x, y, z, w) {
		var ext = this._ext;
		var gl  = ext.gl;
		var current = ext.cb.getCurrentProgram();
		(current != program) && gl.useProgram(program);
		gl.uniform4f(location, x, y, z, w);
		(current != program) && gl.useProgram(current);
	};

	dsa.uniform4fv = function (program, location, v) {
		var ext = this._ext;
		var gl  = ext.gl;
		var current = ext.cb.getCurrentProgram();
		(current != program) && gl.useProgram(program);
		gl.uniform4fv(location, v);
		(current != program) && gl.useProgram(current);
	};

	dsa.uniform4i = function (program, location, x, y, z, w) {
		var ext = this._ext;
		var gl  = ext.gl;
		var current = ext.cb.getCurrentProgram();
		(current != program) && gl.useProgram(program);
		gl.uniform4i(location, x, y, z, w);
		(current != program) && gl.useProgram(current);
	};

	dsa.uniform4iv = function (program, location, v) {
		var ext = this._ext;
		var gl  = ext.gl;
		var current = ext.cb.getCurrentProgram();
		(current != program) && gl.useProgram(program);
		gl.uniform4iv(location, v);
		(current != program) && gl.useProgram(current);
	};

	dsa.uniformMatrix2fv = function (program, location, transpose, value) {
		var ext = this._ext;
		var gl  = ext.gl;
		var current = ext.cb.getCurrentProgram();
		(current != program) && gl.useProgram(program);
		gl.uniformMatrix2fv(location, transpose, value);
		(current != program) && gl.useProgram(current);
	};

	dsa.uniformMatrix3fv = function (program, location, transpose, value) {
		var ext = this._ext;
		var gl  = ext.gl;
		var current = ext.cb.getCurrentProgram();
		(current != program) && gl.useProgram(program);
		gl.uniformMatrix3fv(location, transpose, value);
		(current != program) && gl.useProgram(current);
	};

	dsa.uniformMatrix4fv = function (program, location, transpose, value) {
		var ext = this._ext;
		var gl  = ext.gl;
		var current = ext.cb.getCurrentProgram();
		(current != program) && gl.useProgram(program);
		gl.uniformMatrix4fv(location, transpose, value);
		(current != program) && gl.useProgram(current);
	};
	//////////////////////////////////////////////////////////////////////////////////////////



	// renderbuffer
	//////////////////////////////////////////////////////////////////////////////////////////
	dsa.getRenderbufferParameter = function (renderbuffer, target, pname) {
		var ext = this._ext;
		var gl  = ext.gl;
		var current = ext.cb.getCurrentRenderbuffer(target);
		(current != renderbuffer) && gl.bindRenderbuffer(target, renderbuffer);
		var r = gl.getRenderbufferParameter.call(gl, target, pname);
		(current != renderbuffer) && gl.bindRenderbuffer(target, current);
		return r;
	};

	dsa.renderbufferStorage = function (renderbuffer, target, internalformat, width, height) {
		var ext = this._ext;
		var gl  = ext.gl;
		var current = ext.cb.getCurrentRenderbuffer(target);
		(current != renderbuffer) && gl.bindRenderbuffer(target, renderbuffer);
		gl.renderbufferStorage(target, internalformat, width, height);
		(current != renderbuffer) && gl.bindRenderbuffer(target, current);
	};
	//////////////////////////////////////////////////////////////////////////////////////////



	// shader
	//////////////////////////////////////////////////////////////////////////////////////////
	// NO DSA FUNCTIONS
	dsa.shaderIsNull = function (shader) {
		return (shader == null);
	};
	//////////////////////////////////////////////////////////////////////////////////////////



	// texture
	//////////////////////////////////////////////////////////////////////////////////////////
	ext.textureTargetMap = { };
	ext.textureTargetMap[gl.TEXTURE_2D                 ] = gl.TEXTURE_2D;
	ext.textureTargetMap[gl.TEXTURE_CUBE_MAP           ] = gl.TEXTURE_CUBE_MAP;
	ext.textureTargetMap[gl.TEXTURE_CUBE_MAP_POSITIVE_X] = gl.TEXTURE_CUBE_MAP;
	ext.textureTargetMap[gl.TEXTURE_CUBE_MAP_NEGATIVE_X] = gl.TEXTURE_CUBE_MAP;
	ext.textureTargetMap[gl.TEXTURE_CUBE_MAP_POSITIVE_Y] = gl.TEXTURE_CUBE_MAP;
	ext.textureTargetMap[gl.TEXTURE_CUBE_MAP_NEGATIVE_Y] = gl.TEXTURE_CUBE_MAP;
	ext.textureTargetMap[gl.TEXTURE_CUBE_MAP_POSITIVE_Z] = gl.TEXTURE_CUBE_MAP;
	ext.textureTargetMap[gl.TEXTURE_CUBE_MAP_NEGATIVE_Z] = gl.TEXTURE_CUBE_MAP;

	dsa.getTexParameter = function (texture, target, pname) {
		var ext = this._ext;
		var gl  = ext.gl;
		var current = ext.cb.getCurrentTexture(target);
		(current != texture) && gl.bindTexture(target, texture);
		var r = gl.getTexParameter(target, pname);
		(current != texture) && gl.bindTexture(target, current);
		return r;
	};

	dsa.copyTexImage2D = function (texture, target, level, internalformat, x, y, width, height, border) {
		var ext = this._ext;
		var gl  = ext.gl;
		var texTarget = ext.textureTargetMap[target];
		var current = ext.cb.getCurrentTexture(texTarget);
		(current != texture) && gl.bindTexture(texTarget, texture);
		gl.copyTexImage2D(target, level, internalformat, x, y, width, height, border);
		(current != texture) && gl.bindTexture(texTarget, current);
	};

	dsa.copyTexSubImage2D = function (texture, target, level, xoffset, yoffset, x, y, width, height, border) {
		var ext = this._ext;
		var gl  = ext.gl;
		var texTarget = ext.textureTargetMap[target];
		var current = ext.cb.getCurrentTexture(texTarget);
		(current != texture) && gl.bindTexture(texTarget, texture);
		gl.copyTexSubImage2D(target, level, xoffset, yoffset, x, y, width, height, border);
		(current != texture) && gl.bindTexture(texTarget, current);
	};

	dsa.generateMipmap = function (texture, target) {
		var ext = this._ext;
		var gl  = ext.gl;
		var current = ext.cb.getCurrentTexture(target);
		(current != texture) && gl.bindTexture(target, texture);
		gl.generateMipmap(target);
		(current != texture) && gl.bindTexture(target, current);
	};

	dsa.texImage2D = function (texture, target) {
		var ext = this._ext;
		var gl  = ext.gl;
		var texTarget = ext.textureTargetMap[target];
		var current = ext.cb.getCurrentTexture(texTarget);
		(current != texture) && gl.bindTexture(texTarget, texture);
		var args = Array.prototype.slice.call(arguments, 1);
		gl.texImage2D.apply(gl, args);
		(current != texture) && gl.bindTexture(texTarget, current);
	};

	dsa.texParameterf = function (texture, target, pname, param) {
		var ext = this._ext;
		var gl  = ext.gl;
		var current = ext.cb.getCurrentTexture(target);
		(current != texture) && gl.bindTexture(target, texture);
		gl.texParameterf(target, pname, param);
		(current != texture) && gl.bindTexture(target, current);
	};

	dsa.texParameteri = function (texture, target, pname, param) {
		var ext = this._ext;
		var gl  = ext.gl;
		var current = ext.cb.getCurrentTexture(target);
		(current != texture) && gl.bindTexture(target, texture);
		gl.texParameteri(target, pname, param);
		(current != texture) && gl.bindTexture(target, current);
	};

	dsa.texSubImage2D = function (texture, target) {
		var ext = this._ext;
		var gl  = ext.gl;
		var texTarget = ext.textureTargetMap[target];
		var current = ext.cb.getCurrentTexture(texTarget);
		(current != texture) && gl.bindTexture(texTarget, texture);
		var args = Array.prototype.slice.call(arguments, 1);
		gl.texSubImage2D.apply(gl, args);
		(current != texture) && gl.bindTexture(texTarget, current);
	};

	dsa.bindTexture = function (unit, target, texture) {
		var ext = this._ext;
		var gl  = ext.gl;
		var cb = ext.cb;
		var currentUnit = cb.getCurrentTextureUnit();
		(currentUnit != unit) && gl.activeTexture(unit);
		gl.bindTexture(target, texture);
		(currentUnit != unit) && gl.activeTexture(currentUnit);
	};
	//////////////////////////////////////////////////////////////////////////////////////////

	return true;
};

/**
 * Hijacks a WebGLRenderingContext for SpiderGL.WebGL.ObjectGL wrappers.
 *
 * The WebGLRenderingContext is modified to allow SpiderGL.WebGL.ObjectGL wrappers to be edited without explicit bind and without affecting the WebGL object bindings.
 * Most WebGL objects follow the "bind to edit" / "bind to use" paradigm.
 * This means that the object must be bound to the WebGL context to modify some parameter or its resource data.
 * As a side effect, binding the object just to modify it has the same result of binding it to be used during rendering.
 * To prevent this side effect, all the WebGLRenderingContext functions that bind and modify object parameters or data, as long as the rendering functions, are wrapped.
 * This allows SpiderGL wrappers (derived from {@link SpiderGL.WebGL.ObjectGL}) to be edited without affecting the binding state of the WebGLRenderingContext.
 * The following example clarifies how bindings are handled.
 *
 * @example
 * var textureA = gl.createTexture();
 * gl.bindTexture(gl.TEXTURE_2D, textureA);
 * gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
 * // other texture calls
 * var textureB = new SpiderGL.WebGL.Texture2D(gl, parameters);
 * textureB.minFilter = gl.LINEAR; // textureB is hiddenly bound to modify the minification filter
 * gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR); // textureA is automatically re-bound to keep WebGL semantic
 * textureB.magFilter = gl.LINEAR; // textureB is hiddenly bound to modify another parameter
 * gl.drawArrays(gl.TRIANGLES, 0, 3); // textureA is automatically re-bound to keep WebGL semantic
 * textureB.bind(); // bind textureB to WebGL, breaking the binding with textureA
 * gl.drawArrays(gl.TRIANGLES, 0, 3); // textureA is used
 * 
 * @param {WebGLRenderingContext} gl The WebGLRenderingContext to modify.
 *
 * @returns {bool} True on success, false if the gl argument is not valid or has already been modified.
 *
 * @see SpiderGL.WebGL.Context.isHijacked
 * @see SpiderGL.WebGL.Context.getHijacked
 * @see SpiderGL.WebGL.Context.get
 * @see SpiderGL.WebGL.ObjectGL
 */
SpiderGL.WebGL.Context.hijack = function (gl) {
//	if (!SpiderGL.Type.instanceOf(gl, WebGLRenderingContext)) { return false; }
	if (gl._spidergl) { return false; }

	SpiderGL.WebGL.Context._prepareContex(gl);

	SpiderGL.WebGL.Context._addExtension(gl, "SGL_current_binding",     "cb",  SpiderGL.WebGL.Context._setup_SGL_current_binding);
	SpiderGL.WebGL.Context._addExtension(gl, "SGL_wrapper_notify",      "wn",  SpiderGL.WebGL.Context._setup_SGL_wrapper_notify);
	SpiderGL.WebGL.Context._addExtension(gl, "SGL_direct_state_access", "dsa", SpiderGL.WebGL.Context._setup_SGL_direct_state_access);

	var cb  = gl.getExtension("SGL_current_binding"    );
	var wn  = gl.getExtension("SGL_wrapper_notify"     );
	var dsa = gl.getExtension("SGL_direct_state_access");

	var hijacked = (!!cb && !!wn && !!dsa);

	return hijacked;
}

/**
 * Tests whether a WebGLRenderingContext is hijacked.
 *
 * The WebGLRenderingContext is hijacked after a successful call to {@link SpiderGL.WebGL.Context.hijack}.
 *
 * @param {WebGLRenderingContext} gl The WebGLRenderingContext to test.
 *
 * @returns {bool} True on success, false if the gl argument is not valid or has already been modified.
 *
 * @see SpiderGL.WebGL.Context.hijack
 * @see SpiderGL.WebGL.Context.getHijacked
 * @see SpiderGL.WebGL.Context.get
 */
SpiderGL.WebGL.Context.isHijacked = function (gl) {
	return !!gl && !!gl._spidergl;
	return (SpiderGL.Type.instanceOf(gl, WebGLRenderingContext) && gl._spidergl);
}

/**
 * Creates a WebGLRenderingContext and hijacks it.
 *
 * The WebGLRenderingContext obtained from the canvas parameter with optional arguments is hijacked.
 *
 * @param {HTMLCanvasElement} canvas The HTMLCanvasElement from which retrieve the WebGL context.
 * @param {object} args The optional WebGL context arguments.
 *
 * @returns {WebGLRenderingContext} The hijacked canvas WebGL rendering context.
 *
 * @see SpiderGL.WebGL.Context.get
 * @see SpiderGL.WebGL.Context.getHijacked
 * @see SpiderGL.WebGL.Context.isHijacked
 */
SpiderGL.WebGL.Context.getHijacked = function (canvas, args) {
	var gl = SpiderGL.WebGL.Context.get(canvas, args);
	SpiderGL.WebGL.Context.hijack(gl);
	return gl;
}

/**
 * Sets pixel store unpack parameters to standard OpenGL SpiderGL values.
 * The parameters to be set are UNPACK_FLIP_Y_WEBGL (true), UNPACK_PREMULTIPLY_ALPHA_WEBGL (false) and UNPACK_COLORSPACE_CONVERSION_WEBGL (WebGLRenderingContext.NONE).
 *
 * @param {WebGLRenderingContext} gl The target WebGLRenderingContext.
 */
SpiderGL.WebGL.Context.setStandardGLUnpack = function (gl) {
	gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL,                true);
	gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL,     false);
	gl.pixelStorei(gl.UNPACK_COLORSPACE_CONVERSION_WEBGL, WebGLRenderingContext.NONE);
}

/**
 * Creates a SpiderGL.WebGL.ObjectGL.
 *
 * SpiderGL.WebGL.ObjectGL is the base class for every WebObjectGL wrapper and must not be directly used.
 * In general, every SpiderGL.WebGL.ObjectGL-derived constructor takes two arguments: a hijacked WebGLRenderingContext ("gl")
 * and an optional object argument ("options") that is used to wrap an existing native WebObjectGL and to set object-specific parameters or data.
 * If the options parameter has a propery named "handle" referencing a WebObjectGL, the constructed SpiderGL.WebGL.ObjectGL will use the provided WebObjectGL as the underlying resource.
 * Otherwise, a new WebObjectGL is created. In both cases, the internal WebObjectGL can be accessed with the {@link handle} read-only property and directly used in WebGLRenderingContext calls.
 * With a notification mechanism built into the hijacked WebGLRenderingContext, every direct access is communicated to the wrapper to keep up-to-date the internal state of the wrapper.
 *
 * @example
 * // create a native vertex WebGLBuffer
 * var vbo = gl.createBuffer();
 * gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
 * // ... use buffer ...
 * // create a SpiderGL wrapper from an existing object;
 * // the native object can be accessed through the "handle" property.
 * var wrappedVBO = new SpiderGL.WebGL.VertexBuffer(gl, {handle: vbo});
 * // it is not mandatory to bind the object before setting parameters or data
 * as the hijacked WebGLRendering context takes care of it and does not break previous bindings
 * wrappedVBO.setSize(sizeInBytes, gl.STATIC_DRAW);
 * wrappedVBO.bind(); // equivalent to gl.bindBuffer(gl.ARRAY_BUFFER, wrappedVBO.handle)
 * // create another SpiderGL.WebGL.VertexBuffer without specifying an existing object,
 * // thus letting the wrapper to create one
 * var anotherVBO = new SpiderGL.WebGL.VertexBuffer(gl, {size: someSizeInBytes});
 *
 * @class The SpiderGL.WebGL.ObjectGL is the base class for all WebGL object wrappers.
 *
 * @augments SpiderGL.Core.ObjectBase
 *
 * @param {WebGLRenderingContext} gl A WebGLRenderingContext hijacked with {@link SpiderGL.WebGL.Context.hijack}.
 * @param {number} target The WebObjectGL default target.
 * @param {object} [options] Object-specific parameters.
 */
SpiderGL.WebGL.ObjectGL = function (gl, target, options) {
	if (!SpiderGL.WebGL.Context.isHijacked(gl)) { return null; }

	options = SpiderGL.Utility.getDefaultObject({
		handle : null
	}, options);

	SpiderGL.Core.ObjectBase.call(this);

	var wn = gl.getExtension("SGL_wrapper_notify");

	this._gl  = gl;
	this._cb  = gl.getExtension("SGL_current_binding");
	this._dsa = gl.getExtension("SGL_direct_state_access");

	this._h = options.handle;
	this._t = target;
}

/**
 * Default WebObjectGL target.
 *
 * @type number
 *
 * @default WebGLRenderingContext.NONE
 */
SpiderGL.WebGL.ObjectGL.TARGET = WebGLRenderingContext.NONE;

/**
 * Generic null WebObjectGL binding.
 *
 * This function is empty and provided only for completeness.
 *
 * @param {WebGLRenderingContext} gl A WebGLRenderingContext.
 */
SpiderGL.WebGL.ObjectGL.unbind = function (gl) { };

SpiderGL.WebGL.ObjectGL.prototype = {
	/**
	 * The WebGLRenderingContext used at costruction.
	 *
	 * @type WebGLRenderingContext
	 *
	 * @readonly
	 *
	 * @see #handle
	 */
	get gl() {
		return this._gl;
	},

	/**
	 * The native WebObjectGL.
	 *
	 * The native handle can be used with WebGLRenderingContext methods.
	 *
	 * @type WebObjectGL
	 *
	 * @readonly
	 *
	 * @see #gl
	 */
	get handle() {
		return this._h;
	},

	/**
	 * The WebObjectGL default target.
	 *
	 * @type number
	 *
	 * @readonly
	 */
	get target() {
		return this._t;
	},

	/**
	 * Tests for non-null handle.
	 *
	 * @type bool
	 *
	 * @readonly
	 */
	get isValid() {
		return (this._h != null);
	},

	/* *
	 * Tests for empty object.
	 * It is reimplemented on each derived classes with object-specific semantic.
	 *
	 * @type bool
	 *
	 * @readonly
	 */
	/*
	get isEmpty () {
		return true;
	},
	*/

	/**
	 * Tests if the object is ready to use.
	 * It is reimplemented on each derived classes with object-specific semantic.
	 *
	 * @type bool
	 *
	 * @readonly
	 */
	get isReady () {
		return false;
	},

	/**
	 * Destroys the wrapped WebObjectGL.
	 * 
	 * After calling this method, the object must not be accessed anymore.
	 */
	destroy : function () {
	},

	/**
	 * Binds the object to the rendering pipeline.
	 * 
	 * The wrapped WebObjectGL is bound to its default target in the WebGLRenderingContext.
	 */
	bind : function () {
	},

	/**
	 * Binds the null object to the rendering pipeline.
	 * 
	 * This method is provided for symmetry with {@link SpiderGL.WebGL.ObjectGL#bind}. It binds the null object to the per-object webGL target.
	 */
	unbind : function () {
	}
};

SpiderGL.Type.extend(SpiderGL.WebGL.ObjectGL, SpiderGL.Core.ObjectBase);

/**
 * Creates a SpiderGL.WebGL.Buffer.
 *
 * SpiderGL.WebGL.Buffer is the base class for WebGLBuffer object wrappers ({@link SpiderGL.WebGL.VertexBuffer} and {@link SpiderGL.WebGL.IndexBuffer}) and must not be directly used.
 * When passing data or size with the options parameter, the data field will have precedence on the size field, which will be ignored.
 *
 * @class The SpiderGL.WebGL.Buffer is the base class for all WebGLBuffer object wrappers, i.e. {@link SpiderGL.WebGL.VertexBuffer} and {@link SpiderGL.WebGL.IndexBuffer}.
 *
 * @augments SpiderGL.WebGL.ObjectGL
 *
 * @param {WebGLRenderingContext} gl A WebGLRenderingContext hijacked with {@link SpiderGL.WebGL.Context.hijack}.
 * @param {number} target The WebGLBuffer target. It must be either WebGLRenderingContext.ARRAY_BUFFER or WebGLRenderingContext.ELEMENT_ARRAY_BUFFER.
 * @param {object} [options] Optional parameters.
 * @param {WebGLBuffer} [options.handle] If defined, the provided buffer will be wrapped and its size and usage attributes will be queried to the rendering context. Otherwise an internal buffer will be created.
 * @param {ArrayBuffer|ArrayBufferView} [options.data] Buffer content to be set with WebGLRenderingContext.bufferData (see {@link setData}). If present, the data will be set both if a handle is provided or internally created.
 * @param {number} [options.size] Buffer size to be set with WebGLRenderingContext.bufferData (see {@link setData}). If present, it will be set both if a handle is provided or internally created. If data parameter is present, the size field is ignored.
 * @param {number} [options.usage=SpiderGL.WebGL.Buffer.DEFAULT_USAGE] WebGL buffer usage hint parameter for WebGLRenderingContext.bufferData.
 *
 * @example
 * // create a vertex buffer with a specified size
 * var vbuff = new SpiderGL.WebGL.VertexBuffer(gl, {
 * 	size  : 2 * 1024 * 1024,  // 2 MB
 * 	usage : gl.STATIC_DRAW    // if omitted, defaults to SpiderGL.WebGL.Buffer.DEFAULT_USAGE
 * });
 *
 * // create an index buffer with content
 * var ibuff = new SpiderGL.WebGL.IndexBuffer(gl, {
 * 	data : new Uint16Array(...)  // use a typed array for setting buffer data
 * });
 *
 * @see SpiderGL.WebGL.ObjectGL
 * @see SpiderGL.WebGL.VertexBuffer
 * @see SpiderGL.WebGL.IndexBuffer
 */
SpiderGL.WebGL.Buffer = function (gl, target, options) {
	if (!SpiderGL.WebGL.Context.isHijacked(gl)) { return null; }

	if (SpiderGL.Type.instanceOf(options, WebGLBuffer)) {
		options = { handle : options };
	}
	else if (SpiderGL.Type.instanceOf(options, ArrayBuffer) || SpiderGL.Type.isTypedArray(options)) {
		options = { data : options };
	}
	else if (SpiderGL.Type.isNumber(options)) {
		options = { size : options };
	}

	options = SpiderGL.Utility.getDefaultObject({
		handle : null,
		data   : null,
		size   : 0,
		usage  : SpiderGL.WebGL.Buffer.DEFAULT_USAGE
	}, options);

	SpiderGL.WebGL.ObjectGL.call(this, gl, target, options);
	if (!!this._h && !!this._h._spidergl && (this._h._spidergl != this)) return this._h._spidergl;

	var gl  = this._gl;
	var cb  = this._cb;
	var dsa = this._dsa;

	var t = this._t;
	var h = this._h;

	cb.pushBuffer(t);
	if (h) {
		gl.bindBuffer(t, h);
		options.size  = gl.getBufferParameter(t, gl.BUFFER_SIZE);
		options.usage = gl.getBufferParameter(t, gl.BUFFER_USAGE);
	}
	else {
		h = gl.createBuffer();
		gl.bindBuffer(t, h);
		this._h = h;
	}
	cb.popBuffer(t);
	h._spidergl = this;

	this._size   = options.size;
	this._usage  = options.usage;

	if (options.data) {
		this.setData(options.data, options.usage);
	}
	else if (options.size) {
		this.setSize(options.size, options.usage);
	}
}

/**
 * Default WebGLBuffer target.
 *
 * @type number
 *
 * @default WebGLRenderingContext.NONE
 */
SpiderGL.WebGL.Buffer.TARGET = WebGLRenderingContext.NONE;

/**
 * Default usage hint when specifying buffer size or data.
 *
 * @type number
 *
 * @default WebGLRenderingContext.STATIC_DRAW
 */
SpiderGL.WebGL.Buffer.DEFAULT_USAGE = WebGLRenderingContext.STATIC_DRAW;

/**
 * Default buffer offset when specifying buffer subdata.
 *
 * @type number
 *
 * @default 0
 */
SpiderGL.WebGL.Buffer.DEFAULT_SUB_DATA_OFFSET = 0;

/**
 * Generic WebGLBuffer unbinding.
 *
 * This function is empty and it is provided only for completeness.
 *
 * @param  {WebGLRenderingContext} gl A WebGLRenderingContext.
 */
SpiderGL.WebGL.Buffer.unbind = function (gl) { };

SpiderGL.WebGL.Buffer.prototype = {
	_gl_deleteBuffer : function () {
		this._h = null;
	},

	_gl_isBuffer : function () {
	},

	_gl_bindBuffer : function () {
	},

	_gl_getBufferParameter : function () {
	},

	_gl_bufferData : function () {
		var sizeOrData = arguments[1];
		var usage = arguments[2];
		this._size = (SpiderGL.Type.isNumber(sizeOrData)) ? (sizeOrData) : (sizeOrData.byteLength);
		this._usage = usage;
	},

	_gl_bufferSubData : function () {
	},

	_gl_vertexAttribPointer : function () {
	},

	_gl_drawElements : function () {
	},

	/* *
	 * Tests for empty buffer.
	 * It is true if the buffer size is greather than zero, false otherwise.
	 *
	 * @type bool
	 *
	 * @readonly
	 */
	/*
	get isEmpty() { return (this._size <= 0); },
	*/

	/**
	 * Tests if the buffer is ready to use.
	 * A buffer is considered ready if its size is greater than zero.
	 *
	 * @type bool
	 *
	 * @readonly
	 */
	get isReady () {
		return (this._size > 0);
	},

	/**
	 * The size in bytes of the buffer.
	 *
	 * @type number
	 *
	 * @readonly
	 */
	get size() {
		return this._size;
	},

	/**
	 * The usage hint of the WebGLBuffer.
	 * It refers to the usage hint as specified in WebGLRenderingContext.bufferData().
	 *
	 * @type number
	 *
	 * @readonly
	 */
	get usage() {
		return this._usage;
	},

	/**
	 * Sets the buffer size and usage.
	 * The buffer is set up with specified size and usage.
	 *
	 * @param {number} size The buffer size.
	 * @param {number} [usage=SpiderGL.WebGL.Buffer.DEFAULT_USAGE] WebGL buffer usage hint.
	 *
	 * @see setData
	 */
	setSize : function (size, usage) {
		usage = SpiderGL.Utility.getDefaultValue(usage, SpiderGL.WebGL.Buffer.DEFAULT_USAGE);
		this._dsa.bufferData(this._h, this._t, size, usage);
	},

	/**
	 * Sets the buffer data and usage.
	 * The buffer is set up with specified data and usage.
	 *
	 * @param {ArrayBuffer|ArrayBufferView} data The buffer data.
	 * @param {number} [usage=SpiderGL.WebGL.Buffer.DEFAULT_USAGE] WebGL buffer usage hint.
	 *
	 * @see setSubData
	 * @see setSize
	 */
	setData : function (data, usage) {
		usage = SpiderGL.Utility.getDefaultValue(usage, SpiderGL.WebGL.Buffer.DEFAULT_USAGE);
		this._dsa.bufferData(this._h, this._t, data, usage);
	},

	/**
	 * Sets a range of the buffer data.
	 * A range of buffer content can be set by specifying the starting offset and the typed array of values.
	 *
	 * @param {ArrayBuffer|ArrayBufferView} data The buffer sub data.
	 * @param {number} [offset=SpiderGL.WebGL.Buffer.DEFAULT_SUB_DATA_OFFSET] The range starting offset, in bytes.
	 *
	 * @see setData
	 */
	setSubData : function (data, offset) {
		offset = SpiderGL.Utility.getDefaultValue(offset, SpiderGL.WebGL.Buffer.DEFAULT_SUB_DATA_OFFSET);
		this._dsa.bufferSubData(this._h, this._t, offset, data);
	},

	/**
	 * Destroys the WebGLBuffer.
	 * After destruction, the handle is set to null and this object should not be used anymore.
	 *
	 * @see SpiderGL.WebGL.ObjectGL#destroy
	 */
	destroy : function () {
		this._gl.deleteBuffer(this._h);
	},

	/**
	 * Binds the wrapped WebGLBuffer to the appropriate target.
	 * The used target is set by the derived objects {@link SpiderGL.WebGL.VertexBuffer} and {@link SpiderGL.WebGL.IndexBuffer}.
	 *
	 * @see unbind
	 */
	bind : function () {
		this._gl.bindBuffer(this._t, this._h);
	},

	/**
	 * Binds "null" to the appropriate target.
	 * This method is provided only for simmetry with {@link bind} and is not relative to the object state.
	 *
	 * @see bind
	 */
	unbind : function () {
		this._gl.bindBuffer(this._t, null);
	}
};

SpiderGL.Type.extend(SpiderGL.WebGL.Buffer, SpiderGL.WebGL.ObjectGL);

/**
 * Creates a SpiderGL.WebGL.VertexBuffer.
 *
 * SpiderGL.WebGL.VertexBuffer represents a wrapper for a WebGLBuffer to be bound to the WebGLRenderingContext.ARRAY_BUFFER target.
 *
 * @class The SpiderGL.WebGL.VertexBuffer is WebGLBuffer wrapper for vertex buffers.
 *
 * @augments SpiderGL.WebGL.Buffer
 *
 * @param {WebGLRenderingContext} gl A WebGLRenderingContext hijacked with {@link SpiderGL.WebGL.Context.hijack}.
 * @param {object} [options] See {@link SpiderGL.WebGL.Buffer}.
 *
 * @see SpiderGL.WebGL.Buffer
 * @see SpiderGL.WebGL.IndexBuffer
 * @see SpiderGL.WebGL.ObjectGL
 */
SpiderGL.WebGL.VertexBuffer = function (gl, options) {
	if (!SpiderGL.WebGL.Context.isHijacked(gl)) { return null; }
	SpiderGL.WebGL.Buffer.call(this, gl, SpiderGL.WebGL.VertexBuffer.TARGET, options);
	if (!!this._h && !!this._h._spidergl && (this._h._spidergl != this)) return this._h._spidergl;
}

/**
 * WebGL target for vertex buffers.
 *
 * @type number
 *
 * @default WebGLRenderingContext.ARRAY_BUFFER
 */
SpiderGL.WebGL.VertexBuffer.TARGET = WebGLRenderingContext.ARRAY_BUFFER;

/**
 * Default vertex attribute index when using SpiderGL.WebGL.VertexBuffer#vertexAttribPointer.
 *
 * @type number
 *
 * @default 0
 */
SpiderGL.WebGL.VertexBuffer.DEFAULT_ATTRIBUTE_INDEX = 0;

/**
 * Default vertex attribute size when using SpiderGL.WebGL.VertexBuffer#vertexAttribPointer.
 *
 * @type number
 *
 * @default 3
 */
SpiderGL.WebGL.VertexBuffer.DEFAULT_ATTRIBUTE_SIZE = 3;

/**
 * Default vertex attribute type when using SpiderGL.WebGL.VertexBuffer#vertexAttribPointer.
 *
 * @type number
 *
 * @default WebGLRenderingContext.FLOAT
 */
SpiderGL.WebGL.VertexBuffer.DEFAULT_ATTRIBUTE_TYPE = WebGLRenderingContext.FLOAT;

/**
 * Default vertex attribute normalized flag when using SpiderGL.WebGL.VertexBuffer#vertexAttribPointer.
 *
 * @type bool
 *
 * @default false
 */
SpiderGL.WebGL.VertexBuffer.DEFAULT_ATTRIBUTE_NORMALIZED = false;

/**
 * Default vertex attribute stride when using SpiderGL.WebGL.VertexBuffer#vertexAttribPointer.
 *
 * @type number
 *
 * @default 0
 */
SpiderGL.WebGL.VertexBuffer.DEFAULT_ATTRIBUTE_STRIDE = 0;

/**
 * Default vertex attribute offset when using SpiderGL.WebGL.VertexBuffer#vertexAttribPointer.
 *
 * @type number
 *
 * @default 0
 */
SpiderGL.WebGL.VertexBuffer.DEFAULT_ATTRIBUTE_OFFSET = 0;

/**
 * Default enable flag for vertex attribute when using SpiderGL.WebGL.VertexBuffer#vertexAttribPointer.
 *
 * @type bool
 *
 * @default true
 */
SpiderGL.WebGL.VertexBuffer.DEFAULT_ATTRIBUTE_ENABLE = true;

/**
 * WebGLBuffer unbinding for vertex buffers.
 *
 * This function binds the null buffer to the WebGLRenderingContext.ARRAY_BUFFER target.
 *
 * @param  {WebGLRenderingContext} gl A WebGLRenderingContext.
 */
SpiderGL.WebGL.VertexBuffer.unbind = function (gl) { gl.bindBuffer(SpiderGL.WebGL.VertexBuffer.TARGET, null); };

SpiderGL.WebGL.VertexBuffer.prototype = {
	/**
	 * Latches the WebGL vertex attribute pointer with the internal buffer.
	 * The effect of this method is to bind the SpiderGL.WebGL.VertexBuffer and call WebGLRenderingContext.vertexAttribPointer() with the provided parameters.
	 *
	 * @param {object} [options] Vertex attribute pointer parameters.
	 * @param {number} [options.index=SpiderGL.WebGL.VertexBuffer.DEFAULT_ATTRIBUTE_INDEX] Attribute index.
	 * @param {number} [options.size=SpiderGL.WebGL.VertexBuffer.DEFAULT_ATTRIBUTE_SIZE] Attribute size.
	 * @param {number} [options.type=SpiderGL.WebGL.VertexBuffer.DEFAULT_ATTRIBUTE_TYPE] Attribute base type.
	 * @param {number} [options.normalized=SpiderGL.WebGL.VertexBuffer.DEFAULT_ATTRIBUTE_NORMALIZED] True if the attribute has an integer type and must be normalized.
	 * @param {number} [options.stride=SpiderGL.WebGL.VertexBuffer.DEFAULT_ATTRIBUTE_STRIDE] Bytes from the beginning of an element and the beginning of the next one.
	 * @param {number} [options.offset=SpiderGL.WebGL.VertexBuffer.DEFAULT_ATTRIBUTE_OFFSET] Offset (in bytes) from the start of the buffer.
	 * @param {bool} [options.enable=SpiderGL.WebGL.VertexBuffer.DEFAULT_ATTRIBUTE_ENABLE] If true, the index-th vertex attribute array will be enabled with WebGLRenderingContext.enableVertexAttribArray(index).
	 *
	 * @example
	 * var vb = new SpiderGL.WebGL.VertexBuffer(...); // create a vertex buffer
	 * // [... set vb data ...]
	 * // calling vb.vertexAttribPointer has the same effect of:
	 * // vb.bind();
	 * // gl.vertexAttribPointer(positionAttributeIndex, 3, gl.FLOAT, false, 0, 0);
	 * // gl.enableVertexAttribArray(positionAttributeIndex);
	 * vb.vertexAttribPointer({
	 * 	index      : positionAttributeIndex,  // if omitted, defaults to SpiderGL.WebGL.VertexBuffer.DEFAULT_ATTRIBUTE_INDEX
	 * 	size       : 3,         // if omitted, defaults to SpiderGL.WebGL.VertexBuffer.DEFAULT_ATTRIBUTE_SIZE
	 * 	glType     : gl.FLOAT,  // if omitted, defaults to SpiderGL.WebGL.VertexBuffer.DEFAULT_ATTRIBUTE_TYPE
	 * 	normalized : false,     // if omitted, defaults to SpiderGL.WebGL.VertexBuffer.DEFAULT_ATTRIBUTE_NORMALIZED
	 * 	stride     : 0,         // if omitted, defaults to SpiderGL.WebGL.VertexBuffer.DEFAULT_ATTRIBUTE_STRIDE
	 * 	offset     : 0,         // if omitted, defaults to SpiderGL.WebGL.VertexBuffer.DEFAULT_ATTRIBUTE_OFFSET
	 * 	enable     : true       // if omitted, defaults to SpiderGL.WebGL.VertexBuffer.DEFAULT_ATTRIBUTE_ENABLE
	 * });
	 */
	vertexAttribPointer : function (options) {
		options = SpiderGL.Utility.getDefaultObject({
			index      : SpiderGL.WebGL.VertexBuffer.DEFAULT_ATTRIBUTE_INDEX,
			size       : SpiderGL.WebGL.VertexBuffer.DEFAULT_ATTRIBUTE_SIZE,
			glType     : SpiderGL.WebGL.VertexBuffer.DEFAULT_ATTRIBUTE_TYPE,
			normalized : SpiderGL.WebGL.VertexBuffer.DEFAULT_ATTRIBUTE_NORMALIZED,
			stride     : SpiderGL.WebGL.VertexBuffer.DEFAULT_ATTRIBUTE_STRIDE,
			offset     : SpiderGL.WebGL.VertexBuffer.DEFAULT_ATTRIBUTE_OFFSET,
			enable     : SpiderGL.WebGL.VertexBuffer.DEFAULT_ATTRIBUTE_ENABLE
		}, options);

		this._dsa.vertexAttribPointer(this._h, options.index, options.size, options.glType, options.normalized, options.stride, options.offset);
		if (options.enable) {
			this._gl.enableVertexAttribArray(options.index);
		}
	}
};

SpiderGL.Type.extend(SpiderGL.WebGL.VertexBuffer, SpiderGL.WebGL.Buffer);


/**
 * Creates a SpiderGL.WebGL.IndexBuffer.
 *
 * SpiderGL.WebGL.IndexBuffer represents a wrapper for a WebGLBuffer to be bound to the WebGLRenderingContext.ELEMENT_ARRAY_BUFFER target.
 *
 * @class The SpiderGL.WebGL.IndexBuffer is WebGLBuffer wrapper for index buffers.
 *
 * @augments SpiderGL.WebGL.Buffer
 *
 * @param {WebGLRenderingContext} gl A WebGLRenderingContext hijacked with {@link SpiderGL.WebGL.Context.hijack}.
 * @param {object} [options] See {@link SpiderGL.WebGL.Buffer}.
 *
 * @see SpiderGL.WebGL.Buffer
 * @see SpiderGL.WebGL.VertexBuffer
 * @see SpiderGL.WebGL.ObjectGL
 */
SpiderGL.WebGL.IndexBuffer = function (gl, options) {
	if (!SpiderGL.WebGL.Context.isHijacked(gl)) { return null; }
	SpiderGL.WebGL.Buffer.call(this, gl, SpiderGL.WebGL.IndexBuffer.TARGET, options);
	if (!!this._h && !!this._h._spidergl && (this._h._spidergl != this)) return this._h._spidergl;
}

/**
 * WebGL target for index buffers.
 *
 * @type number
 *
 * @default WebGLRenderingContext.ELEMENT_ARRAY_BUFFER
 */
SpiderGL.WebGL.IndexBuffer.TARGET = WebGLRenderingContext.ELEMENT_ARRAY_BUFFER;

/**
 * Default elements draw mode when using SpiderGL.WebGL.IndexBuffer#drawElements.
 *
 * @type number
 *
 * @default WebGLRenderingContext.TRIANGLES
 */
SpiderGL.WebGL.IndexBuffer.DEFAULT_DRAW_ELEMENTS_MODE  = WebGLRenderingContext.TRIANGLES;

/**
 * Default elements count when using SpiderGL.WebGL.IndexBuffer#drawElements.
 * A negative value causes the calculation of the maximum number of elements given the buffer size, offset and index type.
 *
 * @type number
 *
 * @default -1
 */
SpiderGL.WebGL.IndexBuffer.DEFAULT_DRAW_ELEMENTS_COUNT  = -1;

/**
 * Default index type when using SpiderGL.WebGL.IndexBuffer#drawElements.
 *
 * @type number
 *
 * @default WebGLRenderingContext.UNSIGNED_SHORT
 */
SpiderGL.WebGL.IndexBuffer.DEFAULT_DRAW_ELEMENTS_TYPE = WebGLRenderingContext.UNSIGNED_SHORT;

/**
 * Default index buffer offset when using SpiderGL.WebGL.IndexBuffer#drawElements.
 *
 * @type number
 *
 * @default 0
 */
SpiderGL.WebGL.IndexBuffer.DEFAULT_DRAW_ELEMENTS_OFFSET = 0;

/**
 * WebGLBuffer unbinding for index buffers.
 *
 * This function binds the null buffer to the WebGLRenderingContext.ELEMENT_ARRAY_BUFFER target.
 *
 * @param  {WebGLRenderingContext} gl A WebGLRenderingContext.
 */
SpiderGL.WebGL.IndexBuffer.unbind = function (gl) { gl.bindBuffer(SpiderGL.WebGL.IndexBuffer.TARGET, null); };

SpiderGL.WebGL.IndexBuffer.prototype = {
	/**
	 * Binds the index buffers and calls WebGLRenderingContext.drawElements with the provided parameters.
	 *
	 * @param {object} [options] Draw parameters.
	 * @param {number} [options.glMode=SpiderGL.WebGL.IndexBuffer.DEFAULT_DRAW_ELEMENTS_MODE] The WebGL primitive type.
	 * @param {number} [options.count=SpiderGL.WebGL.IndexBuffer.DEFAULT_DRAW_ELEMENTS_COUNT] Number of elements to draw. If less than or equal to zero, its value will be calculated as the maximum number of stored indices, based on offset, buffer size and index type.
	 * @param {number} [options.glType=SpiderGL.WebGL.IndexBuffer.DEFAULT_DRAW_ELEMENTS_TYPE] Index type.
	 * @param {number} [options.offset=SpiderGL.WebGL.IndexBuffer.DEFAULT_DRAW_ELEMENTS_OFFSET] Offset (in bytes) from the start of the buffer.
	 *
	 * @example
	 * var ib = new SpiderGL.WebGL.IndexBuffer(...); // create an index buffer
	 * // [... set ib data ...]
	 * // calling ib.drawElements has the same effect of:
	 * // ib.bind();
	 * // gl.drawElements(gl.TRIANGLES, (ib.size - offset) / SpiderGL.Type.SIZEOF_UINT16, gl.UNSIGNED_SHORT, offset);
	 * ib.drawElements({
	 * 	glMode : gl.TRIANGLES,       // if omitted, defaults to SpiderGL.WebGL.IndexBuffer.DEFAULT_DRAW_ELEMENTS_MODE
	 * 	count  : 0,                  // if omitted, defaults to SpiderGL.WebGL.IndexBuffer.DEFAULT_DRAW_ELEMENTS_COUNT
	 * 	glType : gl.UNSIGNED_SHORT,  // if omitted, defaults to SpiderGL.WebGL.IndexBuffer.DEFAULT_DRAW_ELEMENTS_TYPE
	 * 	offset : offset              // if omitted, defaults to SpiderGL.WebGL.IndexBuffer.DEFAULT_DRAW_ELEMENTS_OFFSET
	 * });
	 */
	drawElements : function (options) {
		options = SpiderGL.Utility.getDefaultObject({
			glMode : SpiderGL.WebGL.IndexBuffer.DEFAULT_DRAW_ELEMENTS_MODE,
			count  : SpiderGL.WebGL.IndexBuffer.DEFAULT_DRAW_ELEMENTS_COUNT,
			glType : SpiderGL.WebGL.IndexBuffer.DEFAULT_DRAW_ELEMENTS_TYPE,
			offset : SpiderGL.WebGL.IndexBuffer.DEFAULT_DRAW_ELEMENTS_OFFSET
		}, options);

		if (options.count < 1) {
			var bytesPerElem = SpiderGL.Type.typeSizeFromGL(options.glType);
			options.count = (this._size - options.offset) / bytesPerElem;
		}

		this._dsa.drawElements(this._h, options.glMode, options.count, options.glType, options.offset);
	}
};

SpiderGL.Type.extend(SpiderGL.WebGL.IndexBuffer, SpiderGL.WebGL.Buffer);

/**
 * Creates a SpiderGL.WebGL.Framebuffer.
 *
 * SpiderGL.WebGL.Framebuffer wraps a WebGLFramebuffer object.
 *
 * @class The SpiderGL.WebGL.Framebuffer is a wrapper for WebGLFramebuffer.
 *
 * @augments SpiderGL.WebGL.ObjectGL
 *
 * @param {WebGLRenderingContext} gl A WebGLRenderingContext hijacked with {@link SpiderGL.WebGL.Context.hijack}.
 * @param {object} [options] Optional parameters.
 * @param {WebGLFramebuffer} [options.handle] A WebGLFramebuffer. If present, this object will be used as the wrapped WebGLFramebuffer. Otherwise a new one will be created.
 * @param {bool} [options.autoViewport=SpiderGL.WebGL.Framebuffer.DEFAULT_AUTO_VIEWPORT] The value of the {@link autoViewport} property.
 * @param {object} [options.color] Color attachment target (see {@link setAttachments}).
 * @param {object} [options.depth] Depth attachment target (see {@link setAttachments}).
 * @param {object} [options.stencil] Stencil attachment target (see {@link setAttachments}).
 * @param {object} [options.depthStencil] Depth-Stencil attachment target (see {@link setAttachments}).
 *
 * @see setAttachments
 * @see SpiderGL.WebGL.Texture2D
 * @see SpiderGL.WebGL.TextureCubeMap
 * @see SpiderGL.WebGL.Renderbuffer
 * @see SpiderGL.WebGL.ObjectGL
 */
SpiderGL.WebGL.Framebuffer = function (gl, options) {
	if (!SpiderGL.WebGL.Context.isHijacked(gl)) { return null; }

	if (SpiderGL.Type.instanceOf(options, WebGLFramebuffer)) {
		options = { handle : options };
	}

	options = SpiderGL.Utility.getDefaultObject({
		handle       : null,
		autoViewport : SpiderGL.WebGL.Framebuffer.DEFAULT_AUTO_VIEWPORT
	}, options);

	var that = SpiderGL.WebGL.ObjectGL.call(this, gl, SpiderGL.WebGL.Framebuffer.TARGET, options);
	if (!!this._h && !!this._h._spidergl && (this._h._spidergl != this)) return this._h._spidergl;

	var gl  = this._gl;
	var cb  = this._cb;
	var dsa = this._dsa;

	var t = this._t;
	var h = this._h;

	var imported = false;
	if (h) {
		imported = true;
	}
	else {
		h = gl.createFramebuffer();
		this._h = h;
	}
	h._spidergl = this;

	this._attachments  = { };
	this._status       = 0;
	this._autoViewport = options.autoViewport;
	this._viewport     = [ 0, 0, 1, 1 ];

	cb.pushFramebuffer(t);
	gl.bindFramebuffer(t, h);

	if (imported) {
		var resource = null;
		var type     = 0;
		var level    = 0;
		var target   = 0;

		for (var attachment in SpiderGL.WebGL.Framebuffer._attachmentName) {
			resource = gl.getFramebufferAttachmentParameter(t, att, gl.FRAMEBUFFER_ATTACHMENT_OBJECT_NAME);
			type     = gl.getFramebufferAttachmentParameter(t, att, gl.FRAMEBUFFER_ATTACHMENT_OBJECT_TYPE);
			switch (type) {
				case gl.RENDERBUFFER:
					target = gl.RENDERBUFFER;
					this._importRenderbuffer(t, attachment, target, resource);
				break;
				case gl.TEXTURE:
					level  = gl.getFramebufferAttachmentParameter(t, att, gl.FRAMEBUFFER_ATTACHMENT_TEXTURE_LEVEL);
					target = gl.getFramebufferAttachmentParameter(t, att, gl.FRAMEBUFFER_ATTACHMENT_TEXTURE_CUBE_MAP_FACE);
					if (target == 0) target = gl.TEXTURE_2D;
					this._importTexture(t, attachment, target, resource, level);
				break;
				default: break;
			}
		}
	}

	this._status = gl.checkFramebufferStatus(t);

	cb.popFramebuffer(t);

	this.setAttachments(options);
}

/**
 * WebGL target for framebuffers.
 *
 * @type number
 *
 * @default WebGLRenderingContext.FRAMEBUFFER
 */
SpiderGL.WebGL.Framebuffer.TARGET = WebGLRenderingContext.FRAMEBUFFER;

/**
 * Default value for SpiderGL.WebGL.Framebuffer#autoViewport.
 *
 * @type bool
 *
 * @default true
 */
SpiderGL.WebGL.Framebuffer.DEFAULT_AUTO_VIEWPORT = true;

/**
 * Default texture level to attach when using SpiderGL.WebGL.Framebuffer#setAttachments.
 *
 * @type number
 *
 * @default 0
 */
SpiderGL.WebGL.Framebuffer.DEFAULT_ATTACHMENT_TEXTURE_LEVEL = 0;

/**
 * Default texture cube map face to attach when using SpiderGL.WebGL.Framebuffer#setAttachments.
 *
 * @type number
 *
 * @default WebGLRenderingContext.TEXTURE_CUBE_MAP_POSITIVE_X
 */
SpiderGL.WebGL.Framebuffer.DEFAULT_ATTACHMENT_CUBE_MAP_FACE = WebGLRenderingContext.TEXTURE_CUBE_MAP_POSITIVE_X;

/**
 * Default read rectangle left coordinate (in pixels).
 *
 * @type number
 *
 * @default 0
 *
 * @see SpiderGL.WebGL.Framebuffer#readPixels
 */
SpiderGL.WebGL.Framebuffer.DEFAULT_READ_PIXELS_X = 0;

/**
 * Default read rectangle bottom coordinate (in pixels).
 *
 * @type number
 *
 * @default 0
 *
 * @see SpiderGL.WebGL.Framebuffer#readPixels
 */
SpiderGL.WebGL.Framebuffer.DEFAULT_READ_PIXELS_Y = 0;

/**
 * Default read rectangle width (in pixels).
 * If less than zero, the width will be set to span the whole render target (starting from read rectangle x coordinate).
 *
 * @type number
 *
 * @default -1
 *
 * @see SpiderGL.WebGL.Framebuffer#readPixels
 */
SpiderGL.WebGL.Framebuffer.DEFAULT_READ_PIXELS_WIDTH = -1;

/**
 * Default read rectangle height (in pixels).
 * If less than zero, the height will be set to span the whole render target (starting from read rectangle y coordinate).
 *
 * @type number
 *
 * @default -1
 *
 * @see SpiderGL.WebGL.Framebuffer#readPixels
 */
SpiderGL.WebGL.Framebuffer.DEFAULT_READ_PIXELS_HEIGHT = -1;

/**
 * The WebGL pixel format for reading framebuffer pixels.
 *
 * @type number
 *
 * @default WebGLRenderingContext.RGBA
 *
 * @see SpiderGL.WebGL.Framebuffer#readPixels
 */
SpiderGL.WebGL.Framebuffer.DEFAULT_READ_PIXELS_FORMAT = WebGLRenderingContext.RGBA;

/**
 * The WebGL birfield mask used for clearing the framebuffer.
 *
 * @type number
 *
 * @default (WebGLRenderingContext.COLOR_BUFFER_BIT | WebGLRenderingContext.DEPTH_BUFFER_BIT | WebGLRenderingContext.STENCIL_BUFFER_BIT)
 *
 * @see SpiderGL.WebGL.Framebuffer#clear
 */
SpiderGL.WebGL.Framebuffer.DEFAULT_CLEAR_MASK = (WebGLRenderingContext.COLOR_BUFFER_BIT | WebGLRenderingContext.DEPTH_BUFFER_BIT | WebGLRenderingContext.STENCIL_BUFFER_BIT);

/**
 * The WebGL pixel type for reading framebuffer pixels.
 *
 * @type number
 *
 * @default WebGLRenderingContext.UNSIGNED_BYTE
 *
 * @see SpiderGL.WebGL.Framebuffer#readPixels
 */
SpiderGL.WebGL.Framebuffer.DEFAULT_READ_PIXELS_TYPE = WebGLRenderingContext.UNSIGNED_BYTE;

/**
 * WebGLFramebuffer unbinding.
 *
 * This function binds the null framebuffer to the WebGLRenderingContext.FRAMEBUFFER target.
 *
 * @param  {WebGLRenderingContext} gl A WebGLRenderingContext.
 */
SpiderGL.WebGL.Framebuffer.unbind = function (gl) { gl.bindFramebuffer(SpiderGL.WebGL.Framebuffer.TARGET, null); };

SpiderGL.WebGL.Framebuffer._attachmentName = { };
SpiderGL.WebGL.Framebuffer._attachmentName[WebGLRenderingContext.COLOR_ATTACHMENT0]        = "color";
SpiderGL.WebGL.Framebuffer._attachmentName[WebGLRenderingContext.DEPTH_ATTACHMENT]         = "depth";
SpiderGL.WebGL.Framebuffer._attachmentName[WebGLRenderingContext.STENCIL_ATTACHMENT]       = "stencil";
SpiderGL.WebGL.Framebuffer._attachmentName[WebGLRenderingContext.DEPTH_STENCIL_ATTACHMENT] = "depthStencil";

SpiderGL.WebGL.Framebuffer.prototype = {
	_gl_deleteFramebuffer : function (framebuffer) {
		this._h = null;
	},

	_gl_isFramebuffer : function (framebuffer) {
	},

	_gl_bindFramebuffer : function (target, framebuffer) {
	},

	_gl_checkFramebufferStatus : function (target) {
	},

	_gl_getFramebufferAttachmentParameter : function (target, attachment, pname) {
	},

	_gl_framebufferRenderbuffer : function (target, attachment, renderbuffertarget, renderbuffer) {
		this._importRenderbuffer.apply(this, arguments);
		this._status = this._gl.checkFramebufferStatus(this._t);
	},

	_gl_framebufferTexture2D : function (target, attachment, textarget, texture, level) {
		this._importTexture.apply(this, arguments);
		this._status = this._gl.checkFramebufferStatus(this._t);
	},

	_gl_clear : function (mask) {
	},

	_gl_readPixels : function (x, y, width, height, format, type, pixels) {
	},

	_importTexture : function (target, attachment, textarget, texture, level) {
		var name = SpiderGL.WebGL.Framebuffer._attachmentName[attachment];
		if (!name) return;

		if (!texture) {
			delete this._attachments[name];
			return;
		}

		var gl = this._gl;

		var att = {
			attachment : attachment,
			resource   : null,
			target     : textarget,
			level      : level,
			face       : gl.NONE
		};

		this._attachments[name] = att;

		if (textarget == gl.TEXTURE_2D) {
			att.resource = new SpiderGL.WebGL.Texture2D(gl, { handle : texture });
		}
		else {
			att.resource = new SpiderGL.WebGL.TextureCubeMap(gl, { handle : texture });
			att.face     = textarget;
		}

		this._viewport = [ 0, 0, SpiderGL.Math.max(att.resource.width, 1), SpiderGL.Math.max(att.resource.height, 1) ];
	},

	_importRenderbuffer : function (target, attachment, renderbuffertarget, renderbuffer) {
		var name = SpiderGL.WebGL.Framebuffer._attachmentName[attachment];
		if (!name) return;

		if (!renderbuffer) {
			delete this._attachments[name];
			return;
		}

		var gl = this._gl;

		var att = {
			attachment : attachment,
			resource   : null,
			target     : renderbuffertarget,
			level      : 0,
			face       : gl.NONE
		};

		this._attachments[name] = att;

		att.resource = new SpiderGL.WebGL.Renderbuffer(gl, { handle : renderbuffer });

		this._viewport = [ 0, 0, SpiderGL.Math.max(att.resource.width, 1), SpiderGL.Math.max(att.resource.height, 1) ];
	},

	_setAttachment : function (attachment, nfo) {
		var name = SpiderGL.WebGL.Framebuffer._attachmentName[attachment];
		if (!name) return false;

		var gl = this._gl;

		var isNullResource = (!nfo || (("resource" in nfo) && !nfo.resource));
		if  (isNullResource) {
			var att = this._attachments[name];
			if (att) {
				if (att.target === gl.RENDERBUFFER) {
					gl.framebufferRenderbuffer(t, att.attachment, gl.RENDERBUFFER, null);
				}
				else {
					gl.framebufferTexture2D(t, att.attachment, gl.TEXTURE_2D, null, 0);
				}
			}
			return;
		}

		var resourceType = gl.NONE;

		if (SpiderGL.Type.instanceOf(nfo, WebGLTexture)) {
			nfo = { resource : nfo };
			resourceType = gl.TEXTURE;
		}
		else if (SpiderGL.Type.instanceOf(nfo, WebGLRenderbuffer)) {
			nfo = { resource : nfo };
			resourceType = gl.RENDERBUFFER;
		}
		else if (SpiderGL.Type.instanceOf(nfo, SpiderGL.WebGL.Texture)) {
			nfo = { resource : nfo.handle };
			resourceType = gl.TEXTURE;
		}
		else if (SpiderGL.Type.instanceOf(nfo, SpiderGL.WebGL.Renderbuffer)) {
			nfo = { resource : nfo.handle };
			resourceType = gl.RENDERBUFFER;
		}

		var cubeFaceSpecified = !!nfo && (typeof (nfo.face) != "undefined");

		nfo = SpiderGL.Utility.getDefaultObject({
			resource : null,
			level    : SpiderGL.WebGL.Framebuffer.DEFAULT_ATTACHMENT_TEXTURE_LEVEL,
			face     : SpiderGL.WebGL.Framebuffer.DEFAULT_ATTACHMENT_CUBE_MAP_FACE
		}, nfo);

		var t = this._t;

		switch (resourceType) {
			case gl.TEXTURE:
				var isCubemap = SpiderGL.Type.instanceOf(nfo, SpiderGL.WebGL.TextureCubeMap) || cubeFaceSpecified;
				var target = (isCubemap) ? (nfo.face) : (gl.TEXTURE_2D);
				gl.framebufferTexture2D(t, attachment, target, nfo.resource, nfo.level);
			break;
			case gl.RENDERBUFFER:
				gl.framebufferRenderbuffer(t, attachment, gl.RENDERBUFFER, nfo.resource);
			break;
			default: break;
		}

		return true;
	},

	/*
	get isEmpty () {
		return (
			!this._attachments.color        &&
			!this._attachments.depth        &&
			!this._attachments.stencil      &&
			!this._attachments.depthStencil
		);
	},
	*/

	/**
	 * Tests if the framebuffer is ready to use.
	 * A framebuffer is considered ready if its status is WebGLRenderingContext.FRAMEBUFFER_COMPLETE.
	 *
	 * @type bool
	 *
	 * @readonly
	 *
	 * @see isComplete
	 */
	get isReady () {
		return this.isComplete;
	},

	/**
	 * The WebGL status of the framebuffer.
	 *
	 * @type number
	 *
	 * @readonly
	 *
	 * @see isComplete
	 */
	get status() {
		return this._status;
	},

	/**
	 * Indicates if the the status of the framebuffer is WebGLRenderingContext.FRAMEBUFFER_COMPLETE.
	 *
	 * @type number
	 *
	 * @readonly
	 */
	get isComplete() {
		return (this._status === this._gl.FRAMEBUFFER_COMPLETE);
	},

	/**
	 * Gets a 4-component array with the viewport parameters.
	 *
	 * Viewport parameters are stored as [0, 0, width, height] and will be set using WebGLRenderingContext.viewport() during a {@link bind} call if {@link autoViewport} is true.
	 * The width and height parameters corresponds to the width and height of the last resource attached with {@link setAttachments}.
	 *
	 * @type array
	 *
	 * @readonly
	 *
	 * @see autoViewport
	 * @see setAttachments
	 */
	get viewport() {
		return this._viewport.slice();
	},

	/**
	 * Gets the width of the attached resources.
	 *
	 * The value represents the width of the attached resources.
	 * It is equal to viewport[2].
	 *
	 * @type number
	 *
	 * @readonly
	 *
	 * @see height
	 * @see viewport
	 */
	get width() {
		return this._viewport[2];
	},

	/**
	 * Gets the height of the attached resources.
	 *
	 * The value represents the height of the attached resources.
	 * It is equal to viewport[3].
	 *
	 * @type number
	 *
	 * @readonly
	 *
	 * @see width
	 * @see viewport
	 */
	get height() {
		return this._viewport[3];
	},

	/**
	 * Automatic viewport settings in a call to {@link bind}.
	 *
	 * If true, when calling {@link bind} the viewport will be set with a call to WebGLRenderingContext.viewport().
	 *
	 * @type bool
	 */
	get autoViewport() {
		return this._autoViewport;
	},

	set autoViewport(on) {
		this._autoViewport = !!on;
	},

	/**
	 * Sets the framebuffer attachments.
	 * It is used to attach resources (SpiderGL.WebGL.Texture2D, SpiderGL.WebGL.TextureCubeMap or SpiderGL.WebGL.Renderbuffer) as render targets.
	 *
	 * @param {object} attachments The resources to attach to the WebGLFramebuffer.
	 * @param {object|SpiderGL.WebGL.Texture2D|SpiderGL.WebGL.TextureCubeMap|SpiderGL.WebGL.Renderbuffer} [attachments.color] The color attachment for target WebGLRenderingContext.COLOR_ATTACHMENT0; if omitted, the current color attachment is kept; if null, the current color attachment is detached.
	 * @param {SpiderGL.WebGL.Texture2D|SpiderGL.WebGL.TextureCubeMap|SpiderGL.WebGL.Renderbuffer} [attachments.color.resource] The resource to use as a render target for color attachment.
	 * @param {number} [attachments.color.level=SpiderGL.WebGL.Framebuffer.DEFAULT_ATTACHMENT_TEXTURE_LEVEL] If resource is SpiderGL.WebGL.Texture2D or SpiderGL.WebGL.TextureCubeMap, specifies the texture level to attach. As per WebGL specifications, level must be zero.
	 * @param {number} [attachments.color.face=SpiderGL.WebGL.Framebuffer.DEFAULT_ATTACHMENT_CUBE_MAP_FACE] If resource is SpiderGL.WebGL.TextureCubeMap, specifies the texture cube map face to attach.
	 * @param {object|SpiderGL.WebGL.Renderbuffer} [attachments.depth] Same as attachments.color but for WebGLRenderingContext.DEPTH_ATTACHMENT. To ensure the restrictions of the WebGL specifications, stencil and depthStencil attachments are detached.
	 * @param {object|SpiderGL.WebGL.Renderbuffer} [attachments.stencil] Same as attachments.color but for WebGLRenderingContext.STENCIL_ATTACHMENT. To ensure the restrictions of the WebGL specifications, depth and depthStencil attachments are detached.
	 * @param {object|SpiderGL.WebGL.Renderbuffer} [attachments.depthStencil] Same as attachments.color but for WebGLRenderingContext.DEPTH_STENCIL_ATTACHMENT. To ensure the restrictions of the WebGL specifications, depth and stencil attachments are detached.
	 *
	 * @returns {bool} True if the framebuffer is complete, false otherwise.
	 *
	 * @example
	 * var t2D = new SpiderGL.WebGL.Texture2D(...);
	 * var tCM = new SpiderGL.WebGL.TextureCubeMap(...);
	 * var rb  = new SpiderGL.WebGL.Renderbuffer(...);
	 *
	 * var fb = new SpiderGL.WebGL.Framebuffer(gl, {
	 * 	color : {resource: t2D, level: 0 }, // alternatively: color: t2D; in this case level would default to SpiderGL.WebGL.Framebuffer.DEFAULT_ATTACHMENT_TEXTURE_LEVEL
	 * 	depth : rb                          // alternatively: depth: {resource: rb}; renderbuffers do not have mipmap levels
	 * };
	 * // use fb
	 * // ...
	 * 
	 * // change attachment
	 * fb.setAttachments({
	 * 	color: {resource: tCM, face: gl.TEXTURE_CUBE_MAP_NEGATIVE_Z} // if face is omitted, defaults to SpiderGL.WebGL.Framebuffer.DEFAULT_ATTACHMENT_CUBE_MAP_FACE
	 * })
	 *
	 * @see getAttachments
	 */
	setAttachments : function (attachments) {
		attachments = attachments || { };

		var gl = this._gl;
		var cb = this._cb;

		var t = this._t;
		var h = this._h;

		cb.pushFramebuffer(t);
		gl.bindFramebuffer(t, h);

		if ("color" in attachments) {
			this._setAttachment(gl.COLOR_ATTACHMENT0, attachments.color);
		}

		if ("depthStencil" in attachments) {
			this._setAttachment(gl.DEPTH_ATTACHMENT,         null                    );
			this._setAttachment(gl.STENCIL_ATTACHMENT,       null                    );
			this._setAttachment(gl.DEPTH_STENCIL_ATTACHMENT, attachments.depthStencil);
		}
		else if ("depth" in attachments) {
			this._setAttachment(gl.DEPTH_STENCIL_ATTACHMENT, null                    );
			this._setAttachment(gl.STENCIL_ATTACHMENT,       null                    );
			this._setAttachment(gl.DEPTH_ATTACHMENT,         attachments.depth       );
		}
		else if ("stencil" in attachments) {
			this._setAttachment(gl.DEPTH_STENCIL_ATTACHMENT, null                    );
			this._setAttachment(gl.DEPTH_ATTACHMENT,         null                    );
			this._setAttachment(gl.STENCIL_ATTACHMENT,       attachments.stencil     );
		}

		this._status = gl.checkFramebufferStatus(t);

		cb.popFramebuffer(t);

		return this.isComplete;
	},

	/**
	 * Retrieves the attached resources.
	 * This method returns a new object containing the attachments information.
	 *
	 * @returns {object} The attachments data. The object fields may be: color, depth, stencil and depthStencil.
	 *
	 * @see setAttachments
	 */
	getAttachments : function () {
		var rAtts = { };
		var att   = null;
		for (var a in this._attachments) {
			att = this._attachments[a];
			rAtts[a] = {
				attachment : att.attachment,
				resource   : att.resource,
				target     : att.target,
				level      : att.level
			};
		}
		return rAtts;
	},

	/**
	 * Detaches all attached resources.
	 *
	 * @see setAttachments
	 */
	detachAll : function () {
		this.setAttachments({
			color        : null,
			depthStencil : null
		});
	},

	/**
	 * Gets/Sets the resource attached to the color attachment.
	 * If no resource is attached the result is null.
	 * When setting, default attaching parameters are used.
	 *
	 * @type SpiderGL.WebGL.Texture|SpiderGL.WebGL.Renderbuffer
	 *
	 * @readonly
	 *
	 * @see depthTarget
	 * @see stencilTarget
	 * @see depthStencilTarget
	 */
	get colorTarget() {
		var att = this._attachments.color;
		if (!att) return null
		return att.resource;
	},

	set colorTarget(rt) {
		this.setAttachments({ color : rt });
	},

	/**
	 * Gets/Sets the resource attached to the depth attachment.
	 * If no resource is attached the result is null.
	 * When setting, default attaching parameters are used.
	 *
	 * @type SpiderGL.WebGL.Texture|SpiderGL.WebGL.Renderbuffer
	 *
	 * @readonly
	 *
	 * @see colorTarget
	 * @see stencilTarget
	 * @see depthStencilTarget
	 */
	get depthTarget() {
		var att = this._attachments.depth;
		if (!att) return null
		return att.resource;
	},

	set depthTarget(rt) {
		this.setAttachments({ depth : rt });
	},

	/**
	 * Gets/Sets the resource attached to the stencil attachment.
	 * If no resource is attached the result is null.
	 * When setting, default attaching parameters are used.
	 *
	 * @type SpiderGL.WebGL.Texture|SpiderGL.WebGL.Renderbuffer
	 *
	 * @readonly
	 *
	 * @see colorTarget
	 * @see depthTarget
	 * @see depthStencilTarget
	 */
	get stencilTarget() {
		var att = this._attachments.stencil;
		if (!att) return null
		return att.resource;
	},

	set stencilTarget(rt) {
		this.setAttachments({ stencil : rt });
	},

	/**
	 * Gets/Sets the resource attached to the depthStencil attachment.
	 * If no resource is attached the result is null.
	 * When setting, default attaching parameters are used.
	 *
	 * @type SpiderGL.WebGL.Texture|SpiderGL.WebGL.Renderbuffer
	 *
	 * @readonly
	 *
	 * @see colorTarget
	 * @see depthTarget
	 * @see stencilTarget
	 */
	get depthStencilTarget() {
		var att = this._attachments.depthStencil;
		if (!att) return null
		return att.resource;
	},

	set depthStencilTarget(rt) {
		this.setAttachments({ depthStencil : rt });
	},

	/**
	 * Clears the framebuffer using current clear values.
	 *
	 * @param {number} mask The clear mask as for WebGLRenderingContext.clear.
	 */
	clear : function (mask) {
		mask = SpiderGL.Utility.getDefaultValue(mask, SpiderGL.WebGL.Framebuffer.DEFAULT_CLEAR_MASK);
		this._dsa.clear(this._h, mask);
	},

	/**
	 * Reads the pixels from a rectangular region of the framebuffer.
	 *
	 * @param {ArrayBufferView} buffer The destination buffer in which pixels will be written.
	 * @param {object} [options] Optional parameters.
	 * @param {number} [options.x=SpiderGL.WebGL.Framebuffer.DEFAULT_READ_PIXELS_X] The rectangle left coordinate (in pixels).
	 * @param {number} [options.y=SpiderGL.WebGL.Framebuffer.DEFAULT_READ_PIXELS_X] The rectangle bottom coordinate (in pixels).
	 * @param {number} [options.width=SpiderGL.WebGL.Framebuffer.DEFAULT_READ_PIXELS_WIDTH] The rectangle width (in pixels). If less than zero, the width will be set to span the whole render target (starting from rectangle x coordinate).
	 * @param {number} [options.height=SpiderGL.WebGL.Framebuffer.DEFAULT_READ_PIXELS_HEIGHT] The rectangle height (in pixels). If less than zero, the height will be set to span the whole render target (starting from rectangle y coordinate).
	 * @param {number} [options.format=SpiderGL.WebGL.Framebuffer.DEFAULT_READ_PIXELS_FORMAT] The WebGL pixel format.
	 * @param {number} [options.type=SpiderGL.WebGL.Framebuffer.DEFAULT_READ_PIXELS_TYPE] The WebGL pixel type.
	 */
	readPixels : function (buffer, options) {
		options = SpiderGL.Utility.getDefaultObject({
			x      : SpiderGL.WebGL.Framebuffer.DEFAULT_READ_PIXELS_X,
			y      : SpiderGL.WebGL.Framebuffer.DEFAULT_READ_PIXELS_Y,
			width  : SpiderGL.WebGL.Framebuffer.DEFAULT_READ_PIXELS_WIDTH,
			height : SpiderGL.WebGL.Framebuffer.DEFAULT_READ_PIXELS_HEIGHT,
			format : SpiderGL.WebGL.Framebuffer.DEFAULT_READ_PIXELS_FORMAT,
			type   : SpiderGL.WebGL.Framebuffer.DEFAULT_READ_PIXELS_TYPE
		}, options);

		if (options.width  < 0) { options.width  = this._viewport[2]; }
		if (options.height < 0) { options.height = this._viewport[3]; }

		this._dsa.readPixels(this._h, options.x, options.y, options.width, options.height, options.format, options.type, buffer);
	},

	/**
	 * Sets the WebGL viewport to the framebuffer viewport rectangle.
	 *
	 * @see viewport
	 * @see autoViewport
	 * @see setAttachments
	 */
	applyViewport : function () {
		var gl = this._gl;
		var vp = this._viewport;
		gl.viewport(vp[0], vp[1], vp[2], vp[3]);
	},

	/**
	 * Destroys the WebGLFramebuffer.
	 * After destruction, the handle is set to null and this object should not be used anymore.
	 *
	 * @see SpiderGL.WebGL.ObjectGL#destroy
	 */
	destroy : function () {
		this._gl.deleteFramebuffer(this._h);
	},

	/**
	 * Binds the wrapped WebGLFramebuffer to the WebGLRenderingContex.FRAMEBUFFER target.
	 * If setViewport is not specified and autoViewport is true, the stored viewport is set with WebGLRenderingContext.viewport().
	 *
	 * @param {bool} [setViewport] If specified, overrides the value of autoViewport.
	 *
	 * @see unbind
	 * @see autoViewport
	 */
	bind : function (setViewport) {
		var gl = this._gl;
		gl.bindFramebuffer(this._t, this._h);
		var svp = SpiderGL.Utility.getDefaultValue(setViewport, this._autoViewport);
		if (svp) {
			var vp = this._viewport;
			gl.viewport(vp[0], vp[1], vp[2], vp[3]);
		}
	},

	/**
	 * Binds "null" to the WebGLRenderingContex.FRAMEBUFFER target.
	 * This method is provided only for simmetry with {@link bind} and is not relative to the object state.
	 *
	 * @see bind
	 */
	unbind : function () {
		this._gl.bindFramebuffer(this._t, null);
	}
};

SpiderGL.Type.extend(SpiderGL.WebGL.Framebuffer, SpiderGL.WebGL.ObjectGL);

/**
 * Creates a SpiderGL.WebGL.Program.
 *
 * SpiderGL.WebGL.Program is a wrapper for WebGLProgram objects.
 *
 * @class The SpiderGL.WebGL.Program is a wrapper for WebGLProgram objects.
 *
 * @augments SpiderGL.WebGL.ObjectGL
 *
 * @param {WebGLRenderingContext} gl A WebGLRenderingContext hijacked with {@link SpiderGL.WebGL.Context.hijack}.
 * @param {object} [options] Optional parameters.
 * @param {WebGLProgram} [options.handle] A WebGLProgram. If present, this object will be used as the wrapped WebGLProgram and the attached shaders will be queried. Otherwise a new one will be created.
 * @param {bool} [options.autoLink=SpiderGL.WebGL.Program.DEFAULT_AUTO_LINK] If true, the program will be linked automatically whenever shaders are added or removed, or vertex attribute indices change.
 * @param {array} [options.shaders] An array of SpiderGL.WebGL.Shader objects to attach to the program.
 * @param {object} [options.attributes] An object where each property has the name of a vertex shader attribute and whose value is the attribute index to wich the vertex attribute will be bound.
 * @param {object} [options.uniforms] An object where each property has the name of a program uniform and whose value is the uniform value.
 *
 * @example
 * var vertexShader   = new SpiderGL.WebGL.VertexShader   (gl, {source: vertexShaderSrc  });
 * var fragmentShader = new SpiderGL.WebGL.FragmentShader (gl, {source: fragmentShaderSrc});
 *
 * var program = new SpiderGL.WebGL.Program(gl, {
 * 	autoLink : true, // if true, the program is automatically linked whenever shaders are added or removed, or whenever attribute indices are changed.
 * 	shaders  : [vertexShader, fragmentShader],
 * 	attributes : {
 * 		aPosition : 0, // the vertex shader aPosition attribute will be bound to the vertex attribute at index 0
 * 		aNormal   : 1  // the vertex shader aNormal attribute will be bound to the vertex attribute at index 1
 * 	},
 * 	uniforms : {
 * 		uDiffuseMap  : 0,  // index of the texture unit for diffuse color textures
 * 		uScaleFactor : 2.0
 * 	}
 * };
 *
 * // uniforms can also be set when the program is not bound
 * program.setUniforms({
 *	uModelViewProjection : getMVP(),
 *	uShininess           : getShininess()
 * });
 *
 * program.bind();
 * // render
 *
 * @see setShaders
 * @see setAttributes
 * @see setUniforms
 * @see autoLink
 * @see SpiderGL.WebGL.Shader
 * @see SpiderGL.WebGL.ObjectGL
 */
SpiderGL.WebGL.Program = function (gl, options) {
	if (!SpiderGL.WebGL.Context.isHijacked(gl)) { return null; }

	if (SpiderGL.Type.instanceOf(options, WebGLProgram)) {
		options = { handle : options };
	}

	options = SpiderGL.Utility.getDefaultObject({
		handle   : null,
		autoLink : SpiderGL.WebGL.Program.DEFAULT_AUTO_LINK
	}, options);

	SpiderGL.WebGL.ObjectGL.call(this, gl, SpiderGL.WebGL.Program.TARGET, options);
	if (!!this._h && !!this._h._spidergl && (this._h._spidergl != this)) return this._h._spidergl;

	var gl  = this._gl;
	var cb  = this._cb;
	var dsa = this._dsa;

	var h = this._h;

	var linked    = false;
	var log       = "";

	var imported = false;
	if (h) {
		imported = true;
		linked   = !!gl.getProgramParameter(h, gl.LINK_STATUS);
		log      = gl.getProgramInfoLog(h);
		if (!log) { log = ""; }
	}
	else {
		h = gl.createProgram();
		this._h = h;
	}
	h._spidergl = this;

	this._shaders    = [ ];
	this._linked     = linked;
	this._log        = log;
	this._autoLink   = options.autoLink;
	this._attributes = { };
	this._uniforms   = { };

	if (imported) {
		var shaders = gl.getAttachedShaders(h);
		for (var i=0,n=shaders.length; i<n; ++i) {
			this._importShader(shaders[i]);
		}
	}

	var mustLink = false;
	if (this._addShaders(options.shaders))       { mustLink = true; }
	if (this._setAttributes(options.attributes)) { mustLink = true; }

	if (mustLink && this._autoLink) { this.link(); }
	else if (imported) { this._postLink(); }

	this.setUniforms(options.uniforms);
}

/**
 * Dummy WebGL target for programs.
 * It is equal to WebGLRenderingContext.NONE and is provided only for completeness with other WebGL wrappers.
 *
 * @type number
 *
 * @default WebGLRenderingContext.NONE
 */
SpiderGL.WebGL.Program.TARGET = WebGLRenderingContext.NONE;

/**
 * Default value for SpiderGL.WebGL.Program#autoLink.
 *
 * @type bool
 *
 * @default true
 */
SpiderGL.WebGL.Program.DEFAULT_AUTO_LINK = true;

/**
 * WebGLProgram unbinding.
 *
 * This function binds the null program with WebGLRenderingContext.useProgram(null).
 *
 * @param  {WebGLRenderingContext} gl A WebGLRenderingContext.
 */
SpiderGL.WebGL.Program.unbind = function (gl) { gl.useProgram(null); };

SpiderGL.WebGL.Program._uniformSetFunctions = { };
SpiderGL.WebGL.Program._uniformSetFunctions[WebGLRenderingContext.BOOL        ] = function (dsa, h, v) { dsa.uniform1i        (h, this.location,        v); };
SpiderGL.WebGL.Program._uniformSetFunctions[WebGLRenderingContext.BOOL_VEC2   ] = function (dsa, h, v) { dsa.uniform2iv       (h, this.location,        v); };
SpiderGL.WebGL.Program._uniformSetFunctions[WebGLRenderingContext.BOOL_VEC3   ] = function (dsa, h, v) { dsa.uniform3iv       (h, this.location,        v); };
SpiderGL.WebGL.Program._uniformSetFunctions[WebGLRenderingContext.BOOL_VEC4   ] = function (dsa, h, v) { dsa.uniform4iv       (h, this.location,        v); };
SpiderGL.WebGL.Program._uniformSetFunctions[WebGLRenderingContext.INT         ] = function (dsa, h, v) { dsa.uniform1i        (h, this.location,        v); };
SpiderGL.WebGL.Program._uniformSetFunctions[WebGLRenderingContext.INT_VEC2    ] = function (dsa, h, v) { dsa.uniform2iv       (h, this.location,        v); };
SpiderGL.WebGL.Program._uniformSetFunctions[WebGLRenderingContext.INT_VEC3    ] = function (dsa, h, v) { dsa.uniform3iv       (h, this.location,        v); };
SpiderGL.WebGL.Program._uniformSetFunctions[WebGLRenderingContext.INT_VEC4    ] = function (dsa, h, v) { dsa.uniform4iv       (h, this.location,        v); };
SpiderGL.WebGL.Program._uniformSetFunctions[WebGLRenderingContext.FLOAT       ] = function (dsa, h, v) { dsa.uniform1f        (h, this.location,        v); };
SpiderGL.WebGL.Program._uniformSetFunctions[WebGLRenderingContext.FLOAT_VEC2  ] = function (dsa, h, v) { dsa.uniform2fv       (h, this.location,        v); };
SpiderGL.WebGL.Program._uniformSetFunctions[WebGLRenderingContext.FLOAT_VEC3  ] = function (dsa, h, v) { dsa.uniform3fv       (h, this.location,        v); };
SpiderGL.WebGL.Program._uniformSetFunctions[WebGLRenderingContext.FLOAT_VEC4  ] = function (dsa, h, v) { dsa.uniform4fv       (h, this.location,        v); };
SpiderGL.WebGL.Program._uniformSetFunctions[WebGLRenderingContext.FLOAT_MAT2  ] = function (dsa, h, v) { dsa.uniformMatrix2fv (h, this.location, false, v); };
SpiderGL.WebGL.Program._uniformSetFunctions[WebGLRenderingContext.FLOAT_MAT3  ] = function (dsa, h, v) { dsa.uniformMatrix3fv (h, this.location, false, v); };
SpiderGL.WebGL.Program._uniformSetFunctions[WebGLRenderingContext.FLOAT_MAT4  ] = function (dsa, h, v) { dsa.uniformMatrix4fv (h, this.location, false, v); };
SpiderGL.WebGL.Program._uniformSetFunctions[WebGLRenderingContext.SAMPLER_2D  ] = function (dsa, h, v) { dsa.uniform1i        (h, this.location,        v); };
SpiderGL.WebGL.Program._uniformSetFunctions[WebGLRenderingContext.SAMPLER_CUBE] = function (dsa, h, v) { dsa.uniform1i        (h, this.location,        v); };

SpiderGL.WebGL.Program.prototype = {
	_gl_deleteProgram : function (program) {
		this._h = null;
	},

	_gl_isProgram : function (program) {
	},

	_gl_useProgram : function (program) {
	},

	_gl_getActiveAttrib : function (program, index) {
	},

	_gl_getActiveUniform : function (program, index) {
	},

	_gl_getAttachedShaders : function (program) {
	},

	_gl_getAttribLocation : function (program, name) {
	},

	_gl_getProgramParameter : function (program, pname) {
	},

	_gl_getProgramInfoLog : function (program) {
	},

	_gl_getUniform : function (program, location) {
	},

	_gl_getUniformLocation : function (program, name) {
	},

	_gl_attachShader : function (program, shader) {
		this._importShader(shader);
	},

	_gl_bindAttribLocation : function (program, index, name) {
	},

	_gl_detachShader : function (program, shader) {
		if (!shader) { return; }
		var idx = this._shaderHandleIndex(shader);
		if (idx < 0) { return; }
		this._shaders.splice(idx, 1);
	},

	_gl_linkProgram : function (program) {
		this._postLink();
	},

	_gl_uniform1f : function (location, x) {
	},

	_gl_uniform1fv : function (location, v) {
	},

	_gl_uniform1i : function (location, x) {
	},

	_gl_uniform1iv : function (location, v) {
	},

	_gl_uniform2f : function (location, x, y) {
	},

	_gl_uniform2fv : function (location, v) {
	},

	_gl_uniform2i : function (location, x, y) {
	},

	_gl_uniform2iv : function (location, v) {
	},

	_gl_uniform3f : function (location, x, y, z) {
	},

	_gl_uniform3fv : function (location, v) {
	},

	_gl_uniform3i : function (location, x, y, z) {
	},

	_gl_uniform3iv : function (location, v) {
	},

	_gl_uniform4f : function (location, x, y, z, w) {
	},

	_gl_uniform4fv : function (location, v) {
	},

	_gl_uniform4i : function (location, x, y, z, w) {
	},

	_gl_uniform4iv : function (location, v) {
	},

	_gl_uniformMatrix2fv : function (location, transpose, value) {
	},

	_gl_uniformMatrix3fv : function (location, transpose, value) {
	},

	_gl_uniformMatrix4fv : function (location, transpose, value) {
	},

	_gl_validateProgram : function (program) {
	},

	_shaderHandleIndex : function (shader) {
		for (var i=0,n=this._shaders.length; i<n; ++i) {
			if (this._shaders[i].handle === shader) {
				return i;
			}
		}
		return -1;
	},

	_shaderIndex : function (shader) {
		if (this._shaders.indexOf) { return this._shaders.indexOf(shader); }
		else {
			for (var i=0,n=this._shaders.length; i<n; ++i) {
				if (this._shaders[i] === shader) {
					return i;
				}
			}
			return -1;
		}
	},

	_importShader : function (shader) {
		if (!shader) { return; }
		if (this._shaderHandleIndex(shader) >= 0) { return; }

		var gl = this._gl;
		var shd = shader._spidergl;
		if (!shd) {
			var type = gl.getShaderParameter(shader, gl.SHADER_TYPE);
			switch (type) {
				case gl.VERTEX_SHADER   : shd = new SpiderGL.WebGL.VertexShader   (gl, { handle : shader }); break;
				case gl.FRAGMENT_SHADER : shd = new SpiderGL.WebGL.FragmentShader (gl, { handle : shader }); break;
				default : return; break;
			}
		}
		this._shaders.push(shd);
	},

	_updateActiveInfo : function () {
		var gl = this._gl;
		var h = this._h;

		var n    = 0;
		var nfo  = null;
		var name = null;
		var loc  = null;

		var attributes = { };
		n = gl.getProgramParameter(h, gl.ACTIVE_ATTRIBUTES);
		for (var i=0; i<n; ++i) {
			nfo  = gl.getActiveAttrib(h, i);
			name = nfo.name;
			loc  = gl.getAttribLocation(h, name);
			attributes[name] = {
				index    : i,
				name     : name,
				size     : nfo.size,
				type     : nfo.type,
				location : loc
			};
		}

		var uniforms = { };
		n = gl.getProgramParameter(h, gl.ACTIVE_UNIFORMS);
		for (var i=0; i<n; ++i) {
			nfo = gl.getActiveUniform(h, i);
			name = nfo.name;
			loc  = gl.getUniformLocation(h, name);
			uniforms[name] = {
				index    : i,
				name     : name,
				size     : nfo.size,
				type     : nfo.type,
				location : loc,
				setValue : SpiderGL.WebGL.Program._uniformSetFunctions[nfo.type]
			};
			if (nfo.size > 1) {
				var subs = name.lastIndexOf("[0]");
				if (subs == (name.length - 3)) {
					var arrayName = name.slice(0, subs);
					for (var j=1; j<nfo.size; ++j) {
						var subName = arrayName + "[" + j + "]";
						loc = gl.getUniformLocation(h, subName);
						uniforms[subName] = {
							index    : i,
							name     : subName,
							size     : nfo.size,
							type     : nfo.type,
							location : loc,
							setValue : SpiderGL.WebGL.Program._uniformSetFunctions[nfo.type]
						};
					}
				}
			}
		}

		this._attributes = attributes;
		this._uniforms   = uniforms;
	},

	_postLink : function () {
		var gl = this._gl;
		var h = this._h;
		this._linked = !!gl.getProgramParameter(h, gl.LINK_STATUS);
		this._log = gl.getProgramInfoLog(h);
		if (!this._log) { this._log = ""; }
		this._updateActiveInfo();
	},

	_addShaders : function (shaders) {
		if (!shaders) { return false; }

		var gl = this._gl;
		var h = this._h;
		var shd = null;
		var hshd = null;

		for (var i=0,n=shaders.length; i<n; ++i) {
			shd = shaders[i];
			hshd = null;
			if (SpiderGL.Type.instanceOf(shd, SpiderGL.WebGL.Shader)) {
				hshd = shd.handle;
			}
			if (SpiderGL.Type.instanceOf(shd, WebGLShader)) {
				hshd = shd;
			}
			if (hshd) {
				gl.attachShader(h, hshd);
			}
		}

		return true;
	},

	_removeShaders : function (shaders) {
		if (!shaders) { return false; }

		var gl = this._gl;
		var h = this._h;
		var shd = null;
		var hshd = null;

		for (var i=0,n=shaders.length; i<n; ++i) {
			shd = shaders[i];
			hshd = null;
			if (SpiderGL.Type.instanceOf(shd, SpiderGL.WebGL.Shader)) {
				hshd = shd.handle;
			}
			if (SpiderGL.Type.instanceOf(shd, SpiderGL.WebGL.Shader)) {
				hshd = shd;
			}
			if (hshd) {
				gl.detachShader(h, hshd);
			}
		}

		return true;
	},

	_setAttributes : function (attributes) {
		if (!attributes) { return false; }
		var gl = this._gl;
		var h = this._h;
		for (var a in attributes) {
			gl.bindAttribLocation(h, attributes[a], a);
		}
		return true;
	},

	/*
	get isEmpty     () { return (this._shaders.length <= 0); },
	*/

	/**
	 * Tests if the program is ready to use.
	 * A program is considered ready if it is succesfully linked.
	 *
	 * @type bool
	 *
	 * @readonly
	 *
	 * @see isLinked
	 */
	get isReady() {
		return this.isLinked;
	},

	/**
	 * Tests if the program is linked.
	 *
	 * @type bool
	 *
	 * @readonly
	 *
	 * @see isReady
	 */
	get isLinked() {
		return this._linked;
	},

	/*
	get isValidated() {
		return this._validated;
	},
	*/

	/**
	 * Gets the program info log.
	 *
	 * @type bool
	 *
	 * @readonly
	 */
	get log() {
		return this._log;
	},

	/**
	 * Gets/Sets if the program will be linked automatically whenever shaders are added or removed, or vertex attribute indices change.
	 *
	 * @type bool
	 *
	 * @see link
	 */
	get autoLink() {
		return this._autoLink;
	},

	set autoLink(on) { 
		this._autoLink = !!on;
	},

	/**
	 * Attaches the provided shaders to the program.
	 * If link is not specified and autoLink is true, the program is automatically linked.
	 *
	 * @param {array|SpiderGL.WebGL.Shader} shaders An array of SpiderGL.WebGL.Shader or a single SpiderGL.WebGL.Shader to attach.
	 * @param {bool} [link] If specified, overrides the value of autoLink.
	 *
	 * @returns {bool} If the program has been linked, returns whether the program is linked, otherwise always returns true.
	 *
	 * @see isLinked
	 */
	addShaders : function (shaders, link) {
		var mustLink = this._addShaders(shaders);
		if (!mustLink) { return true; };
		mustLink = SpiderGL.Utility.getDefaultValue(link, this._autoLink);
		if (!mustLink) { return true; }
		return this.link()
	},

	/**
	 * Detaches the provided shaders to the program.
	 * If link is not specified and autoLink is true, the program is automatically linked.
	 *
	 * @param {array|SpiderGL.WebGL.Shader} shaders An array of SpiderGL.WebGL.Shader or a single SpiderGL.WebGL.Shader to detach.
	 * @param {bool} [link] If specified, overrides the value of autoLink.
	 *
	 * @returns {bool} If the program has been linked, returns whether the program is linked, otherwise always returns true.
	 */
	removeShaders : function (shaders, link) {
		var mustLink = this._removeShaders(shaders);
		if (!mustLink) { return true; };
		mustLink = SpiderGL.Utility.getDefaultValue(link, this._autoLink);
		if (!mustLink) { return true; }
		return this.link()
	},

	/**
	 * Tests whether the passed shader is attached to the program.
	 *
	 * @param {SpiderGL.WebGL.Shader} shader The shader to test for attachment.
	 *
	 * @returns {bool} If the shader is attached, false otherwise.
	 */
	hasShader : function (shader) {
		return (this._shaderIndex(shader) >= 0);
	},

	/**
	 * Gets the attached shaders.
	 *
	 * @returns {array} An array with the attached SpiderGL.WebGL.Shader objects.
	 */
	getShaders : function () {
		return this._shaders.slice();
	},

	/**
	 * Links the program.
	 *
	 * @returns {bool} True if the program has been succesfully linked, false otherwise.
	 */
	link : function () {
		this._gl.linkProgram(this._h);
		return this._linked;
	},

	/**
	 * Validates the program with the current attribute indices, uniforms and WebGLRenderingContext state
	 * It is performed using WebGLRenderingContext.validateProgram().
	 *
	 * @returns {bool} True if the program has been succesfully validated, false otherwise.
	 */
	validate : function () {
		var gl = this._gl;
		var h = this._h;
		gl.validateProgram(h);
		var validated = !!gl.getProgramParameter(h, gl.VALIDATE_STATUS);
		return validated;
	},

	/**
	 * Sets the indices of vertex shader attributes.
	 * Only the recognized attributes (i.e. the active attributes in vertex shaders) will be set.
	 * The attribute binding indices will take effect only when the program is linked again.
	 * If autoLink is true, the program is automatically linked.
	 *
	 * @param {object} attributes The attributes to set. For each attribute index to set, the object must contain a property whose name is the name of the vertex attribute and whose value is a non-negative integer specifying the attribute bind index.
	 *
	 * @example
	 * var vertexShaderSrc = "" +
	 * 	"..." + 
	 * 	"attribute vec3 aPosition; \n" +
	 * 	"attribute vec3 aNormal;   \n" +
	 * 	"...";
	 *
	 * // setup the program (attribute indices can also be set at construction)
	 * // ...
	 *
	 * // set attributes indices;
	 * // if autoLink is true, the program will be automatically linked;
	 * // otherwise it must be explicitly linked with program.link()
	 * program.setAttributes({
	 * 	aPosition : 3,  // bind attribute aPosition to vertex attribute 3
	 * 	aNormal   : 1   // bind attribute aNormal to vertex attribute 1
	 * 	aColor    : 2   // this attribute is not set because it is not an active attribute
	 * });
	 *
	 * @returns {bool} True if the attributes have been set, false otherwise.
	 *
	 * @see getAttributesIndices
	 * @see getAttributesInfo
	 * @see setUniforms
	 * @see link
	 * @see autoLink
	 */
	setAttributes : function (attributes) {
		if (!this._setAttributes(attributes)) return false;
		if (this._autoLink) return this.link();
		return true;
	},

	/**
	 * Gets vertex attributes names.
	 *
	 * @returns {array} An array containing the names of all active vertex shader attributes.
	 *
	 * @see getAttributesIndices
	 * @see getAttributesInfo
	 */
	getAttributesNames : function () {
		var attributes  = this._attributes;
		var rAttributes = [ ];
		for (var a in attributes) {
			rAttributes.push(attributes[a].name);
		}
		return rAttributes;
	},

	/**
	 * Gets the vertex attributes binding indices.
	 *
	 * @returns {object} An object with one property for each active vertex attribute. The name of the property is the name of the attribute in the vertex shader and its value is a non-negative integer representing the attribute bind index.
	 *
	 * @see getAttributesInfo
	 * @see setAttributes
	 */
	getAttributesIndices : function () {
		var attributes  = this._attributes;
		var rAttributes = { };
		for (var a in attributes) {
			rAttributes[a] = attributes[a].location;
		}
		return rAttributes;
	},

	/**
	 * Gets the vertex attributes informations.
	 *
	 * @returns {object} An object where each property has the name of a vertex shader attribute and whose value is an object containing attribute information. The attribute index is in the "location" property.
	 *
	 * @see getAttributesIndices
	 * @see setAttributes
	 */
	getAttributesInfo : function () {
		var attributes  = this._attributes;
		var attribute   = null;
		var rAttributes = { };
		for (var a in attributes) {
			attribute = attributes[a];
			rAttributes[a] = {
				index    : attribute.index,
				name     : attribute.name,
				size     : attribute.size,
				type     : attribute.type,
				location : attribute.location
			};
		}
		return rAttributes;
	},

	/**
	 * Sets the program uniforms.
	 * Only the recognized uniforms are set.
	 *
	 * @param {object} uniforms An object where each property has the name of the uniform to set and whose value is the uniform value.
	 *
	 * @example
	 * var vertexShaderSrc = "" +
	 * 	"..." + 
	 * 	"uniform mat4  uMVP;      \n" +
	 * 	"uniform float uScale;    \n" +
	 * 	"uniform vec3  uLightPos; \n" +
	 * 	"...";
	 *
	 * // setup the program (uniforms can also be set at construction)
	 * // ...
	 *
	 * // set uniform values;
	 * program.setUniforms({
	 * 	uMVP      : getModelViewProjection(),
	 * 	uScale    : 2.3,
	 * 	uLightPos : [0, 0.5, 4.7], // can be a typed array: new Float32Array([0, 0.5, 4.7])
	 * 	uOther    : 1.0 // this uniform is not set because it is not an active uniform
	 * });
	 *
	 * @returns {bool} True if the uniforms have been set succesfully, false otherwise.
	 */
	setUniforms : function (uniforms) {
		if (!uniforms) { return false; }

		var gl  = this._gl;
		var cb  = this._cb;
		var dsa = this._dsa;

		var h = this._h;

		cb.pushProgram();
		gl.useProgram(h);

		var _uniforms = this._uniforms;
		var uniform = null;
		var value   = null;
		for (var u in uniforms) {
			uniform = _uniforms[u];
			if (uniform) {
				uniform.setValue(dsa, h, uniforms[u]);
			}
		}

		cb.popProgram();

		return true;
	},

	/**
	 * Gets uniforms names.
	 *
	 * @returns {array} An array containing the names of all active uniforms.
	 *
	 * @see getUniformsValues
	 * @see getUniformsInfo
	 */
	getUniformsNames : function () {
		var uniforms  = this._uniforms;
		var rUniforms = [ ];
		for (var u in uniforms) {
			rUniforms.push(uniforms[u].name);
		}
		return rUniforms;
	},

	/**
	 * Gets the values of the program uniforms.
	 *
	 * @returns {object} An object with one property for each active uniform. The name of the property is the name of the uniform and its value is the uniform value, which can be a number, an array or a typed array.
	 */
	getUniformsValues : function () {
		var gl = this._gl;
		var h = this._h;
		var uniforms  = this._uniforms;
		var rUniforms = { };
		for (var u in uniforms) {
			rUniforms[u] = gl.getUniform(h, uniforms[u].location);
		}
		return rUniforms;
	},

	/**
	 * Gets the program uniforms informations.
	 *
	 * @returns {object} An object where each property has the name of a program uniform and whose value is an object containing uinformation.
	 */
	getUniformsInfo : function () {
		var uniforms  = this._uniforms;
		var uniform   = null;
		var value     = null;
		var rUniforms = { };
		for (var u in uniforms) {
			uniform = uniforms[u];
			rUniforms[u] = {
				index    : uniform.index,
				name     : uniform.name,
				size     : uniform.size,
				type     : uniform.type,
				location : uniform.location
			};
		}
		return rUniforms;
	},

	/**
	 * Destroys the WebGLProgram.
	 * After destruction, the handle is set to null and this object should not be used anymore.
	 *
	 * @see SpiderGL.WebGL.ObjectGL#destroy
	 */
	destroy : function () {
		this._gl.deleteProgram(this._h);
	},

	/**
	 * Binds the wrapped WebGLProgram with WebGLRenderingContext.useProgram().
	 *
	 * @see unbind
	 */
	bind : function () {
		this._gl.useProgram(this._h);
	},

	/**
	 * Binds the "null" program with WebGLRenderingContext.useProgram(null).
	 * This method is provided only for simmetry with {@link bind} and is not relative to the object state.
	 *
	 * @see bind
	 */
	unbind : function () {
		this._gl.useProgram(null);
	}
};

SpiderGL.Type.extend(SpiderGL.WebGL.Program, SpiderGL.WebGL.ObjectGL);

/**
 * Creates a SpiderGL.WebGL.Renderbuffer.
 *
 * SpiderGL.WebGL.Renderbuffer is a wrapper for WebGLRenderbuffer.
 *
 * @class The SpiderGL.WebGL.Renderbuffer is a wrapper for WebGLRenderbuffer.
 *
 * @augments SpiderGL.WebGL.ObjectGL
 *
 * @param {WebGLRenderingContext} gl A WebGLRenderingContext hijacked with {@link SpiderGL.WebGL.Context.hijack}.
 * @param {object} [options] Optional parameters.
 * @param {WebGLRenderbuffer} [options.handle] A WebGLRenderbuffer. If present, this object will be used as the wrapped WebGLRenderbuffer. Otherwise a new one will be created.
 * @param {number} [options.internalFormat] The WebGL enumeration specifying the renderbuffer internal format.
 * @param {object} [options.width] The width of the renderbuffer.
 * @param {object} [options.height] The height of the renderbuffer.
 *
 * @example
 * var rb = new SpiderGL.WebGL.Renderbuffer(gl, {
 * 	internalFormat : gl.RGBA,
 * 	width  : 800,
 * 	height : 600
 * });
 *
 * @see setStorage
 * @see SpiderGL.WebGL.Framebuffer
 * @see SpiderGL.WebGL.ObjectGL
 */
SpiderGL.WebGL.Renderbuffer = function (gl, options) {
	if (!SpiderGL.WebGL.Context.isHijacked(gl)) { return null; }

	if (SpiderGL.Type.instanceOf(h, WebGLRenderbuffer)) {
		options = { handle : options };
	}

	options = SpiderGL.Utility.getDefaultObject({
		handle : null,
	}, options);

	SpiderGL.WebGL.ObjectGL.call(this, gl, SpiderGL.WebGL.Renderbuffer.TARGET, options);
	if (!!this._h && !!this._h._spidergl && (this._h._spidergl != this)) return this._h._spidergl;

	var gl  = this._gl;
	var cb  = this._cb;
	var dsa = this._dsa;

	var t = this._t;
	var h = this._h;

	var format = gl.NONE;
	var width  = 0;
	var height = 0;

	if (h) {
		cb.pushRenderbuffer(t);
		gl.bindRenderbuffer(t, h);
		format = gl.getRenderbufferParameter(t, gl.RENDERBUFFER_INTERNAL_FORMAT);
		width  = gl.getRenderbufferParameter(t, gl.RENDERBUFFER_WIDTH);
		height = gl.getRenderbufferParameter(t, gl.RENDERBUFFER_HEIGHT);
		cb.popRenderbuffer(t);
	}
	else {
		h = gl.createRenderbuffer();
		this._h = h;
	}
	h._spidergl = this;

	this._width  = width;
	this._height = height;
	this._format = format;

	if (SpiderGL.Type.isNumber(options.internalFormat) && SpiderGL.Type.isNumber(options.width) && SpiderGL.Type.isNumber(options.height)) {
		this.setStorage(options.internalFormat, options.width, options.height, options.format);
	}
}

/**
 * WebGL target for renderbuffers.
 *
 * @type number
 *
 * @default WebGLRenderingContext.RENDERBUFFER
 */
SpiderGL.WebGL.Renderbuffer.TARGET = WebGLRenderingContext.RENDERBUFFER;

/**
 * WebGLRenderbuffer unbinding.
 *
 * This function binds the null renderbuffer to the WebGLRenderingContext.RENDERBUFFER target.
 *
 * @param  {WebGLRenderingContext} gl A WebGLRenderingContext.
 */
SpiderGL.WebGL.Renderbuffer.unbind = function (gl) { gl.bindRenderbuffer(SpiderGL.WebGL.Renderbuffer.TARGET, null); };

SpiderGL.WebGL.Renderbuffer.prototype = {
	_gl_deleteRenderbuffer : function (renderbuffer) {
		this._h = null;
	},

	_gl_isRenderbuffer : function (renderbuffer) {
	},

	_gl_bindRenderbuffer : function (target, renderbuffer) {
	},

	_gl_getRenderbufferParameter : function (target, pname) {
	},

	_gl_renderbufferStorage : function (target, internalformat, width, height) {
		this._format = internalformat;
		this._width  = width;
		this._height = height;
	},

	/*
	get isEmpty () { return ((this._width <= 0) || (this._height <= 0)); },
	*/

	/**
	 * Tests if the renderbuffer is ready to use.
	 * A renderbuffer is considered ready if its width and height are greater than zero.
	 *
	 * @type bool
	 *
	 * @readonly
	 */
	get isReady() {
		return ((this._width > 0) && (this._height > 0));
	},

	/**
	 * Gets the WebGL internal format of the renderbuffer.
	 *
	 * @type number
	 *
	 * @readonly
	 */
	get format() {
		return this._format;
	},

	/**
	 * Gets the width in pixels of the renderbuffer.
	 *
	 * @type number
	 *
	 * @readonly
	 */
	get width() {
		return this._width;
	},

	/**
	 * Gets the height in pixels of the renderbuffer.
	 *
	 * @type number
	 *
	 * @readonly
	 */
	get height() {
		return this._height;
	},

	/**
	 * Setups the renderbuffer storage configuration.
	 *
	 * @param {number} internalFormat The WebGL enumeration for the internal pixel format.
	 * @param {number} width The width in pixels of the renderbuffer.
	 * @param {number} height The height in pixels of the renderbuffer.
	 */
	setStorage : function (internalFormat, width, height) {
		this._dsa.renderbufferStorage(this._h, this._t, internalFormat, width, height);
	},

	/**
	 * Destroys the WebGLRenderbuffer.
	 * After destruction, the handle is set to null and this object should not be used anymore.
	 *
	 * @see SpiderGL.WebGL.ObjectGL#destroy
	 */
	destroy : function () {
		this._gl.deleteRenderbuffer(this._h);
	},

	/**
	 * Binds the wrapped WebGLRenderbuffer to the WebGLRenderingContex.RENDERBUFFER target.
	 *
	 * @see unbind
	 */
	bind : function () {
		this._gl.bindRenderbuffer(this._t, this._h);
	},

	/**
	 * Binds "null" to the WebGLRenderingContex.RENDERBUFFER target.
	 * This method is provided only for simmetry with {@link bind} and is not relative to the object state.
	 *
	 * @see bind
	 */
	unbind : function () {
		this._gl.bindRenderbuffer(this._t, null);
	}
};

SpiderGL.Type.extend(SpiderGL.WebGL.Renderbuffer, SpiderGL.WebGL.ObjectGL);

/**
 * Creates a SpiderGL.WebGL.Shader.
 *
 * SpiderGL.WebGL.Shader is the base class for WebGLShader object wrappers and must not be directly used.
 *
 * @class The SpiderGL.WebGL.Shader is the base class for all WebGLShader object wrappers, i.e. {@link SpiderGL.WebGL.Shader} and {@link SpiderGL.WebGL.FragmentShader}.
 *
 * @augments SpiderGL.WebGL.ObjectGL
 *
 * @param {WebGLRenderingContext} gl A WebGLRenderingContext hijacked with {@link SpiderGL.WebGL.Context.hijack}.
 * @param {number} target Not used.
 * @param {number} type WebGL shader type.
 * @param {object} [options] Optional parameters.
 * @param {WebGLShader} [options.handle] If defined, the provided shader will be wrapped and its source code will be queried to the rendering context. Otherwise an internal shader will be created.
 * @param {bool} [options.autoCompile=SpiderGL.WebGL.Shader.DEFAULT_AUTO_COMPILE] If true, the shader is automatically compiled whenever its source code changes.
 * @param {string} [options.source] Shader source code. If autoCompile is true, the shader will be automatically compiled.
 *
 * @see autoCompile
 * @see source
 * @see compile
 * @see SpiderGL.WebGL.VertexShader
 * @see SpiderGL.WebGL.FragmentShader
 * @see SpiderGL.WebGL.Program
 * @see SpiderGL.WebGL.ObjectGL
 */
SpiderGL.WebGL.Shader = function (gl, target, type, options) {
	if (!SpiderGL.WebGL.Context.isHijacked(gl)) { return null; }

	if (SpiderGL.Type.instanceOf(options, WebGLShader)) {
		options = { handle : options };
	}
	else if (SpiderGL.Type.isString(options)) {
		options = { source : options };
	}

	options = SpiderGL.Utility.getDefaultObject({
		handle      : null,
		source      : null,
		autoCompile : SpiderGL.WebGL.Shader.DEFAULT_AUTO_COMPILE
	}, options);

	SpiderGL.WebGL.ObjectGL.call(this, gl, target, options);
	if (!!this._h && !!this._h._spidergl && (this._h._spidergl != this)) return this._h._spidergl;

	var gl  = this._gl;
	var cb  = this._cb;
	var dsa = this._dsa;

	var source   = "";
	var compiled = false;
	var deleted  = false;
	var log      = "";

	var h = this._h;
	if (h) {
		source   = gl.getShaderSource(h);
		if (!source) { source = ""; }
		compiled = !!gl.getShaderParameter(h, gl.COMPILE_STATUS);
		deleted  = !!gl.getShaderParameter(h, gl.DELETE_STATUS);
		log      = gl.getShaderInfoLog(h);
		if (!log) { log = ""; }
	}
	else {
		h = gl.createShader(type);
		this._h = h;
	}
	h._spidergl = this;

	this._source      = source;
	this._compiled    = compiled;
	this._log         = log;
	this._autoCompile = options.autoCompile;

	if (options.source) { this.setSource(options.source); }
}

/**
 * Dummy WebGL target for shaders.
 *
 * It is equal to WebGLRenderingContext.NONE and is provided only for completeness with other WebGL wrappers.
 *
 * @type number
 *
 * @default WebGLRenderingContext.NONE
 */
SpiderGL.WebGL.Shader.TARGET = WebGLRenderingContext.NONE;

/**
 * Default value for SpiderGL.WebGL.Shader#autoCompile.
 *
 * @type bool
 *
 * @default true
 */
SpiderGL.WebGL.Shader.DEFAULT_AUTO_COMPILE = true;

/**
 * Dummy shader unbinding.
 *
 * This function does nothing and it is provided only for simmetry with other wrappers.
 *
 * @param  {WebGLRenderingContext} gl A WebGLRenderingContext.
 */
SpiderGL.WebGL.Shader.unbind = function (gl) { };

SpiderGL.WebGL.Shader.prototype = {
	_gl_deleteShader : function (shader) {
		this._h = null;
	},

	_gl_isShader : function (shader) {
	},

	_gl_getShaderParameter : function (shader, pname) {
	},

	_gl_getShaderInfoLog : function (shader) {
	},

	_gl_getShaderSource : function (shader) {
	},

	_gl_compileShader : function (shader) {
		this._postCompile();
	},

	_gl_shaderSource : function (shader, source) {
		this._source = source;
		if (!this._source) { this._source = ""; }
	},

	_postCompile : function () {
		var gl = this._gl;
		var h = this._h;
		this._compiled = !!gl.getShaderParameter(h, gl.COMPILE_STATUS);
		this._log      = gl.getShaderInfoLog(h);
		if (!this._log) { this._log = ""; }
	},

	/*
	get isEmpty () { return (this._source.length <= 0); },
	*/

	/**
	 * Tests if the shader is ready to use.
	 * A shader is considered ready if it is successfully compiled.
	 *
	 * @type bool
	 *
	 * @readonly
	 *
	 * @see isCompiled
	 */
	get isReady() {
		return this.isCompiled;
	},

	/**
	 * Tests if the shader is successfully compiled.
	 *
	 * @type bool
	 *
	 * @readonly
	 *
	 * @see isReady
	 */
	get isCompiled() {
		return this._compiled;
	},

	/**
	 * Gets the log output generated by the shader compiler.
	 *
	 * @type string
	 *
	 * @readonly
	 *
	 * @see compile
	 */
	get log() {
		return this._log;
	},

	/**
	 * Gets/Sets if the shader will be compiled automatically whenever the source code is changed.
	 *
	 * @type bool
	 *
	 * @see source
	 * @see compile
	 */
	get autoCompile() {
		return this._autoCompile;
	},

	set autoCompile(on) {
		this._autoCompile = !!on;
	},

	/**
	 * Sets the shader source code.
	 * If compile is not specified and autoCompile is true, the shader is automatically compiled.
	 *
	 * @param {string} src The shader source code.
	 * @param {bool} [compile] If specified, overrides the value of autoCompile.
	 *
	 * @see compile
	 * @see autoCompile
	 */
	setSource : function (src, compile) {
		var gl = this._gl;
		var h = this._h;

		gl.shaderSource(h, src);

		var c = SpiderGL.Utility.getDefaultValue(compile, this._autoCompile);
		if (!c) { true; }
		return this.compile();
	},

	/**
	 * Gets/Sets the shader source code.
	 * If autoCompile is true, the shader is automatically compiled when the source code string is changed.
	 *
	 * @type string
	 *
	 * @see setSource
	 * @see compile
	 * @see autoCompile
	 */
	get source() {
		return this._source;
	},

	set source(src) {
		this.setSource(src);
	},

	/**
	 * Compiles the shader.
	 *
	 * @returns {bool} True if the shader has been successfully compiled, false otherwise.
	 *
	 * @see source
	 * @see autoCompile
	 * @see log
	 */
	compile : function () {
		this._gl.compileShader(this._h);
		return this._compiled;
	},

	/**
	 * Destroys the WebGLShader.
	 * After destruction, the handle is set to null and this object should not be used anymore.
	 *
	 * @see SpiderGL.WebGL.ObjectGL#destroy
	 */
	destroy : function () {
		this._gl.deleteShader(this._h);
	},

	/**
	 * Dummy bind method.
	 * It is provided for simmetry with other WebGL object wrappers.
	 *
	 * @see unbind
	 */
	bind : function () {
	},

	/**
	 * Dummy unbind method.
	 * It is provided for simmetry with other WebGL object wrappers.
	 *
	 * @see bind
	 */
	unbind : function () {
	}
};

SpiderGL.Type.extend(SpiderGL.WebGL.Shader, SpiderGL.WebGL.ObjectGL);

/**
 * Creates a SpiderGL.WebGL.VertexShader.
 *
 * SpiderGL.WebGL.VertexShader represents a wrapper for a WebGLShader whose type is type WebGLRenderingContext.VERTEX_SHADER.
 *
 * @class The SpiderGL.WebGL.VertexShader is a WebGLShader wrapper for vertex shaders.
 *
 * @augments SpiderGL.WebGL.Shader
 *
 * @param {WebGLRenderingContext} gl A WebGLRenderingContext hijacked with {@link SpiderGL.WebGL.Context.hijack}.
 * @param {object} [options] See {@link SpiderGL.WebGL.Shader}.
 *
 * @see SpiderGL.WebGL.Shader
 * @see SpiderGL.WebGL.FragmentShader
 * @see SpiderGL.WebGL.Program
 * @see SpiderGL.WebGL.ObjectGL
 */
SpiderGL.WebGL.VertexShader = function (gl, options) {
	if (!SpiderGL.WebGL.Context.isHijacked(gl)) { return null; }
	SpiderGL.WebGL.Shader.call(this, gl, SpiderGL.WebGL.VertexShader.TARGET, gl.VERTEX_SHADER, options);
	if (!!this._h && !!this._h._spidergl && (this._h._spidergl != this)) return this._h._spidergl;
}

/**
 * Dummy WebGL target for vertex shaders.
 *
 * It is equal to WebGLRenderingContext.NONE and is provided only for completeness with other WebGL wrappers.
 *
 * @type number
 *
 * @default WebGLRenderingContext.NONE
 */
SpiderGL.WebGL.VertexShader.TARGET = WebGLRenderingContext.NONE;

/**
 * Dummy vertex shader unbinding.
 *
 * This function does nothing and it is provided only for simmetry with other wrappers.
 *
 * @param  {WebGLRenderingContext} gl A WebGLRenderingContext.
 */
SpiderGL.WebGL.VertexShader.unbind = function (gl) { };

SpiderGL.WebGL.VertexShader.prototype = { };

SpiderGL.Type.extend(SpiderGL.WebGL.VertexShader, SpiderGL.WebGL.Shader);

/**
 * Creates a SpiderGL.WebGL.FragmentShader.
 *
 * SpiderGL.WebGL.FragmentShader represents a wrapper for a WebGLShader whose type is type WebGLRenderingContext.FRAGMENT_SHADER.
 *
 * @class The SpiderGL.WebGL.FragmentShader is a WebGLShader wrapper for fragment shaders.
 *
 * @augments SpiderGL.WebGL.Shader
 *
 * @param {WebGLRenderingContext} gl A WebGLRenderingContext hijacked with {@link SpiderGL.WebGL.Context.hijack}.
 * @param {object} [options] See {@link SpiderGL.WebGL.Shader}.
 *
 * @see SpiderGL.WebGL.Shader
 * @see SpiderGL.WebGL.VertexShader
 * @see SpiderGL.WebGL.Program
 * @see SpiderGL.WebGL.ObjectGL
 */
SpiderGL.WebGL.FragmentShader = function (gl, options) {
	if (!SpiderGL.WebGL.Context.isHijacked(gl)) { return null; }
	SpiderGL.WebGL.Shader.call(this, gl, SpiderGL.WebGL.FragmentShader.TARGET, gl.FRAGMENT_SHADER, options);
	if (!!this._h && !!this._h._spidergl && (this._h._spidergl != this)) return this._h._spidergl;
}

/**
 * Dummy WebGL target for fragment shaders.
 *
 * It is equal to WebGLRenderingContext.NONE and is provided only for completeness with other WebGL wrappers.
 *
 * @type number
 *
 * @default WebGLRenderingContext.NONE
 */
SpiderGL.WebGL.FragmentShader.TARGET = WebGLRenderingContext.NONE;

/**
 * Dummy fragment shader unbinding.
 *
 * This function does nothing and it is provided only for simmetry with other wrappers.
 *
 * @param  {WebGLRenderingContext} gl A WebGLRenderingContext.
 */
SpiderGL.WebGL.FragmentShader.unbind = function (gl) { };

SpiderGL.WebGL.FragmentShader.prototype = { };

SpiderGL.Type.extend(SpiderGL.WebGL.FragmentShader, SpiderGL.WebGL.Shader);

/**
 * Creates a SpiderGL.WebGL.Texture.
 *
 * SpiderGL.WebGL.Texture is the base class for WebGLTexture object wrappers ({@link SpiderGL.WebGL.Texture2D} and {@link SpiderGL.WebGL.TextureCubeMap}) and must not be directly used.
 *
 * @class The SpiderGL.WebGL.Texture is the base class for all WebGLTexture object wrappers, i.e. {@link SpiderGL.WebGL.Texture2D} and {@link SpiderGL.WebGL.TextureCubeMap}.
 *
 * @augments SpiderGL.WebGL.ObjectGL
 *
 * @param {WebGLRenderingContext} gl A WebGLRenderingContext hijacked with {@link SpiderGL.WebGL.Context.hijack}.
 * @param {number} target Texture-specific target.
 * @param {object} [options] Optional parameters.
 * @param {WebGLTexture} [options.handle] If defined, the provided texture will be wrapped and its sampling parameters will be queried to the rendering context; as texture image base level width and height can not be retrieved, they should be specified with the width and height optional parameters. If handle is not specified, an internal texture will be created.
 * @param {string|array} [options.url] The url of the texture image to load. It has precedence over the data optional parameter. For SpiderGL.Texture.Texture2D, url is a string. For SpiderGL.Texture.TextureCubeMap, url is an array of six strings, one for each cube map face, in the order [+X, -X, +Y, -Y, +Z, -Z].
 * @param {ArrayBuffer|ArrayBufferView|ImageData|HTMLImageElement|HTMLCanvasElement|HTMLVideoElement} [options.data] The texture image pixel data.
 * @param {number} [options.internalFormat=SpiderGL.WebGL.Texture.DEFAULT_INTERNAL_FORMAT] The texture internal format.
 * @param {number} [options.width] If data is null or a typed array, specifies the texture image width. If handle is provided, the width parameter will supply the width information, not querable to the WebGLRenderingContext.
 * @param {number} [options.height] If data is null or a typed array, specifies the texture image height. If handle is provided, the width parameter will supply the height information, not querable to the WebGLRenderingContext.
 * @param {number} [options.border=SpiderGL.WebGL.Texture.DEFAULT_BORDER] Texture border.
 * @param {number} [options.format=SpiderGL.WebGL.Texture.DEFAULT_FORMAT] The format parameter used for WebGLRenderingContext.texImage2D.
 * @param {number} [options.type=SpiderGL.WebGL.Texture.DEFAULT_TYPE] The type parameter used for WebGLRenderingContext.texImage2D.
 * @param {number} [options.magFilter=SpiderGL.WebGL.Texture.DEFAULT_MAG_FILTER] Texture magnification filter (see {@link SpiderGL.WebGL.Texture#magFilter}).
 * @param {number} [options.minFilter=SpiderGL.WebGL.Texture.DEFAULT_MIN_FILTER] Texture minification filter (see {@link SpiderGL.WebGL.Texture#minFilter}).
 * @param {number} [options.wrapS=SpiderGL.WebGL.Texture.DEFAULT_WRAP_S] Texture horizontal wrap mode (see {@link SpiderGL.WebGL.Texture#wrapS}).
 * @param {number} [options.wrapT=SpiderGL.WebGL.Texture.DEFAULT_WRAP_T] Texture vertical wrap mode (see {@link SpiderGL.WebGL.Texture#wrapT}).
 * @param {bool} [options.autoMipmap=SpiderGL.WebGL.Texture.DEFAULT_AUTO_GENERATE_MIPMAP] If true, mipmaps are automatically generated when calling setImage or setSubImage (see {@link SpiderGL.WebGL.Texture#autoMipmap}).
 * @param {bool} [options.generateMipmap] If specified, overrides autoMipmap for this call.
 * @param {bool} [options.flipYPolicy=SpiderGL.WebGL.Texture.DEFAULT_UNPACK_FLIP_Y] WebGL unpack flip Y policy (see SpiderGL.WebGL.Texture#flipYPolicy).
 * @param {bool} [options.flipY] If specified, overrides flipYPolicy for this call.
 * @param {bool} [options.premultiplyAlphaPolicy=SpiderGL.WebGL.Texture.DEFAULT_UNPACK_PREMULTIPLY_ALPHA] WebGL unpack premultiply alpha policy (see SpiderGL.WebGL.Texture#premultiplyAlphaPolicy).
 * @param {bool} [options.premultiplyAlpha] If specified, overrides premultiplyAlphaPolicy for this call.
 * @param {number} [options.colorspaceConversionPolicy=SpiderGL.WebGL.Texture.DEFAULT_UNPACK_COLORSPACE_CONVERSION] WebGL unpack colorspace conversion policy (see SpiderGL.WebGL.Texture#colorspaceConversionPolicy).
 * @param {number} [options.colorspaceConversion] If specified, overrides colorspaceConversionPolicy for this call.
 * @param {function} [options.onCancel] If url is specified, this function will be called if image data loading is cancelled.
 * @param {function} [options.onError] If url is specified, this function will be called if an error occurs when loading image data.
 * @param {function} [options.onProgress] If url is specified, this function will be called during the image loading progress.
 * @param {function} [options.onSuccess] If url is specified, this function will be called when image data has been successfully loaded.
 *
 * @example
 * var tex1 = new SpiderGL.WebGL.Texture2D(gl, {
 * 	internalFormat : gl.RGBA,              // if omitted, defaults to SpiderGL.WebGL.Texture.DEFAULT_INTERNAL_FORMAT
 * 	width          : 256,
 * 	height         : 128,
 * 	border         : 0,                    // if omitted, defaults to SpiderGL.WebGL.Texture.DEFAULT_BORDER
 * 	format         : gl.RGBA,              // if omitted, defaults to SpiderGL.WebGL.Texture.DEFAULT_FORMAT
 * 	type           : gl.UNSIGNED_BYTE,     // if omitted, defaults to SpiderGL.WebGL.Texture.DEFAULT_TYPE
 * 	data           : new Uint8Array(...),  // if omitted or null, the texture is initialized to zero by the WebGLRenderingContext
 * 	magFilter      : gl.LINEAR,            // if omitted, defaults to SpiderGL.WebGL.Texture.DEFAULT_MAG_FILTER
 * 	minFilter      : gl.LINEAR,            // if omitted, defaults to SpiderGL.WebGL.Texture.DEFAULT_MIN_FILTER
 * 	wrapS          : gl.CLAMP_TO_EDGE,     // if omitted, defaults to SpiderGL.WebGL.Texture.DEFAULT_WRAP_S
 * 	wrapT          : gl.CLAMP_TO_EDGE,     // if omitted, defaults to SpiderGL.WebGL.Texture.DEFAULT_WRAP_T
 * 	autoMipmap     : true,                 // if omitted, defaults to SpiderGL.WebGL.Texture.DEFAULT_AUTO_GENERATE_MIPMAP
 * 	generateMipmap : false,                // if specified, overrides autoMipmap for this implicit call to setImage
 * 	flipYPolicy                : true,     // if omitted, defaults to SpiderGL.WebGL.Texture.DEFAULT_UNPACK_FLIP_Y
 * 	flipY                      : false,    // if specified, overrides flipYPolicy for this implicit call to setImage
 * 	premultiplyAlphaPolicy     : true,     // if omitted, defaults to SpiderGL.WebGL.Texture.DEFAULT_UNPACK_PREMULTIPLY_ALPHA
 * 	premultiplyAlpha           : false,    // if specified, overrides premultiplyAlphaPolicy for this implicit call to setImage
 * 	colorspaceConversionPolicy : true,     // if omitted, defaults to SpiderGL.WebGL.Texture.DEFAULT_UNPACK_COLORSPACE_CONVERSION
 * 	colorspaceConversion       : false     // if specified, overrides colorspaceConversionPolicy for this implicit call to setImage
 * });
 *
 * var tex2 = new SpiderGL.WebGL.TextureCubeMap(gl, {
 * 	url : [
 * 		http://someurl.org/cubemap_pos_x.png,
 * 		http://someurl.org/cubemap_neg_x.png,
 * 		http://someurl.org/cubemap_pos_y.png,
 * 		http://someurl.org/cubemap_neg_y.png,
 * 		http://someurl.org/cubemap_pos_z.png,
 * 		http://someurl.org/cubemap_neg_z.png
 * 	],
 * 	onCancel   : function () { ... },
 * 	onError    : function () { ... },
 * 	onProgress : function () { ... },
 * 	onLoad     : function () { ... },
 * 	wrapS      : gl.REPEAT,
 * 	magFilter  : gl.NEAREST
 * });
 *
 * @see SpiderGL.WebGL.Texture2D
 * @see SpiderGL.WebGL.TextureCubeMap
 * @see SpiderGL.WebGL.Framebuffer
 * @see SpiderGL.WebGL.ObjectGL
 */
SpiderGL.WebGL.Texture = function (gl, target, options) {
	if (!SpiderGL.WebGL.Context.isHijacked(gl)) { return null; }

	if (SpiderGL.Type.instanceOf(options, WebGLTexture)) {
		options = { handle : options };
	}
	else if (SpiderGL.Type.isString(options)) {
		options = { url : options };
	}

	options = SpiderGL.Utility.getDefaultObject({
		handle                     : null,
		magFilter                  : SpiderGL.WebGL.Texture.DEFAULT_MAG_FILTER,
		minFilter                  : SpiderGL.WebGL.Texture.DEFAULT_MIN_FILTER,
		wrapS                      : SpiderGL.WebGL.Texture.DEFAULT_WRAP_S,
		wrapT                      : SpiderGL.WebGL.Texture.DEFAULT_WRAP_T,
		flipYPolicy                : SpiderGL.WebGL.Context.DEFAULT_UNPACK_FLIP_Y,
		premultiplyAlphaPolicy     : SpiderGL.WebGL.Context.DEFAULT_UNPACK_PREMULTIPLY_ALPHA,
		colorspaceConversionPolicy : SpiderGL.WebGL.Context.DEFAULT_UNPACK_COLORSPACE_CONVERSION,
		autoMipmap                 : SpiderGL.WebGL.Texture.DEFAULT_AUTO_GENERATE_MIPMAP,
		format                     : gl.NONE,
		width                      : 0,
		height                     : 0
	}, options);

	SpiderGL.WebGL.ObjectGL.call(this, gl, target, options);
	if (!!this._h && !!this._h._spidergl && (this._h._spidergl != this)) return this._h._spidergl;

	var gl  = this._gl;
	var cb  = this._cb;
	var dsa = this._dsa;

	var t = this._t;
	var h = this._h;

	if (!h) {
		h = gl.createTexture();
		this._h = h;
	}

	cb.pushTexture(t);
	gl.bindTexture(t, h);
	this._magFilter = gl.getTexParameter(t, gl.TEXTURE_MAG_FILTER);
	this._minFilter = gl.getTexParameter(t, gl.TEXTURE_MIN_FILTER);
	this._wrapS     = gl.getTexParameter(t, gl.TEXTURE_WRAP_S);
	this._wrapT     = gl.getTexParameter(t, gl.TEXTURE_WRAP_T);
	cb.popTexture(t);
	h._spidergl = this;

	this._format               = options.format;
	this._width                = options.width;
	this._height               = options.height;
	this._flipY                = options.flipYPolicy;
	this._premultiplyAlpha     = options.premultiplyAlphaPolicy;
	this._colorspaceConversion = options.colorspaceConversionPolicy;
	this._autoMipmap           = options.autoMipmap;

	this._missingFaces = SpiderGL.WebGL.Texture._FACE_ALL_BITS;

	this.setSampler(options);
}

SpiderGL.WebGL.Texture.TARGET = WebGLRenderingContext.NONE;

/**
 * Default texture border when calling setImage
 *
 * @type number
 *
 * @default 0
 */
SpiderGL.WebGL.Texture.DEFAULT_BORDER = 0;

/**
 * Default texture input data format when calling setImage or setSubImage.
 *
 * @type number
 *
 * @default WebGLRenderingContext.RGBA
 */
SpiderGL.WebGL.Texture.DEFAULT_FORMAT = WebGLRenderingContext.RGBA;

/**
 * Default value for SpiderGL.WebGL.Texture#autoMipmap
 *
 * @type bool
 *
 * @default false
 */
SpiderGL.WebGL.Texture.DEFAULT_AUTO_GENERATE_MIPMAP = false;

/**
 * Default texture internal format when calling setImage.
 *
 * @type number
 *
 * @default WebGLRenderingContext.RGBA
 */
SpiderGL.WebGL.Texture.DEFAULT_INTERNAL_FORMAT = WebGLRenderingContext.RGBA;

/**
 * Default texture level when calling setImage.
 *
 * @type number
 *
 * @default 0
 */
SpiderGL.WebGL.Texture.DEFAULT_LEVEL = 0;

/**
 * Default texture magnification filter.
 *
 * @type number
 *
 * @default WebGLRenderingContext.LINEAR
 */
SpiderGL.WebGL.Texture.DEFAULT_MAG_FILTER = WebGLRenderingContext.LINEAR;

/**
 * Default texture minification filter.
 *
 * @type number
 *
 * @default WebGLRenderingContext.LINEAR
 */
SpiderGL.WebGL.Texture.DEFAULT_MIN_FILTER = WebGLRenderingContext.LINEAR;

/**
 * Default texture input data type when calling setImage or setSubImage.
 *
 * @type number
 *
 * @default WebGLRenderingContext.UNSIGNED_BYTE
 */
SpiderGL.WebGL.Texture.DEFAULT_TYPE = WebGLRenderingContext.UNSIGNED_BYTE;

/**
 * Default texture wrap mode in horizontal direction.
 *
 * @type number
 *
 * @default WebGLRenderingContext.REPEAT
 */
SpiderGL.WebGL.Texture.DEFAULT_WRAP_S = WebGLRenderingContext.REPEAT;

/**
 * Default texture wrap mode in vertical direction.
 *
 * @type number
 *
 * @default WebGLRenderingContext.REPEAT
 */
SpiderGL.WebGL.Texture.DEFAULT_WRAP_T = WebGLRenderingContext.REPEAT;

/**
 * Default texture sub-image x offset when calling setSubImage.
 *
 * @type number
 *
 * @default 0
 */
SpiderGL.WebGL.Texture.DEFAULT_X_OFFSET = 0;

/**
 * Default texture sub-image y offset when calling setSubImage.
 *
 * @type number
 *
 * @default 0
 */
SpiderGL.WebGL.Texture.DEFAULT_Y_OFFSET = 0;

/**
 * Default value for pixel unpack parameter WebGLRenderingContext.UNPACK_FLIP_Y_WEBGL when calling setImage or setSubImage.
 *
 * @default true
 *
 * @see SpiderGL.WebGL.Texture.DEFAULT_UNPACK_PREMULTIPLY_ALPHA
 * @see SpiderGL.WebGL.Texture.DEFAULT_UNPACK_COLORSPACE_CONVERSION
 */
SpiderGL.WebGL.Texture.DEFAULT_UNPACK_FLIP_Y = true;

/**
 * Default value for pixel unpack parameter WebGLRenderingContext.UNPACK_PREMULTIPLY_ALPHA_WEBGL when calling setImage or setSubImage.
 *
 * @default true
 *
 * @see SpiderGL.WebGL.Texture.DEFAULT_UNPACK_FLIP_Y
 * @see SpiderGL.WebGL.Texture.DEFAULT_UNPACK_COLORSPACE_CONVERSION
 */
SpiderGL.WebGL.Texture.DEFAULT_UNPACK_PREMULTIPLY_ALPHA = false;

/**
 * Default value for pixel unpack parameter WebGLRenderingContext.UNPACK_COLORSPACE_CONVERSION_WEBGL when calling setImage or setSubImage.
 *
 * @default WebGLRenderingContext.NONE
 *
 * @see SpiderGL.WebGL.Texture.DEFAULT_UNPACK_FLIP_Y
 * @see SpiderGL.WebGL.Texture.DEFAULT_UNPACK_PREMULTIPLY_ALPHA
 */
SpiderGL.WebGL.Texture.DEFAULT_UNPACK_COLORSPACE_CONVERSION = WebGLRenderingContext.NONE;

SpiderGL.WebGL.Texture.unbind = function (gl) { };

SpiderGL.WebGL.Texture._FACE_POSITIVE_X_BIT = (1 << 0);
SpiderGL.WebGL.Texture._FACE_NEGATIVE_X_BIT = (1 << 1);
SpiderGL.WebGL.Texture._FACE_POSITIVE_Y_BIT = (1 << 2);
SpiderGL.WebGL.Texture._FACE_NEGATIVE_Y_BIT = (1 << 3);
SpiderGL.WebGL.Texture._FACE_POSITIVE_Z_BIT = (1 << 4);
SpiderGL.WebGL.Texture._FACE_NEGATIVE_Z_BIT = (1 << 5);
SpiderGL.WebGL.Texture._FACE_ALL_BITS       = (SpiderGL.WebGL.Texture._FACE_POSITIVE_X_BIT | SpiderGL.WebGL.Texture._FACE_NEGATIVE_X_BIT | SpiderGL.WebGL.Texture._FACE_POSITIVE_Y_BIT | SpiderGL.WebGL.Texture._FACE_NEGATIVE_Y_BIT | SpiderGL.WebGL.Texture._FACE_POSITIVE_Z_BIT | SpiderGL.WebGL.Texture._FACE_NEGATIVE_Z_BIT);

SpiderGL.WebGL.Texture._faceBits = { };
SpiderGL.WebGL.Texture._faceBits[WebGLRenderingContext.TEXTURE_2D                 ] = SpiderGL.WebGL.Texture._FACE_ALL_BITS;
SpiderGL.WebGL.Texture._faceBits[WebGLRenderingContext.TEXTURE_CUBE_MAP           ] = SpiderGL.WebGL.Texture._FACE_ALL_BITS;
SpiderGL.WebGL.Texture._faceBits[WebGLRenderingContext.TEXTURE_CUBE_MAP_POSITIVE_X] = SpiderGL.WebGL.Texture._FACE_POSITIVE_X_BIT;
SpiderGL.WebGL.Texture._faceBits[WebGLRenderingContext.TEXTURE_CUBE_MAP_NEGATIVE_X] = SpiderGL.WebGL.Texture._FACE_NEGATIVE_X_BIT;
SpiderGL.WebGL.Texture._faceBits[WebGLRenderingContext.TEXTURE_CUBE_MAP_POSITIVE_Y] = SpiderGL.WebGL.Texture._FACE_POSITIVE_Y_BIT;
SpiderGL.WebGL.Texture._faceBits[WebGLRenderingContext.TEXTURE_CUBE_MAP_NEGATIVE_Y] = SpiderGL.WebGL.Texture._FACE_NEGATIVE_Y_BIT;
SpiderGL.WebGL.Texture._faceBits[WebGLRenderingContext.TEXTURE_CUBE_MAP_POSITIVE_Z] = SpiderGL.WebGL.Texture._FACE_POSITIVE_Z_BIT;
SpiderGL.WebGL.Texture._faceBits[WebGLRenderingContext.TEXTURE_CUBE_MAP_NEGATIVE_Z] = SpiderGL.WebGL.Texture._FACE_NEGATIVE_Z_BIT;

SpiderGL.WebGL.Texture.prototype = {
	_gl_deleteTexture : function (texture) {
		this._h = null;
	},

	_gl_isTexture : function (texture) {
	},

	_gl_bindTexture : function (target, texture) {
	},

	_gl_getTexParameter : function (target, pname) {
	},

	_gl_copyTexImage2D : function (target, level, internalformat, x, y, width, height, border) {
		if (level == 0) {
			this._format = internalformat;
			this._width  = width;
			this._height = height;
		}
	},

	_gl_copyTexSubImage2D : function (target, level, xoffset, yoffset, x, y, width, height, border) {
	},

	_gl_generateMipmap : function (target) {
	},

	_gl_texImage2D : function (target) {
		var n = arguments.length;
		if (n === 6) {
			if (arguments[1] === 0) {
				this._format = arguments[2];
				this._width  = arguments[5].width;
				this._height = arguments[5].height;
			}
		}
		else if (n === 9) {
			if (arguments[1] === 0) {
				this._format = arguments[2];
				this._width  = arguments[3];
				this._height = arguments[4];
			}
		}
	},

	_gl_texParameterf : function (target, pname, param) {
		this._setTexParameter(pname, param);
	},

	_gl_texParameteri : function (target, pname, param) {
		this._setTexParameter(pname, param);
	},

	_gl_texSubImage2D : function (target) {
	},

	_setTexParameter : function (pname, param) {
		var gl = this._gl;

		switch (pname) {
			case gl.TEXTURE_MAG_FILTER : this._magFilter = param; break;
			case gl.TEXTURE_MIN_FILTER : this._minFilter = param; break;
			case gl.TEXTURE_WRAP_S     : this._wrapS     = param; break;
			case gl.TEXTURE_WRAP_T     : this._wrapT     = param; break;
			default : break;
		}
	},

	_setImageData : function (fullImage, target, options) {
		options = SpiderGL.Utility.getDefaultObject({
			internalFormat       : SpiderGL.WebGL.Texture.DEFAULT_INTERNAL_FORMAT,
			border               : SpiderGL.WebGL.Texture.DEFAULT_BORDER,
			xoffset              : SpiderGL.WebGL.Texture.DEFAULT_X_OFFSET,
			yoffset              : SpiderGL.WebGL.Texture.DEFAULT_Y_OFFSET,
			level                : SpiderGL.WebGL.Texture.DEFAULT_LEVEL,
			format               : SpiderGL.WebGL.Texture.DEFAULT_FORMAT,
			type                 : SpiderGL.WebGL.Texture.DEFAULT_TYPE,
			width                : 0,
			height               : 0,
			generateMipmap       : this._autoMipmap,
			flipY                : this._flipY,
			premultiplyAlpha     : this._premultiplyAlpha,
			colorspaceConversion : this._colorspaceConversion,
			data                 : null,
			url                  : null,
			onCancel             : null,
			onError              : null,
			onProgress           : null,
			onSuccess            : null
		}, options);

		var isURL     = !!options.url;
		var isData    = false;
		if (!isURL) { isData = (!options.data || SpiderGL.Type.isTypedArray(options.data)); /* (!options.data || SpiderGL.Type.instanceOf(options.data, ArrayBufferView)) */ }
		var isElement = false;
		if (!isURL && !isData) {
			// [WORKAROUND]
			// Firefox does not define ImageData
			// /* correct */ isElement = (SpiderGL.Type.instanceOf(data, ImageData) || SpiderGL.Type.instanceOf(data, HTMLImageElement) || SpiderGL.Type.instanceOf(data, HTMLCanvasElement) || SpiderGL.Type.instanceOf(data, HTMLVideoElement));
			isElement = (SpiderGL.Type.instanceOf(options.data, HTMLImageElement) || SpiderGL.Type.instanceOf(options.data, HTMLCanvasElement) || SpiderGL.Type.instanceOf(options.data, HTMLVideoElement));
			if (!isElement) {
				if (typeof ImageData != "undefined") {
					isElement = SpiderGL.Type.instanceOf(options.data, ImageData);
				}
			}
		}

		var gl  = this._gl;
		var cb  = this._cb;
		var dsa = this._dsa;

		var t = target;
		var h = this._h;

		var userFlipY                = -1;
		var flipY                    = -1;
		var userPremultiplyAlpha     = -1;
		var premultiplyAlpha         = -1;
		var userColorspaceConversion = -1;
		var colorspaceConversion     = -1;

		if (isData || isElement) {
			userFlipY = options.flipY;
			if (userFlipY != SpiderGL.Core.DONT_CARE) {
				flipY = gl.getParameter(gl.UNPACK_FLIP_Y_WEBGL);
				if (userFlipY == flipY) { flipY = -1; }
				else { gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, userFlipY); }
			}

			userPremultiplyAlpha = options.premultiplyAlpha;
			if (userPremultiplyAlpha != SpiderGL.Core.DONT_CARE) {
				premultiplyAlpha = gl.getParameter(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL);
				if (userPremultiplyAlpha == premultiplyAlpha) { premultiplyAlpha = -1; }
				else { gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, userPremultiplyAlpha); }
			}

			userColorspaceConversion = options.colorspaceConversion;
			if (userColorspaceConversion != SpiderGL.Core.DONT_CARE) {
				colorspaceConversion = gl.getParameter(gl.UNPACK_COLORSPACE_CONVERSION_WEBGL);
				if (userColorspaceConversion == colorspaceConversion) { colorspaceConversion = -1; }
				else { gl.pixelStorei(gl.UNPACK_COLORSPACE_CONVERSION_WEBGL, userColorspaceConversion); }
			}
		}

		var imageUpdated = false;

		if (isURL) {
			var opts = {
				internalFormat       : options.internalFormat,
				border               : options.border,
				xoffset              : options.xoffset,
				yoffset              : options.yoffset,
				level                : options.level,
				format               : options.format,
				type                 : options.type,
				generateMipmap       : options.generateMipmap,
				flipY                : options.flipY,
				premultiplyAlpha     : options.premultiplyAlpha,
				colorspaceConversion : options.colorspaceConversion,
				data                 : null
			};

			var that = this;
			var onSuccess = options.onSuccess;

			var req = new SpiderGL.IO.ImageRequest(options.url, {
				onCancel   : options.onCancel,
				onError    : options.onError,
				onProgress : options.onProgress,
				onSuccess  : function () {
					opts.data = req.image;
					if (fullImage) {
						that._setImage(target, opts);
					}
					else {
						that._setSubImage(target, opts);
					}
					if (onSuccess) { onSuccess(); }
				},
				send : true
			});

			return true;
		}
		else if (isData) {
			if ((options.width <= 0) || (options.height <= 0)) { return false; }
			if (fullImage) {
				dsa.texImage2D(h, t, options.level, options.internalFormat, options.width, options.height, options.border, options.format, options.type, options.data);
				imageUpdated = true;
			}
			else {
				dsa.texSubImage2D(h, t, options.level, options.xoffset, options.yoffset, options.width, options.height, options.format, options.type, options.data);
			}
		}
		else if (isElement) {
			if (fullImage) {
				dsa.texImage2D(h, t, options.level, options.internalFormat, options.format, options.type, options.data);
				imageUpdated = true;
			}
			else {
				dsa.texSubImage2D(h, t, options.level, options.xoffset, options.yoffset, options.format, options.type, options.data);
			}
		}
		else {
			return false;
		}

		if (imageUpdated) {
			this._missingFaces &= ~(SpiderGL.WebGL.Texture._faceBits[t]);
		}

		if (isData || isElement) {
			if (flipY                != -1) { gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL,                flipY);                }
			if (premultiplyAlpha     != -1) { gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL,     premultiplyAlpha);     }
			if (colorspaceConversion != -1) { gl.pixelStorei(gl.UNPACK_COLORSPACE_CONVERSION_WEBGL, colorspaceConversion); }
		}

		if (options.generateMipmap) {
			this.generateMipmap();
		}

		return true;
	},

	_setImage : function (target, options) {
		return this._setImageData(true, target, options);
	},

	_setSubImage : function (target, options) {
		return this._setImageData(false, target, options);
	},

	/*
	get isEmpty () { return ((this._width <= 0) || (this._height <= 0)); },
	*/

	/**
	 * Tests if the texture is ready to use.
	 * A texture is considered ready if all its associated images (one for 2D textures, six for cube maps) have width and height greater than zero.
	 *
	 * @type bool
	 *
	 * @readonly
	 */
	get isReady() {
		return ((this._missingFaces == 0) && (this._width > 0) && (this._height > 0));
	},

	/**
	 * Gets/Sets the flip Y policy.
	 * It specifies the image data vertical flipping policy when unpacking pixel data in setData or setSubData.
	 * If set to true, the WebGL pixel unpack parameter WebGLRenderingContext.UNPACK_FLIP_Y will be set to true
	 * If set to false, the WebGL pixel unpack parameter WebGLRenderingContext.UNPACK_FLIP_Y will be set to false 
	 * In either case, the unpack parameter will be restored.
	 * If set to SpiderGL.Core.DONT_CARE, the current WebGLRenderingContext setting will be used (i.e. nothing will be changed).
	 *
	 * @type bool
	 *
	 * @default SpiderGL.WebGL.Context.DEFAULT_UNPACK_FLIP_Y
	 */
	get flipYPolicy() {
		return this._flipY;
	},

	set flipYPolicy(x) {
		this._flipY = SpiderGL.Utility.getDefaultValue(x, SpiderGL.WebGL.Context.DEFAULT_UNPACK_FLIP_Y);
	},

	/**
	 * Gets/Sets the premultiply alpha policy.
	 * It specifies the image data premultiply alpha policy when unpacking pixel data in setData or setSubData.
	 * If set to true, the WebGL pixel unpack parameter WebGLRenderingContext.UNPACK_PREMULTIPLY_ALPHA will be set to true
	 * If set to false, the WebGL pixel unpack parameter WebGLRenderingContext.UNPACK_PREMULTIPLY_ALPHA will be set to false 
	 * In either case, the unpack parameter will be restored after image data has been set
	 * If set to SpiderGL.Core.DONT_CARE, the current WebGLRenderingContext setting will be used (i.e. nothing will be changed).
	 *
	 * @type bool
	 *
	 * @default SpiderGL.WebGL.Context.DEFAULT_UNPACK_PREMULTIPLY_ALPHA
	 */
	get premultuplyAlphaPolicy() {
		return this._premultuplyAlpha;
	},

	set premultuplyAlphaPolicy(x) {
		this._premultuplyAlpha = SpiderGL.Utility.getDefaultValue(x, SpiderGL.WebGL.Context.DEFAULT_UNPACK_PREMULTIPLY_ALPHA);
	},

	/**
	 * Gets/Sets the colorspace conversionpolicy.
	 * It specifies the image data colorpsce conversion policy when unpacking pixel data in setData or setSubData.
	 * If set to SpiderGL.Core.DONT_CARE, the current WebGLRenderingContext setting will be used (i.e. nothing will be changed).
	 * Otherwise, the specified value will be used and then restored after image data has been set.
	 *
	 * @type number
	 *
	 * @default SpiderGL.WebGL.Context.DEFAULT_UNPACK_COLORSPACE_CONVERSION
	 */
	get colorspaceConversionPolicy() {
		return this._colorspaceConversion;
	},

	set colorspaceConversionPolicy(x) {
		this._colorspaceConversion = SpiderGL.Utility.getDefaultValue(x, SpiderGL.WebGL.Context.DEFAULT_UNPACK_COLORSPACE_CONVERSION);
	},

	/**
	 * Gets/Sets the automatic mipmap generation.
	 *
	 * @type bool
	 *
	 * @default SpiderGL.WebGL.Texture.DEFAULT_AUTO_GENERATE_MIPMAP
	 */
	get autoMipmap() {
		return this._autoMipmap;
	},

	set autoMipmap(on) {
		this._autoMipmap = on;
	},

	/**
	 * Gets the texture image internal format.
	 *
	 * @type number
	 *
	 * @readonly
	 */
	get format() {
		return this._format;
	},

	/**
	 * Gets the texture image width.
	 *
	 * @type number
	 *
	 * @readonly
	 */
	get width() {
		return this._width;
	},

	/**
	 * Gets the texture image height.
	 *
	 * @type number
	 *
	 * @readonly
	 */
	get height() {
		return this._height;
	},

	/**
	 * Gets/Sets the texture magnification filter.
	 *
	 * @type number
	 */
	get magFilter() {
		return this._magFilter;
	},

	set magFilter(f) {
		f = SpiderGL.Utility.getDefaultValue(w, SpiderGL.WebGL.Texture.DEFAULT_MAG_FILTER);
		this._dsa.texParameteri(this._h, this._t, gl.TEXTURE_MAG_FILTER, f);
	},

	/**
	 * Gets/Sets the texture minification filter.
	 *
	 * @type number
	 */
	get minFilter() {
		return this._minFilter;
	},

	set minFilter (f) {
		f = SpiderGL.Utility.getDefaultValue(w, SpiderGL.WebGL.Texture.DEFAULT_MIN_FILTER);
		this._dsa.texParameteri(this._h, this._t, gl.TEXTURE_MIN_FILTER, f);
	},

	/**
	 * Gets/Sets the texture horizontal wrap mode.
	 *
	 * @type number
	 */
	get wrapS() {
		return this._wrapS;
	},

	set wrapS(w) {
		w = SpiderGL.Utility.getDefaultValue(w, SpiderGL.WebGL.Texture.DEFAULT_WRAP_S);
		this._dsa.texParameteri(this._h, this._t, gl.TEXTURE_WRAP_S, w);
	},

	/**
	 * Gets/Sets the texture vertical wrap mode.
	 *
	 * @type number
	 */
	get wrapT() {
		return this._wrapT;
	},

	set wrapT(w) {
		w = SpiderGL.Utility.getDefaultValue(w, SpiderGL.WebGL.Texture.DEFAULT_WRAP_T);
		this._dsa.texParameteri(this._h, this._t, gl.TEXTURE_WRAP_T, w);
	},

	/**
	 * Sets the texture sampling (filtering and addressing) mode.
	 * It is a utility function to specify the addressing and filtering parameters at once.
	 * Only the specified properties will be changed.
	 * To restore the default value, specify the property with value SpiderGL.Core.DEFAULT.
	 *
	 * @param {object} sampler The sampling options.
	 * @param {number} [sampler.magFilter] Texture magnification filter (see {@link SpiderGL.WebGL.Texture#magFilter}).
	 * @param {number} [sampler.minFilter] Texture minnification filter (see {@link SpiderGL.WebGL.Texture#minFilter}).
	 * @param {number} [sampler.wrapS] Texture horizontal wrap mode (see {@link SpiderGL.WebGL.Texture#wrapS}).
	 * @param {number} [sampler.wrapT] Texture vertical wrap mode (see {@link SpiderGL.WebGL.Texture#wrapT}).
	 */
	setSampler : function (sampler) {
		if (!sampler) return false;

		var gl  = this._gl;
		var cb  = this._cb;
		var dsa = this._dsa;

		var t = this._t;
		var h = this._h;

		cb.pushTexture(t);
		gl.bindTexture(t, h);

		var p = 0;

		if ("magFilter" in sampler) {
			p = SpiderGL.Utility.getDefaultValue(sampler.magFilter, SpiderGL.WebGL.Texture.DEFAULT_MAG_FILTER);
			gl.texParameteri(t, gl.TEXTURE_MAG_FILTER, p);
		}

		if ("minFilter" in sampler) {
			p = SpiderGL.Utility.getDefaultValue(sampler.minFilter, SpiderGL.WebGL.Texture.DEFAULT_MIN_FILTER);
			gl.texParameteri(t, gl.TEXTURE_MIN_FILTER, p);
		}

		if ("wrapS" in sampler) {
			p = SpiderGL.Utility.getDefaultValue(sampler.wrapS, SpiderGL.WebGL.Texture.DEFAULT_WRAP_S);
			gl.texParameteri(t, gl.TEXTURE_WRAP_S, p);
		}

		if ("wrapT" in sampler) {
			p = SpiderGL.Utility.getDefaultValue(sampler.wrapT, SpiderGL.WebGL.Texture.DEFAULT_WRAP_T);
			gl.texParameteri(t, gl.TEXTURE_WRAP_T, p);
		}

		cb.popTexture(t);

		return true;
	},

	/**
	 * Gets the texture sampling (filtering and addressing) mode.
	 *
	 * @returns {object} The sampling options. The returned object will have the following properties: magFilter, minFilter, wrapS, wrapT.
	 */
	getSampler : function () {
		return {
			magFilter : this._magFilter,
			minFilter : this._minFilter,
			wrapS     : this._wrapS,
			wrapT     : this._wrapT
		};
	},

	/**
	 * Generates the mipmap pyramid.
	 */
	generateMipmap : function () {
		if (this._missingFaces != 0) return;
		this._dsa.generateMipmap(this._h, this._t);
	},

	/**
	 * Destroys the WebGLTexture.
	 * After destruction, the handle is set to null and this object should not be used anymore.
	 *
	 * @see SpiderGL.WebGL.ObjectGL#destroy
	 */
	destroy : function () {
		this._gl.deleteTexture(this._h);
	},

	/**
	 * Binds the texture to the appropriate target for SpiderGL.WebGL.Texture2D and SpiderGL.WebGL.TextureCubeMap.
	 *
	 * @param {number} unit The unit (zero-based index) to which bind the texture. If not specified, the current texture unit is used.
	 *
	 * @see unbind
	 */
	bind : function (unit) {
		var gl  = this._gl;
		var cb  = this._cb;
		var dsa = this._dsa;
		if (typeof unit == "undefined") {
			gl.bindTexture(this._t, this._h);
		}
		else {
			dsa.bindTexture(gl.TEXTURE0 + unit, this._t, this._h);
		}
	},

	/**
	 * Binds "null" to the appropriate texture target for SpiderGL.WebGL.Texture2D and SpiderGL.WebGL.TextureCubeMap.
	 * This method is provided only for simmetry with {@link bind} and is not relative to the object state.
	 *
	 * @param {number} unit The unit (zero-based index) to which bind the null texture. If not specified, the current texture unit is used.
	 *
	 * @see bind
	 */
	unbind : function (unit) {
		var gl  = this._gl;
		var cb  = this._cb;
		var dsa = this._dsa;
		if (typeof unit == "undefined") {
			gl.bindTexture(this._t, null);
		}
		else {
			dsa.bindTexture(gl.TEXTURE0 + unit, this._t, null);
		}
	}
};

SpiderGL.Type.extend(SpiderGL.WebGL.Texture, SpiderGL.WebGL.ObjectGL);

/**
 * Creates a SpiderGL.WebGL.Texture2D.
 *
 * SpiderGL.WebGL.Texture2D is a wrapper for 2D WebGLTexture objects.
 *
 * @class The SpiderGL.WebGL.Texture2D is a wrapper for 2D WebGLTexture objects
 *
 * @augments SpiderGL.WebGL.Texture
 *
 * @param {WebGLRenderingContext} gl A WebGLRenderingContext hijacked with {@link SpiderGL.WebGL.Context.hijack}.
 * @param {object} [options] Optional parameters (see SpiderGL.WebGL.Texture constructor).
 *
 * @see SpiderGL.WebGL.Texture
 * @see SpiderGL.WebGL.TextureCubeMap
 * @see SpiderGL.WebGL.Framebuffer
 * @see SpiderGL.WebGL.ObjectGL
 */
SpiderGL.WebGL.Texture2D = function (gl, options) {
	if (!SpiderGL.WebGL.Context.isHijacked(gl)) { return null; }
	SpiderGL.WebGL.Texture.call(this, gl, SpiderGL.WebGL.Texture2D.TARGET, options);
	if (!!this._h && !!this._h._spidergl && (this._h._spidergl != this)) return this._h._spidergl;

	options = options || { };
	if (SpiderGL.Type.instanceOf(options, WebGLTexture)) {
		options = { handle : options };
	}
	else if (SpiderGL.Type.isString(options)) {
		options = { url : options };
	}

	if (("url" in options) || ("data" in options) || (("width" in options) && ("height" in options))) { this.setImage(options); }
}

SpiderGL.WebGL.Texture2D.TARGET = WebGLRenderingContext.TEXTURE_2D;

SpiderGL.WebGL.Texture2D.unbind = function (gl, unit) {
	var cb  = gl.getExtension("SGL_current_binding");
	var dsa = gl.getExtension("SGL_direct_state_access");
	if (typeof unit == "undefined") {
		gl.bindTexture(SpiderGL.WebGL.Texture2D.TARGET, null);
	}
	else {
		dsa.bindTexture(gl.TEXTURE0 + unit, SpiderGL.WebGL.Texture2D.TARGET, null);
	}
};

SpiderGL.WebGL.Texture2D.prototype = {
	/**
	 * Sets the texture image.
	 *
	 * @param {object} options The image data and type parameters (see SpiderGL.WebGL.Texture constructor).
	 * @param {ArrayBuffer|ArrayBufferView|ImageData|HTMLImageElement|HTMLCanvasElement|HTMLVideoElement} [options.data] The texture image pixel data.
	 * @param {number} [options.internalFormat=SpiderGL.WebGL.Texture.DEFAULT_INTERNAL_FORMAT] The texture internal format.
	 * @param {number} [options.level=SpiderGL.WebGL.Texture.DEFAULT_LEVEL] The texture image mip level.
	 * @param {number} [options.width] If data is null or a typed array, specifies the texture image width. If handle is provided, the width parameter will supply the width information, not querable to the WebGLRenderingContext.
	 * @param {number} [options.height] If data is null or a typed array, specifies the texture image height. If handle is provided, the width parameter will supply the height information, not querable to the WebGLRenderingContext.
	 * @param {number} [options.border=SpiderGL.WebGL.Texture.DEFAULT_BORDER] Texture border.
	 * @param {number} [options.format=SpiderGL.WebGL.Texture.DEFAULT_FORMAT] The format parameter used for WebGLRenderingContext.texImage2D.
	 * @param {number} [options.type=SpiderGL.WebGL.Texture.DEFAULT_TYPE] The type parameter used for WebGLRenderingContext.texImage2D.
	 * @param {bool} [options.generateMipmap] If specified, overrides autoMipmap.
	 * @param {bool} [options.flipY] If specified, overrides flipYPolicy.
	 * @param {bool} [options.premultiplyAlpha] If specified, overrides premultiplyAlphaPolicy.
	 * @param {number} [options.colorspaceConversion] If specified, overrides colorspaceConversionPolicy.
	 * @param {function} [options.onCancel] If url is specified, this function will be called if image data loading is cancelled.
	 * @param {function} [options.onError] If url is specified, this function will be called if an error occurs when loading image data.
	 * @param {function} [options.onProgress] If url is specified, this function will be called during the image loading progress.
	 * @param {function} [options.onSuccess] If url is specified, this function will be called when image data has been successfully loaded.
	 *
	 * @see setSubImage
	 * @see SpiderGL.WebGL.Texture
	 */
	setImage : function (options) {
		return this._setImage(this._t, options);
	},

	/**
	 * Sets a region of the texture image.
	 *
	 * @param {object} options The image data and type parameters (see SpiderGL.WebGL.Texture constructor).
	 * @param {ArrayBuffer|ArrayBufferView|ImageData|HTMLImageElement|HTMLCanvasElement|HTMLVideoElement} [options.data] The texture sub-image pixel data.
	 * @param {number} [options.xoffset=SpiderGL.WebGL.Texture.DEFAULT_X_OFFSET] The sub-image x offset.
	 * @param {number} [options.yoffset=SpiderGL.WebGL.Texture.DEFAULT_Y_OFFSET] The sub-image y offset.
	 * @param {number} [options.width] If data is null or a typed array, specifies the texture image width. If handle is provided, the width parameter will supply the width information, not querable to the WebGLRenderingContext.
	 * @param {number} [options.height] If data is null or a typed array, specifies the texture image height. If handle is provided, the width parameter will supply the height information, not querable to the WebGLRenderingContext.
	 * @param {number} [options.border=SpiderGL.WebGL.Texture.DEFAULT_BORDER] Texture border.
	 * @param {number} [options.format=SpiderGL.WebGL.Texture.DEFAULT_FORMAT] The format parameter used for WebGLRenderingContext.texSubImage2D.
	 * @param {number} [options.type=SpiderGL.WebGL.Texture.DEFAULT_TYPE] The type parameter used for WebGLRenderingContext.texSubImage2D.
	 * @param {bool} [options.generateMipmap] If specified, overrides autoMipmap.
	 * @param {bool} [options.flipY] If specified, overrides flipYPolicy.
	 * @param {bool} [options.premultiplyAlpha] If specified, overrides premultiplyAlphaPolicy.
	 * @param {number} [options.colorspaceConversion] If specified, overrides colorspaceConversionPolicy.
	 * @param {function} [options.onCancel] If url is specified, this function will be called if image data loading is cancelled.
	 * @param {function} [options.onError] If url is specified, this function will be called if an error occurs when loading image data.
	 * @param {function} [options.onProgress] If url is specified, this function will be called during the image loading progress.
	 * @param {function} [options.onSuccess] If url is specified, this function will be called when image data has been successfully loaded.
	 *
	 * @see setImage
	 * @see SpiderGL.WebGL.Texture
	 */
	setSubImage : function (options) {
		return this._setSubImage(this._t, options);
	}
};

SpiderGL.Type.extend(SpiderGL.WebGL.Texture2D, SpiderGL.WebGL.Texture);

/**
 * Creates a SpiderGL.WebGL.TextureCubeMap.
 *
 * SpiderGL.WebGL.TextureCubeMap is a wrapper for cube map WebGLTexture objects.
 *
 * @class The SpiderGL.WebGL.TextureCubeMap is a wrapper for cube map WebGLTexture objects
 *
 * @augments SpiderGL.WebGL.Texture
 *
 * @param {WebGLRenderingContext} gl A WebGLRenderingContext hijacked with {@link SpiderGL.WebGL.Context.hijack}.
 * @param {object} [options] Optional parameters (see SpiderGL.WebGL.Texture constructor). This constructor accepts only the url options as an array of six strings, or internalFormat, width, height, format and type, ignoring the data property.
 *
 * @see SpiderGL.WebGL.Texture
 * @see SpiderGL.WebGL.Texture2D
 * @see SpiderGL.WebGL.Framebuffer
 * @see SpiderGL.WebGL.ObjectGL
 */
SpiderGL.WebGL.TextureCubeMap = function (gl, options) {
	if (!SpiderGL.WebGL.Context.isHijacked(gl)) { return null; }
	SpiderGL.WebGL.Texture.call(this, gl, SpiderGL.WebGL.TextureCubeMap.TARGET, options);
	if (!!this._h && !!this._h._spidergl && (this._h._spidergl != this)) return this._h._spidergl;

	options = options || { };
	if (SpiderGL.Type.instanceOf(options, WebGLTexture)) {
		options = { handle : options };
	}
	else if (SpiderGL.Type.isString(options)) {
		options = { url : options };
	}

	var faceTargets = SpiderGL.WebGL.TextureCubeMap._faceTargets;

	if (options.url) {
		var urls = options.url;
		var onSuccess = options.onSuccess;
		if (onSuccess) {
			options.onSuccess = (function(){
				var imagesLeft = 6;
				return function () {
					--imagesLeft;
					if (imagesLeft == 0) onSuccess.apply(options, null);
				}
			})();
		}
		for (var i=0; i<6; ++i) {
			options.url = urls[i];
			this.setImage(faceTargets[i], options);
		}
		options.onSuccess = onSuccess;
	}
	else if (options.data) {
		var datas = options.data;
		for (var i=0; i<6; ++i) {
			options.data = datas[i];
			this.setImage(faceTargets[i], options);
		}
	}
	else if ((options.width > 0) && (options.height > 0)) {
		for (var i=0; i<6; ++i) {
			this.setImage(faceTargets[i], options);
		}
	}
}

SpiderGL.WebGL.TextureCubeMap.TARGET = WebGLRenderingContext.TEXTURE_CUBE_MAP;

SpiderGL.WebGL.TextureCubeMap.unbind = function (gl, unit) {
	var cb  = gl.getExtension("SGL_current_binding");
	var dsa = gl.getExtension("SGL_direct_state_access");
	if (typeof unit == "undefined") {
		gl.bindTexture(SpiderGL.WebGL.TextureCubeMap.TARGET, null);
	}
	else {
		dsa.bindTexture(gl.TEXTURE0 + unit, SpiderGL.WebGL.TextureCubeMap.TARGET, null);
	}
};

SpiderGL.WebGL.TextureCubeMap._faceTargets = [
	WebGLRenderingContext.TEXTURE_CUBE_MAP_POSITIVE_X,
	WebGLRenderingContext.TEXTURE_CUBE_MAP_NEGATIVE_X,
	WebGLRenderingContext.TEXTURE_CUBE_MAP_POSITIVE_Y,
	WebGLRenderingContext.TEXTURE_CUBE_MAP_NEGATIVE_Y,
	WebGLRenderingContext.TEXTURE_CUBE_MAP_POSITIVE_Z,
	WebGLRenderingContext.TEXTURE_CUBE_MAP_NEGATIVE_Z
];

SpiderGL.WebGL.TextureCubeMap.prototype = {
	/**
	 * Sets the texture image for a cube face.
	 *
	 * @param {number} face The cube map face to set.
	 * @param {object} options The image data and type parameters (see SpiderGL.WebGL.Texture constructor).
	 * @param {ArrayBuffer|ArrayBufferView|ImageData|HTMLImageElement|HTMLCanvasElement|HTMLVideoElement} [options.data] The texture image pixel data.
	 * @param {number} [options.internalFormat=SpiderGL.WebGL.Texture.DEFAULT_INTERNAL_FORMAT] The texture internal format.
	 * @param {number} [options.width] If data is null or a typed array, specifies the texture image width. If handle is provided, the width parameter will supply the width information, not querable to the WebGLRenderingContext.
	 * @param {number} [options.height] If data is null or a typed array, specifies the texture image height. If handle is provided, the width parameter will supply the height information, not querable to the WebGLRenderingContext.
	 * @param {number} [options.border=SpiderGL.WebGL.Texture.DEFAULT_BORDER] Texture border.
	 * @param {number} [options.format=SpiderGL.WebGL.Texture.DEFAULT_FORMAT] The format parameter used for WebGLRenderingContext.texImage2D.
	 * @param {number} [options.type=SpiderGL.WebGL.Texture.DEFAULT_TYPE] The type parameter used for WebGLRenderingContext.texImage2D.
	 * @param {bool} [options.generateMipmap] If specified, overrides autoMipmap.
	 * @param {bool} [options.flipY] If specified, overrides flipYPolicy.
	 * @param {bool} [options.premultiplyAlpha] If specified, overrides premultiplyAlphaPolicy.
	 * @param {number} [options.colorspaceConversion] If specified, overrides colorspaceConversionPolicy.
	 * @param {function} [options.onCancel] If url is specified, this function will be called if image data loading is cancelled.
	 * @param {function} [options.onError] If url is specified, this function will be called if an error occurs when loading image data.
	 * @param {function} [options.onProgress] If url is specified, this function will be called during the image loading progress.
	 * @param {function} [options.onSuccess] If url is specified, this function will be called when image data has been successfully loaded.
	 *
	 * @see setSubImage
	 * @see SpiderGL.WebGL.Texture
	 */
	setImage : function (face, options) {
		/*
		var b = SpiderGL.WebGL.TextureCubeMap._faceBits[face];
		if (!b) return false;
		var r = this._setImage(face, options);
		if (r) { this._missingFaces &= ~b; }
		return r;
		*/
		return this._setImage(face, options);
	},

	/**
	 * Sets a region of the texture image for a cube face.
	 *
	 * @param {number} face The cube map face to set.
	 * @param {object} options The image data and type parameters (see SpiderGL.WebGL.Texture constructor).
	 * @param {ArrayBuffer|ArrayBufferView|ImageData|HTMLImageElement|HTMLCanvasElement|HTMLVideoElement} [options.data] The texture sub-image pixel data.
	 * @param {number} [options.xoffset=SpiderGL.WebGL.Texture.DEFAULT_X_OFFSET] The sub-image x offset.
	 * @param {number} [options.yoffset=SpiderGL.WebGL.Texture.DEFAULT_Y_OFFSET] The sub-image y offset.
	 * @param {number} [options.width] If data is null or a typed array, specifies the texture image width. If handle is provided, the width parameter will supply the width information, not querable to the WebGLRenderingContext.
	 * @param {number} [options.height] If data is null or a typed array, specifies the texture image height. If handle is provided, the width parameter will supply the height information, not querable to the WebGLRenderingContext.
	 * @param {number} [options.border=SpiderGL.WebGL.Texture.DEFAULT_BORDER] Texture border.
	 * @param {number} [options.format=SpiderGL.WebGL.Texture.DEFAULT_FORMAT] The format parameter used for WebGLRenderingContext.texSubImage2D.
	 * @param {number} [options.type=SpiderGL.WebGL.Texture.DEFAULT_TYPE] The type parameter used for WebGLRenderingContext.texSubImage2D.
	 * @param {bool} [options.generateMipmap] If specified, overrides autoMipmap.
	 * @param {bool} [options.flipY] If specified, overrides flipYPolicy.
	 * @param {bool} [options.premultiplyAlpha] If specified, overrides premultiplyAlphaPolicy.
	 * @param {number} [options.colorspaceConversion] If specified, overrides colorspaceConversionPolicy.
	 * @param {function} [options.onCancel] If url is specified, this function will be called if image data loading is cancelled.
	 * @param {function} [options.onError] If url is specified, this function will be called if an error occurs when loading image data.
	 * @param {function} [options.onProgress] If url is specified, this function will be called during the image loading progress.
	 * @param {function} [options.onSuccess] If url is specified, this function will be called when image data has been successfully loaded.
	 *
	 * @see setImage
	 * @see SpiderGL.WebGL.Texture
	 */
	setSubImage : function (face, options) {
		return this._setSubImage(face, options);
	}
};

SpiderGL.Type.extend(SpiderGL.WebGL.TextureCubeMap, SpiderGL.WebGL.Texture);

/*
SpiderGL Computer Graphics Library
Copyright (c) 2010, Marco Di Benedetto - Visual Computing Lab, ISTI - CNR
All rights reserved.

Redistribution and use in source and binary forms, with or without
modification, are permitted provided that the following conditions are met:
    * Redistributions of source code must retain the above copyright
      notice, this list of conditions and the following disclaimer.
    * Redistributions in binary form must reproduce the above copyright
      notice, this list of conditions and the following disclaimer in the
      documentation and/or other materials provided with the distribution.
    * Neither the name of SpiderGL nor the
      names of its contributors may be used to endorse or promote products
      derived from this software without specific prior written permission.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
DISCLAIMED. IN NO EVENT SHALL PAUL BRUNT BE LIABLE FOR ANY
DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
(INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
(INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
*/

/**
 * @fileOverview Model
 */

/**
 * The SpiderGL.Model namespace.
 *
 * @namespace The SpiderGL.Model namespace.
 */
SpiderGL.Model = { };

/**
 * Creates a SpiderGL.Model.Model.
 *
 * A SpiderGL.Model.Model is a layered data structure that represents a geometric model.
 * Through the model descriptor, it provides the elements needed to form a 3D model, e.g. raw data, semantic bindings, logical sub-structures, and higher level information.
 * Bottom to top, each layer in the stack relies at most on the previous one. While layer flexibility decreases bottom to top, their expressiveness increases.
 *
 * @class The SpiderGL.Model.Model represents a complex geometric model.
 *
 * @augments SpiderGL.Core.ObjectBase
 */
SpiderGL.Model.Model = function (gl, descriptor, options) {
	SpiderGL.Core.ObjectBase.call(this);

	options = SpiderGL.Utility.getDefaultObject({
	}, options);

	if (descriptor && ("vertices" in descriptor)) {
		descriptor = SpiderGL.Model.Model._createSimpleDescriptor(descriptor);
	}

	this._descriptor = SpiderGL.Model.Model._fixDescriptor(descriptor);
	this._gl = null;
	this._renderData = { };

	if (gl) {
		this.updateGL(gl, options);
		this.updateRenderData();
	}
};

SpiderGL.Model.Model.DEFAULT_VERTEX_STREAM_SIZE       = 3;
SpiderGL.Model.Model.DEFAULT_VERTEX_STREAM_TYPE       = SpiderGL.Type.FLOAT32;
SpiderGL.Model.Model.DEFAULT_VERTEX_STREAM_NORMALIZED = false;
SpiderGL.Model.Model.DEFAULT_VERTEX_STREAM_STRIDE     = 0;
SpiderGL.Model.Model.DEFAULT_VERTEX_STREAM_OFFSET     = 0;

SpiderGL.Model.Model.DEFAULT_PRIMITIVE_STREAM_MODE    = SpiderGL.Type.TRIANGLES;
SpiderGL.Model.Model.DEFAULT_PRIMITIVE_STREAM_FIRST   = 0;
SpiderGL.Model.Model.DEFAULT_PRIMITIVE_STREAM_COUNT   = -1;
SpiderGL.Model.Model.DEFAULT_PRIMITIVE_STREAM_TYPE    = SpiderGL.Type.UINT16;
SpiderGL.Model.Model.DEFAULT_PRIMITIVE_STREAM_OFFSET  = 0;

SpiderGL.Model.Model.DEFAULT_SIMPLE_MODEL_VERTEX_MAP = { };

SpiderGL.Model.Model.DEFAULT_SIMPLE_MODEL_VERTEX_MAP["position"] = {
	size       : 3,
	type       : SpiderGL.Type.FLOAT32,
	normalized : false,
	semantic   : "POSITION",
	index      : 0,
	value      : [0.0, 0.0, 0.0, 1.0]
};
SpiderGL.Model.Model.DEFAULT_SIMPLE_MODEL_VERTEX_MAP["normal"] = {
	size       : 3,
	type       : SpiderGL.Type.FLOAT32,
	normalized : false,
	semantic   : "NORMAL",
	index      : 0,
	value      : [0.0, 0.0, 1.0, 0.0]
};
SpiderGL.Model.Model.DEFAULT_SIMPLE_MODEL_VERTEX_MAP["color"] = {
	size       : 4,
	type       : SpiderGL.Type.UINT8,
	normalized : true,
	semantic   : "COLOR",
	index      : 0,
	value      : [0, 0, 0, 255]
};
SpiderGL.Model.Model.DEFAULT_SIMPLE_MODEL_VERTEX_MAP["texcoord"] = {
	size       : 2,
	type       : SpiderGL.Type.FLOAT32,
	normalized : false,
	semantic   : "TEXCOORD",
	index      : 0,
	value      : [0.0, 0.0, 0.0, 1.0]
};
SpiderGL.Model.Model.DEFAULT_SIMPLE_MODEL_VERTEX_MAP["user"] = {
	size       : 3,
	type       : SpiderGL.Type.FLOAT32,
	normalized : false,
	semantic   : "USER",
	index      : 0,
	value      : [0.0, 0.0, 0.0, 1.0]
};

SpiderGL.Model.Model.DEFAULT_SIMPLE_MODEL_PRIMITIVE_MAP = { };
SpiderGL.Model.Model.DEFAULT_SIMPLE_MODEL_PRIMITIVE_MAP["triangles"] = {
	mode       : SpiderGL.Type.TRIANGLES,
	type       : SpiderGL.Type.UINT16,
	count      : -1,
	semantic   : "FILL"
};
SpiderGL.Model.Model.DEFAULT_SIMPLE_MODEL_PRIMITIVE_MAP["triangleStrip"] = {
	mode       : SpiderGL.Type.TRIANGLE_STRIP,
	type       : SpiderGL.Type.UINT16,
	count      : -1,
	semantic   : "FILL"
};
SpiderGL.Model.Model.DEFAULT_SIMPLE_MODEL_PRIMITIVE_MAP["triangleFan"] = {
	mode       : SpiderGL.Type.TRIANGLE_FAN,
	type       : SpiderGL.Type.UINT16,
	count      : -1,
	semantic   : "FILL"
};
SpiderGL.Model.Model.DEFAULT_SIMPLE_MODEL_PRIMITIVE_MAP["lines"] = {
	mode       : SpiderGL.Type.LINES,
	type       : SpiderGL.Type.UINT16,
	count      : -1,
	semantic   : "LINE"
};
SpiderGL.Model.Model.DEFAULT_SIMPLE_MODEL_PRIMITIVE_MAP["lineStrip"] = {
	mode       : SpiderGL.Type.LINE_STRIP,
	type       : SpiderGL.Type.UINT16,
	count      : -1,
	semantic   : "LINE"
};
SpiderGL.Model.Model.DEFAULT_SIMPLE_MODEL_PRIMITIVE_MAP["lineLoop"] = {
	mode       : SpiderGL.Type.LINE_LOOP,
	type       : SpiderGL.Type.UINT16,
	count      : -1,
	semantic   : "LINE"
};
SpiderGL.Model.Model.DEFAULT_SIMPLE_MODEL_PRIMITIVE_MAP["points"] = {
	mode       : SpiderGL.Type.POINTS,
	type       : SpiderGL.Type.UINT16,
	count      : -1,
	semantic   : "POINT"
};
SpiderGL.Model.Model.DEFAULT_SIMPLE_MODEL_PRIMITIVE_MAP["user"] = {
	mode       : SpiderGL.Type.TRIANGLES,
	type       : SpiderGL.Type.UINT16,
	count      : -1,
	semantic   : "FILL"
};

SpiderGL.Model.Model._fixDescriptor = function (d) {
	d = SpiderGL.Utility.getDefaultObject({
		version  : "0.0.0.1 EXP",
		meta     : null,
		data     : null,
		access   : null,
		semantic : null,
		logic    : null
	}, d);

	d.meta     = SpiderGL.Model.Model._fixDescriptorMeta     (d.meta);
	d.data     = SpiderGL.Model.Model._fixDescriptorData     (d.data);
	d.access   = SpiderGL.Model.Model._fixDescriptorAccess   (d.access);
	d.semantic = SpiderGL.Model.Model._fixDescriptorSemantic (d.semantic);
	d.logic    = SpiderGL.Model.Model._fixDescriptorLogic    (d.logic);

	return d;
};

SpiderGL.Model.Model._fixDescriptorMeta = function (d) {
	d = SpiderGL.Utility.getDefaultObject({
		author      : null,
		date        : null,
		description : null
	}, d);
	return d;
};

SpiderGL.Model.Model._fixDescriptorData = function (d) {
	d = SpiderGL.Utility.getDefaultObject({
		vertexBuffers : null,
		indexBuffers  : null
	}, d);

	d.vertexBuffers = SpiderGL.Model.Model._fixDescriptorDataVertexBuffers (d.vertexBuffers);
	d.indexBuffers  = SpiderGL.Model.Model._fixDescriptorDataIndexBuffers  (d.indexBuffers);

	return d;
};

SpiderGL.Model.Model._fixDescriptorDataVertexBuffers = function (d) {
	d = SpiderGL.Utility.getDefaultObject({ }, d);
	for (var x in d) {
		d[x] = SpiderGL.Model.Model._fixDescriptorDataVertexBuffer(d[x]);
	}
	return d;
};

SpiderGL.Model.Model._fixDescriptorDataVertexBuffer = function (d) {
	return SpiderGL.Model.Model._fixDescriptorDataBuffer(d);
};

SpiderGL.Model.Model._fixDescriptorDataIndexBuffers = function (d) {
	d = SpiderGL.Utility.getDefaultObject({ }, d);
	for (var x in d) {
		d[x] = SpiderGL.Model.Model._fixDescriptorDataIndexBuffer(d[x]);
	}
	return d;
};

SpiderGL.Model.Model._fixDescriptorDataIndexBuffer = function (d) {
	return SpiderGL.Model.Model._fixDescriptorDataBuffer(d);
};

SpiderGL.Model.Model._fixDescriptorDataBuffer = function (d) {
	d = SpiderGL.Utility.getDefaultObject({
		type         : SpiderGL.Type.NO_TYPE,
		glType       : WebGLRenderingContext.NONE,
		untypedArray : null,
		typedArray   : null,
		glBuffer     : null
	}, d);
	return d;
};

SpiderGL.Model.Model._fixDescriptorAccess = function (d) {
	d = SpiderGL.Utility.getDefaultObject({
		vertexStreams    : null,
		primitiveStreams : null
	}, d);

	d.vertexStreams     = SpiderGL.Model.Model._fixDescriptorAccessVertexStreams    (d.vertexStreams);
	d.primitiveStreams  = SpiderGL.Model.Model._fixDescriptorAccessPrimitiveStreams (d.primitiveStreams);

	return d;
};

SpiderGL.Model.Model._fixDescriptorAccessVertexStreams = function (d) {
	d = SpiderGL.Utility.getDefaultObject({ }, d);
	for (var x in d) {
		d[x] = SpiderGL.Model.Model._fixDescriptorAccessVertexStream(d[x]);
	}
	return d;
};

SpiderGL.Model.Model._fixDescriptorAccessVertexStream = function (d) {
	d = SpiderGL.Utility.getDefaultObject({
		buffer     : null,
		size       : SpiderGL.Model.Model.DEFAULT_VERTEX_STREAM_SIZE,
		type       : SpiderGL.Model.Model.DEFAULT_VERTEX_STREAM_TYPE,
		glType     : SpiderGL.Type.typeToGL(SpiderGL.Model.Model.DEFAULT_VERTEX_STREAM_TYPE),
		normalized : SpiderGL.Model.Model.DEFAULT_VERTEX_STREAM_NORMALIZED,
		stride     : SpiderGL.Model.Model.DEFAULT_VERTEX_STREAM_STRIDE,
		offset     : SpiderGL.Model.Model.DEFAULT_VERTEX_STREAM_OFFSET
	}, d);
	return d;
};

SpiderGL.Model.Model._fixDescriptorAccessPrimitiveStreams = function (d) {
	d = SpiderGL.Utility.getDefaultObject({ }, d);
	for (var x in d) {
		d[x] = SpiderGL.Model.Model._fixDescriptorAccessPrimitiveStream(d[x]);
	}
	return d;
};

SpiderGL.Model.Model._fixDescriptorAccessPrimitiveStream = function (d) {
	d = SpiderGL.Utility.getDefaultObject({
		buffer     : null,
		mode       : SpiderGL.Model.Model.DEFAULT_PRIMITIVE_STREAM_MODE,
		first      : SpiderGL.Model.Model.DEFAULT_PRIMITIVE_STREAM_FIRST,
		count      : SpiderGL.Model.Model.DEFAULT_PRIMITIVE_STREAM_COUNT,
		type       : SpiderGL.Model.Model.DEFAULT_PRIMITIVE_STREAM_TYPE,
		glType     : SpiderGL.Type.typeToGL(SpiderGL.Model.Model.DEFAULT_PRIMITIVE_STREAM_TYPE),
		offset     : SpiderGL.Model.Model.DEFAULT_PRIMITIVE_STREAM_OFFSET
	}, d);
	return d;
};

SpiderGL.Model.Model._fixDescriptorSemantic = function (d) {
	d = SpiderGL.Utility.getDefaultObject({
		bindings : null,
		chunks   : null
	}, d);

	d.bindings = SpiderGL.Model.Model._fixDescriptorSemanticBindings (d.bindings);
	d.chunks   = SpiderGL.Model.Model._fixDescriptorSemanticChunks   (d.chunks);

	return d;
};

SpiderGL.Model.Model._fixDescriptorSemanticBindings = function (d) {
	d = SpiderGL.Utility.getDefaultObject({ }, d);
	for (var x in d) {
		d[x] = SpiderGL.Model.Model._fixDescriptorSemanticBinding(d[x]);
	}
	return d;
};

SpiderGL.Model.Model._fixDescriptorSemanticBinding = function (d) {
	d = SpiderGL.Utility.getDefaultObject({
		vertexStreams    : null,
		primitiveStreams : null
	}, d);

	d.vertexStreams    = SpiderGL.Model.Model._fixDescriptorSemanticBindingVertexStreams    (d.vertexStreams);
	d.primitiveStreams = SpiderGL.Model.Model._fixDescriptorSemanticBindingPrimitiveStreams (d.primitiveStreams);

	return d;
};

SpiderGL.Model.Model._fixDescriptorSemanticBindingVertexStreams = function (d) {
	d = SpiderGL.Utility.getDefaultObject({ }, d);
	for (var x in d) {
		d[x] = SpiderGL.Model.Model._fixDescriptorSemanticBindingVertexStream(d[x]);
	}
	return d;
};

SpiderGL.Model.Model._fixDescriptorSemanticBindingVertexStream = function (d) {
	if (!d) return null;
	if (SpiderGL.Type.isArray(d)) return d.slice();
	return [ d ];
};

SpiderGL.Model.Model._fixDescriptorSemanticBindingPrimitiveStreams = function (d) {
	d = SpiderGL.Utility.getDefaultObject({ }, d);
	for (var x in d) {
		d[x] = SpiderGL.Model.Model._fixDescriptorSemanticBindingPrimitiveStream(d[x]);
	}
	return d;
};

SpiderGL.Model.Model._fixDescriptorSemanticBindingPrimitiveStream = function (d) {
	if (!d) return null;
	if (SpiderGL.Type.isArray(d)) return d.slice();
	return [ d ];
};

SpiderGL.Model.Model._fixDescriptorSemanticChunks = function (d) {
	d = SpiderGL.Utility.getDefaultObject({ }, d);
	for (var x in d) {
		d[x] = SpiderGL.Model.Model._fixDescriptorSemanticChunk(d[x]);
	}
	return d;
};

SpiderGL.Model.Model._fixDescriptorSemanticChunk = function (d) {
	d = SpiderGL.Utility.getDefaultObject({
		techniques : null
	}, d);

	d.techniques = SpiderGL.Model.Model._fixDescriptorSemanticChunkTechniques(d.techniques);

	return d;
};

SpiderGL.Model.Model._fixDescriptorSemanticChunkTechniques = function (d) {
	d = SpiderGL.Utility.getDefaultObject({ }, d);
	for (var x in d) {
		d[x] = SpiderGL.Model.Model._fixDescriptorSemanticChunkTechnique(d[x]);
	}
	return d;
};

SpiderGL.Model.Model._fixDescriptorSemanticChunkTechnique = function (d) {
	d = SpiderGL.Utility.getDefaultObject({
		binding : null
	}, d);
	return d;
};

SpiderGL.Model.Model._fixDescriptorLogic = function (d) {
	d = SpiderGL.Utility.getDefaultObject({
		parts : null
	}, d);

	d.parts = SpiderGL.Model.Model._fixDescriptorLogicParts(d.parts);

	return d;
};

SpiderGL.Model.Model._fixDescriptorLogicParts = function (d) {
	d = SpiderGL.Utility.getDefaultObject({ }, d);
	for (var x in d) {
		d[x] = SpiderGL.Model.Model._fixDescriptorLogicPart(d[x]);
	}
	return d;
};

SpiderGL.Model.Model._fixDescriptorLogicPart = function (d) {
	d = SpiderGL.Utility.getDefaultObject({
		chunks : null
	}, d);

	d.chunks = SpiderGL.Model.Model._fixDescriptorLogicPartChunks(d.chunks);

	return d;
};

SpiderGL.Model.Model._fixDescriptorLogicPartChunks = function (d) {
	if (!d) return null;
	if (SpiderGL.Type.isArray(d)) return d.slice();
	return [ d ];
};

SpiderGL.Model.Model._createSimpleDescriptor = function (options) {
	options = SpiderGL.Utility.getDefaultObject({
		vertices   : null,
		primitives : null,
		options    : null
	}, options);

	var bindingName        = "mainBinding";
	var chunkName          = "mainChunk";
	var partName           = "mainPart";
	var vertexBufferSuffix = "VertexBuffer";
	var indexBufferSuffix  = "IndexBuffer";

	var d = {
		data : {
			vertexBuffers : {
			},
			indexBuffers : {
			},
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
		}
	};

	var binding = {
		vertexStreams : {
		},
		primitiveStreams : {
		}
	};
	d.semantic.bindings[bindingName] = binding;

	var chunk = {
		techniques : {
			"common" : {
				binding : bindingName
			}
		}
	};
	d.semantic.chunks[chunkName] = chunk;

	var part = {
		chunks : [ chunkName ]
	};
	d.logic.parts[partName] = part;

	var minBufferedCount = -1;
	var hasBuffered = false;
	var hasConstant = false;

	for (var x in options.vertices) {
		var src = options.vertices[x];
		if (!src) continue;

		if (SpiderGL.Type.isArray(src) || SpiderGL.Type.isTypedArray(src) || SpiderGL.Type.instanceOf(src, ArrayBuffer)) {
			src = { data : src };
		}

		var map = SpiderGL.Model.Model.DEFAULT_SIMPLE_MODEL_VERTEX_MAP[x];
		var mapSemantic = null;
		if (!map) {
			map = SpiderGL.Model.Model.DEFAULT_SIMPLE_MODEL_VERTEX_MAP["user"];
			mapSemantic = x.toUpperCase();
		}
		else {
			mapSemantic = map.semantic;
		}

		var info = SpiderGL.Utility.getDefaultObject({
			size       : map.size,
			type       : map.type,
			normalized : map.normalized,
			semantic   : mapSemantic,
			index      : map.index,
			data       : null,
			value      : map.value.slice()
		}, src);

		var accessor = {
			buffer     : null,
			size       : info.size,
			type       : info.type,
			normalized : info.normalized,
			stride     : 0,
			offset     : 0,
			value      : info.value.slice(),
		};

		if (info.data) {
			var buffer = {
				type : info.type
			};
			var count = 0;
			if (SpiderGL.Type.isArray(info.data)) {
				buffer.untypedArray = info.data;
				count = buffer.untypedArray.length / accessor.size;
			}
			else if (SpiderGL.Type.isTypedArray(src) || SpiderGL.Type.instanceOf(src, ArrayBuffer)) {
				buffer.typedArray = info.data;
				count = (buffer.typedArray.byteLength - accessor.offset) / (accessor.size * SpiderGL.Type.typeSize(accessor.type));
			}
			else {
				continue;
			}
			count = SpiderGL.Math.floor(count);
			hasBuffered = true;
			minBufferedCount = (minBufferedCount >= 0) ? (SpiderGL.Math.min(minBufferedCount, count)) : (count);
			var bufferName = x + vertexBufferSuffix;
			d.data.vertexBuffers[bufferName] = buffer;
			accessor.buffer = bufferName;
		}
		else {
			hasConstant = true;
		}

		var streamName = x;
		d.access.vertexStreams[streamName] = accessor;

		var streams = new Array(info.index + 1);
		streams[info.index] = streamName;
		binding.vertexStreams[info.semantic] = streams;
	}

	var minCount = 0;
	if (hasBuffered) {
		minCount = minBufferedCount;
	}
	else if (hasConstant) {
		minCount = 1;
	}

	var optionsPrimitives = options.primitives;
	if (SpiderGL.Type.isString(optionsPrimitives)) {
		optionsPrimitives = [ optionsPrimitives ];
	}
	if (SpiderGL.Type.isArray(optionsPrimitives)) {
		var op = optionsPrimitives;
		optionsPrimitives = { };
		for (var i=0, n=op.length; i<n; ++i) {
			var pn = op[i];
			if (!SpiderGL.Model.Model.DEFAULT_SIMPLE_MODEL_PRIMITIVE_MAP[pn]) continue;
			optionsPrimitives[pn] = { };
		}
	}

	for (var x in optionsPrimitives) {
		var src = optionsPrimitives[x];
		if (!src) continue;

		if (SpiderGL.Type.isArray(src) || SpiderGL.Type.isTypedArray(src) || SpiderGL.Type.instanceOf(src, ArrayBuffer)) {
			src = { data : src };
		}

		var map = SpiderGL.Model.Model.DEFAULT_SIMPLE_MODEL_PRIMITIVE_MAP[x];
		if (!map) map = SpiderGL.Model.Model.DEFAULT_SIMPLE_MODEL_PRIMITIVE_MAP["user"];

		var info = SpiderGL.Utility.getDefaultObject({
			mode     : map.mode,
			type     : map.type,
			count    : ((map.count >= 0) ? (map.count) : (minCount)),
			semantic : map.semantic
		}, src);

		var accessor = {
			buffer     : null,
			mode       : info.mode,
			first      : 0,
			count      : info.count,
			type       : info.type,
			offset     : 0
		};

		if (info.data) {
			var buffer = {
				type : info.type
			};
			var count = 0
			if (SpiderGL.Type.isArray(info.data)) {
				buffer.untypedArray = info.data;
				count = buffer.untypedArray.length;
			}
			else if (SpiderGL.Type.isTypedArray(src) || SpiderGL.Type.instanceOf(src, ArrayBuffer)) {
				buffer.typedArray = info.data;
				count = (buffer.typedArray.byteLength - accessor.offset) / (SpiderGL.Type.typeSize(accessor.type));
			}
			else {
				continue;
			}
			count = SpiderGL.Math.floor(count);
			var bufferName = x + indexBufferSuffix;
			d.data.indexBuffers[bufferName] = buffer;
			accessor.buffer = bufferName;
			accessor.count  = count;
		}

		var streamName = x;
		d.access.primitiveStreams[streamName] = accessor;

		var streams = new Array(1);
		streams[0] = streamName;
		binding.primitiveStreams[info.semantic] = streams;
	}

	return d;
};

SpiderGL.Model.Model.prototype = {
	get descriptor() {
		return this._descriptor;
	},

	get isReady() {
		return !!this._descriptor;
	},

	get gl() {
		return this._gl;
	},

	get renderData() {
		return this._renderData;
	},

	updateTypedArrays : function () {
		var d = this._descriptor;
		if (!d) return false;

		var buffer = null;
		var ctor   = null;

		var vertexBuffers = d.data.vertexBuffers;
		for (var x in vertexBuffers) {
			buffer = vertexBuffers[x];
			if (!buffer.untypedArray) continue;
			ctor = SpiderGL.Type.typeToTypedArrayConstructor(buffer.type);
			buffer.typedArray = new ctor(buffer.untypedArray);
		}

		var indexBuffers = d.data.indexBuffers;
		for (var x in indexBuffers) {
			buffer = indexBuffers[x];
			if (!buffer.untypedArray) continue;
			ctor = SpiderGL.Type.typeToTypedArrayConstructor(buffer.type);
			buffer.typedArray = new ctor(buffer.untypedArray);
		}

		return true;
	},

	updateGL : function (gl, options) {
		if (!gl) return false;

		var d = this._descriptor;
		if (!d) return false;

		this._gl = gl;

		var buffer     = null;
		var typedArray = null;
		var ctor       = null;

		var bufferOptions = SpiderGL.Utility.getDefaultObject({
			data   : null,
			usage  : SpiderGL.Core.DEFAULT
		}, options);
		bufferOptions.data = null;

		for (var x in d.data.vertexBuffers) {
			buffer = d.data.vertexBuffers[x];
			bufferOptions.data = buffer.typedArray;
			if (!bufferOptions.data) {
				ctor = SpiderGL.Type.typeToTypedArrayConstructor(buffer.type);
				bufferOptions.data = new ctor(buffer.untypedArray);
			}
			if (buffer.glBuffer) {
				buffer.glBuffer.destroy();
				buffer.glBuffer = null;
			}
			buffer.glBuffer = new SpiderGL.WebGL.VertexBuffer(gl, bufferOptions);
		}

		for (var x in d.data.indexBuffers) {
			buffer = d.data.indexBuffers[x];
			bufferOptions.data = buffer.typedArray;
			if (!bufferOptions.data) {
				ctor = SpiderGL.Type.typeToTypedArrayConstructor(buffer.type);
				bufferOptions.data = new ctor(buffer.untypedArray);
			}
			if (buffer.glBuffer) {
				buffer.glBuffer.destroy();
				buffer.glBuffer = null;
			}
			buffer.glBuffer = new SpiderGL.WebGL.IndexBuffer(gl, bufferOptions);
		}

		var stream = null;

		for (var x in d.access.vertexStreams) {
			stream = d.access.vertexStreams[x];
			stream.glType = SpiderGL.Type.typeToGL(stream.type);
		}

		for (var x in d.access.primitiveStreams) {
			stream = d.access.primitiveStreams[x];
			stream.glMode = SpiderGL.Type.primitiveToGL(stream.mode);
			stream.glType = SpiderGL.Type.typeToGL(stream.type);
		}

		return true;
	},

	destroyGL : function () {
		var d = this._descriptor;
		if (!d) return false;

		var buffer = null;

		for (var x in d.data.vertexBuffers) {
			buffer = d.data.vertexBuffers[x];
			if (buffer.glBuffer) {
				buffer.glBuffer.destroy();
				buffer.glBuffer = null;
			}
		}

		for (var x in d.data.indexBuffers) {
			buffer = d.data.indexBuffers[x];
			if (buffer.glBuffer) {
				buffer.glBuffer.destroy();
				buffer.glBuffer = null;
			}
		}
	},

	updateRenderData : function () {
		var d = this._descriptor;
		if (!d) return false;

		var renderData = {
			partMap : { }
		};

		for (var partName in d.logic.parts) {
			var part = d.logic.parts[partName];
			var chunkNames = part.chunks;
			var partInfo = { };
			renderData.partMap[partName] = partInfo;

			for (var i=0, n=chunkNames.length; i<n; ++i) {
				var chunkName = chunkNames[i];
				var chunk = d.semantic.chunks[chunkName];
				var chunkInfo = { };
				partInfo[chunkName] = chunkInfo;

				var techniques = chunk.techniques;
				for (var techniqueName in techniques) {
					var techique = techniques[techniqueName];
					var techiqueInfo = {
						vertexStreams : {
							buffered : [ ],
							constant : [ ]
						},
						primitiveStreams : { }
					};
					chunkInfo[techniqueName] = techiqueInfo;

					var binding = d.semantic.bindings[techique.binding];

					var streams = binding.vertexStreams;
					var bufferMap = { };
					for (var semantic in streams) {
						var streamNames = streams[semantic];
						for (var j=0, m=streamNames.length; j<m; ++j) {
							var streamName = streamNames[j];
							var stream = d.access.vertexStreams[streamName];
							var streamInfo = {
								semantic : semantic,
								index    : j,
								stream   : stream
							}
							var bufferName = stream.buffer;
							if (bufferName) {
								bufferMap[bufferName] = bufferMap[bufferName] || [ ];
								bufferMap[bufferName].push(streamInfo);
							}
							else {
								techiqueInfo.vertexStreams.constant.push(streamInfo);
							}
						}
					}
					for (var bufferName in bufferMap) {
						var bufferInfo = {
							buffer  : d.data.vertexBuffers[bufferName],
							streams : bufferMap[bufferName].slice()
						};
						techiqueInfo.vertexStreams.buffered.push(bufferInfo);
					}

					var streams = binding.primitiveStreams;
					for (var semantic in streams) {
						var bufferMap = { };
						var primitiveStreamsInfo = {
							buffered : [ ],
							array    : [ ]
						};
						techiqueInfo.primitiveStreams[semantic] = primitiveStreamsInfo;

						var streamNames = streams[semantic];
						for (var j=0, m=streamNames.length; j<m; ++j) {
							var streamName = streamNames[j];
							var stream = d.access.primitiveStreams[streamName];
							var bufferName = stream.buffer;
							if (bufferName) {
								bufferMap[bufferName] = bufferMap[bufferName] || [ ];
								bufferMap[bufferName].push(stream);
							}
							else {
								primitiveStreamsInfo.array.push(stream);
							}
						}
						for (var bufferName in bufferMap) {
							var bufferInfo = {
								buffer  : d.data.indexBuffers[bufferName],
								streams : bufferMap[bufferName].slice()
							};
							primitiveStreamsInfo.buffered.push(bufferInfo);
						}
					}
				}
			}
		}

		this._renderData = renderData;
	}
};

SpiderGL.Type.extend(SpiderGL.Model.Model, SpiderGL.Core.ObjectBase);

/**
 * Creates a SpiderGL.Model.Technique.
 *
 * @class The SpiderGL.Model.Technique handles the way a model is drawn.
 *
 * @augments SpiderGL.Core.ObjectBase
 */
SpiderGL.Model.Technique = function (gl, descriptor, options) {
	SpiderGL.Core.ObjectBase.call(this);

	options = SpiderGL.Utility.getDefaultObject({
	}, options);

	if (descriptor && ("vertexShader" in descriptor) && ("fragmentShader" in descriptor)) {
		descriptor = SpiderGL.Model.Technique._createSimpleDescriptor(gl, descriptor);
	}

	this._descriptor = SpiderGL.Model.Technique._fixDescriptor(descriptor);
	this._gl = this._descriptor.program.gl;
	this._renderData = { };

	if (gl) {
		this.updateRenderData();
	}
};

SpiderGL.Model.Technique._fixDescriptor = function (d) {
	d = SpiderGL.Utility.getDefaultObject({
		name     : "common",
		program  : null,
		semantic : { }
	}, d);

	if (d.vertexStreams) {
		d.semantic.vertexStreams = d.vertexStreams;
		delete d.vertexStreams;
	}

	if (d.globals) {
		d.semantic.globals = d.globals;
		delete d.globals;
	}

	d.semantic = SpiderGL.Model.Technique._fixSemantic(d.program, d.semantic);

	return d;
};

SpiderGL.Model.Technique._fixSemantic = function (p, d) {
	d = SpiderGL.Utility.getDefaultObject({
		vertexStreams : null,
		globals       : null
	}, d);

	d.vertexStreams = SpiderGL.Model.Technique._fixVertexStreams (p, d.vertexStreams);
	d.globals       = SpiderGL.Model.Technique._fixGlobals       (p, d.globals);

	return d;
};

SpiderGL.Model.Technique._fixVertexStreams = function (p, d) {
	var num = "0123456789";
	//var lwr = "abcdefghijklmnopqrstuvwxyz";
	//var upr = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

	var attribNames = p.getAttributesNames();
	var requiredAttribs = { };
	for (var i=0, n=attribNames.length; i<n; ++i) {
		var attribName  = attribNames[i];

		var semanticStr = "";
		var indexStr    = "";

		for (var j=attribName.length-1; j>=0; --j) {
			var ch = attribName.charAt(j);
			if (num.indexOf(ch, 0) == -1) {
				semanticStr = attribName.substring(0, j + 1);
				break;
			}
			indexStr = ch + indexStr;
		}
		var index = ((indexStr.length > 0) ? (parseInt(indexStr)) : (0));

		var len = semanticStr.length;
		if (len >= 2) {
			if (semanticStr.charAt(0) == "a") {
				var ch = semanticStr.charAt(1);
				if ((ch == "_") && (len > 2)) {
					semanticStr = semanticStr.substring(2);
				}
				else if (ch == semanticStr.charAt(1).toUpperCase()) {
					semanticStr = semanticStr.substring(1);
				}
			}
		}
		var semantic = semanticStr.toUpperCase();
		requiredAttribs[attribName] = {
			semantic : semantic,
			index    : index,
			value    : [0.0, 0.0, 0.0, 1.0]
		};
	}

	var dd = { };
	for (var x in d) {
		var r = requiredAttribs[x];
		if (!r) continue;

		var s = d[x];
		if (SpiderGL.Type.isString(s)) {
			s = { semantic : s };
		}
		else if (SpiderGL.Type.isArray(s) || SpiderGL.Type.isTypedArray(s)) {
			s = { value : s };
		}
		else if (SpiderGL.Type.isNumber(s)) {
			s = { value : [s, s, s, s] };
		}
		dd[x] = SpiderGL.Utility.getDefaultObject({
			semantic : r.semantic,
			index    : r.index,
			value    : r.value
		}, s);
	}

	d = SpiderGL.Utility.getDefaultObject(requiredAttribs, dd);
	return d;
};

SpiderGL.Model.Technique._fixGlobals = function (p, d) {
	var uniformValues = p.getUniformsValues();
	var requiredUniforms = { };
	for (var uniformName in uniformValues) {
		var semanticStr = uniformName;
		var len = semanticStr.length;
		if (len >= 2) {
			if (semanticStr.charAt(0) == "u") {
				var ch = semanticStr.charAt(1);
				if ((ch == "_") && (len > 2)) {
					semanticStr = semanticStr.substring(2);
				}
				else if (ch == semanticStr.charAt(1).toUpperCase()) {
					semanticStr = semanticStr.substring(1);
				}
			}
		}
		var semantic = semanticStr.toUpperCase();
		requiredUniforms[uniformName] = {
			semantic : semantic,
			value    : uniformValues[uniformName]
		};
	};

	d = SpiderGL.Utility.getDefaultObject(requiredUniforms, d);
	return d;
};

SpiderGL.Model.Technique._createSimpleDescriptor = function (gl, options) {
	options = SpiderGL.Utility.getDefaultObject({
		name           : "common",
		vertexShader   : null,
		fragmentShader : null,
		attributes     : null,
		uniforms       : null,
		semantic       : { },
		vertexStreams  : null,
		globals        : null,
		options        : null
	}, options);

	if (options.vertexStreams) {
		options.semantic.vertexStreams = options.vertexStreams;
		delete options.vertexStreams;
	}

	if (options.globals) {
		options.semantic.globals = options.globals;
		delete options.globals;
	}

	var d = {
		name     : options.name,
		program  : null,
		semantic : options.semantic
	};

	if (!gl) {
		return d;
	}

	var vertexShader = options.vertexShader;
	var fragmentShader = options.fragmentShader;

	if (!vertexShader || !fragmentShader) {
		return d;
	}

	if (SpiderGL.Type.isString(vertexShader)) {
		vertexShader = new SpiderGL.WebGL.VertexShader(gl, vertexShader);
	}
	else if (!SpiderGL.Type.instanceOf(vertexShader, SpiderGL.WebGL.VertexShader)) {
		return d;
	}

	if (SpiderGL.Type.isString(fragmentShader)) {
		fragmentShader = new SpiderGL.WebGL.FragmentShader(gl, fragmentShader);
	}
	else if (!SpiderGL.Type.instanceOf(fragmentShader, SpiderGL.WebGL.FragmentShader)) {
		return d;
	}

	var program = new SpiderGL.WebGL.Program(gl, {
		shaders    : [ vertexShader, fragmentShader ],
		attributes : options.attributes,
		uniforms   : options.uniforms
	});

	d.program = program;

	return d;
};

SpiderGL.Model.Technique.prototype = {
	get descriptor() {
		return this._descriptor;
	},

	get isReady() {
		return !!this._descriptor;
	},

	get gl() {
		return this._gl;
	},

	get name() {
		return this._descriptor.name;
	},

	get renderData() {
		return this._renderData;
	},

	get program() {
		return this._descriptor.program;
	},

	setUniforms : function (uniforms) {
		this._descriptor.program.setUniforms(uniforms);
	},

	updateRenderData : function () {
		var d = this._descriptor;

		var renderData = { };
		this._renderData = renderData;

		var attributesMap = { };
		renderData.attributesMap = attributesMap;
		var attributesIndices = d.program.getAttributesIndices();
		for (var attribName in d.semantic.vertexStreams) {
			var semanticInfo = d.semantic.vertexStreams[attribName];
			var semanticName = semanticInfo.semantic;
			var attribs = attributesMap[semanticName];
			if (!attribs) {
				attribs = [ ];
				attributesMap[semanticName] = attribs;
			}
			attribs[semanticInfo.index] = {
				index : attributesIndices[attribName],
				value : semanticInfo.value
			};
		}

		var globalsMap = { };
		renderData.globalsMap = globalsMap;
		for (var uniformName in d.semantic.globals) {
			var semanticInfo = d.semantic.globals[uniformName];
			globalsMap[semanticInfo.semantic] = {
				name  : uniformName,
				value : semanticInfo.value
			};
		}
	}
};

/**
 * Creates a SpiderGL.Model.Technique.
 *
 * @class The SpiderGL.Model.Technique handles the way a model is drawn.
 *
 * @augments SpiderGL.Core.ObjectBase
 */
SpiderGL.Model.ModelRenderer = function (gl) {
	this._gl = gl;
	this._vertexAttributesCount = gl.getParameter(gl.MAX_VERTEX_ATTRIBS);
	this._textureUnitsCount     = gl.getParameter(gl.MAX_TEXTURE_IMAGE_UNITS);
	this._internalFramebuffer   = new SpiderGL.WebGL.Framebuffer(gl);
	this._reset();
};

SpiderGL.Model.ModelRenderer.prototype = {
	_reset : function () {
		this._technique        = null;
		this._model            = null;
		this._partName         = null;
		this._chunkName        = null;
		this._primMode         = null;
		this._framebuffer      = null;

		this._inBegin          = false;

		this._enabledArrays    = [ ];
		this._boundTextures    = [ ];
		this._attribValues     = [ ];
		this._primitiveStreams = [ ];

		this._techniqueDirty   = true;
		this._modelDirty       = true;
		this._modelPartDirty   = true;
		this._modelChunkDirty  = true;
		this._primModeDirty    = true;
		this._framebufferDirty = true;
		this._viewportDirty    = true;

		this._dirty            = true;
	},

	_resetContext : function () {
		var gl = this._gl;

		for (var i=0, n=this._vertexAttributesCount; i<n; ++i) {
			gl.disableVertexAttribArray(i);
		}

		for (var i=this._textureUnitsCount-1; i>=0; --i) {
			gl.activeTexture(gl.TEXTURE0 + i);
			gl.bindTexture(gl.TEXTURE_2D, null);
			gl.bindTexture(gl.TEXTURE_CUBE_MAP, null);
		}

		SpiderGL.WebGL.VertexBuffer .unbind(gl);
		SpiderGL.WebGL.IndexBuffer  .unbind(gl);
		SpiderGL.WebGL.Program      .unbind(gl);
		SpiderGL.WebGL.Framebuffer  .unbind(gl);
	},

	_update : function () {
		if (!this._dirty) return true;

		var gl = this._gl;

		if (this._techniqueDirty) {
			var technique = this._technique;
			if (!technique) return false;

			var techniqueRenderData = technique.renderData;
			var attributesMap = techniqueRenderData.attributesMap;
			var attribValues = [ ];
			for (var semantic in attributesMap) {
				var attribs = attributesMap[semantic];
				for (var i in attribs) {
					var attribInfo = attribs[i];
					var attribData = null;
					if (attribInfo) {
						attribData = {
							index : attribInfo.index,
							value : attribInfo.value
						};
					}
					attribValues.push(attribData);
				}
			}
			this._attribValues = attribValues;

			technique.program.bind();

			this._techniqueDirty = false;
		}

		if (this._modelDirty) {
			var model = this._model;
			if (!model) return false;

			// default vertex attributes
			//////////////
			var attribValues = this._attribValues;
			for (var i=0, n=attribValues.length; i<n; ++i) {
				var attribData = attribValues[i];
				if (!attribData) continue;
				gl.vertexAttrib4fv(attribData.index, attribData.value);
			}
			//////////////

			var modelRenderData = model.renderData;

			var technique = this._technique;
			if (!technique) return false;

			var techniqueRenderData = technique.renderData;
			if (!techniqueRenderData) return false;
			var attributesMap = techniqueRenderData.attributesMap;

			if (this._modelPartDirty) {
				var partName = this._partName;
				if (!partName) return false;
				this._modelPartDirty = false;
			}

			if (this._modelChunkDirty) {
				var chunkName = this._chunkName;
				if (!chunkName) return false;

				var partInfo = modelRenderData.partMap[this._partName];
				if (!partInfo) return false;

				var chunkInfo = partInfo[chunkName];
				if (!chunkInfo) return false;

				var techniqueInfo = chunkInfo[technique.name];
				if (!techniqueInfo) {
					techniqueInfo = chunkInfo["common"];
				}
				if (!techniqueInfo) return false;

				// buffered vertex streams
				//////////////
				var enabledArrays = this._enabledArrays;
				for (var i=0, n=enabledArrays.length; i<n; ++i) {
					gl.disableVertexAttribArray(enabledArrays[i]);
				}
				enabledArrays = [ ];
				var streams = techniqueInfo.vertexStreams.buffered;
				for (var i=0, n=streams.length; i<n; ++i) {
					var data   = streams[i];
					var buffer = data.buffer.glBuffer;
					buffer.bind();

					var infos = data.streams;
					for (var j=0, m=infos.length; j<m; ++j) {
						var info   = infos[j];
						if (!attributesMap[info.semantic] || !attributesMap[info.semantic][info.index]) continue;
						var index  = attributesMap[info.semantic][info.index].index;
						var stream = info.stream;
						stream.index = index;
						enabledArrays.push(index);
						buffer.vertexAttribPointer(stream);
						//gl.enableVertexAttribArray(index);
						//gl.vertexAttribPointer(index, stream.size, stream.glType, stream.normalized, stream.stride, stream.offset);
					}
				}
				this._enabledArrays = enabledArrays;
				//////////////

				// constant vertex streams
				//////////////
				var infos = techniqueInfo.vertexStreams.constant;
				for (var j=0, n=infos.length; j<n; ++j) {
					var info   = infos[j];
					if (!attributesMap[info.semantic] || !attributesMap[info.semantic][info.index]) continue;
					var index  = attributesMap[info.semantic][info.index].index;
					var stream = info.stream;
					gl.vertexAttrib4fv(index, stream.value);
				}
				//////////////

				this._modelChunkDirty = false;
			}

			if (this._primModeDirty) {
				var primMode = this._primMode;
				if (!primMode) return false;

				var partInfo = modelRenderData.partMap[this._partName];
				if (!partInfo) return false;

				var chunkInfo = partInfo[this._chunkName];
				if (!chunkInfo) return false;

				var techniqueInfo = chunkInfo[technique.name];
				if (!techniqueInfo) {
					techniqueInfo = chunkInfo["common"];
				}
				if (!techniqueInfo) return false;

				var primitiveStreams = techniqueInfo.primitiveStreams[primMode];
				if (!primitiveStreams) return false;

				// primitive streams
				/////////////////////////////////////////////////
				this._primitiveStreams = primitiveStreams;

				this._primModeDirty = false;
			}

			this._modelDirty = false;
		}

		if (this._framebufferDirty) {
			if (this._framebuffer) {
				this._framebuffer.bind();
			}
			else {
				SpiderGL.WebGL.Framebuffer.unbind(gl);
			}
			this._framebufferDirty = false;
		}

		if (this._viewportDirty) {
			if (this._framebuffer) {
				if (this._framebuffer.autoViewport) {
					this._framebuffer.applyViewport();
				}
			}
			this._viewportDirty = false;
		}

		this._dirty = false;

		return true;
	},

	get gl() {
		return this._gl;
	},

	get isValid() {
		return (!!this._gl);
	},

	destroy : function () {
		this.end();
		this._internalFramebuffer.destroy();
		this._internalFramebuffer = null;
		this._gl = null;
	},

	begin : function () {
		if (this._inBegin) return;
		this._resetContext();
		this._inBegin = true;
	},

	end : function () {
		if (!this._inBegin) return;
		this._inBegin = false;
		var gl = this._gl;

		var enabledArrays = this._enabledArrays;
		for (var i=0, n=enabledArrays.length; i<n; ++i) {
			gl.disableVertexAttribArray(enabledArrays[i]);
		}

		var boundTextures = this._boundTextures;
		for (var i=0, n=boundTextures.length; i<n; ++i) {
			var tex = boundTextures[i];
			if (!tex) continue;
			if (tex.target == gl.TEXTURE_2D) {
				SpiderGL.WebGL.Texture2D.unbind(gl, tex.unit);
			}
			else if (tex.target == gl.TEXTURE_CUBE_MAP) {
				SpiderGL.WebGL.TextureCubeMap.unbind(gl, tex.unit);
			}
		}

		if (this._framebuffer) {
			SpiderGL.WebGL.Framebuffer.unbind(this._gl);
		}

		this._internalFramebuffer.detachAll();

		this._reset();
		this._resetContext();
	},

	get isInBegin() {
		return this._inBegin;
	},

	setTechnique : function (t) {
		if (!this._inBegin) return;
		if (this._technique == t) return;
		this._technique = t;
		this._techniqueDirty = true;
		this._dirty = true;

		if (!t) {
			SpiderGL.WebGL.Program.unbind(this._gl);
		}
	},

	get technique() {
		return this._technique;
	},

	setModel : function (m) {
		if (!this._inBegin) return;
		if (this._model == m) return;
		this._model = m;
		this._modelDirty = true;
		this._modelPartDirty = true;
		this._modelChunkDirty = true;
		this._dirty = true;
	},

	get model() {
		return this._model;
	},

	setPart : function (p) {
		if (!this._inBegin) return;
		if (this._part == p) return;
		this._partName = p;
		this._modelPartDirty = true;
		this._modelDirty = true;
		this._dirty = true;
	},

	get part() {
		return this._partName;
	},

	setChunk : function (c) {
		if (!this._inBegin) return;
		if (this._chunk == c) return;
		this._chunkName = c;
		this._modelDirty = true;
		this._modelChunkDirty = true;
		this._primModeDirty = true;
		this._dirty = true;
	},

	get chunk() {
		return this._chunkName;
	},

	setPrimitiveMode : function (m) {
		if (!this._inBegin) return;
		if (this._primMode == m) return;
		this._primMode = m;
		this._primModeDirty = true;
		this._modelDirty = true;
		this._dirty = true;
	},

	get primitiveMode() {
		return this._primMode;
	},

	setUniforms : function (u) {
		if (!this._inBegin) return;
		if (!this._technique) return;
		this._technique.program.setUniforms(u);
	},

	setDefaultGlobals : function () {
		if (!this._inBegin) return;

		var technique = this._technique;
		if (!technique) return;

		var globalsMap = technique.renderData.globalsMap;
		var uniforms = { };
		for (var semantic in globalsMap) {
			var uniformName  = globalsMap[semantic].name;
			var uniformValue = globalsMap[semantic].value;
			uniforms[uniformName] = uniformValue;
		}

		technique.program.setUniforms(uniforms);
	},

	setGlobals : function (g) {
		if (!this._inBegin) return;
		if (!g) return;

		var technique = this._technique;
		if (!technique) return;

		var globalsMap = technique.renderData.globalsMap;
		var uniforms = { };
		for (var semantic in g) {
			if (!globalsMap[semantic]) continue;
			var uniformName  = globalsMap[semantic].name;
			var uniformValue = g[semantic];
			uniforms[uniformName] = uniformValue;
		}

		technique.program.setUniforms(uniforms);
	},

	setFramebuffer : function (fb) {
		if (!this._inBegin) return;

		//this._internalFramebuffer.detachAll();
		if (this._framebuffer == fb) return;

		this._framebuffer = fb;
		this._framebufferDirty = true;
		this._viewportDirty = true;
		this._dirty = true;

		if (fb) {
			fb.bind();
		}
		else {
			SpiderGL.WebGL.Framebuffer.unbind(this._gl);
		}
	},

	activateOffScreenFramebuffer : function () {
		this.setFramebuffer(this._internalFramebuffer);
	},

	activateMainFramebuffer : function () {
		return this.setFramebuffer(null);
	},

	setFramebufferAttachments : function (attachments) {
		if (!this._inBegin) return;
		if (!this._framebuffer) return;
		this._framebuffer.setAttachments(attachments);
		this._framebufferDirty = true;
		this._viewportDirty = true;
	},

	setColorRenderTarget : function (rt) {
		if (!this._inBegin) return;
		if (!this._framebuffer) return;
		this._framebuffer.colorTarget = rt;
		this._viewportDirty = true;
		this._dirty = true;
	},

	setDepthRenderTarget : function (rt) {
		if (!this._inBegin) return;
		if (!this._framebuffer) return;
		this._framebuffer.depthTarget = rt;
		this._viewportDirty = true;
		this._dirty = true;
	},

	setStencilRenderTarget : function (rt) {
		if (!this._inBegin) return;
		if (!this._framebuffer) return;
		this._framebuffer.stencilTarget = rt;
		this._viewportDirty = true;
		this._dirty = true;
	},

	setDepthStencilRenderTarget : function (rt) {
		if (!this._inBegin) return;
		if (!this._framebuffer) return;
		this._framebuffer.depthStencilTarget = rt;
		this._viewportDirty = true;
		this._dirty = true;
	},

	clearFramebuffer : function (options) {
		if (!this._inBegin) return;
		if (!options) return;
		var gl   = this._gl;
		var mask = 0;
		if (SpiderGL.Type.isNumber(options)) {
			mask = options;
		}
		else {
			if ("color" in options) {
				var color = options.color;
				if (color) {
					gl.clearColor(color[0], color[1], color[2], color[3]);
				}
				mask |= gl.COLOR_BUFFER_BIT;
			}
			if ("depth" in options) {
				var depth = options.depth;
				if (SpiderGL.Type.isNumber(depth)) {
					gl.clearDepth(depth);
				}
				mask |= gl.DEPTH_BUFFER_BIT;
			}
			if ("stencil" in options) {
				var stencil = options.stencil;
				if (SpiderGL.Type.isNumber(stencil)) {
					gl.clearStencil(stencil);
				}
				mask |= gl.Stencil_BUFFER_BIT;
			}
		}
		if (mask) {
			var fb = this._framebuffer;
			if (fb) {
				fb.clear(mask);
			}
			else {
				gl.clear(mask);
			}
		}
	},

	setViewport : function (x, y, width, height) {
		if (!this._inBegin) return;
		var gl = this._gl;
		gl.viewport(x, y, width, height);
	},

	setTexture : function (unit, texture) {
		if (texture) {
			texture.bind(unit);
		}
		else {
			var gl = this._gl;
			SpiderGL.WebGL.Texture2D.unbind(gl, unit);
			SpiderGL.WebGL.TextureCubeMap.unbind(gl, unit);
		}
	},

	get canRender() {
		return (!!this._inBegin && !!this._technique && !!this._model && !!this._partName && !!this._chunkName && !!this._primMode);
	},

	render : function () {
		if (!this.canRender) return;
		if (!this._update()) return;

		var gl = this._gl;

		var primitiveStreams = this._primitiveStreams;

		var bufferedStreams = primitiveStreams.buffered;
		var arrayStreams    = primitiveStreams.array;

		// buffered
		//////////////
		for (var i=0, n=bufferedStreams.length; i<n; ++i) {
			var data = bufferedStreams[i];
			var buffer = data.buffer.glBuffer;
			buffer.bind();

			var infos = data.streams;
			for (var j=0, m=infos.length; j<m; ++j) {
				var stream = infos[j];
				//gl.drawElements(stream.glMode, stream.count, stream.glType, stream.offset);
				buffer.drawElements(stream);
			}
		}
		//////////////

		// array
		//////////////
		for (var j=0, n=arrayStreams.length; j<n; ++j) {
			var stream = arrayStreams[j];
			gl.drawArrays(stream.glMode, stream.first, stream.count);
		}
		//////////////
	},

	renderModelPart : function(partName) {
		var part = this.model.descriptor.logic.parts[partName];
		this.setPart(partName);
		for (var c in part.chunks) {
			var chunkName = part.chunks[c];
			this.setChunk(chunkName);
			this.render();
		}
	},

	renderModel : function() {
		var parts = this.model.descriptor.logic.parts;
		for (var partName in parts) {
			var part = parts[partName];
			this.setPart(partName);
			for (var c in part.chunks) {
				var chunkName = part.chunks[c];
				this.setChunk(chunkName);
				this.render();
			}
		}
	}
};
/*
SpiderGL Computer Graphics Library
Copyright (c) 2010, Marco Di Benedetto - Visual Computing Lab, ISTI - CNR
All rights reserved.

Redistribution and use in source and binary forms, with or without
modification, are permitted provided that the following conditions are met:
    * Redistributions of source code must retain the above copyright
      notice, this list of conditions and the following disclaimer.
    * Redistributions in binary form must reproduce the above copyright
      notice, this list of conditions and the following disclaimer in the
      documentation and/or other materials provided with the distribution.
    * Neither the name of SpiderGL nor the
      names of its contributors may be used to endorse or promote products
      derived from this software without specific prior written permission.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
DISCLAIMED. IN NO EVENT SHALL PAUL BRUNT BE LIABLE FOR ANY
DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
(INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
(INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
*/

/**
 * @fileOverview UI
 */

/**
 * The SpiderGL.UserInterface namespace.
 *
 * @namespace The SpiderGL.UserInterface namespace.
 */
SpiderGL.UserInterface = { };

/**
 * Creates a SpiderGL.UserInterface.CanvasHandler.
 *
 * SpiderGL.UserInterface.CanvasHandler is an event handler used to implement an easy controller for WebGL canvas.
 * It should not be directly used. Use {@link SpiderGL.UserInterface.handleCanvas} or {@link SpiderGL.UserInterface.handleCanvasOnLoad} to install it to a listener object.
 *
 * @class The SpiderGL.UserInterface.CanvasHandler is an event handler used to implement an easy controller for WebGL canvas. It should not be directly used.
 *
 * @augments SpiderGL.Core.ObjectBase
 *
 * @param {WebGLRenderingcontext} gl The WebGLRenderingcontext to pass to the handler.
 * @param {object} handler The event handler to which events will be dispatched.
 * @param {object} [options] Optional parameters
 * @param {bool} [options.standardGLUnpack=SpiderGL.UserInterface.CanvasHandler.DEFAULT_STANDARD_GL_UNPACK] If true, sets the default OpenGL unpack behaviour.
 * @param {number} [options.animateRate=SpiderGL.UserInterface.CanvasHandler.DEFAULT_ANIMATE_RATE] Additional options.
 *
 * @see SpiderGL.UserInterface.handleCanvas
 * @see SpiderGL.UserInterface.handleCanvasOnLoad
 */
SpiderGL.UserInterface.CanvasHandler = function (gl, handler, options) {
	SpiderGL.Core.ObjectBase.call(this);

	options = options || { };

	var that = this;
	var canvas = gl.canvas;

	this._gl        = gl;
	this._canvas    = canvas;
	this._handler   = handler;

	this._ignoreKeyRepeat = SpiderGL.Utility.getDefaultValue(options.ignoreKeyRepeat, SpiderGL.UserInterface.CanvasHandler.DEFAULT_IGNORE_KEY_REPEAT);
	this._keysDown = { };

	this._mouseButtonsDown = [false, false, false];

	this._dragging     = [false, false, false];
	this._dragStartPos = [[0, 0], [0, 0], [0, 0]];
	this._dragEndPos   = [[0, 0], [0, 0], [0, 0]];
	this._dragDeltaPos = [[0, 0], [0, 0], [0, 0]];

	this._cursorPos      = [0, 0];
	this._cursorPrevPos  = [0, 0];
	this._cursorDeltaPos = [0, 0];

	this._drawEventPending      = false;
	this._drawEventHandler      = function () { that._onDraw(); };
	this._postDrawEventFunction = function () { that._postDrawEvent(); };

	this._animateTime         = Date.now();
	this._animatePrevTime     = this._animateTime;
	this._animateDeltaTime    = 0;
	this._animateRate         = 0;
	this._animateID           = null;
	this._animateEventHandler = function () { that._onAnimate(); };
	this._animateMS           = -1;
	this._animateWithTimeout  = false;
	this._fastAnimate         = false;

	this._fpsUpdateMS  = 1000;
	this._fpsTime      = 0;
	this._fpsCount     = 0;
	this._fps          = 0;
	this._delegateDraw = function(t) { that._onDraw(t); };

	/** @private */
	var handleMessage = function (evt) {
		if (evt.source != window) return;
		if (evt.data == SpiderGL.UserInterface.CanvasHandler._FAST_ANIMATE_MESSAGE_NAME) {
			evt.stopPropagation();
			that._onAnimate();
		}
		else if (evt.data == SpiderGL.UserInterface.CanvasHandler._FAST_DRAW_MESSAGE_NAME) {
			evt.stopPropagation();
			that._onDraw();
		}
	};
	window.addEventListener("message", handleMessage, true);
 
	canvas.tabIndex = 0;

	canvas.addEventListener("unload",          function (e) { that._onTerminate       (e); }, false);
	canvas.addEventListener("keydown",         function (e) { that._onKeyDown         (e); }, false);
	canvas.addEventListener("keyup",           function (e) { that._onKeyUp           (e); }, false);
	canvas.addEventListener("keypress",        function (e) { that._onKeyPress        (e); }, false);
	canvas.addEventListener("mousedown",       function (e) { that._onMouseButtonDown (e); }, false);
	canvas.addEventListener("mouseup",         function (e) { that._onMouseButtonUp   (e); }, false);
	canvas.addEventListener("mousemove",       function (e) { that._onMouseMove       (e); }, false);
	canvas.addEventListener("mouseout",        function (e) { that._onMouseOut        (e); }, false);
	canvas.addEventListener("click",           function (e) { that._onClick           (e); }, false);
	canvas.addEventListener("dblclick",        function (e) { that._onDoubleClick     (e); }, false);
	canvas.addEventListener("resize",          function (e) { that._onResize          (e); }, false);
	canvas.addEventListener("DOMMouseScroll",  function (e) { that._onMouseWheel      (e); }, false);
	canvas.addEventListener("mousewheel",      function (e) { that._onMouseWheel      (e); }, false);
	canvas.addEventListener("blur",            function (e) { that._onBlur            (e); }, false);

	window.addEventListener("mouseup",         function (e) { that._onWindowMouseButtonUp (e); }, false);
	window.addEventListener("mousemove",       function (e) { that._onWindowMouseMove     (e); }, false);

	canvas.addEventListener("touchstart",      SpiderGL.UserInterface.CanvasHandler._touchHandler, false);
	canvas.addEventListener("touchend",        SpiderGL.UserInterface.CanvasHandler._touchHandler, false);
	canvas.addEventListener("touchmove",       SpiderGL.UserInterface.CanvasHandler._touchHandler, false);

	window.addEventListener("pointerup",       function (e) { if(e.pointerType=="touch") SpiderGL.UserInterface.CanvasHandler._touchHandler(e); else that._onWindowMouseButtonUp (e); }, false);
	window.addEventListener("pointermove",     function (e) { if(e.pointerType=="touch") SpiderGL.UserInterface.CanvasHandler._touchHandler(e); else that._onWindowMouseMove     (e); }, false);

	canvas.addEventListener("pointerdown",     function (e) { if(e.pointerType=="touch") SpiderGL.UserInterface.CanvasHandler._touchHandler(e); else that._onMouseButtonDown (e); }, false);
	canvas.addEventListener("pointerup",       function (e) { if(e.pointerType=="touch") SpiderGL.UserInterface.CanvasHandler._touchHandler(e); else that._onMouseButtonUp   (e); }, false);
	canvas.addEventListener("pointermove",     function (e) { if(e.pointerType=="touch") SpiderGL.UserInterface.CanvasHandler._touchHandler(e); else that._onMouseMove       (e); }, false);

	var standardGLUnpack = SpiderGL.Utility.getDefaultValue(options.standardGLUnpack, SpiderGL.UserInterface.CanvasHandler.DEFAULT_STANDARD_GL_UNPACK);
	if (standardGLUnpack) {
		SpiderGL.WebGL.Context.setStandardGLUnpack(gl);
	}

	this.animateRate = SpiderGL.Utility.getDefaultValue(options.animateRate, SpiderGL.UserInterface.CanvasHandler.DEFAULT_ANIMATE_RATE);
}

SpiderGL.UserInterface.CanvasHandler._FAST_DRAW_MESSAGE_NAME    = "spidergl-fast-draw-message";
SpiderGL.UserInterface.CanvasHandler._FAST_ANIMATE_MESSAGE_NAME = "spidergl-fast-animate-message";

/**
 * Default value for animate rate.
 *
 * @type number
 *
 * @default 0
 */
SpiderGL.UserInterface.CanvasHandler.DEFAULT_ANIMATE_RATE = 0;

/**
 * Default value for ignoring key repeats.
 *
 * @type bool
 *
 * @default true
 */
SpiderGL.UserInterface.CanvasHandler.DEFAULT_IGNORE_KEY_REPEAT = true;

/**
 * Default value for applying standard OpenGL pixel unpack parameters.
 *
 * @type bool
 *
 * @default true
 */
SpiderGL.UserInterface.CanvasHandler.DEFAULT_STANDARD_GL_UNPACK = true;

/**
 * Default name of the property to install in the handler object for accessing the canvas handler.
 *
 * @type string
 *
 * @default "ui"
 */
SpiderGL.UserInterface.CanvasHandler.DEFAULT_PROPERTY_NAME = "ui";

SpiderGL.UserInterface.CanvasHandler._multiTouch = { tmp:0, touches:[], evt:null, pan:false, btn:0, phase:0 };
SpiderGL.UserInterface.CanvasHandler._touchHandler = function (event) {

	var touches, first,
	diff   = 1,
	button = 0,
	type   = "";

	/**IE PATCH**/
	/**/if (event.type=="pointerdown") SpiderGL.UserInterface.CanvasHandler._multiTouch.touches.push(event);
	/**/else {
	/**/	for(i=0; i<SpiderGL.UserInterface.CanvasHandler._multiTouch.touches.length; i++) {
	/**/		if (event.pointerId==SpiderGL.UserInterface.CanvasHandler._multiTouch.touches[i].pointerId) SpiderGL.UserInterface.CanvasHandler._multiTouch.touches[i] = event;
	/**/	}
	/**/}
	/**/
	/**/if (navigator.userAgent.toLowerCase().indexOf('trident')>-1) { touches = SpiderGL.UserInterface.CanvasHandler._multiTouch.touches; first = touches[0]; }
	/**/else { touches = event.touches; first = event.changedTouches[0]; }
	/**IE PATCH**/

	switch(event.type)
	{
		case "touchstart": case "pointerdown": type = "mousedown"; break;
		case "touchmove":  case "pointermove": type = "mousemove"; break;
		case "touchend":   case "pointerup":   type = "mouseup";   break;
		default: return;
	}

	var simulatedEvent = document.createEvent("MouseEvent");

	if(touches.length>=2) {
		/**IE PATCH**/
		/**/if (navigator.userAgent.toLowerCase().indexOf('trident')<=-1) 
		/**IE PATCH**/
		{
			if(touches[0].target.id!="draw-canvas"||touches[1].target.id!="draw-canvas") return;
		}

		var dist = Math.sqrt(Math.pow((touches[0].clientX - touches[1].clientX),2)+Math.pow((touches[0].clientY - touches[1].clientY),2));
		var diff = dist - SpiderGL.UserInterface.CanvasHandler._multiTouch.tmp;
		SpiderGL.UserInterface.CanvasHandler._multiTouch.tmp = dist;
		/**IE PATCH**/
		/**/if(event.type=="pointerup") { 
		/**/	button = SpiderGL.UserInterface.CanvasHandler._multiTouch.btn;
		/**/	type = "mousedown";
		/**/}
		/**IE PATCH**/
		else if(/*SpiderGL.UserInterface.CanvasHandler._multiTouch.tmp!=0 &&*/ (diff<-0.995||diff>0.995)) {
			diff>0 ? diff=1 : diff=-1;
			type = "mousewheel";
		}
		else return;
	}
	else {
		/**IE PATCH**/
		/**/if(event.type=="pointerup"||event.type=="pointermove") if((!first)||(event.pointerId!=first.pointerId)) return;
		/**IE PATCH**/
		if(SpiderGL.UserInterface.CanvasHandler._multiTouch.tmp!=0&&event.type=="touchend") {
			button = SpiderGL.UserInterface.CanvasHandler._multiTouch.btn;
			type = "mousedown";
		}
		//TOUCH PAN START
		if (type=="mousedown") {
			SpiderGL.UserInterface.CanvasHandler._multiTouch.evt = event;
		}
		else if (type=="mouseup") { 
			if(SpiderGL.UserInterface.CanvasHandler._multiTouch.pan) {
				button = 1;
				SpiderGL.UserInterface.CanvasHandler._multiTouch.pan   = false;
				SpiderGL.UserInterface.CanvasHandler._multiTouch.phase = 0;
				/**FIREFOX PATCH**/
				/**/if(navigator.userAgent.toLowerCase().indexOf('firefox')>-1) SpiderGL.UserInterface.CanvasHandler._touchHandler(event);
				/**FIREFOX PATCH**/
			}
		}
		else if (type=="mousemove") {
			if(!SpiderGL.UserInterface.CanvasHandler._multiTouch.pan) {
				var start;
				/**IE PATCH**/
				/**/(navigator.userAgent.toLowerCase().indexOf('trident')>-1) ? (start=SpiderGL.UserInterface.CanvasHandler._multiTouch.evt) : (start=SpiderGL.UserInterface.CanvasHandler._multiTouch.evt.touches[0]);
				/**IE PATCH**/
				if((Math.sqrt(Math.pow((first.clientX - start.clientX),2)+Math.pow((first.clientY - start.clientY),2))<=2)&&(event.timeStamp-SpiderGL.UserInterface.CanvasHandler._multiTouch.evt.timeStamp>400)) SpiderGL.UserInterface.CanvasHandler._multiTouch.pan = true;
			}
			else {
				switch(SpiderGL.UserInterface.CanvasHandler._multiTouch.phase) {
					case 0:
						diff = -1;
						/**FIREFOX PATCH**/
						/**/(navigator.userAgent.toLowerCase().indexOf('firefox')>-1) ? (type = "mousemove") : (type = "mouseup");
						/**FIREFOX PATCH**/
						SpiderGL.UserInterface.CanvasHandler._multiTouch.phase++;
						break;
					case 1:
						button = 1;
						type = "mousedown";
						SpiderGL.UserInterface.CanvasHandler._multiTouch.phase++;
						break;
					default:
						button = 1;
						break;
				}
			}
		}
		//TOUCH PAN END
		SpiderGL.UserInterface.CanvasHandler._multiTouch.tmp = 0;
		SpiderGL.UserInterface.CanvasHandler._multiTouch.btn = button;
	}

	if(first){
		simulatedEvent.initMouseEvent(
			type, true, true, window, diff, 
			first.screenX, first.screenY, 
			first.clientX, first.clientY, false, 
			false, false, false, button, null
		);
		first.target.dispatchEvent(simulatedEvent);
	}

	/**IE PATCH**/
	/**/if(event.type=="pointerup") {
	/**/	for(i=0; i<SpiderGL.UserInterface.CanvasHandler._multiTouch.touches.length; i++) {
	/**/		if (SpiderGL.UserInterface.CanvasHandler._multiTouch.touches[i].pointerId>=event.pointerId) {
	/**/			if (i+1==SpiderGL.UserInterface.CanvasHandler._multiTouch.touches.length) SpiderGL.UserInterface.CanvasHandler._multiTouch.touches.pop(); 
	/**/			else SpiderGL.UserInterface.CanvasHandler._multiTouch.touches[i] = SpiderGL.UserInterface.CanvasHandler._multiTouch.touches[i+1]; 
	/**/		}
	/**/	}
	/**/}
	/**IE PATCH**/

	event.preventDefault();
	event.stopPropagation();
};

SpiderGL.UserInterface.CanvasHandler.prototype = {
	_firstNotify : function () {
		this._onInitialize();
		if (this._animateRate > 0) {
			this._onAnimate();
		}
		this.postDrawEvent();
	},

	_dispatch : function () {
		var evt     = arguments[0];
		var handler = this._handler;
		var method  = handler[evt];
		if (!method) return;
		var args = Array.prototype.slice.call(arguments, 1);
		var r = method.apply(handler, args);
		//if (r === false) return;
		//this._postDrawEvent();
	},

	_postDrawEvent : function () {
		this._postDrawCount = 5;
		if (this._drawEventPending) 
			return;
		
		this._drawEventPending = true;
		requestAnimationFrame(this._delegateDraw);
		//setTimeout(this._drawEventHandler, 0);
		//window.postMessage(SpiderGL.UserInterface.CanvasHandler._FAST_DRAW_MESSAGE_NAME, "*");
	},

	_getMouseClientPos : function(e) {
		var r = this._canvas.getBoundingClientRect();
		var w = this._canvas.width;
		var h = this._canvas.height;
		var x = e.clientX - r.left;
		var y = h - (e.clientY - r.top);
		var outside = ((x < 0) || (x >= w) || (y < 0) || (y >= h));
		return [x, y, outside];
	},

	/*
	_getTouchClientPos : function(e) {
		return this._getMouseClientPos(e);
	},
	*/

	_onInitialize : function () {
		this._dispatch("onInitialize");
	},

	_onTerminate : function () {
		this._dispatch("onTerminate");
	},

	_onBlur : function (e) {
		var gl = this._gl;
		var ks = this._keysDown;
		for (var c in ks) {
			if (ks[c]) {
				ks[c] = false;
				this._dispatch("onKeyUp", c, null);
			}
		}
	},

	_onKeyDown : function (e) {
		var c = e.keyCode;
		if(((c>=48) && (c<=90)))
		{
			var s = String.fromCharCode(c);
			c = s.toUpperCase();
		}

		var wasDown = this._keysDown[c];
		this._keysDown[c] = true;
		if (!wasDown || !this._ignoreKeyRepeat) {
			this._dispatch("onKeyDown", c, e);
		}
	},

	_onKeyUp : function (e) {
		var c = e.keyCode;
		if(((c>=48) && (c<=90)))
		{
			var s = String.fromCharCode(c);
			c = s.toUpperCase();
		}
		
		this._keysDown[c] = false;
		this._dispatch("onKeyUp", c, e);
	},

	_onKeyPress : function (e) {
		var c = e.keyCode;
		if(((c>=48) && (c<=90)))
		{
			var s = String.fromCharCode(c);
			c = s.toUpperCase();
		}
		
		this._dispatch("onKeyPress", c, e);
	},

	/*
	_onTouchStart : function (e) {
		e = e.changedTouches[0];
		this._canvas.focus();
		var xy  = this._getTouchClientPos(e);
		this._dispatch("onTouchStart", xy[0], xy[1], e);
		e.stopPropagation();
	},

	_onTouchEnd : function (e) {
		e = e.changedTouches[0];
		this._canvas.focus();
		var xy  = this._getTouchClientPos(e);
		this._dispatch("onTouchEnd", xy[0], xy[1], e);
		e.stopPropagation();
	},

	_onTouchMove : function (e) {
		e = e.changedTouches[0];
		this._canvas.focus();
		var xy  = this._getTouchClientPos(e);
		this._dispatch("onTouchMove", xy[0], xy[1], e);
		e.stopPropagation();
	},
	*/

	_onMouseButtonDown : function (e) {
		this._canvas.focus();

		var xy = this._getMouseClientPos(e);
		this._cursorPos = xy;

		var btn = e.button;
		this._mouseButtonsDown[btn] = true;
		this._dragStartPos[btn] = [xy[0], xy[1]];
		this._dispatch("onMouseButtonDown", btn, xy[0], xy[1], e);

		e.stopPropagation();
	},

	_onMouseButtonUp : function (e) {
		var xy = this._getMouseClientPos(e);
		this._cursorPos = xy;

		var btn = e.button;
		this._mouseButtonsDown[btn] = false;
		/**FIREFOX PATCH**/
		/**/if(navigator.userAgent.toLowerCase().indexOf('firefox')>-1) if(!e.isTrusted) return;
		/**FIREFOX PATCH**/
		this._dispatch("onMouseButtonUp", btn, xy[0], xy[1], e);

		if (this._dragging[btn]) {
			this._dragging[btn] = false;
			var sPos = this._dragStartPos[btn];
			var ePos = [xy[0], xy[1]];
			this._dragEndPos[btn] = ePos;
			this._dragDeltaPos[btn] = [ePos[0] - sPos[0], ePos[1] - sPos[1]];
			this._dispatch("onDragEnd", btn, ePos[0], ePos[1]);
		}

		e.stopPropagation();
	},

	_onWindowMouseButtonUp : function (e) {
		var xy = this._getMouseClientPos(e);
		this._cursorPos = xy;

		var btn = e.button;

		if (!this._mouseButtonsDown[btn]) return;

		this._mouseButtonsDown[btn] = false;
		/**FIREFOX PATCH**/
		/**/if(navigator.userAgent.toLowerCase().indexOf('firefox')>-1) if(!e.isTrusted) return;
		/**FIREFOX PATCH**/
		this._dispatch("onMouseButtonUp", btn, xy[0], xy[1], e);

		if (this._dragging[btn]) {
			this._dragging[btn] = false;
			var sPos = this._dragStartPos[btn];
			var ePos = [xy[0], xy[1]];
			this._dragEndPos[btn] = ePos;
			this._dragDeltaPos[btn] = [ePos[0] - sPos[0], ePos[1] - sPos[1]];
			this._dispatch("onDragEnd", btn, ePos[0], ePos[1]);
		}

		e.stopPropagation();
	},

	_onMouseMove : function (e) {
		this._cursorPrevPos = this._cursorPos;

		var xy = this._getMouseClientPos(e);
		this._cursorPos = xy;

		this._cursorDeltaPos = [this._cursorPos[0] - this._cursorPrevPos[0], this._cursorPos[1] - this._cursorPrevPos[1]];

		for (var i=0; i<3; ++i) {
			if (!this._mouseButtonsDown[i]||(this._cursorDeltaPos[0]==0&&this._cursorDeltaPos[1]==0)) continue;
			var sPos = this._dragStartPos[i];
			var ePos = [xy[0], xy[1]];
			this._dragEndPos[i] = ePos;
			this._dragDeltaPos[i] = [ePos[0] - sPos[0], ePos[1] - sPos[1]];
			if (!this._dragging[i]) {
				this._dragging[i] = true;
				this._dispatch("onDragStart", i, sPos[0], sPos[1]);
			}
			else this._dispatch("onDrag", i, ePos[0], ePos[1]);
		}

		this._dispatch("onMouseMove", xy[0], xy[1], e);

		e.stopPropagation();
	},

	_onWindowMouseMove : function (e) {
		this._cursorPrevPos = this._cursorPos;

		var xy = this._getMouseClientPos(e);
		this._cursorPos = xy;

		this._cursorDeltaPos = [this._cursorPos[0] - this._cursorPrevPos[0], this._cursorPos[1] - this._cursorPrevPos[1]];

		for (var i=0; i<3; ++i) {
			if (!this._dragging[i]) continue;
			var sPos = this._dragStartPos[i];
			var ePos = [xy[0], xy[1]];
			this._dragEndPos[i] = ePos;
			this._dragDeltaPos[i] = [ePos[0] - sPos[0], ePos[1] - sPos[1]];
			this._dispatch("onDrag", i, ePos[0], ePos[1]);
		}

		if (xy[2]) return;
		this._dispatch("onMouseMove", xy[0], xy[1], e);

		e.stopPropagation();
	},

	_onMouseWheel : function (e) {
		var xy = this._getMouseClientPos(e);
		var delta = 0;
		if (!e) {
			e = window.event;
		}
		if (e.wheelDelta) {
			delta = e.wheelDelta / 120;
			if (window.opera) {
				delta = -delta;
			}
		}
		else if (e.detail) {
			delta = -e.detail / 3;
		}
		if (delta) {
			this._dispatch("onMouseWheel", delta, xy[0], xy[1], e);
		}

		if (e.preventDefault) {
			e.preventDefault();
		}

		e.stopPropagation();
	},

	_onMouseOut: function(e) {
		var xy = this._getMouseClientPos(e);
		this._dispatch("onMouseOut", xy[0], xy[1], e);
	},

	_onClick : function (e) {
		var xy = this._getMouseClientPos(e);
		this._dispatch("onClick", e.button, xy[0], xy[1], e);
	},

	_onDoubleClick : function (e) {
		var xy = this._getMouseClientPos(e);
		this._dispatch("onDoubleClick", e.button, xy[0], xy[1], e);
	},

	_onResize : function (e) {
		this._dispatch("onResize", this._canvas.width, this._canvas.height, e);
	},

	_onAnimate : function () {
		this._animatePrevTime  = this._animateTime;
		this._animateTime      = Date.now();
		this._animateDeltaTime = this._animateTime - this._animatePrevTime;
		this._dispatch("onAnimate", this._animateDeltaTime / 1000);
		if (this._animateMS >= 0) {
			if (this._animateWithTimeout) {
				setTimeout(this._animateEventHandler, this._animateMS);
			}
		}
		else if (this._fastAnimate) {
			window.postMessage(SpiderGL.UserInterface.CanvasHandler._FAST_ANIMATE_MESSAGE_NAME, "*");
		}
	},

	_onDraw : function (timestamp) {
		this._drawEventPending = false;

		if(!this._fpsTime || this.postDrawCount == 5) { //new run
			this._fpsCount = 0;
		} else {
			this._fpsCount++;
			var diff = timestamp - this._fpsTime;
			this._fps = 0.8*this._fps + 0.2 *(1000/diff);
		}
		this._fpsTime = timestamp;

		this._dispatch("onDraw");
		if(this._postDrawCount-- > 0) {
			this._drawEventPending = true;
			requestAnimationFrame(this._delegateDraw);
		}
	},

	/**
	 * Gets the canvas hijacked WebGLRenderingContext.
	 *
	 * @type WebGLRenderingContext
	 *
	 * @readonly
	 */
	get gl() {
		return this._gl;
	},

	/**
	 * Gets the associated canvas.
	 *
	 * @type HTMLCanvasElement
	 *
	 * @readonly
	 */
	get canvas() {
		return this._canvas;
	},

	/**
	 * Gets the width of the associated canvas.
	 *
	 * @type number
	 *
	 * @readonly
	 */
	get width() {
		return this._canvas.width;
	},

	/**
	 * Gets the height of the associated canvas.
	 *
	 * @type number
	 *
	 * @readonly
	 */
	get height() {
		return this._canvas.height;
	},

	/**
	 * Gets a function that, once called, sends a draw event, which once handled will call the onDraw method of the registered handler.
	 *
	 * @type function
	 *
	 * @readonly
	 */
	get postDrawEvent() {
		return this._postDrawEventFunction;
	},

	/**
	 * Gets the time, in seconds, of the current onAnimate event.
	 *
	 * @type number
	 *
	 * @readonly
	 */
	get animateTime() {
		return this._animateTime;
	},

	/**
	 * Gets the time, in seconds, of the last onAnimate event.
	 *
	 * @type number
	 *
	 * @readonly
	 */
	get animatePrevTime() {
		return this._animatePrevTime;
	},

	/**
	 * Gets the elapsed time, in milliseconds, between the last and the current onAnimate event.
	 *
	 * @type number
	 *
	 * @readonly
	 */
	get animateDeltaTime() {
		return this._animateDeltaTime;
	},

	/**
	 * Gets/Sets the frequency (calls per second) used to emit the onAnimate event.
	 * If zero, the onAnimate event will be disabled. If greater than zero, specifies how many times emit the event per second.
	 * If less than zero, the event will be emitted as fast as possible.
	 *
	 * @type number
	 *
	 * @default SpiderGL.UserInterface.CanvasHandler.DEFAULT_ANIMATE_RATE
	 */
	get animateRate() {
		return this._animateRate;
	},

	set animateRate(r) {
		r = SpiderGL.Utility.getDefaultValue(r, SpiderGL.UserInterface.CanvasHandler.DEFAULT_ANIMATE_RATE);
		if (this._animateRate === r) return;

		this._fastAnimate = false;
		this._animateMS   = -1;

		this._animateTime      = Date.now();
		this._animatePrevTime  = this._animateTime;
		this._animateDeltaTime = 0;

		if (this._animateID) {
			clearInterval(this._animateID);
			this._animateID = null;
		}

		this._animateRate = r;

		if (r > 0) {
			this._animateMS = SpiderGL.Math.floor(1000 / r);
			if (this._animateWithTimeout) {
				setTimeout(this._animateEventHandler, this._animateMS);
			}
			else {
				this._animateID = setInterval(this._animateEventHandler, this._animateMS);
			}
		}
		else if (r < 0) {
			this._fastAnimate = true;
			window.postMessage(SpiderGL.UserInterface.CanvasHandler._FAST_ANIMATE_MESSAGE_NAME, "*");
		}
	},

	/**
	 * Gets the number of draw events occurred in the last second.
	 *
	 * @type number
	 *
	 * @readonly
	 */
	get framesPerSecond() {
		return this._fps;
	},

	/**
	 * Gets/Sets if the key repeat must be ignored.
	 *
	 * @type bool
	 * 
	 * @default SpiderGL.UserInterface.CanvasHandler.DEFAULT_IGNORE_KEY_REPEAT
	 */
	get ignoreKeyRepeat() {
		return this._ignoreKeyRepeat;
	},

	set ignoreKeyRepeat(on) {
		this._ignoreKeyRepeat = SpiderGL.Utility.getDefaultValue(on, SpiderGL.UserInterface.CanvasHandler.DEFAULT_IGNORE_KEY_REPEAT);
	},

	/**
	 * Tests if a key is pressed.
	 *
	 * @param {string|number} key The key to test.
	 *
	 * @returns {bool} True if the key is pressed, false otherwise.
	 */
	isKeyDown : function (key) {
		if (key.toUpperCase) {
			key = key.toUpperCase();
		}
		return this._keysDown[key];
	},

	/**
	 * Tests if a mouse button is pressed.
	 *
	 * @param {number} btn The button to test (0 = left, 1 = right, 2 = middle).
	 *
	 * @returns {bool} True if the mouse button is pressed, false otherwise.
	 */
	isMouseButtonDown : function (btn) {
		return this._mouseButtonsDown[btn];
	},

	/**
	 * Tests if a dragging (mouse move + mouse button down) operation is active.
	 *
	 * @param {number} btn The button to test (0 = left, 1 = right, 2 = middle).
	 *
	 * @returns {bool} True if the dragging operation is active with the specified mouse button, false otherwise.
	 */
	isDragging : function (btn) {
		var dragging = false;
		if(btn!==undefined) dragging = this._dragging[btn];
		else {
			for(i=0;i<3;i++) if(this._dragging[i]) return true;
		}
		return dragging;
//		return this._dragging[btn];
	},

	/**
	 * Gets the cursor x position when dragging has started.
	 *
	 * @param {number} btn The button to test (0 = left, 1 = right, 2 = middle).
	 *
	 * @returns {number} The cursor x position, relative to the canvas lower left corner, when the dragging has started.
	 */
	dragStartX : function (btn) {
		return this._dragStartPos[btn][0];
	},

	/**
	 * Gets the cursor y position when dragging has started.
	 *
	 * @param {number} btn The button to test (0 = left, 1 = right, 2 = middle).
	 *
	 * @returns {number} The cursor y position, relative to the canvas lower left corner, when the dragging has started.
	 */
	dragStartY : function (btn) {
		return this._dragStartPos[btn][1];
	},

	/**
	 * Gets the cursor x position when dragging has finished.
	 *
	 * @param {number} btn The button to test (0 = left, 1 = right, 2 = middle).
	 *
	 * @returns {number} The cursor x position, relative to the canvas lower left corner, when the dragging has finished.
	 */
	dragEndX : function (btn) {
		return this._dragEndPos[btn][0];
	},

	/**
	 * Gets the cursor y position when dragging has finished.
	 *
	 * @param {number} btn The button to test (0 = left, 1 = right, 2 = middle).
	 *
	 * @returns {number} The cursor y position, relative to the canvas lower left corner, when the dragging has finished.
	 */
	dragEndY : function (btn) {
		return this._dragEndPos[btn][1];
	},

	/**
	 * If dragging is ongoing, gets the difference between the current cursor x position and the cursor x position at dragging start.
	 *
	 * @param {number} btn The button to test (0 = left, 1 = right, 2 = middle).
	 *
	 * @returns {number} The difference between the current cursor x position and the cursor x position at dragging start.
	 */
	dragDeltaX : function (btn) {
		return this._dragDeltaPos[btn][0];
	},

	/**
	 * If dragging is ongoing, gets the difference between the current cursor y position and the cursor x position at dragging start.
	 *
	 * @param {number} btn The button to test (0 = left, 1 = right, 2 = middle).
	 *
	 * @returns {number} The difference between the current cursor y position and the cursor y position at dragging start.
	 */
	dragDeltaY : function (btn) {
		return this._dragDeltaPos[btn][1];
	},

	/**
	 * Gets the cursor x position, relative to the canvas lower left corner.
	 *
	 * @type number
	 */
	get cursorX() {
		return this._cursorPos[0];
	},

	/**
	 * Gets the cursor y position, relative to the canvas lower left corner.
	 *
	 * @type number
	 */
	get cursorY() {
		return this._cursorPos[1];
	},

	/**
	 * Gets the previous cursor x position, relative to the canvas lower left corner.
	 *
	 * @type number
	 */
	get cursorPrevX() {
		return this._cursorPrevPos[0];
	},

	/**
	 * Gets the previous cursor y position, relative to the canvas lower left corner.
	 *
	 * @type number
	 */
	get cursorPrevY() {
		return this._cursorPrevPos[1];
	},

	/**
	 * Gets the difference between the current and the previous cursor x position, relative to the canvas lower left corner.
	 *
	 * @type number
	 */
	get cursorDeltaX() {
		return this._cursorDeltaPos[0];
	},

	/**
	 * Gets the difference between the current and the previous cursor y position, relative to the canvas lower left corner.
	 *
	 * @type number
	 */
	get cursorDeltaY() {
		return this._cursorDeltaPos[1];
	},

	/**
	 * Calls immediately the onDraw event handler.
	 */
	draw : function () {
		this._onDraw();
	}
};

SpiderGL.Type.extend(SpiderGL.UserInterface.CanvasHandler, SpiderGL.Core.ObjectBase);

/**
 * Sets up a WebGL context and canvas event handling.
 * The WebGLRenderingContext is created and hijacked using {@link SpiderGL.WebGL.Context.getHijacked}.
 * A {@link SpiderGL.UserInterface.CanvasHandler} is created to handle the canvas events and dispatch them to the provided handler.
 * The canvas handler will be installed in the handler object as a named property.
 *
 * @param {HTMLCanvasElement|string} canvas The canvas used for rendering and from which event will be received.
 * @param {object} handler The event handler.
 * @param {function()} [handler.onInitialize] onInitialize event handler.
 * @param {function()} [handler.onTerminate] onTerminate event handler.
 * @param {function(keyCode, event)} [handler.onKeyUp] onKeyUp event handler.
 * @param {function(keyCode, event)} [handler.onKeyDown] onKeyDown event handler.
 * @param {function(keyCode, event)} [handler.onKeyPress] onKeyPress event handler.
 * @param {function(button, cursorX, cursorY, event)} [handler.onMouseButtonDown] onMouseButtonDown event handler.
 * @param {function(button, cursorX, cursorY, event)} [handler.onMouseButtonUp] onMouseButtonUp event handler.
 * @param {function(cursorX, cursorY, event)} [handler.onMouseMove] onMouseMove event handler.
 * @param {function(wheelDelta, cursorX, cursorY, event)} [handler.onMouseWheel] onMouseWheel event handler.
 * @param {function(button, cursorX, cursorY, event)} [handler.onClick] onClick event handler.
 * @param {function(button, cursorX, cursorY, event)} [handler.onDoubleClick] onDoubleClick event handler.
 * @param {function(button, cursorX, cursorY)} [handler.onDragStart] onDragStart event handler.
 * @param {function(button, cursorX, cursorY)} [handler.onDragEnd] onDragEnd event handler.
 * @param {function(button, cursorX, cursorY)} [handler.onDrag] onDrag event handler.
 * @param {function(canvasWidth, canvasHeight)} [handler.onResize] onResize event handler.
 * @param {function(deltaTimeSecs)} [handler.onAnimate] onAnimate event handler.
 * @param {function()} [handler.onDraw] onDraw event handler.
 * @param {object} options Optional parameters (see {@link SpiderGL.UserInterface.CanvasHandler}).
 * @param {string} [options.uiName=SpiderGL.UserInterface.CanvasHandler.DEFAULT_PROPERTY_NAME] The name of the property to install in the handler object for accessing the canvas handler.
 *
 * @see SpiderGL.UserInterface.handleCanvasOnLoad
 * @see SpiderGL.UserInterface.CanvasHandler
 */
SpiderGL.UserInterface.handleCanvas = function (canvas, handler, options) {
	if (!canvas || !handler) return false;

	options = options || { };

	var gl = SpiderGL.WebGL.Context.getHijacked(canvas, options);
	if (!gl) return false;

	var ui = new SpiderGL.UserInterface.CanvasHandler(gl, handler, options);
	if (!ui) return false;

	var uiName = SpiderGL.Utility.getDefaultValue(options.uiName, SpiderGL.UserInterface.CanvasHandler.DEFAULT_PROPERTY_NAME);
	handler[uiName] = ui;
	ui._firstNotify();

	return true;
}

/**
 * Sets up a WebGL context and canvas event handling after window loading.
 * When the window fires the onload event, {@link SpiderGL.UserInterface.handleCanvas} is called.
 *
 * @param {HTMLCanvasElement|string} canvas The canvas used for rendering and from which event will be received.
 * @param {object} handler The event handler (see {@link SpiderGL.UserInterface.handleCanvas}).
 * @param {object} options Optional parameters (see {@link SpiderGL.UserInterface.handleCanvas}).
 *
 * @see SpiderGL.UserInterface.handleCanvas
 */
SpiderGL.UserInterface.handleCanvasOnLoad = function (canvas, handler, options) {
	if (!canvas || !handler) return false;

	options = options || { };
	var onLoad = SpiderGL.Utility.getDefaultValue(options.onLoad, null);

	function doHandle() {
		SpiderGL.UserInterface.handleCanvas(canvas, handler, options);
		if (onLoad) { onLoad(); }
	}

	window.addEventListener("load", doHandle, false);
	return true;
}

