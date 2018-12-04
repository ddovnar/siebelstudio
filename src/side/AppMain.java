package side;

import java.awt.EventQueue;
import java.awt.BorderLayout;
import java.awt.Dimension;
import java.awt.Image;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;
import java.awt.event.WindowAdapter;
import java.awt.event.WindowEvent;
import java.awt.event.KeyEvent;

import javax.swing.*;
import javax.swing.event.ChangeEvent;
import javax.swing.event.ChangeListener;
//import javax.swing.JFrame;
import javax.swing.border.EtchedBorder;

import org.apache.log4j.PropertyConfigurator;
import org.apache.log4j.Logger;

import java.util.Properties;
import java.io.FileInputStream;
import java.io.InputStream;
import java.io.IOException;

public class AppMain implements ActionListener, ChangeListener {
	static Logger log = Logger.getLogger(AppMain.class.getName());
	
	private JFrame frame;
	private static SplashWindow splashWindow;
	private JTabbedPane tabbedPane;
	private ConsolePane consolePane;
	private JMenuBar menuBar;
	private JMenu mnuFile;
	private JMenu mnuPref;
	private JMenu mnuThemes;
	private JMenu mnuGUIThemes;
	private JMenu mnuConnection;
	private JMenu mnuExecuting;
	private JMenu mnuTools;
	private JMenu mnuHelp;
	private JMenuItem mniOptions;
	private JMenuItem mniConMan;
	private JMenuItem mniExit;
	private JMenuItem mniSave;
	private JMenuItem mniSaveAll;
	private JMenuItem mniDarkTheme;
	private JMenuItem mniDefTheme;
	private JMenuItem mniEclipseTheme;
	private JMenuItem mniIdeaTheme;
	private JMenuItem mniConnect;
	private JMenuItem mniDisconnect;
	private JMenuItem mniESRun;
	private JMenuItem mniESStop;
	private JMenuItem mniAbout;
	private JMenuItem mniMACGUITheme;
	private JMenuItem mniDefGUITheme;
	private JMenuItem mniBCQuery;
	private CodingPane codingPane;

	private JToolBar toolBar;
	
	private JButton btnSave;
	private JButton btnSaveAll;
	private JButton btnLogin;
	private JButton btnLogoff;
	private JButton btnRun;
	private JButton btnStop;

	private Thread scriptRunner;
	private boolean threadWork = false;
	
	/**
	 * Launch the application.
	 */
	public static void main(String[] args) {
        
		log.debug("Application start");
		//createSplash();
		try {
			doSomething();
		} catch (Exception ex) {
			log.error("Couldn't loader complete", ex);
		}

		SwingUtilities.invokeLater(new Runnable() {
			public void run() {
				splashWindow.dispose();
			}
		});

		EventQueue.invokeLater(new Runnable() {
			public void run() {
				try {
					log.debug("Create GUI");
					AppMain window = new AppMain();
					window.frame.setVisible(true);
				} catch (Exception e) {
					log.error("Couldn't create GUI", e);
					e.printStackTrace();
				}
			}
		});
	}

	/**
	 * Create the application.
	 */
	public AppMain() {
		log.debug("Create GUI...initialize");
		initialize();
		log.debug("Create GUI...initialize...ok");
		log.debug("Create GUI...setup main frame");
		setupFrameGUI();
		log.debug("Create GUI...setup main frame...ok");
		log.debug("Create GUI...init actions");
		initActions();
		log.debug("Create GUI...init actions...ok");
	}

