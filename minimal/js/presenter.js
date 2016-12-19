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

SpiderGL.openNamespace();

//----------------------------------------------------------------------------------------
// CONSTANTS
//----------------------------------------------------------------------------------------
// sgltrackball
const SGL_TRACKBALL_NO_ACTION = 0;
const SGL_TRACKBALL_ROTATE    = 1;
const SGL_TRACKBALL_PAN       = 2;
const SGL_TRACKBALL_DOLLY     = 3;
const SGL_TRACKBALL_SCALE     = 4;
// selectors
const HOP_ALL                 = 256;
// starting debug mode
const HOP_DEBUGMODE           = false;
// default light direction
const HOP_DEFAULTLIGHT        = [0, 0, -1];
// default points size
const HOP_DEFAULTPOINTSIZE    = 1.0;

Presenter = function (canvas) {
	this._supportsWebGL = sglHandleCanvas(canvas, this);
};

Presenter.prototype = {
//----------------------------------------------------------------------------------------
// PARSING FUNCTIONS
//----------------------------------------------------------------------------------------
_parseScene : function (options) {
	options = options || { };
	var r = {
		background     : this._parseBackground(options.background),
		meshes         : this._parseMeshes(options.meshes),
		texturedQuads  : this._parseTexturedQuads(options.texturedQuads),
		modelInstances : this._parseModelInstances(options.modelInstances),
		spots          : this._parseSpots(options.spots),
		trackball      : this._parseTrackball(options.trackball),
		space          : this._parseSpace(options.space),
		config         : this._parseConfig(options.config)
	};
	return r;
},

_parseBackground : function (options) {
	options = options || { };
	var r = sglGetDefaultObject({
		image         : null,
		isEnvironment : false,
		color         : [ 0.0, 0.0, 0.0, 0.0 ]
	}, options);
	return r;
},

_parseMeshes : function (options) {
	var r = { };
	for (var m in options) {
		r[m] = this._parseMesh(options[m]);
	}
	return r;
},

_parseMesh : function (options) {
	var r = sglGetDefaultObject({
		url       : null,
		transform : null
	}, options);
	r.transform = this._parseTransform(r.transform);
	return r;
},

_parseTexturedQuads : function (options) {
	var r = { };
	for (var m in options) {
		r[m] = this._parseTexturedQuad(options[m]);
	}
	return r;
},

_parseTexturedQuad : function (options) {
	return options;
},

_parseModelInstances : function (options) {
	var r = { };
	for (var m in options) {
		r[m] = this._parseModelInstance(options[m]);
	}
	return r;
},

_parseModelInstance : function (options) {
	var r = sglGetDefaultObject({
		mesh            : null,
		rendermode      : null,
		color           : [ 1.0, 1.0, 1.0 ],
		useSolidColor   : false,
		alpha           : 0.5,
		useTransparency : false,
		cursor          : "default",
		ID              : 0,
		transform       : null,
		visible         : true,
		tags            : [ ],
		clippable       : true,
	}, options);
	r.transform = this._parseTransform(r.transform);
	r.ID = this._instancesProgressiveID;
	if (r.color[3]) r.alpha = r.color[3];
	this._instancesProgressiveID += 1;
	return r;
},

_parseSpots : function (options) {
	var r = { };
	for (var m in options) {
		r[m] = this._parseSpot(options[m]);
	}
	return r;
},

_parseSpot : function (options) {
	var r = sglGetDefaultObject({
		mesh            : null,
		rendermode      : null,
		color           : [ 0.0, 0.25, 1.0 ],
		useSolidColor   : true,
		alpha           : 0.5,
		useTransparency : true,
		cursor          : "pointer",
		ID              : 0,
		transform       : null,
		visible         : true,
		tags            : [ ]
	}, options);
	r.transform = this._parseTransform(r.transform);
	r.ID = this._spotsProgressiveID;
	if (r.color[3]) r.alpha = r.color[3]; //3DHOP 2.0 backward compatibility
	this._spotsProgressiveID += 1;
	return r;
},

_parseTrackball : function (options) {
	var r = sglGetDefaultObject({
		type         : TurnTableTrackball,
		trackOptions : {}
	}, options);
	return r;
},

_parseSpace : function (options) {
	options = options || { };
	var r = sglGetDefaultObject({
		centerMode       : "first",
		radiusMode       : "first",
		whichInstanceCenter  : "",
		whichInstanceRadius  : "",
		explicitCenter   : [0.0, 0.0, 0.0],
		explicitRadius   : 1.0,
		transform        : null,
		cameraFOV        : 60.0,
		cameraNearFar    : [0.1, 10.0],
		cameraType       : "perspective",
	}, options);
	r.transform = this._parseTransform(r.transform);
	if(r.cameraFOV < 2.0) r.cameraFOV=2.0;
	if(r.cameraFOV > 88.0) r.cameraFOV=88.0;
	if((r.cameraType != "perspective") && (r.cameraType != "ortho"))
		r.cameraType = "perspective";
	return r;
},

_parseConfig : function (options) {
	options = options || { };
	var r = sglGetDefaultObject({
		pickedpointColor    : [1.0, 0.0, 1.0],
		measurementColor    : [0.5, 1.0, 0.5],
		showClippingPlanes  : true,
		showClippingBorder  : false,
		clippingBorderSize  : 0.5,
		clippingBorderColor : [0.0, 1.0, 1.0],
		pointSize           : 1.0,
		pointSizeMinMax     : [1.0, 5.0],
	}, options);
	return r;
},

_parseTransform : function (options) {
	var r = sglGetDefaultObject({
		matrix      : SglMat4.identity(),
		rotation    : [0.0, 0.0, 0.0],
		translation : [0.0, 0.0, 0.0],
		scale       : [1.0, 1.0, 1,0],
	}, options);

	// if any of rotation, translation or scale are defined, matrix is overwritten
	var overwrite = false;
	var matrixT = SglMat4.identity();
	var matrixR = SglMat4.identity();
	var matrixS = SglMat4.identity();
	if((r.translation[0] != 0.0)||(r.translation[1] != 0.0)||(r.translation[2] != 0.0))
	{
		matrixT = SglMat4.translation(r.translation);
		overwrite = true;
	}
	if((r.rotation[0] != 0.0)||(r.rotation[1] != 0.0)||(r.rotation[2] != 0.0))
	{
		var mrX = SglMat4.rotationAngleAxis(sglDegToRad(r.rotation[0]), [1.0, 0.0, 0.0]);
		var mrY = SglMat4.rotationAngleAxis(sglDegToRad(r.rotation[1]), [0.0, 1.0, 0.0])
		var mrZ = SglMat4.rotationAngleAxis(sglDegToRad(r.rotation[2]), [0.0, 0.0, 1.0])
		matrixR = SglMat4.mul(SglMat4.mul(mrZ, mrY), mrX);
		overwrite = true;
	}
	if((r.scale[0] != 1.0)||(r.scale[1] != 1.0)||(r.scale[2] != 1.0))
	{
		matrixS = SglMat4.scaling(r.scale);
		overwrite = true;
	}
	if (overwrite)
		r.matrix = SglMat4.mul(SglMat4.mul(matrixT, matrixR), matrixS);

	return r;
},

//----------------------------------------------------------------------------------------
//SHADERS RELATED FUNCTIONS
//----------------------------------------------------------------------------------------
// standard program for NXS rendering, points and faces
_createStandardPointNXSProgram : function () {
	var gl = this.ui.gl;
	var nxsVertexShader = new SglVertexShader(gl, "\
		precision highp float;                                                \n\
																			  \n\
		uniform   mat4 uWorldViewProjectionMatrix;                            \n\
		uniform   mat3 uViewSpaceNormalMatrix;                                \n\
		uniform   mat4 uModelMatrix;                                          \n\
		uniform   float uPointSize;                                           \n\
																			  \n\
		attribute vec3 aPosition;                                             \n\
		attribute vec3 aNormal;                                               \n\
		attribute vec4 aColor;                                                \n\
		attribute float aPointSize;                                           \n\
																			  \n\
		varying   vec3 vNormal;                                               \n\
		varying   vec4 vColor;                                                \n\
		varying   vec4 vModelPos;                                             \n\
																			  \n\
		void main(void)                                                       \n\
		{                                                                     \n\
			vNormal     = uViewSpaceNormalMatrix * aNormal;                   \n\
			vColor      = aColor;                                             \n\
			vModelPos   = uModelMatrix * vec4(aPosition, 1.0);                \n\
																			  \n\
			gl_Position  = uWorldViewProjectionMatrix * vec4(aPosition, 1.0); \n\
			gl_PointSize = uPointSize * aPointSize;							  \n\
		}                                                                     \n\
	");
	if(this._isDebugging)
		console.log("STD POINT Vertex Shader Log:\n" + nxsVertexShader.log);

	var nxsFragmentShader = new SglFragmentShader(gl, "\
		#extension GL_EXT_frag_depth : enable								  \n\
		precision highp float;                                                \n\
																			  \n\
		uniform   vec3 uViewSpaceLightDirection;                              \n\
		uniform   float uAlpha;                                               \n\
		uniform   bool uUseSolidColor;                                        \n\
		uniform   vec3 uSolidColor;                                           \n\
		uniform   vec3 uClipPoint;                                            \n\
		uniform   vec3 uClipAxis;                                             \n\
		uniform   vec3 uClipColor;                                            \n\
		uniform   float uClipColorSize;                                       \n\
																			  \n\
		varying   vec3 vNormal;                                               \n\
		varying   vec4 vColor;                                                \n\
		varying   vec4 vModelPos;                                             \n\
																			  \n\
		void main(void)                                                       \n\
		{                                                                     \n\
			if((uClipAxis[0] == 1.0)&&(vModelPos[0] > uClipPoint[0])) discard;        \n\
			else if((uClipAxis[0] == -1.0)&&(vModelPos[0] < uClipPoint[0])) discard;  \n\
			if((uClipAxis[1] == 1.0)&&(vModelPos[1] > uClipPoint[1])) discard;        \n\
			else if((uClipAxis[1] == -1.0)&&(vModelPos[1] < uClipPoint[1])) discard;  \n\
			if((uClipAxis[2] == 1.0)&&(vModelPos[2] > uClipPoint[2])) discard;        \n\
			else if((uClipAxis[2] == -1.0)&&(vModelPos[2] < uClipPoint[2])) discard;  \n\
																			  \n\
			float a = pow(2.0*(gl_PointCoord.x - 0.5), 2.0);				  \n\
			float b = pow(2.0*(gl_PointCoord.y - 0.5), 2.0);				  \n\
			float c = 1.0 - (a + b);										  \n\
			if(c < 0.0) { discard; }										  \n\
																			  \n\
			vec3  diffuse = vColor.rgb;                                       \n\
																			  \n\
			if(uUseSolidColor) {                                              \n\
			  if(uSolidColor.r + uSolidColor.g + uSolidColor.b == -3.0)       \n\
				diffuse = vColor.aaa;                                         \n\
			  else                                                            \n\
				diffuse = uSolidColor;                                        \n\
			}                                                                 \n\
																			  \n\
			if(vNormal[0] != 0.0 || vNormal[1] != 0.0 || vNormal[2] != 0.0) { \n\
			  vec3  normal  = normalize(vNormal);                             \n\
			  float nDotL   = dot(normal, -uViewSpaceLightDirection);         \n\
			  diffuse = diffuse * max(0.0, nDotL);                            \n\
			}                                                                 \n\
																			  \n\
			if((uClipAxis[0] == 1.0)&&((uClipPoint[0]-vModelPos[0])<uClipColorSize)) diffuse = uClipColor;       \n\
			else if((uClipAxis[0] == -1.0)&&((vModelPos[0]-uClipPoint[0])<uClipColorSize)) diffuse = uClipColor; \n\
			if((uClipAxis[1] == 1.0)&&((uClipPoint[1]-vModelPos[1])<uClipColorSize)) diffuse = uClipColor;       \n\
			else if((uClipAxis[1] == -1.0)&&((vModelPos[1]-uClipPoint[1])<uClipColorSize)) diffuse = uClipColor; \n\
			if((uClipAxis[2] == 1.0)&&((uClipPoint[2]-vModelPos[2])<uClipColorSize)) diffuse = uClipColor;       \n\
			else if((uClipAxis[2] == -1.0)&&((vModelPos[2]-uClipPoint[2])<uClipColorSize)) diffuse = uClipColor; \n\
																			  \n\			gl_FragColor  = vec4(diffuse, uAlpha);                            \n\
			gl_FragDepthEXT = gl_FragCoord.z + 0.0001*(1.0-pow(c, 2.0));      \n\
		}                                                                     \n\
	");
	if(this._isDebugging)
		console.log("STD POINT Fragment Shader Log:\n" + nxsFragmentShader.log);

	var program = new SglProgram(gl, {
		shaders    : [
			nxsVertexShader,
			nxsFragmentShader
		],
		attributes : {
			"aPosition" : 0,
			"aNormal"   : 1,
			"aColor"    : 2,
			"aPointSize": 4
		},
		uniforms   : {
			"uWorldViewProjectionMatrix" : SglMat4.identity(),
			"uViewSpaceNormalMatrix"     : SglMat3.identity(),
			"uModelMatrix" 				 : SglMat4.identity(),
			"uViewSpaceLightDirection"   : [0.0, 0.0, -1.0],
			"uPointSize"                 : 1.0,
			"uAlpha"                     : 1.0,
			"uUseSolidColor"             : false,
			"uSolidColor"                : [1.0, 1.0, 1.0],
			"uClipPoint"                 : [0.0, 0.0, 0.0],
			"uClipAxis"                  : [0.0, 0.0, 0.0],
			"uClipColor"				 : [1.0, 1.0, 1.0],
			"uClipColorSize"			 : 0.5
		}
	});
	if(this._isDebugging)
		console.log("STD POINT Program Log:\n" + program.log);

	return program;
},

_createStandardFaceNXSProgram : function () {
	var gl = this.ui.gl;
	var nxsVertexShader = new SglVertexShader(gl, "\
		precision highp float;                                                \n\
																			  \n\
		uniform   mat4 uWorldViewProjectionMatrix;                            \n\
		uniform   mat3 uViewSpaceNormalMatrix;                                \n\
		uniform   mat4 uModelMatrix;                                          \n\
																			  \n\
		attribute vec3 aPosition;                                             \n\
		attribute vec3 aNormal;                                               \n\
		attribute vec4 aColor;                                                \n\
		attribute vec2 aTextureCoord;                                         \n\
																			  \n\
		varying   vec3 vNormal;                                               \n\
		varying   vec4 vColor;                                                \n\
		varying   vec4 vModelPos;                                             \n\
		varying   vec2 vTextureCoord;                            			  \n\
																			  \n\
		void main(void)                                                       \n\
		{                                                                     \n\
			vNormal       = uViewSpaceNormalMatrix * aNormal;                 \n\
			vColor        = aColor;                                           \n\
			vModelPos     = uModelMatrix * vec4(aPosition, 1.0);              \n\
			vTextureCoord = aTextureCoord;                       			  \n\
																			  \n\
			gl_Position = uWorldViewProjectionMatrix * vec4(aPosition, 1.0);  \n\
		}                                                                     \n\
	");
	if(this._isDebugging)
		console.log("STD FACE Vertex Shader Log:\n" + nxsVertexShader.log);

	var nxsFragmentShader = new SglFragmentShader(gl, "\
		precision highp float;                                                \n\
																			  \n\
		uniform   vec3 uViewSpaceLightDirection;                              \n\
		uniform   float uAlpha;                                               \n\
		uniform   bool uUseSolidColor;                                        \n\
		uniform   vec3 uSolidColor;                                           \n\
		uniform   vec3 uClipPoint;                                            \n\
		uniform   vec3 uClipAxis;                                             \n\
		uniform   vec3 uClipColor;                                            \n\
		uniform   float uClipColorSize;                                       \n\
		uniform   sampler2D uSampler;                                         \n\
																			  \n\
		varying   vec3 vNormal;                                               \n\
		varying   vec4 vColor;                                                \n\
		varying   vec4 vModelPos;                                             \n\
		varying   vec2 vTextureCoord;                                         \n\
																			  \n\
		void main(void)                                                       \n\
		{                                                                     \n\
			if((uClipAxis[0] == 1.0)&&(vModelPos[0] > uClipPoint[0])) discard;       \n\
			else if((uClipAxis[0] == -1.0)&&(vModelPos[0] < uClipPoint[0])) discard; \n\
			if((uClipAxis[1] == 1.0)&&(vModelPos[1] > uClipPoint[1])) discard;       \n\
			else if((uClipAxis[1] == -1.0)&&(vModelPos[1] < uClipPoint[1])) discard; \n\
			if((uClipAxis[2] == 1.0)&&(vModelPos[2] > uClipPoint[2])) discard;       \n\
			else if((uClipAxis[2] == -1.0)&&(vModelPos[2] < uClipPoint[2])) discard; \n\
																			  \n\
			vec3  diffuse = vColor.rgb;                                       \n\
																			  \n\
			if(vTextureCoord.x != 0.0)                                        \n\
			  diffuse = texture2D(uSampler, vTextureCoord).xyz;               \n\
																			  \n\
			if(uUseSolidColor) {                                              \n\
			  if(uSolidColor.r + uSolidColor.g + uSolidColor.b == -3.0)       \n\
				diffuse = vColor.aaa;                                         \n\
			  else                                                            \n\
				diffuse = uSolidColor;                                        \n\
			}                                                                 \n\
																			  \n\
			if(vNormal[0] != 0.0 || vNormal[1] != 0.0 || vNormal[2] != 0.0) { \n\
			  vec3  normal  = normalize(vNormal);                             \n\
			  float nDotL   = dot(normal, -uViewSpaceLightDirection);         \n\
				if(gl_FrontFacing)                                            \n\
					diffuse = diffuse * max(0.0, nDotL);                      \n\
				else                                                          \n\
					diffuse = diffuse * vec3(0.4, 0.3, 0.3) * abs(nDotL);     \n\
			}                                                                 \n\
			else if(!gl_FrontFacing)                                          \n\
				diffuse = diffuse * vec3(0.4, 0.3, 0.3);                      \n\
																			  \n\
			if((uClipAxis[0] == 1.0)&&((uClipPoint[0]-vModelPos[0])<uClipColorSize)) diffuse = uClipColor;       \n\
			else if((uClipAxis[0] == -1.0)&&((vModelPos[0]-uClipPoint[0])<uClipColorSize)) diffuse = uClipColor; \n\
			if((uClipAxis[1] == 1.0)&&((uClipPoint[1]-vModelPos[1])<uClipColorSize)) diffuse = uClipColor;       \n\
			else if((uClipAxis[1] == -1.0)&&((vModelPos[1]-uClipPoint[1])<uClipColorSize)) diffuse = uClipColor; \n\
			if((uClipAxis[2] == 1.0)&&((uClipPoint[2]-vModelPos[2])<uClipColorSize)) diffuse = uClipColor;       \n\
			else if((uClipAxis[2] == -1.0)&&((vModelPos[2]-uClipPoint[2])<uClipColorSize)) diffuse = uClipColor; \n\
																			  \n\
			gl_FragColor  = vec4(diffuse, uAlpha);                            \n\
		}                                                                     \n\
	");
	if(this._isDebugging)
		console.log("STD FACE Fragment Shader Log:\n" + nxsFragmentShader.log);

	var program = new SglProgram(gl, {
		shaders    : [
			nxsVertexShader,
			nxsFragmentShader
		],
		attributes : {
			"aPosition"     : 0,
			"aNormal"       : 1,
			"aColor"        : 2,
			"aTextureCoord" : 3
		},
		uniforms   : {
			"uWorldViewProjectionMatrix" : SglMat4.identity(),
			"uViewSpaceNormalMatrix"     : SglMat3.identity(),
			"uModelMatrix"               : SglMat4.identity(),
			"uViewSpaceLightDirection"   : [0.0, 0.0, -1.0],
			"uAlpha"                     : 1.0,
			"uUseSolidColor"             : false,
			"uSolidColor"                : [1.0, 1.0, 1.0],
			"uClipPoint"                 : [0.0, 0.0, 0.0],
			"uClipAxis"                  : [0.0, 0.0, 0.0],
			"uClipColor"                 : [1.0, 1.0, 1.0],
			"uClipColorSize"             : 0.5,
			"uSampler"                   : 0
		}
	});
	if(this._isDebugging)
		console.log("STD FACE Program Log:\n" + program.log);

	return program;
},

// Depth to color nexus rendering, point and faces
_createXYZNXSProgram : function () {
	var gl = this.ui.gl;
	var nxsVertexShader = new SglVertexShader(gl, "\
		precision highp float;                                                \n\
																			  \n\
		uniform   mat4 uWorldViewProjectionMatrix;                            \n\
		uniform   mat4 uModelMatrix;                                          \n\
		uniform   float uPointSize;                                           \n\
																			  \n\
		attribute vec3 aPosition;                                             \n\
		attribute vec3 aNormal;                                               \n\
		attribute vec3 aColor;                                                \n\
		attribute float aPointSize;                                           \n\
																			  \n\
		varying   vec4 vModelPos;                                             \n\
																			  \n\
		void main(void)                                                       \n\
		{                                                                     \n\
			vModelPos = uModelMatrix * vec4(aPosition, 1.0);                  \n\
			gl_Position = uWorldViewProjectionMatrix * vec4(aPosition, 1.0);  \n\
			gl_PointSize = uPointSize * aPointSize;							  \n\
		}                                                                     \n\
	");
	if(this._isDebugging)
		console.log("XYZ Vertex Shader Log:\n" + nxsVertexShader.log);

	var nxsFragmentShader = new SglFragmentShader(gl, "\
		precision highp float;                                                \n\
																			  \n\
		uniform   vec3 uClipPoint;                                            \n\
		uniform   vec3 uClipAxis;                                             \n\
																			  \n\
		varying   vec4 vModelPos;                                             \n\
																			  \n\
		vec4 pack_depth(const in float depth)                                         \n\
		{                                                                             \n\
			const vec4 bit_shift = vec4(256.0*256.0*256.0, 256.0*256.0, 256.0, 1.0);  \n\
			const vec4 bit_mask  = vec4(0.0, 1.0/256.0, 1.0/256.0, 1.0/256.0);        \n\
			vec4 res = fract(depth * bit_shift);                                      \n\
			res -= res.xxyz * bit_mask;                                               \n\
			return res;                                                               \n\
		}                                                                             \n\
																			  \n\
		void main(void)                                                       \n\
		{                                                                     \n\
			if((uClipAxis[0] == 1.0)&&(vModelPos[0] > uClipPoint[0])) discard;        \n\
			else if((uClipAxis[0] == -1.0)&&(vModelPos[0] < uClipPoint[0])) discard;  \n\
			if((uClipAxis[1] == 1.0)&&(vModelPos[1] > uClipPoint[1])) discard;        \n\
			else if((uClipAxis[1] == -1.0)&&(vModelPos[1] < uClipPoint[1])) discard;  \n\
			if((uClipAxis[2] == 1.0)&&(vModelPos[2] > uClipPoint[2])) discard;        \n\
			else if((uClipAxis[2] == -1.0)&&(vModelPos[2] < uClipPoint[2])) discard;  \n\
																			  \n\
			vec4 myColor;                                                     \n\
			myColor = pack_depth(gl_FragCoord.z);                             \n\
			gl_FragColor  = myColor;                                          \n\
		}                                                                     \n\
	");
	if(this._isDebugging)
		console.log("XYZ Fragment Shader Log:\n" + nxsFragmentShader.log);

	var program = new SglProgram(gl, {
		shaders    : [
			nxsVertexShader,
			nxsFragmentShader
		],
		attributes : {
			"aPosition" : 0,
			"aNormal"   : 1,
			"aColor"    : 2,
			"aPointSize": 4
		},
		uniforms   : {
			"uWorldViewProjectionMatrix" : SglMat4.identity(),
			"uModelMatrix" 				 : SglMat4.identity(),
			"uClipPoint"                 : [0.0, 0.0, 0.0],
			"uClipAxis"                  : [0.0, 0.0, 0.0],
			"uPointSize"                 : 1.0
		}
	});
	if(this._isDebugging)
		console.log("XYZ Program Log:\n" + program.log);

	return program;
},

// color coded ID program for NXS rendering, points and faces
_createColorCodedIDNXSProgram : function () {
	var gl = this.ui.gl;
	var nxsVertexShader = new SglVertexShader(gl, "\
		precision highp float;                                                \n\
																			  \n\
		uniform   mat4 uWorldViewProjectionMatrix;                            \n\
		uniform   float uPointSize;                                           \n\
																			  \n\
		attribute vec3 aPosition;                                             \n\
		attribute vec3 aNormal;                                               \n\
		attribute vec3 aColor;                                                \n\
		attribute float aPointSize;                                           \n\
																			  \n\
		void main(void)                                                       \n\
		{                                                                     \n\
			gl_Position = uWorldViewProjectionMatrix * vec4(aPosition, 1.0);  \n\
			gl_PointSize = uPointSize * aPointSize;							  \n\
		}                                                                     \n\
	");
	if(this._isDebugging)
		console.log("COLORCODED ID Vertex Shader Log:\n" + nxsVertexShader.log);

	var nxsFragmentShader = new SglFragmentShader(gl, "\
		precision highp float;                                                \n\
																			  \n\
		uniform   vec4 uColorID;                                              \n\
																			  \n\
		void main(void)                                                       \n\
		{                                                                     \n\
			gl_FragColor  = uColorID;                                         \n\
		}                                                                     \n\
	");
	if(this._isDebugging)
		console.log("COLORCODED ID Fragment Shader Log:\n" + nxsFragmentShader.log);

	var program = new SglProgram(gl, {
		shaders    : [
			nxsVertexShader,
			nxsFragmentShader
		],
		attributes : {
			"aPosition" : 0,
			"aNormal"   : 1,
			"aColor"    : 2,
			"aPointSize": 4
		},
		uniforms   : {
			"uWorldViewProjectionMatrix" : SglMat4.identity(),
			"uColorID"                   : [1.0, 0.5, 0.0, 1.0],
			"uPointSize"                 : 1.0
		}
	});
	if(this._isDebugging)
		console.log("COLORCODED ID Program Log:\n" + program.log);

	return program;
},

// single-color barely-shaded program for NXS rendering, points and faces
_createColorShadedNXSProgram : function () {
	var gl = this.ui.gl;
	var nxsVertexShader = new SglVertexShader(gl, "\
		precision highp float;                                                \n\
																			  \n\
		uniform   mat4 uWorldViewProjectionMatrix;                            \n\
		uniform   mat3 uViewSpaceNormalMatrix;                                \n\
		uniform   float uPointSize;                                           \n\
																			  \n\
		attribute vec3 aPosition;                                             \n\
		attribute vec3 aNormal;                                               \n\
		attribute float aPointSize;                                           \n\
																			  \n\
		varying   vec3 vNormal;                                               \n\
																			  \n\
		void main(void)                                                       \n\
		{                                                                     \n\
			vNormal     = uViewSpaceNormalMatrix * aNormal;                   \n\
																			  \n\
			gl_Position = uWorldViewProjectionMatrix * vec4(aPosition, 1.0);  \n\
			gl_PointSize = uPointSize * aPointSize;							  \n\
		}                                                                     \n\
	");
	if(this._isDebugging)
		console.log("COLOR SHADED Vertex Shader Log:\n" + nxsVertexShader.log);

	var nxsFragmentShader = new SglFragmentShader(gl, "\
		precision highp float;                                                \n\
																			  \n\
		uniform   vec3 uViewSpaceLightDirection;                              \n\
		uniform   vec4 uColorID;                                              \n\
																			  \n\
		varying   vec3 vNormal;                                               \n\
																			  \n\
		void main(void)                                                       \n\
		{                                                                     \n\
			vec3  diffuse = vec3(uColorID[0], uColorID[1], uColorID[2]);      \n\
																			  \n\
			if(vNormal[0] != 0.0 || vNormal[1] != 0.0 || vNormal[2] != 0.0) { \n\
				vec3  normal    = normalize(vNormal);                         \n\
				float nDotL     = dot(normal, -uViewSpaceLightDirection);     \n\
				float lambert   = max(-nDotL, nDotL);                         \n\
																			  \n\
				diffuse = (diffuse * 0.5) + (diffuse * lambert * 0.5);        \n\
			}                                                                 \n\
			gl_FragColor  = vec4(diffuse, uColorID[3]);                       \n\
		}                                                                     \n\
	");
	if(this._isDebugging)
		console.log("COLOR SHADED Fragment Shader Log:\n" + nxsFragmentShader.log);

	var program = new SglProgram(gl, {
		shaders    : [
			nxsVertexShader,
			nxsFragmentShader
		],
		attributes : {
			"aPosition" : 0,
			"aNormal"   : 1,
			"aPointSize": 4
		},
		uniforms   : {
			"uWorldViewProjectionMatrix" : SglMat4.identity(),
			"uViewSpaceNormalMatrix"     : SglMat3.identity(),
			"uViewSpaceLightDirection"   : [0.0, 0.0, -1.0],
			"uColorID"                   : [1.0, 0.5, 0.0, 1.0],
			"uPointSize"                 : 1.0
		}
	});
	if(this._isDebugging)
		console.log("COLOR SHADED Program Log:\n" + program.log);

	return program;
},

//standard technique for PLY rendering, points and faces
_createStandardPointPLYtechnique : function () {
	var gl = this.ui.gl;
	var technique = new SglTechnique(gl, {
		program  : this._createStandardPointNXSProgram(),
		vertexStreams : {
			"aNormal"    : [ 0.0, 0.0, 0.0, 0.0 ],
			"aColor"     : [ 0.8, 0.8, 0.8, 1.0 ],
			"aPointSize" : 1.0
		},
		globals : {
			"uWorldViewProjectionMatrix" : { semantic : "uWorldViewProjectionMatrix", value : SglMat4.identity() },
			"uViewSpaceNormalMatrix"     : { semantic : "uViewSpaceNormalMatrix",     value : SglMat3.identity() },
			"uModelMatrix"               : { semantic : "uModelMatrix",               value : SglMat4.identity() },
			"uViewSpaceLightDirection"   : { semantic : "uViewSpaceLightDirection",   value : [ 0.0, 0.0, -1.0 ] },
			"uPointSize"                 : { semantic : "uPointSize",                 value : 1.0 },
			"uAlpha"                     : { semantic : "uAlpha",                     value : 1.0 },
			"uUseSolidColor"             : { semantic : "uUseSolidColor",             value : false },
			"uSolidColor"                : { semantic : "uSolidColor",                value : [ 1.0, 1.0, 1.0 ] },
			"uClipPoint"                 : { semantic : "uClipPoint",                 value : [ 0.0, 0.0, 0.0 ] },
			"uClipAxis"                  : { semantic : "uClipAxis",                  value : [ 0.0, 0.0, 0.0 ] },
			"uClipColor"                 : { semantic : "uClipColor",                 value : [ 1.0, 1.0, 1.0 ]},
			"uClipColorSize"             : { semantic : "uClipColorSize",             value : 0.5 }
		}
	});

	return technique;
},

_createStandardFacePLYtechnique : function () {
	var gl = this.ui.gl;
	var technique = new SglTechnique(gl, {
		program  : this._createStandardFaceNXSProgram(),
		vertexStreams : {
			"aNormal"       : [ 0.0, 0.0, 0.0, 0.0 ],
			"aColor"        : [ 0.8, 0.8, 0.8, 1.0 ]
		},
		globals : {
			"uWorldViewProjectionMatrix" : { semantic : "uWorldViewProjectionMatrix", value : SglMat4.identity() },
			"uViewSpaceNormalMatrix"     : { semantic : "uViewSpaceNormalMatrix",     value : SglMat3.identity() },
			"uModelMatrix"               : { semantic : "uModelMatrix",               value : SglMat4.identity() },
			"uViewSpaceLightDirection"   : { semantic : "uViewSpaceLightDirection",   value : [ 0.0, 0.0, -1.0 ] },
			"uAlpha"                     : { semantic : "uAlpha",                     value : 1.0 },
			"uUseSolidColor"             : { semantic : "uUseSolidColor",             value : false },
			"uSolidColor"                : { semantic : "uSolidColor",                value : [ 1.0, 1.0, 1.0 ] },
			"uClipPoint"                 : { semantic : "uClipPoint",                 value : [ 0.0, 0.0, 0.0 ] },
			"uClipAxis"                  : { semantic : "uClipAxis",                  value : [ 0.0, 0.0, 0.0 ] },
			"uClipColor"                 : { semantic : "uClipColor",                 value : [ 1.0, 1.0, 1.0 ]},
			"uClipColorSize"             : { semantic : "uClipColorSize",             value : 0.5 },
			"uSampler"                   : { semantic : "uSampler",                   value : 0 }
		}
	});

	return technique;
},

// depth to color technique for PLY rendering
_createXYZPLYtechnique : function () {
	var gl = this.ui.gl;
	var technique = new SglTechnique(gl, {
		program  : this._createXYZNXSProgram(),
		vertexStreams : {
			"aNormal"    : [ 0.0, 0.0, 0.0, 0.0 ],
			"aColor"     : [ 0.8, 0.8, 0.8, 1.0 ],
			"aPointSize" : 1.0
		},
		globals : {
			"uWorldViewProjectionMatrix" : { semantic : "uWorldViewProjectionMatrix", value : SglMat4.identity() },
			"uModelMatrix"               : { semantic : "uModelMatrix",               value : SglMat4.identity() },
			"uPointSize"                 : { semantic : "uPointSize",                 value : 1.0 },
			"uClipPoint"                 : { semantic : "uClipPoint",                 value : [ 0.0, 0.0, 0.0 ] },
			"uClipAxis"                  : { semantic : "uClipAxis",                  value : [ 0.0, 0.0, 0.0 ] }
		}
	});

	return technique;
},

// color coded ID technique for PLY rendering
_createColorCodedIDPLYtechnique : function () {
	var gl = this.ui.gl;
	var technique = new SglTechnique(gl, {
		program  : this._createColorCodedIDNXSProgram(),
		vertexStreams : {
			"aNormal"    : [ 0.0, 0.0, 0.0, 0.0 ],
			"aColor"     : [ 0.8, 0.8, 0.8, 1.0 ],
			"aPointSize" : 1.0
		},
		globals : {
			"uWorldViewProjectionMatrix" : { semantic : "uWorldViewProjectionMatrix", value : SglMat4.identity() },
			"uColorID"                   : { semantic : "uColorID",                   value : [1.0, 0.5, 0.25, 1.0] },
			"uPointSize"                 : { semantic : "uPointSize",                 value : 1.0 }
		}
	});

	return technique;
},

// single-color barely-shaded technique for PLY rendering
_createColorShadedPLYtechnique : function () {
	var gl = this.ui.gl;
	var technique = new SglTechnique(gl, {
		program  : this._createColorShadedNXSProgram(),
		vertexStreams : {
			"aNormal"    : [ 0.0, 0.0, 0.0, 0.0 ],
			"aPointSize" : 1.0
		},
		globals : {
			"uWorldViewProjectionMatrix" : { semantic : "uWorldViewProjectionMatrix", value : SglMat4.identity() },
			"uViewSpaceNormalMatrix"     : { semantic : "uViewSpaceNormalMatrix",     value : SglMat3.identity() },
			"uViewSpaceLightDirection"   : { semantic : "uViewSpaceLightDirection",   value : [ 0.0, 0.0, -1.0 ] },
			"uColorID"                   : { semantic : "uColorID",                   value : [1.0, 0.5, 0.25, 1.0] },
			"uPointSize"                 : { semantic : "uPointSize",                 value : 1.0 }
		}
	});

	return technique;
},

// 2 points line rendering
_createSimpleLinetechnique : function () {
	var gl = this.ui.gl;
	var technique = new SglTechnique(gl, {
		vertexShader : "\
			precision highp float;                                                \n\
																				  \n\
			uniform   mat4 uWorldViewProjectionMatrix;                            \n\
			uniform vec3 uPointA;                                                 \n\
			uniform vec3 uPointB;                                                 \n\
																				  \n\
			attribute vec3 aPosition;                                             \n\
			attribute vec3 aNormal;                                               \n\
			attribute vec3 aColor;                                                \n\
																				  \n\
			void main(void)                                                       \n\
			{                                                                     \n\
				vec3 newPos;                                                      \n\
				if(aPosition[0]==0.0)                                             \n\
					newPos = uPointA;                                             \n\
				else                                                              \n\
					newPos = uPointB;                                             \n\
				gl_Position = uWorldViewProjectionMatrix * vec4(newPos, 1.0);     \n\
				gl_PointSize = 8.0;	                 							  \n\
			}                                                                     \n\
		",
		fragmentShader : "\
			precision highp float;                                                \n\
																				  \n\
			uniform   vec4 uLineColor;                                            \n\
																				  \n\
			void main(void)                                                       \n\
			{                                                                     \n\
				gl_FragColor    = uLineColor;                                     \n\
			}                                                                     \n\
		",
		vertexStreams : {
			"aNormal" : [ 0.0, 0.0, 1.0, 0.0 ],
			"aColor"  : [ 1.0, 0.0, 0.0, 1.0 ]
		},
		globals : {
			"uWorldViewProjectionMatrix" : { semantic : "uWorldViewProjectionMatrix", value : SglMat4.identity() },
			"uLineColor"                 : { semantic : "uLineColor",                 value : [0.0, 1.0, 0.5, 1.0] },
			"uPointA"                    : { semantic : "uPointA",                    value : [0.0, 0.0, 0.0] },
			"uPointB"                    : { semantic : "uPointB",                    value : [1.0, 1.0, 1.0] }
		}
	});

	return technique;
},

// multiple lines/points rendering
_createMultiLinesPointstechnique : function () {
	var gl = this.ui.gl;
	var technique = new SglTechnique(gl, {
		vertexShader : "\
			precision highp float;                                                \n\
																				  \n\
			uniform   mat4 uWorldViewProjectionMatrix;                            \n\
																				  \n\
			attribute vec3 aPosition;                                             \n\
			attribute vec3 aNormal;                                               \n\
			attribute vec4 aColor;                                                \n\
																				  \n\
			varying   vec3 vNormal;                                               \n\
			varying   vec4 vColor;                                                \n\
																				  \n\
			void main(void)                                                       \n\
			{                                                                     \n\
				vColor      = aColor;                                             \n\
				gl_Position = uWorldViewProjectionMatrix * vec4(aPosition, 1.0);  \n\
				gl_PointSize = 8.0;	                 							  \n\
			}                                                                     \n\
		",
		fragmentShader : "\
			precision highp float;                                                \n\
																				  \n\
			varying   vec4 vColor;                                                \n\
																				  \n\
			void main(void)                                                       \n\
			{                                                                     \n\
				gl_FragColor = vColor;                                            \n\
			}                                                                     \n\
		",
		vertexStreams : {
			"aNormal" : [ 0.0, 0.0, 1.0, 0.0 ],
			"aColor"  : [ 1.0, 0.0, 1.0, 1.0 ]
		},
		globals : {
			"uWorldViewProjectionMatrix" : { semantic : "uWorldViewProjectionMatrix", value : SglMat4.identity() },
		}
	});

	return technique;
},

//----------------------------------------------------------------------------------------
// SUPPORT FUNCTIONS
//----------------------------------------------------------------------------------------
_onMeshReady : function () {
	this._objectLoaded();
},

_onTextureReady : function () {
	this._objectLoaded();
},

_onBackgroundReady : function () {
	this._objectLoaded();
},

_objectLoaded : function () {
	this._objectsToLoad--;
	this._testReady();
},

_testReady : function () {
	if (this._objectsToLoad != 0) return;
	this.trackball.track(SglMat4.identity(), 0.0, 0.0, 0.0);

	this._sceneReady = this._scenePrepare();

	this.ui.postDrawEvent();
},

_scenePrepare : function () {
	var meshes    = this._scene.meshes;
	var instances = this._scene.modelInstances;
	var spots     = this._scene.spots;
	for (var mesh in meshes) {
		if (!meshes[mesh].renderable) continue;
		for (var inst in instances)
			if (mesh == instances[inst].mesh)
					instances[inst].rendermode = meshes[mesh].renderable.renderMode[0];
		for (var spt in spots)
			if (mesh == spots[spt].mesh)
					spots[spt].rendermode = meshes[mesh].renderable.renderMode[0];
	}
	return true;
},

_isSceneReady : function () {
	var r = (this._scene && this._sceneParsed && this._sceneReady);
	return r;
},

_pickingRefresh: function(x,y) {
	this._pickpoint[0] = x;
	this._pickpoint[1] = y;

	var pickedPixel;
	var ID, cursor;

	if(this._onEndPickingPoint||this._onEndMeasurement||this._onPickedSpot||this._onEnterSpot||this._onLeaveSpot){
		pickedPixel = this._drawScenePickingSpots();
		ID = this._Color2ID(pickedPixel);
		if(this._lastSpotID != ID){
			var spots = this._scene.spots;
			if(ID != 0){
				for (var spt in spots) {
					if (spots[spt].ID == ID) {
						this._pickedSpot = spt;
						if(this._onHover){
							if(spots[this._lastPickedSpot]) spots[this._lastPickedSpot].alpha -= 0.2;
							spots[this._pickedSpot].alpha += 0.2;
							cursor = spots[spt].cursor;
							if(/*!this._movingLight ||*/ !this._isMeasuring){
								this._lastCursor = document.getElementById(this.ui.canvas.id).style.cursor;
								document.getElementById(this.ui.canvas.id).style.cursor = cursor;
							}
							if(this._onLeaveSpot && this._lastPickedSpot!=null)  this._onLeaveSpot(this._lastPickedSpot);
							if(this._onEnterSpot && this._pickedSpot!=null) this._onEnterSpot(this._pickedSpot);
							this.ui.postDrawEvent();
						}
						this._lastPickedSpot = spt;
						break;
					}
				}
				this._lastSpotID = ID;
			}
			else{
				this._pickedSpot = null;
				if(this._onHover){
					if(spots[this._lastPickedSpot]) spots[this._lastPickedSpot].alpha  -= 0.2;
					if(/*!this._movingLight ||*/ !this._isMeasuring) document.getElementById(this.ui.canvas.id).style.cursor = "default";
					if(this._onLeaveSpot && this._lastPickedSpot!=null)  this._onLeaveSpot(this._lastPickedSpot);
					//if(this._onEnterSpot) this._onEnterSpot(this._pickedSpot);
					this._lastPickedSpot = null;
					this.ui.postDrawEvent();
				}
				this._lastSpotID = ID;
			}
		}
	}

	if(this._onEndPickingPoint||this._onEndMeasurement||this._onPickedInstance||this._onEnterInstance||this._onLeaveInstance){
		pickedPixel = this._drawScenePickingInstances();
		ID = this._Color2ID(pickedPixel);
		if(this._lastInstanceID == ID && !(this._onPickedSpot||this._onEnterSpot||this._onLeaveSpot)) return;
		if(ID != 0){
			var instances = this._scene.modelInstances;
			for (var inst in instances) {
				if (instances[inst].ID == ID) {
					this._pickedInstance = inst;
					if(this._onHover){
						cursor = instances[inst].cursor;
						if(/*!this._movingLight ||*/ !this._isMeasuring){
							this._lastCursor = cursor;
							if(this._pickedSpot==null)document.getElementById(this.ui.canvas.id).style.cursor = cursor;
							this.ui.postDrawEvent();
						}
						if(this._onLeaveInstance && this._lastPickedInstance!=null)  this._onLeaveInstance(this._lastPickedInstance);
						if(this._onEnterInstance && this._pickedInstance!=null) this._onEnterInstance(this._pickedInstance);
					}
					this._lastPickedInstance = inst;
					break;
				}
			}
		}
		else{
			this._pickedInstance = null;
			if(this._onHover){
				this._lastCursor = "default";
				if((/*!this._movingLight ||*/ !this._isMeasuring) && this._pickedSpot==null) document.getElementById(this.ui.canvas.id).style.cursor = "default";
				if(this._onLeaveInstance && this._lastPickedInstance!=null)  this._onLeaveInstance(this._lastPickedInstance);
				//if(this._onEnterInstance) this._onEnterInstance(this._pickedInstance);
				this.ui.postDrawEvent();
			}
			this._lastPickedInstance = null;
		}
		this._lastInstanceID = ID;
	}
},

_measureRefresh : function (button, x, y, e) {
//		if(e.target.id!=this.ui.gl.canvas.id) return;

	if(this._isMeasuringDistance){
		this._pickpoint[0] = x;
		this._pickpoint[1] = y;
		var ppoint = this._drawScenePickingXYZ();
		if ((ppoint!=null)&&(this._measurementStage != 2)) {
			this._pointA = ppoint;
			this._measurementStage=2;
			this.ui.postDrawEvent();
		}
		else if ((ppoint!=null)&&(this._measurementStage == 2)) {
			this._pointB = ppoint;
			this.measurement = SglVec3.length(SglVec3.sub(this._pointA, this._pointB));
			this._measurementStage=3;
			this.ui.postDrawEvent();
			if(this._onEndMeasurement) this._onEndMeasurement(this.measurement, this._pointA, this._pointB);
		}
	}
},

_startMeasurement  : function () {
	if (this._isMeasuringDistance) return;
	this._isMeasuring = this._isMeasuringDistance = true;
	this._measurementStage = 1; // 0=inactive 1=picking pointA 2=picking pointB 3=measurement ready
	this._pointA = [0.0, 0.0, 0.0];
	this._pointB = [0.0, 0.0, 0.0];
	this.measurement = 0.0;
	this.ui.postDrawEvent();
},

_stopMeasurement  : function () {
	this._isMeasuringDistance = false;
	if (!this._isMeasuringPickpoint) this._isMeasuring = this._isMeasuringDistance;
	this._measurementStage = 0; // 0=inactive 1=picking pointA 2=picking pointB 3=measurement ready
	this._pointA = [0.0, 0.0, 0.0];
	this._pointB = [0.0, 0.0, 0.0];
	this.measurement = 0.0;
	this.ui.postDrawEvent();
},

_pickpointRefresh : function (button, x, y, e) {
//		if(e.target.id!=this.ui.gl.canvas.id) return;
	if(this._isMeasuringPickpoint){
		this._pickpoint[0] = x;
		this._pickpoint[1] = y;
		var ppoint = this._drawScenePickingXYZ();
		if (ppoint!=null)
		{
			this._pickedPoint = ppoint;
			this._pickValid = true;
			if(this._onEndPickingPoint) this._onEndPickingPoint(this._pickedPoint);
			this.ui.postDrawEvent();
		}
	}
},

_startPickPoint : function () {
	if (this._isMeasuringPickpoint) return;
	this._isMeasuring = this._isMeasuringPickpoint = true;
	this._pickValid = false;
	this._pickedPoint = [0.0, 0.0, 0.0];
	this.ui.postDrawEvent();
},

_stopPickPoint : function () {
	this._isMeasuringPickpoint = false;
	if (!this._isMeasuringDistance) this._isMeasuring = this._isMeasuringPickpoint;
	this._pickValid = false;
	this._pickedPoint = [0.0, 0.0, 0.0];
	this.ui.postDrawEvent();
},

//----------------------------------------------------------------------------------------
// DRAWING SUPPORT FUNCTIONS
//----------------------------------------------------------------------------------------
_setSceneCenterRadius : function () {
	var meshes    = this._scene.meshes;
	var instances = this._scene.modelInstances;
	this.sceneCenter = [0.0, 0.0, 0.0];
	this.sceneRadiusInv = 1.0;

	if(this._scene.space.centerMode == "explicit")
	{
		this.sceneCenter = this._scene.space.explicitCenter;
	}
	else if(this._scene.space.centerMode == "specific"  && this._scene.space.whichInstanceCenter != "")
	{
		var mesh = meshes[instances[this._scene.space.whichInstanceCenter].mesh];
		if((mesh)&&(mesh.renderable)){
			var instCenter = SglVec3.to4(mesh.renderable.datasetCenter,1);

			instCenter = SglMat4.mul4(mesh.transform.matrix, instCenter);
			instCenter = SglMat4.mul4(instances[this._scene.space.whichInstanceCenter].transform.matrix, instCenter);
			instCenter = SglMat4.mul4(this._scene.space.transform.matrix, instCenter);

			instCenter = SglVec4.to3(instCenter);

			this.sceneCenter = instCenter;
		}
	}
	else if(this._scene.space.centerMode == "scene")
	{
		var smin = SglVec3.maxNumber();
		var smax = SglVec3.minNumber();
		var imin = [0.0, 0.0, 0.0];
		var imax = [0.0, 0.0, 0.0];

		for (var inst in instances) {
			var mesh = meshes[instances[inst].mesh];
			if((mesh)&&(mesh.renderable)){
				var instCenter = SglVec3.to4(mesh.renderable.datasetCenter,1);
				instCenter = SglMat4.mul4(mesh.transform.matrix, instCenter);
				instCenter = SglMat4.mul4(instances[inst].transform.matrix, instCenter);
				instCenter = SglMat4.mul4(this._scene.space.transform.matrix, instCenter);
				instCenter = SglVec4.to3(instCenter);

				var radius = mesh.renderable.datasetRadius;
				var vector111 = SglVec3.one();
				vector111 = SglMat3.mul3(SglMat4.to33(mesh.transform.matrix), vector111);
				vector111 = SglMat3.mul3(SglMat4.to33(instances[inst].transform.matrix), vector111);
				vector111 = SglMat3.mul3(SglMat4.to33(this._scene.space.transform.matrix), vector111);
				var scalefactor = SglVec3.length(vector111) / SglVec3.length([1,1,1]);
				radius = radius*scalefactor;

				imin[0] = instCenter[0] - radius;
				imin[1] = instCenter[1] - radius;
				imin[2] = instCenter[2] - radius;
				imax[0] = instCenter[0] + radius;
				imax[1] = instCenter[1] + radius;
				imax[2] = instCenter[2] + radius;

				if(imin[0] < smin[0]) smin[0] = imin[0];
				if(imin[1] < smin[1]) smin[1] = imin[1];
				if(imin[2] < smin[2]) smin[2] = imin[2];
				if(imax[0] > smax[0]) smax[0] = imax[0];
				if(imax[1] > smax[1]) smax[1] = imax[1];
				if(imax[2] > smax[2]) smax[2] = imax[2];
			}
		}

		this.sceneCenter = [ (smax[0] + smin[0])/2.0, (smax[1] + smin[1])/2.0, (smax[2] + smin[2])/2.0 ];
	}
	else //if(this._scene.space.centerMode == "first")
	{
		for (var inst in instances) {
			var mesh = meshes[instances[inst].mesh];
			if((mesh)&&(mesh.renderable)){
				var instCenter = SglVec3.to4(mesh.renderable.datasetCenter,1);

				instCenter = SglMat4.mul4(mesh.transform.matrix, instCenter);
				instCenter = SglMat4.mul4(instances[inst].transform.matrix, instCenter);
				instCenter = SglMat4.mul4(this._scene.space.transform.matrix, instCenter);

				instCenter = SglVec4.to3(instCenter);

				this.sceneCenter = instCenter;
				break;
			}
		}
	}

	if(this._scene.space.radiusMode == "explicit")
	{
		this.sceneRadiusInv = 1.0 / this._scene.space.explicitRadius;
	}
	else if(this._scene.space.radiusMode == "specific" && this._scene.space.whichInstanceRadius != "")
	{
		var mesh = meshes[instances[this._scene.space.whichInstanceRadius].mesh];
		if((mesh)&&(mesh.renderable)){
			var radius = mesh.renderable.datasetRadius;
			var vector111 = SglVec3.one();

			vector111 = SglMat3.mul3(SglMat4.to33(mesh.transform.matrix), vector111);
			vector111 = SglMat3.mul3(SglMat4.to33(instances[this._scene.space.whichInstanceRadius].transform.matrix), vector111);
			vector111 = SglMat3.mul3(SglMat4.to33(this._scene.space.transform.matrix), vector111);

			var scalefactor = SglVec3.length(vector111) / SglVec3.length([1,1,1]);

			this.sceneRadiusInv = 1.0 / (radius*scalefactor);
		}
	}
	else if(this._scene.space.radiusMode == "scene")
	{
		var smin = SglVec3.maxNumber();
		var smax = SglVec3.minNumber();
		var imin = [0.0, 0.0, 0.0];
		var imax = [0.0, 0.0, 0.0];

		for (var inst in instances) {
			var mesh = meshes[instances[inst].mesh];
			if((mesh)&&(mesh.renderable)){
				var instCenter = SglVec3.to4(mesh.renderable.datasetCenter,1);
				instCenter = SglMat4.mul4(mesh.transform.matrix, instCenter);
				instCenter = SglMat4.mul4(instances[inst].transform.matrix, instCenter);
				instCenter = SglMat4.mul4(this._scene.space.transform.matrix, instCenter);
				instCenter = SglVec4.to3(instCenter);

				var radius = mesh.renderable.datasetRadius;
				var vector111 = SglVec3.one();
				vector111 = SglMat3.mul3(SglMat4.to33(mesh.transform.matrix), vector111);
				vector111 = SglMat3.mul3(SglMat4.to33(instances[inst].transform.matrix), vector111);
				vector111 = SglMat3.mul3(SglMat4.to33(this._scene.space.transform.matrix), vector111);

				var scalefactor = SglVec3.length(vector111) / SglVec3.length([1,1,1]);
				radius = radius*scalefactor;

				imin[0] = instCenter[0] - radius;
				imin[1] = instCenter[1] - radius;
				imin[2] = instCenter[2] - radius;
				imax[0] = instCenter[0] + radius;
				imax[1] = instCenter[1] + radius;
				imax[2] = instCenter[2] + radius;

				if(imin[0] < smin[0]) smin[0] = imin[0];
				if(imin[1] < smin[1]) smin[1] = imin[1];
				if(imin[2] < smin[2]) smin[2] = imin[2];
				if(imax[0] > smax[0]) smax[0] = imax[0];
				if(imax[1] > smax[1]) smax[1] = imax[1];
				if(imax[2] > smax[2]) smax[2] = imax[2];
			}
		}
		var scenter = [ (smax[0] + smin[0])/2.0, (smax[1] + smin[1])/2.0, (smax[2] + smin[2])/2.0 ]
		this.sceneRadiusInv = 1.0 / SglVec3.length(SglVec3.sub(smax, scenter));
	}
	else //if(this._scene.space.radiusMode == "first")
	{
		for (var inst in instances) {
			var mesh = meshes[instances[inst].mesh];
			if((mesh)&&(mesh.renderable)){
				var radius = mesh.renderable.datasetRadius;
				var vector111 = SglVec3.one();

				vector111 = SglMat3.mul3(SglMat4.to33(mesh.transform.matrix), vector111);
				vector111 = SglMat3.mul3(SglMat4.to33(instances[inst].transform.matrix), vector111);
				vector111 = SglMat3.mul3(SglMat4.to33(this._scene.space.transform.matrix), vector111);

				var scalefactor = SglVec3.length(vector111) / SglVec3.length([1,1,1]);

				this.sceneRadiusInv = 1.0 / (radius*scalefactor);
				break;
			}
		}
	}
},

_destroyPickFramebuffer : function () {
	if (this.pickFramebuffer) {
		this.pickFramebuffer.destroy();
		this.pickFramebuffer = null;
	}
	if (this.pickColorTexture) {
		this.pickColorTexture.destroy();
		this.pickColorTexture = null;
	}
	if (this.pickDepthRenderbuffer) {
		this.pickDepthRenderbuffer.destroy();
		this.pickDepthRenderbuffer = null;
	}
},

_createPickFramebuffer : function (width, height) {
	if (this.pickFramebuffer && (this.pickFramebuffer.width == width) && (this.pickFramebuffer.height == height))
		return;
	else
		this._destroyPickFramebuffer();

	var gl = this.ui.gl;

	this.pickColorTexture = new SglTexture2D(gl, {
		internalFormat : gl.RGBA,
		width          : width,
		height         : height
	});

	this.pickDepthRenderbuffer = new SglRenderbuffer(gl, {
		internalFormat : gl.DEPTH_COMPONENT16,
		width          : width,
		height         : height
	});

	this.pickFramebuffer = new SglFramebuffer(gl, {
		color : this.pickColorTexture,
		depth : this.pickDepthRenderbuffer,
		autoViewport : true
	});
},

_setupDraw : function () {
	var width    = this.ui.width;
	var height   = this.ui.height;
	var xform    = this.xform;
	var space    = this._scene.space;

	this.ui.gl.viewport(0, 0, width, height);

	var FOV   = space.cameraFOV;
	var nearP = space.cameraNearFar[0];
	var farP  = space.cameraNearFar[1];

	// getting scale/center for scene
	this._setSceneCenterRadius();

	xform.projection.loadIdentity();

	if(space.cameraType == "ortho")
	{
		//default camera distance in ortho view is "as large as scene size"
		// then, if the trackball is able to provide a better value, we use it
		var cDistance = 1.0;
		if(typeof this.trackball.distance != "undefined")
			cDistance = this.trackball.distance;
		var a = cDistance * SpiderGL.Math.tan(sglDegToRad(FOV) / 2);
		var b = a * width/height;

		xform.projection.ortho([-b, -a, nearP], [b, a, farP]);
	}
	else
	{
		xform.projection.perspective(sglDegToRad(FOV), width/height, nearP, farP);
	}

	xform.view.loadIdentity();
	xform.view.lookAt([0.0, 0.0, 0.0], [0.0, 0.0, -1.0], [0.0, 1.0, 0.0]);
	this.viewMatrix = xform.viewMatrix;

	xform.model.loadIdentity();
	xform.model.multiply(this.trackball.matrix);

	// scale to unit box + recenter
	xform.model.scale([this.sceneRadiusInv, this.sceneRadiusInv, this.sceneRadiusInv]);
	xform.model.translate(SglVec3.neg(this.sceneCenter));
},

_ID2Color : function (ID) {
	var intID = ID | 0;
	var IDr = intID % 10;
	var IDg = ((intID-IDr) / 10) % 10;
	var IDb = ((((intID-IDr) / 10) - IDg) / 10) % 10;

	var colorID = [IDr * 0.1, IDg * 0.1, IDb * 0.1, 1.0];
	return colorID;
},

_Color2ID : function (color) {
	var IDr =  Math.round(((color[0])/255.0) / 0.1)        | 0;
	var IDg = (Math.round(((color[1])/255.0) / 0.1) * 10)  | 0;
	var IDb = (Math.round(((color[2])/255.0) / 0.1) * 100) | 0;

	var ID = (IDr + IDg + IDb) | 0;
	return ID;
},

_onPlyLoaded : function (req, thatmesh, gl) {
	var plyData = req.buffer;
	var modelDescriptor = importPly(plyData);
	var TMR = thatmesh.renderable = new SglModel(gl, modelDescriptor);

	TMR.renderMode  = modelDescriptor.extra.renderMode;
	TMR.boundingBox = modelDescriptor.extra.boundingBox;

	// center and radius
	TMR.datasetCenter = [0.0, 0.0, 0.0];
	TMR.datasetRadius = 1.0;

	TMR.datasetCenter[0] = (TMR.boundingBox.max[0] + TMR.boundingBox.min[0]) / 2.0;
	TMR.datasetCenter[1] = (TMR.boundingBox.max[1] + TMR.boundingBox.min[1]) / 2.0;
	TMR.datasetCenter[2] = (TMR.boundingBox.max[2] + TMR.boundingBox.min[2]) / 2.0;

	TMR.datasetRadius = Math.sqrt( Math.pow((TMR.boundingBox.max[0] - TMR.boundingBox.min[0]),2) +
								   Math.pow((TMR.boundingBox.max[1] - TMR.boundingBox.min[1]),2) +
								   Math.pow((TMR.boundingBox.max[2] - TMR.boundingBox.min[2]),2) ) / 2.0;

	// texture
	if(modelDescriptor.extra.textureUrl) {
		var that = this;
		var texUrl = "";
		var tmpUrl = req._url.split("/");
		for (var j=0; j<tmpUrl.length-1; ++j) texUrl += tmpUrl[j].concat("/");
		texUrl = texUrl.concat(modelDescriptor.extra.textureUrl);
		TMR.texture = new SglTexture2D(gl, {
			url       : texUrl,
			onError   : function () { TMR.hasTexture = false; that._onMeshReady(); },
			onSuccess : function () { TMR.hasTexture = true; that._onMeshReady(); }
		});
	}
	else this._onMeshReady();
},

//----------------------------------------------------------------------------------------
// DRAWING SCENE FUNCTIONS
//----------------------------------------------------------------------------------------
_drawScene : function () {
	var gl       = this.ui.gl;
	var width    = this.ui.width;
	var height   = this.ui.height;
	var xform    = this.xform;
	var renderer = this.renderer;
	var CurrFaceProgram    = this.faceNXSProgram;
	var CurrPointProgram   = this.pointNXSProgram;
	var CurrFaceTechnique  = this.facePLYTechnique;
	var CurrPointTechnique = this.pointPLYTechnique;
	var CCProgram          = this.colorShadedNXSProgram;
	var CCTechnique        = this.colorShadedPLYTechnique;
	var lineTechnique      = this.simpleLineTechnique;
	var meshes    = this._scene.meshes;
	var instances = this._scene.modelInstances;
	var spots     = this._scene.spots;
	var space     = this._scene.space;
	var config    = this._scene.config;
	var bkg       = this._scene.background.color;

	// basic setup, matrices for projection & view
	this._setupDraw();

	// clear buffer
	gl.clearColor(bkg[0], bkg[1], bkg[2], bkg[3]);
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT | gl.STENCIL_BUFFER_BIT);

	// draw non-transparent geometries
	for (var inst in instances) {
		var instance = instances[inst];
		var mesh     = meshes[instance.mesh];
		if (!mesh) continue;
		var renderable = mesh.renderable;
		if (!renderable) continue;
		if (!instance.visible) continue;
		if (instance.useTransparency) continue;

		// GLstate setup
		gl.enable(gl.DEPTH_TEST);

		xform.model.push();
		xform.model.multiply(space.transform.matrix);
		xform.model.multiply(instance.transform.matrix);
		xform.model.multiply(mesh.transform.matrix);

		var modelMatrix = SglMat4.identity();
		modelMatrix = SglMat4.mul(modelMatrix, space.transform.matrix);
		modelMatrix = SglMat4.mul(modelMatrix, instance.transform.matrix);
		modelMatrix = SglMat4.mul(modelMatrix, mesh.transform.matrix);
		var thisClipAxis = instance.clippable?this._clipAxis:[0.0, 0.0, 0.0];
		var thisClipBordersize = config.showClippingBorder?config.clippingBorderSize:0.0;

		var uniforms = {
			"uWorldViewProjectionMatrix" : xform.modelViewProjectionMatrix,
			"uViewSpaceNormalMatrix"     : xform.viewSpaceNormalMatrix,
			"uModelMatrix"               : modelMatrix,
			"uViewSpaceLightDirection"   : this._lightDirection,
			"uPointSize"                 : config.pointSize,
			"uAlpha"                     : 1.0,
			"uUseSolidColor"             : instance.useSolidColor,
			"uSolidColor"                : [instance.color[0], instance.color[1], instance.color[2]],
			"uClipPoint"                 : this._clipPoint,
			"uClipAxis"                  : thisClipAxis,
			"uClipColor"                 : config.clippingBorderColor,
			"uClipColorSize"             : thisClipBordersize
		};

		if(mesh.isNexus) {
			if (!renderable.isReady) continue;

			var nexus = renderable;
			nexus.modelMatrix      = xform.modelMatrix;
			nexus.viewMatrix       = xform.viewMatrix;
			nexus.projectionMatrix = xform.projectionMatrix;
			nexus.viewport         = [0, 0, width, height];
			var fps = this.ui.framesPerSecond;			
			if(nexus._targetFps && fps) {
				var newBudget = (nexus.drawBudget * fps) / nexus._targetFps;
				if(newBudget < nexus._minDrawBudget)
					newBudget = nexus._minDrawBudget;
				// logic: increase budget only if we stop rendering because of it (instead of just waiting for download.
				if(newBudget < nexus.drawBudget || nexus._drawSize > nexus.drawBudget)
					nexus.drawBudget = 0.9 * nexus.drawBudget + 0.1*newBudget;
			}

			var program;
			if(instance.rendermode=="FILL")
				program = CurrFaceProgram;
			else
				program = CurrPointProgram;
			program.bind();
			program.setUniforms(uniforms);
				nexus.begin();
				nexus.setPrimitiveMode(instance.rendermode);
				nexus.render();
				nexus.end();
			program.unbind();
		}
		else { //drawing ply
			var technique;
			if(instance.rendermode=="FILL")
				technique = CurrFaceTechnique;
			else
				technique = CurrPointTechnique;
			renderer.begin();
				renderer.setTechnique(technique);
				renderer.setDefaultGlobals();
				renderer.setPrimitiveMode(instance.rendermode);
				renderer.setGlobals(uniforms);
				renderer.setModel(renderable);
				renderer.setTexture(0, renderable.texture);
				renderer.renderModel();
			renderer.end();
		}

		// GLstate cleanup
		gl.disable(gl.DEPTH_TEST);

		xform.model.pop();
	}

	// draw transparent geometries
	for (var inst in instances) {
		var instance = instances[inst];
		var mesh     = meshes[instance.mesh];
		if (!mesh) continue;
		var renderable = mesh.renderable;
		if (!renderable) continue;
		if (!instance.visible) continue;
		if (!instance.useTransparency) continue;

		// GLstate setup
		gl.enable(gl.DEPTH_TEST);
		gl.depthMask(false);
		gl.enable(gl.BLEND);
		gl.blendFunc(gl.SRC_ALPHA, gl.ONE);

		xform.model.push();
		xform.model.multiply(space.transform.matrix);
		xform.model.multiply(instance.transform.matrix);
		xform.model.multiply(mesh.transform.matrix);

		var modelMatrix = SglMat4.identity();
		modelMatrix = SglMat4.mul(modelMatrix, space.transform.matrix);
		modelMatrix = SglMat4.mul(modelMatrix, instance.transform.matrix);
		modelMatrix = SglMat4.mul(modelMatrix, mesh.transform.matrix);
		var thisClipAxis = instance.clippable?this._clipAxis:[0.0, 0.0, 0.0];
		var thisClipBordersize = config.showClippingBorder?config.clippingBorderSize:0.0;

		var uniforms = {
			"uWorldViewProjectionMatrix" : xform.modelViewProjectionMatrix,
			"uViewSpaceNormalMatrix"     : xform.viewSpaceNormalMatrix,
			"uModelMatrix"               : modelMatrix,
			"uViewSpaceLightDirection"   : this._lightDirection,
			"uPointSize"                 : config.pointSize,
			"uAlpha"                     : instance.alpha,
			"uUseSolidColor"             : instance.useSolidColor,
			"uSolidColor"                : [instance.color[0], instance.color[1], instance.color[2]],
			"uClipPoint"                 : [0.0, 0.0, 0.0],
			"uClipPoint"                 : this._clipPoint,
			"uClipAxis"                  : thisClipAxis,
			"uClipColor"                 : config.clippingBorderColor,
			"uClipColorSize"             : thisClipBordersize
		};

		if(mesh.isNexus) {
			if (!renderable.isReady) continue;

			var nexus = renderable;
			nexus.modelMatrix      = xform.modelMatrix;
			nexus.viewMatrix       = xform.viewMatrix;
			nexus.projectionMatrix = xform.projectionMatrix;
			nexus.viewport         = [0, 0, width, height];
			var fps = this.ui.framesPerSecond;			
			if(nexus._targetFps && fps) {
				var newBudget = (nexus.drawBudget * fps) / nexus._targetFps;
				if(newBudget < nexus._minDrawBudget)
					newBudget = nexus._minDrawBudget;
				// logic: increase budget only if we stop rendering because of it (instead of just waiting for download.
				if(newBudget < nexus.drawBudget || nexus._drawSize > nexus.drawBudget)
					nexus.drawBudget = 0.9 * nexus.drawBudget + 0.1*newBudget;
			}

			var program;
			if(instance.rendermode=="FILL")
				program = CurrFaceProgram;
			else
				program = CurrPointProgram;
			program.bind();
			program.setUniforms(uniforms);
				nexus.begin();
				nexus.setPrimitiveMode(instance.rendermode);
				nexus.render();
				nexus.end();
			program.unbind();
		}
		else { //drawing ply
			var technique;
			if(instance.rendermode=="FILL")
				technique = CurrFaceTechnique;
			else
				technique = CurrPointTechnique;
			renderer.begin();
				renderer.setTechnique(technique);
				renderer.setDefaultGlobals();
				renderer.setPrimitiveMode(instance.rendermode);
				renderer.setGlobals(uniforms);
				renderer.setModel(renderable);
				renderer.setTexture(0, renderable.texture);
				renderer.renderModel();
			renderer.end();
		}

		// GLstate cleanup
		gl.disable(gl.BLEND);
		gl.depthMask(true);
		gl.disable(gl.DEPTH_TEST);

		xform.model.pop();
	}

	// draw picked point (if valid)
	if (this._pickValid) {
		// GLstate setup
		gl.enable(gl.DEPTH_TEST);
		gl.depthFunc(gl.LESS);

		xform.model.push();

		var lineUniforms = {
			"uWorldViewProjectionMatrix" : xform.modelViewProjectionMatrix,
			"uLineColor"                 : [config.pickedpointColor[0], config.pickedpointColor[1], config.pickedpointColor[2], 1.0],
			"uPointA"                    : this._pickedPoint,
			"uPointB"                    : this._pickedPoint
		};

		//drawing points
		renderer.begin();
			renderer.setTechnique(lineTechnique);
			renderer.setDefaultGlobals();
			renderer.setGlobals(lineUniforms);
			renderer.setPrimitiveMode("POINT");
			renderer.setModel(this.simpleLineModel);
			renderer.renderModel();
		renderer.end();

		lineUniforms = {
			"uWorldViewProjectionMatrix" : xform.modelViewProjectionMatrix,
			"uLineColor"                 : [config.pickedpointColor[0] * 0.4, config.pickedpointColor[1] * 0.5, config.pickedpointColor[2] * 0.6, 0.5],
			"uPointA"                    : this._pickedPoint,
			"uPointB"                    : this._pickedPoint
		};

		gl.depthFunc(gl.GREATER);
		gl.depthMask(false);
		gl.enable(gl.BLEND);
		gl.blendFunc(gl.SRC_ALPHA, gl.ONE);

		//drawing points and line
		renderer.begin();
			renderer.setTechnique(lineTechnique);
			renderer.setDefaultGlobals();
			renderer.setGlobals(lineUniforms);
			renderer.setPrimitiveMode("POINT");
			renderer.setModel(this.simpleLineModel);
			renderer.renderModel();
		renderer.end();

		// GLstate cleanup
		gl.disable(gl.BLEND);
		gl.depthMask(true);
		gl.depthFunc(gl.LESS);
		gl.disable(gl.DEPTH_TEST);

		xform.model.pop();
	}

	// draw measurement line (if any)
	if (this._measurementStage >= 2) {// 0=inactive 1=picking pointA 2=picking pointB 3=measurement ready
		// GLstate setup
		gl.enable(gl.DEPTH_TEST);
		gl.depthFunc(gl.LESS);

		xform.model.push();

		var lineUniforms = {
			"uWorldViewProjectionMatrix" : xform.modelViewProjectionMatrix,
			"uLineColor"                 : [config.measurementColor[0], config.measurementColor[1], config.measurementColor[2], 1.0],
			"uPointA"                    : this._pointA,
			"uPointB"                    : (this._measurementStage==2)?this._pointA:this._pointB,
		};

		//drawing points and line
		renderer.begin();
			renderer.setTechnique(lineTechnique);
			renderer.setDefaultGlobals();
			renderer.setGlobals(lineUniforms);
			renderer.setPrimitiveMode("LINE");
			renderer.setModel(this.simpleLineModel);
			renderer.renderModel();
			renderer.setPrimitiveMode("POINT");
			renderer.setModel(this.simpleLineModel);
			renderer.renderModel();
		renderer.end();

		lineUniforms = {
			"uWorldViewProjectionMatrix" : xform.modelViewProjectionMatrix,
			"uLineColor"                 : [config.measurementColor[0] * 0.4, config.measurementColor[1] * 0.5, config.measurementColor[2] * 0.6, 0.5],
			"uPointA"                    : this._pointA,
			"uPointB"                    : (this._measurementStage==2)?this._pointA:this._pointB,
		};

		gl.depthFunc(gl.GREATER);
		gl.depthMask(false);
		gl.enable(gl.BLEND);
		gl.blendFunc(gl.SRC_ALPHA, gl.ONE);

		//drawing points and line
		renderer.begin();
			renderer.setTechnique(lineTechnique);
			renderer.setDefaultGlobals();
			renderer.setGlobals(lineUniforms);
			renderer.setPrimitiveMode("LINE");
			renderer.setModel(this.simpleLineModel);
			renderer.renderModel();
			renderer.setPrimitiveMode("POINT");
			renderer.setModel(this.simpleLineModel);
			renderer.renderModel();
		renderer.end();

		// GLstate cleanup
		gl.disable(gl.BLEND);
		gl.depthMask(true);
		gl.depthFunc(gl.LESS);
		gl.disable(gl.DEPTH_TEST);

		xform.model.pop();
	}

	// draw transparent spot geometries
	for (var spt in spots) {
		var spot = spots[spt];
		var mesh     = meshes[spot.mesh];
		if (!mesh) continue;
		var renderable = mesh.renderable;
		if (!renderable) continue;
		if (!spot.visible) continue;

		// GLstate setup
		gl.enable(gl.DEPTH_TEST);
		gl.depthMask(false);
		gl.enable(gl.BLEND);
		gl.blendFunc(gl.SRC_ALPHA, gl.ONE);

		xform.model.push();
		xform.model.multiply(space.transform.matrix);
		xform.model.multiply(spot.transform.matrix);
		xform.model.multiply(mesh.transform.matrix);

		var uniforms = {
			"uWorldViewProjectionMatrix" : xform.modelViewProjectionMatrix,
			"uViewSpaceNormalMatrix"     : xform.viewSpaceNormalMatrix,
			"uViewSpaceLightDirection"   : this._lightDirection,
			"uPointSize"                 : config.pointSize,
			"uColorID"                   : [spot.color[0], spot.color[1], spot.color[2], spot.alpha]
		}

		if(mesh.isNexus) {
			if (!renderable.isReady) continue;
			var nexus = renderable;
			nexus.modelMatrix      = xform.modelMatrix;
			nexus.viewMatrix       = xform.viewMatrix;
			nexus.projectionMatrix = xform.projectionMatrix;
			nexus.viewport         = [0, 0, width, height];

			var program = CCProgram;
			program.bind();
			program.setUniforms(uniforms);
				nexus.begin();
				nexus.setPrimitiveMode(spot.rendermode);
				nexus.render();
				nexus.end();
			program.unbind();
		}
		else { //drawing ply
			renderer.begin();
				renderer.setTechnique(CCTechnique);
				renderer.setDefaultGlobals();
				renderer.setPrimitiveMode(spot.rendermode);
				renderer.setGlobals(uniforms);
				renderer.setModel(renderable);
				renderer.renderModel();
			renderer.end();
		}

		// GLstate cleanup
		gl.disable(gl.BLEND);
		gl.depthMask(true);
		gl.disable(gl.DEPTH_TEST);

		xform.model.pop();	}

	// draw clipping plane (if any)
	if(config.showClippingPlanes)
	{
		// GLstate setup
		gl.enable(gl.DEPTH_TEST);
		gl.depthMask(false);
		gl.enable(gl.BLEND);
		gl.blendFunc(gl.SRC_ALPHA, gl.ONE);

		if(this._clipAxis[0] != 0.0) {	
			xform.model.push();
			xform.model.translate([this._clipPoint[0], this._sceneBboxCenter[1], this._sceneBboxCenter[2]]);
			xform.model.scale([(this._sceneBboxMax[0] - this._sceneBboxMin[0]),
							   (this._sceneBboxMax[1] - this._sceneBboxMin[1]),
							   (this._sceneBboxMax[2] - this._sceneBboxMin[2])]);

			var QuadUniforms = {
				"uWorldViewProjectionMatrix" : xform.modelViewProjectionMatrix,
				"uViewSpaceNormalMatrix"     : xform.viewSpaceNormalMatrix,
				"uViewSpaceLightDirection"   : this._lightDirection,
				"uColorID"                   : [1.0, 0.0, 0.0, 0.25]
			};

			renderer.begin();
				renderer.setTechnique(CCTechnique);
				renderer.setDefaultGlobals();
				renderer.setPrimitiveMode("FILL");
				renderer.setGlobals(QuadUniforms);
				renderer.setModel(this.simpleQuadXModel);
				renderer.renderModel();
			renderer.end();

			xform.model.pop();
		}

		if(this._clipAxis[1] != 0.0) {
			xform.model.push();
			xform.model.translate([this._sceneBboxCenter[0], this._clipPoint[1], this._sceneBboxCenter[2]]);
			xform.model.scale([(this._sceneBboxMax[0] - this._sceneBboxMin[0]),
							   (this._sceneBboxMax[1] - this._sceneBboxMin[1]),
							   (this._sceneBboxMax[2] - this._sceneBboxMin[2])]);

			var QuadUniforms = {
				"uWorldViewProjectionMatrix" : xform.modelViewProjectionMatrix,
				"uViewSpaceNormalMatrix"     : xform.viewSpaceNormalMatrix,
				"uViewSpaceLightDirection"   : this._lightDirection,
				"uColorID"                   : [0.0, 1.0, 0.0, 0.25]
			};

			renderer.begin();
				renderer.setTechnique(CCTechnique);
				renderer.setDefaultGlobals();
				renderer.setPrimitiveMode("FILL");
				renderer.setGlobals(QuadUniforms);
				renderer.setModel(this.simpleQuadYModel);
				renderer.renderModel();
			renderer.end();

			xform.model.pop();
		}

		if(this._clipAxis[2] != 0.0) {
			xform.model.push();
			xform.model.translate([this._sceneBboxCenter[0], this._sceneBboxCenter[1], this._clipPoint[2]]);
			xform.model.scale([(this._sceneBboxMax[0] - this._sceneBboxMin[0]),
							   (this._sceneBboxMax[1] - this._sceneBboxMin[1]),
							   (this._sceneBboxMax[2] - this._sceneBboxMin[2])]);

			var QuadUniforms = {
				"uWorldViewProjectionMatrix" : xform.modelViewProjectionMatrix,
				"uViewSpaceNormalMatrix"     : xform.viewSpaceNormalMatrix,
				"uViewSpaceLightDirection"   : this._lightDirection,
				"uColorID"                   : [0.0, 0.0, 1.0, 0.25]
			};

			renderer.begin();
				renderer.setTechnique(CCTechnique);
				renderer.setDefaultGlobals();
				renderer.setPrimitiveMode("FILL");
				renderer.setGlobals(QuadUniforms);
				renderer.setModel(this.simpleQuadZModel);
				renderer.renderModel();
			renderer.end();

			xform.model.pop();
		}

		// GLstate cleanup
		gl.disable(gl.BLEND);
		gl.depthMask(true);
		gl.disable(gl.DEPTH_TEST);
	}
},

