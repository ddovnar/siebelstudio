package side;

import java.awt.BorderLayout;
import java.awt.Component;
import java.awt.GridBagConstraints;
import java.awt.GridBagLayout;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;
import java.awt.event.WindowAdapter;
import java.awt.event.WindowEvent;
import java.lang.reflect.Array;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.Vector;

import javax.swing.ImageIcon;
import javax.swing.JButton;
import javax.swing.JComponent;
import javax.swing.JFrame;
import javax.swing.JLabel;
import javax.swing.JOptionPane;
import javax.swing.JPanel;
import javax.swing.JScrollPane;
import javax.swing.JTable;
import javax.swing.JTextArea;
import javax.swing.JTextField;
import javax.swing.table.DefaultTableModel;
import javax.swing.table.TableCellRenderer;
import javax.swing.table.TableColumn;

import com.siebel.data.*;

public class BusCompNavigator extends JFrame implements ActionListener {
	private JTextArea searchExpr;
	private JTextField fBusObj;
	private JTextField fBusComp;
	private JButton btnSearch;
	private JTable table;
	private DefaultTableModel dtm;
	private TableCellRenderer renderer = new JComponentTableCellRenderer();
	private SiebelBusObject busObj = null;
	private SiebelBusComp busComp = null;
	private JTextField fCnt;
	private JTextField fFields;
	
	public BusCompNavigator() {
		setTitle("BusComp Navigator");
		setIconImage(new ImageIcon(getClass().getResource("images/sbl.png")).getImage());
		createGUI();
		setSize(850, 600);
		setVisible(true);
		setDefaultCloseOperation(JFrame.DISPOSE_ON_CLOSE);
		/*addWindowListener(new WindowAdapter() {
      		public void windowClosing(WindowEvent paramAnonymousWindowEvent) {
      			BusCompNavigator.this.setVisible(false);
      			BusCompNavigator.this.dispose();
          	}
    	});*/
	}
	
