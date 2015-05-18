
-- MilkShape 3D support

RegisterImporter("MilkShape 3D Extra (*.mst)", "*.mst", "MilkshapeEX.Import")
RegisterExporter("MilkShape 3D Extra (*.mst)", "*.mst", "MilkshapeEX.Export")
MilkshapeEX = {}

function ScanName()
	local t = ""

	local s = ""

	-- find the first "
	while (t ~= '"')
		do
		t = read(filehandle, 1)
		end

	t = read(filehandle, 1)

	-- read until next "
	while (t ~= '"')
		do
		s = s..t
		t = read(filehandle, 1)
		end

	return s

end


-- the exporter callback
function MilkshapeEX.Export(filename)

   function MilkshapeEX.FreeMem()
      -- first dereference all variables then run the garbage collector
      MilkshapeEX.filehandle = nil
      MilkshapeEX.JointTable = nil
      MilkshapeEX.joint_counter = nil
      MilkshapeEX.mesh_counter = nil
      MilkshapeEX.MaterialTable = nil
      collectgarbage()
   end

   function MilkshapeEX.BuildJointTable()
   -- builds the joint table which which flattens the joint hierarchy
   -- indexed by joint id, contains the new id used for export
   MilkshapeEX.JointTable = {}
   local scene = GetScene()
   local node = scene:GetFirstNode()
   MilkshapeEX.joint_counter = 0
   while node
      do

      if (node:GetClassName() == "fxBone") then
         do
         local joint = tobone(node)
         MilkshapeEX.JointTable[joint:GetId()] = MilkshapeEX.joint_counter
         MilkshapeEX.joint_counter = MilkshapeEX.joint_counter + 1
         end
      end -- if

      node = scene:GetNextNode()
      end
   end

   function MilkshapeEX.BuildMaterialTable()
   -- builds the material table, indexed by id, contains the new id used
   -- for export

   MilkshapeEX.MaterialTable = {}

   local i
   local mat_counter = 0
   for i = 0, GetTextureCount()-1,1
      do
      tex = GetTexture(i)
      MilkshapeEX.MaterialTable[tex:GetId()] = mat_counter
      end

   end


   function MilkshapeEX.CountMeshes()
   -- returns the number of meshes in the scene
   local scene = GetScene()
   local node = scene:GetFirstNode()
   MilkshapeEX.mesh_counter = 0
   while node
      do
      if (node:GetClassName() == "fxMesh") then
         do
         MilkshapeEX.mesh_counter = MilkshapeEX.mesh_counter + 1
         end
      end -- if
      node = scene:GetNextNode()
      end
   return MilkshapeEX.mesh_counter
   end


   function MilkshapeEX.CountBones()
   -- returns the number of bones in the scene
   local scene = GetScene()
   local node = scene:GetFirstNode()
   MilkshapeEX.bone_counter = 0
   while node
      do
      if (node:GetClassName() == "fxBone") then
         do
         MilkshapeEX.bone_counter = MilkshapeEX.bone_counter + 1
         end
      end -- if
      node = scene:GetNextNode()
      end
   return MilkshapeEX.bone_counter
   end


   function MilkshapeEX.FindBestJoint(v)
   -- finds the joint with the highest influence on the vertex
   local i
   local best_joint = -1
   local best_weight = 0
   for i = 1,4,1
      do
      if (v.bone[i] > -1) then
         do
         if (v.weight[i] > best_weight) then
            do
            best_joint = v.bone[i]
            best_weight = v.weight[i]
            end
         end --if
         end
      end -- if
      end
   return best_joint
   end

   function MilkshapeEX.SaveMesh(mesh)
   -- saves one mesh node
   local mat_index = MilkshapeEX.MaterialTable[mesh:GetMaterial()]
   if not mat_index then mat_index = -1 end
   write(MilkshapeEX.filehandle, '"', mesh:GetName(), '" 0 ',mat_index,'\n')
   write(MilkshapeEX.filehandle, mesh:GetVertexCount(), "\n")



   write(MilkshapeEX.filehandle, "; //vertex: flag,x,y,z,u,v,joint1 \n")

   -- vertices
   local i
   for i = 0, mesh:GetVertexCount()-1, 1
      do
      v = mesh:GetLocalVertex(i) -- vertex with modelview applied
      local joint_index = v.bone[1]
      if joint_index>=0 then joint_index = MilkshapeEX.JointTable[joint_index] end
      write(MilkshapeEX.filehandle, "0 ", v.position.x, " ", v.position.y, " ", v.position.z, " ", v.texcoords.x, " ", 1-v.texcoords.y, " ", joint_index, "\n")
      end

   -- normals
   write(MilkshapeEX.filehandle, mesh:GetVertexCount(), "\n")

   write(MilkshapeEX.filehandle, "; //normals: nx,ny,nz \n")

   for i = 0, mesh:GetVertexCount()-1, 1
      do
      v = mesh:GetLocalVertex(i) -- vertex with modelview applied
      write(MilkshapeEX.filehandle, v.normal.x, " ", v.normal.y, " ", v.normal.z,"\n")
      end

   -- vertex extra
   write(MilkshapeEX.filehandle,"\n");
   write(MilkshapeEX.filehandle, mesh:GetVertexCount(), "\n")

   write(MilkshapeEX.filehandle, "; //Vertex Extra: joint2,joint3,joint4,weight1,weight2,weight3,weight4 \n")

   local i
   local b2
   local b3
   local b4

   for i = 0, mesh:GetVertexCount()-1, 1
      do
      v = mesh:GetLocalVertex(i) -- vertex with modelview applied
      b2 = v.bone[2]
      if b2>=0 then b2 = MilkshapeEX.JointTable[b2] end
      b3 = v.bone[3]
      if b3>=0 then b3 = MilkshapeEX.JointTable[b3] end
      b4 = v.bone[4]
      if b4>=0 then b4 = MilkshapeEX.JointTable[b4] end

      write(MilkshapeEX.filehandle, b2," ", b3," ", b4," ", v.weight[1]," ",v.weight[2]," ",v.weight[3]," ",v.weight[4],"\n")

      end


   -- faces
   write(MilkshapeEX.filehandle, mesh:GetFaceCount(), "\n")

   write(MilkshapeEX.filehandle, "; //Faces: flag, p1,p2,p3,n1,n2,n3,smoothGroup \n")

   for i = 0, mesh:GetFaceCount()-1, 1
      do
      local f1, f2, f3 = mesh:GetFace(i)
      write(MilkshapeEX.filehandle, "0 ",f1, " ", f2, " ", f3, " ", f1, " ", f2, " ", f3, " 1\n")
      end

   end


   function MilkshapeEX.SaveMaterials()

   write(MilkshapeEX.filehandle, "\n")
   write(MilkshapeEX.filehandle, "\n")

   write(MilkshapeEX.filehandle, "; //*** MATERIALS \n")

   write(MilkshapeEX.filehandle, "Materials: ", GetTextureCount(), "\n")

   local i

   for i = 0, GetTextureCount()-1,1
      do
      tex = GetTexture(i)
      write(MilkshapeEX.filehandle, '"Material', i, '"\n')
      write(MilkshapeEX.filehandle, "0.200000 0.200000 0.200000 1.000000\n")
      write(MilkshapeEX.filehandle, "0.800000 0.800000 0.800000 1.000000\n")
      write(MilkshapeEX.filehandle, "0.000000 0.000000 0.000000 1.000000\n")
      write(MilkshapeEX.filehandle, "0.000000 0.000000 0.000000 1.000000\n")
      write(MilkshapeEX.filehandle, "0.000000\n1.000000\n")
      write(MilkshapeEX.filehandle, '"',tex:GetAbsoluteFilename(),'"\n')
      write(MilkshapeEX.filehandle, '""\n')
      end
   end


   function MilkshapeEX.SaveBone(bone)
   write(MilkshapeEX.filehandle, "\n")

   write(MilkshapeEX.filehandle, '"', bone:GetName(), '"\n')
   local parent = bone:GetParent()
   local parent_name = ""

   if parent then
      if parent:GetClassName() == "fxBone" then parent_name = tobone(parent):GetName() end
   end --if

   write(MilkshapeEX.filehandle, '"', parent_name, '"\n')
   local modelview = bone:GetLocalMatrix()
   local pos = modelview:pos_component()
   local rot = modelview:get_eulers()

      -- fix for biped characters
      if bone:GetName() == "Bip01" then
         do
         --print(bone:GetName().." fixed.")
         --rot.x = -1.5707963
         --rot.z = 0
         end
      end --if

      if bone:GetName() == "Bip01 Pelvis" then
         do
         --print(bone:GetName().." fixed.")
         --rot.x =  -1.5707963
         --rot.z = 0
         end
      end --if


   write(MilkshapeEX.filehandle, "; joint: flags, posx, posy, posz, rotx, roty, rotz \n")

   write(MilkshapeEX.filehandle, "0 ", pos.x, " ", pos.y, " ", pos.z, " ", rot.x, " ", rot.y, " ", rot.z, "\n")

   -- position keys
   write(MilkshapeEX.filehandle, bone:GetKeyCount(), "\n")
   local i

   write(MilkshapeEX.filehandle, "; position key: time, posx, posy, posz \n")

   for i = 0,bone:GetKeyCount()-1, 1
      do
      key = bone:GetKey(i)

      m = bone:GetLocalMatrix():clone()
      m:clear_translation()
      m_inv = m:clone()
      m_inv:invert()

      m:mult_simple(key.matrix)
      m:mult_simple(m_inv);

      pos = m:pos_component()

      m:delete()
      m_inv:delete()

      write(MilkshapeEX.filehandle, key.frame, " ", pos.x, " ", pos.y, " ", pos.z, "\n")
      end

   -- rotation keys
   write(MilkshapeEX.filehandle, bone:GetKeyCount(), "\n")
   local i

   write(MilkshapeEX.filehandle, "; rotation key: time, rotx, roty, rotz \n")

   for i = 0,bone:GetKeyCount()-1, 1
      do
      key = bone:GetKey(i)

      m = bone:GetLocalMatrix():clone()
      m:clear_translation()
      m_inv = m:clone()
      m_inv:invert()

      m:mult_simple(key.matrix)
      m:mult_simple(m_inv);

      rot = m:get_eulers()

      m:delete()
      m_inv:delete()

      write(MilkshapeEX.filehandle, key.frame, " ", rot.x, " ", rot.y, " ", rot.z, "\n")
      end

   end


