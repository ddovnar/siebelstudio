package side;

import java.io.File;
import java.io.BufferedReader;
import java.io.FileReader;
import java.io.IOException;
import java.awt.*;
import java.awt.event.*;

import javax.swing.*;
import javax.swing.border.EtchedBorder;
import javax.swing.event.TreeSelectionEvent;
import javax.swing.event.TreeSelectionListener;
import javax.swing.event.ChangeEvent;
import javax.swing.event.ChangeListener;
import javax.swing.tree.*;

public class CodingPane extends JPanel implements TreeSelectionListener, ActionListener, ChangeListener {
	private JPanel leftPane;
	private JPanel mainPane;
	private JTree tree;
	private JTabbedPane tabbedPane;
	private JPopupMenu treePop;
	private JPopupMenu treePopProject;
	private JMenu miNew;
	private JMenuItem miNewFile;
	private JMenuItem miRename;
	private JMenuItem miDelete;
	private JMenuItem miNewFolder;
	private JMenuItem miNewProject;
	private JMenuItem miDeleteProject;
	private JMenuItem miRefresh;
	private JMenuItem miRefreshProject;
	private JFrame appMain;
	private ActionListener listenerAddTab;
	private ActionListener listenerBeforeCloseTab;
	private CodingPane self;
	private boolean searchEnabled = false;
	
	public CodingPane(JFrame parent) {
		appMain = parent;
		self = this;
		this.setLayout(new BorderLayout());

		leftPane = new JPanel();
		leftPane.setPreferredSize(new Dimension(200, parent.getContentPane().getHeight()));
		leftPane.setBorder(BorderFactory.createEtchedBorder(EtchedBorder.LOWERED));

		mainPane = new JPanel();
		mainPane.setBorder(BorderFactory.createEtchedBorder(EtchedBorder.LOWERED));

		JSplitPane hpane = new JSplitPane(JSplitPane.HORIZONTAL_SPLIT, leftPane, mainPane);
		hpane.setContinuousLayout(true);
		hpane.setOneTouchExpandable(true);
		this.add(hpane, BorderLayout.CENTER);

		DefaultMutableTreeNode rootNode = new DefaultMutableTreeNode("Project Tree");
		rootNode.add(FileSystemModel.createTreeModel(new File(AppSettings.getProperty("WORKSPACE")), true));
		tree = new JTree(rootNode);
		tree.setCellRenderer(new FileSystemCellRenderer());
		tree.addTreeSelectionListener(this);
		tree.setShowsRootHandles(true);
		tree.getSelectionModel().setSelectionMode(TreeSelectionModel.SINGLE_TREE_SELECTION); 
    	tree.setShowsRootHandles(true); 
    	tree.setEditable(false);

    	tabbedPane = new JTabbedPane();
    	tabbedPane.setTabLayoutPolicy(1);
    	tabbedPane.setTabLayoutPolicy(JTabbedPane.SCROLL_TAB_LAYOUT);
    	tabbedPane.putClientProperty(
            "Quaqua.TabbedPane.shortenTabs", Boolean.TRUE
        );
    	tabbedPane.putClientProperty(
    		    "Quaqua.TabbedPane.contentBorderPainted", Boolean.TRUE
    		);
    	tabbedPane.putClientProperty("JComponent.sizeVariant", "regular");
    	tabbedPane.addChangeListener(this);

        leftPane.setLayout(new BorderLayout());
        leftPane.add(new JScrollPane(tree), BorderLayout.CENTER);

        mainPane.setLayout(new BorderLayout());
        mainPane.add(tabbedPane, BorderLayout.CENTER);

        treePop = new JPopupMenu();
        miNew = new JMenu("New");
        treePop.add(miNew);

        miNewFile = new JMenuItem("New file");
        miNewFile.setActionCommand("CREATEFILE");
        miNewFile.addActionListener(this);
        miNew.add(miNewFile);

        miNewFolder = new JMenuItem("New Folder");
        miNewFolder.setActionCommand("NEWFOLDER");
        miNewFolder.addActionListener(this);
        miNew.add(miNewFolder);

        miRename = new JMenuItem("Rename");
        miRename.setActionCommand("RENAMEFILE");
        miRename.addActionListener(this);
        treePop.add(miRename);

        miDelete = new JMenuItem("Delete");
        miDelete.setActionCommand("DELETEFILE");
        miDelete.addActionListener(this);
        treePop.add(miDelete);

        miRefresh = new JMenuItem("Refresh");
        miRefresh.setActionCommand("REFRESH");
        miRefresh.addActionListener(this);
        treePop.add(miRefresh);
        //tree.setComponentPopupMenu(treePop);
        tree.add(treePop);

        treePopProject = new JPopupMenu();
        miNewProject = new JMenuItem("New Project");
        miNewProject.addActionListener(this);

        treePopProject.add(miNewProject);
        miDeleteProject = new JMenuItem("Delete Project");
        treePopProject.add(miDeleteProject);
        //tree.setComponentPopupMenu(treePop);
        miRefreshProject = new JMenuItem("Refresh");
        miRefreshProject.setActionCommand("REFRESH");
        miRefreshProject.addActionListener(this);
        treePopProject.add(miRefreshProject);

        tree.add(treePopProject);        
        tree.addMouseListener(new PopupTrigger());
	}

