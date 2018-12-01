using NUnit.Framework;
using System.Collections.Generic;
using Nest;
using Infrastructure.ElasticSearch.Configuration;
using Movies.Domain.Infrastructure;
using Bogus;
using Movies.Domain.Core;
using Newtonsoft.Json.Linq;
using AutoBogus;
using System.Linq;
using Tests.ElasticSearch.Indexer;
using System;
using Elasticsearch.Net;
using Nest.JsonNetSerializer;

namespace Movies.Tests.Indexer
{
    [TestFixture]
    public class MovieCrud : CrudFixture<Movie>
    {
        protected override ConnectionSettings CreateConnectionSettings(Uri uri)
        {
            var pool = new SingleNodeConnectionPool(uri);
            var connectionSettings = new ConnectionSettings(pool, JsonNetSerializer.Default);
            return connectionSettings;
        }

        private Faker<Movie> _testMovies;

        protected override void OnElasticSearchCreated()
        {
            base.OnElasticSearchCreated();
            _testMovies = new AutoFaker<Movie>()
                          .RuleFor(o => o.Data, f => JObject.Parse("{}"));
        }

        protected override Movie BuildIndex()
        {
            return _testMovies.Generate(1).Single();
        }

        protected override Id ExtractId(Movie entity)
        {
            return entity.Id;
        }

        protected override void ModifyEntity(Movie entity)
        {
            entity.Headline = "changed headline";
            entity.Directors.Add(new Movies.Domain.Core.Person { Name = "changed director" });
        }

        protected override void AssertAreEqual(Movie expectedEntity, Movie actualEntity)
        {
            Assert.AreEqual(expectedEntity.Directors.Count, actualEntity.Directors.Count);
            Assert.AreEqual(expectedEntity.Headline, actualEntity.Headline);
            Assert.AreEqual(expectedEntity.Class, actualEntity.Class);
        }

        protected override IEnumerable<IElasticIndexConfiguration> GetIndexConfigurations()
        {
            yield return new MovieConfiguration();
        }
    }
}
