/*var sr = TheApplication().GetService("Workflow Process Manager");
var inp = TheApplication().NewPropertySet();
var out = TheApplication().NewPropertySet();
inp.SetProperty("ProcessName", "Marketing Wave Launch");
inp.SetProperty("Wave Id", "1-23KATVP");
inp.SetProperty("Object Id", "1-23K8FPI");
try {
sr.InvokeMethod("RunProcess", inp, out);

trace(out);
} catch (e) {
	trace(e.toString());
}
out = null;
inp = null;
sr = null;

*/
//UpdateTask("1-23KHMBP", "1-23KHMC7");
//UpdateWaveStatus("1-23KHMBP");
//trace(TheApplication().InvokeMethod("LookupValue", "CAMP_LOAD_WAVE_STATUS", "Launched"));
//EventReg("1-23KHMBP", "1-23KHMC7");

//SendOffers("1-23KQFLX", "1-23KQFMF", GetListFormat());
//GenList();
//test1();

//trace(TheApplication().InvokeMethod("LookupName", "Email"));
var ps = TheApplication().NewPropertySet();
var r = ps.GetProperty("Test");
if (r == null)
trace("test");

/*
var s = "дтк-284995/38,дтк-285001/38";
var arAsset = s.split(",");
var stAssetSearch="";
for (var i=0;i<arAsset.length;i++)
{
	if (i==0) {
		stAssetSearch = "'"+arAsset[i]+"'";
	} if (i == arAsset.length-1 && arAsset[i].indexOf("&") > 0) {
		stAssetSearch += " OR [Account Number] = '"+arAsset[i].substring(0,arAsset[i].length-(arAsset[i].length - arAsset[i].indexOf("&")))+"'";
	} else {
		stAssetSearch += " OR [Account Number] = '"+arAsset[i]+"'";
	}
} 

trace(stAssetSearch);*/

function testLov() {
	var bo = TheApplication().GetBusObject("List Of Values (Internal)");
	var bc = bo.GetBusComp("List Of Values (Internal)");

	bc.SetViewMode(AllView);
	bc.ActivateField("Type");
	bc.ActivateField("Name");
	bc.ClearToQuery();
	bc.SetSearchExpr("[Active] = 'Y' AND [Type] = 'EMARKETING_SUB_TYPE'");
	bc.ExecuteQuery(ForwardOnly);
	var r = bc.FirstRecord();
	var vals = "";
	while (r) {
		vals = TheApplication().InvokeMethod("LookupValue", bc.GetFieldValue("Type"), bc.GetFieldValue("Name"));
		trace(bc.GetFieldValue("Type") + "." + bc.GetFieldValue("Name") + ":" + vals);
		r = bc.NextRecord();
	}
	bc = null;
	bo = null;
}

function test11() {
	trace("test1");
	var bo = TheApplication().GetBusObject("Offer");
	var bc = bo.GetBusComp("Marketing Server Detail");
	bc.SetViewMode(AllView);
	bc.ActivateField("OES");
	bc.ActivateField("Server Id");
	bc.ActivateField("Server Type");
	bc.ActivateField("Type");
	bc.ActivateField("Value Read Only");
	bc.ActivateField("Value");
	bc.ActivateField("View Name");
	bc.ActivateField("View Name Read Only");
	bc.ActivateField("Web Service Id");
	bc.ActivateField("Web Service Port Id");
	bc.ActivateField("Web Service Port Name");
	bc.ActivateField("Web Service Read Only");
	bc.ClearToQuery();
	bc.SetSearchExpr("[Server Type] = 'Email Marketing Server'");
	bc.ExecuteQuery(ForwardOnly);
	trace("ddd1");
	var r = bc.FirstRecord();
	while (r) {
		trace("OES:" + bc.GetFieldValue("OES"));
	trace("Server Id:" + bc.GetFieldValue("Server Id"));
	trace("Server Type:" + bc.GetFieldValue("Server Type"));
	trace("Type:" + bc.GetFieldValue("Type"));
	trace("Value Read Only:" + bc.GetFieldValue("Value Read Only"));
	trace("Value:" + bc.GetFieldValue("Value"));
	trace("View Name:" + bc.GetFieldValue("View Name"));
	trace("View Name Read Only:" + bc.GetFieldValue("View Name Read Only"));
	trace("Web Service Id:" + bc.GetFieldValue("Web Service Id"));
	trace("Web Service Port Id:" + bc.GetFieldValue("Web Service Port Id"));
	trace("Web Service Port Name:" + bc.GetFieldValue("Web Service Port Name"));
	trace("Web Service Read Only:" + bc.GetFieldValue("Web Service Read Only"));
		r = bc.NextRecord();
	}
	bc = null;
	bo = null;
}

