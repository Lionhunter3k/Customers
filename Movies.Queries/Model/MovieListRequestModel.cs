using Infrastructure.Queries;
using System;
using System.Collections.Generic;
using System.Text;

namespace Movies.Queries.Model
{
    public class MovieListRequestModel : IRequest<MovieListModel>, IRequest<GenreAggregateListModel>
    {
        public List<string> Classes { get; set; } = new List<string>();

        public List<string> Certs { get; set; } = new List<string>();

        public List<string> Genres { get; set; } = new List<string>();

        public int? MinYear { get; set; }

        public int? MaxYear { get; set; }

        public int? MinDuration { get; set; }

        public int? MaxDuration { get; set; }

        public string Query { get; set; }

        public MovieSort Sort { get; set; }

        public string Id { get; set; }
    }

    public enum MovieSort
    {
        ByRelevance,
        ByHeadlineAsc,
        ByHeadlineDesc,
        ByYearAsc,
        ByYearDesc,
        ByDurationAsc,
        ByDurationDesc
    }
}