	@Override
    public void valueChanged(TreeSelectionEvent e) {
        //File file = getSelectedFile();
        //if (file != null)
		//	System.err.println("Selected file" + file.getAbsolutePath() + " Is directory? " + file.isDirectory());
       //JOptionPane.showMessageDialog(this, "You have selected: " + node);
    }

    public File getSelectedFile() {
    	Object object = tree.getLastSelectedPathComponent();
        if (object instanceof DefaultMutableTreeNode) {
            Object userObject = ((DefaultMutableTreeNode) object).getUserObject();
            if (userObject instanceof File) {
                File file = (File) userObject;
                return file;
            }
        }
        return null;
    }

    private String getFileDetails(File file) {
    	if (file == null)
    		return "";
    	StringBuffer buffer = new StringBuffer();
    	buffer.append("Name: " + file.getName() + "\n");
    	buffer.append("Path: " + file.getPath() + "\n");
    	buffer.append("Size: " + file.length() + "\n");
    	return buffer.toString();
    }

    public void actionPerformed(ActionEvent evt) {
    	if (evt.getActionCommand().equals("DELETEFILE")) {
    		//System.out.println(tree.getLastSelectedPathComponent());
    		File file = getSelectedFile();
    		boolean success = false;
    		int i = JOptionPane.showConfirmDialog(appMain, "Are you shure?", "Confirm", 0);

    		if (file != null && i == 0) {
    			//System.out.println("deleting: " + file);
    			success = file.delete();
    			if (!success) JOptionPane.showMessageDialog(appMain,"Error deleting file.");
    		}
    		((DefaultTreeModel)tree.getModel()).removeNodeFromParent((MutableTreeNode)tree.getLastSelectedPathComponent());

    	} else if (evt.getActionCommand().equals("CREATEFILE") || evt.getActionCommand().equals("NEWFOLDER")) {
    		DefaultMutableTreeNode firstNode = (DefaultMutableTreeNode)tree.getSelectionPath().getLastPathComponent();
    		DefaultMutableTreeNode newNode = new DefaultMutableTreeNode();

    		String newname;
    		if (evt.getActionCommand().equals("NEWFOLDER"))
    			newname = JOptionPane.showInputDialog("New folder name?");
    		else
    			newname = JOptionPane.showInputDialog("New file name?");

    		if (newname != null) {
    			//DefaultMutableTreeNode nodeParent = (DefaultMutableTreeNode) firstNode.getParent();
    			//System.out.println(((File)firstNode.getUserObject()).getPath());    			
		        /*if(firstNode != null) {
		            for(int i = 0; i < firstNode.getChildCount(); i++) {
		                DefaultMutableTreeNode currNode = (DefaultMutableTreeNode) firstNode.getChildAt(i);
		                System.out.println(currNode.getUserObject() + "=" + ((File)firstNode.getUserObject()).getPath() + "\\" + newname);
		                if(currNode.getUserObject().equals(((File)firstNode.getUserObject()).getPath() + "\\" + newname)) {
		                    JOptionPane.showMessageDialog(appMain,"File with this name already exists.");
		                    return;
		                }
		            }
		        }*/
    			File newFile = new File(((File)firstNode.getUserObject()).getPath() + "\\" + newname);
    			if (newFile.exists()) {
    				if (evt.getActionCommand().equals("NEWFOLDER"))
    					JOptionPane.showMessageDialog(appMain,"Folder with this name already exists.");
    				else
    					JOptionPane.showMessageDialog(appMain,"File with this name already exists.");
		            return;
    			}

    			try {
    				if (evt.getActionCommand().equals("NEWFOLDER"))
    					newFile.mkdir();
    				else
    					newFile.createNewFile();
	    			newNode.setUserObject(newFile);
	    			// Insert new node as last child of node
					((DefaultTreeModel)tree.getModel()).insertNodeInto(newNode, firstNode, firstNode.getChildCount());
					((DefaultTreeModel)tree.getModel()).reload(newNode);
	    			((DefaultTreeModel)tree.getModel()).nodeChanged(newNode);
	    		} catch (IOException ex) {
	    			//System.out.println("");
	    			ex.printStackTrace();
	    		}
    		}
    	} else if (evt.getActionCommand().equals("RENAMEFILE")) {
    		String newname = JOptionPane.showInputDialog("New file name?");
    		if (newname != null) {
	    		TreePath selectedPath = tree.getSelectionPath() ;
		        //make sure there is no other node with this name
		        DefaultMutableTreeNode node = (DefaultMutableTreeNode) selectedPath.getLastPathComponent();
		        DefaultMutableTreeNode nodeParent = (DefaultMutableTreeNode) node.getParent();
		        if(nodeParent != null)
		        {
		            for(int i = 0; i < nodeParent.getChildCount(); i++)
		            {
		                DefaultMutableTreeNode currNode = (DefaultMutableTreeNode) nodeParent.getChildAt(i);
		                if(currNode.getUserObject().equals(newname))
		                {
		                    JOptionPane.showMessageDialog(appMain,"File with this name already exists.");
		                    return;
		                }
		            }
		        }
		        File oldFile = (File)node.getUserObject();
		        File newFile = new File(newname);
		        boolean success = oldFile.renameTo(newFile);
		        if (success) {
		        	node.setUserObject(newFile);
		        	((DefaultTreeModel)tree.getModel()).nodeChanged(node);
		        } else JOptionPane.showMessageDialog(appMain,"Error renaming file.");
		    }
    	} else if (evt.getActionCommand().equals("REFRESH")) {
    		//System.out.println("Refresh workiing");
    		//System.out.println(AppSettings.getProperty("workspace"));
    		DefaultTreeModel model = (DefaultTreeModel) tree.getModel();
    		DefaultMutableTreeNode root = (DefaultMutableTreeNode) model.getRoot();
    		root.removeAllChildren();    		
    		//model.reload();
    		DefaultMutableTreeNode newNode = (FileSystemModel.createTreeModel(new File(AppSettings.getProperty("WORKSPACE")), true));
    		root.add(newNode);
    		model.reload();
    	}
    }

