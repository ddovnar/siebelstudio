var boContact = TheApplication().GetBusObject("Contact");
var bcContact = boContact.GetBusComp("Contact");
var bcAction = boContact.GetBusComp("Action");

trace(TheApplication().InvokeMethod("LookupValue", "AL_RESULT_CONTACT", "Call Later"));
bcAction.SetViewMode(AllView);
bcAction.ActivateField("AL Result Contact");
bcAction.ActivateField("Last Dialed Number");

bcContact.SetViewMode(AllView);
bcContact.ClearToQuery();
bcContact.SetSearchExpr("[Id] = '" + "1-KYV73X" + "'");
bcContact.ExecuteQuery(ForwardOnly);
if (bcContact.FirstRecord()) {
	bcAction.ClearToQuery();
	bcAction.SetSearchExpr("[Id] = '" + "1-23K9ZBM" + "'");
	bcAction.ExecuteQuery(ForwardOnly);
	if (bcAction.FirstRecord()) {
		//bcAction.SetFieldValue("AL Result Contact", TheApplication().InvokeMethod("LookupValue", "AL_RESULT_CONTACT", "Call Later"));
		//bcAction.SetFieldValue("Last Dialed Number", "24242");
		//bcAction.WriteRecord();
		trace(bcAction.GetFieldValue("Id") + " d" + bcAction.GetFieldValue("AL Result Contact"));
	}
}

bcAction = null;
bcContact = null;
boContact = null;

function testok() {
var boService = TheApplication().GetBusObject("Repository Business Service");
var bcService = boService.GetBusComp("Repository Business Service");
var bcServiceScr = boService.GetBusComp("Repository Business Service Server Script");

bcServiceScr.SetViewMode(AllView);
bcServiceScr.ActivateField("Name");
bcServiceScr.ActivateField("Script");


bcService.SetViewMode(AllView);
bcService.ActivateField("Name");
bcService.ClearToQuery();
bcService.SetSearchExpr("[Name]='AL Get Campaign Offer'");
bcService.ExecuteQuery(ForwardOnly);
if (bcService.FirstRecord()) {
	bcServiceScr.ExecuteQuery(ForwardOnly);
	var r = bcServiceScr.FirstRecord();
	while (r) {
		trace(bcServiceScr.GetFieldValue("Script"));
		r = bcServiceScr.NextRecord();
	}
}
bcServiceScr = null;
bcService = null;
boService = null;
}
