/*@0*0*1*1*0*0*11*
ProcessName47*Product Recommendation Get Recommended Products3*2*0*0*15*
EligibilityFlag1*Y11*
PricingFlag1*Y19*
SubPSPPricingWFName23*Basic Pricing Procedure1*1*7*
Context0*30*__WFProcessInputPropertyName__7*Context6*1*7*
	Context3*53*Default Product Recommendation Variable Map - Context14*
	Local Language3*RUS15*
	Local Time Zone57*(GMT+02:00) Helsinki, Kyiv, Riga, Sofia, Tallinn, Vilnius7*
	CPScope9*Component13*
	CPCollapseAll0*8*
	RowScope7*Current4*
	Mode5*Quote21*0*6*
	Header3*7*1-BDGXI18*
	Service Account Id0*10*
	Account Id0*17*
	Pay To Account Id0*13*
	Currency Code3*UAH10*
	Contact Id0*4*
	City0*11*
	Customer Id0*5*
	State0*9*
	Header Id7*1-BDGXI16*
	Discount Percent0*18*
	Bill To Address Id15*No Match Row Id7*
	Country0*18*
	Billing Account Id0*18*
	Ship To Address Id15*No Match Row Id18*
	Bill To Account Id0*13*
	Exchange Date0*4*
	Mode5*Quote8*
	Quantity1*111*
	Postal Code0*13*
	Price List Id7*1-1DWZF12*
	Account Type0*1*1*6*
		RowSet0*30*__WFProcessInputPropertyName__6*RowSet6*1*6*
			RowSet3*53*Default Product Recommendation Variable Map - Row Set14*
			Local Language3*RUS15*
			Local Time Zone57*(GMT+02:00) Helsinki, Kyiv, Riga, Sofia, Tallinn, Vilnius7*
			CPScope9*Component13*
			CPCollapseAll1*Y8*
			RowScope7*Current4*
			Mode5*Quote7*0*9*
			Line Item3*7*1-BDH0O2*
			Id7*1-BDH0O10*
			Product Id10*1-OVR-36544*
			City0*5*
			State0*7*
			Country0*13*
			Exchange Date10*09/01/201711*
			Postal Code0*
			*/
var quoteId = "1-BDGXI";//"1-9SPMS";
var quoteItemId = "1-BDH0O";//"1-BDLRB";
var productId = "1-OVD-9611";

var BS = TheApplication().GetService("Workflow Process Manager");
var InpPS = TheApplication().NewPropertySet();
var psResponse = TheApplication().NewPropertySet();

InpPS.SetProperty("ProcessName","Product Recommendation Get Recommended Products");
InpPS.SetProperty("EligibilityFlag","Y");
InpPS.SetProperty("PricingFlag","Y");
InpPS.SetProperty("SubPSPPricingWFName","Basic Pricing Procedure");

var ip1 = TheApplication().NewPropertySet();
ip1.SetType("Context");
ip1.SetProperty("Context","Default Product Recommendation Variable Map - Context");
ip1.SetProperty("Local Language","RUS");
ip1.SetProperty("Local Time Zone","(GMT+02:00) Helsinki, Kyiv, Riga, Sofia, Tallinn, Vilnius");
ip1.SetProperty("CPScope","Component");
ip1.SetProperty("CPCollapseAll","");
ip1.SetProperty("RowScope","Current");
ip1.SetProperty("Mode","Quote");
ip1.SetProperty("Header",quoteId);
ip1.SetProperty("Service Account Id","");
ip1.SetProperty("Account Id","");
ip1.SetProperty("Pay To Account Id","");
ip1.SetProperty("Currency Code","UAH");
ip1.SetProperty("Contact Id","");
ip1.SetProperty("City","");
ip1.SetProperty("Customer Id","");
ip1.SetProperty("State","");
ip1.SetProperty("Header Id",quoteId);
ip1.SetProperty("Discount Percent","");
ip1.SetProperty("Bill To Address Id","No Match Row Id");
ip1.SetProperty("Country","");
ip1.SetProperty("Billing Account Id","");
ip1.SetProperty("Ship To Address Id","No Match Row Id");
ip1.SetProperty("Bill To Account Id","");
ip1.SetProperty("Exchange Date","");
ip1.SetProperty("Mode","Quote");
ip1.SetProperty("Quantity","1");
ip1.SetProperty("Postal Code","");
ip1.SetProperty("Price List Id","1-1DWZF");
ip1.SetProperty("Account Type","");

var ip2 = TheApplication().NewPropertySet();
ip2.SetType("RowSet");
ip2.SetProperty("RowSet","Default Product Recommendation Variable Map - Row Set");
ip2.SetProperty("Local Language","RUS");
ip2.SetProperty("Local Time Zone","(GMT+02:00) Helsinki, Kyiv, Riga, Sofia, Tallinn, Vilnius");
ip2.SetProperty("CPScope","Component");
ip2.SetProperty("CPCollapseAll","Y");
ip2.SetProperty("RowScope","Current");
ip2.SetProperty("Mode","Quote");
ip2.SetProperty("Line Item",quoteItemId);
ip2.SetProperty("Id",quoteItemId);
ip2.SetProperty("Product Id",productId);
ip2.SetProperty("City","");
ip2.SetProperty("State","");
ip2.SetProperty("Country","");
ip2.SetProperty("Exchange Date","09/01/2017");
ip2.SetProperty("Postal Code","");

//ip1.AddChild(ip2);
var ps3 = TheApplication().NewPropertySet();
ps3.SetType("Context");
ps3.AddChild(ip1);

var ps4 = TheApplication().NewPropertySet();
ps4.SetType("RowSet");
ps4.AddChild(ip2);

InpPS.AddChild(ps3);
InpPS.AddChild(ps4);

BS.InvokeMethod("RunProcess", InpPS, psResponse);

//println(psResponse);

if (psResponse.GetChildCount() > 0) {
	var item = psResponse.GetChild(0);
	for (var i = 0; i < item.GetChildCount(); i++) {
		println("Score:" + item.GetChild(i).GetProperty("Score")+
			"RelatedProdId:" + item.GetChild(i).GetProperty("Related Product Id")+
			"Reason:"+item.GetChild(i).GetProperty("Reason") + 
			"Image:"+item.GetChild(i).GetProperty("Image Id"));
	}
}
