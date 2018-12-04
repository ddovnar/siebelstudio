package side;

import java.util.Properties;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.PrintStream;

import org.apache.log4j.Logger;

public class AppSettings {
	static Logger log = Logger.getLogger(AppSettings.class.getName());
	private static Properties prop = new Properties();
	private static Properties bufferedProp = new Properties();
	private static boolean propFileExists = true;
	static {
		log.debug("load settings");
		AppSettings.loadSettings();
		log.debug("load CFG profile");
		AppSettings.loadCFGProps();
	}

	public static void saveSettings() {
		try {
			prop.store(new FileOutputStream("settings.cfg"), null);
		} catch (IOException localIOException) {
			propFileExists = false;
		}
	}

	public static void loadSettings() {
		try {
			prop.load(new FileInputStream("settings.cfg"));
		} catch (IOException localIOException) {
			log.error("Error loading settings.cfg", localIOException);
			try {
				prop.store(new FileOutputStream("settings.cfg"), null);
				prop.load(new FileInputStream("settings.cfg"));
			} catch (IOException ioe) {
				log.error("Error loading settings.cfg", ioe);
				ioe.printStackTrace();
			}
		}
	}

  public static boolean checkProperties() {
    if (prop.getProperty("SIEBEL_CFG").equals(""))
      return false;
    if (prop.getProperty("WORKSPACE").equals(""))
      return false;
    if (prop.getProperty("TOOLS_PATH").equals(""))
      return false;
    return true;
  }

  private static void loadCFGProps() {
    String cfgFile = prop.getProperty("SIEBEL_CFG");
    if (!cfgFile.equals("")) {
        try {
          bufferedProp.load(new FileInputStream(cfgFile));
        } catch (IOException ioe) {
        	log.error("Error loading CFG profile", ioe);
          System.out.println("Could't load data from Siebel CFG-file.");
        }
    }
  }

  public static void setProperty(String paramString1, String paramString2) {
    prop.setProperty(paramString1, paramString2);
  }

  public static String getProperty(String paramString) {
    String pr = prop.getProperty(paramString);
    if (pr != null)
      return pr;
    else return "";
  }

  public static String getCFGProperty(String paramString) {
    String pr = bufferedProp.getProperty(paramString);
    if (pr != null)
      return pr;
    else return "";
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
}