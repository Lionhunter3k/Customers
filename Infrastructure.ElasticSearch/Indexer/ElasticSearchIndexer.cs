using Infrastructure.ElasticSearch.Configuration;
using Nest;
using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Infrastructure.ElasticSearch.Indexer
{
    public class ElasticSearchIndexer : IElasticSearchIndexer
    {
        private readonly ElasticSearchConfiguration _elasticSearchConfiguration;
        private readonly ElasticClient _client;
        private readonly ConcurrentDictionary<Type, Lazy<Task<string>>> _currentIndexNames = new ConcurrentDictionary<Type, Lazy<Task<string>>>();

        public bool UseExistingIndexes { get; set; }

        public Action<string> Logger { get; set; }

        public ElasticSearchIndexer(ElasticSearchConfiguration elasticSearchConfiguration)
        {
            _elasticSearchConfiguration = elasticSearchConfiguration;
            _client = _elasticSearchConfiguration.GetClient();
        }

        public Task DeleteAllIndexesAsync()
        {
            return _client.DeleteIndexAsync("_all");
        }

        public async Task<bool> DeleteIndexIfExistsAsync<TIndex>() where TIndex : class
        {
            if (_elasticSearchConfiguration.IndexConfigurations.TryGetValue(typeof(TIndex), out var indexConfiguration))
            {
                var existingIndexes = await _client.GetIndicesPointingToAliasAsync(indexConfiguration.LiveIndexAlias);
                if (existingIndexes.Any())
                {
                    foreach (var existingIndex in existingIndexes)
                    {
                        await _client.DeleteIndexAsync(existingIndex);
                    }
                    _currentIndexNames.TryRemove(typeof(TIndex), out var deletedIndexName);
                    return true;
                }
                return false;
            }
            throw new KeyNotFoundException();
        }

        public async Task CreateIndexAsync<TIndex>() where TIndex : class
        {
            var indexName = CreateIndexLazyAsync(typeof(TIndex));
            var indexConfiguration = _elasticSearchConfiguration.IndexConfigurations[typeof(TIndex)];
            var indexAlias = await indexName.Value;
            await SwapAliasAsync(indexConfiguration.LiveIndexAlias, indexConfiguration.OldIndexAlias, indexAlias);
            if (!_currentIndexNames.TryAdd(typeof(TIndex), indexName))
            {
                _currentIndexNames[typeof(TIndex)] = indexName;
            }
        }


        public async Task InsertIndexesAsync<TIndex>(IEnumerable<TIndex> indexes) where TIndex : class
        {
            if (!UseExistingIndexes)
            {
                _currentIndexNames.TryRemove(typeof(TIndex), out var deletedIndexName);
            }
            await FlushAsync(typeof(TIndex), indexes);
        }

        private Lazy<Task<string>> CreateIndexLazyAsync(Type type)
        {
            return new Lazy<Task<string>>(() => CreateIndexAsync(type), true);
        }

        private async Task<string> CreateIndexAsync(Type indexType)
        {
            if (_elasticSearchConfiguration.IndexConfigurations.TryGetValue(indexType, out var indexConfiguration))
            {
                if (UseExistingIndexes)
                {
                    var indexExists = (await _client.IndexExistsAsync(indexConfiguration.LiveIndexAlias)).Exists;
                    if (indexExists)
                    {
                        return indexConfiguration.LiveIndexAlias;
                    }
                }
                var currentIndexName = indexConfiguration.CreateIndexName();
                await _client.CreateIndexAsync(currentIndexName, i => i
                    .Settings(s => s
                        .NumberOfShards(2)
                        .Setting("index.mapping.total_fields.limit", 10000)
                        .NumberOfReplicas(0)
                        .Analysis(indexConfiguration.ConfigureSearchAnalysis)
                    )
                    .Mappings(indexConfiguration.ConfigureContentMapping));
                if(UseExistingIndexes)
                {
                    await _client.AliasAsync(aliases =>
                    {
                        return aliases
                            .Remove(a => a.Alias(indexConfiguration.LiveIndexAlias).Index("*"))
                            .Add(a => a.Alias(indexConfiguration.LiveIndexAlias).Index(currentIndexName));
                    });
                }
                return currentIndexName;
            }
            throw new KeyNotFoundException();
        }

        private async Task FlushAsync(Type indexType, IEnumerable<object> indexes)
        {
            var result = await _client.IndexManyAsync(indexes, await _currentIndexNames.GetOrAdd(indexType, CreateIndexLazyAsync).Value, _elasticSearchConfiguration.IndexConfigurations[indexType].IndexPath);
            if (!result.IsValid)
            {
                foreach (var item in result.ItemsWithErrors)
                    throw new Exception(string.Format("Failed to index document {0}: {1}", item.Id, item.Error));
                Logger?.Invoke(result.DebugInformation);
            }
        }

        public async Task SwapAliasesWithCurrentIndexNames()
        {
            foreach (var processedIndex in _currentIndexNames)
            {
                var indexConfiguration = _elasticSearchConfiguration.IndexConfigurations[processedIndex.Key];
                await SwapAliasAsync(indexConfiguration.LiveIndexAlias, indexConfiguration.OldIndexAlias, await processedIndex.Value.Value);
            }
        }

        private async Task SwapAliasAsync(string liveIndexAlias, string oldIndexAlias, string currentIndexName)
        {
            var indexExists = (await _client.IndexExistsAsync(liveIndexAlias)).Exists;

            await _client.AliasAsync(aliases =>
            {
                if (indexExists)
                    aliases.Add(a => a.Alias(oldIndexAlias).Index(liveIndexAlias));

                return aliases
                    .Remove(a => a.Alias(liveIndexAlias).Index("*"))
                    .Add(a => a.Alias(liveIndexAlias).Index(currentIndexName));
            });

            var oldIndices = (await _client.GetIndicesPointingToAliasAsync(oldIndexAlias))
                .OrderByDescending(name => name)
                .Skip(2);

            foreach (var oldIndex in oldIndices)
                await _client.DeleteIndexAsync(oldIndex);
        }
    }
}