    public void stateChanged(ChangeEvent paramAnonymousChangeEvent) {
        if (tabbedPane.getSelectedIndex() != -1) {
        	ScriptPanel curScrPane = (ScriptPanel)tabbedPane.getComponentAt(tabbedPane.getSelectedIndex());
        	TreePath path = (TreePath)curScrPane.getTreePath();
        	tree.setExpandsSelectedPaths(true);   
			tree.setSelectionPath(path);  
			tree.scrollPathToVisible(path);
			//System.out.println("code pane change");
        }
	}

	public boolean inCodeRunningState() {
		return (tabbedPane.getSelectedIndex() != -1);
	}

	public void setEditorsScheme(String schemeName) {
		for (int i = 0; i < tabbedPane.getTabCount(); i++) {
			ScriptPanel curScrPane = (ScriptPanel)tabbedPane.getComponentAt(i);
			curScrPane.setScheme(schemeName);
		}
	}

	public void setAddTabListener(ActionListener actlist) {
		listenerAddTab = actlist;
	}

	public void setBeforeCloseTabListener(ActionListener actlist) {
		listenerBeforeCloseTab = actlist;
	}

	public ScriptPanel getCurrentEditor() {
		if (tabbedPane.getSelectedIndex() != -1)
			return (ScriptPanel)tabbedPane.getComponentAt(tabbedPane.getSelectedIndex());
		else return null;
	}

	public void saveCurrentFile() {
		ScriptPanel curScrPane = getCurrentEditor();
		if (curScrPane != null)
       		curScrPane.saveDataToFile();
	}

