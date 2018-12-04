var bo = TheApplication().GetBusObject("Server Admin");
var bc = bo.GetBusComp("SA-VBC Session");
bc.SetViewMode(AllView);
bc.ActivateField("DB_SESSION_ID");
bc.ActivateField("OM_LOGIN");
bc.ActivateField("TK_TASKID");
bc.ActivateField("TK_PID");
bc.ActivateField("TK_DISP_RUNSTATE");
bc.ExecuteQuery(ForwardOnly);
var r = bc.FirstRecord();
while (r) {
	trace(
		bc.GetFieldValue("DB_SESSION_ID") + " " +
		bc.GetFieldValue("OM_LOGIN") + " " +
		bc.GetFieldValue("TK_TASKID") + " " +
		bc.GetFieldValue("TK_PID") + " " +
		bc.GetFieldValue("TK_DISP_RUNSTATE")
	)
	r = bc.NextRecord();
}

bc = null;
bo = null;
/*var bo = TheApplication().GetBusObject("Contact");
var bc = bo.GetBusComp("Contact");

bc.SetViewMode(AllView);
bc.ActivateField("Last Name");
bc.ClearToQuery();
bc.ExecuteQuery(ForwardOnly);
var r = bc.FirstRecord();
var i = 0;
while (r) {
	if (i == 5) {
		r = false;
		break;
	}
	trace(bc.GetFieldValue("Id") + " " + bc.GetFieldValue("Last Name"));
	i++;
	r = bc.NextRecord();
}

bc = null;
bo = null;
*/
