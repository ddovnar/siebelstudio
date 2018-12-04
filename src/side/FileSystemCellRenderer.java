package side;

import java.io.File;

import java.awt.*;

import javax.swing.*;
import javax.swing.tree.*;

public class FileSystemCellRenderer extends DefaultTreeCellRenderer {
	public FileSystemCellRenderer() {
		super();
	}

	@Override
    public Component getTreeCellRendererComponent(JTree tree, Object value, boolean sel, boolean expanded, boolean leaf, int row,
            boolean hasFocus) {
        super.getTreeCellRendererComponent(tree, value, sel, expanded, leaf, row, hasFocus);
        if (value instanceof DefaultMutableTreeNode) {
            DefaultMutableTreeNode node = (DefaultMutableTreeNode) value;
            if (node.getUserObject() instanceof File) {
                File file = (File) node.getUserObject();
                setText(file.getName());
                if (file.isDirectory())
                	setIcon(new ImageIcon(getClass().getResource("images/folder.png")));
                else if (getFileExt(file.getName()).equals("es"))
                    setIcon(new ImageIcon(getClass().getResource("images/sourceEditor.gif")));
                else if (getFileExt(file.getName()).equals("cfg"))
                    setIcon(new ImageIcon(getClass().getResource("images/file_text.gif")));
                else
                	setIcon(new ImageIcon(getClass().getResource("images/file.png")));
            }
        }
        return this;
    }

    public String getFileExt(String fileName) {
        String extension = "";
        int i = fileName.lastIndexOf('.');
        if (i > 0) {
            extension = fileName.substring(i+1);
        }
        return extension;
    }
}