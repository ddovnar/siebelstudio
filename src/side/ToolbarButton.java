package side;

import java.awt.Component;
import java.awt.Graphics;
import java.awt.Image;
import java.awt.Insets;
import java.awt.event.MouseEvent;
import java.awt.event.MouseListener;
import java.awt.image.BufferedImage;
import javax.swing.AbstractButton;
import javax.swing.BorderFactory;
import javax.swing.Icon;
import javax.swing.ImageIcon;
import javax.swing.JButton;

public class ToolbarButton extends JButton
  implements MouseListener
{
  private static final long serialVersionUID = 1309836334029006340L;
  private static final Insets margins = new Insets(0, 0, 0, 0);
  private boolean ms = false;

  public ToolbarButton(Icon paramIcon) {
    super(paramIcon);
    setMargin(margins);
    setVerticalTextPosition(3);
    setHorizontalTextPosition(0);
    setBorderPainted(false);
    setFocusable(false);
    setBorder(BorderFactory.createEtchedBorder());
    setContentAreaFilled(false);
    addMouseListener(this);
    setRolloverEnabled(true);
    setOpaque(false);
  }

  public ToolbarButton(String paramString1, String paramString2)
  {
    this(new ImageIcon(paramString1));
    setText(paramString2);
  }
  public ToolbarButton(String paramString) {
    setText(paramString);
    setSize(10, 10);
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
    } }

  public void mousePressed(MouseEvent paramMouseEvent) {
    this.ms = true;
  }
  public void mouseReleased(MouseEvent paramMouseEvent) {
    this.ms = false;
  }
  public void mouseClicked(MouseEvent paramMouseEvent) {
  }

  public void paintComponent(Graphics paramGraphics) {
    if (this.ms) {
      Image localImage = ((ImageIcon)getIcon()).getImage();
      int i = localImage.getWidth(null);
      int j = localImage.getHeight(null);

      BufferedImage localBufferedImage = new BufferedImage(i, j, 6);
      localBufferedImage.getGraphics().drawImage(localImage, 0, 0, null);

      paramGraphics.drawImage(localBufferedImage, 1, 1, i, j, null);
    } else {
      super.paintComponent(paramGraphics);
    }
  }
}