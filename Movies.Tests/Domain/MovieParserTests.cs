using Movies.Domain.Components;
using NUnit.Framework;
using System;
using System.Collections.Generic;
using System.IO;
using System.Reflection;
using System.Text;

namespace Movies.Tests.Domain
{
    [TestFixture]
    public class MovieParserTests
    {
        [Test]
        public void CanParseOneMovie()
        {
            var movieParser = new MovieParser();
            using (var inputStream = JsonInputBuilder.OpenJsonFile("input_of_1_movie.json"))
            using (var enumerator = movieParser.ParseMoviesFromJson(inputStream))
            {
                Assert.IsTrue(enumerator.MoveNext());
                Assert.AreEqual("8ad589013b496d9f013b4c0b684a4a5d", enumerator.Current.Id);
                Assert.AreEqual(/*"2013-07-15"*/ new DateTime(2013, 7, 15), enumerator.Current.LastUpdated.Date);
                Assert.AreEqual(1, enumerator.Current.Directors.Count);
                Assert.AreEqual("Andy Fickman", enumerator.Current.Directors[0].Name);
                Assert.IsFalse(enumerator.MoveNext());
            }
        }

        [Test]
        public void CanParseTwoMovies()
        {
            var movieParser = new MovieParser();
            using (var inputStream = JsonInputBuilder.OpenJsonFile("input_of_2_movies.json"))
            using (var enumerator = movieParser.ParseMoviesFromJson(inputStream))
            {
                Assert.IsTrue(enumerator.MoveNext());
                Assert.IsTrue(enumerator.MoveNext());
                Assert.AreEqual("8a3e88991f229837011f2308fe39020e", enumerator.Current.Id);
                Assert.IsFalse(enumerator.MoveNext());
            }
        }

        [Test]
        public void CanParse45Movies()
        {
            var movieParser = new MovieParser();
            using (var inputStream = JsonInputBuilder.OpenJsonFile("input_of_45_movies.json"))
            using (var enumerator = movieParser.ParseMoviesFromJson(inputStream))
            {
                var noOfMovies = 0;
                while (enumerator.MoveNext())
                {
                    noOfMovies++;
                }
                Assert.AreEqual(45, noOfMovies);
            }
        }
    }
}
