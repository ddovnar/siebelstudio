Service_PreInvokeMethod ("test", null, null);
function Service_PreInvokeMethod (MethodName, Inputs, Outputs)
{
	if (MethodName == "searchCampEnd") {
		WriteLog("AL Cisco Unsucsessful Dials BS::searchCampEnd","���������",	"�����.");
		var pTimeStart = new Date().getTime();
		var logInfo = "";		
		var boCamp = TheApplication().GetBusObject("Campaign");
		var bcCamp = boCamp.GetBusComp("Campaign");
		
		bcCamp.SetViewMode(AllView);
		bcCamp.ActivateField("End Date");
		bcCamp.ClearToQuery();
		bcCamp.SetSearchSpec("End Date","Today()");
		bcCamp.ExecuteQuery(ForwardOnly);
		var isRec = bcCamp.FirstRecord();		
		while (isRec) {
			//createAction(bcCamp.GetFieldValue("Id"));
			createActionCall(boCamp, bcCamp, bcCamp.GetFieldValue("Id"), Outputs);
			isRec = bcCamp.NextRecord();
		}
		bcCamp = null;
		boCamp = null;
		var pTimeFinish = new Date().getTime();
		WriteLog("AL Cisco Unsucsessful Dials BS::searchCampEnd","���������",
			"�����." +
			Outputs.GetProperty("LogInfo")+
			"����� ������ "+(pTimeFinish-pTimeStart)/1000+" ������.");
		return false;//(CancelOperation);
	}

	//�������.�. CR-9000 
	//�������� �������� � ����� ������ ���������, ��� �������� �� �������, 
	//���� � ��������� �������� ���� ������� �� ����������
	if (MethodName == "finishCampWave") {
		WriteLog("AL Cisco Unsucsessful Dials BS::finishCampWave","���������",	"�����.");
		var pTimeStart = new Date().getTime();
		//createAction(Inputs.GetProperty("Campaign Id"));
		createActionCall(null, null, Inputs.GetProperty("Campaign Id"), Outputs);
		var pTimeFinish = new Date().getTime();
		WriteLog("AL Cisco Unsucsessful Dials BS::finishCampWave","���������",
			"�����."+
			Outputs.GetProperty("LogInfo")+
			"����� ������ "+(pTimeFinish-pTimeStart)/1000+" ������.");
		return false;//(CancelOperation);		
	}
	
	if (MethodName == "CreateDepositCall") {
		WriteLog("AL Cisco Unsucsessful Dials BS::CreateDepositCall", "���������", "�����.");
		var pTimeStart = new Date().getTime();
		CreateDepositCall(campId, LogInfo);
		var pTimeFinish = new Date().getTime();
		WriteLog("AL Cisco Unsucsessful Dials BS::CreateDepositCall","���������",
			"�����."+
			Outputs.GetProperty("LogInfo")+
			"����� ������ "+(pTimeFinish-pTimeStart)/1000+" ������.");
		return false;//(CancelOperation);
	}

	return false;//(ContinueOperation);
}
