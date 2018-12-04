var offer = 
"<p>[Field: Account Id]test todo</p>" +
"<p><img alt=\"\" src=\"ftp://172.17.12.163/account_myinfo.jpg\" border=\"0\" /><img height=\"80\" alt=\"\" src=\"ftp://172.17.12.163/account_myinfo.jpg\" width=\"80\" border=\"0\" /></p>";
/*
var urlftp = "ftp://172.17.12.163";
var urlmab = "http://mab-alfa.kiev.ua";
var re = new RegExp(urlftp, "g");
offer = offer.replace(re,urlmab);
*/
//offer = ReplaceResourceURL(offer);
//trace(offer);
//http://siebelunleashed.com/how-to-setup-email-response-in-siebel/

//DeleteObjects("1-23JXE0B");

/*
TheApplication().TraceOn(logPath + "ResponseToIO.log","Allocation","All");
TheApplication().Trace("write Inputs PS to file");
TheApplication().TraceOff();
AL Dispatch Interview View

*/

var ids = "[Id]= '" + "1-23JSZ7F" + "' or [Id] = '" + "1-23JN2XZ" + "' or [Id]='" + "1-23JU6Q7" + "'";
trace(FindLastComment(ids));

var t = getArrResp(ids);
trace(t.toString());

var lastdt = t[0][2];
var lastItem = 0;
for (var i = 0; i < t.length; i++) {
	if (lastdt < t[i][2]) {
		lastdt = t[i][2];
		lastItem = i;
	}
}

trace("lastItem:" + lastItem);
trace("date:" + lastdt);
trace("last comment:" + t[lastItem][1]);

function FindLastComment(respIds) {
	var bo = TheApplication().GetBusObject("Contact");
	var bc = bo.GetBusComp("Response");
	var comment = "";
	
	bc.SetViewMode(AllView);
	bc.ActivateField("Reject Comment");
	
	bc.ClearToQuery();
	bc.SetSearchExpr("(" + respIds + ") AND [Reject Comment] IS NOT NULL");
	bc.SetSortSpec("Response Date (DESCENDING)");
	bc.ExecuteQuery(ForwardOnly);
	if (bc.FirstRecord())
		comment = bc.GetFieldValue("Reject Comment");
	bc = null;
	bo = null;
	return comment;	
}

function getArrResp(respIds) {
	var bo = TheApplication().GetBusObject("Contact");
	var bc = bo.GetBusComp("Response");
	var comment = "";
	var arrResp = new Array();
	
	bc.SetViewMode(AllView);
	bc.ActivateField("Reject Comment");
	bc.ActivateField("Response Date");
	
	bc.ClearToQuery();
	bc.SetSearchExpr("(" + respIds + ") AND [Reject Comment] IS NOT NULL");
	bc.SetSortSpec("Response Date (DESCENDING)");
	bc.ExecuteQuery(ForwardOnly);
	var r = bc.FirstRecord();
	var item = 0;
	while (r) {
		var arrItem = new Array();
		arrItem[0] = bc.GetFieldValue("Id");
		arrItem[1] = bc.GetFieldValue("Reject Comment");
		arrItem[2] = bc.GetFieldValue("Response Date");
		arrResp[item] = arrItem;
		r = bc.NextRecord();
		item++;
	}
	bc = null;
	bo = null;
	return arrResp;
}

function StringToDate(sDate) {
// Параметры : 
// sDate  :  строка в формате "mm/dd/yyyy" или "mm/dd/yyyy hh:mm:ss"
// Returns : объект типа Даты
	var ArDateTime = sDate.split (" ");
	var  ArDate = ArDateTime[0];
	var  splitDate = ArDate.split ("/");
	var nDay = splitDate[1];
	var nMonth = splitDate[0];
	var nYear = splitDate[2];
	if (ArDateTime.length == 1)
		 return (new Date(nYear, nMonth-1 , nDay))
	else {
		var ArTime = ArDateTime[1];
		var splitTime = ArTime.split(":");
		if (splitTime[0]=="00" && splitTime[1]=="00" && splitTime[2]=="00" ) 
			return (new Date(nYear, nMonth-1 , nDay))
		else {
			var nHours   = splitTime[0];
			var nMinutes = splitTime[1];
			var nSeconds = splitTime[2];
			return (new Date(nYear,nMonth-1,nDay, nHours, nMinutes, nSeconds));
		}
	}
}

function DeleteObjects(responseId) {
	var bo = TheApplication().GetBusObject("Contact");
	var bcResponse = bo.GetBusComp("Response");
	var bcAction = bo.GetBusComp("Action");
	var bcOpportunity = bo.GetBusComp("Opportunity");
	
	bcOpportunity.SetViewMode(AllView);
	bcOpportunity.InvokeMethod("SetAdminMode","TRUE");
	
	bcAction.SetViewMode(AllView);
	bcAction.InvokeMethod("SetAdminMode","TRUE");
	bcAction.ActivateField("Opportunity Id");
	
	bcResponse.SetViewMode(AllView);
	bcResponse.InvokeMethod("SetAdminMode","TRUE");
	bcResponse.ActivateField("Activity Id");
	bcResponse.ClearToQuery();
	bcResponse.SetSearchSpec("Id", responseId);
	bcResponse.ExecuteQuery(ForwardOnly);
	if (bcResponse.FirstRecord()) {		
		bcAction.ClearToQuery();
		bcAction.SetSearchSpec("Id", bcResponse.GetFieldValue("Activity Id"));
		bcAction.ExecuteQuery(ForwardOnly);
		if (bcAction.FirstRecord()) {			
			bcOpportunity.ClearToQuery();
			bcOpportunity.SetSearchSpec("Id", bcAction.GetFieldValue("Opportunity Id"));
			bcOpportunity.ExecuteQuery(ForwardOnly);
			if (bcOpportunity.FirstRecord()) {
				//bcOpportunity.DeleteRecord();
				trace("OppID: " + bcOpportunity.GetFieldValue("Id"));
			}
			trace("ActionID: " + bcAction.GetFieldValue("Id"));
			//bcAction.DeleteRecord();
		}
		trace("RespID: " + bcResponse.GetFieldValue("Id"));
		//bcResponse.DeleteRecord();
	}
	bcOpportunity = null;
	bcAction = null;
	bcResponse = null;
	bo = null
}


function ReplaceResourceURL(offerText) {
	var urlftp = GetSysParam("Marketing FTP Resource URL", "");/*"ftp://172.17.12.163";*/
	var urlmab = GetSysParam("Marketing MAB Resource URL", "");/*"http://mab-alfa.kiev.ua";*/

	trace(urlftp);
	trace(urlmab);
	var re = new RegExp(urlftp, "g");
	
	offerText = offerText.replace(re, urlmab);
	return offerText;
}

function GetSysParam(paramName, defValue){
	var paramValue = "";
	var boSysPref = TheApplication().GetBusObject("System Preferences");
	var bcSysPref = boSysPref.GetBusComp("System Preferences");
	bcSysPref.ActivateField("Name");
	bcSysPref.ActivateField("Value");
	bcSysPref.ClearToQuery();
	bcSysPref.SetSearchSpec("Name", paramName);
	bcSysPref.ExecuteQuery(ForwardOnly);
	if (bcSysPref.FirstRecord())
		paramValue = bcSysPref.GetFieldValue("Value");
	else
		paramValue = defValue;
	bcSysPref=null;
	boSysPref=null;
	if (paramValue == "TRUE")
		return true;
	if (paramValue == "FALSE")
		return false;
	return paramValue;
}
