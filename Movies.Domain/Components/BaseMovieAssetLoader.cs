using Movies.Domain.Extensions;
using Movies.Domain.Services;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;

namespace Movies.Domain.Components
{
    public abstract class BaseMovieAssetLoader : IMovieAssetLoader, IDisposable
    {
        private readonly HttpClient _client;

        private readonly MovieAssetLoaderOptions _movieAssetLoaderOptions;

        public BaseMovieAssetLoader(MovieAssetLoaderOptions movieAssetLoaderOptions)
        {
            this._client = new HttpClient();
            this._movieAssetLoaderOptions = movieAssetLoaderOptions;
        }

        protected abstract Task<string> InternalLoadAssetsAsync(Stream inputStream, Uri uri, string extension);

        public async Task LoadAssetsAsync(JObject moviePayload)
        {
            var leafValues = moviePayload.GetLeafValues();
            foreach (var value in leafValues)
            {
                if (value.Type == JTokenType.String && value.Value is string url && Uri.IsWellFormedUriString(url, UriKind.RelativeOrAbsolute))
                {
                    if (_movieAssetLoaderOptions.AcceptedFileExtensions.Contains(Path.GetExtension(url)))
                    {
                        try
                        {
                            using (var result = await _client.GetAsync(url))
                            {
                                if (result.IsSuccessStatusCode)
                                {
                                    using (var stream = await result.Content.ReadAsStreamAsync())
                                    {
                                        var uri = new Uri(url);
                                        var extension = uri.IsFile ? Path.GetExtension(Path.GetFileName(uri.LocalPath)) : result.Content.Headers.ContentType.MediaType.GetExtension(false);
                                        value.Value = await InternalLoadAssetsAsync(stream, uri, extension);
                                    }
                                }
                            }
                        }
                        catch { }
                    }
                }
            }
        }

        public void Dispose()
        {
            _client.Dispose();
        }
    }
}