	public String getCurrentSource() {
		ScriptPanel curScrPane = getCurrentEditor();
		if (curScrPane != null) {
			String code = curScrPane.getSource();
			code = replaceOld(code, "TheApplication().NewPropertySet", "oApp.newPropertySet");
			code = replaceOld(code, "SetType", "setType");
			code = replaceOld(code, "SetProperty", "setProperty");
			code = replaceOld(code, "GetProperty", "getProperty");
			code = replaceOld(code, "GetType", "getType");
			code = replaceOld(code, "GetValue", "getValue");
			code = replaceOld(code, "SetValue", "setValue");
			code = replaceOld(code, "Copy", "copy");
			code = replaceOld(code, "Reset", "reset");
			code = replaceOld(code, "GetChild", "getChild");
			code = replaceOld(code, "AddChild", "addChild");
			code = replaceOld(code, "RemoveChild", "removeChild");
			code = replaceOld(code, "RemoveProperty", "removeProperty");
			code = replaceOld(code, "InsertChildAt", "insertChildAt");
			code = replaceOld(code, "GetFirstProperty", "getFirstProperty");
			code = replaceOld(code, "GetNextProperty", "getNextProperty");
			code = replaceOld(code, "GetPropertyCount", "getPropertyCount");
			code = replaceOld(code, "GetChildCount", "getChildCount");
			code = replaceOld(code, "PropertyExists", "propertyExists");

			//System.out.println(code);
			return code;
        	//return curScrPane.getSource();
        }
       	else return "";
	}

	public static String replaceOld(
	    final String aInput,
	    final String aOldPattern,
	    final String aNewPattern
	  ){
	     if ( aOldPattern.equals("") ) {
	        throw new IllegalArgumentException("Old pattern must have content.");
	     }

	     final StringBuffer result = new StringBuffer();
	     //startIdx and idxOld delimit various chunks of aInput; these
	     //chunks always end where aOldPattern begins
	     int startIdx = 0;
	     int idxOld = 0;
	     while ((idxOld = aInput.indexOf(aOldPattern, startIdx)) >= 0) {
	       //grab a part of aInput which does not include aOldPattern
	       result.append( aInput.substring(startIdx, idxOld) );
	       //add aNewPattern to take place of aOldPattern
	       result.append( aNewPattern );

	       //reset the startIdx to just after the current match, to see
	       //if there are any further matches
	       startIdx = idxOld + aOldPattern.length();
	     }
	     //the final chunk will go to the end of aInput
	     result.append( aInput.substring(startIdx) );
	     return result.toString();
	  }

	public boolean isCurrentSourceChanged() {
		ScriptPanel curScrPane = getCurrentEditor();
		if (curScrPane != null)
			return curScrPane.isTextChanged();
		else
			return false;
	}

	public void saveAllFiles() {
		for (int i = 0; i < tabbedPane.getTabCount(); i++) {
			ScriptPanel curScrPane = (ScriptPanel)tabbedPane.getComponentAt(i);
			curScrPane.saveDataToFile();
		}
	}

    class PopupTrigger extends MouseAdapter {
		public void mouseReleased(MouseEvent e) {
			if (e.isPopupTrigger()) {
				int x = e.getX();
	    		int y = e.getY();
	    		TreePath path = tree.getPathForLocation(x, y);
	    		if (path != null) {
	    			DefaultMutableTreeNode selectedNode = (DefaultMutableTreeNode)path.getLastPathComponent();
	    			if (selectedNode.getLevel() == 0)
	    				treePopProject.show(tree, x, y);
	    			else {
	    				File file = getSelectedFile();
	    				if (file != null && file.isDirectory())
	    					miNew.setEnabled(true);
	    				else
	    					miNew.setEnabled(false);
	      				treePop.show(tree, x, y);
	      			}
	    		}
	  		}
		}

		public void mousePressed(MouseEvent e) {
			if(e.getButton()==1 & e.getClickCount()==2) {
				if (tree.getLastSelectedPathComponent() != null && getSelectedFile().isFile()) {
					Object codeLine;
					File f = getSelectedFile();				
					ScriptPanel editorPane = new ScriptPanel(self);
					editorPane.setPath(f.getPath());
					editorPane.setFileName(f.getName());
					editorPane.setTreePath(new TreePath(((DefaultMutableTreeNode)tree.getLastSelectedPathComponent()).getPath()));
					try {
	            		BufferedReader localBufferedReader = new BufferedReader(new FileReader(f));
	            		while ((codeLine = localBufferedReader.readLine()) != null) {
	              			editorPane.getTextArea().append((String)codeLine + System.getProperty("line.separator"));
	            		}
	            		localBufferedReader.close();
	          		} catch (Exception localException1) {
	          		}
	          		editorPane.textLoaded();
					tabbedPane.addTab(f.getName(), editorPane);
					tabbedPane.setTabComponentAt(tabbedPane.getTabCount() - 1, new PanelTab(tabbedPane, 0, listenerAddTab, listenerBeforeCloseTab));
					
					if (listenerAddTab != null)
						listenerAddTab.actionPerformed(null);
				}
			}
		}
	}
        
    public void setSearchEnable(boolean on) {
    	searchEnabled = on;
    }
    
    public boolean getSearchEnable() {
    	return searchEnabled;
    }
}