	private void createGUI() {
		JPanel toolObj = new JPanel(new GridBagLayout());
		
		JLabel lbSearch = new JLabel("Search Expr:");
		searchExpr = new JTextArea(3, 40);
		JLabel lbBO = new JLabel("BusObj:");
		fBusObj = new JTextField(10);
		JLabel lbBC = new JLabel("BusComp:");
		fBusComp = new JTextField(10);
		
		GridBagConstraints cs2 = new GridBagConstraints();
        cs2.fill = GridBagConstraints.HORIZONTAL;
        //cs2.anchor = GridBagConstraints.WEST;
        cs2.gridx = 0;
        cs2.gridy = 0;
        cs2.gridwidth = 0;
        
        toolObj.add(lbBO, cs2);
        cs2.gridx = 1;
        cs2.gridy = 0;
        cs2.gridwidth = 1;
        toolObj.add(fBusObj, cs2);
        
        cs2.gridx = 0;
        cs2.gridy = 1;
        cs2.gridwidth = 1;
        
        toolObj.add(lbBC, cs2);
        cs2.gridx = 1;
        cs2.gridy = 1;
        cs2.gridwidth = 1;
        toolObj.add(fBusComp, cs2);
        
        JLabel lbCnt = new JLabel("Rec Count:");
		fCnt = new JTextField(10);
		
		cs2.gridx = 0;
        cs2.gridy = 2;
        cs2.gridwidth = 1;
        
        toolObj.add(lbCnt, cs2);
        cs2.gridx = 1;
        cs2.gridy = 2;
        cs2.gridwidth = 1;
        toolObj.add(fCnt, cs2);
        
        cs2.gridx = 0;
        cs2.gridy = 3;
        cs2.gridwidth = 1;
        
        toolObj.add(new JLabel("Fields:"), cs2);
        
        JPanel toolSearch = new JPanel(new BorderLayout());
        toolSearch.add(lbSearch, BorderLayout.NORTH);
        JScrollPane srcScrol = new JScrollPane(searchExpr);
        toolSearch.add(srcScrol);
        searchExpr.setText("[Id] = '1-4I8-30'");
        JPanel toolPane = new JPanel(new BorderLayout());
        toolPane.add(toolObj, BorderLayout.WEST);
        toolPane.add(toolSearch, BorderLayout.CENTER);
        btnSearch = new JButton("Query");
        btnSearch.addActionListener(this);
        toolPane.add(btnSearch, BorderLayout.EAST);
        
        /*GridBagConstraints css2 = new GridBagConstraints();
        css2.fill = GridBagConstraints.HORIZONTAL;
        css2.gridx = 0;
        css2.gridy = 0;
        css2.gridwidth = 0;*/
        
        fFields = new JTextField(40);
        JPanel flds = new JPanel(new BorderLayout());
        flds.add(fFields);
        toolPane.add(flds, BorderLayout.SOUTH);
        
		this.add(toolPane, BorderLayout.NORTH);
		JPanel gridPane = new JPanel(new BorderLayout());
		
		/*String[] colName = new String[] {
		           "Name", "Gateway", "Enterprise", "Object Manager", "Lang", "Port", "Changed"
		       };
		Object[][] products = new Object[][] {
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
		//String[] colName = new String[] {};
		//Object[][] products = new Object[][] {};
		
		dtm = new DefaultTableModel(new Object[] {}, 0);
		table = new JTable(dtm);
		table.setAutoResizeMode(JTable.AUTO_RESIZE_OFF);
		gridPane.add(new JScrollPane(table), BorderLayout.CENTER);
		this.add(gridPane, BorderLayout.CENTER);
	}
	
	public void actionPerformed(ActionEvent event) {
		if (fBusObj.getText().isEmpty() || fBusComp.getText().isEmpty()) {
			String msgText = "";
			if (fBusObj.getText().isEmpty())
				msgText = "BusObject not set";
			if (fBusComp.getText().isEmpty())
				msgText = "BusComp not set";
			
			JOptionPane.showMessageDialog(BusCompNavigator.this,
                    msgText,
                    "Wrong data",
                    JOptionPane.ERROR_MESSAGE);
			if (fBusObj.getText().isEmpty())
				fBusObj.requestFocusInWindow();
			else if (fBusComp.getText().isEmpty())
				fBusComp.requestFocusInWindow();
			return;
		}
		
		//for (int ic = table.getColumnModel().getColumnCount() - 1; ic >=0; ic--)
		//	table.getColumnModel().removeColumn(table.getColumnModel().getColumn(ic));
		dtm.setColumnCount(0);
		
		//for (int ir = 0; ir < table.getModel().getRowCount(); ir++)
		for(int i = dtm.getRowCount() - 1; i >=0; i--)
		{
			dtm.removeRow(i);
		}
		
		//table.revalidate();
		
		if (SBLConnection.isConnected()) {
			try {
				if ((busObj == null || busComp == null) || (busObj != null && !busObj.name().equals(fBusObj.getText())) ||
						(busComp != null && !busComp.name().equals(fBusComp.getText()))) {
					if (busComp != null)
						busComp.release();
					if (busObj != null)
						busObj.release();
					
					busObj = SBLConnection.getApp().getBusObject(fBusObj.getText());
					busComp = busObj.getBusComp(fBusComp.getText());
				}
				
				busComp.setViewMode(3);
				
				ArrayList<String> fields = new ArrayList<String>();
				//fields.add("Id");
				dtm.addColumn("Id");
				
				if (fFields.getText().isEmpty()) {			
					SiebelBusObject busOF = SBLConnection.getApp().getBusObject("Repository Business Component");
					SiebelBusComp busC = busOF.getBusComp("Repository Business Component");
					SiebelBusComp busCF = busOF.getBusComp("Repository Field");
					
					busC.setViewMode(3);
					busC.activateField("Name");
					busC.clearToQuery();
					busC.setSearchExpr("[Name] = '" + fBusComp.getText() + "'");
					busC.executeQuery(false);
					if (busC.firstRecord()) {					
						busCF.setViewMode(3);
						busCF.activateField("Name");
						busCF.setSearchExpr("[Inactive] IS NULL OR [Inactive] = 'N'");
						busCF.executeQuery(true);
						boolean f = busCF.firstRecord();
						
						while (f) {							
							fields.add(busCF.getFieldValue("Name"));
							/*TableColumn col = new TableColumn();
							col.setMinWidth(100);
							col.setPreferredWidth(100);
							col.setHeaderRenderer(renderer);
							JLabel headerLabel = new JLabel(busCF.getFieldValue("Name"), JLabel.CENTER);
							col.setHeaderValue(headerLabel);
	
							table.getColumnModel().addColumn(col);*/
							//System.out.println(busCF.getFieldValue("Name"));
							
							f = busCF.nextRecord();
						}
					}
				} else {
					fields.clear();
					fields.addAll(Arrays.asList(fFields.getText().split("\\s*,\\s*")));
				}
					
				Collections.sort(fields);
				
				for (int fi = 0; fi < fields.size(); fi++) {
					busComp.activateField(fields.get(fi));
					dtm.addColumn(fields.get(fi));
				}
				
				busComp.clearToQuery();
				busComp.setSearchExpr(searchExpr.getText());
				busComp.executeQuery(false);
				boolean rec = busComp.firstRecord();
				int recCnt = 0;
				while (rec) {
					if (!fCnt.getText().isEmpty() && recCnt == (new Integer(fCnt.getText()).intValue()))
						break;
					Vector<String> rowData = new Vector<String>();
					rowData.add(busComp.getFieldValue("Id"));
					for (int i = 0; i < fields.size(); i++) {
						//System.out.println("Field:" + fields.get(i) + ", Value:" + busComp.getFieldValue(fields.get(i)));
						rowData.add(busComp.getFieldValue(fields.get(i)));
					}
					
				    dtm.addRow(rowData);
				    
					rec = busComp.nextRecord();
					recCnt++;
				}
				//busComp.release();
				//busObj.release();
			} catch(Exception ex) {
				ex.printStackTrace();
			}
		}
	}
	
	public static void main(String[] args) {
		BusCompNavigator app = new BusCompNavigator();
	}

}

class JComponentTableCellRenderer implements TableCellRenderer {
	  public Component getTableCellRendererComponent(JTable table, Object value, 
	      boolean isSelected, boolean hasFocus, int row, int column) {
	    return (JComponent)value;
	  }
	}
