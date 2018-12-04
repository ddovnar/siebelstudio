package side;
 
import java.awt.*;
import java.awt.event.*;
import java.util.Vector;

import javax.swing.*;
import javax.swing.border.*;

import org.apache.log4j.Logger;
 
public class LoginDialog extends JDialog {
	static Logger log = Logger.getLogger(LoginDialog.class.getName());
	
    private JTextField tfUsername;
    private JPasswordField pfPassword;
    private JLabel lbUsername;
    private JLabel lbPassword;
    private JButton btnLogin;
    private JButton btnCancel;
    private boolean succeeded;
    private String currentConnection;
    private JPanel params;
    private JPanel paramsCmd;
    private JTextField fg;
    private JTextField fe;
    private JTextField fo;
    private JTextField fl;
    private JTextField fconn;
    private JTextField fport;
    private JButton ext;
    private JComboBox conn;
    private ConnectionManager conMgr = new ConnectionManager(null);
    
    public LoginDialog(Frame parent) {
        super(parent, "Login", true);
        //
        log.debug("create login dialog frame");
        JPanel panel = new JPanel(new GridBagLayout());
        GridBagConstraints cs = new GridBagConstraints();
 
        cs.fill = GridBagConstraints.HORIZONTAL;
 
        lbUsername = new JLabel("Username: ");
        cs.gridx = 0;
        cs.gridy = 0;
        cs.gridwidth = 1;
        panel.add(lbUsername, cs);
 
        tfUsername = new JTextField(20);
        cs.gridx = 1;
        cs.gridy = 0;
        cs.gridwidth = 2;
        panel.add(tfUsername, cs);
 
        lbPassword = new JLabel("Password: ");
        cs.gridx = 0;
        cs.gridy = 1;
        cs.gridwidth = 1;
        panel.add(lbPassword, cs);
 
        pfPassword = new JPasswordField(20);
        cs.gridx = 1;
        cs.gridy = 1;
        cs.gridwidth = 2;
        panel.add(pfPassword, cs);
        panel.setBorder(new LineBorder(Color.GRAY));        
        
        JLabel lbCon = new JLabel("Connection: ");
        cs.gridx = 0;
        cs.gridy = 2;
        cs.gridwidth = 1;
        panel.add(lbCon, cs);
        
        conn = new JComboBox(conMgr.getConnectionList());
        conn.setMinimumSize(new Dimension(1,1));
        conn.setPreferredSize(new Dimension(conn.getPreferredSize().width,
        		pfPassword.getPreferredSize().height));
        conn.addActionListener(new ActionListener() {
			public void actionPerformed(ActionEvent e) {
				JComboBox jcmbType = (JComboBox) e.getSource();
				String cmbType = (String) jcmbType.getSelectedItem();
				
				fg.setText(conMgr.getProperty(cmbType + ".Gateway"));
			    fe.setText(conMgr.getProperty(cmbType + ".Enterprise"));
			    fo.setText(conMgr.getProperty(cmbType + ".ObjMgr"));
			    fl.setText(conMgr.getProperty(cmbType + ".Lang"));
			    fport.setText(conMgr.getProperty(cmbType + ".Port"));
			}
		});
        
        cs.gridx = 1;
        cs.gridy = 2;
        cs.gridwidth = 2;
        panel.add(conn, cs);
        
        ext = new JButton();
        ext.setIcon(new ImageIcon(getClass().getResource("images/advancedsettings.png")));
        /*ext.setSize(20, 12);
        ext.setMinimumSize(new Dimension(20, 12));
        ext.setPreferredSize(new Dimension(20, 12));*/
        ext.addActionListener(new ActionListener() {
        	public void actionPerformed(ActionEvent event) {
        		params.setVisible(!params.isVisible());
        		paramsCmd.setVisible(params.isVisible());
        		pack();
        	}
        });
        
        /*cs.gridx = 0;
        cs.gridy = 3;
        cs.gridwidth = 1;
        panel.add(ext, cs);*/
        
        params = new JPanel(new GridBagLayout());
        params.setSize(panel.getWidth(), 100);
        params.setBorder(new LineBorder(Color.GRAY));
        
        GridBagConstraints cs2 = new GridBagConstraints();        
        cs2.fill = GridBagConstraints.HORIZONTAL;
        JLabel lbg = new JLabel("Gateway: ");
        cs2.gridx = 0;
        cs2.gridy = 0;
        cs2.gridwidth = 1;
        params.add(lbg, cs2);
        
        fg = new JTextField(20);
        cs2.gridx = 1;
        cs2.gridy = 0;
        cs2.gridwidth = 2;
        params.add(fg, cs2);
        
        JLabel lbe = new JLabel("Enterprise: ");
        cs2.gridx = 0;
        cs2.gridy = 1;
        cs2.gridwidth = 1;
        params.add(lbe, cs2);
               
        fe = new JTextField(20);
        cs2.gridx = 1;
        cs2.gridy = 1;
        cs2.gridwidth = 2;
        params.add(fe, cs2);
        
        JLabel lbo = new JLabel("ObjectMgr: ");
        cs2.gridx = 0;
        cs2.gridy = 2;
        cs2.gridwidth = 1;
        params.add(lbo, cs2);
               
        fo = new JTextField(20);
        cs2.gridx = 1;
        cs2.gridy = 2;
        cs2.gridwidth = 2;
        params.add(fo, cs2);
        
        JLabel lbl = new JLabel("Language: ");
        cs2.gridx = 0;
        cs2.gridy = 3;
        cs2.gridwidth = 1;
        params.add(lbl, cs2);
        
        fl = new JTextField(20);
        cs2.gridx = 1;
        cs2.gridy = 3;
        cs2.gridwidth = 2;
        params.add(fl, cs2);
        
        JLabel lbp = new JLabel("Port: ");
        cs2.gridx = 0;
        cs2.gridy = 4;
        cs2.gridwidth = 1;
        params.add(lbp, cs2);
               
        fport = new JTextField(20);
        cs2.gridx = 1;
        cs2.gridy = 4;
        cs2.gridwidth = 2;
        params.add(fport, cs2);
        
        btnLogin = new JButton("Login");
 
        btnLogin.addActionListener(new ActionListener() {
 
            public void actionPerformed(ActionEvent e) {
            	log.debug("execute connect command");
            	btnLogin.setEnabled(false);
            	btnCancel.setEnabled(false);
            	SBLConnection.connect(getUsername(), getPassword(), fg.getText(), fe.getText(), fo.getText(), fport.getText(), fl.getText());
            	SBLConnection.listenerAfterConnect = 
					new ActionListener() {
						public void actionPerformed(ActionEvent evt) {
							if (SBLConnection.isConnected()) {
								succeeded = true;
                                currentConnection = SBLConnection.getGateway();
                    			dispose();
							} else {
								JOptionPane.showMessageDialog(LoginDialog.this,
		                            "Invalid username or password",
		                            "Login",
		                            JOptionPane.ERROR_MESSAGE);
								//tfUsername.setText("");
                    			pfPassword.setText("");
                    			succeeded = false;
                    			btnLogin.setEnabled(true);
                    			btnCancel.setEnabled(true);
							}
						}
					};				
                /*if (getUsername().equals("DDOVNAR") && getPassword().equals("123")) {
                    JOptionPane.showMessageDialog(LoginDialog.this,
                            "Hi " + getUsername() + "! You have successfully logged in.",
                            "Login",
                            JOptionPane.INFORMATION_MESSAGE);
                    succeeded = true;
                    dispose();
                } else {
                    JOptionPane.showMessageDialog(LoginDialog.this,
                            "Invalid username or password",
                            "Login",
                            JOptionPane.ERROR_MESSAGE);
                    // reset username and password
                    tfUsername.setText("");
                    pfPassword.setText("");
                    succeeded = false;
 
                }*/
            }
        });
        btnCancel = new JButton("Cancel");
        btnCancel.addActionListener(new ActionListener() { 
            public void actionPerformed(ActionEvent e) {
                dispose();
            }
        });

        this.setDefaultCloseOperation(JFrame.DO_NOTHING_ON_CLOSE);
		this.addWindowListener(new WindowAdapter() {
		  public void windowClosing(WindowEvent e) {
		    if (btnLogin.isEnabled())
		    	dispose();
		  }
		});
        JPanel bp = new JPanel();
        bp.add(btnLogin);
        bp.add(btnCancel);
        bp.add(ext);
 
        //getContentPane().add(panel, BorderLayout.CENTER);        
        //getContentPane().add(params, BorderLayout.SOUTH);
        JPanel main = new JPanel(new BorderLayout());
        main.add(panel, BorderLayout.NORTH);
        //JPanel add = new JPanel();
        //add.add(ext);
        //main.add(add, BorderLayout.CENTER);
        main.add(params, BorderLayout.CENTER);
        
        paramsCmd = new JPanel(new BorderLayout());
        
        fconn = new JTextField(20);
        fconn.setVisible(false);
        paramsCmd.add(fconn, BorderLayout.NORTH);
        if (SBLConnection.islocalMode()) {
        	JLabel info = new JLabel("Used only for project: " + SBLConnection.getLocalProject());
        	info.setForeground(Color.RED);
        	paramsCmd.add(info, BorderLayout.CENTER);
        }
        
        JButton btnNew = new JButton();
        btnNew.setIcon(new ImageIcon(getClass().getResource("images/edit_add.png")));
        btnNew.setToolTipText("New connection");
        btnNew.addActionListener(new ActionListener() {
        	public void actionPerformed(ActionEvent event) {
        		fconn.setVisible(true);
        		conn.setEnabled(false);
        		fg.setText("");
			    fe.setText("");
			    fo.setText("");
			    fl.setText("");
			    fport.setText("");
			    pack();
        	}
        });
        paramsCmd.add(btnNew, BorderLayout.WEST);
        
        JButton btnSave = new JButton();
        btnSave.setIcon(new ImageIcon(getClass().getResource("images/save.png")));
        btnSave.setToolTipText("Save connection");
        btnSave.addActionListener(new ActionListener() {
        	public void actionPerformed(ActionEvent event) {
        		if (fconn.isVisible() && fconn.getText().isEmpty()) {
	        		JOptionPane.showMessageDialog(LoginDialog.this,
	                        "Connection name is empty",
	                        "New connection",
	                        JOptionPane.ERROR_MESSAGE);
	        		fconn.requestFocusInWindow();
	        		return;
        		}
        		
        		conMgr.saveConnection(
        				(String) conn.getSelectedItem(),
                		fg.getText(),
        			    fe.getText(),
        			    fo.getText(),
        			    fl.getText(),
        			    fport.getText(),
        			    fconn
        		);
        		
        		conn.setEnabled(true);
        		conn.addItem(fconn.getText());
        	}
        });
        paramsCmd.add(btnSave, BorderLayout.EAST);
        
        main.add(paramsCmd, BorderLayout.SOUTH);
        getContentPane().add(main, BorderLayout.CENTER);
        getContentPane().add(bp, BorderLayout.PAGE_END);
        
        getRootPane().setDefaultButton(btnLogin);
        
        params.setVisible(false);
        paramsCmd.setVisible(false);
        
        if (conn.getItemCount() > 0) {
        	if (SBLConnection.islocalMode()) {
        		conn.setSelectedItem(SBLConnection.getLocalProject());
        		conn.setEnabled(false);
        		fg.setEnabled(false);
			    fe.setEnabled(false);
			    fo.setEnabled(false);
			    fl.setEnabled(false);
			    fport.setEnabled(false);
			    btnSave.setEnabled(false);
			    btnNew.setEnabled(false);
        	} else
        		conn.setSelectedIndex(0);
        }
        
        pack();
        setResizable(false);
        setLocationRelativeTo(parent);
    }
 
    public String getUsername() {
        return tfUsername.getText().trim();
    }
 
    public String getPassword() {
        return new String(pfPassword.getPassword());
    }
 
    public boolean isSucceeded() {
        return succeeded;
    }

    public String getConnectionStr() {
        return currentConnection;
    }
}