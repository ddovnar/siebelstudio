package side;

import java.io.IOException;
import java.io.StringReader;
import java.io.BufferedReader;
import java.io.BufferedWriter;
import java.io.File;
import java.io.FileWriter;
import java.awt.BorderLayout;
import java.awt.Font;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;
import java.awt.event.KeyEvent;
import java.awt.event.KeyListener;
import java.awt.event.MouseWheelEvent;
import java.awt.event.MouseWheelListener;

import javax.swing.AbstractAction;
import javax.swing.Action;
import javax.swing.BorderFactory;
import javax.swing.JButton;
import javax.swing.JCheckBox;
import javax.swing.JComponent;
import javax.swing.JOptionPane;
import javax.swing.JPanel;
import javax.swing.JTextField;
import javax.swing.JToolBar;
import javax.swing.KeyStroke;
import javax.swing.event.DocumentEvent;
import javax.swing.event.DocumentListener;

import org.fife.rsta.ac.LanguageSupportFactory;
import org.fife.rsta.ac.java.JarManager;
import org.fife.rsta.ac.java.buildpath.JarLibraryInfo;
import org.fife.rsta.ac.java.buildpath.SourceLocation;
import org.fife.rsta.ac.java.buildpath.ZipSourceLocation;
import org.fife.ui.rsyntaxtextarea.*;
import org.fife.ui.rtextarea.RTextScrollPane;
import org.fife.ui.rtextarea.SearchContext;
import org.fife.ui.rtextarea.SearchEngine;
import org.fife.ui.rtextarea.SearchResult;

public class ScriptPanel extends JPanel
{
  private static final long serialVersionUID = -4151426658495161948L;
  private RSyntaxTextArea textArea;
  private JButton btnSave;
  private JButton btnFind;
  private JButton btnRun;
  private JTextField searchField;
  private JCheckBox regexCB;
  private JCheckBox matchCaseCB;
  private JPanel self;
  private JToolBar toolBar;
  private String path;
  private String fileName;
  private Object treePath;
  private boolean scriptOpenned = false;
  private boolean scriptChanged = false;
  private CodingPane mainPane;

  public ScriptPanel(CodingPane codePane)
  {
	mainPane = codePane;
    this.self = this;
    setLayout(new BorderLayout(0, 0));

    this.textArea = new RSyntaxTextArea(20, 60);
    this.textArea.setSyntaxEditingStyle(SyntaxConstants.SYNTAX_STYLE_JAVASCRIPT);
    this.textArea.setCodeFoldingEnabled(true);
    this.textArea.setAntiAliasingEnabled(true);
    this.textArea.setMarkOccurrences(true);
        
    this.textArea.addKeyListener(new KeyListener(){
        @Override
        public void keyPressed(KeyEvent e){
            if(e.getKeyCode() == KeyEvent.VK_CONTROL){
            	//System.out.println("Add listener");
            	if (textArea.getMouseWheelListeners().length == 0) {
	            	textArea.addMouseWheelListener( new MouseWheelListener() {					
						@Override
						public void mouseWheelMoved(MouseWheelEvent e) {
							if (e.isControlDown()) {
						    	  if (e.getWheelRotation() < 0)
						    		  textArea.setFont(new Font("Consolas", Font.PLAIN, textArea.getFont().getSize() + 1));
						    	  else
						    		  textArea.setFont(new Font("Consolas", Font.PLAIN, textArea.getFont().getSize() - 1));
						    }
						}
					});
            	}
            }
        }

        @Override
        public void keyTyped(KeyEvent e) {
        }

        @Override
        public void keyReleased(KeyEvent e) {
        	if (e.getKeyCode() == KeyEvent.VK_CONTROL) {
        		//System.out.println("Remove listener");
        		if (textArea.getMouseWheelListeners().length > 0)
        			textArea.removeMouseWheelListener(textArea.getMouseWheelListeners()[0]);
        	}
        }
    });
    
    try {
    	RhinoJavaScriptLanguageSupport support1 = new RhinoJavaScriptLanguageSupport();
    	JarManager jarManager = support1.getJarManager();
    	jarManager.addCurrentJreClassFileSource();
    
    	//add additional libraries and classes
    	//jarManager.addClassFileSource(new JarLibraryInfo("c:/workspace/client.jar"));
    	ZipSourceLocation zpsrc = new ZipSourceLocation("lib/clientsrc.jar");
    	JarLibraryInfo lib = new JarLibraryInfo("lib/client.jar");
    	lib.setSourceLocation((SourceLocation)zpsrc);
    	jarManager.addClassFileSource(lib);
    	support1.install(textArea);
    	
    } catch(Exception e) {
    	e.printStackTrace();
    }
    LanguageSupportFactory.get().register(this.textArea);
    
    
    DocumentListener local1 = new DocumentListener() {
      public void changedUpdate(DocumentEvent paramAnonymousDocumentEvent) {
        /*ScriptPanel.this.btnSave.setEnabled(!ScriptPanel.this.textArea.getText().isEmpty());
        ScriptPanel.this.btnFind.setEnabled(ScriptPanel.this.btnSave.isEnabled());
        ScriptPanel.this.btnRun.setEnabled((ScriptPanel.this.btnSave.isEnabled()) && (!ScriptPanel.this.btnRun.getActionCommand().equals("RUN_SCRIPT")));*/
        //System.out.println("script was changed");
      }

      public void insertUpdate(DocumentEvent paramAnonymousDocumentEvent)
      {
        //System.out.println("script was inserted");
        if (scriptOpenned)
          scriptChanged = true;
      }

      public void removeUpdate(DocumentEvent paramAnonymousDocumentEvent)
      {
        if (scriptOpenned)
          scriptChanged = true;
        //System.out.println("script was removed");
      }
    };
    this.textArea.getDocument().addDocumentListener(local1);

    RTextScrollPane localRTextScrollPane = new RTextScrollPane(this.textArea);
    localRTextScrollPane.setFoldIndicatorEnabled(true);
    //localRTextScrollPane.setWheelScrollingEnabled(true);
    add(localRTextScrollPane, "Center");
    addFindReplace(this.self);
    this.toolBar.setVisible(mainPane.getSearchEnable());
  }

