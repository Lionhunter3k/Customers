using AutoBogus;
using Bogus;
using Infrastructure.ElasticSearch.Configuration;
using Movies.Domain.Core;
using Movies.Domain.Infrastructure;
using Movies.Queries.Handler;
using Nest;
using Newtonsoft.Json.Linq;
using NUnit.Framework;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Tests.ElasticSearch.ElasticSearchBuilders;
using Infrastructure.Queries;
using Movies.Queries.Model;
using Newtonsoft.Json;
using Elasticsearch.Net;
using Nest.JsonNetSerializer;

namespace Movies.Tests.Queries
{
    [TestFixture]
    public class MovieListHandlerTests : ElasticSearchFixture
    {
        private Faker<Movie> _testMovies = new AutoFaker<Movie>().RuleFor(q => q.Id, (f, m) => m.Id = Guid.NewGuid().ToString());
        private IRequestHandler<PagedRequest<MovieListRequestModel, MovieListModel>, PagedList<MovieListModel>> _handler;

        protected override ConnectionSettings CreateConnectionSettings(Uri uri)
        {
            var pool = new SingleNodeConnectionPool(uri);
            var connectionSettings = new ConnectionSettings(pool, JsonNetSerializer.Default);
            return connectionSettings.EnableDebugMode();
        }

        protected override IEnumerable<IElasticIndexConfiguration> GetIndexConfigurations()
        {
            yield return new MovieConfiguration();
        }


        private async Task<List<Movie>> GenerateAndInsertMovies(int numberOfMovies, Action<Movie, int> movieSetup = null)
        {
            var fakeMovies = _testMovies.Generate(numberOfMovies);
            for(var i = 0; i < fakeMovies.Count; i++)
            {
                var fakeMovie = fakeMovies[i];
                fakeMovie.Data = JObject.FromObject(new { fakeMovie.Body, fakeMovie.Cast, fakeMovie.Cert, fakeMovie.Class, fakeMovie.Directors, fakeMovie.Duration, fakeMovie.Genres, fakeMovie.Headline, fakeMovie.Id, fakeMovie.LastUpdated, fakeMovie.Synopsis, fakeMovie.Year });
                movieSetup?.Invoke(fakeMovie, i);
            }
            await base.ElasticSearchIndexer.InsertIndexesAsync(fakeMovies);
            await base.ElasticSearchIndexer.SwapAliasesWithCurrentIndexNames();
            await base.Client.RefreshAsync(Indices.All);
            return fakeMovies;
        }

        [SetUp]
        public async Task ClearElasticSearchIndexes()
        {
            await ElasticSearchIndexer.DeleteAllIndexesAsync();
            this._handler = new MovieQueryHandler(base.ElasticSearchConfiguration.GetClient());
        }

        [Test]
        public async Task Get_1_Movie_NoFilters()
        {
            var numberOfMovies = 1;
            var fakeMovies = await GenerateAndInsertMovies(numberOfMovies);
            var result = await _handler.HandleAsync(new PagedRequest<MovieListRequestModel, MovieListModel>(new MovieListRequestModel()));
            Assert.AreEqual(numberOfMovies, result.TotalCount);
            Assert.AreEqual(fakeMovies[0].Id, result.Items[0].Property("Id").Value.ToString());
        }

        [Test]
        public async Task Get_10_Movies_NoFilters()
        {
            var numberOfMovies = 10;
            var fakeMovies = await GenerateAndInsertMovies(numberOfMovies);
            var result = await _handler.HandleAsync(new PagedRequest<MovieListRequestModel, MovieListModel>(new MovieListRequestModel()));
            Assert.AreEqual(numberOfMovies, result.TotalCount);
            foreach(var fakeMovie in fakeMovies)
            {
                Assert.IsTrue(result.Items.Select(q => q.Property("Id").Value.ToString()).Contains(fakeMovie.Id));
            }
        }

