using Nest;
using System;

namespace Infrastructure.ElasticSearch.Configuration
{
    public interface IElasticIndexConfiguration
    {
        string LiveIndexAlias { get; }
        string OldIndexAlias { get; }
        string IndexPath { get; }
        Type IndexType { get; }

        AnalysisDescriptor ConfigureSearchAnalysis(AnalysisDescriptor analysis);
        ConnectionSettings ConfigureIndexMapping(ConnectionSettings connectionSettings, Func<string, string> liveIndexAliasFormatter);
        string CreateIndexName();
        MappingsDescriptor ConfigureContentMapping(MappingsDescriptor mappings);
    }
}
