WADMerger 1.98 - Readme
=======================



Beta Warning
------------
This is a beta version of wadmerger. Some new features have not been tested very much, so be carefull with them.


Introduction
------------
WADMerger is a program to copy WAD objects from a WAD or TR level to another WAD and export/import objects. You can also enable and disable the collesion from objects and add textures. There is also an animation editor included.


Included files
--------------
The following files are includes with the WADMerger zip file:

Readme.txt			This file.
TR4Objects.dat			Data file containing object names, sounds and smartcopy data.
Switches.dat			Data file containing some animations from Lara. Used for changing switch animations
WADMerger.exe			The WADMerger program
Objects.h			Object file for roomedit (see below)
Glu32.dll & Glut32.dll		Runtime for the opengl renderer



TRNG Extra Objects
------------------
With TRNG, additional static meshes and objects slots are available. WADMerger supports these additional slots, but for the room editor you will need to provide an updated objects.h file. Copy the objects.h file that came with WADMerger into the trle folder and the NGLE room editor should display the additional object slots correctly.




Runtime
-------
WADMerger needs the visual basic 6 runtime.
You also need zlib (for TR4&5 levels) installed. You can download all runtimes needed here:
http://www.trsearch.org/Tools/5/


Known problems
--------------
* Sounds from TR4&5 levels won't work. These games have a differend format then TRLE uses. You must convert the sound samples to the pcm format manually.
* Levels saved with TRViewer can have a few wrong textures on meshes.



More help
---------
If the document didn't help you can find me on the following forums:
http://www.trsearch.org
http://www.tombraiderforums.com/




WADMerger was created by Michiel
Latest version available at http://www.trsearch.org