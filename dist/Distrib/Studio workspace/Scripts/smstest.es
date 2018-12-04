/*CreateActionBranch ("", "Collection", "test", "1-KYV73X", "SMS sended", "Activity", "60", 
	"", "", "", "", "", "", "Closed", "SMS - Outbound", "", "+380987654321", "1-23D2BAO");
*/

var svc1 = TheApplication().GetService("Workflow Process Manager");
var psInp1 = oApp.newPropertySet();
var psOut1 = oApp.newPropertySet();

psInp1.setProperty("ProcessName", "AL Get SMS Delivery Status Workflow");
psInp1.setProperty("Date From", "2013-10-14 10:00:00");
psInp1.setProperty("Date To", "2013-10-14 13:50:00");
psInp1.setProperty("Field Name", "MemberId");
psInp1.setProperty("Sender", "marketing");
psInp1.setProperty("Status is null", "0");
svc1.InvokeMethod("RunProcess", psInp1, psOut1);

trace(psOut1);
/*var boCamp = TheApplication().GetBusObject("Campaign");
var bcCamp = boCamp.GetBusComp("Campaign");
var bcResp = boCamp.GetBusComp("Response");
bcResp.SetViewMode(AllView);
bcResp.ActivateField("PR_CON_ID");
bcResp.ActivateField("SRC_ID");
bcResp.ActivateField("Description");
bcCamp.SetViewMode(AllView);
bcCamp.ClearToQuery();
bcCamp.SetSearchExpr("[Id] = '" + "1-1876HL2" + "'");
bcCamp.ExecuteQuery(ForwardOnly);
if (bcCamp.FirstRecord()) {
	bcResp.ClearToQuery();
	bcResp.SetSearchExpr("[PR_CON_ID]='" + "1-KZHI89" + "'");
	bcResp.ExecuteQuery(ForwardOnly);
	var respRec = bcResp.FirstRecord();
	var respCnt = 0;
	while (respRec) {
		trace(bcResp.GetFieldValue("Description"));
		respRec = bcResp.NextRecord();
		respCnt++;
	}
}
bcResp = null;
bcCamp = null;
boCamp = null;*/



var psInp = oApp.newPropertySet();
var psOut = oApp.newPropertySet();
psInp.addChild(psOut1);

Upload(psOut1, psOut);

trace(psOut);

/*var svc = TheApplication().GetService("AL Get SMS Delivery Status");
var psInp = oApp.newPropertySet();
var psOut = oApp.newPropertySet();
psInp.addChild(psOut1);
svc.InvokeMethod("Upload", psOut1, psOut);*/

function GetIsNeedCreateResponse(bcResp, contactId) {
	var isNeed = true;
	if (bcResp != null) {
		bcResp.ClearToQuery();
		bcResp.SetSearchExpr("[PR_CON_ID]='" + contactId + "'");
		bcResp.ExecuteQuery(ForwardOnly);
		var respRec = bcResp.FirstRecord();
		var respCnt = 0;
		while (respRec) {
			respRec = bcResp.NextRecord();
			respCnt++;
		}
		if (respCnt >= 2) {
			isNeed = false;
		}
		trace(respCnt + " " + contactId);
	}
	return isNeed;
}


