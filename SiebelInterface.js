//Define Escript Constants
var ContinueOperation = true;       var CancelOperation       = false;
 
//ExecuteQuery constants
var ForwardOnly       = true;       var ForwardBackward       = false;
var NewAfter          = true;       var NewBefore             = false;
 
//SetViewMode
var SalesRepView      = 0;          var OrganizationView      = 5;
var ManagerView       = 1;          var GroupView             = 7;
var PersonalView      = 2;          var CatalogView           = 8;
var AllView           = 3;          var SubOrganizationView   = 9;
 
var Inputs            = oApp.newPropertySet();
var Outputs           = oApp.newPropertySet();
var arrDefaultInput   = [];
var Appinstance       = 0;
var gApplication;
 
//TheApplication() Class
function TheApplication() {
  if (gApplication == null) {
    Appinstance = Appinstance+1;
    gApplication = new class_app(oApp);
  }
  return gApplication;
}
 
//class_app.prototype = oApp;
class_app.prototype.GetProfileAttr          = class_app_GetProfileAttr;
class_app.prototype.SetProfileAttr          = class_app_SetProfileAttr;
class_app.prototype.Trace                   = class_app_Trace;
class_app.prototype.TraceOff                = class_app_TraceOff;
class_app.prototype.TraceOn                 = class_app_TraceOn;
class_app.prototype.PositionId              = class_app_PositionId;
class_app.prototype.PositionName            = class_app_PositionName;
class_app.prototype.LoginId                 = class_app_LoginId;
class_app.prototype.LoginName               = class_app_LoginName;
class_app.prototype.InvokeMethod            = class_app_InvokeMethod;
class_app.prototype.GetBusObject            = GetBusObject;
class_app.prototype.GetService              = GetService;
class_app.prototype.NewPropertySet          = NewPropertySet;
class_app.prototype.RaiseErrorText			= class_app_RaiseErrorText;
 
function class_app(application)             {if(application != null){this._application = application; }}
function class_app_GetProfileAttr(v)        {return this._application.getProfileAttr(v) ;} //+ '';}
function class_app_SetProfileAttr(n,v)      {return this._application.setProfileAttr(n,v);}
function class_app_Trace(v)                 {trace(v);}
function class_app_TraceOff()               {return this._application.traceOff();}
function class_app_TraceOn(f,t,s)           {return this._application.traceOn(f,t,s);}
function class_app_PositionId()             {return this._application.positionId() ;} //+ '';}
function class_app_PositionName()           {return this._application.positionName() ;} //+ '';}
function class_app_LoginId()                {return this._application.loginId() ;} //+ '';}
function class_app_LoginName()              {return this._application.loginName() ;} //+ '';}
function class_app_NewPropertySet()         {return this._application.newPropertySet();}
function class_app_InvokeMethod(){
var sMethod = arguments[0];
var aInput  = [];
  for(var i=1; i<arguments.length; i++){
    aInput.push(arguments[i])
  }
  return this._application.invokeMethod(sMethod, aInput);
}
function class_app_RaiseErrorText(v)			{Dialog.showMessageDialog(null, v);}
 
 
 
//NewPropertySet() Class
//class_PS.prototype = new class_PS(oPS);
class_PS.prototype.PropertyExists           = class_PS_PropertyExists;
class_PS.prototype.GetProperty              = class_PS_GetProperty;
class_PS.prototype.getProperty              = class_PS_GetProperty;
class_PS.prototype.SetProperty              = class_PS_SetProperty;
class_PS.prototype.setProperty              = class_PS_SetProperty;
class_PS.prototype.GetValue                 = class_PS_GetValue;
class_PS.prototype.SetValue                 = class_PS_SetValue;
class_PS.prototype.GetType                  = class_PS_GetType;
class_PS.prototype.SetType                  = class_PS_SetType;
class_PS.prototype.Copy                     = class_PS_Copy;
class_PS.prototype.Reset                    = class_PS_Reset;
class_PS.prototype.GetChild                 = class_PS_GetChild;
class_PS.prototype.AddChild                 = class_PS_AddChild;
class_PS.prototype.RemoveChild              = class_PS_RemoveChild;
class_PS.prototype.RemoveProperty           = class_PS_RemoveProperty;
class_PS.prototype.InsertChildAt            = class_PS_InsertChildAt;
class_PS.prototype.GetFirstProperty         = class_PS_GetFirstProperty;
class_PS.prototype.GetNextProperty          = class_PS_GetNextProperty;
class_PS.prototype.GetPropertyCount         = class_PS_GetPropertyCount;
class_PS.prototype.GetChildCount				= class_PS_GetChildCount;
 
function NewPropertySet()                  {return new class_PS(this._application.newPropertySet() );}
//function NewPropertySet()                  {return new class_PS(oApp.newPropertySet());}
//function NewPropertySet()                   {return new class_PS( oPS );}
function class_PS(PS)                       {if(PS != null){this._PS = PS;} }
function class_PS_PropertyExists(v)         {return this._PS.propertyExists(v);}
function class_PS_GetProperty(v)            {return this._PS.getProperty(v) ;} //+ '';}
function class_PS_SetProperty(n,v)          {return this._PS.setProperty(n,v);}
function class_PS_GetValue(v)               {return this._PS.getValue(v) ;} //+ '';}
function class_PS_SetValue(v)               {return this._PS.setValue(v);}
function class_PS_GetType(v)                {return this._PS.getType(v) ;} //+ '';}
function class_PS_SetType(v)                {return this._PS.setType(v);}
function class_PS_Copy()                    {return this._PS.copy();}
function class_PS_Reset()                   {return this._PS.reset();}
function class_PS_GetChild(i)               {return this._PS.getChild(i);}
function class_PS_AddChild(Ps)              {return this._PS.addChild(Ps);}
function class_PS_RemoveChild(i)            {return this._PS.removeChild(i);}
function class_PS_RemoveProperty(v)         {return this._PS.removeProperty(v);}
function class_PS_InsertChildAt(obj,i)      {return this._PS.insertChildAt(obj,i);}
function class_PS_GetFirstProperty()        {return this._PS.getFirstProperty() ;} //+ '';}
function class_PS_GetNextProperty()         {return this._PS.getNextProperty() ;} //+ '';}
function class_PS_GetPropertyCount()        {return this._PS.getPropertyCount();}
function class_PS_GetChildCount()        	{return this._PS.getChildCount();}
 
 
 
