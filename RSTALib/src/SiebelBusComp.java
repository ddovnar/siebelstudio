public class SiebelBusComp {
	/**
	* The Name property contains the name of the business component.
	* @return A string containing the business component name
	*/
public String Name() {return "";}
/**
 * ActivateField allows queries to retrieve data for the argument-specified field.
 * @param fieldName String variable or literal containing the name of the field to activate
 */
public void ActivateField(String fieldName){}
/**
 * Use ActivateMultipleFields to activate data for the fields specified in the property set.
 * @param fields Property set containing a collection of properties representing the fields that are to be activated.
 * @return TRUE if success; FALSE if failure
 */
public void ActivateMultipleFields(SiebelPropertySet fields) {}
/**
 * The Associate method creates a new many-to-many relationship for the parent object through an association business component.
 * @param This argument should be one of the following predefined constants: NewBefore or NewAfter, as in NewRecord.
 */
public void Associate(int whereIndicator) {}
/**
 * The ClearToQuery method clears the current query but does not clear sort specifications on the BusComp.
 */
public void ClearToQuery() {}
/**
 * CountRecords uses database aggregation to count the records returned by the last ExecuteQuery() call.
 * @return An integer indicating the number of records returned by the last ExecuteQuery() call
 */
public int CountRecords() {return 0;}
/**
 * DeactivateFields deactivates the fields that are currently active from a business component SQL query statement, except those that are not ForceActive, required for a link, or required by the BusComp class.
 */
public void DeactivateFields() {}
/**
 * DeleteRecord removes the current record from the business component.
 */
public void DeleteRecord() {}
/**
 * ExecuteQuery returns a set of business component records using the criteria established with methods such as SetSearchSpec.
 * @param cursorMode An integer. An optional argument that must be one of the following constants (provided in Siebel VB as well as COM Servers):
* <ul><li>ForwardBackward. Selected records can be processed from first to last or 
* from last to first. This is the default if no value is specified.</li>
* <li>ForwardOnly. Selected records can be processed only from the first record 
* to the last record. Focus cannot return to a record.</li></ul>
 */
public void ExecuteQuery(int cursorMode) {}
/**
 * FirstRecord moves the record pointer to the first record in a business component, making that record 
 * current and invoking any associated script events.
 * @return  if there was a first record (the query returned results) true/false
 */
public boolean FirstRecord() {return false;}
/**
 * GetFieldValue returns the value for the field specified in its argument for the current record of the 
 * business component. Use this method to access a field value.
 * @param fieldName String variable or literal containing the name of the field
 * @return A string containing the field value of the field identified in FieldName, an error message if the field 
 * is inactive, or an empty string if the field is empty.
 */
public String GetFieldValue(String fieldName) {return "";}
/**
 * GetFormattedFieldValue returns the field value in the current local format; it returns values in the 
 * same format as the Siebel UI.
 * @param fieldName String variable or literal containing the name of the field to obtain the value 
 * from
 * @return A string containing the value of the requested field, in the same format as displayed in the user 
 * interface, or an empty string ("") if the field is inactive or empty.
 */
public String GetFormattedFieldValue(String fieldName) {return "";}
/**
 * The GetMVGBusComp method returns the MVG business component associated with the business 
 * component field specified by FieldName. This business component can be used to operate on the 
 * multi-value group using the normal business component mechanisms.
 * @param fieldName Name of the field with a multi-value group attached, used to obtain the mult-value group business component
 * @return The multi-value group business component of the current business component and identified field
 */
public SiebelBusComp GetMVGBusComp(String fieldName) {return null;}
/**
 * GetNamedSearch returns the named search specification specified by searchName.
 * @param searchName Name of the search specification that references the search string.
 * @return A string containing the value specified in the search specification identified in searchName
 */
public String GetNamedSearch(String searchName) {return "";}
/**
 * GetPicklistBusComp returns the pick business component associated with the specified field in the 
 * current business component.
 * @param fieldName Name of the field with a picklist specified; used to obtain the pick business 
 * component
 * @return The pick business component of the current business component and identified field. If there is no 
 * picklist associated with that field, the function returns an error.
 */
public SiebelBusComp GetPicklistBusComp(String fieldName) {return null;}
/**
 * GetSearchExpr returns the current search expression for the business component.
 * @return A string containing the current search expression.
 */
public String GetSearchExpr() {return "";}
/**
 * GetSearchSpec returns the search specification for the field specified by the FieldName argument.
 * @param fieldName Contains the name of the field from which to obtain the associated search 
 * specification.
 * @return A string containing the search specification for the field identified in FieldName.
 */
public String GetSearchSpec(String fieldName) {return "";}
/**
 * GetViewMode returns the current visibility mode for the business component. This effects which 
 * records are returned by queries according to the visibility rules.
 * @return An integer constant that identifies a visibility mode
 */
public int GetViewMode() {return 0;}
/**
 * InvokeMethod calls the specialized method or user-created method named in the argument.
 * @param methodName The name of the method.
 * @param args A single string or a string array (object interfaces) containing arguments to 
 * methodName.
 */
public void InvokeMethod(String methodName, String args) {}
/**
 * LastRecord moves the record pointer to the last record in the business component.
 * @return
 */
public boolean LastRecord() {return false;}
/**
 * NewRecord adds a new record (row) to the business component.
 * @param whereIndicator Predefined constant indicating where the new row is added. This value should 
 * be one of the following:
 * <ul>
 * <li>NewBefore</li>
 * <li>NewAfter</li>
 * </ul>
 */
public void NewRecord(int whereIndicator) {}
/**
 * NextRecord moves the record pointer to the next record in the business component, making that the 
 * current record and invoking any associated script events.
 * @return
 */
public boolean NextRecord() {return false;}
/**
 * ParentBusComp returns the parent (master) business component when given the child (detail) 
 * business component of a Link.
 * @return The parent business component of the Link
 */
public SiebelBusComp ParentBusComp() {return null;}
/**
 * The Pick method places the currently selected record in a picklist business component into the 
 * appropriate fields of the parent business component.
 */
public void Pick() {}
/**
 * PreviousRecord moves the record pointer to the next record in the business component, making that 
 * the current record and invoking any associated script events.
 * @return
 */
public boolean PreviousRecord() {return false;}
/**
 * This method refines a query after the query has been executed.
 */
public void RefineQuery() {}
/**
 * SetFieldValue assigns the new value to the named field for the current row of the business 
 * component.
 * @param fieldName String containing the name of the field to assign the value to
 * @param fieldValue String containing the value to assign
 */
public void SetFieldValue(String fieldName, String fieldValue) {}
/**
 * SetFormattedFieldValue assigns the new value to the named field for the current row of the business 
 * component. SetFormattedFieldValue accepts the field value in the current local format.
 * @param fieldName String containing the name of the field to assign the value to
 * @param fieldValue String containing the value to assign
 */
public void SetFormattedFieldValue(String fieldName, String fieldValue) {}
/**
 * SetSearchSpec sets the search specification for a particular field. This method must be called before 
 * ExecuteQuery.
 * @param fieldName String containing the name of the field on which to set the search specification.
 * @param searchSpec String containing the search specification.
 */
public void SetSearchSpec(String fieldName, String searchSpec) {}
/**
 * SetSearchExpr sets an entire search expression on the business component, rather than setting one 
 * search specification for each field. Syntax is similar to that on the Predefined Queries screen.
 * @param searchexp Search specification string field
 */
public void SetSearchExpr(String searchexpr) {}
/**
 * SetSortSpec sets the sort specification for a query.
 * @param sortSpec String containing the sort specification
 */
public void SetSortSpec(String sortSpec) {}
/**
 * SetViewMode sets the visibility type for the business component. This is used prior to a query
 * @param viewmode viewmode value
 */
public void SetViewMode(int viewmode) {}
/**
 * UndoRecord reverses any uncommitted changes made to the record. This includes reversing 
 * uncommitted modifications to fields, as well as deleting an active record that has not yet been 
 * committed to the database.
 */
public void UndoRecord() {}
/**
 * Commits to the database any changes made to the current record.
 */
public void WriteRecord() {}
}