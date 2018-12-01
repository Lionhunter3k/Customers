using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using System.Text;
using Autofac;
using AutoMapper;
using Infrastructure.Container;

namespace Infrastructure.AutoMapper.Container
{
    //commentary:
    //we use automapper to project entities to denormalized models, so we can avoid stack overflows
    //during serializations or large responses with unused fields
    public class AutoMapperModule : Autofac.Module
    {
        public IReadOnlyCollection<Assembly> Assemblies { get; set; }

        public bool AssertConfigurationIsValid { get; set; }

        protected override void Load(ContainerBuilder builder)
        {
            var assembliesToLoad = new HashSet<Assembly>(Assemblies)
            {
                typeof(AutoMapperModule).Assembly
            }.ToArray();
            // profiles
            builder.RegisterAssemblyTypes(assembliesToLoad)
                .As<Profile>()
                .InstancePerDependency();

            // converters
            builder.RegisterAssemblyTypes(assembliesToLoad)
                   .AsClosedTypesOf(typeof(ITypeConverter<,>))
                   .AsSelf()
                   .InstancePerLifetimeScope();

            // converters
            builder.RegisterAssemblyTypes(assembliesToLoad)
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
                if(AssertConfigurationIsValid)
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