//GetBusObject() Class
class_BO.prototype.Name                     = class_BO_Name;
class_BO.prototype.GetBusComp               = GetBusComp;
 
function GetBusObject(BOName)               {return new class_BO(this._application.getBusObject(BOName));}
function class_BO(oBO)                      {if(oBO != null){this._BO = oBO; } }
function class_BO_Name()                    {return this._BO.name();}


function CopyPS(PS, psIn) {
  var propName = psIn.getFirstProperty();
  while (propName != "" && propName != null) {
    PS.setProperty(propName, psIn.getProperty(propName));
    propName = psIn.getNextProperty();
  }
  PS.setType(psIn.getType());
  PS.setValue(psIn.getValue());
}

function CopyChild(PS, childPS) {
  CopyPS(PS, childPS);
  for (var i = 0; i < childPS.getChildCount(); i++)
    CopyChild(PS, childPS.getChild(i));
}

//GetService() Class
class_Svc.prototype.Name                    = class_Svc_Name;
class_Svc.prototype.InvokeMethod            = class_Svc_InvokeMethod;
class_Svc.prototype.PropertyExists          = class_Svc_PropertyExists;
class_Svc.prototype.GetProperty             = class_Svc_GetProperty;
class_Svc.prototype.SetProperty             = class_Svc_SetProperty;
 
function GetService(SvcName)                {return new class_Svc(this._application.getService(SvcName));}
function class_Svc(oSvc)                    {if(oSvc != null){this._Svc = oSvc; } }
function class_Svc_Name()                   {return this._Svc.getName() ;} //+ '';}
function class_Svc_InvokeMethod(Meth,Ps1,Ps2) {
  return this._Svc.invokeMethod(Meth,Ps1,Ps2);
}
/*function class_Svc_InvokeMethod(Meth,Ps1,Ps2) {
	//Inputs.reset();
	//Inputs = Ps1.copy();	
	var res = this._Svc.invokeMethod(Meth,Inputs,Outputs);
	//trace(Outputs.getValue());
	//CopyChild(Ps2, Outputs);
	//trace(Outputs.getValue());
	return res;
}*/
function class_Svc_PropertyExists(v)        {return this._Svc.propertyExists(v);}
function class_Svc_GetProperty(v)           {return this._Svc.getProperty(v) ;} //+ '';}
function class_Svc_SetProperty(n,v)         {return this._Svc.setProperty(n,v);}
 
 
//GetBusComp() Class
class_BC.prototype.Name                     = class_BC_Name;
class_BC.prototype.ActivateField            = class_BC_ActivateField;
class_BC.prototype.ActivateMultipleFields   = class_BC_ActivateMultipleFields ;
class_BC.prototype.Associate                = class_BC_Associate;
class_BC.prototype.ClearToQuery             = class_BC_ClearToQuery;
class_BC.prototype.CountRecords             = class_BC_CountRecords;
class_BC.prototype.DeactivateFields         = class_BC_DeactivateFields;
class_BC.prototype.DeleteRecord             = class_BC_DeleteRecord;
class_BC.prototype.ExecuteQuery             = class_BC_ExecuteQuery;
class_BC.prototype.FirstRecord              = class_BC_FirstRecord;
//class_BC.prototype.GetAssocBusComp          = class_BC_GetAssocBusComp;
class_BC.prototype.GetFieldValue            = class_BC_GetFieldValue;
class_BC.prototype.GetFormattedFieldValue   = class_BC_GetFormattedFieldValue;
class_BC.prototype.GetMVGBusComp            = GetMVGBusComp;//class_BC_GetMVGBusComp;
class_BC.prototype.GetNamedSearch           = class_BC_GetNamedSearch;
class_BC.prototype.GetPicklistBusComp       = GetPicklistBusComp;//class_BC_GetPicklistBusComp;
//class_BC.prototype.GetPicklistBusComp       = class_BC_GetPicklistBusComp;
class_BC.prototype.GetSearchExpr            = class_BC_GetSearchExpr;
class_BC.prototype.GetSearchSpec            = class_BC_GetSearchSpec;
class_BC.prototype.GetViewMode              = class_BC_GetViewMode;
class_BC.prototype.InvokeMethod             = class_BC_InvokeMethod;
class_BC.prototype.LastRecord               = class_BC_LastRecord;
class_BC.prototype.NewRecord                = class_BC_NewRecord;
class_BC.prototype.NextRecord               = class_BC_NextRecord;
class_BC.prototype.ParentBusComp            = class_BC_ParentBusComp;
class_BC.prototype.Pick                     = class_BC_Pick;
class_BC.prototype.PreviousRecord           = class_BC_PreviousRecord;
class_BC.prototype.RefineQuery              = class_BC_RefineQuery;
class_BC.prototype.SearchExpr               = class_BC_SearchExpr;
class_BC.prototype.SetFieldValue            = class_BC_SetFieldValue;
class_BC.prototype.SetFormattedFieldValue   = class_BC_SetFormattedFieldValue;
class_BC.prototype.SetSearchSpec            = class_BC_SetSearchSpec;
class_BC.prototype.SetSearchExpr            = class_BC_SetSearchExpr;
class_BC.prototype.SetSortSpec              = class_BC_SetSortSpec;
class_BC.prototype.SetViewMode              = class_BC_SetViewMode;
class_BC.prototype.UndoRecord               = class_BC_UndoRecord;
class_BC.prototype.ViewMode                 = class_BC_ViewMode;
class_BC.prototype.WriteRecord              = class_BC_WriteRecord;
 