_drawScenePickingXYZ : function () {
	var gl       = this.ui.gl;
	var width    = this.ui.width;
	var height   = this.ui.height;
	var xform    = this.xform;
	var renderer = this.renderer;
	var CurrProgram   = this.colorCodedXYZNXSProgram;
	var CurrTechnique = this.colorCodedXYZPLYTechnique;
	var meshes    = this._scene.meshes;
	var instances = this._scene.modelInstances;
	var space = this._scene.space;
	var pixel = new Uint8Array(4);

	// picking FB
	this._createPickFramebuffer(width, height);

	// basic setup, matrices for projection & view
	this._setupDraw();

	// clear buffer
	this.pickFramebuffer.bind();
	gl.clearColor(0.0, 0.0, 0.0, 0.0);
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT | gl.STENCIL_BUFFER_BIT);
	this.pickFramebuffer.unbind();

	for (var inst in instances) {
		var instance = instances[inst];
		var mesh     = meshes[instance.mesh];
		if (!mesh) continue;
		var renderable = mesh.renderable;
		if (!renderable) continue;
		if (!instance.visible) continue;

		// GLstate setup
		gl.enable(gl.DEPTH_TEST);

		xform.model.push();
		xform.model.multiply(space.transform.matrix);
		xform.model.multiply(instance.transform.matrix);
		xform.model.multiply(mesh.transform.matrix);

		var modelMatrix = SglMat4.identity();
		modelMatrix = SglMat4.mul(modelMatrix, space.transform.matrix);
		modelMatrix = SglMat4.mul(modelMatrix, instance.transform.matrix);
		modelMatrix = SglMat4.mul(modelMatrix, mesh.transform.matrix);
		var thisClipAxis = instance.clippable?this._clipAxis:[0.0, 0.0, 0.0];

		var uniforms = {
			"uWorldViewProjectionMatrix" : xform.modelViewProjectionMatrix,
			"uModelMatrix"               : modelMatrix,
			"uClipPoint"                 : this._clipPoint,
			"uClipAxis"                  : thisClipAxis,
			"uPointSize"                 : this._scene.config.pointSize
		};

		if(mesh.isNexus) {
			if (!renderable.isReady) continue;
			var nexus = renderable;
			nexus.modelMatrix      = xform.modelMatrix;
			nexus.viewMatrix       = xform.viewMatrix;
			nexus.projectionMatrix = xform.projectionMatrix;
			nexus.viewport         = [0, 0, width, height];

			this.pickFramebuffer.bind();

			var program = CurrProgram;
			program.bind();
			program.setUniforms(uniforms);
				nexus.begin();
				nexus.setPrimitiveMode(instance.rendermode);
				nexus.render();
				nexus.end();
			program.unbind();

			this.pickFramebuffer.unbind();
		}
		else { //drawing ply
			renderer.begin();
				renderer.setFramebuffer(this.pickFramebuffer);
				renderer.setTechnique(CurrTechnique);
				renderer.setDefaultGlobals();
				renderer.setPrimitiveMode(instance.rendermode);
				renderer.setGlobals(uniforms);
				renderer.setModel(renderable);
				renderer.renderModel();
			renderer.end();
		}

		// GLstate cleanup
		gl.disable(gl.DEPTH_TEST);
		// undo transform
		xform.model.pop();
	}

	this.pickFramebuffer.readPixels(pixel, {
		x      : this._pickpoint[0],
		y      : this._pickpoint[1],
		width  : 1,
		height : 1,
		format : gl.RGBA,
		type   : gl.UNSIGNED_BYTE
	});

	var rr = pixel[0] / 255.0;
	var gg = pixel[1] / 255.0;
	var bb = pixel[2] / 255.0;
	var aa = pixel[3] / 255.0;
	var depth = aa  + ( bb / (256.0)) + ( gg / (256.0*256.0)) + ( rr / (256.0*256.0*256.0));

	var ppointc;

	if((rr==0.0) && (gg==0.0) && (bb==00))
		return(null);
	else
		ppointc = xform.unproject([this._pickpoint[0]/width,this._pickpoint[1]/height,depth]);

	return([ppointc[0], ppointc[1], ppointc[2]]);
},

