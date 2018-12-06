using Infrastructure.Queries;
using System;
using System.Collections.Generic;
using System.Text;

namespace Movies.Queries.Model
{
    public class GenreAggregateListModel : IResponse
    {
        public string Genre { get; set; }

        public int Count { get; set; }
    }
}
