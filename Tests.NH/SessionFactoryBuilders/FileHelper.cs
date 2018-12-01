using System;
using System.Collections.Generic;
using System.IO;
using System.Text;

namespace Tests.NH.SessionFactoryBuilders
{
    public class FileHelper
    {
        private string _extension;

        public FileHelper()
        {
            this._extension = "db";
        }

        public FileHelper(string extension)
        {
            this._extension = extension;
        }

        public string GetDbFileName()
        {
            var path = Path.GetFullPath(Path.GetRandomFileName() + "." + _extension);
            return !File.Exists(path) ? path : GetDbFileName();
        }

        public void DeletePreviousDbFiles()
        {
            var files = Directory.GetFiles(".", "*." + _extension + "*");
            foreach (var file in files)
            {
                File.Delete(file);
            }
        }
    }
}