function Upload(psInput, Outputs) {
	
	//WriteLog("AL Get SMS Delivery Status::Upload", "Ошибка", "0:" + psInput.GetChildCount());
	//if (psInput.GetChildCount() > 0)
	//	WriteLog("AL Get SMS Delivery Status::Upload", "Ошибка", "1:" + psInput.GetChild(0).GetChildCount());
	//if (psInput.GetChild(0).GetChildCount() > 0)
	//	WriteLog("AL Get SMS Delivery Status::Upload", "Ошибка", "2:" + psInput.GetChild(0).GetChild(0).GetChildCount());
	//if (psInput.GetChild(0).GetChild(0).GetChildCount() > 0)
	//	WriteLog("AL Get SMS Delivery Status::Upload", "Ошибка", "3:" + psInput.GetChild(0).GetChild(0).GetChild(0).GetChildCount());
	//	if (psInput.GetChild(0).GetChild(0).GetChild(0).GetChildCount() > 0)
	//	WriteLog("AL Get SMS Delivery Status::Upload", "Ошибка", "4:" + psInput.GetChild(0).GetChild(0).GetChild(0).GetChild(0).GetChildCount());
			
	if (psInput.GetChildCount() > 0 &&
		psInput.GetChild(0).GetChildCount() > 0 &&
		psInput.GetChild(0).GetChild(0).GetChildCount() > 0 && 
		psInput.GetChild(0).GetChild(0).GetChild(0).GetChildCount() > 0) {
		
		var respId = "";
		var deliveryStatus = "";
		var phoneNumber = "";
		var boCampaign = TheApplication().GetBusObject("Campaign");
		var bcCampaign = boCampaign.GetBusComp("Campaign");
		var bcResp = boCampaign.GetBusComp("Response");
		var bcCampaignMember = boCampaign.GetBusComp("Campaign Members");
		var statusText = "";
		var campProject = "";
		var campName = "";
		var NeedCreateResponse = true;
		var NeedCreateAction = true;
		
		try {
			bcResp.SetViewMode(AllView);
			bcResp.ActivateField("PR_CON_ID");
			
			bcCampaign.SetViewMode(AllView);
			bcCampaign.ActivateField("AL Sales Project");
			bcCampaign.ActivateField("Name");
			
			bcCampaignMember.SetViewMode(AllView);
			bcCampaignMember.ActivateField("Response Id");
			bcCampaignMember.ActivateField("Resource Id");
			bcCampaignMember.ActivateField("Campaign Id");
			bcCampaignMember.ActivateField("Contact Id");
			bcCampaignMember.ActivateField("Call Completed");
			bcCampaignMember.ActivateField("Comments");
			bcCampaignMember.ActivateField("Campaign Id");

			for (var i = 0; i < psInput.GetChild(0).GetChild(0).GetChild(0).GetChild(0).GetChildCount(); i++) {
				statusText = "";
				campProject = "";
				campName = "";

				bcCampaignMember.ClearToQuery();
				bcCampaignMember.SetSearchExpr("[Id] = '" + psInput.GetChild(0).GetChild(0).GetChild(0).GetChild(0).GetChild(i).GetProperty("fieldvalue"));
				bcCampaignMember.ExecuteQuery(ForwardOnly);
				if (bcCampaignMember.FirstRecord()) {
					NeedCreateResponse = true;
					NeedCreateAction = !(bcCampaignMember.GetFieldValue("Call Completed") == "Y");
					
					bcCampaign.ClearToQuery();
					bcCampaign.SetSearchExpr("[Id] = '" + bcCampaignMember.GetFieldValue("Campaign Id") + "'");
					bcCampaign.ExecuteQuery(ForwardOnly);
					if (bcCampaign.FirstRecord()) {
						campProject = bcCampaign.GetFieldValue("AL Sales Project");
						campName = bcCampaign.GetFieldValue("Name");
						NeedCreateResponse = GetIsNeedCreateResponse(bcResp, bcCampaignMember.GetFieldValue("Contact Id"));
					}
					
					deliveryStatus = psInput.GetChild(0).GetChild(0).GetChild(0).GetChild(0).GetChild(i).GetProperty("deliverystatus");
					phoneNumber = psInput.GetChild(0).GetChild(0).GetChild(0).GetChild(0).GetChild(i).GetProperty("mobilenumber");
					
					try {
						if (deliveryStatus == "sent")
							statusText = "СМС отправлено";
						if (deliveryStatus == "undelivered")
							statusText = "СМС не доставлено";
						if (deliveryStatus == "delivered")
							statusText = "СМС доставлено";
						
						if (statusText != "" && statusText == bcCampaignMember.GetFieldValue("Comments"))
							NeedCreateResponse = false;
						
						if (statusText != "")
							bcCampaignMember.SetFieldValue("Comments", statusText);
						
						if (deliveryStatus == "delivered")
							bcCampaignMember.SetFieldValue("Call Completed", "Y");
						else
							bcCampaignMember.SetFieldValue("Call Completed", "N");
						bcCampaignMember.WriteRecord();
					} catch(e) {
						WriteLog("AL Get SMS Delivery Status::Upload", "Ошибка", " Обновление участника:" + e.toString());
					}
					//if (deliveryStatus == "delivered") {
						psInput.GetChild(0).GetChild(0).GetChild(0).GetChild(0).GetChild(i).SetProperty("Campaign Id", bcCampaignMember.GetFieldValue("Campaign Id"));
						psInput.GetChild(0).GetChild(0).GetChild(0).GetChild(0).GetChild(i).SetProperty("Offer Id", GetOfferCampaign(bcCampaignMember.GetFieldValue("Campaign Id")));
						psInput.GetChild(0).GetChild(0).GetChild(0).GetChild(0).GetChild(i).SetProperty("Contact Id", bcCampaignMember.GetFieldValue("Contact Id"));
						psInput.GetChild(0).GetChild(0).GetChild(0).GetChild(0).GetChild(i).SetProperty("Response Desc", 
							TheApplication().InvokeMethod("LookupValue", "COMM_RESPONSE_TYPE", "Informed") + ". " + statusText);
						psInput.GetChild(0).GetChild(0).GetChild(0).GetChild(0).GetChild(i).SetProperty("Response Type", "Informed");
						psInput.GetChild(0).GetChild(0).GetChild(0).GetChild(0).GetChild(i).SetProperty("Response Date", "");
						psInput.GetChild(0).GetChild(0).GetChild(0).GetChild(0).GetChild(i).SetProperty("Response Method", 
							TheApplication().InvokeMethod("LookupValue", "RESPONSE_METHOD", "SMS"));
						psInput.GetChild(0).GetChild(0).GetChild(0).GetChild(0).GetChild(i).SetProperty("Response Status", "Closed");
						psInput.GetChild(0).GetChild(0).GetChild(0).GetChild(0).GetChild(i).SetProperty("Activity Id", "");
						psInput.GetChild(0).GetChild(0).GetChild(0).GetChild(0).GetChild(i).SetProperty("Campaign Complete", bcCampaignMember.GetFieldValue("Call Completed"));
						
						try {
							//WriteLog("AL Get SMS Delivery Status::Upload", "Ошибка", "create response");
							respId = "";
							if (NeedCreateResponse && NeedCreateAction) {
								respId = CreateResponse(psInput.GetChild(0).GetChild(0).GetChild(0).GetChild(0).GetChild(i));
								trace("response created");
							}
							//WriteLog("AL Get SMS Delivery Status::Upload", "Ошибка", "create response ok:" + respId);
						} catch(e) {
							WriteLog("AL Get SMS Delivery Status::Upload", "Ошибка", "Создание отклика:" + e.toString());
						}
						psInput.GetChild(0).GetChild(0).GetChild(0).GetChild(0).GetChild(i).SetProperty("Response Id", respId);
						
						if (deliveryStatus == "delivered" && NeedCreateAction) {
							try {
								CreateActionBranch(
									"", 
									campProject, 
									bcCampaignMember.GetFieldValue("Comments"), 
									bcCampaignMember.GetFieldValue("Contact Id"), 
									"Сообщение маркетинговой кампании " + campName + " доставлено", 
									"Activity", 
									"60", 
									"", 
									"", 
									"", 
									"", 
									"", 
									"", 
									"Closed", 
									"SMS - Outbound", 
									"", 
									phoneNumber,
									bcCampaignMember.GetFieldValue("Campaign Id")
								);
								trace("action created");
							} catch(e) {
								WriteLog("AL Get SMS Delivery Status::Upload", "Ошибка", "Создание действия SMS-Исходящее:" + e.toString());
							}
						}
					//}
				}
			}
		} catch(e) {
			WriteLog("AL Get SMS Delivery Status::Upload", "Ошибка", "Результата доставки:" + e.toString());
		} finally {
			bcCampaignMember = null;
			bcResp = null;
			bcCampaign = null;
			boCampaign = null;
		}
	}
}

