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
    public class MovieListHandler : IRequestHandler<PagedRequest<MovieListRequestModel, MovieListModel>, PagedList<MovieListModel>>
    {
        private readonly ElasticClient _elasticClient;

        public MovieListHandler(ElasticClient elasticClient)
        {
            this._elasticClient = elasticClient;
        }

        public async Task<PagedList<MovieListModel>> HandleAsync(PagedRequest<MovieListRequestModel, MovieListModel> message)
        {
            try
            {
                var result = await _elasticClient.SearchAsync<Movie>(s => s.Query(q =>
                {
                    QueryContainer query = null;
                    if (!string.IsNullOrEmpty(message.Request.Id))
                        query &= q.Term(p => p.Id, message.Request.Id);
                    if (message.Request.MinYear.HasValue)
                    {
                        query &= q.Range(c => c
                           .Field(p => p.Year)
                           .GreaterThanOrEquals(message.Request.MinYear.Value));
                    }
                    if (message.Request.MaxYear.HasValue)
                    {
                        query &= q.Range(c => c
                           .Field(p => p.Year)
                           .LessThanOrEquals(message.Request.MaxYear.Value));
                    }
                    if (message.Request.MinDuration.HasValue)
                    {
                        query &= q.Range(c => c
                           .Field(p => p.Duration)
                           .GreaterThanOrEquals(message.Request.MinDuration.Value));
                    }
                    if (message.Request.MaxDuration.HasValue)
                    {
                        query &= q.Range(c => c
                           .Field(p => p.Duration)
                           .LessThanOrEquals(message.Request.MaxDuration.Value));
                    }
                    if (message.Request.Genres?.Count > 0)
                    {
                        query &= q.Terms(c => c
                            .Field(p => p.Genres)
                            .Terms(message.Request.Genres.ToArray()));
                    }
                    if (message.Request.Classes?.Count > 0)
                    {
                        query &= q.Bool(b => b
                              .Must(mn => mn
                                  .Terms(t => t
                                      .Field(f => f.Class.Suffix("raw"))
                                      .Terms(message.Request.Classes.ToArray())
                                      )
                                  )
                              );
                    }
                    if (message.Request.Certs?.Count > 0)
                    {
                        query &= q.Bool(b => b
                             .Must(mn => mn
                                 .Terms(t => t
                                     .Field(f => f.Cert.Suffix("raw"))
                                     .Terms(message.Request.Certs.ToArray())
                                     )
                                 )
                             );
                    }
                    if (!string.IsNullOrEmpty(message.Request.Query))
                    {
                        var splittedKeywords = message.Request.Query.ToLowerInvariant().Split(new char[0], StringSplitOptions.RemoveEmptyEntries);
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
                        query &=
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
    }
}
