package side;

import java.awt.Component;
import java.awt.Dimension;
import java.awt.Graphics;
import java.awt.Graphics2D;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;
import java.awt.event.MouseEvent;
import java.awt.event.MouseListener;
import javax.swing.AbstractButton;
import javax.swing.BorderFactory;
import javax.swing.ImageIcon;
import javax.swing.JButton;
import javax.swing.JTabbedPane;
import javax.swing.plaf.basic.BasicButtonUI;

public class ButtonX extends JButton
  implements MouseListener
{
  JTabbedPane panel;
  PanelTab btc;
  int tipo;
  ActionListener customActListener;
  ActionListener customActBeforeCloseListener = null;

  public ButtonX(JTabbedPane paramJTabbedPane, PanelTab paramPanelTab, int paramInt)
  {
    this.panel = paramJTabbedPane;
    this.btc = paramPanelTab;
    this.tipo = paramInt;

    int i = 17;
    setPreferredSize(new Dimension(i, i));
    setToolTipText("Close");
    setUI(new BasicButtonUI());
    setContentAreaFilled(false);
    setFocusable(false);
    setBorder(BorderFactory.createEtchedBorder());
    setBorderPainted(false);
    addMouseListener(this);
    setRolloverEnabled(true);
    addActionListener(new ActionListener() {
      public void actionPerformed(ActionEvent paramAnonymousActionEvent) {
        int i = ButtonX.this.panel.indexOfTabComponent(ButtonX.this.btc);
        if (i != -1) {
          if (customActBeforeCloseListener != null)
            customActBeforeCloseListener.actionPerformed(null);

          ButtonX.this.panel.remove(i);
        }
        if (customActListener != null)
          customActListener.actionPerformed(null);
      } } );
  }

  public void updateUI() {
  }

  public void setCustomActionListener(ActionListener custAct) {
    customActListener = custAct;
  }

  public void setCustomActionBeforeCloseListener(ActionListener custAct) {
    customActBeforeCloseListener = custAct;
  }

  protected void paintComponent(Graphics paramGraphics) { super.paintComponent(paramGraphics);
    Graphics2D localGraphics2D = (Graphics2D)paramGraphics.create();

    ImageIcon localImageIcon = new ImageIcon(getClass().getResource("images/regular.JPG"));
    localGraphics2D.drawImage(localImageIcon.getImage(), 1, 1, 14, 14, this);
    localGraphics2D.dispose(); }

  public void mouseClicked(MouseEvent paramMouseEvent) {
  }

  public void mouseEntered(MouseEvent paramMouseEvent) {
    Component localComponent = paramMouseEvent.getComponent();
    if ((localComponent instanceof AbstractButton)) {
      AbstractButton localAbstractButton = (AbstractButton)localComponent;
      localAbstractButton.setBorderPainted(true);
    }
  }

  public void mouseExited(MouseEvent paramMouseEvent) { Component localComponent = paramMouseEvent.getComponent();
    if ((localComponent instanceof AbstractButton)) {
      AbstractButton localAbstractButton = (AbstractButton)localComponent;
      localAbstractButton.setBorderPainted(false);
    }
  }

  public void mousePressed(MouseEvent paramMouseEvent)
  {
  }

  public void mouseReleased(MouseEvent paramMouseEvent)
  {
  }
}