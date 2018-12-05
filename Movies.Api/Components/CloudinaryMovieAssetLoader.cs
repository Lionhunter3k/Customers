using CloudinaryDotNet;
using CloudinaryDotNet.Actions;
using Movies.Domain.Components;
using System;
using System.IO;
using System.Threading.Tasks;

namespace Movies.Api.Components
{
    public class CloudinaryMovieAssetLoader : BaseMovieAssetLoader
    {
        private readonly Account _account;

        public CloudinaryMovieAssetLoader(MovieAssetLoaderOptions movieAssetLoaderOptions, Account cloudinaryAccountOptions) : base(movieAssetLoaderOptions)
        {
            this._account = cloudinaryAccountOptions;
        }

        protected override async Task<string> InternalLoadAssetsAsync(Stream inputStream, Uri uri, string extension)
        {
            Cloudinary cloudinary = new Cloudinary(_account);
            var uploadParams = new ImageUploadParams()
            {
                File = new FileDescription(Guid.NewGuid() + extension, inputStream)
            };
            var uploadResult = await cloudinary.UploadAsync(uploadParams);
            return uploadResult.Uri.ToString();
        }
    }
}
