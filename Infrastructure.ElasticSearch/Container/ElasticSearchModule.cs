using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using System.Text;
using Autofac;
using Infrastructure.ElasticSearch.Configuration;
using Infrastructure.ElasticSearch.Indexer;
using Microsoft.Extensions.Configuration;
using Nest;

namespace Infrastructure.ElasticSearch.Container
{
    public class ElasticSearchModule : Autofac.Module
    {
        public IReadOnlyCollection<Assembly> Assemblies { get; set; } = new Assembly[0];

        public Func<Uri, ConnectionSettings> ConnectionSettingsFactory { get; set; } = CreateConnectionSettings;

        private static ConnectionSettings CreateConnectionSettings(Uri uri)
        {
            return new ConnectionSettings(uri);
        }

        protected override void Load(ContainerBuilder builder)
        {
            var assembliesToLoad = new HashSet<Assembly>(Assemblies)
            {
                typeof(ElasticSearchModule).Assembly
            }.ToArray();
            // profiles
            builder.RegisterAssemblyTypes(assembliesToLoad)
                .As<IElasticIndexConfiguration>()
                .InstancePerDependency();
            builder.Register(BuildConfiguration)
                    .AsSelf()
                    .SingleInstance();
            builder.Register(c => c.Resolve<ElasticSearchConfiguration>().GetClient()).AsSelf().SingleInstance();
            builder.Register(c => new ElasticSearchIndexer(c.Resolve<ElasticSearchConfiguration>())).As<IElasticSearchIndexer>().InstancePerLifetimeScope();
        }

        private ElasticSearchConfiguration BuildConfiguration(IComponentContext context)
        {
            var configuration = context.Resolve<IConfiguration>();
            var elasticSection = configuration.GetSection("Elastic");
            var config = new ElasticSearchConfiguration(elasticSection["Namespace"], elasticSection["Host"] ?? "localhost", int.TryParse(elasticSection["Port"], out var port) ? port: 9200, bool.TryParse(elasticSection["AllowInsecureHttp"], out var allowInsecureHttp) ? allowInsecureHttp : true, context.Resolve<IEnumerable<IElasticIndexConfiguration>>(), ConnectionSettingsFactory);
            return config;
        }
    }
}
