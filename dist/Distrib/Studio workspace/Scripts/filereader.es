//readFile("d:/watch/", "enu.txt");
var srFile = Clib.fopen("d:/watch/enu.txt","r"); 
if(srFile != null) {
	var sInfo = Clib.fgets(12,srFile);
	trace(sInfo);
	sInfo = Clib.fgets(12,srFile);
	trace(sInfo);
	sInfo = Clib.fgets(12,srFile);
	trace(sInfo);
	Clib.fclose(srFile);
}

srFile = null;

function readFile(otherFilePath, filePath) {
//    var filePath = Inputs.GetProperty("FileName");
    //var otherFilePath = Inputs.GetProperty("FilePath");
    var sr_num = "",filename = "", act_info = "";
	//var srInfo:PropertySet = TheApplication().NewPropertySet();
	//var actInfo:PropertySet = TheApplication().NewPropertySet();
	 
	var act_info_ar = new Array();
	 
    try {
		// start reading file storing other file details
		var srFile = Clib.fopen(otherFilePath + filePath,"r"); 
		if(srFile != null) {
			//read till you get a null which means end of file
			//while((filename = Clib.fgets(250,oFile)) != null) {
				//replace the newline character at the end of line
				//filename = filename.replace(/\n/g,"");
		        
				//extract sr number from the file name
				//sr_num = filename.replace(/\.txt/g,"");
		        
				//store the sr number in property set
				//srInfo.SetProperty("SRNumber",sr_num);
				//trace("SRNumber:" + sr_num);
		        
				//start reading the first sr info file
				//var srFile = Clib.fopen(otherFilePath + filename, "r");
	            
				if(srFile != null) {
					//read the header first and ignore
					//Clib.fgets(15,srFile);
        	       
					//read till there is data in file
					while((act_info = Clib.fgets(12,srFile)) != null) {
						trace("okkkk");
						//replace new line character
						act_info = act_info.replace(/\n/g,"");
						//split the string to get individual fields
						act_info_ar = act_info.split("|");
						//set the properties
						trace("Type:" + act_info_ar[0]);
						trace("Description:" + act_info_ar[1]);
						//actInfo.SetProperty("Type",act_info_ar[0]);
						//actInfo.SetProperty("Description",act_info_ar[1]);
						//add this activity info to SR
						//used copy because I want to reuse this propertyset
						//srInfo.AddChild(actInfo.Copy());
						//reset the activity info PS 
						//actInfo.Reset();
					} //end of act_info while
					//after while you will have a hierarchical structure
					//having SR Information and activity info related to that SR

					//process the info, ideally you will send this in a function
					// and use EAI siebel Adapter upsert method after doing
					//some tranformation if required.
					// processInfo(srInfo);

					//reset the srInfo PS once it is processed. To delete any childs
					//srInfo.Reset();
				}//end of srFile if 
				Clib.fclose(srFile);        
			//} // end of file read while
		} else {
			TheApplication().RaiseErrorText("File Not Found");
		}
	} catch(e) {
		trace( e.toString());
	} finally {
		if(srFile != null)
			Clib.fclose(srFile);
		//srInfo.Reset(); srInfo = null;
		//actInfo.Reset(); actInfo = null;   
	}
}
