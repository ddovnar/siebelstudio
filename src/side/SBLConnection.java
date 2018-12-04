package side;

import java.awt.event.ActionListener;

import com.siebel.data.*;

import org.apache.log4j.Logger;

public class SBLConnection {
	static Logger log = Logger.getLogger(SBLConnection.class.getName());
	
	private static boolean isConnected = false;
	private static SiebelDataBean sbl_app = null;
	private static String login;
	private static String pass;
	private static String cGateway;
	private static String cEnter;
	private static String cObjMgr;
	private static String cPort;
	private static String cLang;
	private static boolean localMode = false;
	private static String localProject = "DELTADEV";
	public static ActionListener listenerAfterConnect;

	static {
		if (sbl_app == null) {
			log.debug("Create Siebel Connection in static block");
			sbl_app = new SiebelDataBean();
		}
	}

	public static SiebelDataBean getApp() {
		return sbl_app;
	}

	public static String getLogin() {
		return login;
	}

	public static String getPassword() {
		return pass;
	}

	public static boolean isConnected() {
		return isConnected;
	}

	public static String getGateway() {
		if (localMode)
			return "kvhosb01";
		return cGateway;
	}
	
	public static String getEnterprise() {
		if (localMode)
			return "SBA_81";
		return cEnter;
	}
	
	public static String getObjMgr() {
		return cObjMgr;
	}
	
	public static String getPort() {
		return cPort;
	}
	
	public static String getLang() {
		return cLang;
	}
	
	public static boolean islocalMode() {
		return localMode;
	}
	
	public static String getLocalProject() {
		return localProject;
	}

	public static void connectOnly(String alogin, String apass) {
		login = alogin;
		pass = apass;

		if (isConnected) return;

		try {
			String gateway = "10.44.2.210";
			String enterprise = "SBA_80";				
			if (gateway.indexOf(":") > 0)
				gateway = gateway.substring(0, gateway.indexOf(":"));
			//System.out.println("Siebel://" + gateway + ":2321/" + enterprise + "/SCCObjMgr_enu" + " " + SBLConnection.getLogin() + " " + SBLConnection.getPassword() + " " + "ENU");
			sbl_app.login("Siebel://" + gateway + "/" + enterprise + "/eCommunicationsObjMgr_enu", SBLConnection.getLogin(), SBLConnection.getPassword(), "ENU");
			//sbl_app.login("Siebel://SIEBELTEST4:2321/eTEST4SIEB78/SCCObjMgr_enu", SBLConnection.getLogin(), SBLConnection.getPassword(), "enu");
			cGateway = gateway;
			isConnected = true;					
		} catch (SiebelException e) {
			//e.printStackTrace();
			isConnected = false;
			cGateway = "";
		}
		listenerAfterConnect.actionPerformed(null);
	}

	public static void connect(String alogin, String apass, String gateway, String ent, String objm, String port, String lang) {
		log.debug("invoke connect method");
		login = alogin;
		pass = apass;
		cGateway = gateway;
		cEnter = ent;
		cObjMgr = objm;
		cPort = port;
		cLang = lang;

		if (isConnected) return;

		new Thread(new Runnable() {
			private volatile boolean running = true;
        	@Override
        	public void run() {
        		while (running) {
	            	try {
	            		log.debug("start run connector thread");
	            		//String gateway = "T-IMB-SBLA";
	            		//String enterprise = "SIEBEL_TEST";
						//String gateway = "10.44.2.210";
						//AppSettings.getCFGProperty("GatewayAddress");
						//String enterprise = "SBA_80";
						//AppSettings.getCFGProperty("EnterpriseServer");					
						//if (gateway.indexOf(":") > 0)
						//	gateway = gateway.substring(0, gateway.indexOf(":"));
						//System.out.println("Siebel://" + gateway + ":2321/" + enterprise + "/SCCObjMgr_enu" + " " + SBLConnection.getLogin() + " " + SBLConnection.getPassword() + " " + "ENU");
						log.debug("connection parameters:\n" + 
								"Gateway: " + SBLConnection.getGateway() + "\n" +
								"Enterprise: " + SBLConnection.getEnterprise() + "\n" +
								/*"Object: eCommunicationsObjMgr_enu" + "\n" +*/
								"Object: " + SBLConnection.getObjMgr() + "\n" +
								"Login: " + SBLConnection.getLogin() + "\n" +
								"Password: " + SBLConnection.getPassword() + "\n" +
								"Language: " + SBLConnection.getLang());
						try {
							sbl_app.login("Siebel://" + SBLConnection.getGateway() + ":" + SBLConnection.getPort() + "/" + SBLConnection.getEnterprise() + "/" + SBLConnection.getObjMgr(), SBLConnection.getLogin(), SBLConnection.getPassword(), SBLConnection.getLang());
						} catch(SiebelException ex) {
							sbl_app.login("Siebel://" + SBLConnection.getGateway() + ":" + SBLConnection.getPort() + "/" + SBLConnection.getEnterprise() + "/" + SBLConnection.getObjMgr(), SBLConnection.getLogin(), SBLConnection.getPassword(), SBLConnection.getLang());
						}
						//sbl_app.login("Siebel://SIEBELTEST4:2321/eTEST4SIEB78/SCCObjMgr_enu", SBLConnection.getLogin(), SBLConnection.getPassword(), "enu");
						//cGateway = gateway;
						isConnected = true;
						log.debug("finish run connector thread");
					} catch (SiebelException e) {
						//e.printStackTrace();
						log.error("Connection error", e);
						isConnected = false;
						cGateway = "";
					} catch (NullPointerException ex) {
						log.error("Connection error", ex);
						isConnected = false;
						cGateway = "";
					}
					listenerAfterConnect.actionPerformed(null);
					running = false;
        		}
        	}
        }).start();
		
	} 

	public static void disconnect() {
		try {
			log.debug("invoke disconnect method");
			sbl_app.logoff();			
		} catch (SiebelException e) {
			//e.printStackTrace();
			log.error("Disconnect error", e);
		}
		isConnected = false;
	}


/*	class TaskConnection extends SwingWorker {
		@Override
		public  doInBackground() {
		}

		@Override
     	protected void process(Object obj) {
     	}

     	@Override
       	protected void done() {
       	}
	}*/
}