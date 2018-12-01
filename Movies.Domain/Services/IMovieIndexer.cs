using Movies.Domain.Core;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace Movies.Domain.Services
{
    public interface IMovieIndexer
    {
        Task<int> IndexMoviesAsync(IEnumerator<Movie> movies);
    }
}
