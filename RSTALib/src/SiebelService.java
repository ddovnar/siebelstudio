
public class SiebelService {
	/**
	 * The Name property contains the name of the service.
	 * @return A string containing the service name
	 */
public String Name() {return "";}
/**
 * The InvokeMethod method calls a method on the business service. This can be a documented 
 * specialized method or a user-created method.
 * @param methodName method name
 * @param input args in property set
 * @param output args in property set
 */
public void InvokeMethod(String methodName, SiebelPropertySet input, SiebelPropertySet output) {}
/**
 * This method returns a Boolean value indicating whether a specified property exists.
 * @param propertyName A string representing the name of a property of the specified service
 * @return
 */
public boolean PropertyExists(String propertyName) {return false;}
/**
 * The GetProperty method returns the value of the property whose name is specified in its argument.
 * @param propName The name of the property whose value is to be returned
 * @return A string containing the value of the property indicated by propName or NULL if the property does not 
 * exist.
 */
public String GetProperty(String propName) {return "";}
/**
 * This method assigns a value to a property of a business service.
 * @param propName A string indicating the name of the property whose value is to be set
 * @param propValue A string containing the value to assign to the property indicated by propName
 */
public void SetProperty(String propName, String propValue) {}

}
