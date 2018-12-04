//SetCount("1-23JTJVZ");

var Inputs = TheApplication().NewPropertySet();
var Outputs = TheApplication().NewPropertySet();

//Inputs.SetProperty("TaxId", "3003011212");
//Inputs.SetProperty("Channel", "mab_splash");
//Inputs.SetProperty("T24Id", "406804");

Inputs.SetProperty("TaxId", "55533447");
Inputs.SetProperty("Channel", "mab_splash");
Inputs.SetProperty("T24Id", "2625453");


trace(Inputs);
getOfferTest(Inputs, Outputs);

//getBanner("1-KYV73X",Outputs);

Outputs.SetProperty("ResponseCode", "decline");
trace("resp:" + Outputs);
//RegisterResponse(Outputs, Outputs);
//trace(Outputs);

function getOfferTest(Inputs,Outputs)
{
//Inputs:
	var taxId;
	var t24Id;
	var channel;

//operating variables:
	var contactId;
	var campaignMemberId;
	var campaignId;
	var campaignLoadWaveId;
	var campaignLoadWaveOfferId;
	var searchStr;
	var isRecord;
	var isRec;
	var showNum;
	var templateId;
	var product;
	var dialAttempts;
	var isPreApprove;
	var FirstName;
	var MiddleName;
	var FullName;

	var activeBO = TheApplication().GetBusObject("Contact");
	var	activeBC = activeBO.GetBusComp("Contact");	
	var AactiveBO=TheApplication().GetBusObject("Campaign Members");
	var activeBC1=AactiveBO.GetBusComp("Campaign Load Wave Offer");	
	var AactiveBC=AactiveBO.GetBusComp("Campaign Members");

	
//Outputs:
	var errorCode;
	var errorMsg;
	
	try
	{
		taxId = Inputs.GetProperty("TaxId");
		t24Id = Inputs.GetProperty("T24Id");
		channel = TheApplication().InvokeMethod("LookupValue", "GET_OFFER_CHANNEL", Inputs.GetProperty("Channel"));
		trace("ok");
		if((channel=='')||(channel==null))
		{
			trace("ddd");
			noRecordsFound(Outputs, "1:" + Inputs.GetProperty("Channel"));
			return;
		}
		///-----------------------------------------------------------------------------------
		with(activeBC)
		{
			SetViewMode(AllView);
			ClearToQuery();
		
			ActivateField("DL Number");
			ActivateField("T24 Id");
			ActivateField("Id");
			ActivateField("First Name");
			ActivateField("Middle Name");
			ActivateField("Prospect Flag");
			
			//Проверка правильного ИНН
			var myRE = new RegExp(/^([0-9])\1{9}$/);
			var results = taxId.match(myRE);
			if(results != null)
			//if(1 == 1)
			{
				//Если ИНН неправильный - поиск в контактах по t24Id
				searchStr  = "[T24 Id] = '" + t24Id + "'";
				trace("found by t24");
			}
			else
			{
				//Если ИНН правильный - поиск в контактах по ИНН
				searchStr  = "[DL Number] = '" + taxId + "'";
				trace("found by INN");
			}
			searchStr += " AND [Prospect Flag]<>'Y'";//SD-386844, Balaban Ivan 19.01.2012
			SetSearchExpr(searchStr);
			
			ExecuteQuery(ForwardBackward);

			trace("ok1");
			if(FirstRecord())
			{
				trace("ok2");
				//Получение данных контакта
				contactId=GetFieldValue("Id");
				trace("Contact Id:" + contactId + " INN:" + GetFieldValue("DL Number"));
				FirstName=GetFieldValue("First Name");
				MiddleName=GetFieldValue("Middle Name");
				
				//Перевод имени и отчества контакта в нормальный формат (Иван Иванович)
				var tmpName1=FirstName.toUpperCase();
				var tmpName2=FirstName.toLowerCase();
			
					FullName=tmpName1.substr(0,1)+tmpName2.substr(1)+" ";

				tmpName1=MiddleName.toUpperCase();
				tmpName2=MiddleName.toLowerCase();
			
					FullName+=tmpName1.substr(0,1)+tmpName2.substr(1);
			}
			else
			{
				noRecordsFound(Outputs, "2:" + searchStr);
				return;
			}
		}

		//-----------------------------------------------------------------------------------
		// *********************************** CR-9344 Губенко А.Н. Вызов ротатора баннеров по MAB
		trace("check channel:" + channel);
		if (channel == 'MAB')
		{
			getBanner(contactId,Outputs);
			Outputs.SetProperty("Pers",FullName);
			Outputs.SetProperty("ErrorMsg","");
			Outputs.SetProperty("ErrorCode",0);
		}
		else
		{
		// ***********************************
			with(AactiveBC) //Campaign Members
			{
				SetViewMode(AllView);
				ClearToQuery();
				ActivateField("Contact Id");
				ActivateField("Outcome");
				ActivateField("Id");
				searchStr = "= '" + contactId + "' AND (([Outcome] <> 'Interested' AND [Outcome] <> 'Not Interested') OR [Outcome] is null) AND [Campaign Status] = 'Launched'";
				SetSearchSpec("Contact Id",searchStr);
				SetSortSpec("AL Priority(ASCENDING)");
				ExecuteQuery(ForwardOnly);
			
				var N = CountRecords();
				if(N == 0)
				{
					noRecordsFound(Outputs, "3:" + searchStr);
					return;
				}
				isRecord = FirstRecord();
				while(isRecord)
				{
					campaignMemberId = GetFieldValue("Id");
					campaignId = GetFieldValue("Campaign Id");
				
					//-----------------------------------------------------------------------------------
					activeBC = null;
					activeBC=AactiveBO.GetBusComp("Campaign Load Wave");
				
					with(activeBC)
					{
						SetViewMode(AllView);
						ClearToQuery();
						ActivateField("Status");
						ActivateField("Id");
						searchStr = "[Status] = 'Launched'";
						SetSearchExpr(searchStr);
						ExecuteQuery(ForwardOnly);
						isRec = FirstRecord();
						if(isRec)
						{
							campaignLoadWaveId=GetFieldValue("Id");
						}
						else
						{
							campaignLoadWaveId = null;
							noRecordsFound(Outputs, "4:" + searchStr);
							//return;
						}
					}
	
					//-----------------------------------------------------------------------------------
					activeBO = null;
					activeBO=TheApplication().GetBusObject("Campaign");
					activeBC = null;
					activeBC=activeBO.GetBusComp("Campaign List Contact");
				
					with(activeBC)
					{
						SetViewMode(AllView);
						ClearToQuery();			
						ActivateField("Dial Attempts");
						ActivateField("Contact Id");
						searchStr = "[Contact Id] = '"+contactId+"'";
						SetSearchExpr(searchStr);
						ExecuteQuery(ForwardOnly);
						isRec = FirstRecord();
						if(isRec)
						{
							dialAttempts = GetFieldValue("Dial Attempts");
							if (!dialAttempts)
								dialAttempts = 0;
							dialAttempts = 1*dialAttempts;
						}
						else
						{
							dialAttempts = null;
							noRecordsFound(Outputs, "5:" + searchStr);
							//return;
						}
					}
				
					//-----------------------------------------------------------------------------------
					activeBO = null;
					activeBO=TheApplication().GetBusObject("Campaign Load Wave");
					activeBC = null
					activeBC = activeBO.GetBusComp("Campaign Load Wave");
				
					with(activeBC)
					{
						SetViewMode(AllView);
						ClearToQuery();
						ActivateField("Id");
						searchStr = "[Id] = '" + campaignLoadWaveId + "'";
						SetSearchExpr(searchStr);
						ExecuteQuery(ForwardOnly);
						var boolRecord = FirstRecord(); 
					}
				
					//-----------------------------------------------------------------------------------
					with(activeBC1)
					{
						SetViewMode(AllView);
						ClearToQuery();
						ActivateField("Type");
						ActivateField("Id");
						ActivateField("AL Show Num");
						ActivateField("Product");
						ActivateField("PreApprove Check");
						SetSearchSpec("Type",channel);
						ExecuteQuery(ForwardOnly);
						isRec = FirstRecord();
						var fi = "fi0";
						var find = 0;
						while(isRec)
						{
							fi = "fi:" + campaignLoadWaveOfferId;
							campaignLoadWaveOfferId = GetFieldValue("Id");
							showNum = GetFieldValue("AL Show Num");
							isPreApprove = GetFieldValue("PreApprove Check");
							if (!showNum)
								showNum = 0;
							showNum = 1 * showNum;
							if((showNum == 0)||(showNum>dialAttempts))
							{
								templateId = GetFieldValue("AL Pattern Id");
								if (isPreApprove == 'Y')
								{
									find=1;
									product = GetFieldValue("Product");
									runWorkflow(taxId,product,Outputs);
								}
								else
								{
									Outputs.SetProperty("endDate","");
									Outputs.SetProperty("startDate","");
									Outputs.SetProperty("Term","");
									Outputs.SetProperty("Sum","");
									Outputs.SetProperty("payOnMonth","");			
								}
								Outputs.SetProperty("Pers",FullName);
								Outputs.SetProperty("TemplateId",templateId);
								Outputs.SetProperty("CampaignMemberId",campaignMemberId+"|"+campaignId+"|"+campaignLoadWaveOfferId);
								Outputs.SetProperty("ErrorMsg","");
								Outputs.SetProperty("ErrorCode",0);
								campaignLoadWaveOfferId =null;
								product =null;
								templateId = null;
								return;
							}
							isRec = NextRecord();
						}
						if(find == 0)
						{
							noRecordsFound(Outputs, "6:" + fi + " campaignLoadWaveId=" + campaignLoadWaveId + "showNum=" + showNum + " dialAttempts" + dialAttempts + " channel=" + channel);
						}
						fi = null;
					}
					//-----------------------------------------------------------------------------------
					isRecord = NextRecord();
				}
			}
		}
	}
	catch(e)
	{
		if(defined(e.errText))
		{
			errorMsg = "An exception occurred in the [" +
			activeBO.Name() + "] object, in ["+
			activeBC.Name() + "] business component." +
			" ERROR: " + e.errText +" STACK: " +
			e.toString();
			errorCode= e.errCode;
			Outputs.SetProperty("ErrorMsg",errorMsg);
			Outputs.SetProperty("ErrorCode",errorCode);
		}
		else
		{
			errorMsg ="An exception occurred in the [" +
			activeBO.Name() + "] object, in ["+
			activeBC.Name() +"] business component." +
			" STACK: " + e.toString();
			errorCode= e.errCode;
			Outputs.SetProperty("ErrorMsg",errorMsg);
			Outputs.SetProperty("ErrorCode",errorCode);
		}
	}
	finally
	{
		AactiveBC = null;
		AactiveBO = null;
		activeBC1 = null;
		activeBC = null;
		activeBO = null;
		campaignLoadWaveId= null;
		channel = null;
		taxId = null;
		t24Id = null;
		contactId= null;
		campaignMemberId= null;
		campaignId= null;
		campaignLoadWaveOfferId= null;
		searchStr= null;
		isRecord= null;
		isRec= null;
		showNum= null;
		templateId= null;
		product= null;
		dialAttempts= null;
		errorCode= null;
		errorMsg= null;
	}
}


