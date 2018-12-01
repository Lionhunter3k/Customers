using Autofac;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;

namespace Infrastructure.Container
{
    //commentary:
    //we register domain services by the following convention: any class that resides in a Component namespace,
    //and has interfaces which are found in the Services namespace, will expose those interfaces as injectable dependencies
    //with a scoped lifetime
    public class ServiceModule : Autofac.Module
    {
        public IReadOnlyCollection<Assembly> Assemblies { get; set; }

        protected override void Load(ContainerBuilder builder)
        {
            var assembliesToLoad = new HashSet<Assembly>(Assemblies)
            {
                typeof(ServiceModule).Assembly
            };
            builder.RegisterAssemblyTypes(assembliesToLoad.ToArray())
                  .Where(c => (c.Namespace?.EndsWith("Components")).GetValueOrDefault() && c.GetInterfaces().Any(t => (t.Namespace?.EndsWith("Services")).GetValueOrDefault()))
                  .As(c => c.GetInterfaces().Where(t => (t.Namespace?.EndsWith("Services")).GetValueOrDefault()))
                  .PropertiesAutowired()
                  .InstancePerLifetimeScope();
        }
    }
}