function GetBusComp(BCName)                 {return new class_BC(this._BO.getBusComp(BCName));}
function class_BC(oBC)                      {if(oBC != null){this._BC = oBC; } }
function class_BC_Name()                    {return this._BC.name();}
function class_BC_ActivateField(v)          {return this._BC.activateField(v);}
function class_BC_ActivateMultipleFields(Ps){return this._BC.activateMultipleFields(Ps);}
function class_BC_Associate(i)              {return this._BC.associate(i);}
function class_BC_ClearToQuery()            {return this._BC.clearToQuery();}
function class_BC_CountRecords(){
  var oMVG = this._BC;
  var icount = 0;
  with (oMVG){
    executeQuery(ForwardBackward);
 
    var isRecord = firstRecord();
    if (isRecord)
    {
      while (isRecord)
      {
      icount++;
      isRecord = nextRecord();
      }
    }
    firstRecord();
  }
   
  return icount;
}
function class_BC_DeactivateFields()        {return this._BC.deactivateFields();}
function class_BC_DeleteRecord()            {return this._BC.deleteRecord();}
function class_BC_ExecuteQuery(v)           {return this._BC.executeQuery(v);}
function class_BC_FirstRecord()             {return this._BC.firstRecord();}
function class_BC_NextRecord()              {return this._BC.nextRecord();}
//function class_BC_GetAssocBusComp()         {return this._BC.getAssocBusComp();}
function class_BC_GetFieldValue(v)          {return this._BC.getFieldValue(v) + '';} //+ '';}
function class_BC_GetFormattedFieldValue(v) {return this._BC.getFormattedFieldValue(v) ;} //+ '';}
function class_BC_GetMVGBusComp(v)          {return this._BC.getMVGBusComp(v);}
function class_BC_GetNamedSearch(v)         {return this._BC.getNamedSearch(v);}
function class_BC_GetPicklistBusComp(v)     {return this._BC.getPicklistBusComp(v);}
function class_BC_GetSearchExpr()           {return this._BC.getSearchExpr() ;} //+ '';}
function class_BC_GetSearchSpec(v)           {return this._BC.getSearchSpec(v) ;} //+ '';}
function class_BC_GetViewMode()             {return this._BC.getViewMode() ;} //+ '';}
function class_BC_InvokeMethod(){
var sMethod = arguments[0];
var aInput  = [];
  for(var i=1; i<arguments.length; i++){
    aInput.push(arguments[i])
  }
  return this._BC.invokeMethod(sMethod, aInput);
}
function class_BC_LastRecord()              {return this._BC.lastRecord();}
function class_BC_NewRecord(v)              {return this._BC.newRecord(v);}
//function class_BC_NextRecord()              {return this._BC.nextRecord();}
function class_BC_ParentBusComp()           {return this._BC.parentBusComp();}
function class_BC_Pick()                    {return this._BC.pick();}
function class_BC_PreviousRecord()          {return this._BC.previousRecord();}
function class_BC_RefineQuery()             {return this._BC.refineQuery();}
function class_BC_SearchExpr(v)             {return this._BC.searchExpr(v);}
function class_BC_SetFieldValue(n,v)        {return this._BC.setFieldValue(n,v);}
function class_BC_SetFormattedFieldValue(n,v)        {return this._BC.setFormattedFieldValue(n,v);}
function class_BC_SetSearchExpr(v)          {return this._BC.setSearchExpr(v);}
function class_BC_SetSearchSpec(n,v)          {return this._BC.setSearchSpec(n,v);}
function class_BC_SetSortSpec(v)          {return this._BC.setSortSpec(v);}
function class_BC_SetViewMode(v)            {return this._BC.setViewMode(v);}
function class_BC_UndoRecord()              {return this._BC.undoRecord();}
function class_BC_ViewMode(v)               {return this._BC.viewMode(v);}
function class_BC_WriteRecord()             {return this._BC.writeRecord();}

