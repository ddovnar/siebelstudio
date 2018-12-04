import java.util.Properties;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.PrintStream;

import java.io.File;
//import java.io.IOException;
import java.lang.reflect.Constructor;
import java.lang.reflect.InvocationTargetException;
import java.lang.reflect.Method;
import java.net.URL;
import java.net.URLClassLoader;

public class Test {
	public static void main(String[] paramArrayOfString) throws IOException {
		AppUtil.loadSettings();
		System.out.println(AppUtil.getProperty("GatewayAddress"));
		System.out.println(AppUtil.getProperty("EnterpriseServer"));
    AppUtil.setProperty("WORKSPACE", "D:\\workspace");
    AppUtil.setProperty("SIEBEL_CFG", "D:\\workspace\\uagent.cfg");
    AppUtil.setProperty("LOGIN", "USER_NAME");
    AppUtil.saveSettings();
    String str = "SIEBELTEST4:2321";
    String str1 = str.substring(0, str.indexOf(":"));
    if (str.indexOf(":") > 0)
            str = str.substring(0, str.indexOf(":"));
    System.out.println(str);
    System.out.println(str1);
	}
}

class AppUtil
{
  private static Properties prop = new Properties();
  private static boolean isLoaded = false;

  public static void saveSettings() {
    try {
      prop.store(new FileOutputStream("config.properties"), null);
    } catch (IOException localIOException) {
    }
  }

  public static void loadSettings() {
    try {
      prop.load(new FileInputStream("C:/Program Files/Siebel/7.8/web client/BIN/ENU/uagent_bug.cfg"));
      isLoaded = true;
    } catch (IOException localIOException) {
      isLoaded = false;
    }
  }

  public static void setProperty(String paramString1, String paramString2) {
    if (!isLoaded)
      loadSettings();
    prop.setProperty(paramString1, paramString2);
  }

  public static String getProperty(String paramString) {
    if (!isLoaded)
      loadSettings();
    return prop.getProperty(paramString);
  }

  public static String getFileName(String paramString) {
    if (paramString.isEmpty()) {
      return paramString;
    }
    int i = paramString.length() - 1;
    while ((paramString.charAt(i) != '.') && (i > 0)) {
      i--;
    }

    if (i == 0) {
      i = paramString.length();
    }
    return paramString.substring(0, i);
  }

 /* public static void main(String[] paramArrayOfString)
  {
    getFileName("testfile.txt");
    System.out.println(getFileName("testfile.txt"));
  }*/
}



/**
 * Useful class for dynamically changing the classpath, adding classes during runtime. 
 * @author unknown
 */
class ClasspathHacker {
    /**
     * Parameters of the method to add an URL to the System classes. 
     */
    private static final Class<?>[] parameters = new Class[]{URL.class};

    /**
     * Adds a file to the classpath.
     * @param s a String pointing to the file
     * @throws IOException
     */
    public static void addFile(String s) throws IOException {
        File f = new File(s);
        addFile(f);
    }//end method

    /**
     * Adds a file to the classpath
     * @param f the file to be added
     * @throws IOException
     */
    public static void addFile(File f) throws IOException {
        addURL(f.toURI().toURL());
    }//end method

    /**
     * Adds the content pointed by the URL to the classpath.
     * @param u the URL pointing to the content to be added
     * @throws IOException
     */
    public static void addURL(URL u) throws IOException {
        URLClassLoader sysloader = (URLClassLoader)ClassLoader.getSystemClassLoader();
        Class<?> sysclass = URLClassLoader.class;
        try {
            Method method = sysclass.getDeclaredMethod("addURL",parameters);
            method.setAccessible(true);
            method.invoke(sysloader,new Object[]{ u }); 
        } catch (Throwable t) {
            t.printStackTrace();
            throw new IOException("Error, could not add URL to system classloader");
        }//end try catch        
    }//end method

/*    public static void main(String args[]) throws IOException, SecurityException, ClassNotFoundException, IllegalArgumentException, InstantiationException, IllegalAccessException, InvocationTargetException, NoSuchMethodException{
        addFile("C:\\dynamicloading.jar");
        Constructor<?> cs = ClassLoader.getSystemClassLoader().loadClass("test.DymamicLoadingTest").getConstructor(String.class);
        DymamicLoadingTest instance = (DymamicLoadingTest)cs.newInstance();
        instance.test();

    }*/
}