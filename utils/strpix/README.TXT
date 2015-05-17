              *** Strpix version 3.9 REV 1 ****
                         August-2002
            By Turbo Pascal. Cyber_pascal@yahoo.com



Strpix3 is a program that let you do some editing to the Tomb Raider WAD files
used in the Oficial level editor.


Install
--------
Just put Strpix3.exe and solid.bmp in a folder. also you will need the dlls
Opengl32.dll and Glu32.dll in your windows\system folder, normaly these are
already included in all Windows version.

Strpix3 is designed to run in 800x600 32 bit color using normal font size.
If you have problem running this program, look at the "Strpix3 and
some video Cards" section.



A.- New strpix3 Layout.
------------------------
Strpix3 screen sections are:

- To the left you see the <Textures windows>, where you see the whole
  textures used in the WAd, the textures are gruped in "Pages", each page is
  256x256 pixels size.
  You select each page using the "page combobox" below the texture window.

- Below the texture window you found the <Texture table section>, where you see
  the list of textures pieces defined in the WAd, you can select from the list each texture
  defined, Strpix3 will show you the page and will enclose the texture piece in
  the texture window. The actual texture piece selected in the texture list is
  called "The current texture".

- To the right in the screen you will see the "Objects Window", where you can
  see the objects included in the WAD.
  Objects in Wad that Move in game normaly are broked in severals pieces, so you
  will see Lara's legs, Lara's arms, Lara's head, etc.
  Static object (chairs, tables, pilars, statues etc) normaly are just one object.
  You select the object to show in the object window using the combo box control below
  the object window. The actual object that is show is called "The Current object".
  You can see the object in wireframe mode, solid mode, and textured mode. use
  the <Render Mode> control for select the mode that you want to use.
  In Wireframe/Solid Mode you will see that each object is divided is severals
  pieces called "Faces". Some faces are Rectangular and some are Triangular.


B.- Keys Used in the Strpix3.
------------------------------
After selecting the current object you can use the fallow key combinations:

- <Right Mouse buton>, Press and Hold this key while moving the mouse in the
  object window for rotate the current object.

- <Shift> + <Right Mouse buton>, Press and Hold this key while moving the mouse in the
  object window for PAN the current object.

- <CTRL> + <Right Mouse buton>, Press and Hold this key while moving the mouse in the
  object window for ZOOM In/Out the current object.

- <Click>, Do a normal click over a object's face for apply the "current Texture"
  selected over this face.

- <CTRL> + <Click>, Press this key over a object's face for get the texture from this
  face and make it the "current Texture".

- <Shift> + <Click>, Press this key over a object's face for FLIP the texture on in.

- <ALT> + <Click>, Press this key over a object's face for ROTATE the texture on in.

- <CTRL> + <ALT> + <Click>, Press this key over a object's triangular face for
                            select a Triangular texture type. (more about this below)

D.- Previus Strpix2 feature:
-----------------------------
Old strpix just let you extract the whole textures used in Wad and save it in
windows Bitmap file format, then you open and edit the bitmap in your favorite
Paint program, then you import back your edited bitmap to the wad.

You can still doing that in strpix3:

1.- Select from menu "File", "Open" and open a WAd file.
2.- Select from menu "Textures", "Export to Bitmap", and save the whole textures.
3.- After editing the bitmap, select from menu "Textures", "Import from Bitmap",
    and open your edited bitmap.
4.- Save your wad.


E.- New Strpix3's Extract Texture feature.
-------------------------------------------
In strpix2 was very dificult to find up what texture pieces are used for
every object. Now in strpix3 extracting the texture pieces for each object
is very ease.

1.- Select the object that you want in the object window.
2.- Do ctrl + click over a object's face for get the texture
3.- click the Buton <Export> below the texture table to save JUST the
    current texture in Bitmap file. Now edit the texture piece in your
    favorite Paint program.
4.- Now, press the buton <Import> for put back and replace the current
    texture for the new edited texture.
5.- Save your WAd.


F.- Re-texturing the Objects.
------------------------------
The main Problem with the two methods above, is that all objects that
share the same texture piece that you export/import will be affected for your
change.
So, if you re-edit the texture piece used in Lara's legs for example, also some
other Laras'body part will be affected, like arms or her face.
The solution is simple, you only need to re-apply a different texture map in the
legs and arms.

1.- Click Over a texture in the texture window for select that texture in
    the current texture.
2.- Now select the object that you want to re-texture and click on each face
    for apply the current texture. Remember that you can flip and rotate the texture.
3.- Save your Wad.


H.- Exporting/Importing Objects to CAD programs.
-------------------------------------------------
Strpix3 let you export the current object to a CAD program for be edited, and
then import back the object to the WAD.

Editing a 3d object (a Model) is not a ease task, a good CAD program is very
espensive, and definitly you must learn how to use it. If you are a casual
user and you never before use a CAD program, then you should skip this section
and forget to try to change a object polygon until you get a CAD program and
you learn how to use it. Please read the next DXF file format section so you
can know wich kind CAD program you need.


