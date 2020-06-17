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

SpiderGL.openNamespace();

//----------------------------------------------------------------------------------------
// CONSTANTS
//----------------------------------------------------------------------------------------
// version
const HOP_VERSION             = "4.3";
// selectors
const HOP_ALL                 = 256;
// starting debug mode
const HOP_DEBUGMODE           = false;
// default light direction
const HOP_DEFAULTLIGHT        = [0, 0, -1];
// default points size
const HOP_DEFAULTPOINTSIZE    = 1.0;
// sgltrackball
const SGL_TRACKBALL_NO_ACTION = 0;
const SGL_TRACKBALL_ROTATE    = 1;
const SGL_TRACKBALL_PAN       = 2;
const SGL_TRACKBALL_DOLLY     = 3;
const SGL_TRACKBALL_SCALE     = 4;

Presenter = function (canvas) {
	this._supportsWebGL = sglHandleCanvas(canvas, this, { stencil: true });
	console.log("3DHOP version: " + this.version);
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
	var r = sglGetDefaultObject({
		image         : null,
		isEnvironment : false,
		color         : [ 0.0, 0.0, 0.0, 0.0 ]
	}, options);
	if (r.image) { this._objectsToProcess++; this._objectsToLoad++; }
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
		mType     : null,
		transform : null
	}, options);
	r.transform = this._parseTransform(r.transform);
	if (r.url) { this._objectsToProcess++; this._objectsToLoad++; }
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
	var r = sglGetDefaultObject({
		url       : null
	}, options);
	if (r.url) { this._objectsToProcess++; this._objectsToLoad++; }
	return r;
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
		specularColor   : [ 0.0, 0.0, 0.0, 32.0 ],
		backfaceColor   : [ 0.7, 0.4, 0.4, 0.0 ],
		alpha           : 0.5,
		useTransparency : false,
		useLighting     : true,
		cursor          : "default",
		ID              : 0,
		transform       : null,
		visible         : true,
		tags            : [ ],
		clippable       : true,
		measurable      : true,
	}, options);
	if (r.color[3]) //3DHOP 2.0 backward compatibility
	{
		r.alpha = r.color[3];
		r.color = [r.color[0], r.color[1], r.color[2]]
	}
	r.transform = this._parseTransform(r.transform);
	r.ID = this._instancesProgressiveID;
	this._instancesProgressiveID++;
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
		alphaHigh       : 0.8,
		useTransparency : true,
		useStencil      : false,
		cursor          : "pointer",
		ID              : 0,
		transform       : null,
		visible         : true,
		tags            : [ ]
	}, options);
	if (r.color[3]) //3DHOP 2.0 backward compatibility
	{
		r.alpha = r.color[3];
		r.color = [r.color[0], r.color[1], r.color[2]]
	}
	r.transform = this._parseTransform(r.transform);
	r.ID = this._spotsProgressiveID;
	this._spotsProgressiveID++;
	return r;
},

_parseTrackball : function (options) {
	var r = sglGetDefaultObject({
		type         : TurnTableTrackball,
		trackOptions : {},
		locked       : false
	}, options);
	return r;
},

_parseSpace : function (options) {
	var r = sglGetDefaultObject({
		centerMode       : "first",
		radiusMode       : "first",
		whichInstanceCenter  : "",
		whichInstanceRadius  : "",
		explicitCenter   : [0.0, 0.0, 0.0],
		explicitRadius   : 1.0,
		transform        : null,
		cameraFOV        : 60.0,
		cameraNearFar    : [0.01, 10.0],
		cameraType       : "perspective",
		sceneLighting      : true,
	}, options);
	r.transform = this._parseTransform(r.transform);
	if(r.cameraFOV < 2.0)  r.cameraFOV = 2.0;
	if(r.cameraFOV > 88.0) r.cameraFOV = 88.0;
	if((r.cameraType != "perspective") && (r.cameraType != "orthographic")) r.cameraType = "perspective";
	return r;
},