-- main part
--------------------------------------------------------------------------------


   filename = filename..".mst"
   MilkshapeEX.filehandle = openfile(filename, "wt")
   assert(MilkshapeEX.filehandle)

   MilkshapeEX.BuildJointTable()
   MilkshapeEX.BuildMaterialTable()

   write(MilkshapeEX.filehandle, ";// Milkshape3D Extra ASCII, By Turbo Pascal \n\n")
   write(MilkshapeEX.filehandle, "Signature: mst 1.0 \n\n")

   write(MilkshapeEX.filehandle, "Frames: ", GetTotalFrames(), "\n")
   write(MilkshapeEX.filehandle, "Frame: ", GetFrame(), "\n\n")

   write(MilkshapeEX.filehandle, "Meshes: ", MilkshapeEX.CountMeshes(), "\n")

   -- save the meshes
   MilkshapeEX.mesh_counter = 0
   local scene = GetScene()
   local node = scene:GetFirstNode()
   while node
      do
      if node:GetClassName() == "fxMesh" then
         do
         local mesh = tomesh(node)
         MilkshapeEX.SaveMesh(mesh)
         MilkshapeEX.mesh_counter = MilkshapeEX.mesh_counter + 1
         end
      end -- if
      node = scene:GetNextNode()
      end

   MilkshapeEX.SaveMaterials()

   write(MilkshapeEX.filehandle, "\n")
   write(MilkshapeEX.filehandle, ";*** SKELETON & ANIMATIONS \n")


   write(MilkshapeEX.filehandle, "Bones: ", MilkshapeEX.CountBones(), "\n")

   local node = scene:GetFirstNode()
   while node
      do
      if node:GetClassName() == "fxBone" then
         do
         local bone = tobone(node)
         MilkshapeEX.SaveBone(bone)
         end
      end -- if
      node = scene:GetNextNode()
      end

   closefile(MilkshapeEX.filehandle)