        [Test]
        public async Task SortByHeadlineAsc_NoFilters_100_Movies()
        {
            var numberOfMovies = 100;
            var fakeMovies = await GenerateAndInsertMovies(numberOfMovies, (m, i) =>
            {
                if(i < 10)
                {
                    m.Headline = i.ToString();
                }
                else
                {
                    m.Headline = char.MaxValue + m.Headline;
                }
            });
            var request = new PagedRequest<MovieListRequestModel, MovieListModel>(new MovieListRequestModel { Sort = MovieSort.ByHeadlineAsc }) { PageSize = 10 };
            var result = await _handler.HandleAsync(request);
            Assert.AreEqual(request.PageSize, result.Items.Count);
            var orderedMovies = fakeMovies.OrderBy(q => q.Headline).Take(10).ToList();
            foreach (var fakeMovie in orderedMovies)
            {
                Assert.IsTrue(result.Items.Select(q => q.Property("Id").Value.ToString()).Contains(fakeMovie.Id));
            }
        }

        [Test]
        public async Task SortByHeadlineDesc_NoFilters_100_Movies()
        {
            var numberOfMovies = 100;
            var fakeMovies = await GenerateAndInsertMovies(numberOfMovies, (m, i) =>
            {
                if (i < 90)
                {
                    m.Headline = i.ToString();
                }
                else
                {
                    m.Headline = char.MaxValue + m.Headline;
                }
            });
            var request = new PagedRequest<MovieListRequestModel, MovieListModel>(new MovieListRequestModel { Sort = MovieSort.ByHeadlineDesc }) { PageSize = 10 };
            var result = await _handler.HandleAsync(request);
            Assert.AreEqual(request.PageSize, result.Items.Count);
            var orderedMovies = fakeMovies.OrderByDescending(q => q.Headline).Take(10).ToList();
            foreach (var fakeMovie in orderedMovies)
            {
                Assert.IsTrue(result.Items.Select(q => q.Property("Id").Value.ToString()).Contains(fakeMovie.Id));
            }
        }

        [Test]
        public async Task SortByYearAsc_NoFilters_100_Movies()
        {
            var numberOfMovies = 100;
            var fakeMovies = await GenerateAndInsertMovies(numberOfMovies, (m, i) =>
            {
                if (i < 10)
                {
                    m.Year = i;
                }
                else
                {
                    m.Year = 2000 + m.Year;
                }
            });
            var request = new PagedRequest<MovieListRequestModel, MovieListModel>(new MovieListRequestModel { Sort = MovieSort.ByYearAsc }) { PageSize = 10 };
            var result = await _handler.HandleAsync(request);
            Assert.AreEqual(request.PageSize, result.Items.Count);
            var orderedMovies = fakeMovies.OrderBy(q => q.Year).Take(10).ToList();
            foreach (var fakeMovie in orderedMovies)
            {
                Assert.IsTrue(result.Items.Select(q => q.Property("Id").Value.ToString()).Contains(fakeMovie.Id));
            }
        }

        [Test]
        public async Task SortByYearDesc_NoFilters_100_Movies()
        {
            var numberOfMovies = 100;
            var fakeMovies = await GenerateAndInsertMovies(numberOfMovies, (m, i) =>
            {
                if (i < 90)
                {
                    m.Year = i;
                }
                else
                {
                    m.Year = 2000 + m.Year;
                }
            });
            var request = new PagedRequest<MovieListRequestModel, MovieListModel>(new MovieListRequestModel { Sort = MovieSort.ByYearDesc }) { PageSize = 10 };
            var result = await _handler.HandleAsync(request);
            Assert.AreEqual(request.PageSize, result.Items.Count);
            var orderedMovies = fakeMovies.OrderByDescending(q => q.Year).Take(10).ToList();
            foreach (var fakeMovie in orderedMovies)
            {
                Assert.IsTrue(result.Items.Select(q => q.Property("Id").Value.ToString()).Contains(fakeMovie.Id));
            }
        }

        [Test]
        public async Task Filter_By_Max_Year_100_Movies()
        {
            var numberOfMovies = 100;
            var fakeMovies = await GenerateAndInsertMovies(numberOfMovies, (m, i) =>
            {
                if (i < 10)
                {
                    m.Year = i;
                }
                else
                {
                    m.Year = 2000 + i;
                }
            });
            var request = new PagedRequest<MovieListRequestModel, MovieListModel>(new MovieListRequestModel { MaxYear = 10 });
            var result = await _handler.HandleAsync(request);
            var orderedMovies = fakeMovies.Where(q => q.Year <= 10).Take(10).ToList();
            Assert.AreEqual(orderedMovies.Count, result.Items.Count);
            foreach (var fakeMovie in orderedMovies)
            {
                Assert.IsTrue(result.Items.Select(q => q.Property("Id").Value.ToString()).Contains(fakeMovie.Id));
            }
        }