function testOffer() {
	var bo = TheApplication().GetBusObject("Offer");
	var bc = bo.GetBusComp("Email Offer Template");

	bc.SetViewMode(AllView);
	bc.ActivateField("Substitution Box");
	bc.ActivateField("Substitution Flag");
	bc.ActivateField("Substitution Type");
	
	bc.ClearToQuery();
	bc.SetSearchExpr("[Id] = '1-23KPBQA'");
	bc.ExecuteQuery(ForwardOnly);
	if (bc.FirstRecord()) {
		trace(bc.GetFieldValue("Substitution Box"));
		trace(bc.GetFieldValue("Substitution Flag"));
		trace(bc.GetFieldValue("Substitution Type"));
		bc.SetFieldValue("Substitution Type", "Related URL");
		bc.WriteRecord();
		trace(bc.GetFieldValue("Substitution Type"));
		trace("ok");
	}
	bc = null;
	bo = null;
}
function UpdateTask(WaveId, TaskId) {
	var sr = TheApplication().GetService("Wave Execution");
	var inp = TheApplication().NewPropertySet();
	var out = TheApplication().NewPropertySet();

	inp.SetProperty("Wave Id", WaveId);
	inp.SetProperty("Task Id", TaskId);
	inp.SetProperty("Type", TheApplication().InvokeMethod("LookupValue", "MKTG_PROCESS_CD", "Wave Launch"));
	inp.SetProperty("Status", TheApplication().InvokeMethod("LookupValue", "MKTG_TASK_STATUS", "In Progress"));
	sr.InvokeMethod("UpdateTask", inp, out);
	trace(out);
	inp = null;
	out = null;
	sr = null;
}

function UpdateWaveStatus(WaveId) {
	var sr = TheApplication().GetService("Wave Execution");
	var inp = TheApplication().NewPropertySet();
	var out = TheApplication().NewPropertySet();

	inp.SetProperty("Wave Id", WaveId);
	inp.SetProperty("Status", TheApplication().InvokeMethod("LookupValue", "CAMP_LOAD_WAVE_STATUS", "Launched"));
	sr.InvokeMethod("UpdateWaveStatus", inp, out);
	trace(out);
	inp = null;
	out = null;
	sr = null;
}

function EventReg(WaveId, TaskId) {
	var sr = TheApplication().GetService("Wave Execution");
	var inp = TheApplication().NewPropertySet();
	var out = TheApplication().NewPropertySet();

	inp.SetProperty("Wave Id", WaveId);
	inp.SetProperty("Task Id", TaskId);	
	sr.InvokeMethod("EventRegistration", inp, out);
	trace(out);
	inp = null;
	out = null;
	sr = null;
}