_drawScenePickingInstances : function () {
	var gl       = this.ui.gl;
	var width    = this.ui.width;
	var height   = this.ui.height;
	var xform    = this.xform;
	var renderer = this.renderer;
	var CurrProgram   = this.colorCodedIDNXSProgram;
	var CurrTechnique = this.colorCodedIDPLYTechnique;
	var meshes    = this._scene.meshes;
	var instances = this._scene.modelInstances;
	var space = this._scene.space;
	var pixel = new Uint8Array(4);

	// picking FB
	this._createPickFramebuffer(width, height);

	// basic setup, matrices for projection & view
	this._setupDraw();

	// clear buffer
	this.pickFramebuffer.bind();
	gl.clearColor(0.0, 0.0, 0.0, 0.0);
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT | gl.STENCIL_BUFFER_BIT);
	this.pickFramebuffer.unbind();

	for (var inst in instances) {
		var instance = instances[inst];
		var mesh     = meshes[instance.mesh];
		if (!mesh) continue;
		var renderable = mesh.renderable;
		if (!renderable) continue;
		if (!instance.visible) continue;

		// GLstate setup
		gl.enable(gl.DEPTH_TEST);

		xform.model.push();
		xform.model.multiply(space.transform.matrix);
		xform.model.multiply(instance.transform.matrix);
		xform.model.multiply(mesh.transform.matrix);

		var colorID = this._ID2Color(instance.ID);
		var uniforms = {
			"uWorldViewProjectionMatrix" : xform.modelViewProjectionMatrix,
			"uPointSize"                 : this._scene.config.pointSize,
			"uColorID"                   : colorID
		};

		if(mesh.isNexus) {
			if (!renderable.isReady) continue;
			var nexus = renderable;
			nexus.modelMatrix      = xform.modelMatrix;
			nexus.viewMatrix       = xform.viewMatrix;
			nexus.projectionMatrix = xform.projectionMatrix;
			nexus.viewport         = [0, 0, width, height];

			this.pickFramebuffer.bind();

			var program = CurrProgram;
			program.bind();
			program.setUniforms(uniforms);
				nexus.begin();
				nexus.setPrimitiveMode(instance.rendermode);
				nexus.render();
				nexus.end();
			program.unbind();

			this.pickFramebuffer.unbind();
		}
		else { //drawing ply
			renderer.begin();
				renderer.setFramebuffer(this.pickFramebuffer);
				renderer.setTechnique(CurrTechnique);
				renderer.setDefaultGlobals();
				renderer.setPrimitiveMode(instance.rendermode);
				renderer.setGlobals(uniforms);
				renderer.setModel(renderable);
				renderer.renderModel();
			renderer.end();
		}

		// GLstate cleanup
		gl.disable(gl.DEPTH_TEST);
		// undo transform
		xform.model.pop();
	}

	this.pickFramebuffer.readPixels(pixel, {
		x      : this._pickpoint[0],
		y      : this._pickpoint[1],
		width  : 1,
		height : 1,
		format : gl.RGBA,
		type   : gl.UNSIGNED_BYTE
	});

	return pixel;
},