	private void setupFrameGUI() {
		frame.setLayout(new BorderLayout());

		menuBar = new JMenuBar();
		frame.setJMenuBar(menuBar);

		toolBar = new JToolBar();
		toolBar.setFloatable(false);
		frame.add(toolBar, BorderLayout.NORTH);

		tabbedPane = new JTabbedPane();
    	tabbedPane.setTabLayoutPolicy(1);    	


		consolePane = new ConsolePane(this);

	    JSplitPane localJSplitPane = new JSplitPane(0, tabbedPane, consolePane);
	    localJSplitPane.setOneTouchExpandable(true);
	    localJSplitPane.setDividerLocation(200);
	    localJSplitPane.setResizeWeight(0.5D);

    	frame.add(localJSplitPane, BorderLayout.CENTER);

    	codingPane = new CodingPane(frame);
    	//tabbedPane.addTab("test", new ScriptPanel());
    	//tabbedPane.addTab("Siebel Objects", new CodingPane(frame));
    	tabbedPane.addTab("eScript", codingPane);
    	tabbedPane.addChangeListener(this);

    	codingPane.setAddTabListener(new ActionListener() {
    		public void actionPerformed(ActionEvent evt) {
    			//mniESRun.setEnabled(true);
    			//System.out.println("tab closed");
    			updateActions();
    		}
    	});
    	codingPane.setBeforeCloseTabListener(new ActionListener() {
    		public void actionPerformed(ActionEvent evt) {
    			//System.out.println("before close tab");
    			if (isActiveTabCode()) {
    				CodingPane codePane = (CodingPane)tabbedPane.getComponentAt(tabbedPane.getSelectedIndex());
    				if (codePane.isCurrentSourceChanged()) {
    					int i = JOptionPane.showConfirmDialog(frame, "Text was changed. Do you want to save it?", "Confirm save", 0);
        				if (i == 0) 
        					codePane.saveCurrentFile();
    				}
    			}
    		}
    	});
    	// button close tab
    	//tabbedPane.setTabComponentAt(tabbedPane.getTabCount() - 1, new PanelTab(tabbedPane, 0));
		//frame.add(new CodingPane(frame), BorderLayout.CENTER);
	}

