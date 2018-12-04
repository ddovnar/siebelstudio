
public class SiebelPropertySet {
	/**
	 * This method returns a Boolean value indicating whether a specified property exists in a property set.
	 * @param propName A string representing the name of the property to be found
	 * @return
	 */
public boolean PropertyExists(String propName) {return false;}
/**
 * This method returns the value of a property when given the property name.
 * @param propName A string representing the name of a property as returned by GetFirstProperty or 
 * GetNextProperty
 * @return A string representing the value stored in the property indicated by propName, or an empty string 
 * ("") if the property does not exist
 */
public String GetProperty(String propName) {return "";}
/**
 * This method assigns a data value to a property in a property set.
 * @param propName A string representing the name of a property 
 * @param propValue A string representing the value to be assigned to propName
 */
public void SetProperty(String propName, String propValue) {}
/**
 * This method retrieves the data value stored in the value attribute of a property set.
 * @return A string representing the data value stored in the value attribute of a property set
 */
public String GetValue() {return "";}
/**
 * This method assigns a data value to the value attribute of a property set.
 * @param value A string representing data to be stored in the value attribute
 */
public void SetValue(String value) {}
/**
 * This method retrieves the data value stored in the type attribute of a property set.
 * @return A string representing the value stored in the type attribute of the property set
 */
public String GetType() {return "";}
/**
 * This method assigns a data value to the type attribute of a property set.
 * @param type A string representing data to be stored in the type attribute
 */
public void SetType(String type) {}
/**
 * This method returns a copy of a property set.
 * @return A copy of the property set indicated by oPropSet
 */
public SiebelPropertySet Copy() {return null;}
/**
 * This method removes all properties and children from a property set.
 */
public void Reset() {}
/**
 * This method returns a specified child property set of a property set.
 * @param index An integer representing the index number of the child property set to be retrieved
 * @return The property set at index index of the parent property set
 */
public SiebelPropertySet GetChild(int index) {return null;}
/**
 * The AddChild method is used to add subsidiary property sets to a property set, so as to form 
 * hierarchical (tree-structured) data structures.
 * @param childPropSet A property set to be made subsidiary to the property set indicated by oPropSet
 * @return An integer indicating the index of the child property set.
 */
public int AddChild(SiebelPropertySet childPropSet) {return 0;}
/**
 * This method removes a child property set from a parent property set.
 * @param index An integer representing the index number of the child property set to be removed
 */
public void RemoveChild(int index) {}
/**
 * This method removes a property from a property set.
 * @param propName The name of the property to be removed
 */
public void RemoveProperty(String propName) {}
/**
 * This method inserts a child property set into a parent property set at a specific location.
 * @param propSet A property set to be made subsidiary to the property set indicated by oPropSet
 * @param index An integer representing the position at which childObject is to be inserted
 */
public void InsertChildAt(SiebelPropertySet propSet, int index) {}
/**
 * This method returns the name of the first property in a property set.
 * @return A string representing the name of the first property in a property set
 */
public SiebelPropertySet GetFirstProperty() {return null;}
/**
 * This method returns the next property in a property set.
 * @return A string representing the name of the next property in a property set
 */
public SiebelPropertySet GetNextProperty() {return null;}
/**
 * This method returns the number of properties attached to a property set.
 * @return The number of properties stored at the current level in the hierarchy, but not all properties 
 * throughout the entire property set hierarchy
 */
public int GetPropertyCount() {return 0;}
/**
 * This method returns the number of child property sets attached to a parent property set.
 * @return The number of child property sets subordinate to oPropSet
 */
public int GetChildCount() {return 0;}

}