_drawScenePickingSpots : function () {
	var gl       = this.ui.gl;
	var width    = this.ui.width;
	var height   = this.ui.height;
	var xform    = this.xform;
	var renderer = this.renderer;
	var CurrProgram   = this.colorCodedIDNXSProgram;
	var CurrTechnique = this.colorCodedIDPLYTechnique;
	var meshes    = this._scene.meshes;
	var spots = this._scene.spots;
	var instances = this._scene.modelInstances;
	var space = this._scene.space;
	var pixel = new Uint8Array(4);

	// picking FB
	this._createPickFramebuffer(width, height);

	// basic setup, matrices for projection & view
	this._setupDraw();

	// clear buffer
	this.pickFramebuffer.bind();
	gl.clearColor(0.0, 0.0, 0.0, 0.0);
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT | gl.STENCIL_BUFFER_BIT);
	this.pickFramebuffer.unbind();

	// first pass, draw invisible instances, for occlusion
	for (var inst in instances) {
		var instance = instances[inst];
		var mesh     = meshes[instance.mesh];
		if (!mesh) continue;
		var renderable = mesh.renderable;
		if (!renderable) continue;
		if (!instance.visible) continue;

		// GLstate setup
		gl.enable(gl.DEPTH_TEST);

		xform.model.push();
		xform.model.multiply(space.transform.matrix);
		xform.model.multiply(instance.transform.matrix);
		xform.model.multiply(mesh.transform.matrix);

		var uniforms = {
			"uWorldViewProjectionMatrix" : xform.modelViewProjectionMatrix,
			"uPointSize"                 : this._scene.config.pointSize,
			"uColorID"                   : [0.0, 0.0, 0.0, 0.0]
		};

		if(mesh.isNexus) {
			if (!renderable.isReady) continue;
			var nexus = renderable;
			nexus.modelMatrix      = xform.modelMatrix;
			nexus.viewMatrix       = xform.viewMatrix;
			nexus.projectionMatrix = xform.projectionMatrix;
			nexus.viewport         = [0, 0, width, height];

			this.pickFramebuffer.bind();

			var program = CurrProgram;
			program.bind();
			program.setUniforms(uniforms);
				nexus.begin();
				nexus.setPrimitiveMode(instance.rendermode);
				nexus.render();
				nexus.end();
			program.unbind();

			this.pickFramebuffer.unbind();
		}
		else { //drawing ply
			renderer.begin();
				renderer.setFramebuffer(this.pickFramebuffer);
				renderer.setTechnique(CurrTechnique);
				renderer.setDefaultGlobals();
				renderer.setPrimitiveMode(instance.rendermode);
				renderer.setGlobals(uniforms);
				renderer.setModel(renderable);
				renderer.renderModel();
			renderer.end();
		}

		// GLstate cleanup
		gl.disable(gl.DEPTH_TEST);
		// undo transform
		xform.model.pop();
	}

	// second pass, draw color coded spots, for picking
	for (var spt in spots) {
		var spot = spots[spt];
		var mesh     = meshes[spot.mesh];
		if (!mesh) continue;
		var renderable = mesh.renderable;
		if (!renderable) continue;
		if (!spot.visible) continue;

		// GLstate setup
		gl.enable(gl.DEPTH_TEST);

		xform.model.push();
		xform.model.multiply(space.transform.matrix);
		xform.model.multiply(spot.transform.matrix);
		xform.model.multiply(mesh.transform.matrix);

		var colorID = this._ID2Color(spot.ID);
		var uniforms = {
			"uWorldViewProjectionMatrix" : xform.modelViewProjectionMatrix,
			"uPointSize"                 : this._scene.config.pointSize,
			"uColorID"                   : colorID
		};

		if(mesh.isNexus) {
			if (!renderable.isReady) continue;
			var nexus = renderable;
			nexus.modelMatrix      = xform.modelMatrix;
			nexus.viewMatrix       = xform.viewMatrix;
			nexus.projectionMatrix = xform.projectionMatrix;
			nexus.viewport         = [0, 0, width, height];

			this.pickFramebuffer.bind();

			var program = CurrProgram;
			program.bind();
			program.setUniforms(uniforms);
				nexus.begin();
				nexus.setPrimitiveMode(spot.rendermode);
				nexus.render();
				nexus.end();
			program.unbind();

			this.pickFramebuffer.unbind();
		}
		else { //drawing ply
			renderer.begin();
				renderer.setFramebuffer(this.pickFramebuffer);
				renderer.setTechnique(CurrTechnique);
				renderer.setDefaultGlobals();
				renderer.setPrimitiveMode(spot.rendermode);
				renderer.setGlobals(uniforms);
				renderer.setModel(renderable);
				renderer.renderModel();
			renderer.end();
		}

		// GLstate cleanup
		gl.disable(gl.DEPTH_TEST);
		// undo transform
		xform.model.pop();
	}

	this.pickFramebuffer.readPixels(pixel, {
		x      : this._pickpoint[0],
		y      : this._pickpoint[1],
		width  : 1,
		height : 1,
		format : gl.RGBA,
		type   : gl.UNSIGNED_BYTE
	});

	return pixel;
},