//GetPicklistBusComp() Class
class_PickBC.prototype.Name					    = class_PickBC_Name;
class_PickBC.prototype.ActivateField            = class_PickBC_ActivateField;
class_PickBC.prototype.ClearToQuery             = class_PickBC_ClearToQuery;
class_PickBC.prototype.CountRecords             = class_PickBC_CountRecords;
class_PickBC.prototype.DeleteRecord             = class_PickBC_DeleteRecord;
class_PickBC.prototype.ExecuteQuery             = class_PickBC_ExecuteQuery;
class_PickBC.prototype.FirstRecord              = class_PickBC_FirstRecord;
class_PickBC.prototype.GetFieldValue            = class_PickBC_GetFieldValue;
class_PickBC.prototype.GetSearchExpr            = class_PickBC_GetSearchExpr;
class_PickBC.prototype.GetSearchSpec            = class_PickBC_GetSearchSpec;
class_PickBC.prototype.GetViewMode              = class_PickBC_GetViewMode;
class_PickBC.prototype.InvokeMethod             = class_PickBC_InvokeMethod;
class_PickBC.prototype.LastRecord               = class_PickBC_LastRecord;
class_PickBC.prototype.NewRecord                = class_PickBC_NewRecord;
class_PickBC.prototype.NextRecord               = class_PickBC_NextRecord;
class_PickBC.prototype.ParentBusComp            = class_PickBC_ParentBusComp;
class_PickBC.prototype.Pick                     = class_PickBC_Pick;
class_PickBC.prototype.PreviousRecord           = class_PickBC_PreviousRecord;
class_PickBC.prototype.RefineQuery              = class_PickBC_RefineQuery;
class_PickBC.prototype.SearchExpr               = class_PickBC_SearchExpr;
class_PickBC.prototype.SetFieldValue            = class_PickBC_SetFieldValue;
class_PickBC.prototype.SetFormattedFieldValue   = class_PickBC_SetFormattedFieldValue;
class_PickBC.prototype.SetSearchSpec            = class_PickBC_SetSearchSpec;
class_PickBC.prototype.SetSearchExpr            = class_PickBC_SetSearchExpr;
class_PickBC.prototype.SetSortSpec              = class_PickBC_SetSortSpec;
class_PickBC.prototype.SetViewMode              = class_PickBC_SetViewMode;
class_PickBC.prototype.UndoRecord               = class_PickBC_UndoRecord;
class_PickBC.prototype.ViewMode                 = class_PickBC_ViewMode;
class_PickBC.prototype.WriteRecord              = class_PickBC_WriteRecord;

function GetPicklistBusComp(FieldName)          {return new class_PickBC(this._BC.getPicklistBusComp(FieldName));}
function class_PickBC(oPickBC)                  {if(oPickBC != null){this._PickBC = oPickBC; } }
function class_PickBC_Name()                    {return this._PickBC.name();}
function class_PickBC_ActivateField(v)          {return this._PickBC.activateField(v);}
function class_PickBC_ClearToQuery()            {return this._PickBC.clearToQuery();}
function class_PickBC_CountRecords(){
  var oMVG = this._PickBC;
  var icount = 0;
  with (oMVG){
    executeQuery(ForwardBackward);
 
    var isRecord = firstRecord();
    if (isRecord)
    {
      while (isRecord)
      {
      icount++;
      isRecord = nextRecord();
      }
    }
    firstRecord();
  }
   
  return icount;
}
function class_PickBC_DeactivateFields()        {return this._PickBC.deactivateFields();}
function class_PickBC_DeleteRecord()            {return this._PickBC.deleteRecord();}
function class_PickBC_ExecuteQuery(v)           {return this._PickBC.executeQuery(v);}
function class_PickBC_FirstRecord()             {return this._PickBC.firstRecord();}
function class_PickBC_NextRecord()              {return this._PickBC.nextRecord();}
function class_PickBC_GetFieldValue(v)          {return this._PickBC.getFieldValue(v) ;}
function class_PickBC_GetFormattedFieldValue(v) {return this._PickBC.getFormattedFieldValue(v) ;}
function class_PickBC_GetNamedSearch(v)         {return this._PickBC.getNamedSearch(v) ;}
function class_PickBC_GetSearchExpr()           {return this._PickBC.getSearchExpr() ;}
function class_PickBC_GetSearchSpec()           {return this._PickBC.getSearchSpec() ;}
function class_PickBC_GetViewMode()             { return this._PickBC.getViewMode() ;}
function class_PickBC_InvokeMethod(){
var sMethod = arguments[0];
var aInput  = [];
  for(var i=1; i<arguments.length; i++){
    aInput.push(arguments[i])
  }
  return this._MvgBC.invokeMethod(sMethod, aInput);
}
function class_PickBC_LastRecord()              {return this._PickBC.lastRecord();}
function class_PickBC_NewRecord(v)              {return this._PickBC.newRecord(v);}
function class_PickBC_NextRecord()              {return this._PickBC.nextRecord();}
function class_PickBC_ParentBusComp()           {return this._PickBC.parentBusComp();}
function class_PickBC_Pick()                    {return this._PickBC.pick();}
function class_PickBC_PreviousRecord()          {return this._PickBC.previousRecord();}
function class_PickBC_RefineQuery()             {return this._PickBC.refineQuery();}
function class_PickBC_SearchExpr(v)             {return this._PickBC.searchExpr(v);}
function class_PickBC_SetFieldValue(n,v)        {return this._PickBC.setFieldValue(n,v);}
function class_PickBC_SetFormattedFieldValue(n,v)        {return this._PickBC.setFormattedFieldValue(n,v);}
function class_PickBC_SetSearchExpr(v)          {return this._PickBC.setSearchExpr(v);}
function class_PickBC_SetSearchSpec(n,v)        {return this._PickBC.setSearchSpec(n,v);}
function class_PickBC_SetSortSpec(v)            {return this._PickBC.setSortExpr(v);}
function class_PickBC_SetViewMode(v)            {return this._PickBC.setViewMode(v);}
function class_PickBC_UndoRecord()              {return this._PickBC.undoRecord();}
function class_PickBC_ViewMode(v)               {return this._PickBC.viewMode(v);}
function class_PickBC_WriteRecord()             {return this._PickBC.writeRecord();}


