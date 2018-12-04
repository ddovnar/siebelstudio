//var boApplet = TheApplication().GetBusObject("Repository Applet");
//var bcApplet = boApplet.GetBusComp("Repository Applet Server Script");
var boApplet = TheApplication().GetBusObject("Repository Business Service");
var bcApplet = boApplet.GetBusComp("Repository Business Service Server Script");
bcApplet.SetViewMode(AllView);
bcApplet.ActivateField("Name");
bcApplet.ActivateField("Script");
bcApplet.ActivateField("Parent Id");
bcApplet.ClearToQuery();
bcApplet.SetSearchExpr("[Inactive] = 'N'");
bcApplet.ExecuteQuery(ForwardOnly);
var r = bcApplet.FirstRecord();
var iCnt = 0;
var code = "";
while (r) {
	code = bcApplet.GetFieldValue("Script");
	if (code.indexOf("System Integration") > -1) {
		trace(
			bcApplet.GetFieldValue("Parent Id") + "=" +
			bcApplet.GetFieldValue("Name"));
	}
	iCnt++;
	r = bcApplet.NextRecord();
}

trace(iCnt);

bcApplet = null;
boApplet = null;
