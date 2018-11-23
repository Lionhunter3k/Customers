using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using Autofac;
using AutoMapper;

namespace Customers.Infrastructure.Container
{
    //commentary:
    //we use automapper to project entities to denormalized models, so we can avoid stack overflows
    //during serializations or large responses with unused fields
    public class AutoMapperModule : Module
    {
        public AssemblyRegistry Assemblies { get; set; }

        protected override void Load(ContainerBuilder builder)
        {
            // profiles
            builder.RegisterAssemblyTypes(Assemblies.ToArray())
                .As<Profile>()
                .InstancePerDependency();

            // converters
            builder.RegisterAssemblyTypes(Assemblies.ToArray())
                   .AsClosedTypesOf(typeof(ITypeConverter<,>))
                   .AsSelf()
                   .InstancePerLifetimeScope();

            // converters
            builder.RegisterAssemblyTypes(Assemblies.ToArray())
                   .AsClosedTypesOf(typeof(IMemberValueResolver<,,,>))
                   .AsSelf()
                   .InstancePerLifetimeScope();

            builder.Register(context =>
            {
                var mapperCfg = new MapperConfiguration(cfg =>
              {
                  foreach (var profile in context.Resolve<IEnumerable<Profile>>())
                  {
                      cfg.AddProfile(profile);
                  }
              });
                mapperCfg.AssertConfigurationIsValid();
                return mapperCfg;
            })
            .AsSelf()
            .SingleInstance();

            builder.Register(c => c.Resolve<MapperConfiguration>().CreateMapper(c.Resolve<IComponentContext>().Resolve))
               .As<IMapper>()
               .InstancePerLifetimeScope();
        }
    }
}