        [Test]
        public async Task Filter_By_Min_Year_100_Movies()
        {
            var numberOfMovies = 100;
            var fakeMovies = await GenerateAndInsertMovies(numberOfMovies, (m, i) =>
            {
                if (i < 10)
                {
                    m.Year = 2000 + i;
                }
                else
                {
                    m.Year = i;
                }
            });
            var request = new PagedRequest<MovieListRequestModel, MovieListModel>(new MovieListRequestModel { MinYear = 2000 });
            var result = await _handler.HandleAsync(request);
            var orderedMovies = fakeMovies.Where(q => q.Year >= 2000).ToList();
            Assert.AreEqual(orderedMovies.Count, result.Items.Count);
            foreach (var fakeMovie in orderedMovies)
            {
                Assert.IsTrue(result.Items.Select(q => q.Property("Id").Value.ToString()).Contains(fakeMovie.Id));
            }
        }

        [Test]
        public async Task Filter_By_Single_Class_100_Movies()
        {
            var numberOfMovies = 100;
            var fakeMovies = await GenerateAndInsertMovies(numberOfMovies, (m, i) =>
            {
                if (i < 10)
                {
                    m.Class = "tv show";
                }
                else
                {
                    m.Class = i.ToString();
                }
            });
            var request = new PagedRequest<MovieListRequestModel, MovieListModel>(new MovieListRequestModel { Classes = new List<string> { "tv show" } });
            var result = await _handler.HandleAsync(request);
            var orderedMovies = fakeMovies.Where(q => q.Class.Contains("tv show")).ToList();
            Assert.AreEqual(orderedMovies.Count, result.Items.Count);
            foreach (var fakeMovie in orderedMovies)
            {
                Assert.IsTrue(result.Items.Select(q => q.Property("Id").Value.ToString()).Contains(fakeMovie.Id));
            }
        }

        [Test]
        public async Task Filter_By_Multiple_Classes_100_Movies()
        {
            var numberOfMovies = 100;
            var fakeMovies = await GenerateAndInsertMovies(numberOfMovies, (m, i) =>
            {
                if (i < 10)
                {
                    m.Class = i % 2 == 0 ? "movie" : "tv show";
                }
                else
                {
                    m.Class = i.ToString();
                }
            });
            var request = new PagedRequest<MovieListRequestModel, MovieListModel>(new MovieListRequestModel { Classes = new List<string> { "tv show", "movie" } });
            var result = await _handler.HandleAsync(request);
            var orderedMovies = fakeMovies.Where(q => q.Class.Contains("tv show") || q.Class.Contains("movie")).ToList();
            Assert.AreEqual(orderedMovies.Count, result.Items.Count);
            foreach (var fakeMovie in orderedMovies)
            {
                Assert.IsTrue(result.Items.Select(q => q.Property("Id").Value.ToString()).Contains(fakeMovie.Id));
            }
        }

        [Test]
        public async Task Filter_By_Single_Genre_100_Movies()
        {
            var numberOfMovies = 100;
            var fakeMovies = await GenerateAndInsertMovies(numberOfMovies, (m, i) =>
            {
                if (i < 10)
                {
                    m.Genres = new List<string> { "horror" };
                }
                else
                {
                    m.Genres = new List<string> { i.ToString() };
                }
            });
            var request = new PagedRequest<MovieListRequestModel, MovieListModel>(new MovieListRequestModel { Genres = new List<string> { "horror" } });
            var result = await _handler.HandleAsync(request);
            var orderedMovies = fakeMovies.Where(q => q.Genres.Contains("horror")).ToList();
            Assert.AreEqual(orderedMovies.Count, result.Items.Count);
            foreach (var fakeMovie in orderedMovies)
            {
                Assert.IsTrue(result.Items.Select(q => q.Property("Id").Value.ToString()).Contains(fakeMovie.Id));
            }
        }