DXF file format.
----------------
DXF file format was invented for autodesk and severals CAD program support it.
This file can be huge, but it is just a TXT file, so when it is zipped
it is high rate compressed.
Because this file is a TXT file, it is ease to read/write but unfortunatily
you CAN'T store the texture bitmaps on in, so you can't open the model in your
CAD program full textured.

In DXF file all objetc's faces can be stored in the file using two methods:

- 3DFACE ENTITIES, where all faces are individual defined using 4 vertex data.
  and if the face is triangular, then the 4th vertex is equal to the 3th vertex.

- VERTEX LIST, where all faces are defined using a continue vertex list data.

Strpix3 CAN ONLY READ DXF files using the "3Dface entities" method, so be
sure to use a CAD program that write DXF this way.
The CAD programs that i know that write compatible DXF are: AUTOCAD 13 and
above, Rhinoceros, Lightwave, Caligiary TRue space, Metasoquiola.
3Dstudio Max seems that does'nt write 3dface entities DXFs, so it can't be
used with strpix3, sorry about that.


Textures in Strpix3's DXFs
---------------------------
Strpix3's DXF will keep the texture info for each faces using the layers names.

In allmost all CAD program, the faces can be assigned to groups called
"Layers", then you assing some properties to the Layer like color,
line type, etc. then all faces assigned to this layer will have this
properties too.

Strpix3's DXF will put all faces in severals layers, one layer for each
different texture info used in the model. The layers will be named in this
way:

 Textur_xxxx_y_z  For normal (no fliped) textures.
 Fliped_xxxx_y_z  for fliped textures.

- xxxx : Mean the texture number used in the face (0 padded) like "0256",
         "0010", "1132" etc.
- y    : Mean the texture map way used in the face. (see below)
- z    : Mean flag used for the texture. 0=Opaque, 1=Semi-Transparent, 2=Transparent.

The y values used are:

- 0 =  Rectangular face.

- 1 =  Triangular face type 1
      *-------
      |
      |

- 2 =  Triangular face type 2

          |
          |
      ----*

- 3 =  Triangular face type 3

       |
       |
       *------

- 4 =  Triangular face type 4

      -----*
           |
           |


If you build new objects in your CAD program, REMEMBER TO ASSING THE FACES to
layers with names using the above method; for example: Textur_0025_0_0, Texture_1342_1_0,
Fliped_0035_2_0 etc.

When you are in strpix3, pressing <CTRL> + <ALT> + <click> over a triangular
face, will change the triangular type info betwent 1-4. you will need to do
that if the texture in your custom triagular face is not mapped correctly.


Object Dimensions
------------------
If you are going to build new objects, ask your self "How i will know how big
my object will be in the Tomb Raider Game?"
Thast's right, how you know if your new door is too big or too short?.

I don't know what units are used in Tomb Raider game, (feets, meters, yards?)
i only know that each tile square used in the level editor is 10.24 x 10.24 units.
A clasic pushable box 's dimension is 10.24x10.24x10.24 units, Lara's tall is about
10.24. so use that size for reference when you are building your objects in
your CAD program.

Note for developers: Well, maybe you already noted that in TR4 and WAD files
the units are 1000/1 mean that a square is realy stored 1024x1024x1024,  but
this dimensions are huge for handle in CAD (and in my strpix3) so i re-scale all
dimension to 100/1, when DXF is exported.


Tomb Raider objects'limits
---------------------------
You can't build a whole House with your CAD program and put it in the
WAD's object list, there are SOME CAPACITY LIMITS for the objetcs.

Each objects is built using severals vertices (The points used for define
each faces), some faces share the same vertice, so strpix3 will build automaticly
this vertex table.

I found that about 255 is the limit for the maximum amount vertices that
can be used in each object, i don't know if there is limit for the amount
faces that can be used.

Strpix3 will show you at the status bar the amount vertices and the amount
faces used for the current object. If after importing a object from your CAD
program the amount vertices is more that 255 then the GAME WILL CRASH when
you try to play it.


-Export/Import DXF
-------------------

1.- Select the Object in Objects window,
2.- Select from menu "File", "Export DXF" for export the current object.
3.- Open, edit and save the DXF in your CAD program.
4.- Select from menu "File", "Import DXF" for Import back the model.

You can use this option too for put the object to another object, for example
you can select a Baddy's head, export the head to a DXF, then select the
Lara's head object and import the Baddy's head DXF over Lara's head.

If when you are importing a DXF you get a message error saying:

- "Defa" is not a valid integer value.

Mean that the DXF include layers using names like "Default". use your
CAD program and rename the layers with valid strpix3 layers names.


Also you can get a similar message error like:

- "xxxx" is not a valid integer value.

Mean that your CAD program built all vertex values using "," (coma) for
decimals. Seems that strpix3 espect to found values with "." (dot).
Go to Control panel, regional setting, and select "dot" for decimals values,
then use your CAD program and build the DXF again.


