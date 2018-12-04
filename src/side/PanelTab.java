package side;

import java.awt.FlowLayout;
import java.awt.event.ActionListener;
import javax.swing.BorderFactory;
import javax.swing.Icon;
import javax.swing.ImageIcon;
import javax.swing.JLabel;
import javax.swing.JPanel;
import javax.swing.JTabbedPane;

public class PanelTab extends JPanel
{
  private static final long serialVersionUID = -4703487362993286474L;
  JTabbedPane tabpane;
  int tipo;

  public PanelTab(JTabbedPane paramJTabbedPane, int paramInt, ActionListener closeTab, ActionListener beforeCloseTab)
  {
    setLayout(new FlowLayout(0, 0, 0));
    if (paramJTabbedPane != null) {
      this.tabpane = paramJTabbedPane;
      this.tipo = paramInt;
      setOpaque(false);
      JLabel local1 = new JLabel(new ImageIcon("res\\document.png")) {
        public String getText() {
          int i = PanelTab.this.tabpane.indexOfTabComponent(PanelTab.this);
          if (i != -1) {
            return PanelTab.this.tabpane.getTitleAt(i);
          }
          return null;
        }
      };
      add(local1);
      local1.setBorder(BorderFactory.createEmptyBorder(0, 0, 0, 5));
      ButtonX localButtonX = new ButtonX(this.tabpane, this, this.tipo);
      add(localButtonX);
      localButtonX.setCustomActionBeforeCloseListener(beforeCloseTab);
      localButtonX.setCustomActionListener(closeTab);
      setBorder(BorderFactory.createEmptyBorder(2, 0, 0, 0));
    }
  }
}