	private void initActions() {
		mnuFile = new JMenu("File");
		mnuConnection = new JMenu("Connection");
		mnuExecuting = new JMenu("Executing");
		mnuPref = new JMenu("Preferences");
		mnuTools = new JMenu("Tools");
		mnuHelp = new JMenu("Help");
		
		mnuThemes = new JMenu("Color Scheme");
		mnuGUIThemes = new JMenu("GUI Scheme");

		mniSave = new JMenuItem("Save");
		mniSave.setAccelerator(KeyStroke.getKeyStroke("control " + "S"));
		mniSave.setActionCommand("SAVE");
		mniSave.addActionListener(this);
		mnuFile.add(mniSave);

		mniSaveAll = new JMenuItem("Save All");
		//mniSaveAll.setAccelerator(KeyStroke.getKeyStroke("control " + "S"));
		mniSaveAll.setActionCommand("SAVEALL");
		mniSaveAll.addActionListener(this);
		mnuFile.add(mniSaveAll);
		
		mnuFile.addSeparator();

		mniExit = new JMenuItem("Exit");
		mniExit.setAccelerator(KeyStroke.getKeyStroke("control " + "Q"));
		mniExit.setActionCommand("EXIT");
		mniExit.addActionListener(this);
		mnuFile.add(mniExit);

		mniDefTheme = new JMenuItem("Default Scheme");
		mniDefTheme.setActionCommand("SET_THEME_DEFAULT");
		mniDefTheme.addActionListener(this);
		mnuThemes.add(mniDefTheme);

		mniDarkTheme = new JMenuItem("Dark Scheme");
		mniDarkTheme.setActionCommand("SET_THEME_DARK");
		mniDarkTheme.addActionListener(this);
		mnuThemes.add(mniDarkTheme);
		mnuPref.add(mnuThemes);

		mniEclipseTheme = new JMenuItem("Eclipse Scheme");
		mniEclipseTheme.setActionCommand("SET_THEME_ECLIPSE");
		mniEclipseTheme.addActionListener(this);
		mnuThemes.add(mniEclipseTheme);
		mnuPref.add(mnuThemes);
		
		mniDefGUITheme = new JMenuItem("Default Scheme");
		mniDefGUITheme.setActionCommand("SET_THEME_DEFAULT_GUI");
		mniDefGUITheme.addActionListener(this);
		mnuGUIThemes.add(mniDefGUITheme);

		mniMACGUITheme = new JMenuItem("Mac OS Scheme");
		mniMACGUITheme.setActionCommand("SET_THEME_MACOS");
		mniMACGUITheme.addActionListener(this);
		mnuGUIThemes.add(mniMACGUITheme);
		
		mniOptions = new JMenuItem("Options");
		mniOptions.setActionCommand("OPTIONS");
		mniOptions.addActionListener(this);
		mniOptions.setEnabled(false);
		mnuPref.add(mniOptions);
		
		mniConMan = new JMenuItem("Connections");
		mniConMan.setActionCommand("CONMAN");
		mniConMan.addActionListener(this);
		mniConMan.setEnabled(!SBLConnection.islocalMode());
		mnuPref.add(mniConMan);
		
		mnuPref.add(mnuGUIThemes);
		
		mniIdeaTheme = new JMenuItem("Idea Scheme");
		mniIdeaTheme.setActionCommand("SET_THEME_IDEA");
		mniIdeaTheme.addActionListener(this);
		mnuThemes.add(mniIdeaTheme);
		
		mnuPref.add(mnuThemes);

		mniConnect = new JMenuItem("Login");
		mniConnect.setActionCommand("CONNECT");
		mniConnect.addActionListener(this);
		mniConnect.setEnabled(true);
		mnuConnection.add(mniConnect);

		mniDisconnect = new JMenuItem("Logoff");
		mniDisconnect.setActionCommand("DISCONNECT");
		mniDisconnect.addActionListener(this);
		mniDisconnect.setEnabled(false);
		mnuConnection.add(mniDisconnect);

		mniESRun = new JMenuItem("Run escript");
		mniESRun.setAccelerator(KeyStroke.getKeyStroke("F5"));
		mniESRun.setActionCommand("ESRUN");
		mniESRun.addActionListener(this);
		mniESRun.setEnabled(false);
		mnuExecuting.add(mniESRun);

		mniESStop = new JMenuItem("Stop escript");
		mniESStop.setAccelerator(KeyStroke.getKeyStroke("F6"));
		mniESStop.setActionCommand("ESRUNSTOP");
		mniESStop.addActionListener(this);
		mniESStop.setEnabled(false);
		mnuExecuting.add(mniESStop);
		
		mniAbout = new JMenuItem("About");
		mniAbout.setActionCommand("ABOUT");
		mniAbout.addActionListener(this);
		mnuHelp.add(mniAbout);

		mniBCQuery = new JMenuItem("BusComp Navigator");
		mniBCQuery.setActionCommand("BCQuery");
		mniBCQuery.addActionListener(this);
		mnuTools.add(mniBCQuery);
		
		menuBar.add(mnuFile);
		menuBar.add(mnuConnection);
		menuBar.add(mnuExecuting);
		menuBar.add(mnuPref);
		menuBar.add(mnuTools);
		menuBar.add(mnuHelp);

    	//toolBar.add(new JButton("New"));
    	
    	btnSave = new JButton();
    	btnSave.setIcon(new ImageIcon(getClass().getResource("images/save.png")));
    	btnSave.setActionCommand("SAVE");
    	btnSave.setToolTipText("Save escript");
    	btnSave.addActionListener(this);
    	toolBar.add(btnSave);
    	
    	btnSaveAll = new JButton();
    	btnSaveAll.setIcon(new ImageIcon(getClass().getResource("images/save_all.png")));
    	btnSaveAll.setActionCommand("SAVEALL");
    	btnSaveAll.setToolTipText("Save all escripts");
    	btnSaveAll.addActionListener(this);
    	toolBar.add(btnSaveAll);

    	toolBar.addSeparator();
    	
    	btnLogin = new JButton();
    	btnLogin.setIcon(new ImageIcon(getClass().getResource("images/connect.png")));
    	btnLogin.setActionCommand("CONNECT");
    	btnLogin.setToolTipText("Login to Siebel");
    	btnLogin.addActionListener(this);
    	btnLogin.setEnabled(true);
    	toolBar.add(btnLogin);    	
    	
    	btnLogoff = new JButton();
    	btnLogoff.setIcon(new ImageIcon(getClass().getResource("images/disconnect.png")));
    	btnLogoff.setActionCommand("DISCONNECT");
    	btnLogoff.setToolTipText("Logoff from Siebel");
    	btnLogoff.addActionListener(this);
    	btnLogoff.setEnabled(false);
    	toolBar.add(btnLogoff);
    	
    	toolBar.addSeparator();
    	
    	btnRun = new JButton();
    	btnRun.setIcon(new ImageIcon(getClass().getResource("images/run.png")));
    	btnRun.setActionCommand("ESRUN");
    	btnRun.setToolTipText("Execute escript");
    	btnRun.addActionListener(this);
    	btnRun.setEnabled(false);
    	toolBar.add(btnRun);
    	
    	btnStop = new JButton();
    	btnStop.setIcon(new ImageIcon(getClass().getResource("images/stop_red.png")));
    	btnStop.setActionCommand("ESRUNSTOP");
    	btnStop.setToolTipText("Stop executing escript");
    	btnStop.addActionListener(this);
    	btnStop.setEnabled(false);
    	toolBar.add(btnStop);
	}
	/**
	 * Initialize the contents of the frame.
	 */
	private void initialize() {
		frame = new JFrame();
		frame.setIconImage(new ImageIcon(getClass().getResource("images/sbl.png")).getImage());
		frame.setBounds(100, 100, 450, 349);
		frame.setDefaultCloseOperation(0);
		frame.setTitle("Siebel Studio");
		frame.setExtendedState(java.awt.Frame.MAXIMIZED_BOTH);
		frame.addWindowListener(new WindowAdapter() {
      		public void windowClosing(WindowEvent paramAnonymousWindowEvent) {
      			if (SBLConnection.isConnected()) {
      				SBLConnection.disconnect();      				
      			}

        		exitApp();
          	}
    	});
	}

