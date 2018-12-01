using AutoBogus;
using Bogus;
using Infrastructure.ElasticSearch.Indexer;
using Moq;
using Movies.Domain.Components;
using Movies.Domain.Core;
using Newtonsoft.Json.Linq;
using NUnit.Framework;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace Movies.Tests.Domain
{
    [TestFixture]
    public class MovieIndexerTests
    {
        private Mock<IElasticSearchIndexer> elasticSearchIndexerMock;
        private Faker<Movie> testMovies;

        [OneTimeSetUp]
        public void Setup()
        {
            this.elasticSearchIndexerMock = new Mock<IElasticSearchIndexer>();
            elasticSearchIndexerMock.Setup(t => t.InsertIndexesAsync(It.IsAny<IEnumerable<Movie>>())).Returns<IEnumerable<Movie>>(e => Task.FromResult<object>(null));
            this.testMovies = new AutoFaker<Movie>()
                .RuleFor(o => o.Data, f => JObject.Parse("{}"));
        }

        [Test]
        public async Task Will_Index_All_872_Movies()
        {
            var numberOfDesiredMovies = 872;
            await IndexFakeMovies(numberOfDesiredMovies);
        }

        [Test]
        public async Task Will_Index_1_Movie()
        {
            var numberOfDesiredMovies = 1;
            await IndexFakeMovies(numberOfDesiredMovies);
        }

        private async Task IndexFakeMovies(int numberOfDesiredMovies)
        {
            var indexer = new MovieIndexer(elasticSearchIndexerMock.Object);
            using (var fakeMoviesEnumerator = testMovies.Generate(numberOfDesiredMovies).GetEnumerator())
            {
                var numberOfIndexedMovies = await indexer.IndexMoviesAsync(fakeMoviesEnumerator);
                Assert.AreEqual(numberOfDesiredMovies, numberOfIndexedMovies);
            }
        }
    }
}
