/*
 * Created by SharpDevelop.
 * User: DovnarDmitriy
 * Date: 20.06.2014
 * Time: 17:44
 * 
 * To change this template use Tools | Options | Coding | Edit Standard Headers.
 */
using System;
using System.Windows.Forms;
using System.Diagnostics;

namespace TestLaunchJar
{
	/// <summary>
	/// Class with program entry point.
	/// </summary>
	internal sealed class Program
	{
		/// <summary>
		private static string GetJavaInstallationPath()
		{
		    string environmentPath = Environment.GetEnvironmentVariable("JAVA_HOME");
		    if (!string.IsNullOrEmpty(environmentPath))
		    {
		       return environmentPath;
		    }
		
		    string javaKey = "SOFTWARE\\JavaSoft\\Java Runtime Environment\\";
		    using (Microsoft.Win32.RegistryKey rk = Microsoft.Win32.Registry.LocalMachine.OpenSubKey(javaKey))
		    {
		        string currentVersion = rk.GetValue("CurrentVersion").ToString();
		        using (Microsoft.Win32.RegistryKey key = rk.OpenSubKey(currentVersion))
		        {
		            return key.GetValue("JavaHome").ToString();
		        }
		    }
		}
		/// </summary>
		[STAThread]
		private static void Main(string[] args)
		{
			//Application.EnableVisualStyles();
		//	Application.SetCompatibleTextRenderingDefault(false);
			//Application.Run(new MainForm());
			if (System.IO.File.Exists("run.bat")) {
				ProcessStartInfo mcStartInfo = new ProcessStartInfo("run.bat");
		        Process.Start(mcStartInfo);
			} else {
				string installPath = GetJavaInstallationPath();
				string filePath = System.IO.Path.Combine(installPath, "bin\\javaw.exe");
				if (System.IO.File.Exists(filePath))
				{
				    string appData = Environment.GetFolderPath(Environment.SpecialFolder.ApplicationData);
					string h = "-cp \".;lib/log4j.jar;./lib/autocomplete.jar;./lib/rsyntaxtextarea.jar;./lib/Siebel.jar;./lib/SiebelJI_rus.jar;./lib/rstalangsupp.jar;./lib/quaqua.jar;./lib/js-14.jar;SiebelStudio.jar\" side.AppMain";
		            //ProcessStartInfo mcStartInfo = new ProcessStartInfo("javaw.exe", h);
		            ProcessStartInfo mcStartInfo = new ProcessStartInfo(filePath, h);
		            Process.Start(mcStartInfo);
				} else {
					MessageBox.Show("Java not found", "JRE Error", 
	    				MessageBoxButtons.OK, MessageBoxIcon.Error);
				}
			}
		}
		
	}
}
