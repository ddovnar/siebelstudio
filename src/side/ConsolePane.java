package side;

import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;
import java.io.OutputStream;
import java.io.PrintStream;
import javax.swing.GroupLayout;
import javax.swing.GroupLayout.Alignment;
import javax.swing.GroupLayout.ParallelGroup;
import javax.swing.GroupLayout.SequentialGroup;
import javax.swing.ImageIcon;
import javax.swing.JPanel;
import javax.swing.JScrollPane;
import javax.swing.JTextArea;
import javax.swing.JToolBar;

public class ConsolePane extends JPanel
  implements ActionListener
{
  private static final long serialVersionUID = -4079765017374664840L;
  private JTextArea consoleArea;
  private ToolbarButton btnStop;

  public ConsolePane(ActionListener paramActionListener)
  {
    JToolBar localJToolBar = new JToolBar();
    localJToolBar.setFloatable(false);

    ToolbarButton localToolbarButton = new ToolbarButton(new ImageIcon(getClass().getResource("images/edit_clear.png")));
    localToolbarButton.addActionListener(this);
    localToolbarButton.setActionCommand("CLEAR");
    localToolbarButton.setToolTipText("Clear console");
    localJToolBar.add(localToolbarButton);

    this.btnStop = new ToolbarButton(new ImageIcon(getClass().getResource("images/stop_red.png")));
    if (paramActionListener == null)
      paramActionListener = this;
    this.btnStop.addActionListener(paramActionListener);
    this.btnStop.setActionCommand("STOP");
    this.btnStop.setToolTipText("Stop executing");
    this.btnStop.setEnabled(false);
    localJToolBar.add(this.btnStop);

    JScrollPane localJScrollPane = new JScrollPane();
    GroupLayout localGroupLayout = new GroupLayout(this);
    localGroupLayout.setHorizontalGroup(localGroupLayout.createParallelGroup(GroupLayout.Alignment.LEADING).addComponent(localJToolBar, -1, 450, 32767).addComponent(localJScrollPane, -1, 450, 32767));

    localGroupLayout.setVerticalGroup(localGroupLayout.createParallelGroup(GroupLayout.Alignment.LEADING).addGroup(localGroupLayout.createSequentialGroup().addComponent(localJToolBar, -2, -1, -2).addGap(1).addComponent(localJScrollPane, -1, 287, 32767)));

    this.consoleArea = new JTextArea();
    this.consoleArea.setEditable(false);
    localJScrollPane.setViewportView(this.consoleArea);
    setLayout(localGroupLayout);

    PrintStream localPrintStream = new PrintStream(new OutputStream()
    {
      public void write(int paramAnonymousInt) {
      }

      public void write(byte[] paramAnonymousArrayOfByte, int paramAnonymousInt1, int paramAnonymousInt2) {
        ConsolePane.this.consoleArea.append(new String(paramAnonymousArrayOfByte, paramAnonymousInt1, paramAnonymousInt2));
      }
    });
    System.setOut(localPrintStream);
    // display errors in console pane
    System.setErr(localPrintStream);
  }

  public void actionPerformed(ActionEvent paramActionEvent) {
    String str = paramActionEvent.getActionCommand();
    if (str.equals("CLEAR"))
    {
      this.consoleArea.setText("");
    } else if (str.equals("STOP"))
      System.out.println("default STOP");
  }

  public ToolbarButton getBtnStop()
  {
    return this.btnStop;
  }

  public void clearConsole() {
    this.consoleArea.setText("");
  }
}