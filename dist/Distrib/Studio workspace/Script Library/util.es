function testjs() {
	trace("it's work ok");
}

//Your public declarations go here...
function sendEmail(Inputs, Outputs)
{
/*
 * ��������:
 * ������� ��� �������� Email
 *
 * ����� ������:
 * AGR Promotion Utils.SendEmailToManager()
 *
 * �������� ���������:
 * Inputs.GetProperty("In Email Body") - ����� ������, � ������ ���� �� ������������ ������ ���������
 * Inputs.GetProperty("In Email Subject") - ���� ������
 * Inputs.GetProperty("In Email To Line") - ������ �����������
 * Inputs.GetProperty("In SMTP Profile") - ������� �� �������� ���������, �� ��������� Default SMTP Profile
 * Inputs.GetProperty("In Email Template Name") - �������� ������� ������
 * Inputs.GetProperty("In Template Object Id") - Id ������ �� ������� ����������� ������
 * Inputs.GetProperty("In Template SourceBusObj") - �� ��� ������� ���������
 * Inputs.GetProperty("In Link Object Id") - Id �������� ������������ ������, ��� ������ � ������ �����������
 * Inputs.GetProperty("In Link BC 1") - �� � �������� ���������� ��������� ��������
 * Inputs.GetProperty("In Link Id 1") - Id ������ � ������� ������������� ��������
 * Inputs.GetProperty("In Link BC 2") - �� � �������� ���������� ��������� ��������
 * Inputs.GetProperty("In Link Id 2") - Id ������ � ������� ������������� ��������
 * Inputs.GetProperty("In Link BC 3") - �� � �������� ���������� ��������� ��������
 * Inputs.GetProperty("In Link Id 3") - Id ������ � ������� ������������� ��������

��������� ���������:
 * Outputs.GetProperty("Out Error Msg") - ��������� ��������, � ������� ������ ���� ��� ����.
 *
 * ������� ���������:
 * 17.05.2017 - ASTAR - �������
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
