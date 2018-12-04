package side;

import java.io.File;
import java.util.Iterator;
import java.util.Vector;
import javax.swing.event.TreeModelEvent;
import javax.swing.event.TreeModelListener;
import javax.swing.tree.TreeModel;
import javax.swing.tree.TreePath;
import javax.swing.tree.DefaultMutableTreeNode;

public class FileSystemModel implements TreeModel {
	private File root;
	private Vector listeners = new Vector();

	public FileSystemModel(File rootDirectory) {
		root = rootDirectory;
	}

	public Object getRoot() {
		return root;
	}

	public Object getChild(Object parent, int index) {
		File directory = (File) parent;
		String[] children = directory.list();
		return new TreeFile(directory, children[index]);
	}

	public int getChildCount(Object parent) {
		File file = (File) parent;
		if (file.isDirectory()) {
			String[] fileList = file.list();
			if (fileList != null)
				return file.list().length;
		}
		return 0;
	}

	public boolean isLeaf(Object node) {
		File file = (File) node;
		return file.isFile();
	}

	public int getIndexOfChild(Object parent, Object child) {
		File directory = (File) parent;
		File file = (File) child;
		String[] children = directory.list();
		for (int i = 0; i < children.length; i++) {
			if (file.getName().equals(children[i])) {
				return i;
			}
		}
		return -1;
	}

	public void valueForPathChanged(TreePath path, Object value) {
		File oldFile = (File) path.getLastPathComponent();
		String fileParentPath = oldFile.getParent();
		String newFileName = (String) value;
		File targetFile = new File(fileParentPath, newFileName);
		oldFile.renameTo(targetFile);
		File parent = new File(fileParentPath);
		int[] changedChildrenIndices = {getIndexOfChild(parent, targetFile)};
		Object[] changedChildren = {targetFile};
		fireTreeNodesChanged(path.getParentPath(), changedChildrenIndices, changedChildren);
	}

	private void fireTreeNodesChanged(TreePath parentPath, int[] indices, Object[] children) {
		TreeModelEvent event = new TreeModelEvent(this, parentPath, indices, children);
		Iterator iterator = listeners.iterator();
		TreeModelListener listener = null;
		while(iterator.hasNext()) {
			listener = (TreeModelListener) iterator.next();
			listener.treeNodesChanged(event);
		}
	}

	public void fireTreeNodesInserted (TreeModelEvent event) {
		for (Iterator i = listeners.iterator(); i.hasNext();) {
			TreeModelListener listener = (TreeModelListener) i.next();
			listener.treeNodesInserted (event);
		}
	}

  
	public void fireTreeNodesRemoved (TreeModelEvent event) {
		for (Iterator i = listeners.iterator(); i.hasNext();) {
			TreeModelListener listener = (TreeModelListener) i.next();
			listener.treeNodesRemoved (event);
		}
	}

  
	public void fireTreeStructureChanged (TreeModelEvent event) {
		for (Iterator i = listeners.iterator(); i.hasNext();) {
			TreeModelListener listener = (TreeModelListener) i.next();
			listener.treeStructureChanged (event);
		}
	}

	public void  removeNodeFromParent(Object node) {
		//System.out.println(node);
		((TreeFile)node).delete();
        /*TreeFile parent = (TreeFile)node.getParent();

        if(parent == null)
            throw new IllegalArgumentException("node does not have a parent.");

        int[]    childIndex = new int[1];
        Object[] removedArray = new Object[1];

        childIndex[0] = parent.getIndex(node);
        parent.remove(childIndex[0]);
        removedArray[0] = node;
        nodesWereRemoved(parent, childIndex, removedArray);*/
    }

	public void addTreeModelListener(TreeModelListener listener) {
		listeners.add(listener);
	}

	public void removeTreeModelListener(TreeModelListener listener) {
		listeners.remove(listener);
	}

	private class TreeFile extends File {
		public TreeFile(File parent, String child) {
			super(parent, child);
		}

		public String toString() {
			return getName();
		}
	}

	public static DefaultMutableTreeNode createTreeModel(File file, boolean recursive) {
        DefaultMutableTreeNode node = new DefaultMutableTreeNode(file);
        if (file.isDirectory() && recursive) {
            File[] children = file.listFiles(); // list all the files in the directory
            if (children != null) {
                for (File f : children) { // loop through each
                    node.add(createTreeModel(f, recursive));
                }
            }
        }
        return node;
    }
}