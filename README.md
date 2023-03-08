![3DHOP Logo](documentation/img/logo.png) **3DHOP**
=========
3D Heritage Online Presenter
----------------------------
***3DHOP is an open-source software package for the creation of interactive web-based presentations of high-resolution 3D models***  

[3DHOP](http://www.3dhop.net) by [Visual Computing Laboratory](http://vcg.isti.cnr.it) - ISTI - CNR

Contact Us @ info@3dhop.net

08 Mar 2023

#### TEAM
---------

Marco Callieri       @ marco.callieri@isti.cnr.it  
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
  - *3DHOP_ ... .html* -> 3DHOP templates HTML files  


- **examples folder**  -> all the 3DHOP examples/howto shown in the 3DHOP website
  - *js*               -> folder with the 3DHOP source JavaScript files
  - *models*           -> folder with the single- and multi-resolution 3D models
  - *skins*            -> folder with the toolbar and background graphic elements files
  - *stylesheet*       -> folder with the 3DHOP CSS file
  - *HOWTO_ ... .html* -> 3DHOP examples HTML files


- **text files**       -> basic info texts
  - *CHANGELOG.txt/md* -> the list of the changes in this 3DHOP release
  - *LICENSE.txt*      -> the GPL license file
  - *README.txt/md*    -> this file

#### HOW TO INSTALL
-------------------

There isn't server installation: just copy the 3DHOP "minimal" or "examples" folder into your web server space and access the HTML files with a browser to see the viewer in action.
3DHOP is a tool designed for the web, so HTML pages containing a 3DHOP viewer need to be accessed through a web connection to work properly.
However if you want to run 3DHOP locally on your PC, you can install a web server:

**Web server**   
To test all the 3DHOP features on your PC you need to install a [web server](http://en.wikipedia.org/wiki/Web_server).
Currently the most popular web server on the Internet is the Apache HTTP Server ("httpd") by The Apache Software Foundation (please refer to the project [website](http://httpd.apache.org/) to download it and for installation instructions).
Once installed the web server there are just a few step to run 3DHOP:  
   + download and unpack 3DHOP on your PC;  
   + copy the 3DHOP folder in the web server root directory;  
   + open your browser and with it go to the localhost IP address;   
   + browse the localhost directory and select the 3DHOP folder;  
   + click the desired HTML files inside 3DHOP and you are done!  
   
   [Tip: to install a web server in a simpler way, there exist several applications, like [XAMPP](http://www.apachefriends.org/index.html) or [BITNAMI WAMP Stack](http://bitnami.com/stack/wamp), that can do this for you...] 
   
   [Tip: common browsers enable local files access to simpler files, without the need to install a web server. So, since by default 3DHOP supports the use of 3D models also in PLY format, you can use it in a limited mode, restricted to single resolution models, without to perform any procedure or to install nothing.]  

#### TECHNICAL INFO
-------------------

A WebGL-enabled browser is needed to run 3DHOP. Please refer to this [page](http://www.khronos.org/webgl/wiki/Getting_a_WebGL_Implementation) for a quick HOWTO.  
3DHOP is supported by all the most widely-used browsers and has been successfully tested on the latest versions of Google CHROME, Mozilla FIREFOX, Microsoft EDGE, Apple SAFARI, and OPERA.
If you need technical assistance about 3DHOP, visit the project official [website](http://www.3dhop.net).

3DHOP software is released under the GPL license.
