package side.sifimp;

import side.*;
import java.util.ArrayList;
import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.nio.MappedByteBuffer;
import java.nio.channels.FileChannel;
import java.nio.charset.Charset;

import java.awt.*;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;
import java.awt.event.WindowAdapter;
import java.awt.event.WindowEvent;
import javax.swing.*;
import javax.swing.border.*;

import com.siebel.data.*;

public class SifImporter extends JFrame implements ActionListener {
	private TitlePanel titlePane;
	private LoginPanel loginPane;
	private SifPanel sifPane;
	private JPanel navbarPane;
	private JButton prevButton;
	private JButton nextButton;
	private JButton cancelButton;
	private BaseWizardPanel currentPane;
	private ArrayList<BaseWizardPanel> wizardFlow = new ArrayList<BaseWizardPanel>();
	private int activePageIndex = 0;
	public SifImporter() {
		init();
		titlePane = new TitlePanel();		
		
		loginPane = new LoginPanel();
		loginPane.setPanelAction(getLoginAction());
		
		sifPane = new SifPanel();
		sifPane.setPanelAction(getSifAction());		

		navbarPane = new JPanel(new FlowLayout());
		navbarPane.setBorder(BorderFactory.createEtchedBorder(EtchedBorder.LOWERED));
		prevButton = new JButton("Back");
		prevButton.setActionCommand("BACK");
		prevButton.addActionListener(this);		
		nextButton = new JButton("Next");
		nextButton.setActionCommand("NEXT");
		nextButton.addActionListener(this);
		cancelButton = new JButton("Cancel");
		cancelButton.setActionCommand("CANCEL");
		cancelButton.addActionListener(this);
		
		navbarPane.add(prevButton);
		navbarPane.add(nextButton);
		navbarPane.add(cancelButton);
		

		wizardFlow.add(loginPane);
		wizardFlow.add(sifPane);

		add(titlePane, BorderLayout.NORTH);
		//add(wizardFlow.get(0), BorderLayout.CENTER);
		add(navbarPane, BorderLayout.SOUTH);
		changeStep();		
	}

	public void actionPerformed(ActionEvent evt) {
		if (evt.getActionCommand().equals("NEXT")) {
			if (currentPane != null)
				currentPane.getPanelAction().actionPerformed(evt);
			if (currentPane.isWellDone()) {
				activePageIndex++;
				changeStep();
			}
		} else if (evt.getActionCommand().equals("CANCEL")) {
			closeApp();
		}  else if (evt.getActionCommand().equals("BACK")) {
			activePageIndex--;
			changeStep();
		}
	}

	public void changeStep() {
		boolean founded = false;
		
		if (currentPane != null)
			currentPane.setVisible(false);
		
		for (int i = 0; i < getContentPane().getComponentCount(); i++) {
			if (getContentPane().getComponent(i) == wizardFlow.get(activePageIndex)) {
				getContentPane().getComponent(i).setVisible(true);
				founded = true;
				break;
			}
		}
		
		if (!founded)
			add(wizardFlow.get(activePageIndex), BorderLayout.CENTER);
		
		currentPane = wizardFlow.get(activePageIndex);

		titlePane.setTitle(currentPane.getTitle());

		activeNavButtons();
	}

	private void activeNavButtons() {
		boolean backEnabled = true;
		boolean nextEnabled = true;
		if (activePageIndex == 0)
			backEnabled = false;
		if (activePageIndex == wizardFlow.size() - 1)
			nextEnabled = false;

		prevButton.setEnabled(backEnabled);
		nextButton.setEnabled(nextEnabled);
	}

	private void DisableAllNavButtons() {
		prevButton.setEnabled(false);
		nextButton.setEnabled(false);
		cancelButton.setEnabled(false);
	}

	public void init() {
		setSize(600, 400);
		setTitle("Sif importer");
		setLayout(new BorderLayout());
		setDefaultCloseOperation(0);
		setExtendedState(java.awt.Frame.MAXIMIZED_BOTH);
		addWindowListener(new WindowAdapter() {
      		public void windowClosing(WindowEvent paramAnonymousWindowEvent) {
        		closeApp();
          	}
    	});
	}

	public void closeApp() {
		if (SBLConnection.isConnected()) {
      		SBLConnection.disconnect();      				
 		}
 		System.exit(0);
	}
	public static void main(String[] args) {
		EventQueue.invokeLater(new Runnable() {
			public void run() {
				try {
					LookAndFeel old = UIManager.getLookAndFeel();
      				try {
         				UIManager.setLookAndFeel(UIManager.getSystemLookAndFeelClassName());
      				} catch (Throwable ex) {
         				old = null;
      				} 

					SifImporter window = new SifImporter();
					window.setVisible(true);

					/*JFileChooser sifFileChooser = new JFileChooser();
					sifFileChooser.addChoosableFileFilter(new FileTypeFilter(".sif", "SIF Archive"));
					File sifFile;
        			if (sifFileChooser.showOpenDialog(null) == 0) {
          				sifFile = sifFileChooser.getSelectedFile();
          				System.out.println(sifFile.getName());
          			} else {
          				System.exit(0);
          			}*/
				} catch (Exception e) {
					e.printStackTrace();
				}
			}
		});
	}

	public ActionListener getLoginAction() {
		return new ActionListener() {
			public void actionPerformed(ActionEvent evt) {
				loginPane.setWellDone(false);
				DisableAllNavButtons();
				System.out.println("Login action: " + loginPane.getLogin() + " " + loginPane.getPassword());								
            	SBLConnection.listenerAfterConnect = 
					new ActionListener() {
						public void actionPerformed(ActionEvent evt) {
							if (SBLConnection.isConnected()) {
								activeNavButtons();
								loginPane.setWellDone(true);
							} else {
								JOptionPane.showMessageDialog(loginPane,
		                            "Invalid username or password",
		                            "Login",
		                            JOptionPane.ERROR_MESSAGE);
								activeNavButtons();
							}
						}
					};
				SBLConnection.connectOnly(loginPane.getLogin(), loginPane.getPassword());
				cancelButton.setEnabled(true);
			}
		};
	}

