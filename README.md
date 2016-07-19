**3DHOP**
=========
3D Heritage Online Presenter
----------------------------
***3DHOP is an open-source software package for the creation of interactive Web presentations of high-resolution 3D models***  

[3DHOP](http://www.3dhop.net) by [Visual Computing Laboratory](http://vcg.isti.cnr.it) - ISTI - CNR

Contact Us @ info@3dhop.net

18 July 2016

#### TEAM
---------

Marco Callieri       @ marco.callieri@isti.cnr.it  
Massimiliano Corsini @ massimiliano.corsini@isti.cnr.it  
Matteo Dellepiane    @ matteo.dellepiane@isti.cnr.it  
Marco Potenziani     @ marco.potenziani@isti.cnr.it

#### CONTENTS
-------------

- **documentation folder** -> the 3DHOP basic documentation
  - *img*           -> folder with the 3DHOP basic documentation graphic elements files  
  - *docs.html*     -> 3DHOP basic documentation HTML file  


- **minimal folder** -> the 3DHOP minimal version, a ready-to-use viewer in a self-contained folder
  - *js*            -> folder with the 3DHOP source JavaScript files
  - *models*        -> folder with the 3D model
  - *skins*         ->  folder with the toolbar and background graphic elements files
  - *stylesheet*    ->  folder with the 3DHOP CSS file
  - *index.html*    ->  3DHOP viewer HTML file  


- **examples folder** -> all the 3DHOP examples/howto shown in the 3DHOP website
  - *js*            -> folder with the 3DHOP source JavaScript files
  - *models*        -> folder with the single- and multi-resolution 3D models
  - *skins*         -> folder with the toolbar and background graphic elements files
  - *stylesheet*    -> folder with the 3DHOP CSS file
  - *HOWTO_ ... .html* -> 3DHOP HOW-TOs HTML files


- **text files** -> basic info texts
  - *CHANGELOG.txt* -> the list of the changes in this 3DHOP release
  - *LICENSE.txt*   -> the GPL license file
  - *README.txt*    -> this file
  - *README.md*     -> this file in Markdown markup language

#### HOW TO INSTALL
-------------------

More detailed info on the deployment of 3DHOP can be found in this [pdf](http://3dhop.net/download/3DHOPsite_deployment.pdf).  
There is no installation: just copy the 3DHOP "essential" or "examples" folder into your server project path
and link or embed the viewer in yours project pages.  
3DHOP is a tool designed for the Web, so it requires to be embedded in an HTML environment to work.
However if you want to run 3DHop in local on your PC you can choose between two ways:  

1. **Web server**   
The best way to test the 3DHOP features on your PC is to install a [Web server](http://en.wikipedia.org/wiki/Web_server).
Currently the most popular Web server on the Internet is the Apache HTTP Server ("httpd") by The Apache Software Foundation 
(please refer to the project [website](http://httpd.apache.org/) to download and to know how to install it).
Once installed the Web server there are just a few step to run 3DHOP:  
   + download and unpack 3DHOP on your PC;  
   + copy the 3DHOP folder in the Web Server root directory;  
   + open your browser and with it go to the localhost IP address;   
   + browse the localhost directory and select the 3DHOP folder;  
   + click the desired HTML files inside 3DHOP and you are done!  
   
   [Tip: to install a Web server in a more simple way exist several applications, like [XAMPP](http://www.apachefriends.org/index.html) or [BITNAMI WAMP Stack](http://bitnami.com/stack/wamp) , that can do this for you...] 

2. **Direct link**   
The simplest way to test the 3DHOP features on your PC without install nothing is to allow
your browser to access local files on your file system (this practice is disabled by default due to security risk).
The trick to solve this issue is simple but restricted only at the Google CHROME or OPERA browsers.
So, let's look how to do this for these two browsers:
   + browse to google CHROME (or OPERA) directory in your local file system; 
   + right click on the CHROME (or OPERA) executable file, and select "send to" Desktop as link in the contextual menu;
   + browse to your desktop;
   + right click on the just created CHROME (or OPERA) executable link, and select "properties" in the contextual menu;
   + in the just opened properties window select the "shortcut" tab and edit the "target" field adding to the end of the line "--allow-file-access-from-files", then click on "apply";
   + open your browser from the just edited link on the desktop (now the browser should be enabled to open local files);
   + download and unpack 3DHOP on your PC;
   + browse the 3DHOP folder and simply drag and drop the desired HTML files inside the opened browser and you are done!  
   
   [Tip: on FIREFOX, EDGE and SAFARI browsers no simple way to enable the local files loading are provided (so is recommended to install a Web browser if you can use only this browser). However, by default it supports the use of 3D models in Ply format, so you can use 3DHOP in a limited mode, restricted to single resolution models, but without to perform any procedure or to install nothing.]

#### TECHNICAL INFO
-------------------

A WebGL-enabled browser is needed to run 3DHOP. Please refer to this [page](http://www.khronos.org/webgl/wiki/Getting_a_WebGL_Implementation) for a quick HOWTO.  
3DHOP is supported by all the most widely used browsers and has been successfully tested on the latest versions of Google CHROME, Mozilla FIREFOX, Microsoft EDGE, Apple SAFARI and OPERA.  
If you need technical assistance about 3DHOP, visit the project official [website](http://www.3dhop.net).

3DHOP software is released under the GPL license.
