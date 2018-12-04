//GetCardIsCardInfo();
//[Field: First Name]
/*var strTemp = "<img title=\"\" height=\"80\" alt=\"\" src=\"../IMAGES/Credit1.gif\" width=\"149\" align=\"middle\" border=\"0\" /> <font size=\"5\">[Field: First Name] [Field: Last Name] [Field: Middle Name] для [Field: Term] Вас нова пропозиція!!!</font>";
var r = "";
trace(strTemp);
r = strTemp.replace(/\[Field: StartDate]+/g, "[$startDate]");
r = r.replace(/\[Field: Term]+/g, "[$Term]");
r = r.replace(/\[Field: Sum]+/g, "[$Sum]");
r = r.replace(/\[Field: payOnMonth]+/g, "[$payOnMonth]");
r = r.replace(/\[Field: Pers]+/g, "[$Pers]");
trace(r);

function sSort(a, b) {
	if (a[0] == b[0])
		return a[1] < b[1] ? -1 : 1;
	else
		if (a[0] > b[0])
			return a[0] < b[0] ? -1 : 1;
		else
			return a[1] < b[1] ? -1 : 1;
}
*/

//GetCardIsCardInfo1();
//getEmailServer();

PickServer();

function PickServer() {
	var boOffer = TheApplication().GetBusObject("Offer");
	var bcOffer = boOffer.GetBusComp("Email Offer");

	bcOffer.SetViewMode(AllView);
	bcOffer.ActivateField("Name");
	//bcOffer.ActivateField("Email Server Name");
	bcOffer.ClearToQuery();
	bcOffer.SetSearchExpr("[Name]='" + "Test Srv offer" + "'");
	bcOffer.ExecuteQuery(ForwardOnly);
	if (bcOffer.FirstRecord()) {
		trace(bcOffer.GetFieldValue("Email Server Name"));
		var PickBC = bcOffer.GetPicklistBusComp("Email Server Name");
  		PickBC.ClearToQuery();
	  	PickBC.SetSearchExpr("[Server Type] = LookupValue ('SME_DD_SERVER_TYPE', 'E')");
	  	PickBC.ExecuteQuery(ForwardOnly);
	  	if(PickBC.FirstRecord())
  			PickBC.Pick();
  		bcOffer.WriteRecord();
	}
	bcOffer = null;
	boOffer = null;
}

function getEmailServer() {
	var boSrv = TheApplication().GetBusObject("Server");
	var bcSrv = boSrv.GetBusComp("DD Server");

	bcSrv.SetViewMode(AllView);
	bcSrv.ActivateField("Name");
	bcSrv.ActivateField("Server Type");
	bcSrv.ClearToQuery();
	bcSrv.SetSearchExpr("[Server Type] = LookupValue ('SME_DD_SERVER_TYPE', 'E')");
	bcSrv.ExecuteQuery(ForwardOnly);
	var r = bcSrv.FirstRecord();
	while (r) {
		trace(bcSrv.GetFieldValue("Id"));
		r = bcSrv.NextRecord();
	}
	bcSrv = null;
	boSrv = null;
}

function GetCardIsCardInfo()
{
	var picDealId = "427010";
	try
	{
		var bsService = TheApplication().GetService("CardPortType");
		wsInput = TheApplication().NewPropertySet();
		wsOutput = TheApplication().NewPropertySet();

		Params = TheApplication().NewPropertySet();
		Params.SetType("getCardDealInfoByICDealIdRequest:parameters");
		Params.SetProperty("MessageId", "");
		Params.SetProperty("MessageType", "Integration Object");
		Params.SetProperty("IntObjectName", "getCardDealInfoByICDealId");	
		Params.SetProperty("IntObjectFormat", "Siebel Hierarchical");

		var listOfgetCardDealInfoByICDealId = TheApplication().NewPropertySet();
		listOfgetCardDealInfoByICDealId.SetType("ListOfgetCardDealInfoByICDealId");
		Params.AddChild(listOfgetCardDealInfoByICDealId);

		var getCardDealInfoByICDealId = TheApplication().NewPropertySet();
		getCardDealInfoByICDealId.SetType("getCardDealInfoByICDealId");
		getCardDealInfoByICDealId.SetProperty("icDealId", picDealId);
		listOfgetCardDealInfoByICDealId.AddChild(getCardDealInfoByICDealId);
	
		wsInput.AddChild(Params);

		bsService.InvokeMethod("getCardDealInfoByICDealId", wsInput, wsOutput);

		if(	wsOutput.GetChildCount()>0
			&& wsOutput.GetChild(0).GetChildCount()>0
			&& wsOutput.GetChild(0).GetChild(0).GetChildCount()>0
  			&& wsOutput.GetChild(0).GetChild(0).GetChild(0).GetChildCount()>0
	  	)
		{
		    pcreditLimit = ToNumber(wsOutput.GetChild(0).GetChild(0).GetChild(0).GetChild(0).GetChild(0).GetProperty("creditLimit"))/100;			
		}

		trace("credit Limit:" + pcreditLimit);
	}
	catch(e)
	{
		trace(e.toString());
	}
}

function GetCardIsCardInfo1()
{
	var picDealId = "efront01";
	try
	{
		var bsService = TheApplication().GetService("AuthenticationPortType");
		wsInput = TheApplication().NewPropertySet();
		wsOutput = TheApplication().NewPropertySet();

		Params = TheApplication().NewPropertySet();
		Params.SetType("getUserPOSListInput:body");
		Params.SetProperty("MessageId", "");
		Params.SetProperty("MessageType", "Integration Object");
		Params.SetProperty("IntObjectName", "getUserPOSList");	
		Params.SetProperty("IntObjectFormat", "Siebel Hierarchical");

		var listOfgetCardDealInfoByICDealId = TheApplication().NewPropertySet();
		listOfgetCardDealInfoByICDealId.SetType("ListOfgetUserPOSList");
		Params.AddChild(listOfgetCardDealInfoByICDealId);

		var getCardDealInfoByICDealId = TheApplication().NewPropertySet();
		getCardDealInfoByICDealId.SetType("getUserPOSList");
		getCardDealInfoByICDealId.SetProperty("user", picDealId);
		listOfgetCardDealInfoByICDealId.AddChild(getCardDealInfoByICDealId);
	
		wsInput.AddChild(Params);

		bsService.InvokeMethod("getUserPOSList", wsInput, wsOutput);

		trace(wsOutput);
		/*if(	wsOutput.GetChildCount()>0
			&& wsOutput.GetChild(0).GetChildCount()>0
			&& wsOutput.GetChild(0).GetChild(0).GetChildCount()>0
  			&& wsOutput.GetChild(0).GetChild(0).GetChild(0).GetChildCount()>0
	  	)
		{
		    pcreditLimit = ToNumber(wsOutput.GetChild(0).GetChild(0).GetChild(0).GetChild(0).GetChild(0).GetProperty("creditLimit"))/100;			
		}

		trace("credit Limit:" + pcreditLimit);*/
	}
	catch(e)
	{
		trace(e.toString());
	}
}

