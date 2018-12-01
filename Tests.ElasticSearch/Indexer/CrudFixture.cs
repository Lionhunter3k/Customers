using Elasticsearch.Net;
using Infrastructure.ElasticSearch.Configuration;
using Nest;
using NUnit.Framework;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;
using Tests.ElasticSearch.ElasticSearchBuilders;

namespace Tests.ElasticSearch.Indexer
{
    public abstract class CrudFixture<TIndex> : ElasticSearchFixture
        where TIndex: class
    {

        protected IElasticIndexConfiguration IndexConfiguration => ElasticSearchConfiguration.IndexConfigurations[typeof(TIndex)];

        protected abstract TIndex BuildIndex();

        protected abstract Id ExtractId(TIndex entity);

        protected abstract void ModifyEntity(TIndex entity);

        protected abstract void AssertAreEqual(TIndex expectedEntity, TIndex actualEntity);

        protected override void OnElasticSearchCreated()
        {
            base.OnElasticSearchCreated();
            this.ElasticSearchIndexer.UseExistingIndexes = true;
        }

        [SetUp]
        public async Task ClearElasticSearchIndexes()
        {
            await ElasticSearchIndexer.DeleteIndexIfExistsAsync<TIndex>();
        }

        [Test]
        public async Task Can_insert_data()
        {
            var index = BuildIndex();
            await ElasticSearchIndexer.InsertIndexesAsync(new List<TIndex> { index });
            await Client.RefreshAsync(IndexConfiguration.LiveIndexAlias);
            ////Assert
            var result = await Client.GetAsync(DocumentPath<TIndex>.Id(ExtractId(index)), i => i.Index(IndexConfiguration.LiveIndexAlias).Type(IndexConfiguration.IndexPath));
            Assert.That(result, Is.Not.Null);
            Assert.That(result.Found);
            AssertAreEqual(index, result.Source);
        }

        [Test]
        public async Task Can_update_data()
        {
            var index = BuildIndex();
            var listOfIndexes = new List<TIndex> { index };
            await ElasticSearchIndexer.InsertIndexesAsync(listOfIndexes);
            ModifyEntity(index);
            await ElasticSearchIndexer.InsertIndexesAsync(listOfIndexes);
            await Client.RefreshAsync(IndexConfiguration.LiveIndexAlias);
            ////Assert
            var result = await Client.GetAsync(DocumentPath<TIndex>.Id(ExtractId(index)), i => i.Index(IndexConfiguration.LiveIndexAlias).Type(IndexConfiguration.IndexPath));
            Assert.That(result, Is.Not.Null);
            Assert.That(result.Found);
            AssertAreEqual(index, result.Source);
        }

        [Test]
        public async Task Can_delete_data()
        {
            var index = BuildIndex();
            await ElasticSearchIndexer.InsertIndexesAsync(new List<TIndex> { index });
            await Client.RefreshAsync(IndexConfiguration.LiveIndexAlias);
            await Client.DeleteAsync(DocumentPath<TIndex>.Id(ExtractId(index)), i => i.Index(IndexConfiguration.LiveIndexAlias).Type(IndexConfiguration.IndexPath));
            await Client.RefreshAsync(IndexConfiguration.LiveIndexAlias);
            ////Assert
            Assert.CatchAsync<ElasticsearchClientException>(async () => await Client.GetAsync(DocumentPath<TIndex>.Id(ExtractId(index)), i => i.Index(IndexConfiguration.LiveIndexAlias).Type(IndexConfiguration.IndexPath)));
        }
    }
}