_parseConfig : function (options) {
	var r = sglGetDefaultObject({
		pickedpointColor    : [1.0, 0.0, 1.0],
		measurementColor    : [0.5, 1.0, 0.5],
		showClippingPlanes  : true,
		showClippingBorder  : false,
		clippingBorderSize  : 0.5,
		clippingBorderColor : [0.0, 1.0, 1.0],
		pointSize           : 3.0,
		pointSizeMinMax     : [1.0, 5.0],
		autoSaveScreenshot  : true,
		screenshotBaseName  : "screenshot",
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
		var mrY = SglMat4.rotationAngleAxis(sglDegToRad(r.rotation[1]), [0.0, 1.0, 0.0]);
		var mrZ = SglMat4.rotationAngleAxis(sglDegToRad(r.rotation[2]), [0.0, 0.0, 1.0]);
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
// standard program for points rendering
_createStandardPointsProgram : function () {
	var gl = this.ui.gl;
	var pointsVertexShader = new SglVertexShader(gl, "\
		precision highp float;													\n\
																				\n\
		uniform   mat4 uWorldViewProjectionMatrix;								\n\
		uniform   mat3 uViewSpaceNormalMatrix;									\n\
		uniform   mat4 uWorldViewMatrix;										\n\
		uniform   mat4 uModelMatrix;											\n\
		uniform   float uPointSize;												\n\
																				\n\
		attribute vec3 aPosition;												\n\
		attribute vec3 aNormal;													\n\
		attribute vec4 aColor;													\n\
		attribute float aPointSize;												\n\
																				\n\
		varying   vec3 vNormal;													\n\
		varying   vec4 vColor;													\n\
		varying   vec4 vModelPos;												\n\
		varying   vec4 vModelViewPos;											\n\
																				\n\
		void main(void)															\n\
		{																		\n\
			vNormal       = normalize(uViewSpaceNormalMatrix * aNormal);		\n\
			vColor        = aColor;												\n\
			vModelPos     = uModelMatrix * vec4(aPosition, 1.0);				\n\
			vModelViewPos = uWorldViewMatrix * vec4(aPosition, 1.0);			\n\
																				\n\
			gl_Position  = uWorldViewProjectionMatrix * vec4(aPosition, 1.0);	\n\
			gl_PointSize = uPointSize * aPointSize;								\n\
		}																		\n\
	");
	if(this._isDebugging)
		console.log("STD POINTS Vertex Shader Log:\n" + pointsVertexShader.log);

	var pointsFragmentShader = new SglFragmentShader(gl, "\
		#extension GL_EXT_frag_depth : enable									\n\
		precision highp float;													\n\
																				\n\
		uniform   vec3 uViewSpaceLightDirection;								\n\
		uniform   float uAlpha;													\n\
		uniform   bool uUseSolidColor;											\n\
		uniform   bool uUseLighting;											\n\
		uniform   vec3 uSolidColor;												\n\
		uniform   vec4 uSpecularColor;											\n\
		uniform   vec3 uClipPoint;												\n\
		uniform   vec3 uClipAxis;												\n\
		uniform   vec4 uClipPlane;												\n\
		uniform   vec3 uClipColor;												\n\
		uniform   float uClipColorSize;											\n\
																				\n\
		varying   vec3 vNormal;													\n\
		varying   vec4 vColor;													\n\
		varying   vec4 vModelPos;												\n\
		varying   vec4 vModelViewPos;											\n\
																				\n\
		void main(void)															\n\
		{																		\n\
			if(length(uClipPlane.xyz) > 0.0)									\n\
				if( dot(vModelPos, uClipPlane) > 0.0) discard;					\n\
			if(length(uClipAxis) > 0.0)											\n\
			{																	\n\
				if( uClipAxis[0] * (vModelPos[0] - uClipPoint[0]) > 0.0) discard;	\n\
				if( uClipAxis[1] * (vModelPos[1] - uClipPoint[1]) > 0.0) discard;	\n\
				if( uClipAxis[2] * (vModelPos[2] - uClipPoint[2]) > 0.0) discard;	\n\
			}																	\n\
																				\n\
			vec2 cxy = 2.0 * gl_PointCoord - 1.0;								\n\
			float r = dot(cxy, cxy);											\n\
			if (r > 1.0) { discard; }											\n\
																				\n\
			vec3  renderColor = vec3(1.0, 1.0, 1.0);							\n\
			vec3  diffuse = vColor.rgb;											\n\
			float lambert = 1.0;												\n\
			vec3  specular = vec3(0.0, 0.0, 0.0);								\n\
																				\n\
			if(uUseSolidColor) {												\n\
			  if(uSolidColor.r + uSolidColor.g + uSolidColor.b == -3.0)			\n\
				diffuse = vColor.aaa;											\n\
			  else																\n\
				diffuse = uSolidColor;											\n\
			}																	\n\
																				\n\
			if((uUseLighting)&&(length(vNormal) > 0.0))							\n\
			{																	\n\
			  float nDotL   = dot(vNormal, -uViewSpaceLightDirection);			\n\
			  lambert = max(0.0, nDotL);										\n\
																				\n\
              vec3 halfV = normalize(-uViewSpaceLightDirection -vModelViewPos.xyz);\n\
              float spc = pow(max(dot(vNormal, halfV),0.0), uSpecularColor.a);	\n\
              specular = spc * uSpecularColor.rgb;								\n\
			}																	\n\
																				\n\
			renderColor = (diffuse * lambert) + specular;						\n\
																				\n\
			if((length(uClipPlane.xyz) > 0.0)&&(uClipColorSize>0.0))			\n\
				if( dot(vModelPos, uClipPlane) > -uClipColorSize) renderColor = uClipColor;	\n\
			if((length(uClipAxis) > 0.0)&&(uClipColorSize>0.0))					\n\
			{																	\n\
				if( uClipAxis[0] * (vModelPos[0] - uClipPoint[0] + (uClipAxis[0]*uClipColorSize)) > 0.0) renderColor = uClipColor;	\n\
				if( uClipAxis[1] * (vModelPos[1] - uClipPoint[1] + (uClipAxis[1]*uClipColorSize)) > 0.0) renderColor = uClipColor;	\n\
				if( uClipAxis[2] * (vModelPos[2] - uClipPoint[2] + (uClipAxis[2]*uClipColorSize)) > 0.0) renderColor = uClipColor;	\n\
			}																	\n\
																				\n\
			gl_FragColor = vec4(renderColor, uAlpha);							\n\
			gl_FragDepthEXT = gl_FragCoord.z + 0.0001*(pow(r, 2.0));			\n\
		}																		\n\
	");
	if(this._isDebugging)
		console.log("STD POINTS	Fragment Shader Log:\n" + pointsFragmentShader.log);

	var program = new SglProgram(gl, {
		shaders    : [
			pointsVertexShader,
			pointsFragmentShader
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
			"uWorldViewMatrix"           : SglMat4.identity(),
			"uModelMatrix"               : SglMat4.identity(),
			"uViewSpaceLightDirection"   : [0.0, 0.0, -1.0],
			"uPointSize"                 : 1.0,
			"uAlpha"                     : 1.0,
			"uUseSolidColor"             : false,
			"uUseLighting"               : true,
			"uSolidColor"                : [1.0, 1.0, 1.0],
			"uSpecularColor"             : [0.0, 0.0, 0.0, 32.0],
			"uClipPoint"                 : [0.0, 0.0, 0.0],
			"uClipAxis"                  : [0.0, 0.0, 0.0],
			"uClipPlane"                 : [0.0, 0.0, 0.0, 0.0],
			"uClipColor"				 : [1.0, 1.0, 1.0],
			"uClipColorSize"			 : 0.5
		}
	});
	if(this._isDebugging)
		console.log("STD POINTS Program Log:\n" + program.log);

	return program;
},

// standard program for faces rendering
_createStandardFacesProgram : function () {
	var gl = this.ui.gl;
	var facesVertexShader = new SglVertexShader(gl, "\
		precision highp float;													\n\
																				\n\
		uniform   mat4 uWorldViewProjectionMatrix;								\n\
		uniform   mat3 uViewSpaceNormalMatrix;									\n\
		uniform   mat4 uWorldViewMatrix;										\n\
		uniform   mat4 uModelMatrix;											\n\
																				\n\
		attribute vec3 aPosition;												\n\
		attribute vec3 aNormal;													\n\
		attribute vec4 aColor;													\n\
		attribute vec2 aTextureCoord;											\n\
																				\n\
		varying   vec3 vNormal;													\n\
		varying   vec4 vColor;													\n\
		varying   vec4 vModelPos;												\n\
		varying   vec4 vModelViewPos;											\n\
		varying   vec2 vTextureCoord;											\n\
																				\n\
		void main(void)															\n\
		{																		\n\
			vNormal       = normalize(uViewSpaceNormalMatrix * aNormal);		\n\
			vColor        = aColor;												\n\
			vModelPos     = uModelMatrix * vec4(aPosition, 1.0);				\n\
			vModelViewPos = uWorldViewMatrix * vec4(aPosition, 1.0);			\n\
			vTextureCoord = aTextureCoord;										\n\
																				\n\
			gl_Position = uWorldViewProjectionMatrix * vec4(aPosition, 1.0);	\n\
		}																		\n\
	");
	if(this._isDebugging)
		console.log("STD FACES Vertex Shader Log:\n" + facesVertexShader.log);

	var facesFragmentShader = new SglFragmentShader(gl, "\
		precision highp float;													\n\
																				\n\
		uniform   vec3 uViewSpaceLightDirection;								\n\
		uniform   float uAlpha;													\n\
		uniform   bool uUseSolidColor;											\n\
		uniform   bool uUseLighting;											\n\
		uniform   vec4 uBackFaceColor;											\n\
		uniform   vec3 uSolidColor;												\n\
		uniform   vec4 uSpecularColor;											\n\
		uniform   vec3 uClipPoint;												\n\
		uniform   vec3 uClipAxis;												\n\
		uniform   vec4 uClipPlane;												\n\
		uniform   vec3 uClipColor;												\n\
		uniform   float uClipColorSize;											\n\
		uniform   sampler2D uSampler;											\n\
																				\n\
		varying   vec3 vNormal;													\n\
		varying   vec4 vColor;													\n\
		varying   vec4 vModelPos;												\n\
		varying   vec4 vModelViewPos;											\n\
		varying   vec2 vTextureCoord;											\n\
																				\n\
		void main(void)															\n\
		{																		\n\
			if(length(uClipPlane.xyz) > 0.0)									\n\
				if( dot(vModelPos, uClipPlane) > 0.0) discard;					\n\
			if(length(uClipAxis) > 0.0)											\n\
			{																	\n\
				if( uClipAxis[0] * (vModelPos[0] - uClipPoint[0]) > 0.0) discard;	\n\
				if( uClipAxis[1] * (vModelPos[1] - uClipPoint[1]) > 0.0) discard;	\n\
				if( uClipAxis[2] * (vModelPos[2] - uClipPoint[2]) > 0.0) discard;	\n\
			}																	\n\
																				\n\
			vec3  renderColor = vec3(1.0, 1.0, 1.0);							\n\
			vec3  diffuse = vColor.rgb;											\n\
			float lambert = 1.0;												\n\
			vec3  specular = vec3(0.0, 0.0, 0.0);								\n\
																				\n\
			if(vTextureCoord.x != 0.0)											\n\
			  diffuse = texture2D(uSampler, vTextureCoord).xyz;					\n\
																				\n\
			if(uUseSolidColor) {												\n\
			  if(uSolidColor.r + uSolidColor.g + uSolidColor.b == -3.0)			\n\
				diffuse = vColor.aaa;											\n\
			  else if(uSolidColor.r + uSolidColor.g + uSolidColor.b == -6.0)	\n\
				diffuse = vColor.rgb;											\n\
			  else																\n\
				diffuse = uSolidColor;											\n\
			}																	\n\
																				\n\
			if((uUseLighting)&&(length(vNormal) > 0.0))							\n\
			{																	\n\
			  float nDotL   = dot(vNormal, -uViewSpaceLightDirection);			\n\
			  lambert = max(0.0, gl_FrontFacing? nDotL : -nDotL);				\n\
																				\n\
              vec3 halfV = normalize(-uViewSpaceLightDirection -vModelViewPos.xyz);\n\
              float spc = pow(max(dot(vNormal, halfV),0.0), uSpecularColor.a);	\n\
              specular = spc * uSpecularColor.rgb;								\n\
			}																	\n\
																				\n\
			renderColor = (diffuse * lambert) + specular;						\n\
			if(gl_FrontFacing==false)											\n\
			{																	\n\
				if (uBackFaceColor[3]==0.0) renderColor = renderColor * uBackFaceColor.rgb;	\n\
				else if(uBackFaceColor[3]==1.0) renderColor = uBackFaceColor.rgb;			\n\
				else if(uBackFaceColor[3]==2.0) discard;									\n\
				else if(uBackFaceColor[3]==3.0) renderColor = (uBackFaceColor.rgb * lambert)+specular;\n\
			}																	\n\
																				\n\
			if((length(uClipPlane.xyz) > 0.0)&&(uClipColorSize>0.0))			\n\
				if( dot(vModelPos, uClipPlane) > -uClipColorSize) renderColor = uClipColor;	\n\
			if((length(uClipAxis) > 0.0)&&(uClipColorSize>0.0))					\n\
			{																	\n\
				if( uClipAxis[0] * (vModelPos[0] - uClipPoint[0] + (uClipAxis[0]*uClipColorSize)) > 0.0) renderColor = uClipColor;	\n\
				if( uClipAxis[1] * (vModelPos[1] - uClipPoint[1] + (uClipAxis[1]*uClipColorSize)) > 0.0) renderColor = uClipColor;	\n\
				if( uClipAxis[2] * (vModelPos[2] - uClipPoint[2] + (uClipAxis[2]*uClipColorSize)) > 0.0) renderColor = uClipColor;	\n\
			}																	\n\
																				\n\
			gl_FragColor = vec4(renderColor, uAlpha);							\n\
		}																		\n\
	");
	if(this._isDebugging)
		console.log("STD FACES Fragment Shader Log:\n" + facesFragmentShader.log);

	var program = new SglProgram(gl, {
		shaders    : [
			facesVertexShader,
			facesFragmentShader
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
			"uWorldViewMatrix"           : SglMat4.identity(),
			"uModelMatrix"               : SglMat4.identity(),
			"uViewSpaceLightDirection"   : [0.0, 0.0, -1.0],
			"uAlpha"                     : 1.0,
			"uUseSolidColor"             : false,
			"uUseLighting"               : true,
			"uBackFaceColor"             : [0.4, 0.3, 0.3, 0.0],
			"uSolidColor"                : [1.0, 1.0, 1.0],
			"uSpecularColor"             : [0.0, 0.0, 0.0, 32.0],
			"uClipPoint"                 : [0.0, 0.0, 0.0],
			"uClipAxis"                  : [0.0, 0.0, 0.0],
			"uClipPlane"                 : [0.0, 0.0, 0.0, 0.0],
			"uClipColor"                 : [1.0, 1.0, 1.0],
			"uClipColorSize"             : 0.5,
			"uSampler"                   : 0
		}
	});
	if(this._isDebugging)
		console.log("STD FACE Program Log:\n" + program.log);

	return program;
},

// utils program for XYZ picking and color coded rendering
_createUtilsProgram : function () {
	var gl = this.ui.gl;
	var utilsVertexShader = new SglVertexShader(gl, "\
		precision highp float;                                                \n\
																			  \n\
		uniform   mat4 uWorldViewProjectionMatrix;                            \n\
		uniform   mat4 uModelMatrix;                                          \n\
		uniform   float uPointSize;                                           \n\
																			  \n\
		attribute vec3 aPosition;                                             \n\
		attribute vec3 aNormal;                                               \n\
		attribute vec4 aColor;                                                \n\
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
		console.log("UTILS Vertex Shader Log:\n" + utilsVertexShader.log);

	var utilsFragmentShader = new SglFragmentShader(gl, "\
		precision highp float;													\n\
																				\n\
		uniform   vec3 uClipPoint;												\n\
		uniform   vec3 uClipAxis;												\n\
		uniform   vec4 uClipPlane;												\n\
		uniform   vec4 uBackFaceColor;											\n\
		uniform   vec4 uColorID;												\n\
		uniform   float uMode;													\n\
																				\n\
		varying   vec4 vModelPos;												\n\
																				\n\
		vec4 pack_depth(const in float depth)											\n\
		{																				\n\
			const vec4 bit_shift = vec4(255.0*255.0*255.0, 255.0*255.0, 255.0, 1.0);	\n\
			const vec4 bit_mask  = vec4(0.0, 1.0/255.0, 1.0/255.0, 1.0/255.0);			\n\
			vec4 res = fract(depth * bit_shift);										\n\
			res -= res.xxyz * bit_mask;													\n\
			return res;																	\n\
		}																				\n\
																				\n\
		void main(void)															\n\
		{																		\n\
			if(length(uClipPlane.xyz) > 0.0)									\n\
				if( dot(vModelPos, uClipPlane) > 0.0) discard;					\n\
			if(length(uClipAxis) > 0.0)											\n\
			{																	\n\
				if( uClipAxis[0] * (vModelPos[0] - uClipPoint[0]) > 0.0) discard;	\n\
				if( uClipAxis[1] * (vModelPos[1] - uClipPoint[1]) > 0.0) discard;	\n\
				if( uClipAxis[2] * (vModelPos[2] - uClipPoint[2]) > 0.0) discard;	\n\
			}																	\n\
			if((gl_FrontFacing==false) && (uBackFaceColor[3]==2.0)) discard;	\n\
																				\n\
			vec4 outColor;														\n\
			if(uMode == 1.0)	//xyx picking									\n\
				outColor = pack_depth(gl_FragCoord.z);							\n\
			else if(uMode == 2.0)	//color coded								\n\
				outColor = uColorID;											\n\
																				\n\
			gl_FragColor = outColor;											\n\
		}																		\n\
	");
	if(this._isDebugging)
		console.log("UTILS Fragment Shader Log:\n" + utilsFragmentShader.log);

	var utilsProgram = new SglProgram(gl, {
		shaders    : [
			utilsVertexShader,
			utilsFragmentShader
		],
		attributes : {
			"aPosition" : 0,
			"aNormal"   : 1,
			"aColor"    : 2,
			"aPointSize": 4
		},
		uniforms   : {
			"uWorldViewProjectionMatrix" : SglMat4.identity(),
			"uModelMatrix"               : SglMat4.identity(),
			"uClipPoint"                 : [0.0, 0.0, 0.0],
			"uClipAxis"                  : [0.0, 0.0, 0.0],
			"uClipPlane"                 : [0.0, 0.0, 0.0, 0.0],
			"uBackFaceColor"             : [0.4, 0.3, 0.3, 0.0],
			"uColorID"                   : [1.0, 0.5, 0.0, 1.0],
			"uPointSize"                 : 1.0,
			"uMode"                      : 1.0
		}
	});
	if(this._isDebugging)
		console.log("UTILS Program Log:\n" + utilsProgram.log);

	return utilsProgram;
},

// single-color barely-shaded program for spot and planes rendering
_createColorShadedProgram : function () {
	var gl = this.ui.gl;
	var colorShadedVertexShader = new SglVertexShader(gl, "\
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
		console.log("COLOR SHADED Vertex Shader Log:\n" + colorShadedVertexShader.log);

	var colorShadedFragmentShader = new SglFragmentShader(gl, "\
		precision highp float;                                                \n\
																			  \n\
		uniform   vec3 uViewSpaceLightDirection;                              \n\
		uniform   vec4 uColorID;                                              \n\
																			  \n\
		varying   vec3 vNormal;                                               \n\
																			  \n\
		void main(void)                                                       \n\
		{                                                                     \n\
			if(uColorID[3] == 0.0) discard;                                   \n\
			vec3  diffuse = vec3(uColorID[0], uColorID[1], uColorID[2]);      \n\
																			  \n\
			if(vNormal[0] != 0.0 || vNormal[1] != 0.0 || vNormal[2] != 0.0) { \n\
				vec3  normal    = normalize(vNormal);                         \n\
				float nDotL     = dot(normal, -uViewSpaceLightDirection);     \n\
				float lambert   = max(-nDotL, nDotL);                         \n\
																			  \n\
				diffuse = (diffuse * 0.5) + (diffuse * lambert * 0.5);        \n\
			}                                                                 \n\
			gl_FragColor = vec4(diffuse, uColorID[3]);                       \n\
		}                                                                     \n\
	");
	if(this._isDebugging)
		console.log("COLOR SHADED Fragment Shader Log:\n" + colorShadedFragmentShader.log);

	var program = new SglProgram(gl, {
		shaders    : [
			colorShadedVertexShader,
			colorShadedFragmentShader
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

// standard technique for PLY points rendering
_createStandardPointsTechnique : function () {
	var gl = this.ui.gl;
	var technique = new SglTechnique(gl, {
		program  : this._createStandardPointsProgram(),
		vertexStreams : {
			"aNormal"    : [ 0.0, 0.0, 0.0 ],
			"aColor"     : [ 0.8, 0.8, 0.8, 1.0 ],
			"aPointSize" : 1.0
		},
		globals : {
			"uWorldViewProjectionMatrix" : { semantic : "uWorldViewProjectionMatrix", value : SglMat4.identity() },
			"uViewSpaceNormalMatrix"     : { semantic : "uViewSpaceNormalMatrix",     value : SglMat3.identity() },
			"uWorldViewMatrix"           : { semantic : "uWorldViewMatrix",           value : SglMat4.identity() },
			"uModelMatrix"               : { semantic : "uModelMatrix",               value : SglMat4.identity() },
			"uViewSpaceLightDirection"   : { semantic : "uViewSpaceLightDirection",   value : [ 0.0, 0.0, -1.0 ] },
			"uPointSize"                 : { semantic : "uPointSize",                 value : 1.0 },
			"uAlpha"                     : { semantic : "uAlpha",                     value : 1.0 },
			"uUseSolidColor"             : { semantic : "uUseSolidColor",             value : false },
			"uUseLighting"               : { semantic : "uUseLighting",               value : true },
			"uSolidColor"                : { semantic : "uSolidColor",                value : [ 1.0, 1.0, 1.0 ] },
			"uBackFaceColor"             : { semantic : "uBackFaceColor",             value : [0.4, 0.3, 0.3, 0.0] },
			"uSpecularColor"             : { semantic : "uSpecularColor",             value : [0.5, 0.2, 0.8, 32.0] },
			"uClipPoint"                 : { semantic : "uClipPoint",                 value : [ 0.0, 0.0, 0.0 ] },
			"uClipAxis"                  : { semantic : "uClipAxis",                  value : [ 0.0, 0.0, 0.0 ] },
			"uClipPlane"                 : { semantic : "uClipPlane",                 value : [ 0.0, 0.0, 0.0, 0.0 ] },
			"uClipColor"                 : { semantic : "uClipColor",                 value : [ 1.0, 1.0, 1.0 ]},
			"uClipColorSize"             : { semantic : "uClipColorSize",             value : 0.5 }
		}
	});

	return technique;
},

// standard technique for PLY faces rendering
_createStandardFacesTechnique : function () {
	var gl = this.ui.gl;
	var technique = new SglTechnique(gl, {
		program  : this._createStandardFacesProgram(),
		vertexStreams : {
			"aNormal"       : [ 0.0, 0.0, 0.0 ],
			"aColor"        : [ 0.8, 0.8, 0.8, 1.0 ],
			"aTextureCoord" : [ 0.0, 0.0 ]
		},
		globals : {
			"uWorldViewProjectionMatrix" : { semantic : "uWorldViewProjectionMatrix", value : SglMat4.identity() },
			"uViewSpaceNormalMatrix"     : { semantic : "uViewSpaceNormalMatrix",     value : SglMat3.identity() },
			"uWorldViewMatrix"           : { semantic : "uWorldViewMatrix",           value : SglMat4.identity() },
			"uModelMatrix"               : { semantic : "uModelMatrix",               value : SglMat4.identity() },
			"uViewSpaceLightDirection"   : { semantic : "uViewSpaceLightDirection",   value : [ 0.0, 0.0, -1.0 ] },
			"uAlpha"                     : { semantic : "uAlpha",                     value : 1.0 },
			"uUseSolidColor"             : { semantic : "uUseSolidColor",             value : false },
			"uUseLighting"               : { semantic : "uUseLighting",               value : true },
			"uSolidColor"                : { semantic : "uSolidColor",                value : [ 1.0, 1.0, 1.0 ] },
			"uBackFaceColor"             : { semantic : "uBackFaceColor",             value : [0.4, 0.3, 0.3, 0.0] },
			"uSpecularColor"             : { semantic : "uSpecularColor",             value : [0.5, 0.2, 0.8, 32.0] },
			"uClipPoint"                 : { semantic : "uClipPoint",                 value : [ 0.0, 0.0, 0.0 ] },
			"uClipAxis"                  : { semantic : "uClipAxis",                  value : [ 0.0, 0.0, 0.0 ] },
			"uClipPlane"                 : { semantic : "uClipPlane",                 value : [ 0.0, 0.0, 0.0, 0.0 ] },
			"uClipColor"                 : { semantic : "uClipColor",                 value : [ 1.0, 1.0, 1.0 ]},
			"uClipColorSize"             : { semantic : "uClipColorSize",             value : 0.5 },
			"uSampler"                   : { semantic : "uSampler",                   value : 0 }
		}
	});

	return technique;
},

// utils technique for PLY picking and color coded rendering
_createUtilsTechnique : function () {
	var gl = this.ui.gl;
	var technique = new SglTechnique(gl, {
		program  : this._createUtilsProgram(),
		vertexStreams : {
			"aNormal"    : [ 0.0, 0.0, 0.0 ],
			"aColor"     : [ 0.8, 0.8, 0.8, 1.0 ],
			"aPointSize" : 1.0,
		},
		globals : {
			"uWorldViewProjectionMatrix" : { semantic : "uWorldViewProjectionMatrix", value : SglMat4.identity() },
			"uModelMatrix"               : { semantic : "uModelMatrix",               value : SglMat4.identity() },
			"uClipPoint"                 : { semantic : "uClipPoint",                 value : [ 0.0, 0.0, 0.0 ] },
			"uClipAxis"                  : { semantic : "uClipAxis",                  value : [ 0.0, 0.0, 0.0 ] },
			"uClipPlane"                 : { semantic : "uClipPlane",                 value : [ 0.0, 0.0, 0.0, 0.0 ] },
			"uBackFaceColor"             : { semantic : "uBackFaceColor",             value : [0.4, 0.3, 0.3, 0.0] },
			"uColorID"                   : { semantic : "uColorID",                   value : [1.0, 0.5, 0.0, 1.0] },
			"uPointSize"                 : { semantic : "uPointSize",                 value : 1.0 },
			"uMode"                      : { semantic : "uMode",                      value : 1.0 }
		}
	});

	return technique;
},

// single-color barely-shaded technique for PLY spot and planes rendering
_createColorShadedTechnique : function () {
	var gl = this.ui.gl;
	var technique = new SglTechnique(gl, {
		program  : this._createColorShadedProgram(),
		vertexStreams : {
			"aNormal"    : [ 0.0, 0.0, 0.0 ],
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
			attribute vec4 aColor;                                                \n\
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
				gl_FragColor = uLineColor;                                     \n\
			}                                                                     \n\
		",
		vertexStreams : {
			"aNormal" : [ 0.0, 0.0, 0.0 ],
			"aColor"  : [ 0.8, 0.8, 0.8, 1.0 ]
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
			uniform   float uPointSize;  				                          \n\
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
				gl_PointSize = uPointSize;				 					 	  \n\
			}                                                                     \n\
		",
		fragmentShader : "\
		#extension GL_EXT_frag_depth : enable									  \n\
		precision highp float;													  \n\
																				  \n\
			uniform   vec4 uColorID;											  \n\
			uniform   float uZOff;												  \n\
																				  \n\
			varying   vec4 vColor;                                                \n\
																				  \n\
			void main(void)                                                       \n\
			{                                                                     \n\
				gl_FragColor = uColorID;                                          \n\
				gl_FragDepthEXT = gl_FragCoord.z - uZOff;						  \n\
			}                                                                     \n\
		",
		vertexStreams : {
			"aNormal" : [ 0.0, 0.0, 0.0 ],
			"aColor"  : [ 0.8, 0.8, 0.8, 1.0 ]
		},
		globals : {
			"uWorldViewProjectionMatrix" : { semantic : "uWorldViewProjectionMatrix", value : SglMat4.identity() },
			"uColorID"                   : { semantic : "uColorID",                   value : [1.0, 0.5, 0.25, 1.0] },
			"uPointSize"                 : { semantic : "uPointSize",                 value : 1.0 },
			"uZOff"                      : { semantic : "uZOff",                      value : 0.0 },
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
	this._sceneReady = this._scenePrepare();
	this.repaint();
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
							cursor = spots[spt].cursor;
							if(/*!this._movingLight ||*/ !this._isMeasuring){
								this._lastCursor = document.getElementById(this.ui.canvas.id).style.cursor;
								document.getElementById(this.ui.canvas.id).style.cursor = cursor;
							}
							if(this._onLeaveSpot && this._lastPickedSpot!=null)  this._onLeaveSpot(this._lastPickedSpot);
							if(this._onEnterSpot && this._pickedSpot!=null) this._onEnterSpot(this._pickedSpot);
							this.repaint();
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
					if(/*!this._movingLight ||*/ !this._isMeasuring) document.getElementById(this.ui.canvas.id).style.cursor = "default";
					if(this._onLeaveSpot && this._lastPickedSpot!=null) this._onLeaveSpot(this._lastPickedSpot);
					//if(this._onEnterSpot) this._onEnterSpot(this._pickedSpot);
					this._lastPickedSpot = null;
					this.repaint();
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
							this.repaint();
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
				this.repaint();
			}
			this._lastPickedInstance = null;
		}
		this._lastInstanceID = ID;
	}
},

_measureRefresh : function (button, x, y, e) {
//	if(e.target.id!=this.ui.gl.canvas.id) return;
	if(this._isMeasuringDistance){
		this._pickpoint[0] = x;
		this._pickpoint[1] = y;
		var ppoint = this._drawScenePickingXYZ();
		if ((ppoint!=null)&&(this._measurementStage != 2)) {
			this._pointA = ppoint;
			this._measurementStage=2;
			this.repaint();
		}
		else if ((ppoint!=null)&&(this._measurementStage == 2)) {
			this._pointB = ppoint;
			this.measurement = SglVec3.length(SglVec3.sub(this._pointA, this._pointB));
			this._measurementStage=3;
			this.repaint();
			if(this._onEndMeasurement)
				this._onEndMeasurement(this.measurement, [this._pointA[0], this._pointA[1], this._pointA[2]], [this._pointB[0], this._pointB[1], this._pointB[2]]);
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
	this.repaint();
},

_stopMeasurement  : function () {
	this._isMeasuringDistance = false;
	if (!this._isMeasuringPickpoint) this._isMeasuring = this._isMeasuringDistance;
	this._measurementStage = 0; // 0=inactive 1=picking pointA 2=picking pointB 3=measurement ready
	this._pointA = [0.0, 0.0, 0.0];
	this._pointB = [0.0, 0.0, 0.0];
	this.measurement = 0.0;
	this.repaint();
},

_pickpointRefresh : function (button, x, y, e) {
//	if(e.target.id!=this.ui.gl.canvas.id) return;
	if(this._isMeasuringPickpoint){
		this._pickpoint[0] = x;
		this._pickpoint[1] = y;
		var ppoint = this._drawScenePickingXYZ();
		if (ppoint!=null)
		{
			this._pickedPoint = ppoint;
			this._pickValid = true;
			if(this._onEndPickingPoint) this._onEndPickingPoint([this._pickedPoint[0], this._pickedPoint[1], this._pickedPoint[2]]);
			this.repaint();
		}
	}
},

_startPickPoint : function () {
	if (this._isMeasuringPickpoint) return;
	this._isMeasuring = this._isMeasuringPickpoint = true;
	this._pickValid = false;
	this._pickedPoint = [0.0, 0.0, 0.0];
	this.repaint();
},

_stopPickPoint : function () {
	this._isMeasuringPickpoint = false;
	if (!this._isMeasuringDistance) this._isMeasuring = this._isMeasuringPickpoint;
	this._pickValid = false;
	this._pickedPoint = [0.0, 0.0, 0.0];
	this.repaint();
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

	if(space.cameraType == "orthographic")
	{
		//default camera distance in orthographic view is "as large as scene size"
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

	Nexus.beginFrame(this.ui.gl, this.ui.framesPerSecond);
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
	var CurrFacesProgram    = this.facesProgram;
	var CurrPointsProgram   = this.pointsProgram;
	var CurrFacesTechnique  = this.faceTechnique;
	var CurrPointsTechnique = this.pointTechnique;
	var CCProgram          = this.colorShadedProgram;
	var CCTechnique        = this.colorShadedTechnique;
	var lineTechnique      = this.simpleLineTechnique;
	var entitiesTechnique  = this.multiLinesPointsTechnique;
	var meshes    = this._scene.meshes;
	var instances = this._scene.modelInstances;
	var entities  = this._scene.entities;
	var spots     = this._scene.spots;
	var space     = this._scene.space;
	var config    = this._scene.config;
	var bkg       = this._scene.background.color;

	// basic setup, matrices for projection & view
	this._setupDraw();

	// clear buffer
	gl.clearColor(bkg[0], bkg[1], bkg[2], bkg[3]);
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT | gl.STENCIL_BUFFER_BIT);
	gl.enable(gl.DEPTH_TEST);
	
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
		xform.model.push();
		xform.model.multiply(space.transform.matrix);
		xform.model.multiply(instance.transform.matrix);
		xform.model.multiply(mesh.transform.matrix);

		var modelMatrix = SglMat4.identity();
		modelMatrix = SglMat4.mul(modelMatrix, space.transform.matrix);
		modelMatrix = SglMat4.mul(modelMatrix, instance.transform.matrix);
		modelMatrix = SglMat4.mul(modelMatrix, mesh.transform.matrix);
		var thisClipAxis = instance.clippable?this._clipAxis:[0.0, 0.0, 0.0];
		var thisClipPlane = instance.clippable?this._clipPlane:[0.0, 0.0, 0.0, 0.0];
		var thisClipBordersize = config.showClippingBorder?config.clippingBorderSize:0.0;

		var uniforms = {
			"uWorldViewProjectionMatrix" : xform.modelViewProjectionMatrix,
			"uViewSpaceNormalMatrix"     : xform.viewSpaceNormalMatrix,
			"uModelMatrix"               : modelMatrix,
			"uWorldViewMatrix"           : xform.modelViewMatrix,
			"uViewSpaceLightDirection"   : this._lightDirection,
			"uPointSize"                 : config.pointSize,
			"uAlpha"                     : 1.0,
			"uUseSolidColor"             : instance.useSolidColor,
			"uUseLighting"               : space.sceneLighting && instance.useLighting,
			"uBackFaceColor"             : instance.backfaceColor,
			"uSpecularColor"             : instance.specularColor,
			"uSolidColor"                : instance.color,
			"uClipPoint"                 : this._clipPoint,
			"uClipAxis"                  : thisClipAxis,
			"uClipPlane"                 : thisClipPlane,
			"uClipColor"                 : config.clippingBorderColor,
			"uClipColorSize"             : thisClipBordersize
		};

		if(mesh.mType === "nexus") {
			if (!renderable.isReady) continue;

			var nexus = renderable;
			nexus.updateView([0, 0, width, height], xform.projectionMatrix, xform.modelViewMatrix);

			var program;
			if(instance.rendermode=="FILL")
				program = CurrFacesProgram;
			else
				program = CurrPointsProgram;
			program.setUniforms(uniforms);
			program.bind();
				nexus.setPrimitiveMode(instance.rendermode);
				nexus.render();
			program.unbind();
		}
		else if(mesh.mType === "ply") {
			var technique;
			if(instance.rendermode=="FILL")
				technique = CurrFacesTechnique;
			else
				technique = CurrPointsTechnique;
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
		var thisClipPlane = instance.clippable?this._clipPlane:[0.0, 0.0, 0.0, 0.0];
		var thisClipBordersize = config.showClippingBorder?config.clippingBorderSize:0.0;

		var uniforms = {
			"uWorldViewProjectionMatrix" : xform.modelViewProjectionMatrix,
			"uViewSpaceNormalMatrix"     : xform.viewSpaceNormalMatrix,
			"uModelMatrix"               : modelMatrix,
			"uWorldViewMatrix"           : xform.modelViewMatrix,
			"uViewSpaceLightDirection"   : this._lightDirection,
			"uPointSize"                 : config.pointSize,
			"uAlpha"                     : instance.alpha,
			"uUseSolidColor"             : instance.useSolidColor,
			"uUseLighting"               : space.sceneLighting && instance.useLighting,
			"uBackFaceColor"             : instance.backfaceColor,
			"uSpecularColor"             : instance.specularColor,
			"uSolidColor"                : instance.color,
			"uClipPoint"                 : [0.0, 0.0, 0.0],
			"uClipPoint"                 : this._clipPoint,
			"uClipAxis"                  : thisClipAxis,
			"uClipPlane"                 : thisClipPlane,
			"uClipColor"                 : config.clippingBorderColor,
			"uClipColorSize"             : thisClipBordersize
		};

		if(mesh.mType === "nexus") {
			if (!renderable.isReady) continue;

			var nexus = renderable;
			nexus.updateView([0, 0, width, height], xform.projectionMatrix, xform.modelViewMatrix);

			var program;
			if(instance.rendermode=="FILL")
				program = CurrFacesProgram;
			else
				program = CurrPointsProgram;
			program.setUniforms(uniforms);
			program.bind();
				nexus.setPrimitiveMode(instance.rendermode);
				nexus.render();
			program.unbind();
		}
		else if(mesh.mType === "ply") {
			var technique;
			if(instance.rendermode=="FILL")
				technique = CurrFacesTechnique;
			else
				technique = CurrPointsTechnique;
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

		xform.model.pop();
	}

	// draw picked point (if valid)
	if (this._pickValid) {
		// GLstate setup
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

		lineUniforms["uLineColor"] = [config.pickedpointColor[0] * 0.4, config.pickedpointColor[1] * 0.5, config.pickedpointColor[2] * 0.6, 0.5];

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
		xform.model.pop();
	}

	// draw measurement line (if any)
	if (this._measurementStage >= 2) {// 0=inactive 1=picking pointA 2=picking pointB 3=measurement ready
		// GLstate setup
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

		lineUniforms["uLineColor"] = [config.measurementColor[0] * 0.4, config.measurementColor[1] * 0.5, config.measurementColor[2] * 0.6, 0.5];

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
		xform.model.pop();
	}

	// draw entities
	for (var ent in entities) {
		var entity = entities[ent];
		if (!entity.visible) continue;
		if (!entity.renderable) continue;
			
		xform.model.push();
		xform.model.multiply(space.transform.matrix);
		xform.model.multiply(entity.transform.matrix);
		
		var entityUniforms = {
			"uWorldViewProjectionMatrix" : xform.modelViewProjectionMatrix,
			"uPointSize"                 : config.pointSize,
			"uColorID"                   : entity.color,
			"uZOff"                      : entity.zOff,
		};		

		if(entity.useTransparency)
		{
			gl.depthMask(false);
			gl.enable(gl.BLEND);
			gl.blendFunc(gl.SRC_ALPHA, gl.ONE);
		}
		//drawing entity
		renderer.begin();
			renderer.setTechnique(entitiesTechnique);
			if (entity.type == "lines")
				renderer.setPrimitiveMode("LINE");
			else if (entity.type == "points")
				renderer.setPrimitiveMode("POINT");
			else if (entity.type == "triangles")
				renderer.setPrimitiveMode("FILL");
			renderer.setDefaultGlobals();
			renderer.setGlobals(entityUniforms);
			renderer.setModel(entity.renderable);
			renderer.renderModel();
		renderer.end();
		
		if(entity.useTransparency)
		{
			gl.depthMask(true);
			gl.disable(gl.BLEND);
		}
		xform.model.pop();
	}

	// draw transparent spot geometries
	for (var spt in spots) {
		var spot = spots[spt];
		var mesh = meshes[spot.mesh];
		if (!mesh) continue;
		var renderable = mesh.renderable;
		if (!renderable) continue;
		if (!spot.visible) continue;

		// GLstate setup
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
			"uColorID"                   : [spot.color[0], spot.color[1], spot.color[2], (spt == this._pickedSpot)?spot.alphaHigh:spot.alpha]
		}

		if(mesh.mType === "nexus") {
			if (!renderable.isReady) continue;
			var nexus = renderable;
			nexus.updateView([0, 0, width, height], xform.projectionMatrix, xform.modelViewMatrix);

			var program = CCProgram;
			program.setUniforms(uniforms);
			program.bind();
				nexus.setPrimitiveMode(spot.rendermode);
				nexus.render();
			program.unbind();
		}
		else if(mesh.mType === "ply") {
			renderer.begin();
				renderer.setTechnique(CCTechnique);
				renderer.setDefaultGlobals();
				renderer.setPrimitiveMode(spot.rendermode);
				renderer.setGlobals(uniforms);
				renderer.setModel(renderable);
				if(spot.useStencil)
				{
					gl.clear(gl.STENCIL_BUFFER_BIT); //reset stencil
					//first pass
					gl.colorMask(false, false, false, false);
					gl.enable(gl.STENCIL_TEST);
					gl.stencilFunc(gl.ALWAYS, 0, 255);
					gl.stencilOp(gl.KEEP, gl.KEEP, gl.INVERT);
					renderer.renderModel();

					//second pass
					gl.colorMask(true, true, true, true);
					gl.stencilOp(gl.KEEP, gl.KEEP, gl.INVERT); // Don't change the stencil buffer...
					gl.stencilFunc(gl.EQUAL, 1, 0x01); // The stencil buffer contains the shadow values...
					renderer.renderModel();

					gl.disable(gl.STENCIL_TEST);
				}
				else
				{
					renderer.renderModel();
				}
			renderer.end();
		}

		// GLstate cleanup
		gl.disable(gl.BLEND);
		gl.depthMask(true);
		xform.model.pop();
	}

	// draw clipping plane (if any)
	if(config.showClippingPlanes)
	{
		// GLstate setup
		gl.depthMask(false);
		gl.enable(gl.BLEND);
		gl.blendFunc(gl.SRC_ALPHA, gl.ONE);

		if(SglVec3.length([this._clipPlane[0], this._clipPlane[1], this._clipPlane[2]]) > 0.0) {
			var planepoint = [0.0, 0.0, 0.0];

			var k = SglVec3.dot(this._sceneBboxCenter, [this._clipPlane[0], this._clipPlane[1], this._clipPlane[2]]) + this._clipPlane[3];
			planepoint[0] = this._sceneBboxCenter[0] - (this._clipPlane[0] * k);
			planepoint[1] = this._sceneBboxCenter[1] - (this._clipPlane[1] * k);
			planepoint[2] = this._sceneBboxCenter[2] - (this._clipPlane[2] * k);

			var rotm = SglMat4.identity();
			rotm = SglMat4.mul(rotm, SglMat4.rotationAngleAxis(sglDegToRad(this._clipPlaneAH), [0.0, -1.0, 0.0]));
			rotm = SglMat4.mul(rotm, SglMat4.rotationAngleAxis(sglDegToRad(this._clipPlaneAV), [0.0, 0.0, 1.0]));

			var psize = this._sceneBboxDiag;

			xform.model.push();
			xform.model.translate(planepoint);
			xform.model.multiply(rotm);
			xform.model.scale([psize, psize, psize]);

			var QuadUniforms = {
				"uWorldViewProjectionMatrix" : xform.modelViewProjectionMatrix,
				"uViewSpaceNormalMatrix"     : xform.viewSpaceNormalMatrix,
				"uViewSpaceLightDirection"   : this._lightDirection,
				"uColorID"                   : [1.0, 0.0, 1.0, 0.25]
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
	}
	Nexus.endFrame(this.ui.gl);

	// saving image, if necessary
	if(this.isCapturingScreenshot){
	    this.isCapturingScreenshot = false;
		this.screenshotData = this.ui._canvas.toDataURL('image/png',1).replace("image/png", "image/octet-stream");
		if(this._scene.config.autoSaveScreenshot)
		{
			var currentdate = new Date();
			var fName = this._scene.config.screenshotBaseName + currentdate.getHours() + currentdate.getMinutes() + currentdate.getSeconds() + ".png";
			
			if(this.ui._canvas.msToBlob) // IE or EDGEhtml
			{
				console.error("IE and EDGEhtml cannot save images");
				var blob = this.ui._canvas.msToBlob();
				window.navigator.msSaveBlob(blob, fName);
			}
			else // every other browser
			{
				var a  = document.createElement('a');
				a.href = this.screenshotData;
				a.download = fName;
				a.target="_blank";
				a.click();
			}
		}
	}
},

_drawScenePickingXYZ : function () {
	var gl       = this.ui.gl;
	var width    = this.ui.width;
	var height   = this.ui.height;
	var xform    = this.xform;
	var renderer = this.renderer;
	var CurrProgram   = this.utilsProgram;
	var CurrTechnique = this.utilsTechnique;
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
	gl.enable(gl.DEPTH_TEST);
	this.pickFramebuffer.unbind();

	for (var inst in instances) {
		var instance = instances[inst];
		var mesh     = meshes[instance.mesh];
		if (!mesh) continue;
		var renderable = mesh.renderable;
		if (!renderable) continue;
		if (!instance.visible) continue;
		if (!instance.measurable) continue;

		// GLstate setup
		xform.model.push();
		xform.model.multiply(space.transform.matrix);
		xform.model.multiply(instance.transform.matrix);
		xform.model.multiply(mesh.transform.matrix);

		var modelMatrix = SglMat4.identity();
		modelMatrix = SglMat4.mul(modelMatrix, space.transform.matrix);
		modelMatrix = SglMat4.mul(modelMatrix, instance.transform.matrix);
		modelMatrix = SglMat4.mul(modelMatrix, mesh.transform.matrix);
		var thisClipAxis = instance.clippable?this._clipAxis:[0.0, 0.0, 0.0];
		var thisClipPlane = instance.clippable?this._clipPlane:[0.0, 0.0, 0.0, 0.0];

		var uniforms = {
			"uWorldViewProjectionMatrix" : xform.modelViewProjectionMatrix,
			"uModelMatrix"               : modelMatrix,
			"uBackFaceColor"             : instance.backfaceColor,
			"uClipPoint"                 : this._clipPoint,
			"uClipAxis"                  : thisClipAxis,
			"uClipPlane"                 : thisClipPlane,
			"uPointSize"                 : this._scene.config.pointSize,
			"uMode"                      : 1.0
		};

		if(mesh.mType === "nexus") {
			if (!renderable.isReady) continue;
			var nexus = renderable;
			nexus.updateView([0, 0, width, height], xform.projectionMatrix, xform.modelViewMatrix);

			this.pickFramebuffer.bind();

			var program = CurrProgram;
			program.setUniforms(uniforms);
			program.bind();
				nexus.setPrimitiveMode(instance.rendermode);
				nexus.render();
			program.unbind();

			this.pickFramebuffer.unbind();
		}
		else if(mesh.mType === "ply") {
			renderer.begin();
				renderer.setFramebuffer(this.pickFramebuffer);
				renderer.setTechnique(CurrTechnique);
				renderer.setDefaultGlobals();
				renderer.setPrimitiveMode(instance.rendermode);
				renderer.setGlobals(uniforms);
				renderer.setModel(renderable);
				renderer.renderModel();
				renderer.setFramebuffer(null);
			renderer.end();
		}

		// GLstate cleanup
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
	var depth = aa  + ( bb / (255.0)) + ( gg / (255.0*255.0)) + ( rr / (255.0*255.0*255.0));

	var ppointc;

	if((rr==0.0) && (gg==0.0) && (bb==0.0))
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
	var CurrProgram   = this.utilsProgram;
	var CurrTechnique = this.utilsTechnique;
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
	gl.enable(gl.DEPTH_TEST);
	this.pickFramebuffer.unbind();

	for (var inst in instances) {
		var instance = instances[inst];
		var mesh     = meshes[instance.mesh];
		if (!mesh) continue;
		var renderable = mesh.renderable;
		if (!renderable) continue;
		if (!instance.visible) continue;

		// GLstate setup
		xform.model.push();
		xform.model.multiply(space.transform.matrix);
		xform.model.multiply(instance.transform.matrix);
		xform.model.multiply(mesh.transform.matrix);

		var modelMatrix = SglMat4.identity();
		modelMatrix = SglMat4.mul(modelMatrix, space.transform.matrix);
		modelMatrix = SglMat4.mul(modelMatrix, instance.transform.matrix);
		modelMatrix = SglMat4.mul(modelMatrix, mesh.transform.matrix);
		var thisClipAxis = instance.clippable?this._clipAxis:[0.0, 0.0, 0.0];
		var thisClipPlane = instance.clippable?this._clipPlane:[0.0, 0.0, 0.0, 0.0];

		var colorID = this._ID2Color(instance.ID);
		var uniforms = {
			"uWorldViewProjectionMatrix" : xform.modelViewProjectionMatrix,
			"uModelMatrix"               : modelMatrix,
			"uClipPoint"                 : this._clipPoint,
			"uClipAxis"                  : thisClipAxis,
			"uClipPlane"                 : thisClipPlane,
			"uPointSize"                 : this._scene.config.pointSize,
			"uColorID"                   : colorID,
			"uMode"                      : 2.0
		};

		if(mesh.mType === "nexus") {
			if (!renderable.isReady) continue;
			var nexus = renderable;
			nexus.updateView([0, 0, width, height], xform.projectionMatrix, xform.modelViewMatrix);

			this.pickFramebuffer.bind();

			var program = CurrProgram;
			program.setUniforms(uniforms);
			program.bind();
				nexus.setPrimitiveMode(instance.rendermode);
				nexus.render();
			program.unbind();

			this.pickFramebuffer.unbind();
		}
		else if(mesh.mType === "ply") {
			renderer.begin();
				renderer.setFramebuffer(this.pickFramebuffer);
				renderer.setTechnique(CurrTechnique);
				renderer.setDefaultGlobals();
				renderer.setPrimitiveMode(instance.rendermode);
				renderer.setGlobals(uniforms);
				renderer.setModel(renderable);
				renderer.renderModel();
				renderer.setFramebuffer(null);
			renderer.end();
		}

		// GLstate cleanup
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
	var CurrProgram   = this.utilsProgram;
	var CurrTechnique = this.utilsTechnique;
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
	gl.enable(gl.DEPTH_TEST);
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
		xform.model.push();
		xform.model.multiply(space.transform.matrix);
		xform.model.multiply(instance.transform.matrix);
		xform.model.multiply(mesh.transform.matrix);

		var uniforms = {
			"uWorldViewProjectionMatrix" : xform.modelViewProjectionMatrix,
			"uPointSize"                 : this._scene.config.pointSize,
			"uColorID"                   : [0.0, 0.0, 0.0, 0.0],
			"uMode"                      : 2.0
		};

		if(mesh.mType === "nexus") {
			if (!renderable.isReady) continue;
			var nexus = renderable;
			nexus.updateView([0, 0, width, height], xform.projectionMatrix, xform.modelViewMatrix);

			this.pickFramebuffer.bind();

			var program = CurrProgram;
			program.setUniforms(uniforms);
			program.bind();
				nexus.setPrimitiveMode(instance.rendermode);
				nexus.render();
			program.unbind();

			this.pickFramebuffer.unbind();
		}
		else if(mesh.mType === "ply") {
			renderer.begin();
				renderer.setFramebuffer(this.pickFramebuffer);
				renderer.setTechnique(CurrTechnique);
				renderer.setDefaultGlobals();
				renderer.setPrimitiveMode(instance.rendermode);
				renderer.setGlobals(uniforms);
				renderer.setModel(renderable);
				renderer.renderModel();
				renderer.setFramebuffer(null);
			renderer.end();
		}

		// GLstate cleanup
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
		xform.model.push();
		xform.model.multiply(space.transform.matrix);
		xform.model.multiply(spot.transform.matrix);
		xform.model.multiply(mesh.transform.matrix);

		var colorID = this._ID2Color(spot.ID);
		var uniforms = {
			"uWorldViewProjectionMatrix" : xform.modelViewProjectionMatrix,
			"uPointSize"                 : this._scene.config.pointSize,
			"uColorID"                   : colorID,
			"uMode"                      : 2.0
		};

		if(mesh.mType === "nexus") {
			if (!renderable.isReady) continue;
			var nexus = renderable;
			nexus.updateView([0, 0, width, height], xform.projectionMatrix, xform.modelViewMatrix);

			this.pickFramebuffer.bind();

			var program = CurrProgram;
			program.setUniforms(uniforms);
			program.bind();
				nexus.setPrimitiveMode(spot.rendermode);
				nexus.render();
			program.unbind();

			this.pickFramebuffer.unbind();
		}
		else if(mesh.mType === "ply") {
			renderer.begin();
				renderer.setFramebuffer(this.pickFramebuffer);
				renderer.setTechnique(CurrTechnique);
				renderer.setDefaultGlobals();
				renderer.setPrimitiveMode(spot.rendermode);
				renderer.setGlobals(uniforms);
				renderer.setModel(renderable);
				renderer.renderModel();
				renderer.setFramebuffer(null);
			renderer.end();
		}

		// GLstate cleanup
		xform.model.pop();
		gl.depthMask(true);
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

// creates mesh models
_createMeshModels : function () {
	var that = this;
	var gl = this.ui.gl;

	for(var keys = Object.keys(this._scene.meshes), i = keys.length-1; i >= 0; i--) {
		var m = keys[i];

		var mesh = this._scene.meshes[m];

		if (!mesh.url) continue;

		if (this._objectsToProcess == 0) this._testReady();
		else {
			this._objectsToProcess--;

			if(mesh.mType == null)
			{
				var ext = mesh.url.split('.').pop().split(/\#|\?/)[0].toLowerCase();
				if((ext === "nxs") || (ext === "nxz")) 
					mesh.mType = "nexus";
				else if(ext === "ply")
					mesh.mType = "ply";
			}

			if(mesh.mType === "nexus") {
				var nexus_instance = new Nexus.Renderer(gl);
				nexus_instance.onLoad = function () { that._onMeshReady(); };
				nexus_instance.onUpdate = this.ui.postDrawEvent;

				mesh.renderable = nexus_instance;
				nexus_instance.open(mesh.url);
			}
			else if(mesh.mType === "ply") {
				mesh.renderable = null;
				sglRequestBinary(mesh.url, {
					onSuccess : (function(m){ return function (req) { that._onPlyLoaded(req, m, gl); }; })(mesh)
				});
			}
		}
	}
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

	gl.getExtension('EXT_frag_depth');
	gl.clearColor(0.5, 0.5, 0.5, 1.0);
	gl.clearStencil(0);
	gl.depthFunc(gl.LESS);

	// vertex attrib defaults
	gl.vertexAttrib3f(1.0, 0.0, 0.0, 0.0);		//1 aNormal
	gl.vertexAttrib4f(2.0, 0.8, 0.8, 0.8, 1.0);	//2 aColor
	gl.vertexAttrib2f(3.0, 0.0, 0.0);			//3 aTextureCoord
	gl.vertexAttrib1f(4.0, 1.0);				//4 aPointSize

	// scene rendering support data
	this.renderer   = new SglModelRenderer(gl);
	this.xform      = new SglTransformationStack();
	this.viewMatrix = SglMat4.identity();

	// nexus parameters
	this.setNexusTargetError(1.0);
	this.setNexusMinFps(15.0);
	this.setNexusMaxCacheSize(512*(1<<20)); //512MB

	// debug mode
	this._isDebugging = HOP_DEBUGMODE;

	// shaders
	this.installDefaultShaders();

	// screenshot support
	this.isCapturingScreenshot = false;
	this.screenshotData = null;

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

	// scene data
	this._scene         = null;
	this._sceneParsed   = false;
	this._sceneReady    = false;
	this._objectsToProcess = 0;
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

	this._resizable      = true;

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

	this._keycombo = false;

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
	this._clipPlane = [0.0, 0.0, 0.0, 0.0];
	this._sceneBboxMin = [0.0, 0.0, 0.0]
	this._sceneBboxMax = [0.0, 0.0, 0.0];
	this._sceneBboxCenter = [0.0, 0.0, 0.0];
	this._sceneBboxDiag = 0.0;
},

installDefaultShaders : function () {
	this.facesProgram = this._createStandardFacesProgram();
	this.pointsProgram = this._createStandardPointsProgram();
	this.utilsProgram = this._createUtilsProgram();
	this.colorShadedProgram = this._createColorShadedProgram();

	this.faceTechnique = this._createStandardFacesTechnique();
	this.pointTechnique = this._createStandardPointsTechnique();
	this.utilsTechnique = this._createUtilsTechnique();
	this.colorShadedTechnique = this._createColorShadedTechnique();

	this.simpleLineTechnique = this._createSimpleLinetechnique();
	this.multiLinesPointsTechnique = this._createMultiLinesPointstechnique();
},

onDrag : function (button, x, y, e) {
	var ui = this.ui;

	if(this._clickable) this._clickable = false;

	if(this._movingLight && ui.isMouseButtonDown(0)){
		var dxl = (x / (ui.width  - 1)) * 2.0 - 1.0;
		var dyl = (y / (ui.height - 1)) * 2.0 - 1.0;
		this.rotateLight(dxl/2, dyl/2);
		return;
	}

	// if locked trackball, just return. we check AFTER the light-trackball test
	if (this._scene.trackball.locked) return;

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
	if(diff) this.repaint();
},

onMouseMove : function (x, y, e) {
	if(e.target.id!=this.ui.gl.canvas.id) return;
	if(this._onHover)
		if (!this.ui.isDragging(0) && !this.ui.isDragging(1) && !this.ui.isDragging(2)) this._pickingRefresh(x, y);
},

onMouseOut : function (x, y, e) {
	if(this._onHover) this._pickingRefresh(-1,-1);
	this._clickable = false;
},

onMouseButtonDown : function (button, x, y, e) {
	if(this._onHover) this._pickingRefresh(x,y);
	if(button==0) this._clickable = true;
},

onClick : function (button, x, y, e) {
	var xy = this.ui._getMouseClientPos(e);

	this.ui._clickPrevPos = this.ui._clickPos;
	this.ui._clickPos = xy;

	var clickDeltaPos = [this.ui._clickPos[0] - this.ui._clickPrevPos[0], this.ui._clickPos[1] - this.ui._clickPrevPos[1]];
	var clickDeltaTime = this.ui._clickPos[3] - this.ui._clickPrevPos[3];

	var clickDeltaDist = SpiderGL.Math.Vec2.length(clickDeltaPos);

	if (this._clickable) {
		this._pickingRefresh(x, y);

		if(clickDeltaDist <= 30 && clickDeltaTime <= 250) {
			if(this.trackball.recenter){
				var ppoint = this._drawScenePickingXYZ();
				if (ppoint!=null) {
					this.ui.animateRate = 30;
					this.trackball.recenter(ppoint);
					this.repaint();
				}
			}
		}

		if(this._onPickedSpot && this._pickedSpot!=null) this._onPickedSpot(this._pickedSpot);
		if(this._onPickedInstance && this._pickedInstance!=null) this._onPickedInstance(this._pickedInstance);
		if(this._isMeasuringPickpoint) this._pickpointRefresh(0, x, y, e);
		if(this._isMeasuringDistance) this._measureRefresh(0, x, y, e);
	}
	this._clickable = false;
},

onKeyDown : function (key, e) {
	if (e.ctrlKey) {
		if (e.key == 'p') // ctrl-p to save screenshot
		{
			e.preventDefault();
			this.isCapturingScreenshot = true;
			this.repaint();
		}
	}
},

onKeyPress : function (key, e) {
	if(this._isDebugging) { // DEBUGGING-AUTHORING keys
		if (e.charCode == '49') { // key "1" to show nexus patches
			Nexus.Debug.nodes =! Nexus.Debug.nodes;
			this.repaint();
		}
		else if (e.charCode == '50') { // key "2" to toggle camera perspective/orthographic
			this.toggleCameraType();
			this.repaint();
		}
		else if((e.charCode == '80') || (e.charCode == '112')) // key "P" to print trackball
			console.log(this.trackball.getState());
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
		// if locked trackball, just return.
		if (this._scene.trackball.locked) return;
		
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

	if(diff) this.repaint();
},

onAnimate : function (dt) {
	if (this._isSceneReady()) {
		// animate trackball
		if(this.trackball.tick(dt)) {
			this.repaint();
		}
		else {
			this.ui.animateRate = 0;
			if(this._onHover && !this.ui._cursorPos[2]) this._pickingRefresh(this.ui._cursorPos[0], this.ui._cursorPos[1]);
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
		this._objectsToProcess = 0;
		this._objectsToLoad = 0;
		this._stopMeasurement();
		this._stopPickPoint();
		this._clipAxis = [0.0, 0.0, 0.0];
		this._clipPoint = [0.0, 0.0, 0.0];
		this.enableLightTrackball(false);
	}

	// scene parsing
	var scene = this._parseScene(options);
	if (!scene) return;
	this._scene = scene;

	// trackball creation
	this.trackball  = new scene.trackball.type();
	this.trackball.setup(scene.trackball.trackOptions);
	this.trackball.track(SglMat4.identity(), 0.0, 0.0, 0.0);

	// mesh models creation
	this._createMeshModels();

	// point-to-point line model creation
	this._createLineModel();

	// quad models creation
	this._createQuadModels();

	// create a space for other entities
	this._scene.entities = {};

	this._sceneParsed = true;
},

get version() {
	return HOP_VERSION;
},

supportsWebGL : function () {
	return this._supportsWebGL;
},

toggleDebugMode : function () {
	this._isDebugging = !this._isDebugging;
},

repaint : function () {
	this.ui.postDrawEvent();
},

saveScreenshot : function () {
	this.isCapturingScreenshot = true;
	this.repaint();
},

//------entities-------------------
createEntity : function (eName, type, verticesList) {
	// type "points", "lines", "triangles"
	var nEntity = {};
	nEntity.visible = true;
	nEntity.type = type;
	nEntity.renderable = null;
	nEntity.transform = {};
	nEntity.transform.matrix = SglMat4.identity();
	nEntity.color = [1.0, 0.0, 1.0, 1.0];
	nEntity.useTransparency = false;
	nEntity.zOff = 0.0;

	var modelDescriptor = {};
	if(type == "points")
		modelDescriptor.primitives = ["points"];
	else if(type == "lines")
		modelDescriptor.primitives = ["lines"];
	else if(type == "triangles")
		modelDescriptor.primitives = ["triangles"];	
	modelDescriptor.vertices = {};
	modelDescriptor.vertices.position = [];
	modelDescriptor.vertices.normal = [];
	modelDescriptor.vertices.color = {value : [ 1.0, 0.0, 1.0, 1.0 ]};
	var numVerts = verticesList.length;

	for (vInd = 0; vInd < numVerts; vInd++)
	{
		modelDescriptor.vertices.position.push(verticesList[vInd][0]);
		modelDescriptor.vertices.position.push(verticesList[vInd][1]);
		modelDescriptor.vertices.position.push(verticesList[vInd][2]);
		
		modelDescriptor.vertices.normal.push(0.0);
		modelDescriptor.vertices.normal.push(0.0);
		modelDescriptor.vertices.normal.push(0.0);
	}
	var gl = this.ui.gl;
	nEntity.renderable = new SglModel(gl, modelDescriptor);
	
	// setting
	this._scene.entities[eName] = {};
	this._scene.entities[eName] = nEntity;
	return this._scene.entities[eName];
	this.repaint();	
},

deleteEntity : function (eName) {
	delete this._scene.entities[eName];
	this.repaint();	
},

clearEntities : function () {
	this._scene.entities = {};
	this.repaint();
},

//-----------------------------------------------------------------------------
// nexus

setNexusTargetError: function(error) {
	Nexus.setTargetError(this.ui.gl, error);
},

getNexusTargetError: function() {
	return Nexus.getTargetError(this.ui.gl);
},

setNexusMinFps: function(fps) {
	Nexus.setMinFps(this.ui.gl, fps);
},

getNexusMinFps: function() {
	return Nexus.getMinFps(this.ui.gl);
},

setNexusMaxCacheSize: function(size) {
	Nexus.setMaxCacheSize(this.ui.gl, size);
},

getNexusMaxCacheSize: function() {
	return Nexus.getMaxCacheSize(this.ui.gl);
},

//-----------------------------------------------------------------------------
// trackball

resetTrackball : function () {
	this.trackball.reset();
	this.trackball.track(SglMat4.identity(), 0.0, 0.0, 0.0);
	this._lightDirection = HOP_DEFAULTLIGHT; // also reset lighting
	this.repaint();
},

getTrackballPosition : function () {
	return this.trackball.getState();
},

setTrackballPosition : function (newposition) {
	this.trackball.setState(newposition);
	this.repaint();
},

//-----------------------------------------------------------------------------
// camera animations

animateToTrackballPosition : function (newposition, newtime) {
	this.ui.animateRate = 30;
	this.trackball.animateToState(newposition, newtime);
	this.repaint();
},

isAnimate : function () {
	if(this.ui.animateRate > 0) this._animating = true;
	else this._animating = false;
	return this._animating;
},

//-----------------------------------------------------------------------------
// dynamic center/radius mode

setCenterModeFirst : function () {
	this._scene.space.centerMode = "first";
	this.repaint();
},

setCenterModeScene : function () {
	this._scene.space.centerMode = "scene";
	this.repaint();
},

setCenterModeSpecific : function (instancename) {
	if(this._scene.modelInstances[instancename])
	{
		this._scene.space.centerMode = "specific";
		this._scene.space.whichInstanceCenter = instancename;
		this.repaint();
	}
	else
		return "ERROR - No such instance";
},

setCenterModeExplicit : function (newcenter) {
	if((newcenter.constructor === Array)&&(newcenter.length = 3)&&(isFinite(String(newcenter[0])))&&(isFinite(String(newcenter[1])))&&(isFinite(String(newcenter[2]))))
	{
		this._scene.space.centerMode = "explicit";
		this._scene.space.explicitCenter = newcenter;
		this.repaint();
	}
	else
		return "ERROR - Not a point";
},

setRadiusModeFirst : function () {
	this._scene.space.radiusMode = "first";
	this.repaint();
},

setRadiusModeScene : function () {
	this._scene.space.radiusMode = "scene";
	this.repaint();
},

setRadiusModeSpecific : function (instancename) {
	if(this._scene.modelInstances[instancename])
	{
		this._scene.space.radiusMode = "specific";
		this._scene.space.whichInstanceRadius = instancename;
		this.repaint();
	}
	else
		return "ERROR - No such instance";
},

setRadiusModeExplicit : function (newradius) {
	if((isFinite(String(newradius)))&&(newradius>0.0))
	{
		this._scene.space.radiusMode = "explicit";
		this._scene.space.explicitRadius = newradius;
		this.repaint();
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
		this.repaint();
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
		this.repaint();
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
		this.repaint();
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
		this.repaint();
},

isInstanceSolidColorEnabledByName : function (name) {
	var solidcolor = false;
	var instances = this._scene.modelInstances;

	if(!name || name==HOP_ALL) {
		for (var inst in instances) {
			if(instances[inst].useSolidColor){
				solidcolor = true;
				return solidcolor;
			}
		}
	}
	else {
		if(instances[name]) { // if an instance with that name exists
			if(instances[name].useSolidColor){
				solidcolor = true;
				return solidcolor;
			}
		 }
	}
	return solidcolor;
},

isInstanceSolidColorEnabled : function (tag) {
	var solidcolor = false;
	var instances = this._scene.modelInstances;

	for (var inst in instances) {
		if(!tag || tag==HOP_ALL){
			if(instances[inst].useSolidColor){
				solidcolor = true;
				return solidcolor;
			}
		}
		else{
			for (var tg in instances[inst].tags){
				if(instances[inst].tags[tg] == tag){
					if(instances[inst].useSolidColor){
						solidcolor = true;
						return solidcolor;
					}
				 }
			}
		}
	}
	return solidcolor;
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
		this.repaint();
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
		this.repaint();
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
		this.repaint();
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
		this.repaint();
},


isInstanceTransparencyEnabledByName : function (name) {
	var transparency = false;
	var instances = this._scene.modelInstances;

	if(!name || name==HOP_ALL) {
		for (var inst in instances) {
			if(instances[inst].useTransparency){
				transparency = true;
				return transparency;
			}
		}
	}
	else {
		if(instances[name]) { // if an instance with that name exists
			if(instances[name].useTransparency){
				transparency = true;
				return transparency;
			}
		 }
	}
	return transparency;
},

isInstanceTransparencyEnabled : function (tag) {
	var transparency = false;
	var instances = this._scene.modelInstances;

	for (var inst in instances) {
		if(!tag || tag==HOP_ALL){
			if(instances[inst].useTransparency){
				transparency = true;
				return transparency;
			}
		}
		else{
			for (var tg in instances[inst].tags){
				if(instances[inst].tags[tg] == tag){
					if(instances[inst].useTransparency){
						transparency = true;
						return transparency;
					}
				 }
			}
		}
	}
	return transparency;
},

//-----------------------------------------------------------------------------
// instance shading
//----specular

setInstanceSpecularityByName : function (name, color, hardness, redraw) {
	var instances = this._scene.modelInstances;

	if(name == HOP_ALL) {
		for (var inst in instances)
			instances[inst].specularColor = [color[0], color[1], color[2], hardness];
	}
	else {
		if(instances[name]) // if an instance with that name exists
			instances[name].specularColor = [color[0], color[1], color[2], hardness];
	}
	if(redraw)
		this.repaint();
},

setInstanceSpecularity : function (tag, color, hardness, redraw) {
	var instances = this._scene.modelInstances;

	for (var inst in instances) {
		if(tag == HOP_ALL) {
			instances[inst].specularColor = [color[0], color[1], color[2], hardness];
		}
		else {
			for (var tg in instances[inst].tags){
				if(instances[inst].tags[tg] == tag)
					instances[inst].specularColor = [color[0], color[1], color[2], hardness];
			}
		}
	}
	if(redraw)
		this.repaint();
},

//----backface

setInstanceBackfaceByName : function (name, color, mode, redraw) {
	var instances = this._scene.modelInstances;
	var modecode = 0.0;
	if (mode == "tint") modecode = 0.0;
	else if (mode == "fill") modecode = 1.0;
	else if (mode == "cull") modecode = 2.0;

	if(name == HOP_ALL) {
		for (var inst in instances)
			instances[inst].backfaceColor = [color[0], color[1], color[2], modecode];
	}
	else {
		if(instances[name]) // if an instance with that name exists
			instances[name].backfaceColor = [color[0], color[1], color[2], modecode];
	}
	if(redraw)
		this.repaint();
},

setInstanceBackface : function (tag, color, mode, redraw) {
	var instances = this._scene.modelInstances;
	var modecode = 0.0;
	if (mode == "tint") modecode = 0.0;
	else if (mode == "fill") modecode = 1.0;
	else if (mode == "cull") modecode = 2.0;

	for (var inst in instances) {
		if(tag == HOP_ALL) {
			instances[inst].backfaceColor = [color[0], color[1], color[2], modecode];
		}
		else {
			for (var tg in instances[inst].tags){
				if(instances[inst].tags[tg] == tag)
					instances[inst].backfaceColor = [color[0], color[1], color[2], modecode];
			}
		}
	}
	if(redraw)
		this.repaint();
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
		this.repaint();
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
		this.repaint();
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
		this.repaint();
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
		this.repaint();
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
		this.repaint();
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
		this.repaint();
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
		this.repaint();
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
		this.repaint();
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
	this.repaint();
},

setClippingXYZ: function(cx, cy, cz) {
	this._calculateBounding();
	this._clipAxis = [cx,cy,cz];
	this.repaint();
},

setClippingX: function(cx) {
	this._calculateBounding();
	this._clipAxis[0] = cx;
	this.repaint();
},
setClippingY: function(cy) {
	this._calculateBounding();
	this._clipAxis[1] = cy;
	this.repaint();
},
setClippingZ: function(cz) {
	this._calculateBounding();
	this._clipAxis[2] = cz;
	this.repaint();
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
	this.repaint();
},

setClippingPointXabs: function(clx) {
	this._calculateBounding();
	this._clipPoint[0] = clx;
	this.repaint();
},
setClippingPointYabs: function(cly) {
	this._calculateBounding();
	this._clipPoint[1] = cly;
	this.repaint();
},
setClippingPointZabs: function(clz) {
	this._calculateBounding();
	this._clipPoint[2] = clz;
	this.repaint();
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
	this.repaint();
},

setClippingPointX: function(clx) {
	var nClipPoint = 0.0;
	this._calculateBounding();
	if(clx<0.0) clx=0.0; else if(clx>1.0) clx=1.0;
	nClipPoint = this._sceneBboxMin[0] + clx * (this._sceneBboxMax[0] - this._sceneBboxMin[0]);
	this._clipPoint[0] = nClipPoint;
	this.repaint();
},
setClippingPointY: function(cly) {
	var nClipPoint = 0.0;
	this._calculateBounding();
	if(cly<0.0) cly=0.0; else if(cly>1.0) cly=1.0;
	nClipPoint = this._sceneBboxMin[1] + cly * (this._sceneBboxMax[1] - this._sceneBboxMin[1]);
	this._clipPoint[1] = nClipPoint;
	this.repaint();
},
setClippingPointZ: function(clz) {
	var nClipPoint = 0.0;
	this._calculateBounding();
	if(clz<0.0) clz=0.0; else if(clz>1.0) clz=1.0;
	nClipPoint = this._sceneBboxMin[2] + clz * (this._sceneBboxMax[2] - this._sceneBboxMin[2]);
	this._clipPoint[2] = nClipPoint;
	this.repaint();
},

_calculateBounding: function() {
	var meshes    = this._scene.meshes;
	var instances = this._scene.modelInstances;
	this._sceneBboxMin = SglVec3.maxNumber();
	this._sceneBboxMax = SglVec3.minNumber();
	this._sceneBboxCenter = [0.0, 0.0, 0.0];
	this._sceneBboxDiag = 0.0;
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

	this._sceneBboxDiag = SglVec3.length([ this._sceneBboxMax[0]-this._sceneBboxMin[0], this._sceneBboxMax[1]-this._sceneBboxMin[1], this._sceneBboxMax[2]-this._sceneBboxMin[2]]);
},

setClippingRendermode: function(showPlanes, showBorder, borderSize, borderColor) {
	this._calculateBounding();
	this._scene.config.showClippingPlanes = showPlanes;
	this._scene.config.showClippingBorder = showBorder;
	if(borderSize>0.0)
		this._scene.config.clippingBorderSize = borderSize;
	if(borderColor)
		this._scene.config.clippingBorderColor = borderColor;
	this.repaint();
},

getClippingRendermode: function() {
	var rendermode = [this._scene.config.showClippingPlanes, this._scene.config.showClippingBorder, this._scene.config.clippingBorderSize, this._scene.config.clippingBorderColor];
	return rendermode;
},

resetClippingPlane : function () {
	this._calculateBounding();
	this._clipPlane = [0.0, 0.0, 0.0, 0.0];
	this.repaint();
},

setClippingPlaneExplicit : function (axis, offset) {
	this._calculateBounding();
	this._clipPlane = [axis[0], axis[1], axis[2], offset];
	this.repaint();
},

setClippingPlane : function (angleH, angleV, sign, delta, deltaabs) {
	this._calculateBounding();
	var axis;
	var m = SglMat4.identity();
	this._clipPlaneAH = angleH;
	this._clipPlaneAV = angleV;

	// horizontal angle
	m = SglMat4.mul(m, SglMat4.rotationAngleAxis(sglDegToRad(angleH), [0.0, -1.0, 0.0]));
	// vertical angle
	m = SglMat4.mul(m, SglMat4.rotationAngleAxis(sglDegToRad(angleV), [0.0, 0.0, 1.0]));

	axis = [sign*1.0, 0.0, 0.0, 1.0];
	axis = SglMat4.mul4(m, axis);

	var sceneOff = (this._sceneBboxDiag / 2.0) * (delta / 100.0);
	if(typeof deltaabs !== "undefined")
		sceneOff = deltaabs;
	var position = [this._sceneBboxCenter[0] + (axis[0] * sceneOff), this._sceneBboxCenter[1] + (axis[1] * sceneOff), this._sceneBboxCenter[2] + (axis[2] * sceneOff)];
	sceneOff = SglVec3.dot([axis[0], axis[1], axis[2]], position);

	this._clipPlane = [axis[0], axis[1], axis[2], -sceneOff];
	this.repaint();
},

//-----------------------------------------------------------------------------
// zoom

zoomIn: function() {
	this.onMouseWheel(1);
},

zoomOut: function() {
	this.onMouseWheel(-1);
},

//-----------------------------------------------------------------------------
// light

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
	this.repaint();
},

enableLightTrackball: function(on) {
	this._movingLight = on;
	if(on && !this._scene.space.sceneLighting) this._scene.space.sceneLighting = on;
	this.repaint();
},

isLightTrackballEnabled: function() {
	return this._movingLight;
},

//-----------------------------------------------------------------------------
// onHover

enableOnHover: function(on) {
	this._onHover = on;
},

isOnHoverEnabled: function() {
	return this._onHover;
},

//-----------------------------------------------------------------------------
// linear measure

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
// point measure

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
// measurements

isAnyMeasurementEnabled: function() {
	return this._isMeasuring;
},

//-----------------------------------------------------------------------------
// camera type

toggleCameraType: function() {
	if(this._scene.space.cameraType == "orthographic")
		this._scene.space.cameraType = "perspective"
	else
		this._scene.space.cameraType = "orthographic"

	this.repaint();
},

setCameraPerspective: function() {
	this._scene.space.cameraType = "perspective";
	this.repaint();
},

setCameraOrthographic: function() {
	this._scene.space.cameraType = "orthographic";
	this.repaint();
},

getCameraType : function () {
	return this._scene.space.cameraType;
},

//-----------------------------------------------------------------------------
// trackball lock

toggleTrackballLock: function() {
	this._scene.trackball.locked = !this._scene.trackball.locked;
},

setTrackballLock: function(newState) {
	this._scene.trackball.locked = newState;
},

isTrackballLockEnabled: function() {
	return this._scene.trackball.locked;
},

//-----------------------------------------------------------------------------
// lighting

enableSceneLighting: function(on) {
	this._scene.space.sceneLighting = on;

	if(!on && this._movingLight) this._movingLight = on;

	this.repaint();
},

isSceneLightingEnabled: function() {
	return this._scene.space.sceneLighting;
},

setInstanceLightingByName : function (name, newState, redraw) {
	var instances = this._scene.modelInstances;

	if(name == HOP_ALL) {
		for (var inst in instances)
			instances[inst].useLighting = newState;
	}
	else {
		if(instances[name]) // if an instance with that name exists
			instances[name].useLighting = newState;
	}
	if(redraw)
		this.repaint();
},

setInstanceLighting : function (tag, newState, redraw) {
	var instances = this._scene.modelInstances;

	for (var inst in instances) {
		if(tag == HOP_ALL) {
			instances[inst].useLighting = newState;
		}
		else {
			for (var tg in instances[inst].tags){
				if(instances[inst].tags[tg] == tag)
					instances[inst].useLighting = newState;
			}
		}
	}
	if(redraw)
		this.repaint();
},

toggleInstanceLightingByName : function (name, redraw) {
	var instances = this._scene.modelInstances;

	if(name == HOP_ALL) {
		for (var inst in instances)
			instances[inst].useLighting = !instances[inst].useLighting;
	}
	else {
		if(instances[name]) // if an instance with that name exists
			instances[name].useLighting = !instances[name].useLighting;
	}
	if(redraw)
		this.repaint();
},

toggleInstanceLighting : function (tag, redraw) {
	var instances = this._scene.modelInstances;

	for (var inst in instances) {
		if(tag == HOP_ALL)
		{
			instances[inst].useLighting = !instances[inst].useLighting;
		}
		else
		{
			for (var tg in instances[inst].tags){
				if(instances[inst].tags[tg] == tag)
					instances[inst].useLighting = !instances[inst].useLighting;
			}
		}
	}
	if(redraw)
		this.repaint();
},

isInstanceLightingEnabledByName : function (name) {
	var Lighting = false;
	var instances = this._scene.modelInstances;

	if(!name || name==HOP_ALL) {
		for (var inst in instances) {
			if(instances[inst].useLighting){
				Lighting = true;
				return Lighting;
			}
		}
	}
	else {
		if(instances[name]) { // if an instance with that name exists
			if(instances[name].useLighting){
				Lighting = true;
				return Lighting;
			}
		 }
	}
	return Lighting;
},

isInstanceLightingEnabled : function (tag) {
	var Lighting = false;
	var instances = this._scene.modelInstances;

	for (var inst in instances) {
		if(!tag || tag==HOP_ALL){
			if(instances[inst].useLighting){
				Lighting = true;
				return Lighting;
			}
		}
		else{
			for (var tg in instances[inst].tags){
				if(instances[inst].tags[tg] == tag){
					if(instances[inst].useLighting){
						Lighting = true;
						return Lighting;
					}
				 }
			}
		}
	}
	return Lighting;
}

}; // Presenter.prototype END
