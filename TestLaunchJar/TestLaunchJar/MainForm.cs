/*
 * Created by SharpDevelop.
 * User: DovnarDmitriy
 * Date: 20.06.2014
 * Time: 17:44
 * 
 * To change this template use Tools | Options | Coding | Edit Standard Headers.
 */
using System;
using System.Collections.Generic;
using System.Drawing;
using System.Windows.Forms;
using System.Diagnostics;

namespace TestLaunchJar
{
	/// <summary>
	/// Description of MainForm.
	/// </summary>
	public partial class MainForm : Form
	{
		public MainForm()
		{
			//
			// The InitializeComponent() call is required for Windows Forms designer support.
			//
			InitializeComponent();
			
			string appData = Environment.GetFolderPath(Environment.SpecialFolder.ApplicationData);
            ProcessStartInfo mcStartInfo = new ProcessStartInfo("cmd", "dir ");
            Process.Start(mcStartInfo);
            this.Close();
		}
	}
}