end



-- **********  the importer callback   ***************************
--------------------------------------------------------------------------------
function MilkshapeEX.Import(filename)

	function ScanName()
	local t = ""

	local s = ""

	-- find the first "
	while (t ~= '"')
		do
		t = read(filehandle, 1)
		end

	t = read(filehandle, 1)

	-- read until next "
	while (t ~= '"')
		do
		s = s..t
		t = read(filehandle, 1)
		end

	return s

	end


-- Function that return next word, ignoring coments ";"
       function xread()
       local xw = ";"
       local xs = ""


         while (xw == ";")
            do

              xw = read(filehandle,"*w")
              xs = xw

              if (xw) then xw = strsub(xw,1,1) end

              if xw == ";" then
                 xs = read(filehandle, "*l")
              end


            end

         if xw == ";" then xs = "" end

        --print(xs)
	return xs

    end
--------------------------



Scene = GetScene()
RootNode = Scene:GetRootNode()


-- Open the file
filehandle = openfile(filename, "rt")
if not filehandle then error("Error opening the file!") end

mode = "nothing"

w = xread()

while (w)
	do
       --print(w)

       if (w == "Signature:") then
		do
		-- read sugnature and version
		w = xread()
		w = xread()
		end
	end


	if (w == "Frames:") then
		do
		-- total frames of animation
		w = xread()
		SetTotalFrames(w)
		end
	end

	if (w == "Frame:") then
		do
		-- current frame
		w = xread()
		SetFrame(w)
		end
	end

	if (w == "Meshes:") then
		do
		mesh_count = xread()
		-- read the meshes
		for i = 1,mesh_count,1
			do

			v_array = {}
			vn_array = {}
			ve_array = {}

			mesh = Scene:CreateMesh()

			-- skip the next 3 words
            -- w = xread()
            w = ScanName()
            mesh:SetName(w)
			w = xread()
			w = xread()

			num_verts = xread()
			for j = 1,num_verts,1
				do
				-- read one vertex line
				w = xread()
				x = xread()
				y = xread()
				z = xread()
				u = xread()
				v = xread()
				b = xread()

				v = 1 - v

				v_array[j] = { x, y, z, u, v, b }
				end

			num_normals = xread()
			for j = 1,num_normals,1
				do
				-- read one normal
				x = xread()
				y = xread()
				z = xread()
				vn_array[j] = { x, y, z }
				end

			num_verts = xread()
			for j = 1,num_verts,1
				do
				-- read one vertex extra line
				b2 = xread()
				b3 = xread()
				b4 = xread()
				w1 = xread()
				w2 = xread()
				w3 = xread()
                                w4 = xread()

				ve_array[j] = { b2, b3, b4, w1, w2, w3, w4 }
				end


			num_faces = xread()
			for j = 1,num_faces,1
				do
				--print(j)
				w = xread()
				v1_index1 = xread()
				v2_index1 = xread()
				v3_index1 = xread()
				v1_index2 = xread()
				v2_index2 = xread()
				v3_index2 = xread()
				w = xread()

				v1 = fxVertex:new()
				v1.position.x = v_array[v1_index1+1][1]
				v1.position.y = v_array[v1_index1+1][2]
				v1.position.z = v_array[v1_index1+1][3]
				v1.texcoords.x = v_array[v1_index1+1][4]
				v1.texcoords.y = v_array[v1_index1+1][5]
				v1.bone[1] = v_array[v1_index1+1][6]
				--extra
				v1.bone[2] = ve_array[v1_index1+1][1]
				v1.bone[3] = ve_array[v1_index1+1][2]
				v1.bone[4] = ve_array[v1_index1+1][3]
				v1.weight[1] = ve_array[v1_index1+1][4]
				v1.weight[2] = ve_array[v1_index1+1][5]
				v1.weight[3] = ve_array[v1_index1+1][6]
                                v1.weight[4] = ve_array[v1_index1+1][7]

				v1.normal.x = vn_array[v1_index2+1][1]
				v1.normal.y = vn_array[v1_index2+1][2]
				v1.normal.z = vn_array[v1_index2+1][3]
				v1_index = mesh:AddVertex(v1)

				v2 = fxVertex:new()
				v2.position.x = v_array[v2_index1+1][1]
				v2.position.y = v_array[v2_index1+1][2]
				v2.position.z = v_array[v2_index1+1][3]
				v2.texcoords.x = v_array[v2_index1+1][4]
				v2.texcoords.y = v_array[v2_index1+1][5]
				v2.bone[1] = v_array[v2_index1+1][6]
				--extra
				v2.bone[2] = ve_array[v2_index1+1][1]
				v2.bone[3] = ve_array[v2_index1+1][2]
				v2.bone[4] = ve_array[v2_index1+1][3]
				v2.weight[1] = ve_array[v2_index1+1][4]
				v2.weight[2] = ve_array[v2_index1+1][5]
				v2.weight[3] = ve_array[v2_index1+1][6]
                                v2.weight[4] = ve_array[v2_index1+1][7]

				v2.normal.x = vn_array[v2_index2+1][1]
				v2.normal.y = vn_array[v2_index2+1][2]
				v2.normal.z = vn_array[v2_index2+1][3]
				v2_index = mesh:AddVertex(v2)

				v3 = fxVertex:new()
				v3.position.x = v_array[v3_index1+1][1]
				v3.position.y = v_array[v3_index1+1][2]
				v3.position.z = v_array[v3_index1+1][3]
				v3.texcoords.x = v_array[v3_index1+1][4]
				v3.texcoords.y = v_array[v3_index1+1][5]
				v3.bone[1] = v_array[v3_index1+1][6]
				--extra
				v3.bone[2] = ve_array[v3_index1+1][1]
				v3.bone[3] = ve_array[v3_index1+1][2]
				v3.bone[4] = ve_array[v3_index1+1][3]
				v3.weight[1] = ve_array[v3_index1+1][4]
				v3.weight[2] = ve_array[v3_index1+1][5]
				v3.weight[3] = ve_array[v3_index1+1][6]
                                v3.weight[4] = ve_array[v3_index1+1][7]

				v3.normal.x = vn_array[v3_index2+1][1]
				v3.normal.y = vn_array[v3_index2+1][2]
				v3.normal.z = vn_array[v3_index2+1][3]
				v3_index = mesh:AddVertex(v3)

				mesh:AddFace(v1_index, v2_index, v3_index)

				v1:delete()
				v2:delete()
				v3:delete()
				end

			RootNode:AttachChild(mesh)
			RedrawViewports()
			end
		end
	end


	if (w == "Bones:") then
		do
		bone_count = xread()

		bone_array = {}

		-- read the bones
		for i = 1,bone_count,1
			do

			bone = Scene:CreateBone()
			bone:SetId(i-1)
			bone_array[i] = bone

