var Inputs = TheApplication().NewPropertySet();
var Outputs = TheApplication().NewPropertySet();
Inputs.SetProperty("Campaign Id", "1-23KRSUY");

AL_ATM_RUN(Inputs, Outputs);
trace(Outputs);

function AL_ATM_RUN(Inputs, Outputs) {
	var boCamp = TheApplication().GetBusObject("Campaign");
	var bcCamp = boCamp.GetBusComp("Campaign");
	var bcOfferText = boCamp.GetBusComp("AL SMS Campaign Text");
	var bcCampWave = boCamp.GetBusComp("Campaign Load Wave");
	var bcWaveOffer = boCamp.GetBusComp("Campaign Load Wave Offer");
	var bcCampListContact = boCamp.GetBusComp("Campaign List Contact");
	var bcALAtmOffer = 	boCamp.GetBusComp("Email Offer");
	var bcContact = boCamp.GetBusComp("Contact");
	
	var ServResp = "";
	var ErrorFlg = 0;
	var ErrorMsg = "";
	var dbg = "";
	var campaignId = Inputs.GetProperty("Campaign Id");
	var CampaignEndDate = "10/11/2013";
	//Clib.strftime(CampaignEndDate,"%Y-%m-%d",Clib.localtime(Clib.time()));
	// структура данных для хранения информации о предложениях и контактах
	// вся информация используется для отправки предложения на АТМ
	var dataStorage = TheApplication().NewPropertySet();
	
	var statusPS = TheApplication().NewPropertySet();	
	statusPS.SetProperty("ReqWaveStatus1", TheApplication().InvokeMethod("LookupValue", "CAMP_LOAD_WAVE_STATUS", "Load Complete"));
	statusPS.SetProperty("ReqWaveStatus2", TheApplication().InvokeMethod("LookupValue", "CAMP_LOAD_WAVE_STATUS", "Launch Failed"));
	statusPS.SetProperty("ReqWaveStatus3", TheApplication().InvokeMethod("LookupValue", "CAMP_LOAD_WAVE_STATUS", "Suspended"));
	statusPS.SetProperty("ReqWaveStatus4", TheApplication().InvokeMethod("LookupValue", "CAMP_LOAD_WAVE_STATUS", "Launched"));
	//statusPS.SetProperty("ReqWaveStatus5", TheApplication().InvokeMethod("LookupValue", "CAMP_LOAD_WAVE_STATUS", "Completed"));
	

	bcContact.SetViewMode(AllView);
	bcContact.ActivateField("DL Number");
	bcContact.ActivateField("T24 Id");
	//bcContact.ActivateField("")

	bcOfferText.SetViewMode(AllView);
	bcOfferText.ActivateField("Camp Con Id");
	bcOfferText.ActivateField("Text Eng");
	bcOfferText.ActivateField("Text Fr");
	bcOfferText.ActivateField("Text Rus");
	bcOfferText.ActivateField("Text Ukr");
	
	bcCampListContact.SetViewMode(AllView);
	
	bcCampWave.SetViewMode(AllView);
	bcCampWave.ActivateField("Id");
	bcCampWave.ActivateField("Wave Number");
	bcCampWave.ActivateField("Wave Code");
	bcCampWave.ActivateField("Load Number");
	bcCampWave.ActivateField("Status");

	bcWaveOffer.SetViewMode(AllView);
	bcWaveOffer.ActivateField("Id");
    bcWaveOffer.ActivateField("PreApprove Check");
    bcWaveOffer.ActivateField("Product");

    bcALAtmOffer.SetViewMode(AllView);
    bcALAtmOffer.ActivateField("AL Output Flag Code");
    bcALAtmOffer.ActivateField("AL Show Num");
	
	try {
		bcCamp.SetViewMode(AllView);
		bcCamp.ActivateField("End Date");
		bcCamp.ClearToQuery();
		bcCamp.SetSearchExpr("[Id]='" + campaignId + "' AND [End Date] > Today()");
		bcCamp.ExecuteQuery(ForwardOnly);
	  	if (bcCamp.FirstRecord()) {
			campaignEndDate = bcCamp.GetFieldValue("End Date");
			// выполняется поиск волны кампании
			if (WaveSearch(bcCampWave, bcWaveOffer, bcALAtmOffer, statusPS, dataStorage)) {
				// формирования списка участников кампании, по которым будет отправлено предложение
				bcCampListContact.ClearToQuery();
				bcCampListContact.ExecuteQuery(ForwardOnly);
				var k = bcCampListContact.FirstRecord();
				var hasContacts = k;
				while (k) {
					// сбор информации о участнике кампании
					trace("members");
					var conMember = TheApplication().NewPropertySet();
					conMember.SetProperty("Member Id", bcCampListContact.GetFieldValue("Id"));
					conMember.SetProperty("Contact Id", bcCampListContact.GetFieldValue("Contact Id"));
					conMember.SetProperty("T24 Id", bcCampListContact.GetFieldValue("T24 Id"));
					// сбор информации - текстов предложения
					bcOfferText.ClearToQuery();
					bcOfferText.ExecuteQuery(ForwardOnly);
					var t = bcOfferText.FirstRecord();
					while (t) {
						trace("mmmm");
						var textItem = TheApplication().NewPropertySet();
						textItem.SetProperty("AtmOfferMsgEn", bcOfferText.GetFieldValue("Text Eng"));
						textItem.SetProperty("AtmOfferMsgFr", bcOfferText.GetFieldValue("Text Fr"));
						textItem.SetProperty("AtmOfferMsgRu", bcOfferText.GetFieldValue("Text Rus"));
						textItem.SetProperty("AtmOfferMsgUa", bcOfferText.GetFieldValue("Text Ukr"));
						conMember.AddChild(textItem);
						
						t = bcOfferText.NextRecord();
					}
					// записываем данные об отправке в структуру
					dataStorage.AddChild(conMember);
					// сбор доп. информации о контакте
					GetContactData(bcContact, dataStorage);
					k = bcCampListContact.NextRecord();
				}

				if (!hasContacts) {
					ErrorFlg = 4;
					dbg = dbg + 'Отсутствуют контакты.\n';
				}
			} else {
				 ErrorFlg = 2;
				 dbg = dbg + 'Волн с требуемым статусом не обнаружено.\n';
			}
		} else {
			ErrorFlg = 3;
			dbg = dbg + "Кампания Id='" + campaignId + "' не найдена.\n";
		}
		trace(dataStorage);
		// обработка текстов предложений с PreApprove
		// выполняется для каждого участника кампании
		var ResPS = TheApplication().NewPropertySet();
		for (var i = 0; i < dataStorage.GetChildCount(); i++) {
			if ((dataStorage.GetProperty("isPreApprove") == 'Y') &&
			    (dataStorage.GetChild(i).GetChildCount() > 0)) {
			    	//dataStorage.GetChild(0).SetProperty("DL Number", "2503212516");
			    // получение данных PreApprove и вставка их в тексты предложения
				runWorkflow(
					dataStorage.GetChild(i).GetProperty("DL Number"),
					dataStorage.GetProperty("Product"),
					dataStorage.GetChild(i).GetChild(0).GetProperty("AtmOfferMsgEn"),
					dataStorage.GetChild(i).GetChild(0).GetProperty("AtmOfferMsgFr"),
					dataStorage.GetChild(i).GetChild(0).GetProperty("AtmOfferMsgRu"),
					dataStorage.GetChild(i).GetChild(0).GetProperty("AtmOfferMsgUa"),
					ResPS);
				// обновление структуры - текстов предложения
				dataStorage.GetChild(i).GetChild(0).SetProperty("AtmOfferMsgEn", ResPS.GetProperty("OfferMsgEn"));
				dataStorage.GetChild(i).GetChild(0).SetProperty("AtmOfferMsgFr", ResPS.GetProperty("OfferMsgFr"));
				dataStorage.GetChild(i).GetChild(0).SetProperty("AtmOfferMsgRu", ResPS.GetProperty("OfferMsgRu"));
				dataStorage.GetChild(i).GetChild(0).SetProperty("AtmOfferMsgUa", ResPS.GetProperty("OfferMsgUa"));
			}
		}
		ResPS = null;
		
		// Определение регистрационного номера предложения
		// Данный номер, назначается предложению и записывается в журнал отправки
		// По номеру можно будет получить отклики, который прийдут с АТМ.
		var OfferNumber = "";
		OfferNumber = GetOfferRegNumber(boCamp);
		//~
		trace("DDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDD");
		trace(dataStorage);
		// выполнение отправки предложений участникам кампании
		for (var i = 0; i < dataStorage.GetChildCount(); i++) {
			if (ErrorFlg != 0)
				break;
			
			if (dataStorage.GetChild(i).GetChildCount() > 0) {
				// отправка предложения на АТМ
				trace("send Offer");
				ServResp = AL_ATM_SEND(
					campaignId, 
					campaignEndDate, 
					dataStorage.GetChild(i).GetProperty("T24 Id"), 
					dataStorage.GetProperty("OfferId"), 
					dataStorage.GetProperty("AL Show Num"), 
					dataStorage.GetProperty("AL Output Flag"), 
					dataStorage.GetChild(i).GetChild(0).GetProperty("AtmOfferMsgEn"), 
					dataStorage.GetChild(i).GetChild(0).GetProperty("AtmOfferMsgFr"), 
					dataStorage.GetChild(i).GetChild(0).GetProperty("AtmOfferMsgRu"), 
					dataStorage.GetChild(i).GetChild(0).GetProperty("AtmOfferMsgUa")
				);
				var campaignEndDate = "10/11/2013";
				//Clib.strftime(campaignEndDate,"%Y-%m-%d",Clib.localtime(Clib.time()));
				dbg = dbg + "Ответ SOAP сервера: " + ServResp + "\n";
       			if(ServResp != 0) {
        				ErrorFlg = 1;
        				ErrorMsg = ServResp;
        				dbg = dbg + ErrorMsg;
       			} else {
       				// если отправка успешно, заносим запись об отправке в журнал отправленных предложений
					RegisterOfferSend(
						boCamp, 
						dataStorage.GetProperty("OfferRowId"), 
						campaignId, 
						dataStorage.GetChild(i).GetProperty("Member Id"), 
						OfferNumber,
						dataStorage.GetChild(i).GetProperty("T24 Id")
					);
				}
			}
		}

		if (ErrorFlg == 0) {
      		Outputs.SetProperty("Error Message", "");
     		return (CancelOperation);
    	} else if(ErrorFlg == 1) {
			dbg = dbg + "Критическая ошибка. Вызов CancelOperation.\n";
			Outputs.SetProperty("Error Message", ErrorMsg + dbg);
			TheApplication().RaiseError(ErrorMsg + dbg);
			return (CancelOperation);
   		} else {
    			dbg = dbg + "Некритическая ошибка. Вызов CancelOperation.\n";
    			Outputs.SetProperty("Error Message",  dbg);
    			return (CancelOperation);
   		}
	} catch (e) {
		Outputs.SetProperty("Error Message",  e.errText + dbg+" e.toSting() = "+e.toString());
	} finally {
		statusPS = null;
		dataStorage = null;
		bcALAtmOffer = null;
		bcCampListContact = null;
		bcWaveOffer = null;
		bcCampWave = null;
		bcOfferText = null;
		bcCamp = null;
		boCamp = null;
	}
}

