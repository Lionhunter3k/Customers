using Infrastructure.ElasticSearch.Indexer;
using Movies.Domain.Core;
using Movies.Domain.Services;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace Movies.Domain.Components
{
    public class MovieIndexer : IMovieIndexer
    {
        private readonly IElasticSearchIndexer _elasticSearchIndexer;
        private readonly IMovieAssetLoader _movieAssetLoader;

        public MovieIndexer(IElasticSearchIndexer elasticSearchIndexer, IMovieAssetLoader movieAssetLoader)
        {
            this._elasticSearchIndexer = elasticSearchIndexer;
            this._movieAssetLoader = movieAssetLoader;
        }

        public async Task<int> IndexMoviesAsync(IEnumerator<Movie> movies)
        {
            var chunks = Chunk(movies, 100);
            var pendingIndexers = new List<Task>();
            var indexedMovies = 0;
            _elasticSearchIndexer.UseExistingIndexes = true;
            foreach (var chunk in chunks)
            {
                var pendingAssets = new List<Task>();
                foreach(var movie in chunk)
                {
                    pendingAssets.Add(_movieAssetLoader.LoadAssetsAsync(movie.Data));
                }
                await Task.WhenAll(pendingAssets);
                indexedMovies += chunk.Count;
                pendingIndexers.Add(_elasticSearchIndexer.InsertIndexesAsync(chunk));
            }
            await Task.WhenAll(pendingIndexers);
            return indexedMovies;
        }

        private static IEnumerable<List<Movie>> Chunk<Movie>(
                    IEnumerator<Movie> values,
                    Int32 chunkSize)
        {
            while (values.MoveNext())
            {
                var chunkedCounter = chunkSize;
                var chunkedMovies = new List<Movie>(chunkSize);
                do
                {
                    chunkedMovies.Add(values.Current);
                } while (--chunkedCounter > 0 && values.MoveNext());
                yield return chunkedMovies;
            }
        }
    }
}
