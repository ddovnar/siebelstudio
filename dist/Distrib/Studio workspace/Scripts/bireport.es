var bo = TheApplication().GetBusObject("Quote");
var bc = bo.GetBusComp("AGR Measures EBC");

bc.ActivateField("Coefficient");
/*bc.ActivateField("Coefficient 1");
bc.ActivateField("Coefficient 2");
//bc.ActivateField("Measures 1");
bc.ActivateField("Measures 2");
bc.ActivateField("Product Id");
bc.ActivateField("Product Quantity");
bc.ActivateField("S Product Id");
bc.ActivateField("Value");*/
bc.ClearToQuery();
bc.SetSearchExpr("[S Product Id]='1-30OM-1243'");
//bc.SetSearchExpr("[Id]='1-RV6-1181-SCY-8714'");
bc.ExecuteQuery(ForwardOnly);
var r = bc.FirstRecord();
var c = 0;
while (r) {
	if (c > 10) {
		r = false;
		break;
	}
	println(bc.GetFieldValue("Id"));
	r = bc.NextRecord();
	c++;
}

