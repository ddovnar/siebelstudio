function GetTime(Inputs, Outputs) {
	var sDateValue = Inputs.GetProperty("Date Value");//"02/22/2014 16:24:15";
	var dtDate = new Date(sDateValue);
	Clib.strftime(sDateValue, "%X", dtDate);
	dtDate = null;
	Outputs.SetProperty("Time", sDateValue);
}

function IsStartTime(Inputs, Outputs) {
	var sDateValue = Inputs.GetProperty("Date Value");
	var dtDate = new Date(sDateValue);
	var dtCurrentDate = new Date();
	var sTemp = "";
	dtDate.setDate(dtCurrentDate.getDate());
	Clib.strftime(sTemp, "%m/%d/%Y %X", dtDate);
	Outputs.SetProperty("CurDate", sTemp);
	if (dtDate >= dtCurrentDate)
		Outputs.SetProperty("Need Start", "Y");
	else
		Outputs.SetProperty("Need Start", "N");
}