--			name = xread()
--			name = strsub(name, 2, -2)

			name = ScanName()

--			parent_name = xread()
--			parent_name = strsub(parent_name, 2, -2)

			parent_name = ScanName()

			bone:SetName(name)

			w = xread()
			tx = xread()
			ty = xread()
			tz = xread()

			rx = xread()
			ry = xread()
			rz = xread()

			-- construct the modelview matrix
			matrix = matrix44:new()

			matrix:rotate_x(rx)
			matrix:rotate_y(ry)
			matrix:rotate_z(rz)
			matrix:translate(tx, ty, tz)

			bone:SetMatrix(matrix)
			matrix:delete()

         -- attach the node now
			parent_node = RootNode

			-- try to find our parent bone
			for j = 1,i-1,1
				do
				pbone = bone_array[j]
				if pbone:GetName() == parent_name then parent_node = pbone end
				end

			parent_node:AttachChild(bone)

         RedrawViewports()

			num_tkeys = xread()
			for j = 1,num_tkeys,1
				do
				time = xread()
				ktx = xread()
				kty = xread()
				ktz = xread()

            local ref_m = bone:GetLocalMatrix()
            local x_axis = ref_m:x_component()
            local y_axis = ref_m:y_component()
            local z_axis = ref_m:z_component()

            x_axis:MulS(ktx)
            y_axis:MulS(kty)
            z_axis:MulS(ktz)

            local matrix = matrix44:new()

            matrix:ident()
            matrix:translate(x_axis.x, x_axis.y, x_axis.z)
            matrix:translate(y_axis.x, y_axis.y, y_axis.z)
            matrix:translate(z_axis.x, z_axis.y, z_axis.z)

            bone:SetKey(time, matrix)
            matrix:delete()

				end
			num_rkeys = xread()
			for j = 1,num_rkeys,1
				do
				time = xread()
				krx = xread()
				kry = xread()
				krz = xread()

            org_m = bone:GetLocalMatrix()
            rel_matrix = org_m:clone()
            inv_rel_matrix = org_m:clone()
            inv_rel_matrix:invert()
            inv_rel_matrix:clear_translation()
            rel_matrix:clear_translation()

            matrix = inv_rel_matrix

				matrix:rotate_x(krx)
				matrix:rotate_y(kry)
				matrix:rotate_z(krz)

            matrix:mult_simple(rel_matrix)

            local key_matrix = bone:GetKeyMatrix(time)
            if key_matrix then
               do
               key_translation = key_matrix:pos_component()
               matrix:translate(key_translation.x,key_translation.y,key_translation.z)
               end
            end -- if
				bone:SetKey(time, matrix)

            matrix:delete()
            rel_matrix:delete()
				end

			end
		end
	end



	w = xread()
	end



closefile(filehandle)

end
