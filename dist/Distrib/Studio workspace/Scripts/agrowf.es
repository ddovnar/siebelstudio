/*var bo = TheApplication().GetBusObject("Quote");
var bc = bo.GetBusComp("AGR Get Goods VBC");
bc.SetViewMode(AllView);
bc.ClearToQuery();
bc.SetSearchExpr("[goodsCode]='166261'");
bc.ExecuteQuery(ForwardOnly);
if (bc.FirstRecord()) {
	Outputs.SetProperty("Res",bc.GetFieldValue("goodsCode"));
}*/
testWF();

/*

var psOutputs1 = TheApplication().NewPropertySet();

var wsDataPS = callWSGoodsReserves("166262");
if (wsDataPS != null) {
	//psOutputs1 = wsDataPS.Copy();
	for (var i = 0; i < wsDataPS.GetChildCount(); i++) {
		psOutputs1.AddChild(wsDataPS.GetChild(i));
	}
} else println("NULL");
println(psOutputs1);

*/
function callWSGoodsReserves(goodsCode) {
var psInputs = TheApplication().NewPropertySet();
var psOutputs = TheApplication().NewPropertySet();
var srvWF = TheApplication().GetService("Workflow Process Manager");

var rs = TheApplication().NewPropertySet();
rs.SetType("Request Source");
psInputs.SetProperty("userRef","10149");
psInputs.SetProperty("goodsCode",goodsCode);
psInputs.SetProperty("ProcessName","AGR GetGoodsReserves WF");
psInputs.AddChild(rs);
srvWF.InvokeMethod("RunProcess", psInputs, psOutputs);
//println(psOutputs);

//println("----------------");
var f = searchPropByType(psOutputs,"goodsReservesBeanArray",true);
//println(f);
return f;//searchPropByType(psOutputs,"ListOfitem",true);
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
/*var bo = TheApplication().GetBusObject("Contact");
var bc = bo.GetBusComp("Sales Assessment");
bc.SetViewMode(AllView);
bc.ActivateField("Updated");
bc.ActivateField("AGR Updated");
bc.ClearToQuery();
bc.SetSearchExpr("[Id]='1-8YZ3N'");
bc.ExecuteQuery(ForwardOnly);
if (bc.FirstRecord()) {
	println("1:"+bc.GetFieldValue("Updated"));
	bc.SetFieldValue("AGR Percent","1");
	println("11:"+bc.GetFieldValue("Updated"));
	println("2:"+bc.GetFieldValue("AGR Updated"));
}
bc = null;
bo = null;*/
//var psInputs = TheApplication().NewPropertySet();
//var psOutputs = TheApplication().NewPropertySet();

////psInputs.SetProperty("In Template Object Id","1-8LGIH");
////psInputs.SetProperty("In Template SourceBusObj","Quote");
////psInputs.SetProperty("In Email Template Name","AGR Quote CreateNewApprovalTasks");				
////psInputs.SetProperty("In Email To Line", "anna.staromuzheva@agromat.ua");
//psInputs.SetProperty("LinkObjId","1-8LGIH");
//psInputs.SetProperty("List","anna.staromuzheva@agromat.ua");
//psInputs.SetProperty("LinkId1","1-8LGIH");
//psInputs.SetProperty("TemplBO","Quote");
//psInputs.SetProperty("TemplObjId","1-8LGIH");
//psInputs.SetProperty("LinkBC1","Quote");
//psInputs.SetProperty("TemplName","AGR Quote CreateNewApprovalTasks");
////ip.SetProperty("ProcessName","AGR Send Inside Email");

//sendEmail(psInputs, psOutputs);
//println(psOutputs);
//testjs();
//println(TheApplication().getSysPref("AMS AMI Char Conversion"));
//testWF();
//println(TheApplication().InvokeMethod("LookupValue", "TODO_TYPE", "Email - Outbound"));
//println(TheApplication().InvokeMethod("LookupValue", "EVENT_STATUS", "Dispatched"));
//println(TheApplication().InvokeMethod("LookupValue", "ACTIVITY_DISPLAY_CODE", "Activity"));
function act() {
var bo = TheApplication().GetBusObject("Action");
var bc = bo.GetBusComp("Action");
bc.SetViewMode(AllView);
bc.ActivateField("Type");
bc.ActivateField("Email Body");
bc.ActivateField("Email Sender Name");
bc.ActivateField("Email To Line");
bc.ActivateField("Status");
bc.ActivateField("Display");
bc.NewRecord(NewAfter);
bc.SetFieldValue("Type", TheApplication().InvokeMethod("LookupValue", "TODO_TYPE", "Email - Outbound"));
bc.SetFieldValue("Email Body", "Email Body");
bc.SetFieldValue("Email Sender Name", "DSDS");
bc.SetFieldValue("Email To Line", "DDD");
bc.SetFieldValue("Status", TheApplication().InvokeMethod("LookupValue", "EVENT_STATUS", "Dispatched"));
bc.SetFieldValue("Display", TheApplication().InvokeMethod("LookupValue", "ACTIVITY_DISPLAY_CODE", "Activity"));
bc.WriteRecord();
println(bc.GetFieldValue("Id"));
}
function testWF() {
var srvWF = TheApplication().GetService("Workflow Process Manager");
var ip = TheApplication().NewPropertySet();
var op = TheApplication().NewPropertySet();

//@0*0*8*0*0*0*9*LinkObjId7*1-8GH2H4*List28*vladimir.vashurin@agromat.ua6*LinkId7*1-8GH2H7*TemplBO5*Quote10*TemplObjId7*1-8GH2H6*LinkBC5*Qoute9*TemplName15*AGR_Quote_Email11*ProcessName21*AGR Send Inside Email
//@0*0*8*0*0*0*9*
/*psInputs.SetProperty("TemplObjId",QuoteId);
			psInputs.SetProperty("TemplBO","Quote");
			psInputs.GetProperty("TemplName",TemplName);
			psInputs.SetProperty("List", emailAddr);
			psInputs.SetProperty("LinkBC1", "Quote");
			psInputs.SetProperty("LinkId1",QuoteId);*/
/*ip.SetProperty("LinkObjId","1-8GH2H");
ip.SetProperty("List","vladimir.vashurin@agromat.ua");
ip.SetProperty("LinkId","1-8GH2H");
ip.SetProperty("TemplBO","Quote");
ip.SetProperty("TemplObjId","1-8GH2H");
ip.SetProperty("LinkBC","Quote");
ip.SetProperty("TemplName","AGR_Quote_Email");
*/
/*ip.SetProperty("LinkObjId","1-8GH2H");
ip.SetProperty("List","artem.kryvoruchenko@agromat.ua");
//ip.SetProperty("LinkId","1-8GH2H");
ip.SetProperty("LinkId1","1-3V8I7");
ip.SetProperty("LinkId2","1-2ATZG");
ip.SetProperty("TemplBO","Service Request");
ip.SetProperty("TemplObjId","1-8GH2H");
ip.SetProperty("LinkBC","Contact");
ip.SetProperty("LinkBC1", "Service Request");
ip.SetProperty("TemplName","Completed SR");*/
ip.SetProperty("List","vladimir.vashurin@agromat.ua");
ip.SetProperty("LinkObjId","1-BYQQJ");
ip.SetProperty("TemplBO","Quote");
ip.SetProperty("TemplObjId","1-BYQQJ");
ip.SetProperty("TemplName","AGR Quote CreateNewApprovalTasks");
ip.SetProperty("LinkBC1","Quote");
ip.SetProperty("LinkId1","1-BYQQJ");
 //@0*0*8*0*0*0*4*List21*peredero.d@agromat.ua9*LinkObjId7*1-BYQQJ7*TemplBO5*Quote10*TemplObjId7*1-BYQQJ9*TemplName32*AGR Quote CreateNewApprovalTasks11*ProcessName21*AGR Send Inside Email7*LinkBC15*Quote7*LinkId17*1-BYQQJ

ip.SetProperty("ProcessName","AGR Send Inside Email");
/*@0*0*9*0*0*0*4*
List30*artem.kryvoruchenko@agromat.ua7*
LinkBC27*Contact7*
TemplBO15*Service Request10*
TemplObjId7*1-3V8I79*
TemplName12*Completed SR11*
ProcessName21*AGR Send Inside Email7*
LinkBC115*Service Request7*
LinkId17*1-3V8I77*
LinkId27*1-2ATZG*/
srvWF.InvokeMethod("RunProcess", ip, op);
println(op);
op = null;
ip = null;
srvWF = null;
/*var bo = TheApplication().GetBusObject("Contact");
var bc = bo.GetBusComp("Contact");

bc.SetViewMode(AllView);
bc.ExecuteQuery(ForwardOnly);
if (bc.FirstRecord()) {
	println("DSDS");
}
bc = null;
bo = null;
*/
}

function sendEmail(sInputs, sOutputs)
{
/*
 * Описание:
 * Функция для отправки Email
 *
 * Точки вызова:
 * AGR Promotion Utils.SendEmailToManager()
 *
 * Входящие аргументы:
 * Inputs.GetProperty("In Email Body") - Текст письма, в случае если не используется шаблон сообщений
 * Inputs.GetProperty("In Email Subject") - Тема письма
 * Inputs.GetProperty("In Email To Line") - Список получателей
 * Inputs.GetProperty("In SMTP Profile") - Профиль дя отправки сообщения, по умолчанию Default SMTP Profile
 * Inputs.GetProperty("In Email Template Name") - Название Шаблона письма
 * Inputs.GetProperty("In Template Object Id") - Id записи по которой формируется шаблон
 * Inputs.GetProperty("In Template SourceBusObj") - ВО для шаблона сообщения
 * Inputs.GetProperty("In Link Object Id") - Id основной родительской записи, для записи в журнал логирования
 * Inputs.GetProperty("In Link BC 1") - БК К которому необходимо привязать действие
 * Inputs.GetProperty("In Link Id 1") - Id записи к которой привязывается действие
 * Inputs.GetProperty("In Link BC 2") - БК К которому необходимо привязать действие
 * Inputs.GetProperty("In Link Id 2") - Id записи к которой привязывается действие
 * Inputs.GetProperty("In Link BC 3") - БК К которому необходимо привязать действие
 * Inputs.GetProperty("In Link Id 3") - Id записи к которой привязывается действие

Исходящие параметры:
 * Outputs.GetProperty("Out Error Msg") - Исходящий параметр, с текстом ошибки если она есть.
 *
 * История изменений:
 * 17.05.2017 - ASTAR - Создана
 */
	var srvWPM = null; 
	try
	{
		srvWPM = TheApplication().GetService("Workflow Process Manager");
                
		sInputs.SetProperty("ProcessName", "AGR Send Inside Email");
		srvWPM.InvokeMethod("RunProcess", sInputs, sOutputs);
	}
	finally
	{
		srvWPM = null;
	}
}
