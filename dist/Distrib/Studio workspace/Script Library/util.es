function testjs() {
	trace("it's work ok");
}

//Your public declarations go here...
function sendEmail(Inputs, Outputs)
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
                
		Inputs.SetProperty("ProcessName", "AGR Send Inside Email");
		srvWPM.InvokeMethod("RunProcess", Inputs, Outputs);
	}
	finally
	{
		srvWPM = null;
	}
}