	public void exitApp() {
		int i = JOptionPane.showConfirmDialog(frame, "Are you shure?", "Confirm exit", 0);
        if (i == 0)
        	System.exit(0);
	}

	public void actionPerformed(ActionEvent event) {
		if (event.getActionCommand().equals("EXIT")) {
			exitApp();
		} else if (event.getActionCommand().equals("SET_THEME_DARK")){
			((CodingPane)this.tabbedPane.getComponentAt(this.tabbedPane.getSelectedIndex())).setEditorsScheme("dark.xml");
		} else if (event.getActionCommand().equals("SET_THEME_DEFAULT")){
			((CodingPane)this.tabbedPane.getComponentAt(this.tabbedPane.getSelectedIndex())).setEditorsScheme("default.xml");
		} else if (event.getActionCommand().equals("SET_THEME_ECLIPSE")){
			((CodingPane)this.tabbedPane.getComponentAt(this.tabbedPane.getSelectedIndex())).setEditorsScheme("eclipse.xml");
		} else if (event.getActionCommand().equals("SET_THEME_IDEA")){
			((CodingPane)this.tabbedPane.getComponentAt(this.tabbedPane.getSelectedIndex())).setEditorsScheme("idea.xml");
		} else if (event.getActionCommand().equals("SET_THEME_DEFAULT_GUI")) {
			try { 
	        	UIManager.setLookAndFeel(UIManager.getCrossPlatformLookAndFeelClassName());
	            SwingUtilities.updateComponentTreeUI(frame);
	        } catch (Exception e) {
	        }
		} else if (event.getActionCommand().equals("SET_THEME_MACOS")) {
			System.setProperty("Quaqua.tabLayoutPolicy","swap");
			//System.setProperty("Quaqua.TabbedPane.shortenTabs", "false");
			//System.setProperty("Quaqua.TabbedPaneChild.contentInsets", "10");
			//System.setProperty("Quaqua.Component.visualMargin", "10");
			//System.setProperty("JComponent.sizeVariant", "regular");
	        try { 
	        	 //System.setProperty("Quaqua.Debug.showVisualBounds", "true");
	             UIManager.setLookAndFeel(ch.randelshofer.quaqua.QuaquaManager.getLookAndFeel());
	             SwingUtilities.updateComponentTreeUI(frame);
	        } catch (Exception e) {
	        }
		} else if (event.getActionCommand().equals("OPTIONS")){
			System.out.println("options setting");
		} else if (event.getActionCommand().equals("CONNECT")){
			//System.out.println(AppSettings.getProperty("SIEBEL_CFG1"));
/*			System.out.println("connection");
			System.out.println(AppSettings.getProperty("SIEBEL_CFG"));
			System.out.println(AppSettings.getCFGProperty("GatewayAddress"));
			System.out.println(AppSettings.getCFGProperty("EnterpriseServer"));
			System.out.println(AppSettings.getProperty("WORKSPACE"));*/
			LoginDialog loginDlg = new LoginDialog(this.frame);
            loginDlg.setVisible(true);
            // if logon successfully
            if(loginDlg.isSucceeded()){
                //System.out.println("loged on");
                frame.setTitle("Siebel Studio" + " " + loginDlg.getConnectionStr());
                mniConnect.setEnabled(false);
				mniDisconnect.setEnabled(true);
				btnLogin.setEnabled(false);
				btnLogoff.setEnabled(true);
            }
			/*SBLConnection.connect("DDOVNAR", "q1w2e3R4");
			SBLConnection.listenerAfterConnect = 
				new ActionListener() {
					public void actionPerformed(ActionEvent evt) {
						mniConnect.setEnabled(false);
						mniDisconnect.setEnabled(true);
					}
				};*/
		} else if (event.getActionCommand().equals("DISCONNECT")){
			log.debug("execute disconnect command");
			SBLConnection.disconnect();
			mniConnect.setEnabled(true);
			mniDisconnect.setEnabled(false);
			btnLogin.setEnabled(true);
			btnLogoff.setEnabled(false);
		} else if (event.getActionCommand().equals("ESRUN")) {
			//System.out.println("run escript program");
			threadWork = true;
			scriptRunner = new Thread(new Runnable() {
				private int i = 0;
        		@Override
        		public void run() {
        			//while (threadWork) {
        			//	i++;
        			//	consolePane.clearConsole();
        			//	System.out.println("count: " + i);
        			//}
        			try {        				
	        			threadWork = true;        			
	        			CodingPane codePane = (CodingPane)tabbedPane.getComponentAt(tabbedPane.getSelectedIndex());
	        			new EScriptRunner().exec(SBLConnection.getApp(), codePane.getCurrentSource());
	        			threadWork = false;
	        			updateActions();
	        			Thread.sleep(1000);
	        		} catch (InterruptedException e) {
	        			log.error("invoking escript error", e);
	        			threadWork = false;
	        			updateActions();
	        		}
        		}
        	});
        	scriptRunner.start();
        	updateActions();
        } else if (event.getActionCommand().equals("ESRUNSTOP")) {
        	//scriptRunner.stop();
        	scriptRunner.interrupt();
        	threadWork = false;
        	updateActions();
		} else if (event.getActionCommand().equals("SAVE") || event.getActionCommand().equals("SAVEALL")) {
			if (isActiveTabCode()) {
				if (event.getActionCommand().equals("SAVE")) {
					CodingPane codePane = (CodingPane)tabbedPane.getComponentAt(tabbedPane.getSelectedIndex());
					codePane.saveCurrentFile();
				} else {
					CodingPane codePane = (CodingPane)tabbedPane.getComponentAt(tabbedPane.getSelectedIndex());
					codePane.saveAllFiles();
				}
			}
		} else if (event.getActionCommand().equals("ABOUT")) {
			final JDialog aboutDlg = new JDialog(frame, "About", true);
			aboutDlg.setResizable(false);			
			JButton aboutOk = new JButton("Ok");
			aboutOk.addActionListener(new ActionListener() {
			      public void actionPerformed(ActionEvent evt) {
			        aboutDlg.setVisible(false);
			      }
			    });
			Box b = Box.createVerticalBox();
		    b.add(Box.createGlue());
		    b.add(new JLabel("<html><h2>Siebel Studio</h2></html>"));
		    b.add(new JLabel("Author: Dmitriy Dovnar"));
		    b.add(new JLabel("e-mail: Dmitriy.Dovnar@areon.ua"));		    
		    b.add(Box.createGlue());
		    aboutDlg.getContentPane().add(b, "Center");

		    JPanel p2 = new JPanel();
		    p2.add(aboutOk);
		    aboutDlg.getContentPane().add(p2, "South");
			aboutDlg.setSize(250, 150);
			aboutDlg.setLocationRelativeTo(frame);
			aboutDlg.setVisible(true);
		} else if (event.getActionCommand().equals("CONMAN")) {
			ConnectionManager conMan = new ConnectionManager(this.frame);
			conMan.setVisible(true);
		} else if (event.getActionCommand().equals("BCQuery")) {
			BusCompNavigator busNav = new BusCompNavigator();
		}
	}