  public RSyntaxTextArea getTextArea() {
    return this.textArea;
  }
  public String getSource() {
    return this.textArea.getText();
  }
  public void setActionSave(JButton paramJButton) {
    this.btnSave = paramJButton;
  }
  public void setActionFind(JButton paramJButton) {
    this.btnFind = paramJButton;
    this.btnFind.addActionListener(new ActionListener() {
      public void actionPerformed(ActionEvent paramAnonymousActionEvent) {
        ScriptPanel.this.toolBar.setVisible(!ScriptPanel.this.toolBar.isVisible());
      } } );
  }

  public void setActionRun(JButton paramJButton) {
    this.btnRun = paramJButton;
  }
  public void setPath(String paramString) {
    this.path = new String(paramString);
  }
  public String getPath() {
    return this.path;
  }
  public Object getTreePath() {
    return treePath;
  }
  public void setTreePath(Object path) {
    treePath = path;
  }
  public void setFileName(String paramString) {
    this.fileName = new String(paramString);
    String extension = "";
    int i = fileName.lastIndexOf('.');
    if (i > 0) {
      extension = fileName.substring(i+1);
      changeSyntaxStyleByFileExt(extension);
    }
  }

  public void textLoaded() {
    scriptOpenned = true;
  }

  public boolean isTextChanged() {
    return scriptChanged;
  }

  public void changeSyntaxStyleByFileExt(String fileExt) {
    if (fileExt.equalsIgnoreCase("java"))
      this.textArea.setSyntaxEditingStyle(SyntaxConstants.SYNTAX_STYLE_JAVA);
    if (fileExt.equalsIgnoreCase("js"))
      this.textArea.setSyntaxEditingStyle(SyntaxConstants.SYNTAX_STYLE_JAVASCRIPT);
    if (fileExt.equalsIgnoreCase("xml"))
      this.textArea.setSyntaxEditingStyle(SyntaxConstants.SYNTAX_STYLE_XML);
  }

  public String getFileName() {    
    return this.fileName;
  }

