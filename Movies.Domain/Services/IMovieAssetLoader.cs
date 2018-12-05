using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace Movies.Domain.Services
{
    public interface IMovieAssetLoader
    {
        Task LoadAssetsAsync(JObject moviePayload);
    }
}
