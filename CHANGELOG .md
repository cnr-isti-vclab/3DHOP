**3DHOP**
=========
3D Heritage Online Presenter
----------------------------
***3DHOP is an open-source software package for the creation of interactive Web presentations of high-resolution 3D models***  

[3DHOP](http://www.3dhop.net) by [Visual Computing Laboratory](http://vcg.isti.cnr.it) - ISTI - CNR

Contact Us @ info@3dhop.net

19 November 2016

#### TEAM
---------

Marco Callieri       @ marco.callieri@isti.cnr.it  
Massimiliano Corsini @ massimiliano.corsini@isti.cnr.it  
Matteo Dellepiane    @ matteo.dellepiane@isti.cnr.it  
Marco Potenziani     @ marco.potenziani@isti.cnr.it

#### CHANGELOG FILE
-------------------

*Developer*

**Main Changes**

* Updated HANDLER "_onEndMeasurement". 
Now the function has two more parameters, containing the first and second point picked: this._onEndMeasurement(this.measurement, this._pointA, this._pointB);
This is helpful to also display the picked points, or if the user wants to write its own distance calculation, for example, to return only the distance along the X axis.
The change is retro-compatible, and is perfectly safe to ignore the two new parameters, using a single parameter function as a handler (thus getting only the measured distance);

* Added CAMERA MODE: ORTHOGRAPHIC.
The camera may be set at startup (in the "space" object) or runtime (there is a toggle and two set functions).
Trackball should implement a "get distance" function, that returns the camera distance from the scene (needed to have zoom in the orthographic mode). In the basic distribution trackballs, this is enough: get distance() { return this._distance; };

*Version 4.0*  

**Main Changes**

* Added PLANES SECTIONING TOOL;
* Added POINT PICKING TOOL;
* Updated MEASUREMENT TOOL;
* Added SCENE CENTERING features;
* Added easier SPECIFICATION OF TRANSFORMATION functions;
* Added POINT SIZE render control shortcut (MeshLab like);
* Added DOUBLE CLICK TO GO camera control to pan-trackball(MeshLab like);
* Added multiresolution SINGLE TEXTURE MESHES support;
* Updated RENDERING and DATA STREAMING system;
* Updated RENDERING and DATA STREAMING parallelization;
* Updated MOUSE WHEEL ZOOM control;
* Updated SAFARI browser patch;
* Added new TOOLBAR button icons set;  

**Files Added/Modified**

* Added "HOWTO_9.0_planes_sections.html" file;
* Added "HOWTO_8.1_point_picking.html" file;
* Updated"HOWTO_8.0_measurement_tool.html" file;
* Added "HOWTO_4.1_complex_scene" file;
* Added "trackball_rail.js" file;
* Updated all "*.js" files;
* Updated "3dhop.css" file;
* Updated "docs.html" file;
* Updated "skins" directory;
  