- Building New Objects.
-----------------------
If you are going to Build new objects do this:

1.- In your CAD program, define at least one Layer named
    Texture_xxxx_y_z (Texture_250_0_0 for example).

2.- Build the object using that Layer.

3.- Make sure your object is centered at 0,0 position and the UP/Down position
    for your object MUST BEGIN at 0.

4.- Be care about the size for your model, remember use the 10.24 unit for reference.

5.- Be sure to save DXf using 3dface method.

6.- In Strpix3 select the Object that will be replaced for your new object.

7.- Import your new DXF.

8.- If your Object use more that 250 vertex, then the game will crash if you
    use this object.



Colision Editor
----------------

In WAD file there are two kinds objects on in, movables and statics meshs.
Movables are pieces that togeter will build a object that will be animated.
Static mesh are just a object that will not be animated (so it will be static).

Only statics mesh will have a bounding box data. The object has a two bounding
box, one for visibility porpuse (used for the AI i guess), and another for
colisional testing (solid bound).

- Select from the combox box the statics mesh availibles in the level.
  You will see the object enclosed in his bounding box.

- You can select to see/edit the visibility or the colisional bounding box.

- The boundig box is defined using to cordinates: x1,y1,z1 and x2,y2,z2.
  Just edit this cordinates and you will see at real time the changes.

- When you import a new Object from your CAD program, you can use the
  <Automatic Bound> button for let strpix3 calculate automaticaly the
  bounding box for your new model.


PIX file format.
-----------------
The best way to make your work availible for public is posting the whole WAD,
however the WAD's size can be a problem.

Another alternative is using a propetary file format used for Strpix called
PIX files.
The PIX file store for all objects just the faces and the texture number used,
the size for the PIX is some lower because there is not included the
current texture data, animations and some other infos included in the whole WAD.

If you edit a WAD file just using the originals textures on in, then you only
need to post the PIX file and tell to the people to wich WAD apply this PIx file.
If you edited the Textures using your paint program, then you will need to extract
the whole textures using from menu the option "Textures", "Export to bitmap"
and then convert the bitmap to JPG file format (the size will be lower).
Then post both the JPG and the PIX file and tell to the people to wich WAD
use them.


I.- Strpix3 and Custom WADs.
-----------------------------
I have not full tested Strpix3 with custom WAd built with TRWEST, TR2WAd or WADMERGER etc,
so i don't know if those WAd are always compatibles with Strpix3.
When i hacked the originals WAD file format i found that in some case, a padded two byte (word) is
needed after a Mesh, so Strpix3 Read/write the meshes expecting this 2 bytes when is
necessary and if this 2 bytes are not present when they should be, then strpix3 will crash
or will corrupt the WAD.

I found that TRwest built a unusual mesh_pointer table, where somtimes a mesh entry
is duplicated severals times, since version 3.7 strpix3 is awared about this so
the wad is opened and saved correctly, however i am not sure is this is the only
incompatible case with trest.


If you get trouble using strpix3 with custom WADs, then i suggest you to edit
the object in originals WAds and when you are done, extract the Object using
those WAD builders programs.



I.- Strpix3 and some Video Cards
---------------------------------
Writing realtime 3d Programs are not a ease task, there are mainly two ways,
the Microsoft Way using Direct3d API, and the SGI way using Opengl API.

I choose Opengl way because it is ease to learn, it took me just few days to
learn how setup and draw some 3d primitives, there are lot of good docs about
Opengl subject, also the Opengl's API is so powerfull!!.

The bad news is that Video Cards vendors preffer support Microsoft's Direct3d
so there is a lot problem with Opengl in some Video Cards.

I have a S3 chip based video Card at my home in a old Pentium 150mhz with 16mb Ram,
and strpix3 run fast on in, but there are some video Cards that can't run
Strpix3, (like some Voodoo and ATI cards). for the moment, there is nothing that
i can't do for fix this problem until i get my hand in a voodoo or ATI card.

If you are having problem running Strpix3 then you can try:

- Run strpix3 with the parameter <24>    C:>Strpix3 24
- Update your Video Cards Drivers.
- Dissable all features in your video card setup program.
- Use the GLdirect program from SCitech. (free download 30 days trial period).



J.- Thanks...
--------------

1.- I want to thanks to Toby Gard and Paul Douglas for inventing the wonderful
    Lara Croft. Also to the people at EIDOS & Core for keeping Lara alive all
    this time.

2.- Philp Campbell, for building severals great levels this past years, i spend
    whole nigths playing your levels.

3.- To JhonyBoy for share with me his info about WAD file format, thanks a lot Jhon.

4.- To the People at Eidos's forum for keeping me interested in this project, and especialy
    to ROBBASE.

5.- Most at all to my Wonderfull friends at JHN's forum, Bart, Kev, Quad, Biker...



                   Turbo Pascal
                    8-Jun-2001.


















































































































