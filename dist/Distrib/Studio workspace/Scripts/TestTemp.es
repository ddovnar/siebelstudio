var meth = "11";
var logInfo = "";

logInfo += "Старт: " + new Date().toString() + "\n";
if (meth == "1") {
	var boCamp = TheApplication().GetBusObject("Campaign");
	var bcCamp = boCamp.GetBusComp("Campaign");

	bcCamp.SetViewMode(AllView);
	bcCamp.ActivateField("End Date");
	bcCamp.ClearToQuery();
	bcCamp.SetSearchExpr("[Id] = '1-23JPSEB'");
	bcCamp.ExecuteQuery(ForwardOnly);
	var isRec = bcCamp.FirstRecord();		
	while (isRec) {
		camps(boCamp, bcCamp, "1-23JPSEB");
		isRec = bcCamp.NextRecord();
	}
	bcCamp = null;
	boCamp = null;
} else {
	camps(null, null, "1-23JPSEB");
}

logInfo += "Финиш: " + new Date().toString();
trace(logInfo);
function camps(boCamp, bcCamp, campId) {
	var boCampaign;
	var bcCampaign;
	if (boCamp == null) {
		boCampaign = TheApplication().GetBusObject("Campaign");
		bcCampaign = boCampaign.GetBusComp("Campaign");
	} else {
		boCampaign = boCamp;
		bcCampaign = bcCamp;
	}
	var bcLoadWave = boCampaign.GetBusComp("Campaign Load Wave");
	var bcCampMem = boCampaign.GetBusComp("Campaign Members");
	//var boDialHist = TheApplication().GetBusObject("AL Cisco Dial History BO");
	//var bcDialHist = boDialHist.GetBusComp("AL Cisco Dial History BC");
	var boAction = TheApplication().GetBusObject("Action");
	var bcAction = boAction.GetBusComp("Action");
	var bcMVG;
	var bcSRC;
	
	bcAction.SetViewMode(AllView);
	bcAction.ActivateField("Type");
	bcAction.ActivateField("End Code");
	bcAction.ActivateField("Status");
	bcAction.ActivateField("Planned");
	bcAction.ActivateField("Contact Last Name");
	
	//bcDialHist.SetViewMode(AllView);
	//bcDialHist.ActivateField("Campaign Id");
	//bcDialHist.ActivateField("Call Date");
	//bcDialHist.ActivateField("Contact Id");
	//bcDialHist.SetSortSpec("Call Date(DESCENDING)");	

	bcCampMem.SetViewMode(AllView);
	bcCampMem.ActivateField("Load Wave Id");
	bcCampMem.ActivateField("Contact Id");
	bcCampMem.ActivateField("Call Completed");
		
	bcLoadWave.SetViewMode(AllView);
	bcLoadWave.ActivateField("Wave Number");

	if (boCamp == null) {
		bcCampaign.SetViewMode(AllView);
		bcCampaign.ActivateField("End Date");
		bcCampaign.ClearToQuery();
		bcCampaign.SetSearchExpr("[Id] = '" + campId + "'");
		bcCampaign.ExecuteQuery(ForwardOnly);
	}
	var isRec = bcCampaign.FirstRecord();
	var isRecCM = false;
	var icc = 0;
	while (isRec) {
		//bcDialHist.ClearToQuery();
		//bcDialHist.SetSearchExpr("[Campaign Id] = '" + bcCampaign.GetFieldValue("Id") + "'");
		//bcDialHist.ExecuteQuery(ForwardBackward);
		
		if (bcLoadWave.FirstRecord()) {
			bcCampMem.ClearToQuery();
			bcCampMem.SetSearchExpr("[Call Completed] <> 'Y' AND [Contact Id] IS NOT NULL");
			bcCampMem.ExecuteQuery(ForwardOnly);
			isRecCM = bcCampMem.FirstRecord();
			while (isRecCM) {
				trace(bcCampMem.GetFieldValue("Contact Id") + " " + bcCampMem.GetFieldValue("Load Wave Id"));
				//if (findCall(bcDialHist, bcCampMem.GetFieldValue("Contact Id"))) {
					bcAction.NewRecord(NewAfter);
					bcMVG = bcAction.GetMVGBusComp("Contact Last Name");
					bcMVG.SetViewMode(AllView);
					bcSRC = bcMVG.GetAssocBusComp();
					bcSRC.SetViewMode(AllView);
					bcSRC.ClearToQuery();
					bcSRC.SetSearchExpr("[Id] = '" + bcCampMem.GetFieldValue("Contact Id") + "'");
					bcSRC.ExecuteQuery(ForwardOnly);
					if (bcSRC.FirstRecord()) {
						bcSRC.Associate(true);
						//bcAction.SetFieldValue("Planned", bcDialHist.GetFieldValue("Call Date"));
						bcAction.SetFieldValue("Type", TheApplication().InvokeMethod("LookupValue","TODO_TYPE","Call - Outbound"));
						bcAction.SetFieldValue("Status", TheApplication().InvokeMethod("LookupValue","SR_STATUS","Closed"));
						//bcAction.SetFieldValue("End Code", TheApplication().InvokeMethod("LookupValue","AL_END_CODE","Не успешно"));
						bcAction.UndoRecord();
					} else {
						bcAction.UndoRecord();
					}
					bcMVG = null;
					bcSRC = null;
				//}
				isRecCM = bcCampMem.NextRecord();
				icc++;
			}
		}		
		isRec = bcCampaign.NextRecord();
	}
	trace("Recs:" + icc);
	bcAction = null;
	boAction = null;
	//bcDialHist = null;
	//boDialHist = null;	
	bcCampMem = null;
	bcLoadWave = null;
	if (boCamp == null) {
		bcCampaign = null;
		boCampaign = null;
	}
}