//GetMVGBusComp() Class
class_MvgBC.prototype.Name                     = class_MvgBC_Name;
class_MvgBC.prototype.ActivateField            = class_MvgBC_ActivateField;
class_MvgBC.prototype.ActivateMultipleFields   = class_MvgBC_ActivateMultipleFields ;
class_MvgBC.prototype.Associate                = class_MvgBC_Associate;
class_MvgBC.prototype.ClearToQuery             = class_MvgBC_ClearToQuery;
class_MvgBC.prototype.CountRecords             = class_MvgBC_CountRecords;
class_MvgBC.prototype.DeactivateFields         = class_MvgBC_DeactivateFields;
class_MvgBC.prototype.DeleteRecord             = class_MvgBC_DeleteRecord;
class_MvgBC.prototype.ExecuteQuery             = class_MvgBC_ExecuteQuery;
class_MvgBC.prototype.FirstRecord              = class_MvgBC_FirstRecord;
//class_MvgBC.prototype.GetAssocBusComp          = class_MvgBC_GetAssocBusComp;
class_MvgBC.prototype.GetFieldValue            = class_MvgBC_GetFieldValue;
class_MvgBC.prototype.GetFormattedFieldValue   = class_MvgBC_GetFormattedFieldValue;
class_MvgBC.prototype.GetMVGBusComp            = class_MvgBC_GetMVGBusComp;
class_MvgBC.prototype.GetAssocBusComp          = GetAssocBusComp;
class_MvgBC.prototype.GetNamedSearch           = class_MvgBC_GetNamedSearch;
class_MvgBC.prototype.GetPicklistBusComp       = class_MvgBC_GetPicklistBusComp;
class_MvgBC.prototype.GetSearchExpr            = class_MvgBC_GetSearchExpr;
class_MvgBC.prototype.GetSearchSpec            = class_MvgBC_GetSearchSpec;
class_MvgBC.prototype.GetViewMode              = class_MvgBC_GetViewMode;
class_MvgBC.prototype.InvokeMethod             = class_MvgBC_InvokeMethod;
class_MvgBC.prototype.LastRecord               = class_MvgBC_LastRecord;
class_MvgBC.prototype.NewRecord                = class_MvgBC_NewRecord;
class_MvgBC.prototype.NextRecord               = class_MvgBC_NextRecord;
class_MvgBC.prototype.ParentBusComp            = class_MvgBC_ParentBusComp;
class_MvgBC.prototype.Pick                     = class_MvgBC_Pick;
class_MvgBC.prototype.PreviousRecord           = class_MvgBC_PreviousRecord;
class_MvgBC.prototype.RefineQuery              = class_MvgBC_RefineQuery;
class_MvgBC.prototype.SearchExpr               = class_MvgBC_SearchExpr;
class_MvgBC.prototype.SetFieldValue            = class_MvgBC_SetFieldValue;
class_MvgBC.prototype.SetFormattedFieldValue   = class_MvgBC_SetFormattedFieldValue;
class_MvgBC.prototype.SetSearchSpec            = class_MvgBC_SetSearchSpec;
class_MvgBC.prototype.SetSearchExpr            = class_MvgBC_SetSearchExpr;
class_MvgBC.prototype.SetSortSpec              = class_MvgBC_SetSortSpec;
class_MvgBC.prototype.SetViewMode              = class_MvgBC_SetViewMode;
class_MvgBC.prototype.UndoRecord               = class_MvgBC_UndoRecord;
class_MvgBC.prototype.ViewMode                 = class_MvgBC_ViewMode;
class_MvgBC.prototype.WriteRecord              = class_MvgBC_WriteRecord;
 
function GetMVGBusComp(FieldName)              {return new class_MvgBC(this._BC.getMVGBusComp(FieldName));}
function class_MvgBC(oMvgBC)                   {if(oMvgBC != null){this._MvgBC = oMvgBC; } }
function class_MvgBC_Name()                    {return this._MvgBC.name();}
function class_MvgBC_ActivateField(v)          {return this._MvgBC.activateField(v);}
function class_MvgBC_ActivateMultipleFields(Ps){return this._MvgBC.activateMultipleFields(Ps);}
function class_MvgBC_Associate(i)              {return this._MvgBC.associate(i);}
function class_MvgBC_ClearToQuery()            {return this._MvgBC.clearToQuery();}
//function class_MvgBC_CountRecords()            {return this._MvgBC.countRecords();}
function class_MvgBC_CountRecords(){
  var oMVG = this._MvgBC;
  var icount = 0;
  with (oMVG){
    executeQuery(ForwardBackward);
 
    var isRecord = firstRecord();
    if (isRecord)
    {
      while (isRecord)
      {
      icount++;
      isRecord = nextRecord();
      }
    }
    firstRecord();
  }
   
  return icount;
}
function class_MvgBC_DeactivateFields()        {return this._MvgBC.deactivateFields();}
function class_MvgBC_DeleteRecord()            {return this._MvgBC.deleteRecord();}
function class_MvgBC_ExecuteQuery(v)           {return this._MvgBC.executeQuery(v);}
function class_MvgBC_FirstRecord()             {return this._MvgBC.firstRecord();}
function class_MvgBC_NextRecord()              {return this._MvgBC.nextRecord();}
//function class_MvgBC_GetAssocBusComp()         {return this._MvgBC.getAssocBusComp();}
function class_MvgBC_GetFieldValue(v)          {return this._MvgBC.getFieldValue(v) ;} //+ '';}
function class_MvgBC_GetFormattedFieldValue(v) {return this._MvgBC.getFormattedFieldValue(v) ;} //+ '';}
function class_MvgBC_GetMVGBusComp(v)          {return this._MvgBC.getMVGBusComp(v);}
function class_MvgBC_GetNamedSearch(v)         {return this._MvgBC.getNamedSearch(v) ;} //+ '';}
function class_MvgBC_GetPicklistBusComp(v)     {return this._MvgBC.getPicklistBusComp(v);}
function class_MvgBC_GetSearchExpr()           {return this._MvgBC.getSearchExpr() ;} //+ '';}
function class_MvgBC_GetSearchSpec()           {return this._MvgBC.getSearchSpec() ;} //+ '';}
function class_MvgBC_GetViewMode()             {return this._MvgBC.getViewMode() ;} //+ '';}
function class_MvgBC_InvokeMethod(){
var sMethod = arguments[0];
var aInput  = [];
  for(var i=1; i<arguments.length; i++){
    aInput.push(arguments[i])
  }
  return this._MvgBC.invokeMethod(sMethod, aInput);
}
function class_MvgBC_LastRecord()              {return this._MvgBC.lastRecord();}
function class_MvgBC_NewRecord(v)              {return this._MvgBC.newRecord(v);}
function class_MvgBC_NextRecord()              {return this._MvgBC.nextRecord();}
function class_MvgBC_ParentBusComp()           {return this._MvgBC.parentBusComp();}
function class_MvgBC_Pick()                    {return this._MvgBC.pick();}
function class_MvgBC_PreviousRecord()          {return this._MvgBC.previousRecord();}
function class_MvgBC_RefineQuery()             {return this._MvgBC.refineQuery();}
function class_MvgBC_SearchExpr(v)             {return this._MvgBC.searchExpr(v);}
function class_MvgBC_SetFieldValue(n,v)        {return this._MvgBC.setFieldValue(n,v);}
function class_MvgBC_SetFormattedFieldValue(n,v)        {return this._MvgBC.setFormattedFieldValue(n,v);}
function class_MvgBC_SetSearchExpr(v)          {return this._MvgBC.setSearchExpr(v);}
function class_MvgBC_SetSearchSpec(n,v)        {return this._MvgBC.setSearchSpec(n,v);}
function class_MvgBC_SetSortSpec(v)            {return this._MvgBC.setSortExpr(v);}
function class_MvgBC_SetViewMode(v)            {return this._MvgBC.setViewMode(v);}
function class_MvgBC_UndoRecord()              {return this._MvgBC.undoRecord();}
function class_MvgBC_ViewMode(v)               {return this._MvgBC.viewMode(v);}
function class_MvgBC_WriteRecord()             {return this._MvgBC.writeRecord();}
 
