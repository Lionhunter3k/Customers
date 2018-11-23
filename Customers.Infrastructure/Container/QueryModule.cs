using Autofac;
using Autofac.Features.Variance;
using Customers.Infrastructure.Queries;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace Customers.Infrastructure.Container
{
    public class QueryModule : Module
    {
        public AssemblyRegistry Assemblies { get; set; }

        protected override void Load(ContainerBuilder builder)
        {
            builder.RegisterSource(new ContravariantRegistrationSource());
            var acceptedHandlerType = typeof(IRequestHandler<,>);
            builder.RegisterAssemblyTypes(Assemblies.ToArray())
                .Where(t => t.Name.EndsWith("Handler") && t.GetInterfaces().Any(p => p.IsGenericType && acceptedHandlerType.Equals(p.GetGenericTypeDefinition())))
                .AsImplementedInterfaces()
                .AsSelf()
                .PropertiesAutowired()
                .InstancePerLifetimeScope();
        }
    }
}
