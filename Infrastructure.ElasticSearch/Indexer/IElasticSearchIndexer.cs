using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace Infrastructure.ElasticSearch.Indexer
{
    public interface IElasticSearchIndexer
    {
        Task DeleteAllIndexesAsync();

        Task SwapAliasesWithCurrentIndexNames();

        Task<bool> DeleteIndexIfExistsAsync<TIndex>()
            where TIndex : class;

        Task CreateIndexAsync<TIndex>()
          where TIndex : class;

        Task InsertIndexesAsync<TIndex>(IEnumerable<TIndex> indexes)
           where TIndex : class;

        bool UseExistingIndexes { get; set; }
    }
}
