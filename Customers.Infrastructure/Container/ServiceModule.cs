using Autofac;
using System.Linq;

namespace Customers.Infrastructure.Container
{
    //commentary:
    //we register domain services by the following convention: any class that resides in a Component namespace,
    //and has interfaces which are found in the Services namespace, will expose those interfaces as injectable dependencies
    //with a scoped lifetime
    public class ServiceModule : Module
    {
        public AssemblyRegistry Assemblies { get; set; }

        protected override void Load(ContainerBuilder builder)
        {
            builder.RegisterAssemblyTypes(Assemblies.ToArray())
                  .Where(c => (c.Namespace?.EndsWith("Components")).GetValueOrDefault() && c.GetInterfaces().Any(t => (t.Namespace?.EndsWith("Services")).GetValueOrDefault()))
                  .As(c => c.GetInterfaces().Where(t => (t.Namespace?.EndsWith("Services")).GetValueOrDefault()))
                  .PropertiesAutowired()
                  .InstancePerLifetimeScope();
        }
    }
}
