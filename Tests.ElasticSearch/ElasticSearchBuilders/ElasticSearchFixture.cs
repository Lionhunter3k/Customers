using ElasticsearchInside;
using ElasticsearchInside.Config;
using Infrastructure.ElasticSearch.Configuration;
using Infrastructure.ElasticSearch.Indexer;
using Nest;
using NUnit.Framework;
using System;
using System.Collections.Generic;
using System.Net;
using System.Net.Http;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace Tests.ElasticSearch.ElasticSearchBuilders
{
    public abstract class ElasticSearchFixture
    {
        private ElasticsearchInside.Elasticsearch _elasticSearchMock;

        protected ElasticClient Client { get; private set; }

        protected ElasticSearchIndexer ElasticSearchIndexer { get; private set; }

        protected ElasticSearchConfiguration ElasticSearchConfiguration { get; private set; }

        protected abstract IEnumerable<IElasticIndexConfiguration> GetIndexConfigurations();

        protected virtual ConnectionSettings CreateConnectionSettings(Uri uri)
        {
            return new ConnectionSettings(uri);
        }

        protected virtual void OnElasticSearchCreated() { }

        protected virtual void OnElasticSearchTeardown() { }

        protected async Task WaitForOk(CancellationToken cancellationToken = default(CancellationToken))
        {
            var timeoutSource = new CancellationTokenSource(TimeSpan.FromMinutes(3));
            var linked = CancellationTokenSource.CreateLinkedTokenSource(timeoutSource.Token, cancellationToken);

            var statusUrl = new UriBuilder(_elasticSearchMock.Url)
            {
                Path = "_cluster/health",
                Query = "wait_for_status=green"
            }.Uri;

            using (var client = new HttpClient())
            {
                var statusCode = (HttpStatusCode)0;
                do
                {
                    try
                    {
                        var response = await client.GetAsync(statusUrl, linked.Token);
                        statusCode = response.StatusCode;
                    }
                    catch (HttpRequestException) { }
                    catch (TaskCanceledException ex)
                    {
                        throw new TimeoutWaitingForElasticsearchStatusException(ex);
                    }
                    await Task.Delay(500, linked.Token).ConfigureAwait(false);

                } while (statusCode != HttpStatusCode.OK && !linked.IsCancellationRequested);
            }
        }

        [OneTimeSetUp]
        public async Task SetupElasticSearch()
        {
            _elasticSearchMock = await new ElasticsearchInside.Elasticsearch(i => i.SetPort(9188).EnableLogging()).Ready();
            ElasticSearchConfiguration = new ElasticSearchConfiguration("test", _elasticSearchMock.Url.Host, _elasticSearchMock.Url.Port, true, GetIndexConfigurations(), CreateConnectionSettings);
            Client = ElasticSearchConfiguration.GetClient();
            ElasticSearchIndexer = new ElasticSearchIndexer(ElasticSearchConfiguration);
            OnElasticSearchCreated();
        }

        [OneTimeTearDown]
        public void TeardownElasticSearch()
        {
            OnElasticSearchTeardown();
            _elasticSearchMock.Dispose();
        }
    }
}
