using Autofac;
using Autofac.Features.Variance;
using Infrastructure.Queries;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using System.Text;

namespace Infrastructure.Container
{
    public class QueryModule : Autofac.Module
    {
        public IReadOnlyCollection<Assembly> Assemblies { get; set; }

        protected override void Load(ContainerBuilder builder)
        {
            var assembliesToLoad = new HashSet<Assembly>(Assemblies)
            {
                typeof(QueryModule).Assembly
            }.ToArray();
            builder.RegisterSource(new ContravariantRegistrationSource());
            var acceptedHandlerType = typeof(IRequestHandler<,>);
            builder.RegisterAssemblyTypes(assembliesToLoad)
                .Where(t => t.Name.EndsWith("Handler") && t.GetInterfaces().Any(p => p.IsGenericType && acceptedHandlerType.Equals(p.GetGenericTypeDefinition())))
                .AsImplementedInterfaces()
                .AsSelf()
                .PropertiesAutowired()
                .InstancePerLifetimeScope();
        }
    }
}
