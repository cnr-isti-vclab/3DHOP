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

SpiderGL.openNamespace();

//----------------------------------------------------------------------------------------
// CONSTANTS
//----------------------------------------------------------------------------------------
// SglTrackball
//----------------------------------------------------------------------------------------
const SGL_TRACKBALL_NO_ACTION = 0;
const SGL_TRACKBALL_ROTATE    = 1;
const SGL_TRACKBALL_PAN       = 2;
const SGL_TRACKBALL_DOLLY     = 3; 
const SGL_TRACKBALL_SCALE     = 4;
//----------------------------------------------------------------------------------------
// Selectors
//----------------------------------------------------------------------------------------
const HOP_ALL     = 256;
//----------------------------------------------------------------------------------------

Presenter = function (canvas) {
	this._isDebugging      = false;

	this._lightDirection   = [ 0, 0, -1];

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
			space          : this._parseSpace(options.space)			
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
            mesh      : null,
            color     : [ 1.0, 1.0, 1.0 ],
			cursor    : "default",
			ID        : 0,
            transform : null,
            hotspots  : { },
			visible   : true,
			tags      : [ ]
		}, options);
		r.transform = this._parseTransform(r.transform);
		r.ID = this._instancesProgressiveID;
		this._instancesProgressiveID += 1;
		for (var m in r.hotspots) {
			r.hotspots[m] = this._parseHotSpot(r.hotspots[m]);
		}
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
            mesh      : null,
            color     : [ 0.8, 0.2, 0.2, 0.2 ],
			cursor    : "pointer",
			ID        : 0,
            transform : null,
			visible    : true,
			tags      : [ ]
		}, options);
		r.transform = this._parseTransform(r.transform);
		r.ID = this._spotsProgressiveID;
		if (!r.color[3]) r.color[3] = 0.2;
		r.alpha = r.color[3];
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
			cameraFOV        : 60.0,
			cameraNearFar    : [0.1, 10.0],
		}, options);
		if(r.cameraFOV < 2.0) r.cameraFOV=2.0;
		if(r.cameraFOV > 88.0) r.cameraFOV=88.0;
		return r;
	},	
	
	_parseTransform : function (options) {
		var r = sglGetDefaultObject({
			matrix : SglMat4.identity()
		}, options);
		return r;
	},

	_parseHotSpot : function (options) {
		var r = sglGetDefaultObject({
			textureQuad : null,
			transform   : null
		}, options);
		r.transform = this._parseTransform(r.transform);
		return r;
	},
	//----------------------------------------------------------------------------------------
	//SHADERS RELATED FUNCTIONS
	//----------------------------------------------------------------------------------------
	// standard program for NXS rendering
	_createStandardNXSProgram : function () {	
		var gl = this.ui.gl;
        var nxsVertexShader = new SglVertexShader(gl, "\
            precision highp float;                                                \n\
                                                                                  \n\
            uniform   mat4 uWorldViewProjectionMatrix;                            \n\
            uniform   mat3 uViewSpaceNormalMatrix;                                \n\
                                                                                  \n\
            attribute vec3 aPosition;                                             \n\
            attribute vec3 aNormal;                                               \n\
            attribute vec3 aColor;                                                \n\
                                                                                  \n\
            varying   vec3 vNormal;                                               \n\
            varying   vec3 vColor;                                                \n\
                                                                                  \n\
            void main(void)                                                       \n\
            {                                                                     \n\
                vNormal     = uViewSpaceNormalMatrix * aNormal;                   \n\
                vColor      = aColor;                                             \n\
                                                                                  \n\
                gl_Position = uWorldViewProjectionMatrix * vec4(aPosition, 1.0);  \n\
            }                                                                     \n\
        ");
		if(this._isDebugging)
			console.log("Vertex Shader Log:\n" + vertexShader.log);

        var nxsFragmentShader = new SglFragmentShader(gl, "\
            precision highp float;                                                \n\
                                                                                  \n\
            uniform   vec3 uViewSpaceLightDirection;                              \n\
                                                                                  \n\
            varying   vec3 vNormal;                                               \n\
            varying   vec3 vColor;                                                \n\
                                                                                  \n\
            void main(void)                                                       \n\
            {                                                                     \n\
                vec3  normal  = normalize(vNormal);                               \n\
                float nDotL   = dot(normal, -uViewSpaceLightDirection);           \n\
                float lambert = max(0.0, nDotL);                                  \n\
                vec3  diffuse = vColor * lambert;                                 \n\
                                                                                  \n\
                gl_FragColor  = vec4(diffuse, 1.0);                               \n\
            }                                                                     \n\
        ");
		if(this._isDebugging)
			console.log("Fragment Shader Log:\n" + fragmentShader.log);

        var program = new SglProgram(gl, {
            shaders    : [
                nxsVertexShader,
                nxsFragmentShader
            ],
            attributes : {
                "aPosition" : 0,
                "aNormal"   : 1,
                "aColor"    : 2
            },
            uniforms   : {
                "uWorldViewProjectionMatrix" : SglMat4.identity(),
                "uViewSpaceNormalMatrix"     : SglMat3.identity(),
                "uViewSpaceLightDirection"   : this._lightDirection
            }
        });
		if(this._isDebugging)
			console.log("Program Log:\n" + program.log);	
	
		return program;
	},	

	// color coded ID program for NXS rendering
	_createColorCodedIDNXSProgram : function () {	
		var gl = this.ui.gl;
        var nxsVertexShader = new SglVertexShader(gl, "\
            precision highp float;                                                \n\
                                                                                  \n\
            uniform   mat4 uWorldViewProjectionMatrix;                            \n\
                                                                                  \n\
            attribute vec3 aPosition;                                             \n\
            attribute vec3 aNormal;                                               \n\
            attribute vec3 aColor;                                                \n\
                                                                                  \n\
            void main(void)                                                       \n\
            {                                                                     \n\
                gl_Position = uWorldViewProjectionMatrix * vec4(aPosition, 1.0);  \n\
            }                                                                     \n\
        ");
		if(this._isDebugging)
			console.log("Vertex Shader Log:\n" + vertexShader.log);

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
			console.log("Fragment Shader Log:\n" + fragmentShader.log);

        var program = new SglProgram(gl, {
            shaders    : [
                nxsVertexShader,
                nxsFragmentShader
            ],
            attributes : {
                "aPosition" : 0,
                "aNormal"   : 1,
                "aColor"    : 2
            },
            uniforms   : {
                "uWorldViewProjectionMatrix" : SglMat4.identity(),
				"uColorID"                   : [1.0, 0.5, 0.0, 1.0]
            }
        });
		if(this._isDebugging)
			console.log("Program Log:\n" + program.log);	
	
		return program;
	},	

	// single-color barely-shaded program for NXS rendering
	_createColorShadedNXSProgram : function () {	
		var gl = this.ui.gl;
        var nxsVertexShader = new SglVertexShader(gl, "\
            precision highp float;                                                \n\
                                                                                  \n\
            uniform   mat4 uWorldViewProjectionMatrix;                            \n\
            uniform   mat3 uViewSpaceNormalMatrix;                                \n\
                                                                                  \n\
            attribute vec3 aPosition;                                             \n\
            attribute vec3 aNormal;                                               \n\
            attribute vec3 aColor;                                                \n\
                                                                                  \n\
            varying   vec3 vNormal;                                               \n\
                                                                                  \n\
            void main(void)                                                       \n\
            {                                                                     \n\
                vNormal     = uViewSpaceNormalMatrix * aNormal;                   \n\
                gl_Position = uWorldViewProjectionMatrix * vec4(aPosition, 1.0);  \n\
            }                                                                     \n\
        ");
		if(this._isDebugging)
			console.log("Vertex Shader Log:\n" + vertexShader.log);

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
                vec3  normal  = normalize(vNormal);                               \n\
                float nDotL   = dot(normal, -uViewSpaceLightDirection);           \n\
				float lambert   = max(-nDotL, nDotL);                             \n\
																				  \n\
				vec3  baseColor = vec3(uColorID[0], uColorID[1], uColorID[2]);    \n\
				vec3  diffuse   = (baseColor*0.5) + (baseColor * lambert * 0.5);  \n\
                                                                                  \n\
                gl_FragColor  = vec4(diffuse, uColorID[3]);                       \n\
            }                                                                     \n\
        ");
		if(this._isDebugging)
			console.log("Fragment Shader Log:\n" + fragmentShader.log);

        var program = new SglProgram(gl, {
            shaders    : [
                nxsVertexShader,
                nxsFragmentShader
            ],
            attributes : {
                "aPosition" : 0,
                "aNormal"   : 1,
                "aColor"    : 2
            },
            uniforms   : {
                "uWorldViewProjectionMatrix" : SglMat4.identity(),
                "uViewSpaceNormalMatrix"     : SglMat3.identity(),
                "uViewSpaceLightDirection"   : this._lightDirection
            }
        });
		if(this._isDebugging)
			console.log("Program Log:\n" + program.log);	
	
		return program;
	},

	// standard technique for PLY rendering
	_createStandardPLYtechnique : function () {
		var gl = this.ui.gl;
		var technique = new SglTechnique(gl, {
			vertexShader : "\
				precision highp float;                                                \n\
																					  \n\
				uniform   mat4 uWorldViewProjectionMatrix;                            \n\
				uniform   mat3 uViewSpaceNormalMatrix;                                \n\
																					  \n\
				attribute vec3 aPosition;                                             \n\
				attribute vec3 aNormal;                                               \n\
				attribute vec3 aColor;                                                \n\
																					  \n\
				varying   vec3 vNormal;                                               \n\
				varying   vec3 vColor;                                                \n\
																					  \n\
				void main(void)                                                       \n\
				{                                                                     \n\
					vNormal     = uViewSpaceNormalMatrix * aNormal;                   \n\
					vColor      = aColor;                                             \n\
																					  \n\
					gl_Position = uWorldViewProjectionMatrix * vec4(aPosition, 1.0);  \n\
				}                                                                     \n\
			",
			fragmentShader : "\
				precision highp float;                                                \n\
																					  \n\
				uniform   vec3      uViewSpaceLightDirection;                         \n\
																					  \n\
				varying   vec3 vNormal;                                               \n\
				varying   vec3 vColor;                                                \n\
																					  \n\
				void main(void)                                                       \n\
				{                                                                     \n\
					vec3  normal    = normalize(vNormal);                             \n\
					float nDotL     = dot(normal, -uViewSpaceLightDirection);         \n\
					float lambert   = max(0.0, nDotL);                                \n\
																					  \n\
					vec3  baseColor = vec3(1.0);                                      \n\
					vec3  diffuse   = vColor * baseColor * lambert;                   \n\
																					  \n\
					gl_FragColor    = vec4(diffuse, 1.0);                             \n\
				}                                                                     \n\
			",
			vertexStreams : {
				"aNormal" : [ 0.0, 0.0, 1.0, 0.0 ],
				"aColor"  : [ 0.4, 0.4, 0.8, 1.0 ]
			},
			globals : {
				"uWorldViewProjectionMatrix" : { semantic : "uWorldViewProjectionMatrix", value : SglMat4.identity() },
				"uViewSpaceNormalMatrix"     : { semantic : "uViewSpaceNormalMatrix",     value : SglMat3.identity() },
				"uViewSpaceLightDirection"   : { semantic : "uViewSpaceLightDirection",   value : [ 0.0, 0.0, -1.0 ] }
			}
		});
		
		return technique;
	},

	// color coded ID technique for PLY rendering
	_createColorCodedIDPLYtechnique : function () {
		var gl = this.ui.gl;
		var technique = new SglTechnique(gl, {
			vertexShader : "\
				precision highp float;                                                \n\
																					  \n\
				uniform   mat4 uWorldViewProjectionMatrix;                            \n\
																					  \n\
				attribute vec3 aPosition;                                             \n\
				attribute vec3 aNormal;                                               \n\
				attribute vec3 aColor;                                                \n\
																					  \n\
				void main(void)                                                       \n\
				{                                                                     \n\
					gl_Position = uWorldViewProjectionMatrix * vec4(aPosition, 1.0);  \n\
				}                                                                     \n\
			",
			fragmentShader : "\
				precision highp float;                                                \n\
																					  \n\
                uniform   vec4 uColorID;                                              \n\
																					  \n\
				void main(void)                                                       \n\
				{                                                                     \n\
					gl_FragColor    = uColorID;                                       \n\
				}                                                                     \n\
			",
			vertexStreams : {
				"aNormal" : [ 0.0, 0.0, 1.0, 0.0 ],
				"aColor"  : [ 0.4, 0.4, 0.8, 1.0 ]
			},
			globals : {
				"uWorldViewProjectionMatrix" : { semantic : "uWorldViewProjectionMatrix", value : SglMat4.identity() },
				"uColorID"                   : { semantic : "uColorID",   value : [1.0, 0.5, 0.25, 1.0] }
			}
		});
		
		return technique;
	},

	// single-color barely-shaded technique for PLY rendering
	_createColorShadedPLYtechnique : function () {
		var gl = this.ui.gl;
		var technique = new SglTechnique(gl, {
			vertexShader : "\
				precision highp float;                                                \n\
																					  \n\
				uniform   mat4 uWorldViewProjectionMatrix;                            \n\
				uniform   mat3 uViewSpaceNormalMatrix;                                \n\
																					  \n\
				attribute vec3 aPosition;                                             \n\
				attribute vec3 aNormal;                                               \n\
				attribute vec3 aColor;                                                \n\
																					  \n\
				varying   vec3 vNormal;                                               \n\
																					  \n\
				void main(void)                                                       \n\
				{                                                                     \n\
					vNormal     = uViewSpaceNormalMatrix * aNormal;                   \n\
					gl_Position = uWorldViewProjectionMatrix * vec4(aPosition, 1.0);  \n\
				}                                                                     \n\
			",
			fragmentShader : "\
				precision highp float;                                                \n\
																					  \n\
                uniform   vec4 uColorID;                                              \n\
				uniform   vec3 uViewSpaceLightDirection;                              \n\
																					  \n\
				varying   vec3 vNormal;                                               \n\
				varying   vec3 vColor;                                                \n\
																					  \n\
				void main(void)                                                       \n\
				{                                                                     \n\
					vec3  normal    = normalize(vNormal);                             \n\
					float nDotL     = dot(normal, -uViewSpaceLightDirection);         \n\
					float lambert   = max(-nDotL, nDotL);                             \n\
																					  \n\
					vec3  baseColor = vec3(uColorID[0], uColorID[1], uColorID[2]);    \n\
					vec3  diffuse   = (baseColor*0.5) + (baseColor * lambert * 0.5);  \n\
																					  \n\
					gl_FragColor    = vec4(diffuse, uColorID[3]);                     \n\
				}                                                                     \n\
			",
			vertexStreams : {
				"aNormal" : [ 0.0, 0.0, 1.0, 0.0 ],
				"aColor"  : [ 0.4, 0.4, 0.8, 1.0 ]
			},
			globals : {
				"uWorldViewProjectionMatrix" : { semantic : "uWorldViewProjectionMatrix", value : SglMat4.identity() },
				"uViewSpaceNormalMatrix"     : { semantic : "uViewSpaceNormalMatrix",     value : SglMat3.identity() },
				"uViewSpaceLightDirection"   : { semantic : "uViewSpaceLightDirection",   value : [ 0.0, 0.0, -1.0 ] },			
				"uColorID"                   : { semantic : "uColorID",   value : [1.0, 0.5, 0.25, 1.0] }
			}
		});
		
		return technique;
	},
	//----------------------------------------------------------------------------------------
	// SUPPORT FUNCTIONS
	//----------------------------------------------------------------------------------------
	_isSceneReady : function () {
		var r = (this._scene && this._sceneParsed && (this._objectsToLoad == 0)); 
		return r;
	},

	_testReady : function () {
		if (this._objectsToLoad != 0) return;

		this.trackball.track(SglMat4.identity(), 0.0, 0.0, 0.0);
		this.ui.postDrawEvent();
	},

	_objectLoaded : function () {
		this._objectsToLoad--;
		this._testReady();
	},

	_onMeshReady : function () {
		this._objectLoaded();
	},

	_onTextureReady : function () {
		this._objectLoaded();
	},

	_onBackgroundReady : function () {
		this._objectLoaded();
	},

	_pickingRefresh: function(x,y) {
		this._pickpoint[0] = x;
		this._pickpoint[1] = y;

		var pickedPixel;
		var ID, cursor;

		if(this._onPickedSpot||this._onEnterSpot||this._onLeaveSpot){
			pickedPixel = this._drawScenePickingSpots();
			ID = this._Color2ID(pickedPixel);
			if(this._lastSpotID != ID){
				var spots = this._scene.spots;
				if(ID != 0){
					for (var spt in spots) {
						if (spots[spt].ID == ID) {
							this._pickedSpot = spt;
							if(this._onHover){
								if(spots[this._lastPickedSpot]) spots[this._lastPickedSpot].alpha = spots[this._lastPickedSpot].color[3];
								spots[this._pickedSpot].alpha = spots[this._pickedSpot].color[3] + 0.2;
								cursor = spots[spt].cursor;
								if(!this._movingLight){
									this._lastCursor = document.getElementById(this.ui.canvas.id).style.cursor;
									document.getElementById(this.ui.canvas.id).style.cursor = cursor;
								}
								this.ui.postDrawEvent();
								if(this._onLeaveSpot && this._lastPickedSpot!="null")  this._onLeaveSpot(this._lastPickedSpot);
								if(this._onEnterSpot && this._pickedSpot!="null") this._onEnterSpot(this._pickedSpot);
							}
							this._lastPickedSpot = spt;
							break;
						}
					}
					this._lastSpotID = ID;
				}
				else{
					this._pickedSpot = "null";
					if(this._onHover){
						if(spots[this._lastPickedSpot]) spots[this._lastPickedSpot].alpha = spots[this._lastPickedSpot].color[3];
						if(!this._movingLight) document.getElementById(this.ui.canvas.id).style.cursor = this._lastCursor;
						this.ui.postDrawEvent();
						if(this._onLeaveSpot && this._lastPickedSpot!="null")  this._onLeaveSpot(this._lastPickedSpot);
						//if(this._onEnterSpot) this._onEnterSpot(this._pickedSpot);
						this._lastPickedSpot = "null";
					}
					this._lastSpotID = ID;
				}
			}
		}

		if(this._onPickedInstance||this._onEnterInstance||this._onLeaveInstance){
			pickedPixel = this._drawScenePickingInstances();
			ID = this._Color2ID(pickedPixel);
			if(this._lastInstanceID == ID) return;
			if(ID != 0){
				var instances = this._scene.modelInstances;
				for (var inst in instances) {
					if (instances[inst].ID == ID) {
						this._pickedInstance = inst;
						if(this._onHover){
							cursor = instances[inst].cursor;
							if(!this._movingLight){
								this._lastCursor = cursor;
								if(this._pickedSpot=="null")document.getElementById(this.ui.canvas.id).style.cursor = cursor;
							}
							if(this._onLeaveInstance && this._lastPickedInstance!="null")  this._onLeaveInstance(this._lastPickedInstance);
							if(this._onEnterInstance && this._pickedInstance!="null") this._onEnterInstance(this._pickedInstance);
						}
						this._lastPickedInstance = inst;
						break;
					}
				}
			}
			else{
				this._pickedInstance = "null";
				if(this._onHover){
					this._lastCursor = "default";
					if(!this._movingLight && this._pickedSpot=="null") document.getElementById(this.ui.canvas.id).style.cursor = "default";
					if(this._onLeaveInstance && this._lastPickedInstance!="null")  this._onLeaveInstance(this._lastPickedInstance);
					//if(this._onEnterInstance) this._onEnterInstance(this._pickedInstance);
				}
				this._lastPickedInstance = "null";
			}
			this._lastInstanceID = ID;
		}
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
				
				instCenter = SglVec4.to3(instCenter);
				
				this.sceneCenter = instCenter;
			}
		}		
		else //if(this._scene.space.centerMode == "first")
		{
			for (var inst in instances) {
				var mesh = meshes[instances[inst].mesh];
				if((mesh)&&(mesh.renderable)){
					var instCenter = SglVec3.to4(mesh.renderable.datasetCenter,1);

					instCenter = SglMat4.mul4(mesh.transform.matrix, instCenter);									  
					instCenter = SglMat4.mul4(instances[inst].transform.matrix, instCenter);
					
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
				
				var scalefactor = SglVec3.length(vector111) / SglVec3.length([1,1,1]);
				
				this.sceneRadiusInv = 1.0 / (radius*scalefactor);			
			}	
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
        var gl       = this.ui.gl;
        var width    = this.ui.width;
        var height   = this.ui.height;
        var xform    = this.xform;		

        gl.viewport(0, 0, width, height);

		// depending on FOV, we set projection params and camera pos accordingly
		var FOV = this._scene.space.cameraFOV;
		var nearP = this._scene.space.cameraNearFar[0];
		var farP = this._scene.space.cameraNearFar[1];
		
        xform.projection.loadIdentity();
        xform.projection.perspective(sglDegToRad(FOV), width/height, nearP, farP);

        xform.view.loadIdentity();
        xform.view.lookAt([0.0, 0.0, 0.0], [0.0, 0.0, -1.0], [0.0, 1.0, 0.0]);
        this.viewMatrix = xform.viewMatrix;

        xform.model.loadIdentity();
        xform.model.multiply(this.trackball.matrix);

		// getting scale/center for scene
		this._setSceneCenterRadius();
		
		// scale to unit box + recenter
		xform.model.scale([this.sceneRadiusInv, this.sceneRadiusInv, this.sceneRadiusInv]);
		xform.model.translate(SglVec3.neg(this.sceneCenter));				
	},

	_ID2Color : function (ID) {
		var intID = ID | 0;
		
		var IDr = intID % 5;
		var IDg = ((intID-IDr) / 5) % 5;
		var IDb = ((((intID-IDr) / 5) - IDg) / 5) % 5;
		
		var colorID = [IDr * 0.2, IDg * 0.2, IDb * 0.2, 1.0];		
		return colorID;
	},

	_Color2ID : function (color) {			
		var IDr =  (((color[0]+2)/255.0) / 0.2)       | 0;
		var IDg = ((((color[1]+2)/255.0) / 0.2) * 5)  | 0;
		var IDb = ((((color[2]+2)/255.0) / 0.2) * 25) | 0;
		
		var ID = (IDr + IDg + IDb) | 0;		
		return ID;
	},

	_onPlyLoaded : function (req,thatmesh,gl) {
		var plyData = req.buffer;
		var modelDescriptor = importPly(plyData);
		thatmesh.renderable = new SglModel(gl, modelDescriptor);
		thatmesh.renderable.boundingBox = modelDescriptor.extra.boundingBox;
		
		// center and radius
		var TMR = thatmesh.renderable;
		TMR.datasetCenter = [0.0, 0.0, 0.0];
		TMR.datasetRadius = 1.0;
		
		TMR.datasetCenter[0] = (TMR.boundingBox.max[0] + TMR.boundingBox.min[0]) / 2.0;
		TMR.datasetCenter[1] = (TMR.boundingBox.max[1] + TMR.boundingBox.min[1]) / 2.0;
		TMR.datasetCenter[2] = (TMR.boundingBox.max[2] + TMR.boundingBox.min[2]) / 2.0;
		
		TMR.datasetRadius = Math.sqrt( Math.pow((TMR.boundingBox.max[0] - TMR.boundingBox.min[0]),2) + 
									   Math.pow((TMR.boundingBox.max[1] - TMR.boundingBox.min[1]),2) +
									   Math.pow((TMR.boundingBox.max[2] - TMR.boundingBox.min[2]),2) ) / 2.0;
									   
		this._onMeshReady();
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
        var CurrProgram   = this.basicNXSProgram;
		var CurrTechnique = this.basicPLYTechnique;
        var CCProgram   = this.colorShadedNXSProgram;
		var CCTechnique = this.colorShadedPLYtechnique;		
		var meshes    = this._scene.meshes;
		var instances = this._scene.modelInstances;
		var spots = this._scene.spots;
		var bkg = this._scene.background.color;
		
		// basic setup, matrices for projection & view
		this._setupDraw();
		
		// clear buffer
        gl.clearColor(bkg[0], bkg[1], bkg[2], bkg[3]);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT | gl.STENCIL_BUFFER_BIT);
		
		// draw solid geometries
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
			// transform using mesh & instance matrices
			xform.model.multiply(instance.transform.matrix);
			xform.model.multiply(mesh.transform.matrix);	

			var uniforms = {
				"uWorldViewProjectionMatrix" : xform.modelViewProjectionMatrix,
				"uViewSpaceNormalMatrix"     : xform.viewSpaceNormalMatrix,
				"uViewSpaceLightDirection"   : this._lightDirection
			};			
			
			if(mesh.isNexus) {
				if (!renderable.isReady) continue;
				var nexus = renderable;
				nexus.modelMatrix      = xform.modelMatrix;
				nexus.viewMatrix       = xform.viewMatrix;
				nexus.projectionMatrix = xform.projectionMatrix;
				nexus.viewport         = [0, 0, width, height];
				
				CurrProgram.bind();				
					CurrProgram.setUniforms(uniforms);
					nexus.begin();
					nexus.render();
					nexus.end();
				CurrProgram.unbind();
			}
			else { //drawing ply
				renderer.begin();
					renderer.setTechnique(CurrTechnique);
					renderer.setDefaultGlobals();
					renderer.setPrimitiveMode("FILL");
					renderer.setGlobals(uniforms);
					renderer.setModel(renderable);
					renderer.renderModel();
				renderer.end();
			}
			
			// GLstate cleanup
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
			//gl.blendFunc(gl.ZERO, gl.SRC_COLOR);
			//gl.blendFunc(gl.ONE, gl.ONE);
			
			xform.model.push();
			// transform using mesh & instance matrices
			xform.model.multiply(spot.transform.matrix);
			xform.model.multiply(mesh.transform.matrix);

			var uniforms = {
				"uWorldViewProjectionMatrix" : xform.modelViewProjectionMatrix,
				"uViewSpaceNormalMatrix"     : xform.viewSpaceNormalMatrix,
				"uViewSpaceLightDirection"   : this._lightDirection,
				"uColorID"                   : [spot.color[0], spot.color[1], spot.color[2], spot.alpha]
			};
			
			if(mesh.isNexus) {
				if (!renderable.isReady) continue;
				var nexus = renderable;
				nexus.modelMatrix      = xform.modelMatrix;
				nexus.viewMatrix       = xform.viewMatrix;
				nexus.projectionMatrix = xform.projectionMatrix;
				nexus.viewport         = [0, 0, width, height];
				
				CCProgram.bind();				
					CurrProgram.setUniforms(uniforms);
					nexus.begin();
					nexus.render();
					nexus.end();
				CCProgram.unbind();
			}
			else { //drawing ply
				renderer.begin();
					renderer.setTechnique(CCTechnique);
					renderer.setDefaultGlobals();
					renderer.setPrimitiveMode("FILL");
					renderer.setGlobals(uniforms);
					renderer.setModel(renderable);
					renderer.renderModel();
				renderer.end();				
			}
			
			// GLstate cleanup
			gl.disable(gl.BLEND);
			gl.depthMask(true);			
			gl.disable(gl.DEPTH_TEST);			
			
			xform.model.pop();			
		}
	},

	_drawScenePickingInstances : function () {
        var gl       = this.ui.gl;
        var width    = this.ui.width;
        var height   = this.ui.height;
        var xform    = this.xform;
		var renderer = this.renderer;		
        var CurrProgram   = this.colorCodedIDNXSProgram;
		var CurrTechnique = this.colorCodedIDPLYtechnique;
		var meshes    = this._scene.meshes;
		var instances = this._scene.modelInstances;
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
			// transform using mesh & instance matrices
			xform.model.push();													
			xform.model.multiply(instance.transform.matrix);
			xform.model.multiply(mesh.transform.matrix);				
			
			var colorID = this._ID2Color(instance.ID);
			var uniforms = {
				"uWorldViewProjectionMatrix" : xform.modelViewProjectionMatrix,
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
				CurrProgram.bind();				
					CurrProgram.setUniforms(uniforms);
					nexus.begin();
					nexus.render();
					nexus.end();
				CurrProgram.unbind();			
				this.pickFramebuffer.unbind();				
			}
			else { //drawing ply
				renderer.begin();
					renderer.setFramebuffer(this.pickFramebuffer);				
					renderer.setTechnique(CurrTechnique);
					renderer.setDefaultGlobals();
					renderer.setPrimitiveMode("FILL");
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
		var CurrTechnique = this.colorCodedIDPLYtechnique;
		var meshes    = this._scene.meshes;
		var spots = this._scene.spots;
		var instances = this._scene.modelInstances;		
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
			// transform using mesh & instance matrices
			xform.model.push();													
			xform.model.multiply(instance.transform.matrix);
			xform.model.multiply(mesh.transform.matrix);				
			
			var uniforms = {
				"uWorldViewProjectionMatrix" : xform.modelViewProjectionMatrix,
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
				CurrProgram.bind();				
					CurrProgram.setUniforms(uniforms);
					nexus.begin();
					nexus.render();
					nexus.end();
				CurrProgram.unbind();			
				this.pickFramebuffer.unbind();				
			}
			else { //drawing ply
				renderer.begin();
					renderer.setFramebuffer(this.pickFramebuffer);				
					renderer.setTechnique(CurrTechnique);
					renderer.setDefaultGlobals();
					renderer.setPrimitiveMode("FILL");
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
			// transform using mesh & instance matrices
			xform.model.push();													
			xform.model.multiply(spot.transform.matrix);
			xform.model.multiply(mesh.transform.matrix);		

			var colorID = this._ID2Color(spot.ID);			
			var uniforms = {
				"uWorldViewProjectionMatrix" : xform.modelViewProjectionMatrix,
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
				CurrProgram.bind();				
					CurrProgram.setUniforms(uniforms);
					nexus.begin();
					nexus.render();
					nexus.end();
				CurrProgram.unbind();			
				this.pickFramebuffer.unbind();				
			}
			else { //drawing ply
				renderer.begin();
					renderer.setFramebuffer(this.pickFramebuffer);				
					renderer.setTechnique(CurrTechnique);
					renderer.setDefaultGlobals();
					renderer.setPrimitiveMode("FILL");
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

	//----------------------------------------------------------------------------------------
	// EVENTS HANDLERS
	//----------------------------------------------------------------------------------------
	onInitialize : function () {
		var gl = this.ui.gl;

		gl.clearColor(0.5, 0.5, 0.5, 1.0);

		var xform = new SglTransformationStack();
		var renderer = new SglModelRenderer(gl);
		var viewMatrix = SglMat4.identity();

		// shaders
		this.basicNXSProgram = this._createStandardNXSProgram();
		this.colorCodedIDNXSProgram = this._createColorCodedIDNXSProgram();

		this.basicPLYTechnique  = this._createStandardPLYtechnique();
		this.colorCodedIDPLYtechnique  = this._createColorCodedIDPLYtechnique();

		this.colorShadedNXSProgram = this._createColorShadedNXSProgram();
		this.colorShadedPLYtechnique = this._createColorShadedPLYtechnique();

		// scene rendering support data
		this.renderer   = renderer;
		this.xform      = xform;
		this.viewMatrix = viewMatrix;

		this.sceneCenter = [0.0, 0.0, 0.0];
		this.sceneRadiusInv = 1.0;

		this.ui.animateRate = 0;

		this.diff		= 0.0;
		this.x 			= 0.0;
		this.y 			= 0.0;
		this.dstartx	= 0.0;
		this.dstarty	= 0.0;
		this.dendx		= 0.0;
		this.dendy		= 0.0;

		this.ax1 		= 0.0;
		this.ay1 		= 0.0;

		// scene others support data
		this._scene       = null;
		this._sceneParsed = false;

		this._objectsToLoad      = 0;
		this._targetInstanceName = "null";
		this._targetHotSpotName  = "null";
		
		this._instancesProgressiveID = 1;
		this._spotsProgressiveID     = 1;

		this._animating      = false;
		this._movingLight    = false;

		this._clickable      = false;
		this._onHover        = false;

		this._onPickedInstance = 0;
		this._onPickedSpot     = 0;
		this._onEnterInstance  = 0;
		this._onEnterSpot      = 0;
		this._onLeaveInstance  = 0;
		this._onLeaveSpot      = 0;

		this._lastCursor     = "default";
		this._pickedInstance = "null";
		this._pickedSpot     = "null";
		this._lastPickedInstance = "null";
		this._lastPickedSpot     = "null";
		this._lastInstanceID = 0;
		this._lastSpotID     = 0;
		this._pickpoint      = [10, 10];
	},

	onDrag : function (button, x, y, e) {
		var ui = this.ui;

		this.ax1 = (x / (ui.width  - 1)) * 2.0 - 1.0;
		this.ay1 = (y / (ui.height - 1)) * 2.0 - 1.0;

		if(this._movingLight && ui.isMouseButtonDown(0))  {
			this.rotateLight(this.ax1/2, this.ay1/2);
			return;
		}
		
		if(this.dstartx == ui.dragStartX(button)){
			this.diff = ui.dragEndX(button)- this.dendx;
			if(ui.dragDeltaX(button) != 0) this.x += (this.diff/500);
		}
		
		if(this.dstarty == ui.dragStartY(button)){
			this.diff = ui.dragEndY(button)- this.dendy;
			if(ui.dragDeltaY(button) != 0) this.y += (this.diff/500);
		}
		
		var action = SGL_TRACKBALL_NO_ACTION;
		if ((ui.isMouseButtonDown(0) && ui.isKeyDown(17)) || ui.isMouseButtonDown(1)) {
			action = SGL_TRACKBALL_PAN;
		}
		else if (ui.isMouseButtonDown(0)) {
			action = SGL_TRACKBALL_ROTATE;
		}

		this.trackball.action = action;
		this.trackball.track(this.viewMatrix, this.x, this.y, 0.0);
		
		ui.postDrawEvent();

		this.dstartx = ui.dragStartX(button);
		this.dstarty = ui.dragStartY(button);
		this.dendx = ui.dragEndX(button);
		this.dendy = ui.dragEndY(button);
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
		if(this._clickable && !this.ui.isDragging(0) && button==0) {
			this._pickingRefresh(x, y);
			if(this._onPickedSpot && this._pickedSpot!="null") this._onPickedSpot(this._pickedSpot);
			if(this._onPickedInstance && this._pickedInstance!="null") this._onPickedInstance(this._pickedInstance);
		}
		this._clickable = false;
	},

	onKeyPress : function (key, evt) {
		if(this._isDebugging)	// DEBUGGING-AUTHORING keys
		{
			if((evt.charCode == '80')	|| (evt.charCode == '112'))	// print trackball
				console.log(this.trackball.getState());
			if (evt.charCode == '49'){	// show nexus patches
				Nexus.Debug.flags[1]=!Nexus.Debug.flags[1];
				this.ui.postDrawEvent();
			}
		}
	},

    onMouseWheel: function (wheelDelta, x, y, e) {
        var ui = this.ui;

        var action = SGL_TRACKBALL_SCALE;
        var factor = wheelDelta < 0.0 ? (0.90) : (1.10);

        this.trackball.action = action;
        this.trackball.track(this.viewMatrix, 0.0, 0.0, factor);
        this.trackball.action = SGL_TRACKBALL_NO_ACTION;

        ui.postDrawEvent();

//        if(this._onHover && !this.ui.isDragging(0)) this._pickingRefresh(x,y);
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

	setScene : function (options) {

		if (!options) return;

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
		var trackball  = new this._scene.trackball.type();
		trackball.setup(this._scene.trackball.trackOptions);
        this.trackball  = trackball;	
		
		var that = this;
		var gl = this.ui.gl;

		for (var m in scene.meshes) {
			var mesh = scene.meshes[m];
			if (!mesh.url) continue;
			if(String(mesh.url).lastIndexOf(".nxs") == (String(mesh.url).length - 4)) {
				var nexus = new Nexus.Renderer(gl);
				mesh.renderable = nexus;
				mesh.isNexus = true;
				nexus.targetError = 5.0;
				nexus.onSceneReady = function () { that._onMeshReady(); };
				nexus.onUpdate = this.ui.postDrawEvent;
				nexus.open(mesh.url);
			}
			else {
				mesh.renderable = null;
				mesh.isNexus = false;
				sglRequestBinary(mesh.url, {
					onSuccess : (function(m){ return function (req) { that._onPlyLoaded(req,m,gl); }; })(mesh)
				});
			}
		}
	
		for (var t in scene.texturedQuads) {
			var tex = scene.texturedQuads[t];
			if (!tex.url) continue;
			scene.background.texture = new SglTexture2D(gl, {
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

		this._testReady();
		this._sceneParsed = true;
	},

	resetTrackball : function () {
		this.trackball.reset();
		this.trackball.track(SglMat4.identity(), 0.0, 0.0, 0.0);
		
		this._lightDirection = [0, 0, -1]; // also reset lighting
		
		this.ui.postDrawEvent();
	},

	getTrackballPosition : function () {
		return this.trackball.getState();
	},
	
	setTrackballPosition : function (newposition) {
		this.trackball.setState(newposition);
		this.ui.postDrawEvent();
	},

	animateToTrackballPosition : function (newposition) {
		this.ui.animateRate = 30;
		this.trackball.animateToState(newposition);
		this.ui.postDrawEvent();
	},

	isAnimate : function () {
		if(this.ui.animateRate > 0) this._animating = true;
		else this._animating = false;
		return this._animating;
	},

	setInstanceVisibility : function (tag, state, redraw) {
	    var ui = this.ui;
	
		var instances = this._scene.modelInstances;
		
		for (var inst in instances) {
			if(tag == HOP_ALL)
			{
				instances[inst].visible = state;
			}
			else
			{
				for (var tg in instances[inst].tags){
					if(instances[inst].tags[tg] == tag)
						instances[inst].visible = state;
				}
			}
		}
		
		if(redraw)
			ui.postDrawEvent();
	},

	toggleInstanceVisibility : function (tag, redraw) {
	    var ui = this.ui;
	
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
			ui.postDrawEvent();
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

	setSpotVisibility : function (tag, state, redraw) {
	    var ui = this.ui;
	
		var spots = this._scene.spots;
		
		for (var spt in spots) {
			if(tag == HOP_ALL)
			{
				spots[spt].visible = state;
			}
			else
			{
				for (var tg in spots[spt].tags){
					if(spots[spt].tags[tg] == tag)
						spots[spt].visible = state;
				}
			}
		}
		
		if(redraw)
			ui.postDrawEvent();
	},

	toggleSpotVisibility : function (tag, redraw) {
	    var ui = this.ui;
	
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
			ui.postDrawEvent();
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

    zoomIn: function() {
       this.onMouseWheel(-1);
    },

    zoomOut: function() {
       this.onMouseWheel(1);
    },

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

	enableOnHover: function(on) {
		this._onHover = on;
	},

	isOnHoverEnabled: function() {
		return this._onHover;
	}
};