function GetOfferCampaign(CampaignId)
{
	var offerId = "";
	var boCamp = TheApplication().GetBusObject("Campaign");
	var bcCamp = boCamp.GetBusComp("Campaign");
	var bcOffer = boCamp.GetBusComp("Offer");

	bcOffer.SetViewMode(AllView);
	bcOffer.ActivateField("Type");

	bcCamp.SetViewMode(AllView);
	bcCamp.ClearToQuery();
	bcCamp.SetSearchExpr("[Id]='" + CampaignId + "'");
	bcCamp.ExecuteQuery(ForwardOnly);

	//if (!bcCamp.FirstRecord()) {
		//TheApplication().RaiseErrorText("Не удалось найти кампанию. Обратитесь к администратору.");
	//}

	bcOffer.ClearToQuery();
	//bcOffer.SetSearchExpr("[Type]='Phone'");
	bcOffer.ExecuteQuery(ForwardOnly);
	if (bcOffer.FirstRecord())
		offerId = bcOffer.GetFieldValue("Id");
	
	//if (offerId == "")
		//TheApplication().RaiseErrorText("Не удалось найти предложение. Обратитесь к администратору.");

	bcOffer = null;
	bcCamp = null;
	boCamp = null;
	return offerId;
}

function CreateResponse (psInput)
{
	var svc = TheApplication().GetService("Workflow Process Manager");
	var InWF = TheApplication().NewPropertySet();
	var OutWF = TheApplication().NewPropertySet();	 
	var respId = "";
	InWF.SetProperty("Campaign Id",			psInput.GetProperty("Campaign Id"));
	InWF.SetProperty("Contact Id",			psInput.GetProperty("Contact Id"));
	InWF.SetProperty("Description", 		psInput.GetProperty("Response Desc"));
	InWF.SetProperty("Offer Id", 			psInput.GetProperty("Offer Id"));	
	//if (psInput.GetProperty("Response Date") == "")
	//	InWF.SetProperty("Response Date", 	Clib.ctime(Clib.time()));
	//else
		InWF.SetProperty("Response Date", 	psInput.GetProperty("Response Date"));
	InWF.SetProperty("Response Method", 	psInput.GetProperty("Response Method"));
	InWF.SetProperty("Response Type", 		psInput.GetProperty("Response Type"));
	InWF.SetProperty("Activity Id",			psInput.GetProperty("Activity Id"));
	InWF.SetProperty("Status",				psInput.GetProperty("Response Status"));
	InWF.SetProperty("Campaign Complete",	psInput.GetProperty("Campaign Complete"));
	InWF.SetProperty("PhoneNum",			psInput.GetProperty("mobilenumber"));
	InWF.SetProperty("AL Session Id",		psInput.GetProperty("Campaign Id"));	
	InWF.SetProperty("ProcessName",       "AL Response SmartScript");
	svc.InvokeMethod("RunProcess", InWF, OutWF);
	respId = OutWF.GetProperty("Resp Id");
	svc = null; InWF = null; OutWF = null;
	return respId;
}

