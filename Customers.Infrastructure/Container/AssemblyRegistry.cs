using System;
using System.Collections;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Reflection;
using System.Text;

namespace Customers.Infrastructure.Container
{
    public class AssemblyRegistry : IReadOnlyCollection<Assembly>
    {
        public string RootPath { get; set; }

        private readonly HashSet<Assembly> _assemblies = new HashSet<Assembly>();

        public ISet<string> AssemblyNames { get; } = new HashSet<string>();

        public AssemblyRegistry AddAssemblyFor<TObject>()
        {
            var assembly = typeof(TObject).Assembly;
            _assemblies.Add(assembly);
            return this;
        }

        public IEnumerator<Assembly> GetEnumerator()
        {
            return RegisteredAssemblies.GetEnumerator();
        }

        IEnumerator IEnumerable.GetEnumerator()
        {
            return RegisteredAssemblies.GetEnumerator();
        }

        private IReadOnlyCollection<Assembly> RegisteredAssemblies
        {
            get
            {
                foreach (var assemblyName in AssemblyNames.Except(_assemblies.Select(q => q.FullName)))
                {
                    _assemblies.Add(Assembly.LoadFrom(RootPath != null ? Path.Combine(RootPath, assemblyName) : assemblyName));
                }
                return _assemblies;
            }
        }

        public int Count => RegisteredAssemblies.Count;
    }
}