// метод выполняет поиск волны кампании, и сбор информации общей о предложении кампании
function WaveSearch (bcCampWave, bcWaveOffer, bcALAtmOffer, statusPS, dataStorage) {
	var OfferId = "";
	var isPreApprove = "N";
	var waveFound = false;
	
	bcCampWave.ClearToQuery();
	bcCampWave.SetSearchExpr(
		"[Status] = '" + statusPS.GetProperty("ReqWaveStatus1") + "' OR " +
		"[Status] = '" + statusPS.GetProperty("ReqWaveStatus2") + "' OR " + 
		"[Status] = '" + statusPS.GetProperty("ReqWaveStatus3") + "' OR " + 
		"[Status] = '" + statusPS.GetProperty("ReqWaveStatus4") + "' OR " +
		"[Status] IS NULL");
	bcCampWave.ExecuteQuery(ForwardBackward);
	if (bcCampWave.FirstRecord()){		
		dataStorage.SetProperty("WaveId", bcCampWave.GetFieldValue("Id"));
		dataStorage.SetProperty("WaveNumber", bcCampWave.GetFieldValue("Wave Number"));
		
		bcWaveOffer.ClearToQuery();
		bcWaveOffer.SetSearchExpr("[Type] = LookupValue(\"OFFER_MEDIA\", \"ATM\")");
		bcWaveOffer.ExecuteQuery(ForwardOnly);
		if (bcWaveOffer.FirstRecord()){
			OfferId = bcWaveOffer.GetFieldValue("Id");
			dataStorage.SetProperty("OfferRowId", OfferId);
			
			isPreApprove = getPreApproveCheck(OfferId);
			
			dataStorage.SetProperty("isPreApprove", isPreApprove);
			dataStorage.SetProperty("Product", bcWaveOffer.GetFieldValue("Product"));

			bcALAtmOffer.ClearToQuery();
			bcALAtmOffer.ExecuteQuery(ForwardOnly);
			if (bcALAtmOffer.FirstRecord()) {
				dataStorage.SetProperty("OfferId", bcALAtmOffer.GetFieldValue("AL Offer Id"));
				dataStorage.SetProperty("AL Show Num", bcALAtmOffer.GetFieldValue("AL Show Num"));
       			dataStorage.SetProperty("AL Output Flag", bcALAtmOffer.GetFieldValue("AL Output Flag Code"));
			} else {
				dataStorage.SetProperty("OfferId", "");
				dataStorage.SetProperty("AL Show Num", "");
         		dataStorage.SetProperty("AL Output Flag", "");
			}
			
			waveFound = true;
		}
	}

	return waveFound;
}