function findCall(bcDialHist, contactId) {
	var callFound = false;
	var rec = bcDialHist.FirstRecord();
	while (rec) {
		if (bcDialHist.GetFieldValue("Contact Id") == contactId) {
			callFound = true;
			break;
		}
		rec = bcDialHist.NextRecord();
	}
	return callFound;
}

function createAction(boCamp, bcCamp, CampId) {	
	var boCampaign;
	var bcCampaign;
	if (boCamp == null) {
		boCampaign = TheApplication().GetBusObject("Campaign");
		bcCampaign = boCampaign.GetBusComp("Campaign");
	} else {
		boCampaign = boCamp;
		bcCampaign = bcCamp;
	}
	var bcLoadWave = boCampaign.GetBusComp("Campaign Load Wave");
	//	var boCampMem = TheApplication().GetBusObject("Campaign Members");
	var bcCampMem = boCampaign.GetBusComp("Campaign Members");
	var boContact = TheApplication().GetBusObject("Contact");
	var bcContact = boContact.GetBusComp("Contact");
	var bcContactDialHistory = boContact.GetBusComp("AL Cisco Dial History BC");
	var bcAction = boContact.GetBusComp("Action");
	var stWaveId = "";
	
	bcCampaign.SetViewMode(AllView);
	bcCampaign.ClearToQuery();
	bcCampaign.SetSearchSpec("Id",CampId);
	bcCampaign.ExecuteQuery(ForwardOnly);
	if (bcCampaign.FirstRecord()) {
		bcLoadWave.SetViewMode(AllView);
		bcLoadWave.ActivateField("Wave Number");
		bcLoadWave.ExecuteQuery(ForwardOnly);
		if (bcLoadWave.FirstRecord()) {
			bcContact.SetViewMode(AllView);
			bcAction.SetViewMode(AllView);			
			bcAction.ActivateField("Type");
			bcAction.ActivateField("End Code");
			bcAction.ActivateField("Status");
			bcCampMem.SetViewMode(AllView);
		//	bcCampMem.ActivateField("Load Wave Id");
			bcCampMem.ActivateField("Contact Id");
			bcCampMem.ActivateField("Call Completed");
			bcCampMem.ClearToQuery();
			//bcCampMem.SetSearchSpec("Call Completed","<>Y");
			bcCampMem.ExecuteQuery(ForwardOnly);
			var isRec = bcCampMem.FirstRecord();
			while (isRec) {	
				bcContact.ClearToQuery();
				bcContact.SetSearchSpec("Id",bcCampMem.GetFieldValue("Contact Id"));
				bcContact.ExecuteQuery(ForwardOnly);
				if (bcContact.FirstRecord()) {
					trace("found");
					bcContactDialHistory.SetViewMode(AllView);
					bcContactDialHistory.ActivateField("Campaign Id");
					bcContactDialHistory.ActivateField("Call Date");
					bcContactDialHistory.ClearToQuery();
					bcContactDialHistory.SetSearchSpec("Campaign Id",CampId);
					bcContactDialHistory.SetSortSpec("Call Date(DESCENDING)");
					bcContactDialHistory.ExecuteQuery(ForwardOnly);
					/*
					bcAction.NewRecord(NewAfter);
					if (bcContactDialHistory.FirstRecord()) {
						bcAction.SetFieldValue("Planned",bcContactDialHistory.GetFieldValue("Call Date"));
					}
					bcAction.SetFieldValue("Type",TheApplication().InvokeMethod("LookupValue","TODO_TYPE","Call - Outbound"));
					bcAction.SetFieldValue("Status",TheApplication().InvokeMethod("LookupValue","SR_STATUS","Closed"));
					bcAction.SetFieldValue("End Code", TheApplication().InvokeMethod("LookupValue","AL_END_CODE","Не успешно"));
					bcAction.WriteRecord();*/
				} else trace("not found");	
				
				isRec = bcCampMem.NextRecord();
			}
		}

	}
	bcAction = null;
	bcContactDialHistory = null;
	bcContact = null;
	boContact = null;
	bcCampMem = null;
	bcLoadWave = null;
	if (boCamp == null) {
		bcCampaign = null;
		boCampaign = null;
	}
}
