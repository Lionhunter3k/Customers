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
        private readonly IRequestHandler<PagedRequest<MovieListRequestModel, MovieListModel>, PagedList<MovieListModel>> _requestHandler;

        public MovieController(IMovieParser movieParser, IMovieIndexer movieIndexer, IRequestHandler<PagedRequest<MovieListRequestModel, MovieListModel>, PagedList<MovieListModel>> requestHandler)
        {
            this._movieParser = movieParser;
            this._movieIndexer = movieIndexer;
            this._requestHandler = requestHandler;
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
            var results = await _requestHandler.HandleAsync(new PagedRequest<MovieListRequestModel, MovieListModel>(model) { Page = page - 1, PageSize = pageSize < 1000 ? pageSize : 1000 });
            return results;
        }
    }
}
