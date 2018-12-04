package side;

import java.awt.*;
import java.awt.event.*;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.FileWriter;
import java.io.IOException;
import java.io.PrintWriter;
import java.util.ArrayList;
import java.util.Properties;
import java.util.Enumeration;
import java.util.Vector;

import javax.swing.*;
import javax.swing.border.*;
import javax.swing.event.TableModelEvent;
import javax.swing.event.TableModelListener;
import javax.swing.table.DefaultTableModel;

public class ConnectionManager extends JDialog implements ActionListener {
	private JToolBar toolBar;
	private JButton btnOK;
	private JButton btnNew;
	private JButton btnDel;
	private DefaultTableModel dtm;
	private JTable table;
	private boolean userChange = true;
	private Object[][] products;
	private static Properties prop = new Properties();
	private Vector<String> conns = new Vector<String>();
	
	public ConnectionManager(Frame parent) {
		super(parent, "Connections", true);
		
		String[] colName = new String[] {
		           "Name", "Gateway", "Enterprise", "Object Manager", "Lang", "Port", "Changed"
		       };
		   /*products = new Object[][] {
		       {
		           "DeltaDev", "SBL1", "Todd", "Start", "http://www.url.com", "0"
		   }, {
		       "PlatinumDev", "SBL2", "Bob", "Start", "http://www.url.com", "0"
		   }, {
		       "DeltaTest", "SBL3", "Bill", "Start", "http://www.url.com", "0"
		   }, {
		       "PlatinumTest", "SBL4", "Mary", "Start", "http://www.url.com", "0"
		       }
		   };*/
			//products = new Object[][]{};
		   toolBar = new JToolBar();
		   toolBar.setFloatable(false);
		   add(toolBar, BorderLayout.NORTH);
		   
		   btnNew = new JButton();
		   btnNew.setIcon(new ImageIcon(getClass().getResource("images/edit_add.png")));
		   btnNew.setActionCommand("NEWRECORD");
		   btnNew.addActionListener(this);
		   btnNew.setToolTipText("New connection");
		   toolBar.add(btnNew);
		   
		   btnDel = new JButton();
		   btnDel.setIcon(new ImageIcon(getClass().getResource("images/edit_remove.png")));
		   btnDel.setActionCommand("DELRECORD");
		   btnDel.addActionListener(this);
		   btnDel.setToolTipText("Delete connection");
		   toolBar.add(btnDel);
		   
		   dtm = new DefaultTableModel(products, colName);
		   load(parent != null);

		   table = new JTable(dtm);
		   table.getModel().addTableModelListener(new MyTableModelListener(table));
		   table.setAutoResizeMode(JTable.AUTO_RESIZE_LAST_COLUMN);
		   table.getColumnModel().getColumn(0).setPreferredWidth(150);
		   table.getColumnModel().getColumn(0).setWidth(150);
		   table.getColumnModel().getColumn(1).setPreferredWidth(150);
		   table.getColumnModel().getColumn(1).setWidth(150);
		   table.getColumnModel().getColumn(2).setPreferredWidth(150);
		   table.getColumnModel().getColumn(2).setWidth(150);
		   table.getColumnModel().getColumn(3).setPreferredWidth(150);
		   table.getColumnModel().getColumn(3).setWidth(150);
		   table.getColumnModel().getColumn(4).setPreferredWidth(100);
		   table.getColumnModel().getColumn(4).setWidth(100);
		   table.getColumnModel().getColumn(5).setPreferredWidth(50);
		   table.getColumnModel().getColumn(5).setWidth(50);
		   table.getColumnModel().getColumn(6).setPreferredWidth(50);
		   table.getColumnModel().getColumn(6).setWidth(50);
		   
		   table.removeColumn(table.getColumnModel().getColumn(6));
		   
		   JScrollPane scrollPane = new JScrollPane(table);
		   this.add(scrollPane);
		   setSize(600, 300);
		   setLocationRelativeTo(parent);
		   
		   JPanel botPanel = new JPanel();		   
		   add(botPanel, BorderLayout.SOUTH);
		   btnOK = new JButton("OK");
		   btnOK.setActionCommand("OK");
		   btnOK.addActionListener(this);
		   botPanel.add(btnOK, BorderLayout.CENTER);
	}
	
	public void actionPerformed(ActionEvent event) {
		if (event.getActionCommand().equals("OK")){
			save();
			dispose();
		} else if (event.getActionCommand().equals("NEWRECORD")){
			dtm.addRow(new Object[]{"New Connection", "", "", "", "RUS", "2321", "0"});
		} else if (event.getActionCommand().equals("DELRECORD")){
			int[] rows = table.getSelectedRows();
			for(int i=0;i<rows.length;i++){
				dtm.removeRow(rows[i]-i);
			}
		}
	}
	