function CreateActionBranch (AccountId, Project, Comment, ContactId, Descr, Display, Duration, 
	DivisionId, OwnedBy, Planned, Due, PlanComplet, PrimaryOwned, Status, Type, Priority, Phone, campaignId)
{	
	var svc = TheApplication().GetService("Workflow Process Manager");
	var InWF = TheApplication().NewPropertySet();
	var OutWF = TheApplication().NewPropertySet();	 

	InWF.SetProperty("Account Id",			AccountId);
	InWF.SetProperty("Activity Project",	Project);
	InWF.SetProperty("Comment",				Comment);
	InWF.SetProperty("Contact Id",			ContactId);
	InWF.SetProperty("Description",			Descr);
	InWF.SetProperty("Display",				Display);
	InWF.SetProperty("Duration Minutes",	"60");
	InWF.SetProperty("OPR Division Id",		DivisionId);
	InWF.SetProperty("Owned By",			OwnedBy);
	InWF.SetProperty("Planned",				Planned);
	InWF.SetProperty("Planned Completion",	PlanComplet);
	InWF.SetProperty("Primary Owned By",	PrimaryOwned);
	InWF.SetProperty("Due",					Due);
	InWF.SetProperty("Status",				Status);
	InWF.SetProperty("Type",				Type);
	InWF.SetProperty("Priority",			Priority);
	InWF.SetProperty("Phone",				Phone);

	InWF.SetProperty("ProcessName", 		"AL Action Visit Department SmartScript");
	svc.InvokeMethod("RunProcess", InWF, OutWF);
	var res = OutWF.GetProperty("Action Id");
	if (res != "") {
		/*TheApplication().GetProfileAttr("Me.Id")*/
		var bo = TheApplication().GetBusObject("Action");
		var bc = bo.GetBusComp("Action");
		bc.SetViewMode(AllView);
		bc.InvokeMethod("SetAdminMode", "TRUE");
		bc.ActivateField("Campaign Id");
		bc.ClearToQuery();
		bc.SetSearchExpr("[Id] = '" + res + "'");
		bc.ExecuteQuery(ForwardOnly);
		if (bc.FirstRecord()) {
			trace("dsds" + campaignId);
			bc.SetFieldValue("Campaign Id", campaignId);
			bc.WriteRecord();
		}
		bc = null;
		bo = null;
	}
	svc = null; InWF = null; OutWF = null;
	return res;
}

function WriteLog(pModule, pType, pDescription, pNamebk, pIdobj)
{
	/*var boJourSync = TheApplication().GetBusObject("AL Sync BO");
	var bcJourSync = boJourSync.GetBusComp("AL Sync BC");
    var vDescription;
   	try {
	  	Clib.strncat(vDescription,pDescription,1499);
	  	bcJourSync.NewRecord(1);
	  	bcJourSync.SetFieldValue("Module", pModule);
	  	bcJourSync.SetFieldValue("Eventtype", pType);
	  	bcJourSync.SetFieldValue("Vnote", vDescription);
	  	
	  	bcJourSync.WriteRecord();
	} finally {
//Сообщение
		boJourSync 	= null;
		bcJourSync	= null;
		vDescription= null;
	}*/
	trace("Module:" + pModule + " Type:" + pType + " Note:" + pDescription);
}
