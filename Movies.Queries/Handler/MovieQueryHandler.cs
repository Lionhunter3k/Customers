using Elasticsearch.Net;
using Infrastructure.ElasticSearch.Configuration;
using Infrastructure.Queries;
using Movies.Domain.Core;
using Movies.Queries.Model;
using Nest;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Movies.Queries.Handler
{
    public class MovieQueryHandler : IRequestHandler<PagedRequest<MovieListRequestModel, MovieListModel>, PagedList<MovieListModel>>, IRequestHandler<PagedRequest<MovieListRequestModel, GenreAggregateListModel>, PagedList<GenreAggregateListModel>>
    {
        private readonly ElasticClient _elasticClient;

        public MovieQueryHandler(ElasticClient elasticClient)
        {
            this._elasticClient = elasticClient;
        }

        async Task<PagedList<MovieListModel>> IRequestHandler<PagedRequest<MovieListRequestModel, MovieListModel>, PagedList<MovieListModel>>.HandleAsync(PagedRequest<MovieListRequestModel, MovieListModel> message)
        {
            try
            {
                var result = await _elasticClient.SearchAsync<Movie>(s => s.Query(q =>
                {
                    QueryContainer query = BaseQuery(message.Request.Id, message.Request.MinYear, message.Request.MaxYear, message.Request.MinDuration, message.Request.MaxDuration, message.Request.Genres, message.Request.Classes, message.Request.Certs, message.Request.Query, q);
                    return query;
                })
                .From(message.Page * message.PageSize)
                .Size(message.PageSize)
                .Sort(sort =>
                    {
                        if (message.Request.Sort == MovieSort.ByDurationAsc)
                        {
                            return sort.Ascending(p => p.Duration).Descending(SortSpecialField.Score);
                        }
                        if (message.Request.Sort == MovieSort.ByDurationDesc)
                        {
                            return sort.Descending(p => p.Duration).Descending(SortSpecialField.Score);
                        }
                        if (message.Request.Sort == MovieSort.ByHeadlineAsc)
                        {
                            return sort.Ascending(p => p.Headline.Suffix("raw")).Descending(SortSpecialField.Score);
                        }
                        if (message.Request.Sort == MovieSort.ByHeadlineDesc)
                        {
                            return sort.Descending(p => p.Headline.Suffix("raw")).Descending(SortSpecialField.Score);
                        }
                        if (message.Request.Sort == MovieSort.ByYearAsc)
                        {
                            return sort.Ascending(p => p.Year).Descending(SortSpecialField.Score);
                        }
                        if (message.Request.Sort == MovieSort.ByYearDesc)
                        {
                            return sort.Descending(p => p.Year).Descending(SortSpecialField.Score);
                        }
                        return sort.Descending(SortSpecialField.Score);
                    }));
                var movies = new PagedList<MovieListModel>(result.Documents.Select(r => new MovieListModel(r.Data)), message.Page, message.PageSize, (int)result.Total);
                return movies;
            }
            catch(ElasticsearchClientException ex)
            {
                if(ex.Message.Contains("404"))
                {
                    throw new MovieListException("The movie index isn't created :(");
                }
                throw;
            }
        }

        private static QueryContainer BaseQuery(string id, int? minYear, int? maxYear, int? minDuration, int? maxDuration, List<string> genres, List<string> classes, List<string> certs, string query, QueryContainerDescriptor<Movie> q)
        {
            QueryContainer queryContainer = null;
            if (!string.IsNullOrEmpty(id))
                queryContainer &= q.Term(p => p.Id, id);
            if (minYear.HasValue)
            {
                queryContainer &= q.Range(c => c
                   .Field(p => p.Year)
                   .GreaterThanOrEquals(minYear.Value));
            }
            if (maxYear.HasValue)
            {
                queryContainer &= q.Range(c => c
                   .Field(p => p.Year)
                   .LessThanOrEquals(maxYear.Value));
            }
            if (minDuration.HasValue)
            {
                queryContainer &= q.Range(c => c
                   .Field(p => p.Duration)
                   .GreaterThanOrEquals(minDuration.Value));
            }
            if (maxDuration.HasValue)
            {
                queryContainer &= q.Range(c => c
                   .Field(p => p.Duration)
                   .LessThanOrEquals(maxDuration.Value));
            }
            if (genres?.Count > 0)
            {
                queryContainer &= q.Terms(c => c
                    .Field(p => p.Genres)
                    .Terms(genres.Select(t => t.ToLowerInvariant()).ToArray()));
            }
            if (classes?.Count > 0)
            {
                queryContainer &= q.Bool(b => b
                      .Must(mn => mn
                          .Terms(t => t
                              .Field(f => f.Class.Suffix("raw"))
                              .Terms(classes.ToArray())
                              )
                          )
                      );
            }
            if (certs?.Count > 0)
            {
                queryContainer &= q.Bool(b => b
                     .Must(mn => mn
                         .Terms(t => t
                             .Field(f => f.Cert.Suffix("raw"))
                             .Terms(certs.ToArray())
                             )
                         )
                     );
            }
            if (!string.IsNullOrEmpty(query))
            {
                var splittedKeywords = query.ToLowerInvariant().Split(new char[0], StringSplitOptions.RemoveEmptyEntries);
                QueryContainer keywordQuery = null;
                foreach (var splittedKeyword in splittedKeywords)
                {
                    var splittedKeywordQuery = (q.Match(m => m.Field(p => p.Headline).Boost(1000).Query(splittedKeyword))
                                                    ||
                                                    q.MultiMatch(m => m
                                                            .Type(TextQueryType.PhrasePrefix)
                                                            .Fields(f => f
                                                                .Field(p => p.Headline, 1.5)
                                                                .Field(p => p.Body, 0.8)
                                                                .Field(p => p.Synopsis, 0.8)
                                                            )
                                                            .Operator(Operator.Or)
                                                            .Query(splittedKeyword)
                                                        )
                                                    );
                    if (keywordQuery != null)
                    {
                        keywordQuery &= splittedKeywordQuery;
                    }
                    else
                    {
                        keywordQuery = splittedKeywordQuery;
                    }
                }
                queryContainer &=
                (keywordQuery ||
                        q.Nested(nf => nf
                              .Path(p => p.Cast)
                              .Query(nq => nq
                                  .Terms(t => t
                                  .Field(f => f.Cast.First().Name)
                                  .Terms(splittedKeywords))))
                                  || q.Nested(nf => nf
                                        .Path(p => p.Directors)
                                        .Query(nq => nq
                                            .Terms(t => t
                                            .Field(f => f.Directors.First().Name)
                                            .Terms(splittedKeywords)))));
            }

            return queryContainer;
        }

        async Task<PagedList<GenreAggregateListModel>> IRequestHandler<PagedRequest<MovieListRequestModel, GenreAggregateListModel>, PagedList<GenreAggregateListModel>>.HandleAsync(PagedRequest<MovieListRequestModel, GenreAggregateListModel> message)
        {
            try
            {
                var aggResult = await _elasticClient.SearchAsync<Movie>(s => s.Query(q =>
                {
                    QueryContainer query = BaseQuery(message.Request.Id, message.Request.MinYear, message.Request.MaxYear, message.Request.MinDuration, message.Request.MaxDuration, null, message.Request.Classes, message.Request.Certs, message.Request.Query, q);
                    return query;
                }).Aggregations(a => a
                     .Nested("nested_genres", n => n
                         .Path(r => r.Genres)
                         .Aggregations(aa => aa
                             .Terms("genre_names", avg => avg
                                //.From(message.Page * message.PageSize)
                                .Size(10)
                                 .Field(c => c.Genres.Suffix("raw"))
                             )
                         )
                     ))
                .TrackScores(true));
                var nestedCategoryAgg = aggResult.Aggs.Nested("nested_genres");
                var genreNameAgg = nestedCategoryAgg?.Terms("genre_names");
                var genres = new List<GenreAggregateListModel>();
                foreach (var genre in genreNameAgg?.Buckets ?? Enumerable.Empty<Nest.KeyedBucket<string>>())
                {
                    genres.Add(new GenreAggregateListModel { Genre = genre.Key, Count = (int)genre.DocCount.GetValueOrDefault() });
                }
                var result = new PagedList<GenreAggregateListModel>(genres, message.Page, message.PageSize, genres.Count);
                return result;
            }
            catch (ElasticsearchClientException ex)
            {
                if (ex.Message.Contains("404"))
                {
                    throw new MovieListException("The movie index isn't created :(");
                }
                throw;
            }
        }
    }
}