_drawNull : function () {
	var gl = this.ui.gl;
	gl.clearColor(0.0, 0.0, 0.0, 0.0);
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT | gl.STENCIL_BUFFER_BIT);
},

// creates simple 2-point line model
_createLineModel : function () {
	var gl = this.ui.gl;
	this.simpleLineModel = new SglModel(gl, {
				vertices : {
					position : [ 0,0,0,
								 1,1,1 ],
					normal : [ 0,0,0,
							   0,0,0 ],
					color : {value : [ 1.0, 0.0, 0.0 ]}
				},
				primitives : ["lines","points"]
			});
},

// creates simple quad model
_createQuadModels : function () {
	var gl = this.ui.gl;
	this.simpleQuadXModel = new SglModel(gl, {
				vertices : {
					position : [ 0.0, 0.5, 0.5,
								 0.0,-0.5, 0.5,
								 0.0,-0.5,-0.5,
								 0.0, 0.5,-0.5,
								 0.0,-0.5,-0.5,
								 0.0, 0.5, 0.5],
					normal : [ 1.0,0.0,0.0,
							   1.0,0.0,0.0,
							   1.0,0.0,0.0,
							   1.0,0.0,0.0,
							   1.0,0.0,0.0,
							   1.0,0.0,0.0 ],
					color : {value : [ 1.0, 0.0, 0.0 ]}
				},
				primitives : ["triangles"]
			});
	this.simpleQuadYModel = new SglModel(gl, {
				vertices : {
					position : [  0.5, 0.0, 0.5,
								 -0.5, 0.0, 0.5,
								 -0.5, 0.0,-0.5,
								  0.5, 0.0,-0.5,
								 -0.5, 0.0,-0.5,
								  0.5, 0.0, 0.5],
					normal : [ 0.0,1.0,0.0,
							   0.0,1.0,0.0,
							   0.0,1.0,0.0,
							   0.0,1.0,0.0,
							   0.0,1.0,0.0,
							   0.0,1.0,0.0 ],
					color : {value : [ 0.0, 1.0, 0.0 ]}
				},
				primitives : ["triangles"]
			});
	this.simpleQuadZModel = new SglModel(gl, {
				vertices : {
					position : [  0.5, 0.5, 0.0,
								 -0.5, 0.5, 0.0,
								 -0.5,-0.5, 0.0,
								  0.5,-0.5, 0.0,
								 -0.5,-0.5, 0.0,
								  0.5, 0.5, 0.0],
					normal : [ 0.0,0.0,1.0,
							   0.0,0.0,1.0,
							   0.0,0.0,1.0,
							   0.0,0.0,1.0,
							   0.0,0.0,1.0,
							   0.0,0.0,1.0 ],
					color : {value : [ 0.0, 0.0, 1.0 ]}
				},
				primitives : ["triangles"]
			});
},

