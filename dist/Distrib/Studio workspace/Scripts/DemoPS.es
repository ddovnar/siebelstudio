Inputs;
// Save invoked service method
TheApplication().SetProfileAttr("TheadCallEvent", "DTB MC Run Presentation");
TheApplication().SetProfileAttr("TheadCallMethod", "Run");
var spropname = Inputs.GetFirstProperty();
var i = 0;
while (spropname != "" && spropname != null ) {
	TheApplication().SetProfileAttr("CallEvtParam" + i, spropname + "=" + ps.GetProperty(spropname));
	spropname = Inputs.GetNextProperty();
	i++;
}
TheApplication().SetProfileAttr("CallEvtParamCount", i);


// reinvoke service method
if (TheApplication().GetProfileAttr("TheadCallEvent") != "") {
	var threadEvent = TheApplication().GetProfileAttr("TheadCallEvent");
	var threadMethod = TheApplication().GetProfileAttr("TheadCallMethod");
	var paramCount = TheApplication().GetProfileAttr("CallEvtParamCount");
	var pc = 0;
	if (paramCount != "")
		pc = ToNumber(paramCount);

	var threadSrv = TheApplication().GetService(threadEvent);
	var psInp = TheApplication().NewPropertySet();

	var pattr = "";
	var c = -1;
	var pname = "";
	var pval = "";
	for (var i = 0; i < pc; i++) {
		pattr = TheApplication().GetProfileAttr("CallEvtParam" + i);
		c = s.indexOf("=");
		pname = "";
		pval = "";
		if (c > -1) {
			pname = pattr.substring(0, c);
			pval = pattr.substring(c+1, pattr.length);
			psInp.SetProperty(pname, pval);
		}
	}
}
