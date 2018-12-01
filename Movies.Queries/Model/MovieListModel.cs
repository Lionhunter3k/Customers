using Infrastructure.Queries;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Text;

namespace Movies.Queries.Model
{
    public class MovieListModel : JObject, IResponse
    {
        public MovieListModel(JObject other): base(other) { }
    }
}
