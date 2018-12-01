using Autofac;
using Infrastructure.NH.Persistence;
using NHibernate;
using NHibernate.Cfg;
using NHibernate.Tool.hbm2ddl;
using System;
using System.IO;

namespace Infrastructure.NH.Container
{
    public abstract class NHibernateModule : Module
    {
        public string SchemaRootPath { get; set; }

        public string SchemaFilename { get; set; } = "db.sql";

        public event EventHandler<ISessionFactory> OnSessionFactoryCreated;

        public event EventHandler<Configuration> OnConfigurationCreated;

        protected abstract Configuration BuildConfiguration(IComponentContext context);

        private Configuration GetConfiguration(IComponentContext context)
        {
            var config = BuildConfiguration(context);
            OnConfigurationCreated?.Invoke(this, config);
            if (!string.IsNullOrEmpty(SchemaRootPath))
            {
                var schemaExport = new SchemaExport(config);
                schemaExport
                .SetOutputFile(Path.Combine(SchemaRootPath, SchemaFilename))
                .Execute(true, false, false);
            }
            return config;
        }

        private ISessionFactory GetSessionFactory(IComponentContext context)
        {
            var sessionFactory = context.Resolve<Configuration>().BuildSessionFactory();
            OnSessionFactoryCreated?.Invoke(this, sessionFactory);
            return sessionFactory;
        }

        protected override void Load(ContainerBuilder builder)
        {
            builder.Register(GetConfiguration)
                        .AsSelf()
                        .SingleInstance();
            builder.Register(GetSessionFactory)
                    .As<ISessionFactory>()
                    .SingleInstance();
            builder.Register(c => c.Resolve<ISessionFactory>().OpenSession())
                  .As<ISession>()
                  .InstancePerLifetimeScope();
            builder.Register(c => c.Resolve<ISessionFactory>().OpenStatelessSession())
                .As<IStatelessSession>()
                .InstancePerLifetimeScope();
            builder.RegisterType<StatefulSessionWrapper>().AsSelf().InstancePerLifetimeScope();
            builder.RegisterType<StatelessSessionWrapper>().AsSelf().InstancePerLifetimeScope();
        }
    }
}