	private void updateActions() {
		mniESRun.setEnabled(false);
		btnRun.setEnabled(false);
        //if (tabbedPane.getSelectedIndex() != -1) {
        //	if (tabbedPane.getSelectedIndex() == 1) {
			if (isActiveTabCode()) {
        		CodingPane codePane = (CodingPane)tabbedPane.getComponentAt(tabbedPane.getSelectedIndex());
        		mniESRun.setEnabled(codePane.inCodeRunningState() && !threadWork);
        		btnRun.setEnabled(codePane.inCodeRunningState() && !threadWork);
        	}
        //	}
        //}
        mniESStop.setEnabled(threadWork);
        btnStop.setEnabled(threadWork);
	}

	public boolean isActiveTabCode() {
        return (tabbedPane.getSelectedIndex() != -1 && tabbedPane.getSelectedIndex() == 0);
	}

	public void stateChanged(ChangeEvent paramAnonymousChangeEvent) {
		updateActions();
	}

	private static final void createSplash() {
		SwingUtilities.invokeLater(new Runnable() {
			public void run() {
				splashWindow = new SplashWindow();
				splashWindow.setVisible(true);
			}
		});
	}

	private static final void displayStatus(final String status) throws Exception {
		SwingUtilities.invokeAndWait(new Runnable() {
			public void run() {
				splashWindow.getStatusLabel().setText("Status: " + status);
			}
		});
	}
 
