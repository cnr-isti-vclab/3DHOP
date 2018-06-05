![3DHOP Logo](documentation/img/logo.png) **3DHOP**
=========
3D Heritage Online Presenter
----------------------------
***3DHOP is an open-source software package for the creation of interactive Web-based presentations of high-resolution 3D models***  

[3DHOP](http://www.3dhop.net) by [Visual Computing Laboratory](http://vcg.isti.cnr.it) - ISTI - CNR

Contact Us @ info@3dhop.net

4 June 2018

#### TEAM
---------

Marco Callieri       @ marco.callieri@isti.cnr.it  
Massimiliano Corsini @ massimiliano.corsini@isti.cnr.it  
Matteo Dellepiane    @ matteo.dellepiane@isti.cnr.it  
Marco Potenziani     @ marco.potenziani@isti.cnr.it

#### CONTENTS
-------------

- **documentation folder** -> the 3DHOP basic documentation
  - *img*                  -> folder with the 3DHOP basic documentation graphic elements files  
  - *docs.html*            -> 3DHOP basic documentation HTML file  


- **minimal folder**   -> the 3DHOP minimal version, a ready-to-use viewer in a self-contained folder
  - *js*               -> folder with the 3DHOP source JavaScript files
  - *models*           -> folder with the 3D model
  - *skins*            -> folder with the toolbar and background graphic elements files
  - *stylesheet*       -> folder with the 3DHOP CSS file
  - *index_ ... .html* -> 3DHOP templates HTML files  


- **examples folder**  -> all the 3DHOP examples/howto shown in the 3DHOP website
  - *js*               -> folder with the 3DHOP source JavaScript files
  - *models*           -> folder with the single- and multi-resolution 3D models
  - *skins*            -> folder with the toolbar and background graphic elements files
  - *stylesheet*       -> folder with the 3DHOP CSS file
  - *HOWTO_ ... .html* -> 3DHOP HOW-TOs HTML files


- **text files**       -> basic info texts
  - *CHANGELOG.txt/md* -> the list of the changes in this 3DHOP release
  - *LICENSE.txt*      -> the GPL license file
  - *README.txt/md*    -> this file

#### HOW TO INSTALL
-------------------

There isn't server installation: just copy the 3DHOP "minimal" or "examples" folder into your web server space and access the HTML files with a browser to see the viewer in action.
3DHOP is a tool designed for the Web, so HTML pages containing a 3DHOP viewer need to be accessed through a web connection to work properly.
However if you want to run 3DHop locally on your PC, you can choose between two ways:

1. **Web server**   
The best way to test the 3DHOP features on your PC is to install a [Web server](http://en.wikipedia.org/wiki/Web_server).
Currently the most popular Web server on the Internet is the Apache HTTP Server ("httpd") by The Apache Software Foundation (please refer to the project [website](http://httpd.apache.org/) to download it and for installation instructions).
Once installed the Web server there are just a few step to run 3DHOP:  
   + download and unpack 3DHOP on your PC;  
   + copy the 3DHOP folder in the Web Server root directory;  
   + open your browser and with it go to the localhost IP address;   
   + browse the localhost directory and select the 3DHOP folder;  
   + click the desired HTML files inside 3DHOP and you are done!  
   
   [Tip: to install a Web server in a simpler way, there exist several applications, like [XAMPP](http://www.apachefriends.org/index.html) or [BITNAMI WAMP Stack](http://bitnami.com/stack/wamp), that can do this for you...] 

2. **Browser Tweaking**   
The simplest way to test the 3DHOP features on your PC _without_ installing any other software, is to allow your browser to access local files on your file system (this practice is disabled by default due to security risk).
The trick to solve this issue is simple, but is restricted only to the Google CHROME or OPERA browsers. Here are the instructions (more detailed info about the deployment of 3DHOP can be found in this [pdf](http://3dhop.net/download/3DHOPsite_deployment.pdf)).
   
   For Windows: 
   + browse to google CHROME (or OPERA) folder in your local file system; 
   + right click on the CHROME (or OPERA) executable file, and select "send to" Desktop as link in the contextual menu;
   + browse to your desktop;
   + right click on the just created CHROME (or OPERA) executable link, and select "properties" in the contextual menu;
   + in the just opened properties window select the "shortcut" tab and edit the "target" field adding to the end of the line "--allow-file-access-from-files", then click on "apply";
   + open your browser from the just edited link on the desktop (now the browser should be enabled to open local files);
   + download and unpack 3DHOP on your PC;
   + browse the 3DHOP folder and simply drag and drop the desired HTML files inside the opened browser and you are done!
    
   For Linux:
   + from a shell, it is possible to launch the browsers with the "--allow-file-access-from-files" parameter;
   OR
   + it is possible to create an alias or a desktop shortcut with the parameter, similarly to the Windows PC.
    
   For Mac:
   + from a shell, it is possible to launch the browsers with the "--allow-file-access-from-files" parameter. For example, to use Chrome, the command is: "open /Applications/Google\ Chrome.app --args --allow-file-access-from-files";
   OR
   + create an appleScript using Automator, that launch the browser using the appropriate parameter.
   
   [Tip: on FIREFOX, EDGE and SAFARI browsers, there is no simple way to enable the local files access (so, it is recommended to install a Web Server if you need to work with these browser locally). However, by default it supports the use of 3D models in Ply format, so you can use 3DHOP in a limited mode, restricted to single resolution models, but without to perform any procedure or to install nothing.]  

#### TECHNICAL INFO
-------------------

A WebGL-enabled browser is needed to run 3DHOP. Please refer to this [page](http://www.khronos.org/webgl/wiki/Getting_a_WebGL_Implementation) for a quick HOWTO.  
3DHOP is supported by all the most widely-used browsers and has been successfully tested on the latest versions of Google CHROME, Mozilla FIREFOX, Microsoft EDGE, Apple SAFARI and OPERA.
If you need technical assistance about 3DHOP, visit the project official [website](http://www.3dhop.net).

3DHOP software is released under the GPL license.