  private void addFindReplace(JPanel paramJPanel) {
    this.toolBar = new JToolBar();
    this.searchField = new JTextField(30);
    this.toolBar.add(this.searchField);
    final JButton localJButton1 = new JButton("Find next");
    localJButton1.setActionCommand("FindNext");
    
    Action actionFind = new AbstractAction("") {

        @Override
        public void actionPerformed(ActionEvent e) {
        	localJButton1.doClick();
        }

    };
    
    Action actionBeautify = new AbstractAction("") {
        @Override
        public void actionPerformed(ActionEvent e) {
        	//System.out.println("Beautify invoke");
        	textArea.setText(new EScriptRunner().beautify(textArea.getText()));
        }

    };
    
    actionFind.putValue(Action.ACCELERATOR_KEY, KeyStroke.getKeyStroke("F3"));
    
    actionBeautify.putValue(Action.ACCELERATOR_KEY,  KeyStroke.getKeyStroke("control B"));
    
    ActionListener local3 = new ActionListener()
    {
      public void actionPerformed(ActionEvent paramAnonymousActionEvent) {
        String str1 = paramAnonymousActionEvent.getActionCommand();
        boolean bool1 = "FindNext".equals(str1);

        SearchContext localSearchContext = new SearchContext();
        String str2 = ScriptPanel.this.searchField.getText();
        if (str2.length() == 0) {
          return;
        }
        localSearchContext.setSearchFor(str2);
        localSearchContext.setMatchCase(ScriptPanel.this.matchCaseCB.isSelected());
        localSearchContext.setRegularExpression(ScriptPanel.this.regexCB.isSelected());
        localSearchContext.setSearchForward(bool1);
        localSearchContext.setWholeWord(false);

        //boolean bool2 = SearchEngine.find(ScriptPanel.this.textArea, localSearchContext);
        SearchResult searchRes = SearchEngine.find(textArea, localSearchContext);
        if (!searchRes.wasFound())
        	JOptionPane.showMessageDialog(null, "Ничего не найдено");
        //if (!bool2)
        //  JOptionPane.showMessageDialog(ScriptPanel.this.textArea, "Ð¢ÐµÐºÑÑ‚ Ð½Ðµ Ð½Ð°Ð¹Ð´ÐµÐ½");
      }
    };
    localJButton1.addActionListener(local3);
    this.toolBar.add(localJButton1);
    this.searchField.addActionListener(new ActionListener() {
      public void actionPerformed(ActionEvent paramAnonymousActionEvent) {
        localJButton1.doClick(0);
      }
    });
    JButton localJButton2 = new JButton("Find prev");
    localJButton2.setActionCommand("FindPrev");
    localJButton2.addActionListener(local3);
    this.toolBar.add(localJButton2);
    this.regexCB = new JCheckBox("Regex");
    this.toolBar.add(this.regexCB);
    this.matchCaseCB = new JCheckBox("Match Case");
    this.toolBar.add(this.matchCaseCB);
    
    
    Action action = new AbstractAction(" X ") {

        @Override
        public void actionPerformed(ActionEvent e) {
        	if (toolBar.isVisible()) {
        		toolBar.setVisible(false);
        	} else {
        		toolBar.setVisible(true);
        		//System.out.println("SHowing search panel");
        	}
        	mainPane.setSearchEnable(toolBar.isVisible());
        }

    };
    
    // configure the Action with the accelerator (aka: short cut)
    action.putValue(Action.ACCELERATOR_KEY, KeyStroke.getKeyStroke("control F"));
    
    this.getActionMap().put("myAction", action);
    this.getInputMap(JComponent.WHEN_ANCESTOR_OF_FOCUSED_COMPONENT).put(
            (KeyStroke) action.getValue(Action.ACCELERATOR_KEY), "myAction");
        
    this.getActionMap().put("actionFind", actionFind);
    this.getInputMap(JComponent.WHEN_ANCESTOR_OF_FOCUSED_COMPONENT).put(
            (KeyStroke) actionFind.getValue(Action.ACCELERATOR_KEY), "actionFind");
    
    this.getActionMap().put("actionBeauty", actionBeautify);
    this.getInputMap(JComponent.WHEN_ANCESTOR_OF_FOCUSED_COMPONENT).put(
            (KeyStroke) actionBeautify.getValue(Action.ACCELERATOR_KEY), "actionBeauty");
    
    // create a button, configured with the Action
    JButton localJButton3 = new JButton(action);
    // manually register the accelerator in the button's component input map
    localJButton3.getActionMap().put("myAction", action);
    localJButton3.getInputMap(JComponent.WHEN_ANCESTOR_OF_FOCUSED_COMPONENT).put(
            (KeyStroke) action.getValue(Action.ACCELERATOR_KEY), "myAction");    
    localJButton3.setBorder(BorderFactory.createEtchedBorder());
    localJButton3.setBorderPainted(true);
    //localJButton3.addActionListener(new ActionListener() {
    //  public void actionPerformed(ActionEvent paramAnonymousActionEvent) {
    //	  toolBar.setVisible(false);
    //  }
    //});
    this.toolBar.add(localJButton3);
    paramJPanel.add(this.toolBar, "North");
  }

  public void setScheme(String schemeName) {
    try {
      Theme theme = Theme.load(getClass().getResourceAsStream("scheme/" + schemeName));
      theme.apply(this.textArea);
    } catch (IOException ioe) {
      ioe.printStackTrace();
    }
  }

  public void saveDataToFile() {
    try {
      BufferedWriter bfWriter = new BufferedWriter(new FileWriter(new File(this.path)));
      BufferedReader bfReader = new BufferedReader(new StringReader(this.textArea.getText()));
      String str2;
      while ((str2 = bfReader.readLine()) != null) {
        bfWriter.write(str2);
        bfWriter.newLine();
      }
      bfWriter.close();      
    } catch (Exception localException2) {
    }
    //scriptChanged = false;
  }
}