//GetAssocBusComp() Class
class_AssBC.prototype.Name                     = class_AssBC_Name;
class_AssBC.prototype.ActivateField            = class_AssBC_ActivateField;
class_AssBC.prototype.ActivateMultipleFields   = class_AssBC_ActivateMultipleFields ;
class_AssBC.prototype.Associate                = class_AssBC_Associate;
class_AssBC.prototype.ClearToQuery             = class_AssBC_ClearToQuery;
class_AssBC.prototype.CountRecords             = class_AssBC_CountRecords;
class_AssBC.prototype.DeactivateFields         = class_AssBC_DeactivateFields;
class_AssBC.prototype.DeleteRecord            = class_AssBC_DeleteRecord;
class_AssBC.prototype.ExecuteQuery             = class_AssBC_ExecuteQuery;
class_AssBC.prototype.FirstRecord              = class_AssBC_FirstRecord;
//class_AssBC.prototype.GetAssocBusComp          = class_AssBC_GetAssocBusComp;
class_AssBC.prototype.GetFieldValue            = class_AssBC_GetFieldValue;
class_AssBC.prototype.GetFormattedFieldValue   = class_AssBC_GetFormattedFieldValue;
//class_AssBC.prototype.GetAssocBusComp          = class_AssBC_GetAssocBusComp;
class_AssBC.prototype.GetNamedSearch           = class_AssBC_GetNamedSearch;
class_AssBC.prototype.GetPicklistBusComp       = class_AssBC_GetPicklistBusComp;
class_AssBC.prototype.GetSearchExpr            = class_AssBC_GetSearchExpr;
class_AssBC.prototype.GetSearchSpec            = class_AssBC_GetSearchSpec;
class_AssBC.prototype.GetViewMode              = class_AssBC_GetViewMode;
class_AssBC.prototype.InvokeMethod             = class_AssBC_InvokeMethod;
class_AssBC.prototype.LastRecord               = class_AssBC_LastRecord;
class_AssBC.prototype.NewRecord                = class_AssBC_NewRecord;
class_AssBC.prototype.NextRecord               = class_AssBC_NextRecord;
class_AssBC.prototype.ParentBusComp            = class_AssBC_ParentBusComp;
class_AssBC.prototype.Pick                     = class_AssBC_Pick;
class_AssBC.prototype.PreviousRecord           = class_AssBC_PreviousRecord;
class_AssBC.prototype.RefineQuery              = class_AssBC_RefineQuery;
class_AssBC.prototype.SearchExpr               = class_AssBC_SearchExpr;
class_AssBC.prototype.SetFieldValue            = class_AssBC_SetFieldValue;
class_AssBC.prototype.SetFormattedFieldValue   = class_AssBC_SetFormattedFieldValue;
class_AssBC.prototype.SetSearchSpec            = class_AssBC_SetSearchSpec;
class_AssBC.prototype.SetSearchExpr            = class_AssBC_SetSearchExpr;
class_AssBC.prototype.SetSortSpec              = class_AssBC_SetSortSpec;
class_AssBC.prototype.SetViewMode              = class_AssBC_SetViewMode;
class_AssBC.prototype.UndoRecord               = class_AssBC_UndoRecord;
class_AssBC.prototype.ViewMode                 = class_AssBC_ViewMode;
class_AssBC.prototype.WriteRecord              = class_AssBC_WriteRecord;
 