        [Test]
        public async Task Filter_By_Multiple_Genres_100_Movies()
        {
            var numberOfMovies = 100;
            var fakeMovies = await GenerateAndInsertMovies(numberOfMovies, (m, i) =>
            {
                if (i < 10)
                {
                    m.Genres = new List<string> { i % 2 == 0 ? "horror" : "comedy" };
                }
                else
                {
                    m.Genres = new List<string> { i.ToString() };
                }
            });
            var request = new PagedRequest<MovieListRequestModel, MovieListModel>(new MovieListRequestModel { Genres = new List<string> { "horror", "comedy" } });
            var result = await _handler.HandleAsync(request);
            var orderedMovies = fakeMovies.Where(q => q.Genres.Contains("horror") || q.Genres.Contains("comedy")).ToList();
            Assert.AreEqual(orderedMovies.Count, result.Items.Count);
            foreach (var fakeMovie in orderedMovies)
            {
                Assert.IsTrue(result.Items.Select(q => q.Property("Id").Value.ToString()).Contains(fakeMovie.Id));
            }
        }

        [Test]
        public async Task Filter_By_Single_Cast_IdenticalName_100_Movies()
        {
            var numberOfMovies = 100;
            var fakeMovies = await GenerateAndInsertMovies(numberOfMovies, (m, i) =>
            {
                if (i < 10)
                {
                    m.Cast = new List<Movies.Domain.Core.Person> { new Movies.Domain.Core.Person { Name = "Bruce Willis" } };
                }
                else
                {
                    m.Cast = new List<Movies.Domain.Core.Person> { new Movies.Domain.Core.Person { Name = i.ToString() } };
                }
            });
            var request = new PagedRequest<MovieListRequestModel, MovieListModel>(new MovieListRequestModel { Query = "Bruce Willis" });
            var result = await _handler.HandleAsync(request);
            var orderedMovies = fakeMovies.Where(q => q.Cast.Select(r => r.Name).Contains("Bruce Willis")).ToList();
            Assert.AreEqual(orderedMovies.Count, result.Items.Count);
            foreach (var fakeMovie in orderedMovies)
            {
                Assert.IsTrue(result.Items.Select(q => q.Property("Id").Value.ToString()).Contains(fakeMovie.Id));
            }
        }

        [Test]
        public async Task Filter_By_Single_Cast_PartialName_FirstName_100_Movies()
        {
            var numberOfMovies = 100;
            var fakeMovies = await GenerateAndInsertMovies(numberOfMovies, (m, i) =>
            {
                if (i < 10)
                {
                    m.Cast = new List<Movies.Domain.Core.Person> { new Movies.Domain.Core.Person { Name = "Bruce Willis" } };
                }
                else
                {
                    m.Cast = new List<Movies.Domain.Core.Person> { new Movies.Domain.Core.Person { Name = i.ToString() } };
                }
            });
            var request = new PagedRequest<MovieListRequestModel, MovieListModel>(new MovieListRequestModel { Query = "Bruce" });
            var result = await _handler.HandleAsync(request);
            var orderedMovies = fakeMovies.Where(q => q.Cast.Select(r => r.Name).Contains("Bruce Willis")).ToList();
            Assert.AreEqual(orderedMovies.Count, result.Items.Count);
            foreach (var fakeMovie in orderedMovies)
            {
                Assert.IsTrue(result.Items.Select(q => q.Property("Id").Value.ToString()).Contains(fakeMovie.Id));
            }
        }

        [Test]
        public async Task Filter_By_Single_Cast_PartialName_LastName_100_Movies()
        {
            var numberOfMovies = 100;
            var fakeMovies = await GenerateAndInsertMovies(numberOfMovies, (m, i) =>
            {
                if (i < 10)
                {
                    m.Cast = new List<Movies.Domain.Core.Person> { new Movies.Domain.Core.Person { Name = "Bruce Willis" } };
                }
                else
                {
                    m.Cast = new List<Movies.Domain.Core.Person> { new Movies.Domain.Core.Person { Name = i.ToString() } };
                }
            });
            var request = new PagedRequest<MovieListRequestModel, MovieListModel>(new MovieListRequestModel { Query = "Willis" });
            var result = await _handler.HandleAsync(request);
            var orderedMovies = fakeMovies.Where(q => q.Cast.Select(r => r.Name).Contains("Bruce Willis")).ToList();
            Assert.AreEqual(orderedMovies.Count, result.Items.Count);
            foreach (var fakeMovie in orderedMovies)
            {
                Assert.IsTrue(result.Items.Select(q => q.Property("Id").Value.ToString()).Contains(fakeMovie.Id));
            }
        }

