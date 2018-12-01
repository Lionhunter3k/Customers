using Movies.Domain.Core;
using System;
using System.Collections.Generic;
using System.IO;
using System.Text;
using System.Threading.Tasks;

namespace Movies.Domain.Services
{
    public interface IMovieParser
    {
        IEnumerator<Movie> ParseMoviesFromJson(Stream inputStream);
    }
}