function GetAssocBusComp()                {return new class_AssBC(this._MvgBC.getAssocBusComp());}
function class_AssBC(oAssBC)                   {if(oAssBC != null){this._AssBC = oAssBC; } }
function class_AssBC_Name()                    {return this._AssBC.name();}
function class_AssBC_ActivateField(v)          {return this._AssBC.activateField(v);}
function class_AssBC_ActivateMultipleFields(Ps){return this._AssBC.activateMultipleFields(Ps);}
function class_AssBC_Associate(i)              {return this._AssBC.associate(i);}
function class_AssBC_ClearToQuery()            {return this._AssBC.clearToQuery();}
function class_AssBC_CountRecords(){
  var oMVG = this._AssBC;
  var icount = 0;
  with (oMVG){
    executeQuery(ForwardBackward);
 
    var isRecord = firstRecord();
    if (isRecord)
    {
      while (isRecord)
      {
      icount++;
      isRecord = nextRecord();
      }
    }
    firstRecord();
  }
   
  return icount;
}
function class_AssBC_DeactivateFields()        {return this._AssBC.deactivateFields();}
function class_AssBC_DeleteRecord()            {return this._AssBC.deleteRecord();}
function class_AssBC_ExecuteQuery(v)           {return this._AssBC.executeQuery(v);}
function class_AssBC_FirstRecord()             {return this._AssBC.firstRecord();}
function class_AssBC_NextRecord()              {return this._AssBC.nextRecord();}
function class_AssBC_GetAssocBusComp()         {return this._AssBC.getAssocBusComp();}
function class_AssBC_GetFieldValue(v)          {return this._AssBC.getFieldValue(v) ;} //+ '';}
function class_AssBC_GetFormattedFieldValue(v) {return this._AssBC.getFormattedFieldValue(v) ;} //+ '';}
//function class_AssBC_GetAssocBusComp(v)          {return this._AssBC.GetAssocBusComp(v);}
function class_AssBC_GetNamedSearch(v)         {return this._AssBC.getNamedSearch(v) ;} //+ '';}
function class_AssBC_GetPicklistBusComp(v)     {return this._AssBC.getPicklistBusComp(v);}
function class_AssBC_GetSearchExpr()           {return this._AssBC.getSearchExpr() ;} //+ '';}
function class_AssBC_GetSearchSpec()           {return this._AssBC.getSearchSpec() ;} //+ '';}
function class_AssBC_GetViewMode()             {return this._AssBC.getViewMode() ;} //+ '';}
function class_AssBC_InvokeMethod(){
var sMethod = arguments[0];
var aInput  = [];
  for(var i=1; i<arguments.length; i++){
    aInput.push(arguments[i])
  }
  return this._AssBC.invokeMethod(sMethod, aInput);
}
function class_AssBC_LastRecord()              {return this._AssBC.lastRecord();}
function class_AssBC_NewRecord(v)              {return this._AssBC.newRecord(v);}
function class_AssBC_NextRecord()              {return this._AssBC.nextRecord();}
function class_AssBC_ParentBusComp()           {return this._AssBC.parentBusComp();}
function class_AssBC_Pick()                    {return this._AssBC.pick();}
function class_AssBC_PreviousRecord()          {return this._AssBC.previousRecord();}
function class_AssBC_RefineQuery()             {return this._AssBC.refineQuery();}
function class_AssBC_SearchExpr(v)             {return this._AssBC.searchExpr(v);}
function class_AssBC_SetFieldValue(n,v)        {return this._AssBC.setFieldValue(n,v);}
function class_AssBC_SetFormattedFieldValue(n,v)        {return this._AssBC.setFormattedFieldValue(n,v);}
function class_AssBC_SetSearchExpr(v)          {return this._AssBC.setSearchExpr(v);}
function class_AssBC_SetSearchSpec(n,v)        {return this._AssBC.setSearchSpec(n,v);}
function class_AssBC_SetSortSpec(v)            {return this._AssBC.setSortSpec(v);}
function class_AssBC_SetViewMode(v)            {return this._AssBC.setViewMode(v);}
function class_AssBC_UndoRecord()              {return this._AssBC.undoRecord();}
function class_AssBC_ViewMode(v)               {return this._AssBC.viewMode(v);}
function class_AssBC_WriteRecord()             {return this._AssBC.writeRecord();}
 
function trace(v){
    oSysOut.println(v);
}

function ToNumber(v) {
	return v * 1;
}

////////////// CLIB Object functions ////////////////
importPackage(java.io);
var Clib = {
	cursorPos: 0
}
Clib.fopen = function(filePath, fileAccess) {
	return new RandomAccessFile(filePath, fileAccess);
}

Clib.fprint = function(fileObj) {
	var str = "";
	//fileObj.seek(20);
	while ((str = fileObj.readLine()) != null) {
		trace(str);
	}
}

Clib.fgets = function(lengthChars, fileObj) {
	fileObj.seek(this.cursorPos);
	var str = "";
	var buffer = new Array();
	var item = 0;
	while ((str = fileObj.readLine()) != null) {
		var ff = str.toCharArray();
		buffer[item] = ff;
		item++;
		ff = null;
	}

	var res = "";
	var resCount = 0;
	for (var i = 0; i < buffer.length; i++) {
		if (resCount > lengthChars) {
			break;
		}
		var tmp = "";
		for (var j = 0; j < buffer[i].length; j++) {
			if (resCount < lengthChars) {
				tmp += String.fromCharCode(buffer[i][j]);				
			}
			resCount++;			
		}
	}
	buffer = null;
	this.cursorPos = this.cursorPos + lengthChars;
	return tmp;
}