        [Test]
        public async Task Filter_By_Single_Director_IdenticalName_100_Movies()
        {
            var numberOfMovies = 100;
            var fakeMovies = await GenerateAndInsertMovies(numberOfMovies, (m, i) =>
            {
                if (i < 10)
                {
                    m.Directors = new List<Movies.Domain.Core.Person> { new Movies.Domain.Core.Person { Name = "Bruce Willis" } };
                }
                else
                {
                    m.Directors = new List<Movies.Domain.Core.Person> { new Movies.Domain.Core.Person { Name = i.ToString() } };
                }
            });
            var request = new PagedRequest<MovieListRequestModel, MovieListModel>(new MovieListRequestModel { Query = "Bruce Willis" });
            var result = await _handler.HandleAsync(request);
            var orderedMovies = fakeMovies.Where(q => q.Directors.Select(r => r.Name).Contains("Bruce Willis")).ToList();
            Assert.AreEqual(orderedMovies.Count, result.Items.Count);
            foreach (var fakeMovie in orderedMovies)
            {
                Assert.IsTrue(result.Items.Select(q => q.Property("Id").Value.ToString()).Contains(fakeMovie.Id));
            }
        }

        [Test]
        public async Task Filter_By_Single_Director_PartialName_FirstName_100_Movies()
        {
            var numberOfMovies = 100;
            var fakeMovies = await GenerateAndInsertMovies(numberOfMovies, (m, i) =>
            {
                if (i < 10)
                {
                    m.Directors = new List<Movies.Domain.Core.Person> { new Movies.Domain.Core.Person { Name = "Bruce Willis" } };
                }
                else
                {
                    m.Directors = new List<Movies.Domain.Core.Person> { new Movies.Domain.Core.Person { Name = i.ToString() } };
                }
            });
            var request = new PagedRequest<MovieListRequestModel, MovieListModel>(new MovieListRequestModel { Query = "Bruce" });
            var result = await _handler.HandleAsync(request);
            var orderedMovies = fakeMovies.Where(q => q.Directors.Select(r => r.Name).Contains("Bruce Willis")).ToList();
            Assert.AreEqual(orderedMovies.Count, result.Items.Count);
            foreach (var fakeMovie in orderedMovies)
            {
                Assert.IsTrue(result.Items.Select(q => q.Property("Id").Value.ToString()).Contains(fakeMovie.Id));
            }
        }

        [Test]
        public async Task Filter_By_Single_Director_PartialName_LastName_100_Movies()
        {
            var numberOfMovies = 100;
            var fakeMovies = await GenerateAndInsertMovies(numberOfMovies, (m, i) =>
            {
                if (i < 10)
                {
                    m.Directors = new List<Movies.Domain.Core.Person> { new Movies.Domain.Core.Person { Name = "Bruce Willis" } };
                }
                else
                {
                    m.Directors = new List<Movies.Domain.Core.Person> { new Movies.Domain.Core.Person { Name = i.ToString() } };
                }
            });
            var request = new PagedRequest<MovieListRequestModel, MovieListModel>(new MovieListRequestModel { Query = "Willis" });
            var result = await _handler.HandleAsync(request);
            var orderedMovies = fakeMovies.Where(q => q.Directors.Select(r => r.Name).Contains("Bruce Willis")).ToList();
            Assert.AreEqual(orderedMovies.Count, result.Items.Count);
            foreach (var fakeMovie in orderedMovies)
            {
                Assert.IsTrue(result.Items.Select(q => q.Property("Id").Value.ToString()).Contains(fakeMovie.Id));
            }
        }

