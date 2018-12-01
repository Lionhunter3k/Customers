using Nest;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Infrastructure.ElasticSearch.Configuration
{
    public class ElasticSearchConfiguration : IDisposable
    {
        private readonly object _syncRoot = new object();
        private readonly ConnectionSettings _connectionSettings;
        private ElasticClient _elasticClient;
        private readonly string Namespace;
        private readonly Dictionary<Type, IElasticIndexConfiguration> _indexConfigurations;

        public IReadOnlyDictionary<Type, IElasticIndexConfiguration> IndexConfigurations
        {
            get
            {
                return _indexConfigurations;
            }
        }

        public string Host { get; }

        public int Port { get; }

        public bool AllowInsecureHttp { get; }

        private Uri CreateUri()
        {
            return new Uri((AllowInsecureHttp ? "http://" : "https://") + Host + ":" + Port);
        }

        /// <summary>
        /// Initializes static members of the <see cref="ElasticSearchConfiguration"/> class.
        /// </summary>
        public ElasticSearchConfiguration(string @namespace, string host, int port, bool allowInsecureHttp, IEnumerable<IElasticIndexConfiguration> indexConfigurations, Func<Uri, ConnectionSettings> connectionSettingsFactory)
        {
            Namespace = @namespace.ToLowerInvariant();
            Host = host;
            Port = port;
            AllowInsecureHttp = allowInsecureHttp;
            _indexConfigurations = indexConfigurations.ToDictionary(q => q.IndexType, q => q);
            _connectionSettings = connectionSettingsFactory(CreateUri()).ThrowExceptions();
            foreach (var indexConfiguration in _indexConfigurations.Values)
            {
                _connectionSettings = indexConfiguration.ConfigureIndexMapping(_connectionSettings, q => $"{Namespace}_{q}");
            }
        }

        public ElasticClient GetClient()
        {
            if (this._elasticClient == null)
            {
                lock (_syncRoot)
                {
                    if (this._elasticClient == null)
                    {
                        this._elasticClient = new ElasticClient(_connectionSettings);
                    }
                }
            }
            return _elasticClient;
        }

        public void Dispose()
        {
            this._elasticClient = null;
            ((IDisposable)_connectionSettings).Dispose();
        }
    }
}