// сбор доп информации о контакте	
function GetContactData(bcContact, dataStorage) {
	for (var i = 0; i < dataStorage.GetChildCount(); i++) {
		bcContact.ClearToQuery();
		bcContact.SetSearchExpr("[Id] = '" + dataStorage.GetChild(i).GetProperty("Contact Id") + "'");
		bcContact.ExecuteQuery(ForwardOnly);
		if (bcContact.FirstRecord()) {
			dataStorage.GetChild(i).SetProperty("DL Number", bcContact.GetFieldValue("DL Number"));
			dataStorage.GetChild(i).SetProperty("T24 Id", bcContact.GetFieldValue("T24 Id"));
		}
	}
}

function AL_ATM_SEND(CampainId, CampainEndDate, ContactT24, AtmOfferId, AtmOfferShowNum, AtmOfferOutputFlg, AtmOfferMsgEn, AtmOfferMsgFr, AtmOfferMsgRu, AtmOfferMsgUa)
{
	// отправка предложения на АТМ с помощью веб-сервиса
	var svcPrepare;
	var inpPrepare;
	var outPrepare;
	var ServerResp = "";
	var ServerError;
 	var CampainEndDate="2013-11-10";
	//Clib.strftime(CampainEndDate,"%Y-%m-%d",Clib.localtime(Clib.time()));
 	svcPrepare = TheApplication().GetService("Workflow Process Manager");
	inpPrepare = TheApplication().NewPropertySet();
	outPrepare = TheApplication().NewPropertySet();

 	try {
		ServerError = 0;
		inpPrepare.SetProperty("ProcessName", "AL MarketingATM Send");
		inpPrepare.SetProperty("CampainId", CampainId);
		inpPrepare.SetProperty("CampainEndDate", CampainEndDate);
		inpPrepare.SetProperty("ContactT24", ContactT24);
		inpPrepare.SetProperty("AtmOfferId", AtmOfferId);
		inpPrepare.SetProperty("AtmOfferShowNum", AtmOfferShowNum);
		inpPrepare.SetProperty("AtmOfferOutputFlg", AtmOfferOutputFlg);
		inpPrepare.SetProperty("AtmOfferMsgEn", AtmOfferMsgEn);
		inpPrepare.SetProperty("AtmOfferMsgFr", AtmOfferMsgFr);
		inpPrepare.SetProperty("AtmOfferMsgRu", AtmOfferMsgRu);
		inpPrepare.SetProperty("AtmOfferMsgUa", AtmOfferMsgUa);

		svcPrepare.InvokeMethod("RunProcess", inpPrepare, outPrepare);
		if (outPrepare.GetProperty("errorCode"))
			ServerResp = outPrepare.GetProperty("errorCode");
		if (ServerResp == null || ServerResp == ''){
			ServerResp = outPrepare.GetChild(0).GetChild(0).GetChild(0).GetChild(0).GetChild(0).GetProperty("errorCode");
			if (ServerResp != 0) {
				return outPrepare.GetChild(0).GetChild(0).GetChild(0).GetChild(0).GetChild(0).GetProperty("errorMessage");
			} else {
				return 0;
			}
		} else {
			return (ServerResp);
		}
	} catch(e) {
		trace(e.toString());
		return e.toString(); 
	} finally {
		svcPrepare  = null;
		inpPrepare  = null;
		outPrepare  = null;
		ServerResp  = null;
		ServerError = null;
	}
}

