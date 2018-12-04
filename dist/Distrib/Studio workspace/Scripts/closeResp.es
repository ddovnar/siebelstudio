var pp = TheApplication().NewPropertySet();

var boContact = TheApplication().GetBusObject("Contact");
var bcResponse = boContact.GetBusComp("Response");
bcResponse.ClearToQuery();
bcResponse.ExecuteQuery(ForwardOnly);
var r = bcResponse.FirstRecord();
var i = 0;
while (r) {
	if (i == 4) {
		trace(bcResponse.GetFieldValue("Id"));
		break;
	}
	r = bcResponse.NextRecord();
	i++;
}

pp.SetProperty("contact", bcResponse);
trace(pp);
test(pp);

bcResponse = null;
boContact = null;

function test(p) {
	var o = p.GetProperty("contact");
	trace("obj:" + o.GetFieldValue("Id"));
}

function DeleteCampObject(responseId, campaignId, commentResp, salesMethod, salesStage, reason) {
/*
������� ������� ������, �������� � ������, ������� ���� ������� �� ����� ����������� ��������.
*/
	var boContact = TheApplication().GetBusObject("Contact");
	var bcResponse = boContact.GetBusComp("Response");
	var bcAction = boContact.GetBusComp("Action");
	var bcOpportunity = boContact.GetBusComp("Opportunity");
	
	// ������
	bcOpportunity.SetViewMode(AllView);
	bcOpportunity.InvokeMethod("SetAdminMode","TRUE");
	bcOpportunity.ActivateField("Sales Method");
	bcOpportunity.ActivateField("Sales Stage");
	bcOpportunity.ActivateField("Closure Summary");
	bcOpportunity.ActivateField("SalesMethod_SalesStage");
	bcOpportunity.ActivateField("Reason Won Lost");
	// ��������
	bcAction.SetViewMode(AllView);
	bcAction.InvokeMethod("SetAdminMode","TRUE");
	bcAction.ActivateField("Opportunity Id");
	// ������
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
				// �������� ������
				if ((salesMethod != null && salesMethod != "") &&
				    (salesMethod != null && salesMethod != "")) {
					bcOpportunity.SetFieldValue("Sales Method", salesMethod);
					bcOpportunity.SetFieldValue("Sales Stage", salesStage);
					bcOpportunity.SetFieldValue("Closure Summary", commentResp);
					bcOpportunity.SetFieldValue("Reason Won Lost", reason);
					bcOpportunity.WriteRecord();					
				} else
					TheApplication().RaiseErrorText("�� ������� ���������� ����� ������� � ������ ������� ��������!");
			}
			//�������� ��������
			bcAction.SetFieldValue("Status", TheApplication().InvokeMethod("LookupValue", "SR_STATUS", "Cancelled"));
			bcAction.WriteRecord();
		}
		bcResponse.DeleteRecord();
	}
	
	bcOpportunity = null;
	bcAction = null;
	bcResponse = null;
	boContact = null
}

function GetSalesStage(SalesMethod) {
	var boSCD = TheApplication().GetBusObject("Sales Cycle Def");
	var bcSM = boSCD.GetBusComp("Sales Method");
	var bcSCD = boSCD.GetBusComp("Sales Cycle Def");
	var SalesStage = "";
	
	bcSCD.SetViewMode(AllView);
	bcSCD.ActivateField("AL User Failure Flag");
	bcSCD.ActivateField("Sales Cycle Stage");
	
	bcSM.SetViewMode(AllView);
	bcSM.ActivateField("Name");
	bcSM.ClearToQuery();
	bcSM.SetSearchExpr("[Name]='" + SalesMethod + "'");
	bcSM.ExecuteQuery(ForwardOnly);
	if (bcSM.FirstRecord()) {
		bcSCD.ClearToQuery();
		bcSCD.ExecuteQuery(ForwardOnly);
		var r = bcSCD.FirstRecord();
		while (r) {
			if (bcSCD.GetFieldValue("AL User Failure Flag") == "Y") {
				SalesStage = bcSCD.GetFieldValue("Sales Cycle Stage");
				r = false;
				break;
			}
			r = bcSCD.NextRecord();
		}
		r = null;
	}
	bcSCD = null;
	bcSM = null;
	boSCD = null;
	return SalesStage;
}