function ParseStr(InputStr, resPS)
{
	//Получение campaignMemberId, campaignId, offerId из строки 
 	var sep = "|";
	var firstIndex = InputStr.indexOf(sep);
	var lastIndex = InputStr.lastIndexOf(sep);
  
	try {
  		if (firstIndex != -1 && firstIndex != lastIndex) {
   			Str1 = InputStr.substring (0, firstIndex);
		   	Str2 = InputStr.substring (firstIndex + 1, lastIndex);
   			Str3 = InputStr.substring (lastIndex + 1);
  		} else
   			TheApplication().RaiseErrorText("CampaignMemberId is incorrect");
 	} catch (e) {
  		throw e;
 	} finally {
  		firstIndex = null;
  		lastIndex = null;
  		sep = null;
  		InputStr = null;
 	}
 	resPS.SetProperty("Campaign Member Id", Str1);
 	resPS.SetProperty("Campaign Id", Str2);
 	resPS.SetProperty("Offer Id", Str3);
}
function RegisterResponse(Inputs, Outputs)
{
	var responseCode = -1;
	var cBO;
	var cMBC;
	var rBC;
	var cBC;
	var campaignMemberId;
	var campaignId;
	var offerId;
	var contactId;
	var offerPickBC;
	var contactPickBC;
	var dialAttempts;

	var tempPS = TheApplication().NewPropertySet();
	try
	{
		//-Get Inputs param-----------------------------------------------------------------------------------
		ParseStr(Inputs.GetProperty("CampaignMemberId"), tempPS);
		campaignMemberId = tempPS.GetProperty("Campaign Member Id");
		campaignId = tempPS.GetProperty("Campaign Id");
		offerId = tempPS.GetProperty("Offer Id");

		responseCode1 = TheApplication().InvokeMethod("LookupValue", "REGISTER_RESPONSE_CODE", Inputs.GetProperty("ResponseCode")); // decline (не интересно) - 0, accept (интересно) - 1
		
if (responseCode1 == "0") responseCode = 0;
		else if (responseCode1 == "1") responseCode = 1;
		else if (responseCode1 == "2") responseCode = 2;
		//-Declaration Bus Comp-------------------------------------------------------------------------------
		cBO = TheApplication().GetBusObject("Campaign");
		cMBC = cBO.GetBusComp("Campaign List Contact");
		rBC = cBO.GetBusComp("Response");
		cBC = cBO.GetBusComp("Campaign");
		
		//-Searching Campaign---------------------------------------------------------------------------------
		cBC.SetViewMode(AllView);
		cBC.ClearToQuery();
		cBC.SetSearchSpec("Id", campaignId);
		cBC.ExecuteQuery(ForwardOnly);
		
		if (!cBC.FirstRecord())
			TheApplication().RaiseErrorText("CampaignId " + campaignId + " not found");
		
	
		//-Searching Campaign Member--------------------------------------------------------------------------
		cMBC.SetViewMode(AllView);
		cMBC.InvokeMethod("SetAdminMode", "TRUE");
		cMBC.ActivateField("Type");
		cMBC.ActivateField("Contact Id");
		cMBC.ActivateField("Outcome");
		cMBC.ActivateField("Dial Attempts");
		cMBC.ClearToQuery();
		cMBC.SetSearchSpec("Id", campaignMemberId);
		cMBC.ExecuteQuery(ForwardBackward);
		
		if(!cMBC.FirstRecord())
			TheApplication().RaiseErrorText("CampaignMemberId " + campaignMemberId + " not found");
		
		//-Set Outcome----------------------------------------------------------------------------------------
		switch (responseCode)
		{
			case 0:
				cMBC.SetFieldValue("Outcome", TheApplication().InvokeMethod("LookupValue", "CAMPAIGN_OUTCOME", "Not Interested"));
			break;
			
			case 1:
				cMBC.SetFieldValue("Outcome", TheApplication().InvokeMethod("LookupValue", "CAMPAIGN_OUTCOME", "Interested"));
			break;
			
			case 2:
				cMBC.SetFieldValue("Outcome", TheApplication().InvokeMethod("LookupValue", "CAMPAIGN_OUTCOME", "Ignored"));
			break;
			
			default:
				TheApplication().RaiseErrorText("ResponseCode not matched: " + responseCode);
		}
		dialAttempts = cMBC.GetFieldValue("Dial Attempts") *1 + 1;
		cMBC.SetFieldValue("Dial Attempts", dialAttempts);
		cMBC.WriteRecord();
		//Activate fields-------------------------------------------------------------------------------------
		contactId = cMBC.GetFieldValue("Contact Id");
		rBC.InvokeMethod("SetAdminMode", "TRUE");
		rBC.ActivateField("Response Method");
		rBC.ActivateField("Response Type");
		rBC.ActivateField("Description");
		rBC.ActivateField("Status");
		rBC.ActivateField("Media Name");
		rBC.ActivateField("Contact Last Name");
		rBC.ClearToQuery();
		rBC.ExecuteQuery(ForwardBackward);
		//-Creating response---------------------------------------------------------------------------------
		rBC.NewRecord(NewAfter);
		try
		{
			offerPickBC = rBC.GetPicklistBusComp("Media Name");
			with (offerPickBC)
			{
				ClearToQuery();
				SetSearchSpec("Media Id", offerId);
				ExecuteQuery(ForwardOnly);
				if(FirstRecord())
					Pick();
				else
					TheApplication().RaiseErrorText("Offer Id " + offerId + " not found");
			}
			contactPickBC = rBC.GetPicklistBusComp("Contact Last Name");
			with (contactPickBC)
			{
				ClearToQuery();
				SetSearchSpec("Id", contactId);
				ExecuteQuery(ForwardOnly);
				if(FirstRecord())
				Pick();
				else
				TheApplication().RaiseErrorText("Contact Id " + contactId + " not found");
			}
			rBC.SetFieldValue("Response Method", TheApplication().InvokeMethod("LookupValue", "RESPONSE_METHOD", "Web"));
			switch (responseCode)
			{
				case 0:
				rBC.SetFieldValue("Response Type", TheApplication().InvokeMethod("LookupValue", "COMM_RESPONSE_TYPE", "No Interest"));
				rBC.SetFieldValue("Description", "Не интересно");
				rBC.SetFieldValue("Status", TheApplication().InvokeMethod("LookupValue", "FINS_CALLRPT_STATUS_MLOV", "Closed"));
				break;
			
					case 1:
				rBC.SetFieldValue("Response Type", TheApplication().InvokeMethod("LookupValue", "COMM_RESPONSE_TYPE", "Respondent Interested"));
				rBC.SetFieldValue("Description", "Интересно");
				rBC.SetFieldValue("Status", TheApplication().InvokeMethod("LookupValue", "FINS_CALLRPT_STATUS_MLOV", "Pending"));
				break;
			
					case 2:
				rBC.SetFieldValue("Response Type", "Респондент недоступен"); //TheApplication().InvokeMethod("LookupValue", "COMM_RESPONSE_TYPE", "Unclassified response"));
				rBC.SetFieldValue("Description", "Ignored");
				rBC.SetFieldValue("Status", TheApplication().InvokeMethod("LookupValue", "FINS_CALLRPT_STATUS_MLOV", "Closed"));
				break;
			
					default:
				TheApplication().RaiseErrorText("ResponseCode not matched");
			}
			rBC.WriteRecord();
		}
		catch(e)
		{
			rBC.UndoRecord();
			throw e;
		}
		Outputs.SetProperty("ErrorCode", "0");
		Outputs.SetProperty("ErrorMsg", "");
	}
	catch(e)
	{
		Outputs.SetProperty("ErrorCode", e.errCode);
		Outputs.SetProperty("ErrorMsg", e.errText);
	}
	finally
	{
		responseCode = null;
		cBO = null;
		cMBC = null;
		rBC = null;
		cBC = null;
		campaignMemberId = null;
		campaignId = null;
		offerId = null;
		contactId = null;
		offerPickBC = null;
		contactPickBC = null;
		dialAttempts = null;
	}
}
function Service_PreCanInvokeMethod (MethodName, CanInvoke)
{
 if (MethodName == "RegisterResponse")
 {
  CanInvoke = "TRUE";
  return (CancelOperation);
 }

 if (MethodName == "getOffer")
 {
  CanInvoke = "TRUE";
  return (CancelOperation);
 }

   if (MethodName == "getOfferTemplate")
 {
  CanInvoke = "TRUE";
  return (CancelOperation);
 }

 return (ContinueOperation);
}
function Service_PreInvokeMethod (MethodName, Inputs, Outputs)
{

 if (MethodName == "RegisterResponse")
 {
  RegisterResponse(Inputs, Outputs);
  return (CancelOperation);
 }


   if (MethodName == "getOffer")
 {
  getOffer(Inputs, Outputs);

  return (CancelOperation);
 }

  if (MethodName == "getOfferTemplate")
 {
  getOfferTemplate(Inputs, Outputs);
  return (CancelOperation);
 }


  return (ContinueOperation);
}
function SetCount(MembId)
{
	// CR-9344 Губенко А.Н.
	// Увеличение счётчика показаных баннеров участника кампании по каналу MAB
	// В случае достижения максимального числа показов - установка статуса на участнике кампании "Готово"
	trace("SetCount work");
	var CampaignBO = TheApplication().GetBusObject("Campaign");
	var CampaignBC = CampaignBO.GetBusComp("Campaign");
	var MemberBC = CampaignBO.GetBusComp("Campaign Members");
	var OfferBC = CampaignBO.GetBusComp("Offer");
	trace("Offer present");
	var cnt, cntMax = 0;
	var searchStr, Camp = "";
	
	with (MemberBC)
	{	
		SetViewMode(AllView);
		ClearToQuery();
		ActivateField("# Attempts");
		searchStr = "[Id] = '" + MembId + "'";
		SetSearchExpr(searchStr);
		ExecuteQuery(ForwardBackward);
		var fr = FirstRecord();
		trace("eee");
		if (fr)
		{
			trace("fff");
			Camp = GetFieldValue("Campaign Id");  	//Получение Id кампании
			cnt = GetFieldValue("# Attempts") * 1; 	//Кол-во показаных баннеров

			CampaignBC.SetViewMode(AllView);
			CampaignBC.ClearToQuery();
			CampaignBC.SetSearchExpr("[Id]='" + Camp + "'");
			CampaignBC.ExecuteQuery(ForwardOnly);
			if (CampaignBC.FirstRecord()) {
				OfferBC.SetViewMode(AllView);
				OfferBC.ClearToQuery();
				OfferBC.ActivateField("AL Show Num");
				searchStr = "[Campaign Id] = '" + Camp + "' AND [Type] = 'MAB'";
				OfferBC.SetSearchExpr(searchStr);
				trace("bbb");
				OfferBC.ExecuteQuery(ForwardBackward);
				trace("kkk");
				var fr1 = OfferBC.FirstRecord();
				trace("mmm");
				if (fr1) {
					trace("vvv");
					cntMax = OfferBC.GetFieldValue("AL Show Num") * 1; 	//Максимальное кол-во баннеров
				}
				if (cnt < cntMax)
					SetFieldValue("# Attempts", cnt + 1);	//Увеличение счётчика
				else 
					SetFieldValue("Call Completed", "Y");
				WriteRecord();	
			}
		}
	}
	trace("cntMax:" + cntMax);
	trace("cnt:" + cnt);
	OfferBC = null;
	MemberBC = null;
	CampaignBO = null;
}
function WriteLogError(ErrCode, Errmess)
{
	//CR-9344 Губенко А.Н.
	try
	{
		var boLog = TheApplication().GetBusObject("AL Log IVR BO");
		var bcLog = boLog.GetBusComp("AL Log IVR");  
		bcLog.ActivateField("Error Code");
		bcLog.ActivateField("Error Msg");
		bcLog.InvokeMethod("SetAdminMode", "TRUE");
		bcLog.NewRecord(NewAfter);
		bcLog.SetFieldValue("Error Code",ErrCode);
		bcLog.SetFieldValue("Error Msg",Errmess);
		bcLog.WriteRecord();
		boLog = null;
		bcLog = null;
	}
	catch(e)
	{
		var res = e.errCode + " " + e.errText;
		TheApplication().RaiseErrorText(ErrCode + " " + Errmess  + " " + res);
	}
}
function countRecords(id_offer,id_contact)
{
	//Получение кол-ва откликов
   	var activeBO=TheApplication().GetBusObject("Campaign Members");
  	var activeBC=activeBO.GetBusComp("Response");
	var searchStr;

	with(activeBC)
	{
  		SetViewMode(AllView);
  		ClearToQuery();
    	ActivateField("Offer Id");
    	searchStr = "[Offer Id] = '" + id_offer + "' AND [PR_CON_ID] = '"+id_contact+"'";
  		SetSearchExpr(searchStr);
  		ExecuteQuery(ForwardOnly);
    	return CountRecords();
 	}
}
function getApprove(PropSet)
{
	var type = PropSet.GetType();
	if(type == "ListOfgetPreApproveItem")
 	{
  		PropSet=PropSet.GetChild(0);
  		return PropSet;
 	}
 	else
 	{
  		PropSet=PropSet.GetChild(0);
  		return getApprove(PropSet);
  	}
}
function getBanner(ContactId,Outputs)
{
//CR-9344 Губенко А.Н. "Ротатор баннеров"
//Outputs:
	var errorCode;
	var errorMsg;	
	trace("getBanner:" + ContactId);
//operating variables:
	
	var searchStr = "";				// поисковая строка
	var memberId = "";				// Id участника кампании
	var campaignId = "";			// Id участника кампании + | + Id предложения + | + Id кампании 
	var showText = "";				// место показа текста (Баннер, Popup-окно)
	var textBanner = "";			// текст баннера
	var fr = false;
	
//BO	
	var CampaignBO = TheApplication().GetBusObject("Campaign");
//BC
	var	BannerBC = CampaignBO.GetBusComp("AL Get Banner BC");	

	try
	{
		trace("1111");
		with (BannerBC)
		{
			// Выбираем все записи в Campaign Members по данному контакту
			SetViewMode(AllView);
			ActivateField("Text");
			ActivateField("Place Text");	
			ActivateField("Member Id");	
			ActivateField("Campaign Member Id");		
			ClearToQuery();
			searchStr = "[Contact Id] = '"+ ContactId + "'";//"' and rownum = 1" 
			SetSearchExpr(searchStr); // ИНН участника кампании
			ExecuteQuery(ForwardOnly);
			fr = FirstRecord();
			
			if (fr) 
			{
				textBanner = GetFieldValue("Text");
				showText = GetFieldValue("Place Text");
				memberId = GetFieldValue("Member Id");
				campaignId = GetFieldValue("Campaign Member Id");
				
				Outputs.SetProperty("CampaignMemberId", campaignId);			
				//Вместо "старого" TemplateId выдаём символ [ плюс memberId 
				Outputs.SetProperty("TemplateId","[" + memberId);
				Outputs.SetProperty("PlaceText",showText);
				Outputs.SetProperty("Text",textBanner);	
				trace("fff" + Outputs);		
				// Увеличение счётчика показаных баннеров участника кампании по каналу MAB
				SetCount(memberId);
			}
			else
			{
				Outputs.SetProperty("CampaignMemberId", "");			
				Outputs.SetProperty("TemplateId","");
				Outputs.SetProperty("PlaceText","");
				Outputs.SetProperty("TemplateText","");		
				trace("vvv:" + Outputs);
			}
		}
		trace("Result" + Outputs);
	}
	catch(e)
	{	
		errorMsg = e.toString();
		errorCode= e.errCode;
		Outputs.SetProperty("ErrorMsg",errorMsg);
		Outputs.SetProperty("ErrorCode",errorCode);
		trace(Outputs);
		WriteLogError(errorCode, "AL Get Campaign Offer::GetBanner: Ошибка получения текста баннера. " + errorMsg);		
	}
	finally 
	{
		BannerBC = null;
		CampaignBO = null;
	}
}
// test
function getBanner_old(ContactId,Outputs) {
//CR-9344 Губенко А.Н. "Ротатор баннеров"

//Outputs:
	var errorCode;
	var errorMsg;	
	
//operating variables:
	var searchStr = "";				// поисковая строка
	var memberId = "";				// Id участника кампании
	var campaignId = "";			// Id кампании 
	var offerId = "";;				// Id предложения
	var priority = 0;; 				// приоритет кампании
	var campArray = new Array();	// массив
	var showMaxNum = 0;				// кол-во допустимых к показу баннеров по кампании (максимально)
	var countSend = 0;				// кол-во показаных баннеров по участнику кампании
	var showText = "";				// место показа текста (Баннер, Popup-окно)

	var i = 0;						// переменная для счётчика элементов массива
	var fr, fr1, sArray = false;
	var noRecords = false

// all variables for date
	var dt = new Date(); 							//текущая дата
	var month = dt.getMonth() + 1; 					//месяц
	var day = dt.getDate();							//день
	var year = dt.getFullYear();					//год
	var hour = dt.getHours();						//час 
	var minutes = dt.getMinutes();					//минуты
	var second = dt.getSeconds();					//секунды
	if (second <= 9) second = "0" + second;
	if (month <= 9) month = "0" + month;
	var strToday = month + "/" + day + "/" + year + " " + hour + ":" + minutes + ":" + second;	//дата в нужном формате ММ/ДД/ГГГГ		




	
//BO	
	var CampaignBO = TheApplication().GetBusObject("Campaign");
	var OfferBO = TheApplication().GetBusObject("Offer");
	var MemberBO = TheApplication().GetBusObject("Campaign Members");

//BC
	var	CampaignBC = CampaignBO.GetBusComp("Campaign");	
	var	OfferBC = CampaignBO.GetBusComp("Offer");	
	var	MABOfferBC = OfferBO.GetBusComp("AL MAB Offer");		
	var MemberBC = MemberBO.GetBusComp("Campaign Members");

	

	try
	{
		with (MemberBC)
		{
			// Выбираем все записи в Campaign Members по данному контакту
			SetViewMode(AllView);
			ClearToQuery();
			ActivateField("Campaign Id");
			ActivateField("# Attempts");
			ActivateField("Id");
			searchStr = "[Contact Id] = '" + ContactId + "'";
			SetSearchExpr(searchStr);
			ExecuteQuery(ForwardBackward);
			fr = FirstRecord()
			while (fr)
			{
				fr1 = false;
				priority = 0;
				countSend = 0;
				showMaxNum = 1;
				campaignId = GetFieldValue("Campaign Id");
				memberId = GetFieldValue("Id");
				if (GetFieldValue("# Attempts")) 
					countSend = GetFieldValue("# Attempts") * 1;		
				// Получаем все запущеные кампании участника 
				with (CampaignBC)
				{
					SetViewMode(AllView);
					ClearToQuery();
					ActivateField("Priority");
					ActivateField("Name");
					searchStr = "[Id] = '" + campaignId + "' AND [AL Channel Sales] = 'MAB' AND [Status] = 'Launched' AND [Start Date]<='" + strToday + "' AND [End Date]>='" + strToday + "'"; 
					SetSearchExpr(searchStr);
					ExecuteQuery(ForwardBackward);
					fr1 = FirstRecord()
					if(fr1)
					{	
						fr1 = false;
						if (GetFieldValue("Priority"))  	// приоритет кампании
							priority = GetFieldValue("Priority") * 1
						else 
						 	priority = 6; 
						// Получение макс. кол-ва показов баннеров 
						with (OfferBC)
						{
							SetViewMode(AllView);
							ClearToQuery();
							ActivateField("Id");
							searchStr = "[Campaign Id] = '" + campaignId + "' AND [Type] = 'MAB'";
							SetSearchExpr(searchStr);
							ExecuteQuery(ForwardBackward);
							fr1 = FirstRecord()
							if(fr1)
							{
								fr1 = false;
								offerId = GetFieldValue("Id"); // Id предложения
								showText = GetFieldValue("Show Text"); // Место отображения текста (в баннере или попап-окне)
								with (MABOfferBC)
								{
									SetViewMode(AllView);
									ClearToQuery();
									ActivateField("AL Show Num");
									searchStr = "[Id] = '" + offerId + "'";
									SetSearchExpr(searchStr);
									ExecuteQuery(ForwardBackward);
									fr1 = FirstRecord()
									if(fr1)
									{
										if (GetFieldValue("AL Show Num")) showMaxNum = GetFieldValue("AL Show Num"); // макс. кол-во показов банеров
									}
									else
									{
										noRecords = true;
										noRecordsFound(Outputs, "3:AL MAB Offer:: " + searchStr);
										//return;
									}
								}
							}
							else
							{
								noRecords = true;
								noRecordsFound(Outputs, "2:Offer:: " + searchStr);
								//return;
							}							
						}
					}
					else
					{
						noRecords = true;
						noRecordsFound(Outputs, "1:Campaign:: " + searchStr);
						//return;
					}					
				}
				//Проверка кол-ва отправленых баннеров по участнику на превышение лимита отправки по предложению
				countSend = countSend * 1;
				showMaxNum = showMaxNum * 1;
				if (countSend < showMaxNum && !noRecords)	
				{
					campArray [i]= [[priority],[countSend],[memberId],[offerId],[showText]]; //Занесение в массив приоритета, количество попыток показов баннеров, Id участника
					sArray = true;
				}
				fr = NextRecord();
				noRecords = false;
				i++;
			}
		}
		// Сортируем кампании по возрастанию приоритетов (если приоритеты равны - сортировка по кол-ву показов). Первые - самые перспективные для показа.
		if (sArray) 
		{
			campArray.sort(sSort);
			memberId = campArray[0][2];	//берём у массива первое значение memberId 
			showText = campArray[0][4];	//берём у массива первое значение showText 
			offerId = campArray[0][3]; 	// и его же значение offerId 
			Outputs.SetProperty("CampaignMemberId", memberId+"|"+campaignId+"|"+offerId);			
			//Вместо "старого" TemplateId выдаём символ [ плюс memberId 
			Outputs.SetProperty("TemplateId","[" + memberId);
			Outputs.SetProperty("PlaceText","[" + showText);
			// Увеличение счётчика показаных баннеров участника кампании по каналу MAB
			SetCount(memberId);
		}
	}
	catch(e)
	{	
		errorMsg = e.toString();
		errorCode= e.errCode;
		Outputs.SetProperty("ErrorMsg",errorMsg);
		Outputs.SetProperty("ErrorCode",errorCode);
		WriteLogError(errorCode, "AL Get Campaign Offer::GetBanner: Ошибка получения текста баннера. " + errorMsg);		
	}
	finally 
	{
		MemberBC = null;
		MABOfferBC = null;
		OfferBC = null;
		CampaignBC = null;
		MemberBO = null;
		OfferBO = null;
		CampaignBO = null;
		campArray = null;
	}
}
function getOffer(Inputs,Outputs)
{
//Inputs:
	var taxId;
	var t24Id;
	var channel;

//operating variables:
	var contactId;
	var campaignMemberId;
	var campaignId;
	var campaignLoadWaveId;
	var campaignLoadWaveOfferId;
	var searchStr;
	var isRecord;
	var isRec;
	var showNum;
	var templateId;
	var product;
	var dialAttempts;
	var isPreApprove;
	var FirstName;
	var MiddleName;
	var FullName;

	var activeBO = TheApplication().GetBusObject("Contact");
	var	activeBC = activeBO.GetBusComp("Contact");	
	var AactiveBO=TheApplication().GetBusObject("Campaign Members");
	var activeBC1=AactiveBO.GetBusComp("Campaign Load Wave Offer");	
	var AactiveBC=AactiveBO.GetBusComp("Campaign Members");

	
//Outputs:
	var errorCode;
	var errorMsg;
	
	try
	{
		taxId = Inputs.GetProperty("TaxId");
		t24Id = Inputs.GetProperty("T24Id");
		channel = TheApplication().InvokeMethod("LookupValue", "GET_OFFER_CHANNEL", Inputs.GetProperty("Channel"));
		if((channel=='')||(channel==null))
		{
			noRecordsFound(Outputs, "1:" + Inputs.GetProperty("Channel"));
			return;
		}
		///-----------------------------------------------------------------------------------
		with(activeBC)
		{
			SetViewMode(AllView);
			ClearToQuery();
		
			ActivateField("DL Number");
			ActivateField("T24 Id");
			ActivateField("Id");
			ActivateField("First Name");
			ActivateField("Middle Name");
			ActivateField("Prospect Flag");
			
			//Проверка правильного ИНН
			var myRE = new RegExp(/^([0-9])\1{9}$/);
			var results = taxId.match(myRE);
			if(results != null)
			{
				//Если ИНН неправильный - поиск в контактах по t24Id
				searchStr  = "[T24 Id] = '" + t24Id + "'";
			}
			else
			{
				//Если ИНН правильный - поиск в контактах по ИНН
				searchStr  = "[DL Number] = '" + taxId + "'";
			}
			searchStr += " AND [Prospect Flag]<>'Y'";//SD-386844, Balaban Ivan 19.01.2012
			SetSearchExpr(searchStr);
			
			ExecuteQuery(ForwardBackward);
			
			if(FirstRecord())
			{
				//Получение данных контакта
				contactId=GetFieldValue("Id");
				FirstName=GetFieldValue("First Name");
				MiddleName=GetFieldValue("Middle Name");
				
				//Перевод имени и отчества контакта в нормальный формат (Иван Иванович)
				var tmpName1=FirstName.toUpperCase();
				var tmpName2=FirstName.toLowerCase();
			
					FullName=tmpName1.substr(0,1)+tmpName2.substr(1)+" ";

				tmpName1=MiddleName.toUpperCase();
				tmpName2=MiddleName.toLowerCase();
			
					FullName+=tmpName1.substr(0,1)+tmpName2.substr(1);
			}
			else
			{
				noRecordsFound(Outputs, "2:" + searchStr);
				return;
			}
		}

		//-----------------------------------------------------------------------------------
		// *********************************** CR-9344 Губенко А.Н. Вызов ротатора баннеров по MAB
		if (channel == 'MAB')
		{
			getBanner(contactId,Outputs);
			Outputs.SetProperty("Pers",FullName);
			Outputs.SetProperty("ErrorMsg","");
			Outputs.SetProperty("ErrorCode",0);
		}
		else
		{
		// ***********************************
			with(AactiveBC) //Campaign Members
			{
				SetViewMode(AllView);
				ClearToQuery();
				ActivateField("Contact Id");
				ActivateField("Outcome");
				ActivateField("Id");
				searchStr = "= '" + contactId + "' AND (([Outcome] <> 'Interested' AND [Outcome] <> 'Not Interested') OR [Outcome] is null) AND [Campaign Status] = 'Launched'";
				SetSearchSpec("Contact Id",searchStr);
				SetSortSpec("AL Priority(ASCENDING)");
				ExecuteQuery(ForwardOnly);
			
				var N = CountRecords();
				if(N == 0)
				{
					noRecordsFound(Outputs, "3:" + searchStr);
					return;
				}
				isRecord = FirstRecord();
				while(isRecord)
				{
					campaignMemberId = GetFieldValue("Id");
					campaignId = GetFieldValue("Campaign Id");
				
					//-----------------------------------------------------------------------------------
					activeBC = null;
					activeBC=AactiveBO.GetBusComp("Campaign Load Wave");
				
					with(activeBC)
					{
						SetViewMode(AllView);
						ClearToQuery();
						ActivateField("Status");
						ActivateField("Id");
						searchStr = "[Status] = 'Launched'";
						SetSearchExpr(searchStr);
						ExecuteQuery(ForwardOnly);
						isRec = FirstRecord();
						if(isRec)
						{
							campaignLoadWaveId=GetFieldValue("Id");
						}
						else
						{
							campaignLoadWaveId = null;
							noRecordsFound(Outputs, "4:" + searchStr);
							//return;
						}
					}
	
					//-----------------------------------------------------------------------------------
					activeBO = null;
					activeBO=TheApplication().GetBusObject("Campaign");
					activeBC = null;
					activeBC=activeBO.GetBusComp("Campaign List Contact");
				
					with(activeBC)
					{
						SetViewMode(AllView);
						ClearToQuery();			
						ActivateField("Dial Attempts");
						ActivateField("Contact Id");
						searchStr = "[Contact Id] = '"+contactId+"'";
						SetSearchExpr(searchStr);
						ExecuteQuery(ForwardOnly);
						isRec = FirstRecord();
						if(isRec)
						{
							dialAttempts = GetFieldValue("Dial Attempts");
							if (!dialAttempts)
								dialAttempts = 0;
							dialAttempts = 1*dialAttempts;
						}
						else
						{
							dialAttempts = null;
							noRecordsFound(Outputs, "5:" + searchStr);
							//return;
						}
					}
				
					//-----------------------------------------------------------------------------------
					activeBO = null;
					activeBO=TheApplication().GetBusObject("Campaign Load Wave");
					activeBC = null
					activeBC = activeBO.GetBusComp("Campaign Load Wave");
				
					with(activeBC)
					{
						SetViewMode(AllView);
						ClearToQuery();
						ActivateField("Id");
						searchStr = "[Id] = '" + campaignLoadWaveId + "'";
						SetSearchExpr(searchStr);
						ExecuteQuery(ForwardOnly);
						var boolRecord = FirstRecord(); 
					}
				
					//-----------------------------------------------------------------------------------
					with(activeBC1)
					{
						SetViewMode(AllView);
						ClearToQuery();
						ActivateField("Type");
						ActivateField("Id");
						ActivateField("AL Show Num");
						ActivateField("Product");
						ActivateField("PreApprove Check");
						SetSearchSpec("Type",channel);
						ExecuteQuery(ForwardOnly);
						isRec = FirstRecord();
						var fi = "fi0";
						var find = 0;
						while(isRec)
						{
							fi = "fi:" + campaignLoadWaveOfferId;
							campaignLoadWaveOfferId = GetFieldValue("Id");
							showNum = GetFieldValue("AL Show Num");
							isPreApprove = GetFieldValue("PreApprove Check");
							if (!showNum)
								showNum = 0;
							showNum = 1 * showNum;
							if((showNum == 0)||(showNum>dialAttempts))
							{
								templateId = GetFieldValue("AL Pattern Id");
								if (isPreApprove == 'Y')
								{
									find=1;
									product = GetFieldValue("Product");
									runWorkflow(taxId,product,Outputs);
								}
								else
								{
									Outputs.SetProperty("endDate","");
									Outputs.SetProperty("startDate","");
									Outputs.SetProperty("Term","");
									Outputs.SetProperty("Sum","");
									Outputs.SetProperty("payOnMonth","");			
								}
								Outputs.SetProperty("Pers",FullName);
								Outputs.SetProperty("TemplateId",templateId);
								Outputs.SetProperty("CampaignMemberId",campaignMemberId+"|"+campaignId+"|"+campaignLoadWaveOfferId);
								Outputs.SetProperty("ErrorMsg","");
								Outputs.SetProperty("ErrorCode",0);
								campaignLoadWaveOfferId =null;
								product =null;
								templateId = null;
								return;
							}
							isRec = NextRecord();
						}
						if(find == 0)
						{
							noRecordsFound(Outputs, "6:" + fi + " campaignLoadWaveId=" + campaignLoadWaveId + "showNum=" + showNum + " dialAttempts" + dialAttempts + " channel=" + channel);
						}
						fi = null;
					}
					//-----------------------------------------------------------------------------------
					isRecord = NextRecord();
				}
			}
		}
	}
	catch(e)
	{
		if(defined(e.errText))
		{
			errorMsg = "An exception occurred in the [" +
			activeBO.Name() + "] object, in ["+
			activeBC.Name() + "] business component." +
			" ERROR: " + e.errText +" STACK: " +
			e.toString();
			errorCode= e.errCode;
			Outputs.SetProperty("ErrorMsg",errorMsg);
			Outputs.SetProperty("ErrorCode",errorCode);
		}
		else
		{
			errorMsg ="An exception occurred in the [" +
			activeBO.Name() + "] object, in ["+
			activeBC.Name() +"] business component." +
			" STACK: " + e.toString();
			errorCode= e.errCode;
			Outputs.SetProperty("ErrorMsg",errorMsg);
			Outputs.SetProperty("ErrorCode",errorCode);
		}
	}
	finally
	{
		AactiveBC = null;
		AactiveBO = null;
		activeBC1 = null;
		activeBC = null;
		activeBO = null;
		campaignLoadWaveId= null;
		channel = null;
		taxId = null;
		t24Id = null;
		contactId= null;
		campaignMemberId= null;
		campaignId= null;
		campaignLoadWaveOfferId= null;
		searchStr= null;
		isRecord= null;
		isRec= null;
		showNum= null;
		templateId= null;
		product= null;
		dialAttempts= null;
		errorCode= null;
		errorMsg= null;
	}
}
function getOfferTemplate(Inputs, Outputs)
{
	var CampaignBO = TheApplication().GetBusObject("Campaign");
	var cBO = TheApplication().GetBusObject("Comm Package");
	var cBC = cBO.GetBusComp("Comm Package");
	var	TextBC = CampaignBO.GetBusComp("AL SMS Campaign Text");	
	
	//Получение текста сообщения по Id шаблона
 	var templateId = Inputs.GetProperty("templateId");
	var textBanner = "";			// текст баннера MAB
	var textBanner, searchStr = "";
	var fr = false;
	
	try
	{
		//**************************** CR-9344 Губенко А.Н. ********************
		//Отображение сообщения для ротатора баннеров по MAB
		if (templateId.charAt(0) == '[')
		{
		
			with (TextBC)
			{
				templateId = templateId.substr(1);
				SetViewMode(AllView);
				ClearToQuery();
				ActivateField("Text Sms");
				searchStr = "[Camp Con Id] = '" + templateId + "'";
				SetSearchExpr(searchStr);
				ExecuteQuery(ForwardBackward);
				fr = FirstRecord()
				if(fr)
				{
					if (GetFieldValue("Text Sms")) 
						textBanner = GetFieldValue("Text Sms")
					else
						textBanner = ""; 
						//Получение текста баннера
					Outputs.SetProperty("TemplateText",  textBanner);
				}
				else
				{
					//Текст отсутствует
					Outputs.SetProperty("TemplateText",  "");
				}
			}
			Outputs.SetProperty("ErrorCode", "0");
			Outputs.SetProperty("ErrorMsg", "");	
		}
		else
		{
		//*********************************************************************
				cBC.SetViewMode(AllView);
				cBC.ActivateField("Template Text");
				cBC.ClearToQuery();
				cBC.SetSearchSpec("Id", templateId);
				cBC.ExecuteQuery(ForwardOnly);
				if (!cBC.FirstRecord())
					TheApplication().RaiseErrorText("templateId " + templateId + " not found");
				Outputs.SetProperty("TemplateText",  cBC.GetFieldValue("Template Text"));
				Outputs.SetProperty("ErrorCode", "0");
				Outputs.SetProperty("ErrorMsg", "");
		}
	}
	catch (e)
	{
		Outputs.SetProperty("ErrorCode", e.errCode);
		Outputs.SetProperty("ErrorMsg", e.errText);
		Outputs.SetProperty("TemplateText", "");
	}
	finally
	{
		TextBC = null;
		CampaignBO = null;
		cBC = null;
		cBO = null; 		
		templateId = null;
		Inputs = null;
	}
}
function noRecordsFound(Outputs, index)
{
 	Outputs.SetProperty("endDate","");
	Outputs.SetProperty("startDate","");
	Outputs.SetProperty("Term","");
	Outputs.SetProperty("Sum","");
	Outputs.SetProperty("payOnMonth","");
	Outputs.SetProperty("Pers","");
	Outputs.SetProperty("TemplateId","");
	Outputs.SetProperty("CampaignMemberId","");
	Outputs.SetProperty("ErrorMsg", "");
	Outputs.SetProperty("ErrorCode",0);
 }