//----------------------------------------------------------------------------------------
// EVENTS HANDLERS
//----------------------------------------------------------------------------------------
onInitialize : function () {
	var gl = this.ui.gl;

	// debug mode
	this._isDebugging = HOP_DEBUGMODE;

	gl.getExtension('EXT_frag_depth');
	gl.clearColor(0.5, 0.5, 0.5, 1.0);

	// scene rendering support data
	this.renderer   = new SglModelRenderer(gl);
	this.xform      = new SglTransformationStack();
	this.viewMatrix = SglMat4.identity();

	// nexus parameters
	this._nexusTargetFps = 15.0;
	this._nexusTargetError = 1.0;
	this._nexusCacheSize = 50000000;	
	
	// shaders
	this.faceNXSProgram = this._createStandardFaceNXSProgram();
	this.pointNXSProgram = this._createStandardPointNXSProgram();
	this.colorShadedNXSProgram = this._createColorShadedNXSProgram();
	this.colorCodedIDNXSProgram = this._createColorCodedIDNXSProgram();
	this.colorCodedXYZNXSProgram = this._createXYZNXSProgram();

	this.facePLYTechnique = this._createStandardFacePLYtechnique();
	this.pointPLYTechnique = this._createStandardPointPLYtechnique();
	this.colorShadedPLYTechnique = this._createColorShadedPLYtechnique();
	this.colorCodedIDPLYTechnique = this._createColorCodedIDPLYtechnique();
	this.colorCodedXYZPLYTechnique = this._createXYZPLYtechnique();

	this.simpleLineTechnique = this._createSimpleLinetechnique();
	this.multiLinesPointsTechnique = this._createMultiLinesPointstechnique();

	// handlers
	this._onPickedInstance  = 0;
	this._onPickedSpot      = 0;
	this._onEnterInstance   = 0;
	this._onEnterSpot       = 0;
	this._onLeaveInstance   = 0;
	this._onLeaveSpot       = 0;
	this._onEndPickingPoint = 0;
	this._onEndMeasurement  = 0;

	// animation
	this.ui.animateRate = 0;

	// current cursor XY position
	this.x 			= 0.0;
	this.y 			= 0.0;

	this._keycombo = false;

	// SCENE DATA
	this._scene         = null;
	this._sceneParsed   = false;
	this._sceneReady    = false;
	this._objectsToLoad = 0;

	this._instancesProgressiveID = 1;
	this._spotsProgressiveID     = 1;

	this._lightDirection = HOP_DEFAULTLIGHT;

	this.sceneCenter = [0.0, 0.0, 0.0];
	this.sceneRadiusInv = 1.0;

	this._targetInstanceName = null;
	this._targetHotSpotName  = null;

	this._animating      = false;
	this._movingLight    = false;

	this._clickable      = false;
	this._onHover        = false;

	this._lastCursor     = "default";
	this._pickedInstance = null;
	this._pickedSpot     = null;
	this._lastPickedInstance = null;
	this._lastPickedSpot     = null;
	this._lastInstanceID = 0;
	this._lastSpotID     = 0;
	this._pickpoint      = [1, 1];

	// global measurement data
	this._isMeasuring = false;

	// point2point measurement data
	this._isMeasuringDistance = false;
	this._measurementStage = 0; // 0=inactive 1=picking pointA 2=picking pointB 3=measurement ready
	this._pointA = [0.0, 0.0, 0.0];
	this._pointB = [0.0, 0.0, 0.0];
	this.measurement = 0;

	// point picking measurement data
	this._isMeasuringPickpoint = false;
	this._pickValid = false;
	this._pickedPoint = [0.0, 0.0, 0.0];

	// plane section
	this._clipPoint = [0.0, 0.0, 0.0];
	this._clipAxis  = [0.0, 0.0, 0.0];
	this._sceneBboxMin = [0.0, 0.0, 0.0]
	this._sceneBboxMax = [0.0, 0.0, 0.0];
	this._sceneBboxCenter = [0.0, 0.0, 0.0];
},