	private void save() {
		String connName = "";
		for (int i = 0 ; i < table.getRowCount(); i++) {
		    for(int j = 0 ; j < table.getColumnCount();j++) {
		    	if (j == 0)
		    		connName = (String)table.getValueAt(i,j);
		    	else if (j == 1)
		    		prop.setProperty(connName + ".Gateway", (String)table.getValueAt(i,j));
		    	else if (j == 2)
		    		prop.setProperty(connName + ".Enterprise", (String)table.getValueAt(i,j));
		    	else if (j == 3)
		    		prop.setProperty(connName + ".ObjMgr", (String)table.getValueAt(i,j));
		    	else if (j == 4)
		    		prop.setProperty(connName + ".Lang", (String)table.getValueAt(i,j));
		    	else if (j == 5)
		    		prop.setProperty(connName + ".Port", (String)table.getValueAt(i,j));
		    }
		}
		try {
			//FileOutputStream erasor = new FileOutputStream("connections.cfg"); 
			//erasor.write(0); 
			//erasor.close();
			prop.store(new FileOutputStream("connections.cfg"), null);
		} catch(Exception ex) {
			ex.printStackTrace();
		}
	}
	
	public String getProperty(String key) {
		if (prop == null)
			return "";
		key = prop.getProperty(key);
		if (key == null)
			key = "";
		return key;
	}
	
	public void load(boolean clearAfter) {
		try {
			prop.load(new FileInputStream("connections.cfg"));
		} catch (IOException localIOException) {
			localIOException.printStackTrace();
		}
		if (prop != null) {
		    Enumeration e = prop.propertyNames();
		    String connName = "";		    
		    while (e.hasMoreElements()) {
		      String key = (String) e.nextElement();
		      if (!key.isEmpty() && key.indexOf(".") > -1) {
		    	  connName = key.substring(0, key.indexOf("."));
		    	  if (conns.contains(connName))
		    		  continue;
		    	  else
		    		  conns.add(connName);		    	  
		      }		      
		    }
		    
		    for (int i = 0; i < conns.size(); i++) {
			    Object[] rowData = {conns.get(i), 
		    			  prop.getProperty(conns.get(i) + ".Gateway"), 
		    			  prop.getProperty(conns.get(i) + ".Enterprise"), 
		    			  prop.getProperty(conns.get(i) + ".ObjMgr"), 
		    			  prop.getProperty(conns.get(i) + ".Lang"), 
		    			  prop.getProperty(conns.get(i) + ".Port"),
		    			  "0"};
			      dtm.addRow(rowData);
		    }
		    
		    if (clearAfter) {
		    	prop.clear();
		    }
		}

	}
	
	public void saveConnection(String fconn, String fg, String fe, String fo, String fl, String port, JTextField newFlag) {
		if (newFlag.isVisible())
			fconn = newFlag.getText();
			
		prop.setProperty(fconn + ".Gateway", fg);
		prop.setProperty(fconn + ".Enterprise", fe);
		prop.setProperty(fconn + ".ObjMgr", fo);
		prop.setProperty(fconn + ".Lang", fl);
		prop.setProperty(fconn + ".Port", port);
		
		try {
			prop.store(new FileOutputStream("connections.cfg"), null);
		} catch(Exception ex) {
			ex.printStackTrace();
		}
	}
		    
	public Vector<String> getConnectionList() {
		return conns;
	}
	
	class MyTableModelListener implements TableModelListener {
		  JTable table;

		  MyTableModelListener(JTable table) {
		    this.table = table;
		  }

		  public void tableChanged(TableModelEvent e) {
		    int firstRow = e.getFirstRow();
		    int lastRow = e.getLastRow();
		    int index = e.getColumn();

		    switch (e.getType()) {
		    /*case TableModelEvent.INSERT:
		      for (int i = firstRow; i <= lastRow; i++) {
		        System.out.println("INSERT" + i);
		      }
		      break;*/
		    case TableModelEvent.UPDATE:
		      /*if (firstRow == TableModelEvent.HEADER_ROW) {
		        if (index == TableModelEvent.ALL_COLUMNS) {
		          System.out.println("A column was added");
		        } else {
		          System.out.println(index + "in header changed");
		        }
		      } else {
		        for (int i = firstRow; i <= lastRow; i++) {
		          if (index == TableModelEvent.ALL_COLUMNS) {
		            System.out.println("All columns have changed");
		          } else {
		            System.out.println("HSS" + index);		            
		          }
		        }
		      }*/
		      /*if (userChange) {
		    	  userChange = false;
		    	  table.setValueAt("1", table.getSelectedRow(), 5);
		    	  userChange = true;
		      }*/
		      break;
		    /*case TableModelEvent.DELETE:
		      for (int i = firstRow; i <= lastRow; i++) {
		        System.out.println(i);
		      }
		      break;
		    }
		  }*/
		    }
		  }
	}
}