function runWorkflow(taxId,product,Outputs)
{
	try
	{
		var propSet;
		var strDate;
		var svc = TheApplication().GetService("Workflow Process Manager");
		var Input = TheApplication().NewPropertySet();
		var Output = TheApplication().NewPropertySet();
		var startDate, endDate;
		
		Input.SetProperty("ProcessName", "PIL PreApprove WF");
		Input.SetProperty("taxId", taxId);
		Input.SetProperty("subProduct", product);
		Input.SetProperty("isActive", "1");
		Clib.strftime(strDate,"%Y-%m-%d",Clib.localtime(Clib.time()));	
		Input.SetProperty("startDate", strDate);
		
		svc.InvokeMethod("RunProcess", Input, Output);
	
		propSet = getApprove(Output);
		
		endDate=propSet.GetProperty("endDate");
		startDate=propSet.GetProperty("startDate");
		endDate=endDate.substr(8,2)+"."+endDate.substr(5,2)+"."+endDate.substr(0,4);
		startDate=startDate.substr(8,2)+"."+startDate.substr(5,2)+"."+startDate.substr(0,4);
		
		Outputs.SetProperty("endDate",endDate);
		Outputs.SetProperty("startDate",startDate);
		Outputs.SetProperty("Term",propSet.GetProperty("maxTerm"));
		Outputs.SetProperty("Sum",propSet.GetProperty("maxLimit"));
		Outputs.SetProperty("payOnMonth",propSet.GetProperty("maxPayment"));
	}
	catch(e)
	{
		throw(e);
	}
	finally
	{
		svc=null;
		Input=null;
		Output=null;
		propSet=null;
	}
}
function sSort(a, b) 
{
	// CR-9344 Губенко А.Н.
	//Функция сортировка массива сначала по приоритету, затем по кол-ву отправленных баннеров
	if (a[0] == b[0])
		return a[1] < b[1] ? -1 : 1;
	else
		if (a[0] > b[0])
			return a[0] < b[0] ? -1 : 1;
		else
			return a[1] < b[1] ? -1 : 1;

}