onDrag : function (button, x, y, e) {
	var ui = this.ui;

	if(this._movingLight && ui.isMouseButtonDown(0)){
		var dxl = (x / (ui.width  - 1)) * 2.0 - 1.0;
		var dyl = (y / (ui.height - 1)) * 2.0 - 1.0;
		this.rotateLight(dxl/2, dyl/2);
		return;
	}

	if(ui.dragDeltaX(button) != 0) this.x += (ui.cursorDeltaX/500);
	if(ui.dragDeltaY(button) != 0) this.y += (ui.cursorDeltaY/500);

	var action = SGL_TRACKBALL_NO_ACTION;
	if ((ui.isMouseButtonDown(0) && ui.isKeyDown(17)) || ui.isMouseButtonDown(1) || ui.isMouseButtonDown(2)) {
		action = SGL_TRACKBALL_PAN;
	}
	else if (ui.isMouseButtonDown(0)) {
		action = SGL_TRACKBALL_ROTATE;
	}

	var testMatrix = this.trackball._matrix.slice();

	this.trackball.action = action;
	this.trackball.track(this.viewMatrix, this.x, this.y, 0.0);

	var diff;
	for(var i=0; i<testMatrix.length; i++) {
		if(testMatrix[i]!=this.trackball._matrix[i]) {diff=true; break;}
	}
	if(diff) ui.postDrawEvent();
},

onMouseMove : function (x, y, e) {
	if(e.target.id!=this.ui.gl.canvas.id) return;
	if(this._onHover && !this.ui.isDragging(0) && !this.isAnimate()) this._pickingRefresh(x, y);
},

onMouseOut : function (x, y) {
	if(this._onHover && !this.ui.isDragging(0)) this._pickingRefresh();
},

onMouseButtonDown : function (button, x, y, e) {
	this._clickable = true;
},

onMouseButtonUp : function (button, x, y, e) {
	if(this._clickable && button==0 && !(this.ui.isDragging(0) && (Math.abs(this.ui.dragDeltaX(0))>=3 || Math.abs(this.ui.dragDeltaY(0)>=3))) && e.detail!=-1) {
		this._pickingRefresh(x, y);
		if(this._onPickedSpot && this._pickedSpot!=null) this._onPickedSpot(this._pickedSpot);
		if(this._onPickedInstance && this._pickedInstance!=null) this._onPickedInstance(this._pickedInstance);
		if(this._isMeasuringPickpoint) this._pickpointRefresh(0, x, y, e);
		if(this._isMeasuringDistance) this._measureRefresh(0, x, y, e);
	}
	this._clickable = false;
},

onDoubleClick : function (button, x, y, e) {
	//only if trackball does support recentering, we do it
	if(this.trackball.recenter){
		this._pickpoint[0] = x;
		this._pickpoint[1] = y;
		var ppoint = this._drawScenePickingXYZ();
		if (ppoint!=null)
		{
			this.ui.animateRate = 30;
			this.trackball.recenter(ppoint);
			this.ui.postDrawEvent();
		}
	}
},

onKeyPress : function (key, e) {
	if(this._isDebugging) { // DEBUGGING-AUTHORING keys
		if((e.charCode == '80') || (e.charCode == '112')) // key "P" to print trackball
			console.log(this.trackball.getState());
		if (e.charCode == '49') { // key "1" to show nexus patches
			Nexus.Debug.nodes=!Nexus.Debug.nodes;
			this.ui.postDrawEvent();
		}
		if (e.charCode == '50') { // key "2" to toggle camera perspective/ortho
			this.toggleCameraType();
		}
	}
},

onKeyUp : function (key, e) {
	if(this._keycombo && e.keyCode == '18') {
		e.preventDefault();
		this._keycombo = false;
	}
},

onMouseWheel: function (wheelDelta, x, y, e) {
	var diff = false;

	if(e && e.altKey) { // key "ALT" + MOUSE WHEEL to change pointclouds point set size
		this._keycombo = true;

		var testValue = this._scene.config.pointSize;

		this._scene.config.pointSize += wheelDelta/10;

		if (this._scene.config.pointSize < this._scene.config.pointSizeMinMax[0]) this._scene.config.pointSize = this._scene.config.pointSizeMinMax[0];
		else if (this._scene.config.pointSize > this._scene.config.pointSizeMinMax[1]) this._scene.config.pointSize = this._scene.config.pointSizeMinMax[1];

		if(testValue!=this._scene.config.pointSize) {
			diff=true;
		}
	}
	else {
		var action = SGL_TRACKBALL_SCALE;
		var factor = wheelDelta > 0.0 ? (0.90) : (1.10);

		var testMatrix = this.trackball._matrix.slice();

		this.trackball.action = action;
		this.trackball.track(this.viewMatrix, 0.0, 0.0, factor);
		this.trackball.action = SGL_TRACKBALL_NO_ACTION;

		for(var i=0; i<testMatrix.length; i++) {
			if(testMatrix[i]!=this.trackball._matrix[i]) {diff=true; break;}
		}
	}

	if(diff) this.ui.postDrawEvent();
},

onAnimate : function (dt) {
	if (this._isSceneReady()) {
		// animate trackball
		if(this.trackball.tick(dt)) {
			this.ui.postDrawEvent();
		}
		else {
			this.ui.animateRate = 0;
			if(this._onHover && !this.ui.isDragging(0)) this._pickingRefresh(this.ui.cursorX, this.ui.cursorY);
		}
	}
},

onDraw : function () {
	if (this._isSceneReady())
		this._drawScene();
	else
		this._drawNull();
},

//----------------------------------------------------------------------------------------
// EXPOSED FUNCTIONS
//----------------------------------------------------------------------------------------
supportsWebGL : function() {
	return this._supportsWebGL;
},

toggleDebugMode : function () {
	this._isDebugging = !this._isDebugging;
},

setNexusTargetFps: function(fps) {
	this._nexusTargetFps = fps;
	var scene = this._scene;
	if(!scene) return;
	for (var m in scene.meshes) {
		var mesh = scene.meshes[m];
		if(!mesh.isNexus) continue;
		mesh.renderable._targetFps = fps;
	}
},

getNexusTargetFps: function() {
	return this._nexusTargetFps;
},
setNexusTargetError: function(error) {
	this._nexusTargetError = error;
	var scene = this._scene;
	if(!scene) return;
	for (var m in scene.meshes) {
		var mesh = scene.meshes[m];
		if(!mesh.isNexus) continue;
		mesh.renderable._targetError = error;
	}
},

getNexusTargetError: function() {
	return this._nexusTargetError;
},

setNexusCacheSize: function(size) {
	this._nexusCacheSize = size;
	var scene = this._scene;
	if(!scene) return;
	for (var m in scene.meshes) {
		var mesh = scene.meshes[m];
		if(!mesh.isNexus) continue;
		mesh.renderable._maxCacheSize = size;
	}
},

getNexusCacheSize: function() {
	return this._nexusCacheSize;
},

setScene : function (options) {
	if (!options) return;

	// scene reset, if already present
	if(this._scene != null)
	{
		this._scene         = null;
		this._sceneParsed   = false;
		this._sceneReady    = false;
		this._instancesProgressiveID = 1;
		this._spotsProgressiveID     = 1;
		this._objectsToLoad = 0;
		this._stopMeasurement();
		this._stopPickPoint();
		this._clipAxis = [0.0, 0.0, 0.0];
		this._clipPoint = [0.0, 0.0, 0.0];
		this.enableLightTrackball(false);
	}

	var scene = this._parseScene(options);
	if (!scene) return;
	this._scene = scene;

	this._objectsToLoad = 0;
	for (var m in scene.meshes) {
		var mesh = scene.meshes[m];
		if (mesh.url) {
			this._objectsToLoad++;
		}
	}

	for (var t in scene.texturedQuads) {
		var tex = scene.texturedQuads[t];
		if (tex.url) {
			this._objectsToLoad++;
		}
	}

	if (scene.background.image) {
		this._objectsToLoad++;
	}

	// creating the desired trackball
	this.trackball  = new this._scene.trackball.type();
	this.trackball.setup(this._scene.trackball.trackOptions);

	var that = this;
	var gl = this.ui.gl;

	for (var m in scene.meshes) {
		var mesh = scene.meshes[m];
		if (!mesh.url) continue;
		if(String(mesh.url).lastIndexOf(".nxs") == (String(mesh.url).length - 4)) {
			var nexus = new Nexus.Renderer(gl);
			mesh.renderable = nexus;
			mesh.isNexus = true;
			nexus.targetError = this._nexusTargetError;
			//nexus.drawBudget = 0.5*1024*1024;
			nexus._targetFps = this._nexusTargetFps;
			nexus._maxCacheSize = this._nexusCacheSize;
			nexus.onSceneReady = function () { that._onMeshReady(); };
			nexus.onUpdate = this.ui.postDrawEvent;
			nexus.open(mesh.url);
		}
		else {
			mesh.renderable = null;
			mesh.isNexus = false;
			sglRequestBinary(mesh.url, {
				onSuccess : (function(m){ return function (req) { that._onPlyLoaded(req, m, gl); }; })(mesh)
			});
		}
	}

	for (var t in scene.texturedQuads) {
		var quad = scene.texturedQuads[t];
		if (!tex.url) continue;
		scene.quad.texture = new SglTexture2D(gl, {
			internalFormat : gl.RGBA,
			format         : gl.RGBA,
			type           : gl.UNSIGNED_BYTE,
			generateMipmap : true,
			onSuccess      : function () { that._onTextureReady(); },
			url            : tex.url
		});
	}

	if (scene.background.image) {
		scene.background.texture = new SglTexture2D(gl, {
			internalFormat : gl.RGBA,
			format         : gl.RGBA,
			type           : gl.UNSIGNED_BYTE,
			generateMipmap : true,
			onSuccess      : function () { that._onBackgroundReady(); },
			url            : scene.background.image
		});
	}

	// create point-to-point line model
	this._createLineModel()
	// create quad models
	this._createQuadModels();

	this._sceneParsed = true;
},

resetTrackball : function () {
	this.trackball.reset();
	this.trackball.track(SglMat4.identity(), 0.0, 0.0, 0.0);
	this._lightDirection = HOP_DEFAULTLIGHT; // also reset lighting
//		this._scene.config.pointSize = HOP_DEFAULTPOINTSIZE; // also reset points size

	this.ui.postDrawEvent();
},

getTrackballPosition : function () {
	return this.trackball.getState();
},

setTrackballPosition : function (newposition) {
	this.trackball.setState(newposition);
	this.ui.postDrawEvent();
},

animateToTrackballPosition : function (newposition, newtime) {
	this.ui.animateRate = 30;
	this.trackball.animateToState(newposition, newtime);
	this.ui.postDrawEvent();
},

isAnimate : function () {
	if(this.ui.animateRate > 0) this._animating = true;
	else this._animating = false;
	return this._animating;
},

//-----------------------------------------------------------------------------
// functions to dynamically change center/radius mode

setCenterModeFirst : function () {
	this._scene.space.centerMode = "first";
	this.ui.postDrawEvent();
},
setCenterModeScene : function () {
	this._scene.space.centerMode = "scene";
	this.ui.postDrawEvent();
},
setCenterModeSpecific : function (instancename) {
	if(this._scene.modelInstances[instancename])
	{
		this._scene.space.centerMode = "specific";
		this._scene.space.whichInstanceCenter = instancename;
		this.ui.postDrawEvent();
	}
	else
		return "ERROR - No such instance";
},
setCenterModeExplicit : function (newcenter) {
	if((newcenter.constructor === Array)&&(newcenter.lenght = 3)&&(isFinite(String(newcenter[0])))&&(isFinite(String(newcenter[1])))&&(isFinite(String(newcenter[2]))))
	{
		this._scene.space.centerMode = "explicit";
		this._scene.space.explicitCenter = newcenter;
		this.ui.postDrawEvent();
	}
	else
		return "ERROR - Not a point";
},

setRadiusModeFirst : function () {
	this._scene.space.radiusMode = "first";
	this.ui.postDrawEvent();
},
setRadiusModeScene : function () {
	this._scene.space.radiusMode = "scene";
	this.ui.postDrawEvent();
},
setRadiusModeSpecific : function (instancename) {
	if(this._scene.modelInstances[instancename])
	{
		this._scene.space.radiusMode = "specific";
		this._scene.space.whichInstanceRadius = instancename;
		this.ui.postDrawEvent();
	}
	else
		return "ERROR - No such instance";
},
setRadiusModeExplicit : function (newradius) {
	if((isFinite(String(newradius)))&&(newradius>0.0))
	{
		this._scene.space.radiusMode = "explicit";
		this._scene.space.explicitRadius = newradius;
		this.ui.postDrawEvent();
	}
	else
		return "ERROR - Not a radius";
},

//-----------------------------------------------------------------------------
// instance solid color
setInstanceSolidColorByName : function (name, newState, redraw, newColor) {
	var instances = this._scene.modelInstances;

	if(name == HOP_ALL) {
		for (var inst in instances) {
			instances[inst].useSolidColor = newState;
			if(newColor)
				instances[inst].color = newColor;
		}
	}
	else {
		if(instances[name]) { // if an instance with that name exists
			instances[name].useSolidColor = newState;
			if(newColor)
				instances[name].color = newColor;
		}
	}
	if(redraw)
		this.ui.postDrawEvent();
},

setInstanceSolidColor : function (tag, newState, redraw, newColor) {
	var instances = this._scene.modelInstances;

	for (var inst in instances) {
		if(tag == HOP_ALL) {
			instances[inst].useSolidColor = newState;
			if(newColor)
				instances[inst].color = newColor;
		}
		else {
			for (var tg in instances[inst].tags){
				if(instances[inst].tags[tg] == tag){
					instances[inst].useSolidColor = newState;
					if(newColor)
						instances[inst].color = newColor;
				}
			}
		}
	}
	if(redraw)
		this.ui.postDrawEvent();
},

toggleInstanceSolidColorByName : function (name, redraw) {
	var instances = this._scene.modelInstances;

	if(name == HOP_ALL)
		for (var inst in instances)
			instances[inst].useSolidColor = !instances[inst].useSolidColor;
	else
		if(instances[name]) // if an instance with that name exists
			instances[name].useSolidColor = !instances[name].useSolidColor;
	if(redraw)
		this.ui.postDrawEvent();
},

toggleInstanceSolidColor : function (tag, redraw) {
	var instances = this._scene.modelInstances;

	for (var inst in instances) {
		if(tag == HOP_ALL)
			instances[inst].useSolidColor = !instances[inst].useSolidColor;
		else
			for (var tg in instances[inst].tags)
				if(instances[inst].tags[tg] == tag)
					instances[inst].useSolidColor = !instances[inst].useSolidColor;
	}
	if(redraw)
		this.ui.postDrawEvent();
},

//-----------------------------------------------------------------------------
// instance transparency
setInstanceTransparencyByName : function (name, newState, redraw, newAlpha) {
	var instances = this._scene.modelInstances;

	if(name == HOP_ALL) {
		for (var inst in instances)
			instances[inst].useTransparency = newState;
			if(newAlpha)
				instances[inst].alpha = newAlpha;
	}
	else {
		if(instances[name]) { // if an instance with that name exists
			instances[name].useTransparency = newState;
			if(newAlpha)
				instances[name].alpha = newAlpha;
		}
	}
	if(redraw)
		this.ui.postDrawEvent();
},

