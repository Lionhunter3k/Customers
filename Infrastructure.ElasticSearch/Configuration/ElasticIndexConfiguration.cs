using Nest;
using System;
using System.Collections.Generic;
using System.Text;

namespace Infrastructure.ElasticSearch.Configuration
{
    //singleton
    public abstract class ElasticIndexConfiguration<TIndex> : IElasticIndexConfiguration
        where TIndex : class
    {
        protected virtual TypeMappingDescriptor<TIndex> OnConfigureContentMapping(TypeMappingDescriptor<TIndex> map)
        {
            return map.AutoMap();
        }

        public MappingsDescriptor ConfigureContentMapping(MappingsDescriptor mappings)
        {
            return mappings.Map<TIndex>(OnConfigureContentMapping);
        }

        public virtual AnalysisDescriptor ConfigureSearchAnalysis(AnalysisDescriptor analysis)
        {
            return analysis;
        }

        public ConnectionSettings ConfigureIndexMapping(ConnectionSettings connectionSettings, Func<string, string> liveIndexAliasFormatter)
        {
            IndexPath = OnConfigurePathName(connectionSettings);
            LiveIndexAlias = liveIndexAliasFormatter(IndexPath);
            return OnConfigurePathMapping(connectionSettings);
        }

        protected virtual ConnectionSettings OnConfigurePathMapping(ConnectionSettings connectionSettings)
        {
            return connectionSettings.DefaultMappingFor<TIndex>(i => i
                .TypeName(IndexPath)
                .IndexName(LiveIndexAlias));
        }

        protected virtual string OnConfigurePathName(ConnectionSettings connectionSettings)
        {
            return typeof(TIndex).Name.ToLowerInvariant();
        }

        public string LiveIndexAlias { get; private set; }

        public string IndexPath { get; private set; }

        /// <summary>
        /// Gets the old index alias.
        /// </summary>
        /// <value>The old index alias.</value>
        public string OldIndexAlias => LiveIndexAlias + "_old";

        public Type IndexType => typeof(TIndex);

        public string CreateIndexName()
        {
            //return $"{LiveIndexAlias}-{DateTime.UtcNow:dd-MM-yyyy-HH-mm-ss}";
            return $"{LiveIndexAlias}-{DateTime.UtcNow:yyyy-MM-dd-HH-mm-ss}";
        }
    }
}
