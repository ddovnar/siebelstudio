package side;

import java.io.File;
import java.io.FileInputStream;
import java.io.FilenameFilter;
import java.io.IOException;
import java.io.RandomAccessFile;
import java.nio.MappedByteBuffer;
import java.nio.channels.FileChannel;
import java.nio.charset.Charset;

import javax.swing.JOptionPane;
import javax.script.ScriptEngine;
import javax.script.ScriptEngineManager;
import javax.script.ScriptException;

import com.siebel.data.*;

import org.apache.log4j.Logger;

public class EScriptRunner {
	static Logger log = Logger.getLogger(EScriptRunner.class.getName());
	
	private ScriptEngineManager scrManager = new ScriptEngineManager();
	private ScriptEngine scrEngine = scrManager.getEngineByName("ECMAScript");
	private JOptionPane dialog = new JOptionPane();
	private int funcCnt = 0;
	
	private static String readFile(String path) throws IOException {
		FileInputStream stream = new FileInputStream(new File(path));
		try {
			FileChannel fc = stream.getChannel();
			MappedByteBuffer bb = fc.map(FileChannel.MapMode.READ_ONLY, 0, fc.size());
			return Charset.defaultCharset().decode(bb).toString();
		} finally {
			stream.close();
		}
	}
	
	public String beautify(String src) {
		Object result = "";
		String siebelInterface = "";
		try {
			siebelInterface = readFile("beautify.js");
			if (!siebelInterface.isEmpty()) {
				scrEngine.eval(siebelInterface);
				scrEngine.put("srcarg", src);
				scrEngine.eval("var result = js_beautify(srcarg);");				
				result = scrEngine.get("result");
			}
		} catch(IOException exio) {
			exio.printStackTrace();
		} catch (ScriptException e) {
			e.printStackTrace();
		}
		return (String)result;
	}
	
	public void exec(SiebelDataBean m_dataBean, String scriptSource) {
		try {
			log.debug("execute escript...start");
			log.debug("create script engine objects");
			scrEngine.put("oApp",m_dataBean);
			scrEngine.put("oSysOut",System.out);
			scrEngine.put("Dialog", dialog);
			String siebelInterface = "";
			try {
				log.debug("load siebel objects interface");
				siebelInterface = readFile("SiebelInterface.js");
				if (!siebelInterface.isEmpty()) {
					scrEngine.eval(siebelInterface);
					buildLibrary();
					//jsEngine.eval(readFile("test.es"));
					scriptSource = strftime(scriptSource, siebelInterface);
					log.debug("escript invoke:");
					log.debug(scriptSource);
					scrEngine.eval(scriptSource);
				}
			} catch (IOException e) {
				log.error("Error reading siebel objects interface file", e);
				e.printStackTrace();
			} catch (ScriptException e) {
				log.error("Error of execution escript", e);
				e.printStackTrace();
			}			
		} finally {
			//System.out.println("Compiler exit");
			log.debug("execute escript...end");
		}
	}
	
	public String strftime(String code, String func) {
		String res = "";
		int funcStart = code.indexOf("Clib.strftime");
		if (funcStart > -1) {			
			int funcEnd = code.indexOf(";", funcStart);
			int argStart = code.indexOf("(", funcStart);
			int argEnd = code.indexOf(",", argStart);
			String argName = code.substring(argStart + 1, argEnd);
			String funcCode = "";
			res = code.substring(0, funcStart);
			funcCnt++;
			res += "strftime" + funcCnt + "(" + code.substring(code.indexOf(",", argEnd) + 1, funcEnd + 1) + " ";

			int intFuncStart = func.indexOf("Clib.strftime");
			if (intFuncStart > -1) {
				int intFuncEnd = func.indexOf("}//end", intFuncStart);
				funcCode = func.substring(func.indexOf("{", intFuncStart) + 1, intFuncEnd);
			}

			res += "function strftime" + funcCnt + "(fmt, lc) { var valref; " + funcCode + " " + argName + " = valref;};";
			
			res += code.substring(funcEnd + 1, code.length());
		} else 
			res = code;
		return res;
	}
	
	private void buildLibrary() {
		String dirlib = AppSettings.getProperty("WORKSPACE");
		if (!dirlib.isEmpty()) {
			File libDirectory = new File(dirlib + "/Script Library");  
			File[] libFiles = libDirectory.listFiles(new FilenameFilter() {  
				public boolean accept(File dir, String name) {  
					return name.endsWith(".es");  
				}  
			});
			
			for (int i = 0; i < libFiles.length; i++) {
				try {
					scrEngine.eval(readFile(libFiles[i].getPath()));
					log.debug("loading library " + libFiles[i].getPath() + "...ok");
				} catch (IOException ex) {
					log.error("Error loading library " + libFiles[i].getPath(), ex);
				} catch (ScriptException ex) {
					log.error("Error compiling library " + libFiles[i].getPath(), ex);
				}
			}
		}
	}
}