setInstanceTransparency : function (tag, newState, redraw, newAlpha) {
	var instances = this._scene.modelInstances;

	for (var inst in instances) {
		if(tag == HOP_ALL) {
			instances[inst].useTransparency = newState;
			if(newAlpha)
				instances[inst].alpha = newAlpha;
		}
		else {
			for (var tg in instances[inst].tags){
				if(instances[inst].tags[tg] == tag){
					instances[inst].useTransparency = newState;
					if(newAlpha)
						instances[inst].alpha = newAlpha;
				}
			}
		}
	}
	if(redraw)
		this.ui.postDrawEvent();
},

toggleInstanceTransparencyByName : function (name, redraw) {
	var instances = this._scene.modelInstances;

	if(name == HOP_ALL) {
		for (var inst in instances)
			instances[inst].useTransparency = !instances[inst].useTransparency;
	}
	else {
		if(instances[name]) // if an instance with that name exists
			instances[name].useTransparency = !instances[name].useTransparency;
	}
	if(redraw)
		this.ui.postDrawEvent();
},

toggleInstanceTransparency : function (tag, redraw) {
	var instances = this._scene.modelInstances;

	for (var inst in instances) {
		if(tag == HOP_ALL)
		{
			instances[inst].useTransparency = !instances[inst].useTransparency;
		}
		else
		{
			for (var tg in instances[inst].tags){
				if(instances[inst].tags[tg] == tag)
					instances[inst].useTransparency = !instances[inst].useTransparency;
			}
		}
	}
	if(redraw)
		this.ui.postDrawEvent();
},

//-----------------------------------------------------------------------------
// instance visibility
setInstanceVisibilityByName : function (name, newState, redraw) {
	var instances = this._scene.modelInstances;

	if(name == HOP_ALL) {
		for (var inst in instances)
			instances[inst].visible = newState;
	}
	else {
		if(instances[name]) // if an instance with that name exists
			instances[name].visible = newState;
	}
	if(redraw)
		this.ui.postDrawEvent();
},

setInstanceVisibility : function (tag, newState, redraw) {
	var instances = this._scene.modelInstances;

	for (var inst in instances) {
		if(tag == HOP_ALL) {
			instances[inst].visible = newState;
		}
		else {
			for (var tg in instances[inst].tags){
				if(instances[inst].tags[tg] == tag)
					instances[inst].visible = newState;
			}
		}
	}
	if(redraw)
		this.ui.postDrawEvent();
},

toggleInstanceVisibilityByName : function (name, redraw) {
	var instances = this._scene.modelInstances;

	if(name == HOP_ALL) {
		for (var inst in instances)
			instances[inst].visible = !instances[inst].visible;
	}
	else {
		if(instances[name]) // if an instance with that name exists
			instances[name].visible = !instances[name].visible;
	}
	if(redraw)
		this.ui.postDrawEvent();
},

toggleInstanceVisibility : function (tag, redraw) {
	var instances = this._scene.modelInstances;

	for (var inst in instances) {
		if(tag == HOP_ALL)
		{
			instances[inst].visible = !instances[inst].visible;
		}
		else
		{
			for (var tg in instances[inst].tags){
				if(instances[inst].tags[tg] == tag)
					instances[inst].visible = !instances[inst].visible;
			}
		}
	}
	if(redraw)
		this.ui.postDrawEvent();
},

isInstanceVisibilityEnabledByName : function (name) {
	var visibility = false;
	var instances = this._scene.modelInstances;

	if(!name || name==HOP_ALL) {
		for (var inst in instances) {
			if(instances[inst].visible){
				visibility = true;
				return visibility;
			}
		}
	}
	else {
		if(instances[name]) { // if an instance with that name exists
			if(instances[name].visible){
				visibility = true;
				return visibility;
			}
		 }
	}
	return visibility;
},

isInstanceVisibilityEnabled : function (tag) {
	var visibility = false;
	var instances = this._scene.modelInstances;

	for (var inst in instances) {
		if(!tag || tag==HOP_ALL){
			if(instances[inst].visible){
				visibility = true;
				return visibility;
			}
		}
		else{
			for (var tg in instances[inst].tags){
				if(instances[inst].tags[tg] == tag){
					if(instances[inst].visible){
						visibility = true;
						return visibility;
					}
				 }
			}
		}
	}
	return visibility;
},

//-----------------------------------------------------------------------------
// spot visibility
setSpotVisibilityByName : function (name, newState, redraw) {
	var spots = this._scene.spots;

	if(name == HOP_ALL) {
		for (var spt in spots)
			spots[spt].visible = newState;
	}
	else {
		if(spots[name]) // if an hotspot with that name exists
			spots[name].visible = newState;
	}
	if(redraw)
		this.ui.postDrawEvent();
},

setSpotVisibility : function (tag, newState, redraw) {
	var spots = this._scene.spots;
	for (var spt in spots) {
		if(tag == HOP_ALL)
		{
			spots[spt].visible = newState;
		}
		else
		{
			for (var tg in spots[spt].tags){
				if(spots[spt].tags[tg] == tag)
					spots[spt].visible = newState;
			}
		}
	}
	if(redraw)
		this.ui.postDrawEvent();
},

toggleSpotVisibilityByName : function (name, redraw) {
	var spots = this._scene.spots;
	if(name == HOP_ALL) {
		for (var spt in spots)
			spots[spt].visible = !spots[spt].visible;
	}
	else {
		if(spots[name]) // if an hotspot with that name exists
			spots[name].visible = !spots[name].visible;
	}
	if(redraw)
		this.ui.postDrawEvent();
},

toggleSpotVisibility : function (tag, redraw) {
	var spots = this._scene.spots;
	for (var spt in spots) {
		if(tag == HOP_ALL)
		{
			spots[spt].visible = !spots[spt].visible;
		}
		else
		{
			for (var tg in spots[spt].tags){
				if(spots[spt].tags[tg] == tag)
					spots[spt].visible = !spots[spt].visible;
			}
		}
	}
	if(redraw)
		this.ui.postDrawEvent();
},

isSpotVisibilityEnabledByName : function (name) {
	var visibility = false;
	var spots = this._scene.spots;

	if(!name || name==HOP_ALL) {
		for (var spt in spots) {
			if(spots[spt].visible){
				visibility = true;
				return visibility;
			}
		}
	}
	else {
		if(spots[name]) { // if an hotspot with that name exists
			if(spots[name].visible){
				visibility = true;
				return visibility;
			}
		 }
	}
	return visibility;
},

isSpotVisibilityEnabled : function (tag) {
	var visibility = false;
	var spots = this._scene.spots;

	for (var spt in spots) {
		if(!tag || tag==HOP_ALL){
			if(spots[spt].visible){
				visibility = true;
				return visibility;
			}
		}
		else{
			for (var tg in spots[spt].tags){
				if(spots[spt].tags[tg] == tag){
					if(spots[spt].visible){
						visibility = true;
						return visibility;
					}
				 }
			}
		}
	}
	return visibility;
},

//-----------------------------------------------------------------------------
// sections
resetClippingXYZ: function() {
	this._calculateBounding();
	this._clipAxis = [0.0, 0.0, 0.0];
	this._clipPoint = [0.0, 0.0, 0.0];
	this.ui.postDrawEvent();
},

setClippingXYZ: function(cx, cy, cz) {
	this._calculateBounding();
	this._clipAxis = [cx,cy,cz];
	this.ui.postDrawEvent();
},

setClippingX: function(cx) {
	this._calculateBounding();
	this._clipAxis[0] = cx;
	this.ui.postDrawEvent();
},
setClippingY: function(cy) {
	this._calculateBounding();
	this._clipAxis[1] = cy;
	this.ui.postDrawEvent();
},
setClippingZ: function(cz) {
	this._calculateBounding();
	this._clipAxis[2] = cz;
	this.ui.postDrawEvent();
},

getClippingX : function () {
	return this._clipAxis[0];
},
getClippingY : function () {
	return this._clipAxis[1];
},
getClippingZ : function () {
	return this._clipAxis[2];
},

setClippingPointXYZabs: function(clx, cly, clz) {
	this._calculateBounding();
	this._clipPoint = [clx, cly, clz];
	this.ui.postDrawEvent();
},

setClippingPointXabs: function(clx) {
	this._calculateBounding();
	this._clipPoint[0] = clx;
	this.ui.postDrawEvent();
},
setClippingPointYabs: function(cly) {
	this._calculateBounding();
	this._clipPoint[1] = cly;
	this.ui.postDrawEvent();
},
setClippingPointZabs: function(clz) {
	this._calculateBounding();
	this._clipPoint[2] = clz;
	this.ui.postDrawEvent();
},

setClippingPointXYZ: function(clx, cly, clz) {
	var nClipPoint = [0.0, 0.0, 0.0];

	this._calculateBounding();

	if(clx<0.0) clx=0.0; else if(clx>1.0) clx=1.0;
	if(cly<0.0) cly=0.0; else if(cly>1.0) cly=1.0
	if(clz<0.0) clz=0.0; else if(clz>1.0) clz=1.0;

	nClipPoint[0] = this._sceneBboxMin[0] + clx * (this._sceneBboxMax[0] - this._sceneBboxMin[0]);
	nClipPoint[1] = this._sceneBboxMin[1] + cly * (this._sceneBboxMax[1] - this._sceneBboxMin[1]);
	nClipPoint[2] = this._sceneBboxMin[2] + clz * (this._sceneBboxMax[2] - this._sceneBboxMin[2]);

	this._clipPoint = nClipPoint;
	this.ui.postDrawEvent();
},

setClippingPointX: function(clx) {
	var nClipPoint = 0.0;
	this._calculateBounding();
	if(clx<0.0) clx=0.0; else if(clx>1.0) clx=1.0;
	nClipPoint = this._sceneBboxMin[0] + clx * (this._sceneBboxMax[0] - this._sceneBboxMin[0]);
	this._clipPoint[0] = nClipPoint;
	this.ui.postDrawEvent();
},
setClippingPointY: function(cly) {
	var nClipPoint = 0.0;
	this._calculateBounding();
	if(cly<0.0) cly=0.0; else if(cly>1.0) cly=1.0;
	nClipPoint = this._sceneBboxMin[1] + cly * (this._sceneBboxMax[1] - this._sceneBboxMin[1]);
	this._clipPoint[1] = nClipPoint;
	this.ui.postDrawEvent();
},
setClippingPointZ: function(clz) {
	var nClipPoint = 0.0;
	this._calculateBounding();
	if(clz<0.0) clz=0.0; else if(clz>1.0) clz=1.0;
	nClipPoint = this._sceneBboxMin[2] + clz * (this._sceneBboxMax[2] - this._sceneBboxMin[2]);
	this._clipPoint[2] = nClipPoint;
	this.ui.postDrawEvent();
},

_calculateBounding: function() {	var meshes    = this._scene.meshes;
	var instances = this._scene.modelInstances;
	this._sceneBboxMin = SglVec3.maxNumber();
	this._sceneBboxMax = SglVec3.minNumber();
	this._sceneBboxCenter = [0.0, 0.0, 0.0];
	var imin = [0.0, 0.0, 0.0];
	var imax = [0.0, 0.0, 0.0];

	for (var inst in instances) {
		var mesh = meshes[instances[inst].mesh];
		if((mesh)&&(mesh.renderable)&&(instances[inst].clippable)){
			var instCenter = SglVec3.to4(mesh.renderable.datasetCenter,1);
			instCenter = SglMat4.mul4(mesh.transform.matrix, instCenter);
			instCenter = SglMat4.mul4(instances[inst].transform.matrix, instCenter);
			instCenter = SglMat4.mul4(this._scene.space.transform.matrix, instCenter);
			instCenter = SglVec4.to3(instCenter);

			var radius = mesh.renderable.datasetRadius;
			var vector111 = SglVec3.one();
			vector111 = SglMat3.mul3(SglMat4.to33(mesh.transform.matrix), vector111);
			vector111 = SglMat3.mul3(SglMat4.to33(instances[inst].transform.matrix), vector111);
			vector111 = SglMat3.mul3(SglMat4.to33(this._scene.space.transform.matrix), vector111);
			var scalefactor = SglVec3.length(vector111) / SglVec3.length([1,1,1]);
			radius = radius*scalefactor;

			imin[0] = instCenter[0] - radius;
			imin[1] = instCenter[1] - radius;
			imin[2] = instCenter[2] - radius;
			imax[0] = instCenter[0] + radius;
			imax[1] = instCenter[1] + radius;
			imax[2] = instCenter[2] + radius;

			if(imin[0] < this._sceneBboxMin[0]) this._sceneBboxMin[0] = imin[0];
			if(imin[1] < this._sceneBboxMin[1]) this._sceneBboxMin[1] = imin[1];
			if(imin[2] < this._sceneBboxMin[2]) this._sceneBboxMin[2] = imin[2];
			if(imax[0] > this._sceneBboxMax[0]) this._sceneBboxMax[0] = imax[0];
			if(imax[1] > this._sceneBboxMax[1]) this._sceneBboxMax[1] = imax[1];
			if(imax[2] > this._sceneBboxMax[2]) this._sceneBboxMax[2] = imax[2];
		}
	}

	this._sceneBboxCenter[0] = (this._sceneBboxMin[0] + this._sceneBboxMax[0]) / 2.0;
	this._sceneBboxCenter[1] = (this._sceneBboxMin[1] + this._sceneBboxMax[1]) / 2.0;
	this._sceneBboxCenter[2] = (this._sceneBboxMin[2] + this._sceneBboxMax[2]) / 2.0;
},

setClippingRendermode: function(showPlanes, showBorder, borderSize, borderColor) {
	this._calculateBounding();
	this._scene.config.showClippingPlanes = showPlanes;
	this._scene.config.showClippingBorder = showBorder;
	if(borderSize>0.0)
		this._scene.config.clippingBorderSize = borderSize;
	if(borderColor)
		this._scene.config.clippingBorderColor = borderColor;
	this.ui.postDrawEvent();
},

getClippingRendermode: function() {
	var rendermode = [this._scene.config.showClippingPlanes, this._scene.config.showClippingBorder, this._scene.config.clippingBorderSize, this._scene.config.clippingBorderColor];
	return rendermode;
},

//-----------------------------------------------------------------------------
zoomIn: function() {
	this.onMouseWheel(1);
},

zoomOut: function() {
	this.onMouseWheel(-1);
},

//-----------------------------------------------------------------------------
rotateLight: function(x, y) {
	x *= 2;
	y *= 2;
	var r = Math.sqrt(x*x + y*y);
	if(r >= 1) {
		x /= r;
		y /= r;
		r = 0.999;
	}
	var z = Math.sqrt(1 - r*r);
	this._lightDirection = [-x, -y, -z];
	this.ui.postDrawEvent();
},

enableLightTrackball: function(on) {
	this._movingLight = on;
},

isLightTrackballEnabled: function() {
	return this._movingLight;
},

//-----------------------------------------------------------------------------
enableOnHover: function(on) {
	this._onHover = on;
},

isOnHoverEnabled: function() {
	return this._onHover;
},

//-----------------------------------------------------------------------------
enableMeasurementTool: function(on) {
	if(on)
		this._startMeasurement();
	else
		this._stopMeasurement();
},

isMeasurementToolEnabled: function() {
	return this._isMeasuringDistance;
},

//-----------------------------------------------------------------------------
enablePickpointMode: function(on) {
	if(on)
		this._startPickPoint();
	else
		this._stopPickPoint();
},

isPickpointModeEnabled: function() {
	return this._isMeasuringPickpoint;
},

//-----------------------------------------------------------------------------
isAnyMeasurementEnabled: function() {
	return this._isMeasuring;
},

//-----------------------------------------------------------------------------
toggleCameraType: function() {
	if(this._scene.space.cameraType == "ortho")
		this._scene.space.cameraType = "perspective"
	else
		this._scene.space.cameraType = "ortho"

	this.ui.postDrawEvent();
},

setCameraPerspective() {
	this._scene.space.cameraType = "perspective";
	this.ui.postDrawEvent();
},
setCameraOrthographic() {
	this._scene.space.cameraType = "ortho";
	this.ui.postDrawEvent();
},

//-----------------------------------------------------------------------------
repaint() {
	this.ui.postDrawEvent();
},

}; // Presenter.prototype END