function GetListFormat() {
	var sr = TheApplication().GetService("Mktg Saw Service");
	var inp = TheApplication().NewPropertySet();
	var out = TheApplication().NewPropertySet();

	var boCamp = TheApplication().GetBusObject("Campaign");
	var bcCamp = boCamp.GetBusComp("Campaign");
	bcCamp.SetViewMode(AllView);
	bcCamp.ActivateField("Source Code");
	bcCamp.ActivateField("Name");
	bcCamp.ActivateField("Offer Number");
	bcCamp.ActivateField("Primary Offer Name");
	bcCamp.ActivateField("DNIS");

	bcCamp.ClearToQuery();
	bcCamp.SetSearchExpr("[Name] = 'Test Email'");
	bcCamp.ExecuteQuery(ForwardOnly);
	if (bcCamp.FirstRecord()) {
		inp.SetProperty("campaignID", bcCamp.GetFieldValue("Id"));
		inp.SetProperty("campaignCode", bcCamp.GetFieldValue("Source Code"));
		inp.SetProperty("campaignName", bcCamp.GetFieldValue("Name"));
		inp.SetProperty("offerCode", bcCamp.GetFieldValue("Offer Number"));
		inp.SetProperty("offerName", bcCamp.GetFieldValue("Primary Offer Name"));
		inp.SetProperty("waveID", "");
		inp.SetProperty("DNISNumber", bcCamp.GetFieldValue("DNIS"));
	}
	sr.InvokeMethod("GetReportParams", inp, out);
	trace(out);
	
	bcCamp = null;
	boCamp = null;
	inp = null;
	//out = null;
	sr = null;
	return out;
}

function SendOffers(WaveId, TaskId, ReportParams) {
	var sr = TheApplication().GetService("Wave Execution");
	var inp = TheApplication().NewPropertySet();
	var out = TheApplication().NewPropertySet();

	inp.SetProperty("Wave Id", WaveId);
	inp.SetProperty("Task Id", TaskId);	
	inp.SetProperty("User Name", "DDovnar");
	inp.SetProperty("Parallel Process", "true");
	inp.AddChild(ReportParams);
	try {
	sr.InvokeMethod("SendOffers", inp, out);
	} catch (e) {
		trace(e.toString());
	}
	trace(out);
	inp = null;
	out = null;
	sr = null;
}

function GenList() {
	var sr = TheApplication().GetService("Mktg List Export Service");
	var inp = TheApplication().NewPropertySet();
	var out = TheApplication().NewPropertySet();

	inp.SetProperty("BusObjName", "Campaign");
	inp.SetProperty("BusCompName", "Campaign Recipient");
	//inp.SetProperty("Fields", "[First Name],[Last Name]");
	inp.SetProperty("FileName", "testlist.txt");
	inp.SetProperty("SearchSpec", "[Id]='1-23KHMBU'");
	inp.SetProperty("LanguageCode", "ENU");
	inp.SetProperty("LocaleCode", "ENU");
	var f = TheApplication().NewPropertySet();
	f.SetProperty("First Name", "Pupkin");
	f.SetType("Fields");
	inp.AddChild(f);
	sr.InvokeMethod("WriteQueryResult", inp, out);
	trace(out);
	inp = null;
	out = null;
	sr = null;
}

function test1() {
	var sr = TheApplication().GetService("Mktg List Export Service");
	var inp = TheApplication().NewPropertySet();
	var out = TheApplication().NewPropertySet();
	trace("start");
inp.SetProperty("ContentDescription","[Wave Id]='1-23KHOYO' AND [Marked For Deletion]='N' AND [Subwave Num]='1'");
inp.SetProperty("ListDistributionId", "1-23KB5RH7");
inp.SetProperty("Task Id", "1-23KHMC7");
inp.SetProperty("Wave Id", "1-23KHMBP");
//inp.SetProperty("Language Code", "ENU");
//inp.SetProperty("OfferInfo", "1");
inp.SetProperty("OfferId", "1-23K8FOU");
inp.SetProperty("CampaignId", "1-23KB1SW");
//"ProcessName" List Export (Internal)
inp.SetProperty("Send File", "true");
inp.SetProperty("RecipientsFile", "\\\\siebeltest3\\siebelfs\\Marketing\\Lists\\1-23KHOZ7-1-23KHOYO-1-09042013104929AM.txt");
inp.SetProperty("RecordCount", "1");
trace("ddd");
sr.InvokeMethod("SendEmail", inp, out);
trace("vvvv");
	trace(out);
	inp = null;
	out = null;
	sr = null;
//inp.SetProperty("OfferName", "TestJIN");
}
//.........REQUIRED TYPES.......
//CONSUME_DATA_SRC
//AAG_ADMIN_INFO