function getApprove(PropSet)
{
try{
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
 catch(e)
 {
 return PropSet;
  }
}

function getINN(ConId)
 {
 var boContact = TheApplication().GetBusObject("Contact");
 var bcContact = boContact.GetBusComp("Contact");
 bcContact.SetViewMode(AllView);
 bcContact.ActivateField("DL Number");
 bcContact.ClearToQuery();
 bcContact.SetSearchSpec ("Id", ConId);
 bcContact.ExecuteQuery (ForwardBackward);

 return bcContact.GetFieldValue("DL Number");

}

function GetMsg(CommTemplateName, SourceBusObj, SourceBusComp, SourceId)
{
 var mess;
 var cbs = TheApplication().GetService("Outbound Communications Manager");
 var wsInput = TheApplication().NewPropertySet();
 var wsOutPut = TheApplication().NewPropertySet();

  try
 {
  wsInput.SetProperty("CommTemplateName", CommTemplateName);
  wsInput.SetProperty("SourceBusObj", SourceBusObj);
  wsInput.SetProperty("SourceBusComp", SourceBusComp);
  wsInput.SetProperty("SourceId", SourceId);
  cbs.InvokeMethod("ExpandCommTemplate", wsInput, wsOutPut);
  mess = wsOutPut.GetProperty("ExpandedText");
 }
 finally
 {
  cbs = null;
  wsInput = null;
  wsOutPut = null;
 }
 return mess;
}

function GetOfferRegNumber(boCamp)// Korotunov CR-9355
{
	var mas1 = new Array();
	var regNumber = -1;
	var boCamp = TheApplication().GetBusObject("Campaign");
	var bcATMTempOffer = boCamp.GetBusComp("AL Temp Offer");
	bcATMTempOffer.ActivateField("Offer Number");
	bcATMTempOffer.ClearToQuery();
	bcATMTempOffer.ExecuteQuery(ForwardOnly);
	var r = bcATMTempOffer.FirstRecord();
	var index = 0;
	while (r) {
		mas1[index] = bcATMTempOffer.GetFieldValue("Offer Number");
		index++;
		r = bcATMTempOffer.NextRecord();
	}

	var mas2 = new Array();

	for (var i = 0; i < 901; i++)
		mas2[i] = i;

	mas1.sort(sortFunction);
	
	var mas3 = new Array();
	mas3 = arr_diff(mas2, mas1);

	if (mas3.length > 0)
		regNumber = mas3[0];
	
	mas1 = null;
	mas2 = null;
	mas3 = null;
	bcATMTempOffer = null;

	return regNumber;
}

function sortFunction(a, b){
	if(a < b)
		return -1; // Или любое число, меньшее нуля
	if(a > b)
		return 1;  // Или любое число, большее нуля
	// в случае а = b вернуть 0
	return 0;
}


function arr_diff(a1, a2)
{
	var a=[], diff=[];
	for(var i=0;i<a1.length;i++)
		a[a1[i]]=true;
	for(var i=0;i<a2.length;i++)
		if(a[a2[i]]) 
			delete a[a2[i]];	
		else
			a[a2[i]]=true;
	for(var k in a)
	{
		diff.push(k);
		break;
	}
	return diff;
}

function getPreApproveCheck (OfferId)
 {
 	// получение признака проверки PreApprove для предложения
	var boOffer = TheApplication().GetBusObject("Offer");
	var bcOffer = boOffer.GetBusComp("Email Offer");
	bcOffer.SetViewMode(AllView);
	bcOffer.ActivateField("PreApprove Check");
	bcOffer.ClearToQuery();
	bcOffer.SetSearchExpr("[Id] = '" + OfferId + "'");
	bcOffer.ExecuteQuery(ForwardOnly);
	if(bcOffer.FirstRecord())
		return bcOffer.GetFieldValue("PreApprove Check");
	else return "N";
}

function RegisterOfferSend(boCamp, OfferId, CampId, CampConId, OfferNumber, conT24Id)
{
	// запись отправленного предложения в журнал отправки
	var bcATMTempOffer = boCamp.GetBusComp("AL Temp Offer");
	bcATMTempOffer.SetViewMode(AllView);

	bcATMTempOffer.NewRecord(NewAfter);
	bcATMTempOffer.SetFieldValue("Offer Number", OfferNumber);
	bcATMTempOffer.SetFieldValue("Offer Id", OfferId);
	bcATMTempOffer.SetFieldValue("Camp Id", CampId);
	bcATMTempOffer.SetFieldValue("Campmem Id", CampConId);
	bcATMTempOffer.SetFieldValue("T24 Id", conT24Id);
	bcATMTempOffer.WriteRecord();

	bcATMTempOffer = null;
}

function runWorkflow(taxId,product,OfferMsgEn,OfferMsgFr,OfferMsgRu,OfferMsgUa,Outputs)
{
	try {
		var svc = TheApplication().GetService("Workflow Process Manager");
		var Input = TheApplication().NewPropertySet();
		var Output = TheApplication().NewPropertySet();
		
		Input.SetProperty("ProcessName", "PIL PreApprove WF");
		
		Input.SetProperty("taxId", taxId);
		Input.SetProperty("subProduct", product);
		Input.SetProperty("isActive", "1");
		
		var strDate;
		Clib.strftime(strDate,"%Y-%m-%d",Clib.localtime(Clib.time()));
	//	var endDate=""; 
	//	Clib.strftime(strDate,"%Y-%m-%d",Clib.localtime(Clib.time()));
		Input.SetProperty("startDate", strDate);
		
		svc.InvokeMethod("RunProcess", Input, Output);
		
		var propSet = getApprove(Output);
		var endDate=propSet.GetProperty("endDate");
		
		if (endDate=="")
			Outputs.SetProperty("PreApproveFlg","1");
		else {
			Outputs.SetProperty("PreApproveFlg","0");
			var startDate=propSet.GetProperty("startDate");
			endDate=endDate.substr(8,2)+"."+endDate.substr(5,2)+"."+endDate.substr(0,4);
			startDate=startDate.substr(8,2)+"."+startDate.substr(5,2)+"."+startDate.substr(0,4);
			
			OfferMsgEn=OfferMsgEn.replace('[$endDate]',endDate);
			OfferMsgEn=OfferMsgEn.replace('[$startDate]',startDate);
			OfferMsgEn=OfferMsgEn.replace('[$Term]',propSet.GetProperty("maxTerm"));
			OfferMsgEn=OfferMsgEn.replace('[$Sum]',propSet.GetProperty("maxLimit"));
			OfferMsgEn=OfferMsgEn.replace('[$payOnMonth]',propSet.GetProperty("maxPayment"));
			OfferMsgEn=OfferMsgEn.replace('[$Pers]',"");
			
			OfferMsgFr=OfferMsgFr.replace('[$endDate]',endDate);
			OfferMsgFr=OfferMsgFr.replace('[$startDate]',startDate);
			OfferMsgFr=OfferMsgFr.replace('[$Term]',propSet.GetProperty("maxTerm"));
			OfferMsgFr=OfferMsgFr.replace('[$Sum]',propSet.GetProperty("maxLimit"));
			OfferMsgFr=OfferMsgFr.replace('[$payOnMonth]',propSet.GetProperty("maxPayment"));
			OfferMsgFr=OfferMsgFr.replace('[$Pers]',"");
			
			OfferMsgRu=OfferMsgRu.replace('[$endDate]',endDate);
			OfferMsgRu=OfferMsgRu.replace('[$startDate]',startDate);
			OfferMsgRu=OfferMsgRu.replace('[$Term]',propSet.GetProperty("maxTerm"));
			OfferMsgRu=OfferMsgRu.replace('[$Sum]',propSet.GetProperty("maxLimit"));
			OfferMsgRu=OfferMsgRu.replace('[$payOnMonth]',propSet.GetProperty("maxPayment"));
			OfferMsgRu=OfferMsgRu.replace('[$Pers]',"");
			
			OfferMsgUa=OfferMsgUa.replace('[$endDate]',endDate);
			OfferMsgUa=OfferMsgUa.replace('[$startDate]',startDate);
			OfferMsgUa=OfferMsgUa.replace('[$Term]',propSet.GetProperty("maxTerm"));
			OfferMsgUa=OfferMsgUa.replace('[$Sum]',propSet.GetProperty("maxLimit"));
			OfferMsgUa=OfferMsgUa.replace('[$payOnMonth]',propSet.GetProperty("maxPayment"));
			OfferMsgUa=OfferMsgUa.replace('[$Pers]',"");
		}
	} catch(e) {
		// PreApproveFlg=1;
		throw(e);
	} finally {
		svc=null;
		Input=null;
		Output=null;
		propSet=null;
	}
	Outputs.SetProperty("OfferMsgEn", OfferMsgEn);
	Outputs.SetProperty("OfferMsgFr", OfferMsgFr);
	Outputs.SetProperty("OfferMsgRu", OfferMsgRu);
	Outputs.SetProperty("OfferMsgUa", OfferMsgUa);
}

