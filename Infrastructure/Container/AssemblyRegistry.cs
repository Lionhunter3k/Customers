using System;
using System.Collections;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Reflection;
using System.Text;

namespace Infrastructure.Container
{
    public class AssemblyRegistry
    {
        public AssemblyRegistry()
        {
            _assemblies.Add(Assembly.GetCallingAssembly());
        }

        private readonly HashSet<Assembly> _assemblies = new HashSet<Assembly>();

        public IEnumerable<Assembly> LoadedAssemblies { get => _assemblies; }

        public ISet<string> AssemblyPaths { get; } = new HashSet<string>();

        public AssemblyRegistry AddAssemblyFor<TObject>()
        {
            var assembly = typeof(TObject).Assembly;
            _assemblies.Add(assembly);
            return this;
        }

        private static bool IsFullPath(string path)
        {
            return !String.IsNullOrWhiteSpace(path)
                && path.IndexOfAny(System.IO.Path.GetInvalidPathChars().ToArray()) == -1
                && Path.IsPathRooted(path)
                && !Path.GetPathRoot(path).Equals(Path.DirectorySeparatorChar.ToString(), StringComparison.Ordinal);
        }

        public IReadOnlyCollection<Assembly> GetRegisteredAssemblies(string rootPath)
        {
            foreach (var assemblyPath in AssemblyPaths)
            {
                if(IsFullPath(assemblyPath))
                    _assemblies.Add(Assembly.LoadFrom(assemblyPath));
                else
                    _assemblies.Add(Assembly.LoadFrom(Path.Combine(rootPath, assemblyPath)));
            }
            return _assemblies;
        }
    }
}