Clib.fclose = function(fileObj) {
	fileObj.close();
}

Clib.time = function() {
	var dt = new Date();
	return "" + dt.getTime();
}

Clib.localtime = function(mls) {
	var dt = new Date();
	dt.setTime(mls);
	return dt;
}

Clib.strftime = function(strdt, fmt, lc) {
	valref = lc.format(fmt);
}//end

// DATE PROTOTYPES FORMAT
Date.prototype.getMonthName = function(){ return (["January","February","March","April","May","June","July","August","September","October","November","December"])[this.getMonth()]; }
Date.prototype.getUTCMonthName = function(){ return (["January","February","March","April","May","June","July","August","September","October","November","December"])[this.getUTCMonth()]; }
Date.prototype.getDayName = function(){ return (["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"])[this.getDay()]; }
Date.prototype.getUTCDayName = function(){ return (["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"])[this.getUTCDay()]; }

//if useUTC is true, UTC values will be used instead of local time values
Date.prototype.format = function(formatStr, useUTC)
{
	/*
	Format string variables:
	
	%Y  4-digit year (e.g., 2011)
	%y  2-digit year (e.g., 11)
	%M  2-digit month (01-12)
	%m  month (1-12)
	%B  full month name (January-December)
	%b  abbreviated month name (Jan-Dec)
	%D  2-digit day of month (01-31)
	%d  day of month (1-31)
	%o  ordinal of the day of month (st, nd, rd, th)
	%W  full weekday name (Sunday-Saturday)
	%w  abbreviated weekday name (Sun-Sat)
	%I  hour in 24-hour format (00-23)
	%H  2-digit hour in 12-hour format (01-12)
	%h  hour in 12-hour format (1-12)
	%P  AM/PM
	%p  am/pm
	%q  a/p
	%N  2-digit minute (00-59)
	%n  minute (0-59)
	%S  2-digit second (00-59)
	%s  second (0-59)
	%Z  3-digit milliseconds (000-999)
	%z  milliseconds (0-999)
	%e  UTC offset +/-
	%F  2-digit hour offset (00-23)
	%f  hour offset (0-23)
	%G  2-digit minute offset (00-59)
	%g  minute offset (0-59)
	
	%%  percent sign
	*/
	
	function pad(numStr, digits)
	{
		numStr = numStr.toString();
		while(numStr.length < digits) numStr = "0"+numStr;
		return numStr;
	}
	
	var theYear = useUTC ? this.getUTCFullYear() : this.getFullYear();
	var theMonth = useUTC ? this.getUTCMonth() : this.getMonth();
	var theMonthName = useUTC ? this.getUTCMonthName() : this.getMonthName();
	var theDate = useUTC ? this.getUTCDate() : this.getDate();
	var theDayName = useUTC ? this.getUTCDayName() : this.getDayName();
	var theHour = useUTC ? this.getUTCHours() : this.getHours();
	var theMinute = useUTC ? this.getUTCMinutes() : this.getMinutes();
	var theSecond = useUTC ? this.getUTCSeconds() : this.getSeconds();
	var theMS = useUTC ? this.getUTCMilliseconds() : this.getMilliseconds();
	var theOffset = useUTC ? 0 : -this.getTimezoneOffset();	//offset in minutes
	
	var v = /%(.)/, m, formatted = "", d, h;
	while((m = v.exec(formatStr)) != null)
	{
		formatted += formatStr.slice(0, m.index);
		switch(m[1])
		{
			case "Y": formatted += theYear; break;
			case "y": formatted += theYear.toString().slice(-2); break;
			case "M": formatted += pad(theMonth+1, 2); break;
			//case "m": formatted += theMonth+1; break;
			case "m": formatted += pad(theMonth+1, 2); break;
			case "B": formatted += theMonthName; break;
			case "b": formatted += theMonthName.slice(0,3); break;
			case "D": formatted += pad(theDate, 2); break;
			case "d": formatted += theDate; break;
			case "o":
				d = theDate;
				formatted += (d==1 || d==21 || d==31) ? "st" : (d==2 || d==22) ? "nd" : (d==3 || d==23) ? "rd" : "th";
				break;
			case "W": formatted += theDayName; break;
			case "w": formatted += theDayName.slice(0,3); break;
			case "I": formatted += pad(theHour, 2); break;
			case "H":
				h = theHour % 12;
				if(h==0) h = 12;
				formatted += pad(h, 2);
				break;
			case "h":
				h = theHour % 12;
				if(h==0) h = 12;
				formatted += h;
				break;
			case "P": formatted += (theHour<12 ? "AM" : "PM"); break;
			case "p": formatted += (theHour<12 ? "am" : "pm"); break;
			case "q": formatted += (theHour<12 ? "a" : "p"); break;
			case "N": formatted += pad(theMinute, 2); break;
			case "n": formatted += theMinute; break;
			case "S": formatted += pad(theSecond, 2); break;
			case "s": formatted += theSecond; break;
			case "Z": formatted += pad(theMS, 3); break;
			case "z": formatted += theMS; break;
			case "e": formatted += theOffset < 0 ? "-" : "+"; break;	//if offset==0, it will be "+"
			case "F": formatted += pad(Math.floor(Math.abs(theOffset)/60), 2); break;
			case "f": formatted += Math.floor(Math.abs(theOffset)/60); break;
			case "G": formatted += pad(theOffset%60, 2); break;
			case "g": formatted += theOffset%60; break;
			case "%": formatted += "%"; break;
			default: formatted += m[0];
		}
		formatStr = formatStr.slice(m.index+2);
	}
	formatted += formatStr;
	
	return formatted;
}