        [Test]
        public async Task Filter_By_Single_Director_Or_Cast_PartialName_LastName_100_Movies()
        {
            var numberOfMovies = 100;
            var fakeMovies = await GenerateAndInsertMovies(numberOfMovies, (m, i) =>
            {
                if (i < 10)
                {
                    if(i % 2 == 0)
                    {
                        m.Directors = new List<Movies.Domain.Core.Person> { new Movies.Domain.Core.Person { Name = "Bruce Willis" } };
                        m.Cast = new List<Movies.Domain.Core.Person> { new Movies.Domain.Core.Person { Name = i.ToString() } };
                    }
                    else
                    {
                        m.Cast = new List<Movies.Domain.Core.Person> { new Movies.Domain.Core.Person { Name = "Bruce Willis" } };
                        m.Directors = new List<Movies.Domain.Core.Person> { new Movies.Domain.Core.Person { Name = i.ToString() } };
                    }
                }
                else
                {
                    m.Directors = new List<Movies.Domain.Core.Person> { new Movies.Domain.Core.Person { Name = i.ToString() } };
                    m.Cast = new List<Movies.Domain.Core.Person> { new Movies.Domain.Core.Person { Name = i.ToString() } };
                }
            });
            var request = new PagedRequest<MovieListRequestModel, MovieListModel>(new MovieListRequestModel { Query = "Willis" });
            var result = await _handler.HandleAsync(request);
            var orderedMovies = fakeMovies.Where(q => q.Directors.Select(r => r.Name).Concat(q.Cast.Select(r => r.Name)).Contains("Bruce Willis")).ToList();
            Assert.AreEqual(orderedMovies.Count, result.Items.Count);
            foreach (var fakeMovie in orderedMovies)
            {
                Assert.IsTrue(result.Items.Select(q => q.Property("Id").Value.ToString()).Contains(fakeMovie.Id));
            }
        }

        [Test]
        public async Task Filter_By_Single_Director_Or_Cast_PartialName_Or_Description_LastName_100_Movies()
        {
            var numberOfMovies = 100;
            var fakeMovies = await GenerateAndInsertMovies(numberOfMovies, (m, i) =>
            {
                if (i < 9)
                {
                    if (i % 2 == 0)
                    {
                        m.Directors = new List<Movies.Domain.Core.Person> { new Movies.Domain.Core.Person { Name = "Bruce Willis" } };
                        m.Cast = new List<Movies.Domain.Core.Person> { new Movies.Domain.Core.Person { Name = i.ToString() } };
                        m.Body = i.ToString();
                    }
                    else
                    {
                        m.Cast = new List<Movies.Domain.Core.Person> { new Movies.Domain.Core.Person { Name = "Bruce Willis" } };
                        m.Directors = new List<Movies.Domain.Core.Person> { new Movies.Domain.Core.Person { Name = i.ToString() } };
                        m.Body = i.ToString();
                    }
                }
                else
                {
                    if(i == 10)
                    {
                        m.Directors = new List<Movies.Domain.Core.Person> { new Movies.Domain.Core.Person { Name = i.ToString() } };
                        m.Cast = new List<Movies.Domain.Core.Person> { new Movies.Domain.Core.Person { Name = i.ToString() } };
                        m.Body = m.Body + " " + "Bruce Willis";
                    }
                    else
                    {
                        m.Directors = new List<Movies.Domain.Core.Person> { new Movies.Domain.Core.Person { Name = i.ToString() } };
                        m.Cast = new List<Movies.Domain.Core.Person> { new Movies.Domain.Core.Person { Name = i.ToString() } };
                        m.Body = i.ToString();
                    }
                }
            });
            var request = new PagedRequest<MovieListRequestModel, MovieListModel>(new MovieListRequestModel { Query = "Willis" });
            var result = await _handler.HandleAsync(request);
            var orderedMovies = fakeMovies.Where(q => q.Body.Contains("Bruce Willis") || q.Directors.Select(r => r.Name).Concat(q.Cast.Select(r => r.Name)).Contains("Bruce Willis")).ToList();
            Assert.AreEqual(orderedMovies.Count, result.Items.Count);
            foreach (var fakeMovie in orderedMovies)
            {
                Assert.IsTrue(result.Items.Select(q => q.Property("Id").Value.ToString()).Contains(fakeMovie.Id));
            }
        }