	public ActionListener getSifAction() {
		return new ActionListener() {
			public void actionPerformed(ActionEvent evt) {
				System.out.println(sifPane.getSif().getName());
			}
		};
	}
}

class TitlePanel extends JPanel {
	private JLabel title;
	public TitlePanel() {
		super(new BorderLayout());
		title = new JLabel("Test title caption");
		title.setFont(new Font("Serif", Font.PLAIN, 24));
		setBackground(Color.WHITE);
		add(title, BorderLayout.CENTER);
	}

	public void setTitle(String atitle) {
		title.setText(atitle);
	}
}

class BaseWizardPanel extends JPanel {
	private ActionListener action;
	private String title;
	private boolean wellDone = false;

	public BaseWizardPanel() {
		super();
	}

	public BaseWizardPanel(LayoutManager layout) {
		super(layout);
	}

	public void setPanelAction(ActionListener act) {
		action = act;
	}

	public ActionListener getPanelAction() {
		return action;
	}

	public String getTitle() {
		return title;
	}

	public void setTitle(String tit) {
		title = tit;
	}

	public boolean isWellDone() {
		return wellDone;
	}

	public void setWellDone(boolean ok) {
		wellDone = ok;
	}
}

class LoginPanel extends BaseWizardPanel {
	private JTextField login;
	private JPasswordField password;

	public LoginPanel() {
		super(new GridBagLayout());
		setBorder(BorderFactory.createEtchedBorder(EtchedBorder.LOWERED));
		GridBagConstraints cs = new GridBagConstraints();
 
        cs.fill = GridBagConstraints.HORIZONTAL;
 
 		JLabel lbCaption = new JLabel("Siebel Authentication");
        lbCaption.setFont(new Font("Serif", Font.PLAIN, 18));
        lbCaption.setForeground(Color.BLUE);

        cs.gridx = 0;
        cs.gridy = 0;
        cs.gridwidth = 5;
        add(lbCaption, cs);

        JLabel lbUsername = new JLabel("Login: ");
        lbUsername.setFont(new Font("Serif", Font.PLAIN, 14));
        cs.gridx = 0;
        cs.gridy = 1;
        cs.gridwidth = 1;
        add(lbUsername, cs);
 
        login = new JTextField(20);
        cs.gridx = 1;
        cs.gridy = 1;
        cs.gridwidth = 2;
        add(login, cs);
 
        JLabel lbPassword = new JLabel("Password: ");
        lbPassword.setFont(new Font("Serif", Font.PLAIN, 14));
        cs.gridx = 0;
        cs.gridy = 2;
        cs.gridwidth = 1;
        add(lbPassword, cs);
 
        password = new JPasswordField(20);
        cs.gridx = 1;
        cs.gridy = 2;
        cs.gridwidth = 2;
        add(password, cs);

        setTitle("Connected to Siebel CRM");
	}

	public String getLogin() {
		return login.getText().trim();
	}

	public String getPassword() {
		return new String(password.getPassword());
	}
}

class SifPanel extends BaseWizardPanel {
	private JButton selSif;
	private JTextField sifFilePath;
	private JPanel selector;
	private File sifFile;
	private JTextArea info;
	private SiebelPropertySet structPS;

	public SifPanel() {
		super(new BorderLayout());
		selector = new JPanel(new FlowLayout());
		selSif = new JButton("...");

		selSif.addActionListener(new ActionListener() {
			public void actionPerformed(ActionEvent evt) {				
				JFileChooser sifFileChooser = new JFileChooser();
				sifFileChooser.addChoosableFileFilter(new FileTypeFilter(".sif", "SIF Archive"));
    			if (sifFileChooser.showOpenDialog(null) == 0) {
      				sifFile = sifFileChooser.getSelectedFile();
      			}
      			if (sifFile != null) {
      				sifFilePath.setText(sifFile.toString());

      				try {
	      				structPS = SBLConnection.getApp().newPropertySet();

	      				SiebelPropertySet inputPS = SBLConnection.getApp().newPropertySet();
	      				SiebelService srv = SBLConnection.getApp().getService("EAI XML Converter");
	      				System.out.println(readFile(sifFile.toString()));
	      				inputPS.setValue(readFile(sifFile.toString()));

						srv.invokeMethod("XMLDocToIntObjHier", inputPS, structPS);

						System.out.println(structPS);
					} catch (SiebelException ex) {
						ex.printStackTrace();
					} catch (IOException ex1) {

					}
      			}
			}
		});

		sifFilePath = new JTextField(70);
		//sifFilePath.setEnabled(false);
		sifFilePath.setText("C:\\workspace\\siebeltest\\sif.sif");
		selector.add(sifFilePath);
		selector.add(selSif);
		add(selector, BorderLayout.NORTH);

		info = new JTextArea("Description:");
		info.setEditable(false);
		add(info, BorderLayout.CENTER);

		setTitle("Selecting Sif-Archive file");
	}

	private String readFile(String path) throws IOException {
		FileInputStream stream = new FileInputStream(new File(path));
		try {
			FileChannel fc = stream.getChannel();
			MappedByteBuffer bb = fc.map(FileChannel.MapMode.READ_ONLY, 0, fc.size());
			return Charset.defaultCharset().decode(bb).toString();
		} finally {
			stream.close();
		}
	}

	public File getSif() {
		return sifFile;
	}
}