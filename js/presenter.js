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
//  CONSTANTS
//----------------------------------------------------------------------------------------
// SglTrackball
/***********************************************************************/
const SGL_TRACKBALL_NO_ACTION = 0;
const SGL_TRACKBALL_ROTATE    = 1;
const SGL_TRACKBALL_PAN       = 2;
const SGL_TRACKBALL_DOLLY     = 3; 
const SGL_TRACKBALL_SCALE     = 4;
//----------------------------------------------------------------------------------------

Presenter = function (canvas) {
	this.reset();
	
	this._isDebugging = false;
	
	this._supportsWebGL = sglHandleCanvas(canvas, this);
};

Presenter.prototype = {

	supportsWebGL : function() {
		return this._supportsWebGL;
	},
	
	// PARSING SCENE DECLATARION-----------------------------------------------------------------------
	_parseScene : function (options) {
		options = options || { };
		var r = {
			background     : this._parseBackground(options.background),
			meshes         : this._parseMeshes(options.meshes),
			texturedQuads  : this._parseTexturedQuads(options.texturedQuads),
			modelInstances : this._parseModelInstances(options.modelInstances),
			trackball      : this._parseTrackball(options.trackball),
			space          : this._parseSpace(options.space)			
		};
		return r;
	},	
	
	// functions to parse individual section of the scene declaration
	
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
            transform : null,
            hotspots  : { },
			visible   : true,
			tags      : [ ]
		}, options);
		r.transform = this._parseTransform(r.transform);
		for (var m in r.hotspots) {
			r.hotspots[m] = this._parseHotSpot(r.hotspots[m]);
		}
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

	// support functions
	
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

	// drawing support
	
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
	
	
	// DRAW SCENE---------------------------------------------------------------------------
	
    _drawScene : function () {
        var gl       = this.ui.gl;
        var width    = this.ui.width;
        var height   = this.ui.height;
        var xform    = this.xform;
        var nexus    = this.nexus;
		var renderer = this.renderer;		
        var program  = this.program;

		var bkg = this._scene.background.color;
        gl.clearColor(bkg[0], bkg[1], bkg[2], bkg[3]);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT | gl.STENCIL_BUFFER_BIT);

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

		var meshes    = this._scene.meshes;
		var instances = this._scene.modelInstances;
		
		// getting scale/center for scene
		this._setSceneCenterRadius();
		
		for (var inst in instances) {
			var instance = instances[inst];
			var mesh     = meshes[instance.mesh];
			if (!mesh) continue;
			
			if (!instance.visible) continue;
			
			if(mesh.isNexus) {
				var nexus = mesh.renderable;
				if (!nexus || !nexus.isReady) continue;

				gl.enable(gl.DEPTH_TEST);

				program.bind();

				var global_uniforms = {
					"uViewSpaceLightDirection" : this._lightDirection
				};
				program.setUniforms(global_uniforms);				
				
				xform.model.push();							
				
				// scale to unit box + recenter
				xform.model.scale([this.sceneRadiusInv, this.sceneRadiusInv, this.sceneRadiusInv]);
				xform.model.translate(SglVec3.neg(this.sceneCenter));						
				
				// transform using mesh & instance matrices
				xform.model.multiply(instance.transform.matrix);
				xform.model.multiply(mesh.transform.matrix);					
				
				nexus.modelMatrix      = xform.modelMatrix;
				nexus.viewMatrix       = xform.viewMatrix;
				nexus.projectionMatrix = xform.projectionMatrix;
				nexus.viewport         = [0, 0, width, height];

				var instance_uniforms = {
					"uWorldViewProjectionMatrix" : xform.modelViewProjectionMatrix,
					"uViewSpaceNormalMatrix"     : xform.viewSpaceNormalMatrix
				};
				program.setUniforms(instance_uniforms);

				nexus.begin();
				nexus.render();
				nexus.end();
				
				program.unbind();

				gl.disable(gl.DEPTH_TEST);	

				xform.model.pop();				
			}
			else { //drawing ply
				var thismodel = mesh.renderable;
				if (!thismodel) continue;			
				
				xform.model.push();					
				
				// scale to unit box + recenter
				xform.model.scale([this.sceneRadiusInv, this.sceneRadiusInv, this.sceneRadiusInv]);
				xform.model.translate(SglVec3.neg(this.sceneCenter));							
				
				// transform using mesh & instance matrices
				xform.model.multiply(instance.transform.matrix);
				xform.model.multiply(mesh.transform.matrix);	
			
				var globals = {
					"WORLD_VIEW_PROJECTION_MATRIX"	: xform.modelViewProjectionMatrix,
					"VIEW_SPACE_NORMAL_MATRIX"		: xform.viewSpaceNormalMatrix,
					"VIEW_SPACE_LIGHT_DIRECTION"	: this._lightDirection
				};										
				
				gl.enable(gl.DEPTH_TEST);

				renderer.begin();
					renderer.setTechnique(this.technique);
					renderer.setDefaultGlobals();
					renderer.setPrimitiveMode("FILL");
					renderer.setGlobals(globals);
					renderer.setModel(mesh.renderable);
					renderer.renderModel();
				renderer.end();

				gl.disable(gl.DEPTH_TEST);
				
				xform.model.pop();				
			}
		}
    },

	_drawNull : function () {
		var gl = this.ui.gl;
		gl.clearColor(0.0, 0.0, 0.0, 0.0);
		gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT | gl.STENCIL_BUFFER_BIT);
	},

	reset : function () {
		this._scene              = null;
		this._objectsToLoad      = 0;
		this._targetInstanceName = null;
		this._targetHotSpotName  = null;

		this._sceneParsed = false;		
		
		this._onAnimationBegin = null;
		this._onAnimationEnd   = null;

        this._movingLight = false;
        this._lightDirection = [0, 0, -1];
	},

	toggleDebugMode : function () {	
		this._isDebugging = !this._isDebugging;
	},
	
	setScene : function (options) {
		this.reset();
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
	

	isSceneReady : function () {
		var r = (this._scene && this._sceneParsed && (this._objectsToLoad == 0)); 
		return r;
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
	
	isAnimating : function () {
		return true;
	},
	
	onInitialize : function () {
		var gl = this.ui.gl;

		gl.clearColor(0.5, 0.5, 0.5, 1.0);

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

		// technique, for ply rendering
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
				"uWorldViewProjectionMatrix" : { semantic : "WORLD_VIEW_PROJECTION_MATRIX", value : SglMat4.identity() },
				"uViewSpaceNormalMatrix"     : { semantic : "VIEW_SPACE_NORMAL_MATRIX",     value : SglMat3.identity() },
				"uViewSpaceLightDirection"   : { semantic : "VIEW_SPACE_LIGHT_DIRECTION",   value : [ 0.0, 0.0, -1.0 ] }
			}
		});
		
        var xform = new SglTransformationStack();
		var renderer = new SglModelRenderer(gl);		
        var viewMatrix = SglMat4.identity();	

		//----------------------------------------------------------
		
		this.renderer   = renderer;
		this.xform      = xform;
        this.viewMatrix = viewMatrix;

		// shaders
        this.program    = program;		
		this.technique  = technique;
		
		// scene rendering support data
		this.sceneCenter = [0.0, 0.0, 0.0];
		this.sceneRadiusInv = 1.0;
		
		this.ui.animateRate = 0;
	},

    onMouseMove : function (x, y) {

        var ui = this.ui;

        var ax1 = (x / (ui.width  - 1)) * 2.0 - 1.0;
        var ay1 = (y / (ui.height - 1)) * 2.0 - 1.0;

        if(this._movingLight && ui.isMouseButtonDown(0))  {
            this.rotateLight(ax1/2, ay1/2);
            return;
        } 

        var action = SGL_TRACKBALL_NO_ACTION;
        if ((ui.isMouseButtonDown(0) && ui.isKeyDown(17)) || ui.isMouseButtonDown(1)) {
            action = SGL_TRACKBALL_PAN;
        }
        else if (ui.isMouseButtonDown(0)) {
            action = SGL_TRACKBALL_ROTATE;
        }

        this.trackball.action = action;
        this.trackball.track(this.viewMatrix, ax1, ay1, 0.0);
        //this.trackball.action = SGL_TRACKBALL_NO_ACTION;

        ui.postDrawEvent();
    },

	onKeyPress : function (key) {	
		if(this._isDebugging)	// DEBUGGING-AUTHORING keys
		{
			if((key == 'P')	|| (key == '112'))// print trackball
				console.log(this.trackball.getState());
			if (key == '1')
				Nexus.Debug.flags[1]=!Nexus.Debug.flags[1];				
		}
	},	

	setInstanceVisibility : function (tag, state, redraw) {
	    var ui = this.ui;
	
		var instances = this._scene.modelInstances;
		
		for (var inst in instances) {
			for (var tg in instances[inst].tags){
				if(instances[inst].tags[tg] == tag)
					instances[inst].visible = state;
			}
		}
		
		if(redraw)
			ui.postDrawEvent();		
	},

	toggleInstanceVisibility : function (tag, redraw) {
	    var ui = this.ui;
	
		var instances = this._scene.modelInstances;
		
		for (var inst in instances) {
			for (var tg in instances[inst].tags){
				if(instances[inst].tags[tg] == tag)
					instances[inst].visible = !instances[inst].visible;
			}
		}
		
		if(redraw)
			ui.postDrawEvent();		
	},
	
    onMouseWheel: function (wheelDelta, x, y) {
        var ui = this.ui;

        var action = SGL_TRACKBALL_SCALE;
        var factor = wheelDelta < 0.0 ? (0.90) : (1.10);

        this.trackball.action = action;
        this.trackball.track(this.viewMatrix, 0.0, 0.0, factor);
        this.trackball.action = SGL_TRACKBALL_NO_ACTION;

        ui.postDrawEvent();
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

    zoomIn: function() {
       this.onMouseWheel(-1);
    },

    zoomOut: function() {
       this.onMouseWheel(1);
    },
    
	enableLightTrackball: function(on) {
       this._movingLight = on;
    },
	
	isLightTrackballEnabled: function() {
		return this._movingLight;
	},
	
    onAnimate : function (dt) {
		if (this.isSceneReady()) {
			// animate trackball
			if(this.trackball.tick(dt))	
				this.ui.postDrawEvent();
			else 
				this.ui.animateRate = 0;			
		}
    },

	onDraw : function () {
		if (this.isSceneReady()) {
			this._drawScene();
		}
		else {
			this._drawNull();
		}
	}
};
