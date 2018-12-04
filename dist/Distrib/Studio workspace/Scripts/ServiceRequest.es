CreateRequest("1-KYV73X", "1-P8ZPSH", "");

function CreateRequest(contactId, cardId, actionId, descr) {
	var boContact = TheApplication().GetBusObject("Contact");
	var bcContact = boContact.GetBusComp("Contact");
	var bcSR = boContact.GetBusComp("Service Request");
	
	var boSR = TheApplication().GetBusObject("Service Request");
	var bcActSR = boSR.GetBusComp("AL ActionSR");
	
	var bcCard = boContact.GetBusComp("FINS Application - Credit Card All");

	bcCard.SetViewMode(AllView);
	bcCard.ActivateField("Project Name");
	bcCard.ActivateField("Card Number");
	
	bcActSR.SetViewMode(AllView);
	bcActSR.ActivateField("Activity Id");
	bcActSR.ActivateField("Sr Id");
	bcActSR.ClearToQuery();
				
	bcSR.SetViewMode(AllView);
	bcSR.ActivateField("Contact Id");
	bcSR.ActivateField("Card Number");
	bcSR.ActivateField("INS Product");
	bcSR.ActivateField("AL Theme LIC");
	bcSR.ActivateField("AL Theme");
	bcSR.ActivateField("AL Sub Theme LIC");
	bcSR.ActivateField("AL Sub Theme");
	bcSR.ActivateField("AL Annotation");
	bcSR.ActivateField("AL Contragent Flg");
	bcSR.ActivateField("Status");
	
	bcContact.SetViewMode(AllView);
	bcContact.ClearToQuery();
	bcContact.SetSearchExpr("[Id] = '" + contactId + "'");
	bcContact.ExecuteQuery(ForwardOnly);
	if (bcContact.FirstRecord()) {
		bcCard.ClearToQuery();
		bcCard.SetSearchExpr("[Id] = '" + cardId + "'");
		bcCard.ExecuteQuery(ForwardOnly);
		if (bcCard.FirstRecord()) {
			var theme = "";
			var subTheme = "";
			var projectCard = bcCard.GetFieldValue("Project Name");
			if (projectCard.substring(0, 2) == "«œ") {
				theme = "Salary cardC2";
				subTheme = "Card rereleaseC26";
			} else if (projectCard.substring(0, 2) == "  ") {
				theme = "Credit CardC2";
				subTheme = "Card rereleaseC24";
			} else {
				theme = "DebCardC2";
				subTheme = "Card rereleaseC19";
			}
			
			bcSR.NewRecord(NewAfter);
			bcSR.SetFieldValue("AL Contragent Flg", TheApplication().InvokeMethod("LookupValue", "SR_AREA_CONTRAGENT", "CONTACT"));
			bcSR.SetFieldValue("Card Number", bcCard.GetFieldValue("Card Number"));
			bcSR.SetFieldValue("INS Product",TheApplication().InvokeMethod("LookupValue", "SR_AREA", "RequestC"));
			bcSR.SetFieldValue("AL Theme LIC", theme);
			bcSR.SetFieldValue("AL Theme", TheApplication().InvokeMethod("LookupValue", "SR_AREA_THEME", theme));
			bcSR.SetFieldValue("AL Sub Theme LIC", subTheme);
			bcSR.SetFieldValue("AL Sub Theme", TheApplication().InvokeMethod("LookupValue", "SR_AREA_SUBTHEME", subTheme));
			bcSR.SetFieldValue("AL Annotation", descr);
			if (theme == "Salary cardC2")
				bcSR.SetFieldValue("Status", TheApplication().InvokeMethod("LookupValue", "SR_STATUS", "Sent_from_oozp"));
			else
				bcSR.SetFieldValue("Status", TheApplication().InvokeMethod("LookupValue", "SR_STATUS", "sent_to_opkp"));
			bcSR.WriteRecord();
							
			if (actionId != "") {
				bcActSR.NewRecord(NewAfter);
				bcActSR.SetFieldValue("Activity Id", actionId);
				bcActSR.SetFieldValue("Sr Id", bcSR.GetFieldValue("Id"));
				bcActSR.WriteRecord();
			}
		}
	}

	bcActSR = null;
	boSR = null;
	bcCard = null;
	bcSR = null;
	bcContact = null;
	boContact = null;
}
