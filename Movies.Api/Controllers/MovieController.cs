using Api.Filters;
using Infrastructure.Queries;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Movies.Domain.Services;
using Movies.Queries.Handler;
using Movies.Queries.Model;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace Movies.Api.Controllers
{
    [ValidateModelFilter]
    [UnhandledExceptionFilter(ExceptionMessage = "Something bad happened")]
    [UnhandledExceptionFilter(ExceptionType = typeof(MovieListException))]
    public class MovieController : ControllerBase
    {
        private readonly IMovieParser _movieParser;
        private readonly IMovieIndexer _movieIndexer;
        private readonly IRequestHandler<PagedRequest<MovieListRequestModel, MovieListModel>, PagedList<MovieListModel>> _movieRequestHandler;
        private readonly IRequestHandler<PagedRequest<MovieListRequestModel, GenreAggregateListModel>, PagedList<GenreAggregateListModel>> _genreRequestHandler;

        public MovieController(IMovieParser movieParser, 
            IMovieIndexer movieIndexer,
            IRequestHandler<PagedRequest<MovieListRequestModel, MovieListModel>, PagedList<MovieListModel>> requestHandler,
            IRequestHandler<PagedRequest<MovieListRequestModel, GenreAggregateListModel>, PagedList<GenreAggregateListModel>> genreRequestHandler)
        {
            this._movieParser = movieParser;
            this._movieIndexer = movieIndexer;
            this._movieRequestHandler = requestHandler;
            this._genreRequestHandler = genreRequestHandler;
        }

        [Route("api/[controller]s")]
        [AcceptVerbs("post", "put")]
        public async Task<IActionResult> Upsert(IFormFile dataSet)
        {
            using(var dataSetStream = dataSet.OpenReadStream())
            using (var parsedMovies = _movieParser.ParseMoviesFromJson(dataSetStream))
            {
                var noOfIndexedMovies = await _movieIndexer.IndexMoviesAsync(parsedMovies);
                return base.Ok(new { noOfIndexedMovies });
            }
        }

        [Route("api/[controller]s")]
        [HttpGet]
        public async Task<PagedList<MovieListModel>> List(MovieListRequestModel model, int page = 1, int pageSize = 25)
        {
            var results = await _movieRequestHandler.HandleAsync(new PagedRequest<MovieListRequestModel, MovieListModel>(model) { Page = page - 1, PageSize = pageSize < 1000 ? pageSize : 1000 });
            return results;
        }

        [Route("api/[controller]/genres")]
        [HttpGet]
        public async Task<PagedList<GenreAggregateListModel>> AggregateGenres(MovieListRequestModel model, int pageSize = 25)
        {
            var results = await _genreRequestHandler.HandleAsync(new PagedRequest<MovieListRequestModel, GenreAggregateListModel>(model) { Page = 0, PageSize = pageSize < 1000 ? pageSize : 1000 });
            return results;
        }
    }
}