        [Test]
        public async Task Filter_By_Horror_Genre_And_Single_Director_Or_Cast_PartialName_Or_Description_LastName_100_Movies()
        {
            var numberOfMovies = 100;
            var fakeMovies = await GenerateAndInsertMovies(numberOfMovies, (m, i) =>
            {
                if (i < 9)
                {
                    if (i % 2 == 0)
                    {
                        m.Directors = new List<Movies.Domain.Core.Person> { new Movies.Domain.Core.Person { Name = "Bruce Willis" } };
                        m.Cast = new List<Movies.Domain.Core.Person> { new Movies.Domain.Core.Person { Name = i.ToString() } };
                        m.Body = i.ToString();
                        m.Genres = new List<string> { "horror" };
                    }
                    else
                    {
                        m.Cast = new List<Movies.Domain.Core.Person> { new Movies.Domain.Core.Person { Name = "Bruce Willis" } };
                        m.Directors = new List<Movies.Domain.Core.Person> { new Movies.Domain.Core.Person { Name = i.ToString() } };
                        m.Body = i.ToString();
                        m.Genres = new List<string> { i.ToString() };
                    }
                }
                else
                {
                    if (i == 10)
                    {
                        m.Directors = new List<Movies.Domain.Core.Person> { new Movies.Domain.Core.Person { Name = i.ToString() } };
                        m.Cast = new List<Movies.Domain.Core.Person> { new Movies.Domain.Core.Person { Name = i.ToString() } };
                        m.Body = m.Body + " " + "Bruce Willis";
                        m.Genres = new List<string> { "horror" };
                    }
                    else
                    {
                        m.Directors = new List<Movies.Domain.Core.Person> { new Movies.Domain.Core.Person { Name = i.ToString() } };
                        m.Cast = new List<Movies.Domain.Core.Person> { new Movies.Domain.Core.Person { Name = i.ToString() } };
                        m.Body = i.ToString();
                        m.Genres = new List<string> { i.ToString() };
                    }
                }
            });
            var request = new PagedRequest<MovieListRequestModel, MovieListModel>(new MovieListRequestModel { Query = "Willis", Genres = new List<string> { "horror" } });
            var result = await _handler.HandleAsync(request);
            var orderedMovies = fakeMovies
                .Where(q => q.Genres.Contains("horror"))
                .Where(q => q.Body.Contains("Bruce Willis") || q.Directors.Select(r => r.Name).Concat(q.Cast.Select(r => r.Name)).Contains("Bruce Willis")).ToList();
            Assert.AreEqual(orderedMovies.Count, result.Items.Count);
            foreach (var fakeMovie in orderedMovies)
            {
                Assert.IsTrue(result.Items.Select(q => q.Property("Id").Value.ToString()).Contains(fakeMovie.Id));
            }
        }

        [Test]
        public async Task Filter_By_Horror_Or_Comedy_Genre_And_Single_Director_Or_Cast_PartialName_Or_Description_LastName_100_Movies()
        {
            var numberOfMovies = 100;
            var fakeMovies = await GenerateAndInsertMovies(numberOfMovies, (m, i) =>
            {
                if (i < 9)
                {
                    if (i % 2 == 0)
                    {
                        m.Directors = new List<Movies.Domain.Core.Person> { new Movies.Domain.Core.Person { Name = "Bruce Willis" } };
                        m.Cast = new List<Movies.Domain.Core.Person> { new Movies.Domain.Core.Person { Name = i.ToString() } };
                        m.Body = i.ToString();
                        m.Genres = new List<string> { "horror" };
                    }
                    else
                    {
                        m.Cast = new List<Movies.Domain.Core.Person> { new Movies.Domain.Core.Person { Name = "Bruce Willis" } };
                        m.Directors = new List<Movies.Domain.Core.Person> { new Movies.Domain.Core.Person { Name = i.ToString() } };
                        m.Body = i.ToString();
                        m.Genres = new List<string> { i.ToString() };
                    }
                }
                else
                {
                    if (i == 10)
                    {
                        m.Directors = new List<Movies.Domain.Core.Person> { new Movies.Domain.Core.Person { Name = i.ToString() } };
                        m.Cast = new List<Movies.Domain.Core.Person> { new Movies.Domain.Core.Person { Name = i.ToString() } };
                        m.Body = m.Body + " " + "Bruce Willis";
                        m.Genres = new List<string> { "comedy" };
                    }
                    else
                    {
                        m.Directors = new List<Movies.Domain.Core.Person> { new Movies.Domain.Core.Person { Name = i.ToString() } };
                        m.Cast = new List<Movies.Domain.Core.Person> { new Movies.Domain.Core.Person { Name = i.ToString() } };
                        m.Body = i.ToString();
                        m.Genres = new List<string> { i.ToString() };
                    }
                }
            });
            var request = new PagedRequest<MovieListRequestModel, MovieListModel>(new MovieListRequestModel { Query = "Willis", Genres = new List<string> { "horror", "comedy" } });
            var result = await _handler.HandleAsync(request);
            var orderedMovies = fakeMovies
                .Where(q => q.Genres.Contains("horror") || q.Genres.Contains("comedy"))
                .Where(q => q.Body.Contains("Bruce Willis") || q.Directors.Select(r => r.Name).Concat(q.Cast.Select(r => r.Name)).Contains("Bruce Willis")).ToList();
            Assert.AreEqual(orderedMovies.Count, result.Items.Count);
            foreach (var fakeMovie in orderedMovies)
            {
                Assert.IsTrue(result.Items.Select(q => q.Property("Id").Value.ToString()).Contains(fakeMovie.Id));
            }
        }