	private static final void doSomething() throws Exception { 
		displayStatus("Checking system parameters... ");
 
		int j = 0;
		 
		for (int i = 0; i < 1000; i++)
		{
		// Что бы компилятор не оптимизировал, делаем какие-то вычисления
		j = Math.abs(j + i + 2);
		Thread.sleep(1);
		}
		 
		displayStatus("Initialize... ");
		 
		for (int i = 0; i < 1000; i++)
		{
		// Что бы компилятор не оптимизировал, делаем какие-то вычисления
		j = Math.abs(i + 2);
		Thread.sleep(1);
		}

		displayStatus("Loading opened files... ");
		 
		for (int i = 0; i < 1000; i++)
		{
		// Что бы компилятор не оптимизировал, делаем какие-то вычисления
		j = Math.abs(i + 2);
		Thread.sleep(1);
		}
		
		displayStatus("Loading properties files... ");
		Properties props = new Properties();
		try {
			InputStream is = new FileInputStream("log.properties");
			try {
	    		props.load(is);
	    		PropertyConfigurator.configure(props);
	    		log.debug("log.properties file loaded");
			} finally {
	    		try {
	        		is.close();
	    		} catch (Exception e) {
	    			log.error("Error load log.properties: " + e);
	    		}
			}
		} catch (Exception e) {
			log.error("Error load log.properties: " + e);
		}
		displayStatus("Load complete");
	}
}
