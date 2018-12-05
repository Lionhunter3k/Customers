using System;
using System.Collections.Generic;
using System.Text;

namespace Movies.Queries.Handler
{
    public class MovieListException : Exception
    {
        public MovieListException(string message) : base(message)
        {
        }
    }
}
