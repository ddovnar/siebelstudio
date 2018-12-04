importPackage(java.io);
var s = new RandomAccessFile("d:/watch/enu.txt", "r");
s.seek(0);
var t = [];
for (var i = 0; i < s.length(); i++)
t[i] = "";
trace(s.length());
var offset = 0;
var g = s.readLine();
var ff = g.toCharArray();
for (var i = 0; i < ff.length; i++) {
	trace(ff[i] + " " + String.fromCharCode(ff[i]));
}
s = null;


function printData(arrData) {
	trace("Records:" + arrData.length);
	for (var i = 0; i < arrData.length; i++) {
		trace(" " + arrData[i][0] + ":\t\t" + arrData[i][1]);
	}
}

function getValues(bcFLG, bcName, arrValues) {
	var boBC = TheApplication().GetBusObject("Repository Business Component");
	var bcBC = boBC.GetBusComp("Repository Business Component");
	
	var bcf = boBC.GetBusComp("Repository Field");
	bcf.ActivateField("Name");
	bcf.ActivateField("Inactive");
	bcBC.ActivateField("Name");
	bcBC.ClearToQuery();
	bcBC.SetSearchExpr("[Name] = \'" + bcName + "\'");
	bcBC.ExecuteQuery(ForwardOnly);
	var b = bcBC.FirstRecord();	
	while (b) {
		bcf.ClearToQuery();
		bcf.SetSearchExpr("[Inactive] = \'N\'");
		bcf.ExecuteQuery(ForwardOnly);
		var f = bcf.FirstRecord();
		var ii = 0;
		while (f) {
			var valItem = new Array();
			valItem[0] = bcf.GetFieldValue("Name");
			try {
			valItem[1] = bcFLG.GetFieldValue(bcf.GetFieldValue("Name"));
			} catch (e) {
				valItem[1] = "not found field";
			}
			arrValues[ii] = valItem;

			f = bcf.NextRecord();
			ii++;
		}
		b = bcBC.NextRecord();		
	}
	bcf = null;
	bcBC = null;
	boBC = null;
}

function activateFields(bcFLD, bcName) {
	var boBC = TheApplication().GetBusObject("Repository Business Component");
	var bcBC = boBC.GetBusComp("Repository Business Component");
	
	var bcf = boBC.GetBusComp("Repository Field");
	bcf.ActivateField("Name");
	bcf.ActivateField("Inactive");
	bcBC.ActivateField("Name");
	bcBC.ClearToQuery();
	bcBC.SetSearchExpr("[Name] = \'" + bcName + "\'");
	bcBC.ExecuteQuery(ForwardOnly);
	var b = bcBC.FirstRecord();
	while (b) {
		 bcf.ClearToQuery();
		 bcf.SetSearchExpr("[Inactive] = \'N\'");
		 bcf.ExecuteQuery(ForwardOnly);
		 var f = bcf.FirstRecord();
		 bcFLD.SetViewMode(AllView);
		 while (f) {	        		 	        		 
			 bcFLD.ActivateField(bcf.GetFieldValue("Name"));
			 f = bcf.NextRecord();
		 }
		 b = bcBC.NextRecord();
	}
	bcf = null;
	bcBC = null;
	boBC = null;
}
