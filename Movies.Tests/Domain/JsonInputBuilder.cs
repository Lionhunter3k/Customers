using System;
using System.Collections.Generic;
using System.IO;
using System.Reflection;
using System.Text;

namespace Movies.Tests.Domain
{
    public static class JsonInputBuilder
    {
        private static string AssemblyDirectory
        {
            get
            {
                string codeBase = Assembly.GetExecutingAssembly().CodeBase;
                UriBuilder uri = new UriBuilder(codeBase);
                string path = Uri.UnescapeDataString(uri.Path);
                return Path.GetDirectoryName(path);
            }
        }

        public static Stream OpenJsonFile(string filename)
        {
            return File.OpenRead(Path.Combine(AssemblyDirectory, filename));
        }
    }
}
