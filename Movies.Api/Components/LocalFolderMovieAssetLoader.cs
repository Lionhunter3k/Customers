using Microsoft.AspNetCore.Hosting;
using Movies.Domain.Components;
using System;
using System.Collections.Generic;
using System.IO;
using System.Text;
using System.Threading.Tasks;

namespace Movies.Api.Components
{
    public class LocalFolderMovieAssetLoader : BaseMovieAssetLoader
    {
        private readonly IHostingEnvironment _hostingEnvironment;

        public LocalFolderMovieAssetLoader(MovieAssetLoaderOptions movieAssetLoaderOptions, IHostingEnvironment hostingEnvironment) : base(movieAssetLoaderOptions)
        {
            this._hostingEnvironment = hostingEnvironment;
        }

        protected override async Task<string> InternalLoadAssetsAsync(Stream inputStream, Uri uri, string extension)
        {
            var localPath = Path.Combine(_hostingEnvironment.WebRootPath, Guid.NewGuid().ToString()) + extension;
            using (var file = File.Create(localPath))
            {
                await inputStream.CopyToAsync(file);
                return "/" + Path.GetFileName(localPath);
            }
        }
    }
}
