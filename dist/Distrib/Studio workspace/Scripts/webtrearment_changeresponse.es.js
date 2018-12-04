var srv = TheApplication().GetService("EAI XML Read from File");
var psInput = oApp.newPropertySet();
var psOutput = oApp.newPropertySet();

psInput.setProperty("FileName", "c:\\psInp.xml");
srv.InvokeMethod("ReadPropSet", psInput, psOutput);

trace(psOutput);

var p = FindPropByType(psOutput, "ListOfResponse");

var boOffer = TheApplication().GetBusObject("Offer");
var bcOffer = boOffer.GetBusComp("Offer");
var bcEmailOffer = boOffer.GetBusComp("Email Offer");
var bcEmailURLs = boOffer.GetBusComp("Email Offer Related URLs");
var treatmentId = "";
var destName = "";

bcOffer.SetViewMode(AllView);
bcOffer.ActivateField("Name");
bcOffer.ActivateField("Type");
bcOffer.ActivateField("Type LIC");

bcEmailOffer.SetViewMode(AllView);
bcEmailURLs.SetViewMode(AllView);

// найдено структуру со списком откликов
if (p != null) {
	// обработка всех откликов
	for (var i = 0; i < p.getChildCount(); i++) {
		for (var j = 0; j < p.getChild(i).getChildCount(); j++) {
			if (p.getChild(i).getChild(j).getType() == "TreatmentId")
				treatmentId = p.getChild(i).getChild(j).getValue();
			if (p.getChild(i).getChild(j).getType() == "DestinationName")
				destName = p.getChild(i).getChild(j).getValue();
			
			if (treatmentId != "" && destName != "")
				break;
		}
		
		trace("treatmentId:" + treatmentId + ", destName:" + destName);
		
		if (treatmentId != "" && destName != "") {
			bcOffer.ClearToQuery();
			bcOffer.SetSearchExpr("[Id] = '" + treatmentId + "'");
			bcOffer.ExecuteQuery(ForwardOnly);
			if (bcOffer.FirstRecord()) {
				if (bcOffer.GetFieldValue("Type LIC") == "E-Mail") {
					// получение данных по предложению e-mail
					bcEmailOffer.ClearToQuery();
					bcEmailOffer.SetSearchExpr("[Id] = '" + bcOffer.GetFieldValue("Id") + "'");
					bcEmailOffer.ExecuteQuery(ForwardOnly);
					if (bcEmailOffer.FirstRecord()) {
						// поиск данных по ссылке на которую создается отклик
						bcEmailURLs.ClearToQuery();
						bcEmailURLs.SetSearchExpr("[Name] = '" + destName + "'");
						bcEmailURLs.ExecuteQuery(ForwardOnly);
						if (bcEmailURLs.FirstRecord()) {
							trace("URLs Id:" + bcEmailURLs.GetFieldValue("Id"));
							// тут надо подменить значения для отклика
						}
					}
				}
				trace("Offer finded:" + bcOffer.GetFieldValue("Id") + " n:" + bcOffer.GetFieldValue("Name") + " t:" + bcOffer.GetFieldValue("Type") + ' l:' + bcOffer.GetFieldValue("Type LIC"));
			}
		}
	}
}

bcEmailURLs = null;
bcEmailOffer = null;
bcOffer = null;
boOffer = null;
psInput = null;
psOutput = null;
srv = null;

function FindPropByType(prop, ptype) {
	for (var i = 0; i < prop.getChildCount(); i++) {
		if (prop.getChild(i).getType() == ptype) {
			return prop.getChild(i);
		} else {
			var pt = FindPropByType(prop.getChild(i), ptype);
			if (pt != null)
				return pt;
		}
	}
	return null;
}