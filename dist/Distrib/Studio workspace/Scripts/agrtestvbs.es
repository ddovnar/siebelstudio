//test3();
//test4();
//test2();
//test6();
//test7();
//test8();
//test9();
//Unified Messaging Service' invoke method: 'UpdateMessages
//test14();
//test11();
//test3();
//test12();
//test13();
//test15();
test17();

function test17() {
			var html = "<form id=\"agrimgloader\" class=\"agrimageloader\"><input type=\"file\"></form>";
		html += "<script>";
		html += "$(\"#agrimgloader\").find(\"input\").on(\"change\",function(){";
		html += "var formdata = new FormData();";
		html += "var file = $(this)[0].files[0];";
		html += "if (!!file.type.match(/image.*/)) {";
		html += "		if (file.size > 5242880) {";
		html += "			alert(\"Максимальный размер файла 5 мегабайт:\"+(file.size/1024/1024).toFixed(2)+\" МБ\");";
		html += "		} else {";
		html += "			formdata.append(\"image\", file);";
		html += "			if (formdata) {";
		html += "			  $.ajax({";
		html += "			    url: \"http://192.168.3.128/upload.php\",";
		html += "			    type: \"POST\",";
		html += "			    data: formdata,";
		html += " 			   processData: false,";
		html += " 			   contentType: false,";
		html += " 			   success: function (res) {";
		html += " 			     SiebelApp.S_App.GetActiveView().GetApplet(\"AGR Quote Specification Attachment - Line Items List Applet\").GetBusComp().SetFieldValue(\"Additional Prhoto URL\",res);";
		html += "			    }";
		html += "			  });";
		html += "			}";
		html += "		}";
		html += "} else {";
		html += "		alert(\"Это не картинка\");";
		html += "	}";
		html += "});";
		html += "</script>";
	println(html);
}
function test16() {
	//InvokeServiceMethod("AGR Product Admin", "InventoryMeasuresCalcCount", "FromInventoryMeasuresRef=eval([AGR Consumption Unit of Measure]), ToInventoryMeasuresRef=eval([Unit of Measure]), FromCount=eval([Quantity])",  "Count")
	var srv = TheApplication().GetService("AGR ImageLoader Service");
	var ip = TheApplication().NewPropertySet();
	var ip2 = TheApplication().NewPropertySet();
	srv.InvokeMethod("GetUI",ip,ip2);
	println(ip2);
}
function test15() {
	var bo = TheApplication().GetBusObject("Service Request");
	var bc = bo.GetBusComp("Service Request");
	bc.SetViewMode(AllView);
	bc.ActivateField("Type");
	bc.ActivateField("AGR Empl Email");
	bc.NewRecord(NewAfter);
	bc.SetFieldValue("Status","В роботу");
	bc.WriteRecord();
	println(bc.GetFieldValue("Id")+";"+bc.GetFieldValue("AGR Empl Email"));
}
function test14() {
	var srv = TheApplication().GetService("AGR Utility");
	var ip = TheApplication().NewPropertySet();
	var p2 = TheApplication().NewPropertySet();
/*ip.SetProperty("LinkObjId","1-8GH2H");
ip.SetProperty("List","artem.kryvoruchenko@agromat.ua");
ip.SetProperty("LinkId1","1-3V8I7");
ip.SetProperty("LinkId2","1-2ATZG");
ip.SetProperty("TemplBO","Service Request");
ip.SetProperty("TemplObjId","1-3V8I7");
ip.SetProperty("LinkBC","Contact");
ip.SetProperty("LinkBC1", "Service Request");
ip.SetProperty("TemplName","Completed SR");
ip.SetProperty("TemplName","New SR");*/
/*@0*0*7*0*0*0*4*
 * List22*panchenko.e@agromat.ua7*
 * TemplBO5*Quote10*
 * TemplObjId7*1-BY3Q29*
 * TemplName26*AGR Quote CloseApproveTask11*
 * ProcessName21*AGR Send Inside Email7*
 * LinkId17*1-BY3Q27*
 * LinkBC15*Quote
*/
ip.SetProperty("TemplBO","Quote");
ip.SetProperty("List","vladimir.vashurin@agromat.ua");
ip.SetProperty("TemplObjId","1-BY3Q2");
ip.SetProperty("TemplName","AGR Quote CloseApproveTask");
ip.SetProperty("LinkId1","1-BY3Q2");
ip.SetProperty("LinkBC1", "Quote");
srv.InvokeMethod("SendEmail",ip,p2);
	println(p2);
}
function test13() {
	//"AGRSendEmailApproveAction", 
	/*	"INVOKESVC", "Action", 
			"AGR Discount Utils", "SendEmail", 
				"'Email Addr'", "[AGR Creator Email]", 
				"'Templ Name'", "AGR Quote CloseApproveTask", 
				"'Quote Id'", "[Quote Id]"*/
	var srv = TheApplication().GetService("AGR Discount Utils");
	var p1 = TheApplication().NewPropertySet();
	var p2 = TheApplication().NewPropertySet();
	p1.SetProperty("Email Addr", "vladimir.vashurin@agromat.ua");
	p1.SetProperty("Templ Name","AGR Quote CloseApproveTask");
	p1.SetProperty("Templ Name","AGR_Quote_Email");
	p1.SetProperty("Quote Id","1-8GH2H");
	srv.InvokeMethod("SendEmail",p1,p2);
	println(p2);
}
function test12() {
	var bo = TheApplication().GetBusObject("Contact");
	var bc = bo.GetBusComp("Contact");
	bc.SetViewMode(AllView);
	bc.ClearToQuery();
	bc.SetSearchExpr("[Id]='1-1WF2D'");
	bc.ExecuteQuery(ForwardOnly);
	if (bc.FirstRecord()) {
		println("Founded");
	}
	else println("NOT FOUNDED");
}
function test11() {
	var bs = TheApplication().GetService("Row Set Transformation Toolkit");
	var ip = TheApplication().NewPropertySet();
	var op = TheApplication().NewPropertySet();

	var t1 = TheApplication().NewPropertySet();
	var t2 = TheApplication().NewPropertySet();
	var t3 = TheApplication().NewPropertySet();
	var t4 = TheApplication().NewPropertySet();
	
	t3.SetType("Default Product Recommendation Variable Map - Row Set");
	t4.SetType("Default Product Recommendation Variable Map - Context");
	
	t1.SetType("Row Set");
	t1.SetProperty("Local Language","RUS");
	t1.SetProperty("Local Time Zone","(GMT+02:00) Helsinki, Kyiv, Riga, Sofia, Tallinn, Vilnius");
	t1.SetProperty("CPScope","Component");
	t1.SetProperty("CPCollapseAll","Y");
	t1.SetProperty("Mode","Quote");
	t1.SetProperty("RowScope","Current");
	t1.SetProperty("Line Item","1-AZB4W");
	t1.SetProperty("Id","1-AZB4W")
	t1.SetProperty("City","");
	t1.SetProperty("Product Id","1-OVD-961");
	t1.SetProperty("State","");
	t1.SetProperty("Country","");
	t1.SetProperty("Exchange Date","08/23/2017");
	t1.SetProperty("Postal Code","");
	
	t1.AddChild(t3);
	t2.SetType("Context");
	t2.SetProperty("Local Language","RUS");
	t2.SetProperty("Local Time Zone","(GMT+02:00) Helsinki, Kyiv, Riga, Sofia, Tallinn, Vilnius");
	t2.SetProperty("CPScope","Component");
	t2.SetProperty("CPCollapseAll","Y");
	t2.SetProperty("Mode","Quote");
	t2.SetProperty("RowScope","Current");
	t2.SetProperty("Line Item","1-AZB4W");
	t2.SetProperty("Id","1-AZB4W")
	t2.SetProperty("City","");
	t2.SetProperty("Product Id","1-OVD-961");
	t2.SetProperty("State","");
	t2.SetProperty("Country","");
	t2.SetProperty("Exchange Date","08/23/2017");
	t2.SetProperty("Postal Code","");
	t2.AddChild(t4);
	
	ip.AddChild(t1);
	ip.AddChild(t2);
	//ip.SetProperty("", "");
	//ip.SetProperty("Row Set", "Default Product Recommendation Variable Map - Row Set");
	ip.SetProperty("Business Object", "Product Recommendation");
	ip.SetProperty("Business Component", "Product Recommendation Runtime");
	ip.SetProperty("Cache Enabled", "N");
	//ip.SetProperty("Context", "Default Product Recommendation Variable Map - Context");
	ip.SetProperty("Sort Specification", "Score (ASCENDING)");
	//ip.SetProperty("In Memory Search Specification", "([Effective Start Date] IS NULL OR [Effective Start Date]<={Context.Effective Pricing Date}) AND ([Effective End Date] IS NULL OR [Effective End Date]>={Context.Effective Pricing Date}) AND ([Effective From] IS NULL OR [Effective From]<={Context.Effective Pricing Date}) AND ([Effective To] IS NULL OR [Effective To]>={Context.Effective Pricing Date})");
	ip.SetProperty("On First Match 1", "");
	//ip.SetProperty("On Match 1", "{Output Row Set} += New(\"Recommended Product\", [Thmbnl ImgSrc Path] = {Match.Thmbnl ImgSrc Path}, [Image Id] = {Match.Rec Prod Image Id}, [Message Id]={Match.Id}, [Score] = {Match.Score}, [Message Type] = {Match.UMS Type}, [Related Product] = {Match.Recommeded Product Name}, [Reason] = {Match.Translated Reason}, [Product] = {Match.Parent Product Name}, [Campaign Id] = {Match.Campaign Id}, [Related Product Id] = {Match.Recommended Product ID}, [Product Id] = {Match.Recommended Product ID}, [Price Type] = {Match.Price Type}, [Inclusive Eligibility Flag] = {Match.Inclusive Eligibility Flag}, [Message Type Id] = {Match.UMS Type Id},[Prod Id] = {Row.Product Id}, [Account Id] = {Context.Account Id}, [Doc Id] = {Context.Header Id}, [City] = {Context.City}, [State] = {Context.State}, [Country] = {Context.Country}, [Postal Code] = {Context.Postal Code}, [Effective From] = {Match.Effective From}, [Effective To] = {Match.Effective To}, [Pre Pick] = 'Y')");
	//ip.SetProperty("On Match 2", "{Output.Id} = {Match.Id}");
	//ip.SetProperty("On Match 3", "{Output.Quantity} = '1'");
	//ip.SetProperty("On Match 4", "{Output.Price List Id} = {Context.Price List Id}");
	//ip.SetProperty("Search Specification", "[Parent Product ID]={Row.Product Id} AND [UMS Type Cd]<>LookupValue (\"UMS_GROUP_TYPE\", \"Product Offer\")");
	ip.SetProperty("Search Specification", "[Parent Product ID]='1-OVD-9611'");	

	bs.InvokeMethod("Simple Look-Up Transform", ip, op);
	println(op);
	println(ip);
/*	
	@0*0*11*3*0*0*10*
	On Match 323*{Output.Quantity} = '1'20*
	Search Specification103*[Parent Product ID]={Row.Product Id} AND [UMS Type Cd]<>LookupValue ("UMS_GROUP_TYPE", "Product Offer")10*
	On Match 1957*{Output Row Set} += New("Recommended Product", [Thmbnl ImgSrc Path] = {Match.Thmbnl ImgSrc Path}, [Image Id] = {Match.Rec Prod Image Id}, [Message Id]={Match.Id}, [Score] = {Match.Score}, [Message Type] = {Match.UMS Type}, [Related Product] = {Match.Recommeded Product Name}, [Reason] = {Match.Translated Reason}, [Product] = {Match.Parent Product Name}, [Campaign Id] = {Match.Campaign Id}, [Related Product Id] = {Match.Recommended Product ID}, [Product Id] = {Match.Recommended Product ID}, [Price Type] = {Match.Price Type}, [Inclusive Eligibility Flag] = {Match.Inclusive Eligibility Flag}, [Message Type Id] = {Match.UMS Type Id},[Prod Id] = {Row.Product Id}, [Account 
Id] = {Context.Account Id}, [Doc Id] = {Context.Header Id}, [City] = {Context.City}, [State] = {Context.State}, [Country] = {Context.Country}, [Postal Code] = {Context.Postal Code}, [Effective From] = {Match.Effective From}, [Effective To] = {Match.Effective To}, [Pre Pick] = 'Y')10*
On Match 448*{Output.Price List Id} = {Context.Price List Id}13*
Cache Enabled1*N18*
Business Component30*Product Recommendation Runtime18*
Sort Specification17*Score (ASCENDING)30*
In Memory Search Specification351*([Effective Start Date] IS NULL OR [Effective Start Date]<={Context.Effective Pricing Date}) AND ([Effective End Date] IS NULL OR [Effective End Date]>={Context.Effective Pricing Date}) AND ([Effective From] IS NULL OR [Effective From]<={Context.Effective Pricing Date}) AND ([Effective To] IS NULL OR [Effective To]>={Context.Effective Pricing Date})16*
On First Match 137*{Context.HasRecommendedProduct} = 'Y'15*
Business Object22*Product Recommendation10*
On Match 224*{Output.Id} = {Match.Id}6*1*7*
Context3*53*Default Product Recommendation Variable Map - Context14*
Local Language3*RUS15*
Local Time Zone57*(GMT+02:00) Helsinki, Kyiv, Riga, Sofia, Tallinn, Vilnius7*
CPScope9*Component13*
CPCollapseAll0*4*Mode5*Quote8*RowScope7*Current22*0*6*Header3*7*1-A5TJS18*Service Account Id0*10*Account Id0*17*Pay To Account Id0*4*City0*10*Contact Id0*13*Currency Code3*UAH5*State0*11*Customer Id0*18*Bill To Address Id15*No Match Row Id16*Discount Percent0*9*Header Id7*1-A5TJS7*Country0*22*Effective Pricing Date19*08/23/2017 16:47:5818*Ship To Address Id15*No Match Row Id18*Billing Account Id0*18*Bill To Account Id0*4*Mode5*Quote13*Exchange Date0*8*Quantity1*112*Account Type0*13*Price List Id7*1-1DWZF11*Postal Code0*0*0*14*Output Row Set0*6*1*7*
Row Set3*53*Default Product Recommendation Variable Map - Row Set14*
	Local Language3*RUS15*
	Local Time Zone57*(GMT+02:00) Helsinki, Kyiv, Riga, Sofia, Tallinn, Vilnius7*
	CPScope9*Component13*
	CPCollapseAll1*Y4*
	Mode5*Quote8*
	RowScope7*Current7*0*9*
	Line Item3*7*1-AZB4W2*
	Id7*1-AZB4W4*City0*10*
	Product Id10*1-OVD-96115*
	State0*7*
	Country0*13*
	Exchange Date10*08/23/201711*
	Postal Code0*
*/
}
function test10() {
	var bo = TheApplication().GetBusObject("Quote");
	var bcc = bo.GetBusComp("Price List");
	bcc.SetViewMode(AllView);
	bcc.ClearToQuery();
	bcc.SetSearchExpr("[Id]='1-1DWZF'");
	bcc.ExecuteQuery(ForwardOnly);
	bcc.FirstRecord();
	println("ssss");
	var bc1 = bo.GetBusComp("Quote Catalog Internal Product by Price List Optional 2 OUI");
	bc1.SetViewMode(AllView);

	//oApp.setSharedGlobal("AGR_Stocks_VBC_BS_arrProdCodes", "");
	bc1.ActivateField("AGR Name");
	bc1.ActivateField("Name");
	bc1.ClearToQuery();
	var SearchStr = "EXISTS([AGR Promotion Component Search Parent Id] IS NOT NULL)";
	SearchStr="[AGR Product Promoutoin]= 'Y'";
	//SearchStr="Count('AGR Promotion Component') > 0";
	//TheApplication().SetProfileAttr('SearchExpProduct',SearchStr);
	bc1.SetSearchExpr(SearchStr);
	bc1.ExecuteQuery(ForwardOnly);
	//println(bc.InvokeMethod("CountRecords"));
	println(bc1.GetSearchExpr());
	var rv = bc1.FirstRecord();
	//println("F:"+bc1.GetFieldValue("Id"));
	var ci=0;
	while (rv) {
		println("F:"+bc1.GetFieldValue("Id"));
		rv = bc1.NextRecord();
		ci++;
	}
	/*if (bc.FirstRecord()) {
		println("fetched");
	} else {
		println("NOTHING");
	}*/
}
function test9() {
	var bo = TheApplication().GetBusObject("Employee");
	var bc = bo.GetBusComp("Employee");
	bc.SetViewMode(AllView);
	bc.ActivateField("AGR Regions Ref Id");
	bc.ActivateField("Login Name");
	bc.ClearToQuery();
	bc.SetSearchExpr("[Login Name]='MANAGER'");//1-8EH-240'");
	bc.ExecuteQuery(ForwardOnly);
	if (bc.FirstRecord()) {
		println("UserLogin:"+bc.GetFieldValue("Login Name"));
		println("RegionRefId:"+bc.GetFieldValue("AGR Regions Ref Id"));
	}
}
function test8() {
	var sErrMsg="";
		var BS = TheApplication().GetService("Workflow Process Manager");
		var InpPS = TheApplication().NewPropertySet();
		var psResponse = TheApplication().NewPropertySet();
		var strIndvName;

		InpPS.SetProperty("NDSPayer","false");//Плательщик НДС
		InpPS.SetProperty("agent","true");//Посредник
		InpPS.SetProperty("agentDiscount","4");//Скидка посредника
		InpPS.SetProperty("certificateNumber","");//Номер свидетельства
		InpPS.SetProperty("certificateDate","08/22/2017");//Дата выдачи свидетельства
		InpPS.SetProperty("customer","true");//Покупатель
		InpPS.SetProperty("edrpou","123456");//ЕГРПОУ
		InpPS.SetProperty("fullName","PHISIKP3 PHISIKG PHISIKH");//Полное наименование
		InpPS.SetProperty("innNumber","1234567");
		InpPS.SetProperty("innDate","08/22/2017");
//08/22/2017
		
		InpPS.SetProperty("name","PHISIKP3 PHISIKG PHISIKH");//Наименование
		InpPS.SetProperty("phisicalPerson","true");//Резидент
		InpPS.SetProperty("phones","4342");
		InpPS.SetProperty("resident","true");//Резидент
		InpPS.SetProperty("supplier","false");//Поставщик
		InpPS.SetProperty("wholeSale","false");//Оптовик
		
		//InpPS.SetProperty("userRef","10149");//Ид пользователя R2
		InpPS.SetProperty("userRef", "947");
		println("REG:"+TheApplication().GetProfileAttr("AGR Regions Ref Id"));
		InpPS.SetProperty("regionsRef", TheApplication().GetProfileAttr("AGR Regions Ref Id"));//Ид Региона //ИД Региона пользователя, который инициирует создание записи
		//InpPS.SetProperty("regionsRef", "");
		
		InpPS.SetProperty("ProcessName","AGR Conragent Add WF");
		BS.InvokeMethod("RunProcess",InpPS,psResponse);
		println(psResponse);
}
function test7() {
	var bo = TheApplication().GetBusObject("Account");
	var bc = bo.GetBusComp("Account");
	bc.SetViewMode(AllView);
	bc.ActivateField("AGR All Phone Number Str");
	bc.ClearToQuery();
	bc.SetSearchExpr("[Id]='1-AN86Z'");
	bc.ExecuteQuery(ForwardOnly);
	if (bc.FirstRecord()) {
		bc.SetFieldValue("AGR All Phone Number Str","0631112233");
		bc.WriteRecord();
	}
}
function test6() {
	var bo = TheApplication().GetBusObject("Admin ISS Product Definition");
	var bcUiCnxtParent = bo.GetBusComp("Internal Product - ISS Admin");
		var bcUiCnxtChild = bo.GetBusComp("AGR Internal Product - ISS Admin Recommended");
		var bcUiCnxtRecmd = bo.GetBusComp("Product Recommendation");

		bcUiCnxtParent.SetViewMode(AllView);
		bcUiCnxtParent.ClearToQuery();
		bcUiCnxtParent.SetSearchExpr("[Id]='1-OVR-3654'");
		bcUiCnxtParent.ExecuteQuery(ForwardOnly);
		if (bcUiCnxtParent.FirstRecord()) {
			println("ProductParent founded");
		//if(bcUiCnxtParent.FirstSelected())
		//{
			bcUiCnxtChild.SetViewMode(AllView);
		bcUiCnxtChild.ClearToQuery();
		bcUiCnxtChild.SetSearchExpr("[Id]='1-OVR-3656'");
		bcUiCnxtChild.ExecuteQuery(ForwardOnly);
		
			bcUiCnxtRecmd.ActivateField("Parent Product ID");
			bcUiCnxtRecmd.ActivateField("Recommended Product ID");
			bcUiCnxtRecmd.ActivateField("Recommended Product Name");
			bcUiCnxtRecmd.ActivateField("UMS Type");
			bcUiCnxtRecmd.ActivateField("Reason");
			bcUiCnxtRecmd.ClearToQuery();
			//bcUiCnxtRecmd.SetSearchExpr("[Id]='1-OVR-3656'");
			bcUiCnxtRecmd.ExecuteQuery(ForwardOnly);

				var sParntId = bcUiCnxtParent.GetFieldValue("Id");
				//if(bcUiCnxtChild.FirstSelected())
				//{
				if (bcUiCnxtChild.FirstRecord()) {
					println("ProductChild founded");
						var sRecmdId = bcUiCnxtChild.GetFieldValue("Id");
						var sSrchExp = "[Parent Product ID] = '" + sParntId + "' AND [Recommended Product ID] = '" + sRecmdId + "'";
						bcUiCnxtRecmd.ClearToQuery();
						bcUiCnxtRecmd.SetSearchExpr(sSrchExp);
						bcUiCnxtRecmd.ExecuteQuery(ForwardOnly);
						if(!bcUiCnxtRecmd.FirstRecord())// if not exist
						{
							println("ProductName:"+bcUiCnxtChild.GetFieldValue("Name"));
							println("ProductId:"+sRecmdId);
							bcUiCnxtRecmd.NewRecord(NewAfter);
							bcUiCnxtRecmd.SetFieldValue("Parent Product ID", sParntId);
							//bcUiCnxtRecmd.SetFieldValue("Recommended Product ID", sRecmdId);
							//bcUiCnxtRecmd.SetFieldValue("Recommeded Product Name", bcUiCnxtChild.GetFieldValue("Name"));
							var picker = bcUiCnxtRecmd.GetPicklistBusComp("Recommeded Product Name");
							picker.ClearToQuery();
							picker.SetSearchExpr("[Id]='"+sRecmdId+"'");
							picker.ExecuteQuery(ForwardOnly);
							if (picker.FirstRecord()) {
								println("Founded in pick");
								picker.Pick();
							} else {
								println("Not founded in pick");
							}
							bcUiCnxtRecmd.SetFieldValue("UMS Type", "");
							bcUiCnxtRecmd.SetFieldValue("Reason", this.BusComp().GetFieldValue("Reason"));
							bcUiCnxtRecmd.WriteRecord();
						}
				} else {
					println("ProductChild not founded");
				}
		} else {
			println("ProductParent not founded");
		}
}
function test5() {
	println(TheApplication().GetProfileAttr("Primary Responsibility Name"));
var bo = TheApplication().GetBusObject("Employee");
var bc = bo.GetBusComp("Employee");
bc.ClearToQuery();
bc.SetSearchExpr("[Login Name]='"+TheApplication().LoginName()+"'");
bc.ExecuteQuery(ForwardOnly);
if (bc.FirstRecord()) {
	var bc1 = bc.GetMVGBusComp("Responsibility");
	bc1.ClearToQuery();
	bc1.ExecuteQuery(ForwardOnly);
	var r = bc1.FirstRecord();
	while (r) {
		println(bc1.GetFieldValue("Name"));
		r = bc1.NextRecord();
	}
}
}
function test4() {
	var bo = TheApplication().GetBusObject("Account");
	var bc1 = bo.GetBusComp("Account");
	var bc = bo.GetBusComp("Personal Address");
	bc1.SetViewMode(AllView);
	bc1.SetSearchExpr("[Id]='1-4UGRS'");
	bc1.ExecuteQuery(ForwardOnly);
	if (bc1.FirstRecord()) {
		bc.SetViewMode(AllView);
		bc.ActivateField("AGR Manager Flg");
		bc.ClearToQuery();
		bc.ExecuteQuery(ForwardOnly);
		if (bc.FirstRecord()) {
			println(bc.GetFieldValue("Id"));
		}
	}
	bc = null;
	bo = null;
}
function test3(){
var bo = TheApplication().GetBusObject("Quote");
var bca = bo.GetBusComp("Internal Product");

bca.SetViewMode(AllView);
bca.ClearToQuery();
bca.SetSearchExpr("[Id]='1-9ZQ8F'");
bca.ExecuteQuery(ForwardOnly);
bca.FirstRecord();

var bc = bo.GetBusComp("UMF Passive Message Virtual BusComp");
bc.SetViewMode(AllView);
bc.ClearToQuery();
bc.SetSortSpec("Sequence(DESCENDING)");
bc.ExecuteQuery(ForwardOnly);
var r = bc.FirstRecord();
while (r) {
	println("11");
	r = bc.NextRecord();
}
}
function test2() {
var bo = TheApplication().GetBusObject("Quote");
var bc = bo.GetBusComp("Quote Item");
bc.SetViewMode(AllView);
bc.ActivateField("Product Id");
bc.ActivateField("AGR Agromat Price List Currency");
bc.ActivateField("AGR Agromat Price - Price List");
bc.ClearToQuery();
bc.SetSearchExpr("[Id]='1-9W7D2'");
//bc.SetSearchExpr("[Id]='1-9ZQ8F'");
bc.ExecuteQuery(ForwardOnly);
if (bc.FirstRecord()) {
	println("Exists:"+bc.GetFieldValue("Product Id"));
	println("PR:"+bc.GetFieldValue("AGR Agromat Price - Price List"));

	var bcp = bo.GetBusComp("Price List Item");
	bcp.SetViewMode(AllView);
	bcp.ActivateField("Price List Name");
	bcp.ActivateField("Price List Currency Code");
	bcp.ClearToQuery();
	bcp.SetSearchExpr("[Product Id]='" + bc.GetFieldValue("Product Id") + "'");
	bcp.ExecuteQuery(ForwardOnly);
	println("SearchPriceListByProduct");
	if (bcp.FirstRecord()) {
		println("PriceProduct:"+bcp.GetFieldValue("Price List Name") + "-" + bcp.GetFieldValue("Price List Currency Code"));
	} else {
		println("NO PRICE BY PRODUCT");
	}

	
	var bcMVG = bc.GetMVGBusComp("AGR Agromat Price List Currency");
	bcMVG.SetViewMode(AllView);
	bcMVG.ClearToQuery();
	bcMVG.ExecuteQuery(ForwardOnly);
	if (bcMVG.FirstRecord()) {
		println("Price OK");
	} else println("PriceList NO");
}
bc = null;
bo=null;
}
function test1() {
var bo = TheApplication().GetBusObject("Admin ISS Product Definition");
var bc = bo.GetBusComp("Internal Product - ISS Admin");
bc.SetViewMode(AllView);
bc.ActivateField("AGR Prod Integration Id");
bc.ActivateField("AGR RO Field");
bc.ActivateField("Description");
bc.ActivateField("AGR Alias Name");//100112867 (G105480002) TE Wash basin unit 60x48x45, Gris nocturno brillo
bc.ClearToQuery();
//bc.SetSearchExpr("[AGR Prod Integration Id]<>[Id] AND [AGR Prod Integration Id] IS NOT NULL");
bc.SetSearchExpr("[AGR Prod Integration Id]=[Id]");
//bc.SetSearchExpr("[AGR RO Field]='N'");
bc.ExecuteQuery(ForwardOnly);
if (bc.FirstRecord()) {
	//bc.SetFieldValue("Description", "TESTSCRPT");
	//bc.SetFieldValue("AGR Alias Name", "100112867 (G105480002) TE Wash basin unit 60x48x45, Gris nocturno brillo");
	//bc.WriteRecord();
	println(bc.GetFieldValue("Id") + "-" + bc.GetFieldValue("AGR Prod Integration Id")+"-"+bc.GetFieldValue("AGR RO Field")
	+"-"+bc.GetFieldValue("AGR Alias Name"));
}
}
//GetSearchSpec("([goodsCode] = \"\"166261\"\")","=");
/*var bo = TheApplication().GetBusObject("Quote");
var bc = bo.GetBusComp("AGR Get Goods VBC");

bc.ClearToQuery();
bc.SetSearchExpr("[goodsCode]=166261");
bc.ExecuteQuery(ForwardOnly);
if (bc.FirstRecord()) {
	println(bc.GetFieldValue("goodsCode"));
} else println("EMPTY");*/
/*var psi = TheApplication().NewPropertySet();
var pso = TheApplication().NewPropertySet();
Service_PreInvokeMethod("Query",psi,pso);

println(pso);
*/
function GetSearchSpec(searchSpec, searchCmd) {
	var fieldName=""; var fieldValue="";
	var startPos = 0;
    var endPos = 0;

    startPos = searchSpec.indexOf("[");
    if (startPos > -1 && startPos + 1 < searchSpec.length) {
        searchSpec = searchSpec.substring(startPos + 1, searchSpec.length);
        endPos = searchSpec.indexOf("]");
        if (endPos > -1) {
            fieldName = searchSpec.substring(0, endPos);
            startPos = searchSpec.toUpperCase().indexOf(searchCmd);
            if (startPos > -1 && startPos + searchCmd.length < searchSpec.length) {
                searchSpec = searchSpec.substring(startPos + searchCmd.length, searchSpec.length);
                startPos = searchSpec.indexOf("\"\"");
                if (startPos > -1 && startPos + 1 < searchSpec.length) {
                    searchSpec = searchSpec.substring(startPos + 2, searchSpec.length);
                    endPos = searchSpec.indexOf("*");
                    if (endPos == -1)
                        endPos = searchSpec.indexOf("\"\"");
                    if (endPos > -1)                    
                        fieldValue = searchSpec.substring(0, endPos);
                }
            }
        }
    }
    println("F:"+fieldName);
    println("V:"+fieldValue);
}
function Service_PreInvokeMethod (MethodName, pInputs, pOutputs)
{
 if (MethodName == "Init")
 {
  pInputs.SetProperty("resDocsName","");
  pInputs.SetProperty("storageInventoryMeasuresName","");
  pInputs.SetProperty("docExternalsRef","");
  pInputs.SetProperty("count","");
  pInputs.SetProperty("resDocsComment","");
  pInputs.SetProperty("resDocsShopsName","");
  pInputs.SetProperty("reserveTill","");
  pInputs.SetProperty("resDocsCardsName","");
  pInputs.SetProperty("resDocsOperStatesName","");
  pInputs.SetProperty("resDocsRef","");
  pInputs.SetProperty("saleInventoryMeasuresName","");
  pInputs.SetProperty("resDocsPartnersName","");
  pInputs.SetProperty("goodsName","");
  pInputs.SetProperty("saleCount","");
  pInputs.SetProperty("goodsCode","");
  pInputs.SetProperty("warehousesName","");
  pInputs.SetProperty("resDocsDocTypesName","");
  pInputs.SetProperty("resDocsDate","");

  //return (CancelOperation);
 }
 
 if (MethodName == "Query")
 {
  var fieldName = "goodsCode";
        var fieldValue = "166261";
  
  /*if (Inputs.PropertyExists("search-string")) {
            GetSearchSpec(Inputs.GetProperty("search-string"), "LIKE", fieldName, fieldValue);
            if (fieldName == "" && fieldValue == "")
                GetSearchSpec(Inputs.GetProperty("search-string"), "=", fieldName, fieldValue);
        }*/

  if (fieldName == "goodsCode" && fieldValue != "") {
   var psInputs = TheApplication().NewPropertySet();
   var psOutputs = TheApplication().NewPropertySet();
   var srvWF = TheApplication().GetService("Workflow Process Manager");
   
   var rs = TheApplication().NewPropertySet();
   rs.SetType("Request Source");
   psInputs.SetProperty("userRef","10149");
   psInputs.SetProperty("goodsCode",fieldValue);
   psInputs.SetProperty("ProcessName","AGR GetGoodsReserves WF");
   psInputs.AddChild(rs);
   srvWF.InvokeMethod("RunProcess", psInputs, psOutputs);
 
   var wsDataPS = searchPropByType(psOutputs,"ListOfitem",true);
   if (wsDataPS != null) {
//    Outputs = wsDataPS.Copy();
for (var i = 0; i < wsDataPS.GetChildCount(); i++) {
		pOutputs.AddChild(wsDataPS.GetChild(i));
	}
    rs = null;
    wsDataPS = null;
    psInputs = null;
    psOutputs = null;
    srvWF = null;
   }
  }
  //return (CancelOperation);
 }
}

function searchPropByType(pInputs, propertyName, wholeWord) {
/* поиск по структуре PropertySet
 pInputs - структура PropertySet, в которой ищем
 propertyName - имя Child PS, которое ищем
 wholeWord - поиск по полному названию true, иначе false
 Результат: найденая Child PS*/
    if ((!wholeWord && pInputs.GetType().indexOf(propertyName) > -1) ||
        (wholeWord && pInputs.GetType() == propertyName)) {
        return pInputs;
    }

    for (var i = 0; i < pInputs.GetChildCount(); i++) {
        var psFounded = searchPropByType(pInputs.GetChild(i), propertyName, wholeWord);
        if (psFounded != null)
            return psFounded;
    }
    return null;
}

function Trim(str) {
	return str.replace(/^\s+|\s+$/g, '');
}
