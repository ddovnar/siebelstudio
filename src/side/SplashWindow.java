package side;
import java.awt.BorderLayout;
import java.awt.Color;
import java.awt.Dimension;
import java.awt.Toolkit;
 
import javax.swing.JFrame;
import javax.swing.JLabel;
import javax.swing.JPanel;
import javax.swing.ImageIcon;
 
public class SplashWindow extends JFrame { 
	private static final long serialVersionUID = 439647003470337160L;	 
	private JPanel simplePanel;	 
	private JLabel statusLabel;
	 
	private void initComponents() {
		this.getRootPane().setLayout(new BorderLayout());
		this.getRootPane().add(this.getSimplePanel(), BorderLayout.CENTER);
		this.getRootPane().add(this.getStatusLabel(), BorderLayout.SOUTH);
	}
 
	public SplashWindow() {
		super("Siebel Studio");
		this.setIconImage(new ImageIcon(getClass().getResource("images/sbl.png")).getImage());
		this.setLocationRelativeTo(null);
		this.setDefaultCloseOperation(JFrame.DISPOSE_ON_CLOSE);
		this.setAlwaysOnTop(true);
		this.setUndecorated(true);
		this.setPreferredSize(new Dimension(450, 300));
		this.setSize(this.getPreferredSize());
		 
		Toolkit toolkit = Toolkit.getDefaultToolkit();
		Dimension screenSize = toolkit.getScreenSize();
		int x = (screenSize.width - this.getWidth()) / 2;
		int y = (screenSize.height - this.getHeight()) / 2;
		this.setLocation(x, y);
		 
		this.initComponents();
	}
 
	public synchronized JLabel getStatusLabel() {
		if (this.statusLabel == null) {
			this.statusLabel = new JLabel("Status: ");
		}
		return this.statusLabel;
	}
 
	public synchronized JPanel getSimplePanel() {
		if (this.simplePanel == null) {
			this.simplePanel = new JPanel();
			this.simplePanel.add(new JLabel(new ImageIcon(getClass().getResource("images/splash.png"))));
			//this.simplePanel.setBackground(Color.GREEN);
		}
		return this.simplePanel;
	}
}