        [Test]
        public async Task Filter_By_Class_TvShow_And_Horror_Or_Comedy_Genre_And_Single_Director_Or_Cast_PartialName_Or_Description_LastName_100_Movies()
        {
            var numberOfMovies = 100;
            var fakeMovies = await GenerateAndInsertMovies(numberOfMovies, (m, i) =>
            {
                if (i < 9)
                {
                    if (i % 2 == 0)
                    {
                        m.Directors = new List<Movies.Domain.Core.Person> { new Movies.Domain.Core.Person { Name = "Bruce Willis" } };
                        m.Cast = new List<Movies.Domain.Core.Person> { new Movies.Domain.Core.Person { Name = i.ToString() } };
                        m.Body = i.ToString();
                        m.Genres = new List<string> { "horror" };
                        m.Class = "tvshow";
                    }
                    else
                    {
                        m.Cast = new List<Movies.Domain.Core.Person> { new Movies.Domain.Core.Person { Name = "Bruce Willis" } };
                        m.Directors = new List<Movies.Domain.Core.Person> { new Movies.Domain.Core.Person { Name = i.ToString() } };
                        m.Body = i.ToString();
                        m.Genres = new List<string> { i.ToString() };
                        m.Class = i.ToString();
                    }
                }
                else
                {
                    if (i == 10)
                    {
                        m.Directors = new List<Movies.Domain.Core.Person> { new Movies.Domain.Core.Person { Name = i.ToString() } };
                        m.Cast = new List<Movies.Domain.Core.Person> { new Movies.Domain.Core.Person { Name = i.ToString() } };
                        m.Body = m.Body + " " + "Bruce Willis";
                        m.Genres = new List<string> { "comedy" };
                        m.Class = i.ToString();
                    }
                    else
                    {
                        m.Directors = new List<Movies.Domain.Core.Person> { new Movies.Domain.Core.Person { Name = i.ToString() } };
                        m.Cast = new List<Movies.Domain.Core.Person> { new Movies.Domain.Core.Person { Name = i.ToString() } };
                        m.Body = i.ToString();
                        m.Genres = new List<string> { i.ToString() };
                        m.Class = i.ToString();
                    }
                }
            });
            var request = new PagedRequest<MovieListRequestModel, MovieListModel>(new MovieListRequestModel { Query = "Willis", Genres = new List<string> { "horror", "comedy" }, Classes = new List<string> { "tvshow" } });
            var result = await _handler.HandleAsync(request);
            var orderedMovies = fakeMovies
                .Where(q => q.Class == "tvshow")
                .Where(q => q.Genres.Contains("horror") || q.Genres.Contains("comedy"))
                .Where(q => q.Body.Contains("Bruce Willis") || q.Directors.Select(r => r.Name).Concat(q.Cast.Select(r => r.Name)).Contains("Bruce Willis")).ToList();
            Assert.AreEqual(orderedMovies.Count, result.Items.Count);
            foreach (var fakeMovie in orderedMovies)
            {
                Assert.IsTrue(result.Items.Select(q => q.Property("Id").Value.ToString()).Contains(fakeMovie.Id));
            }
        }
    }
}
