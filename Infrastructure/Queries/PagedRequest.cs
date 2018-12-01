using System;
using System.Collections.Generic;
using System.Text;

namespace Infrastructure.Queries
{
    public class PagedRequest<TRequest, TResponse> : IRequest<PagedList<TResponse>> 
        where TResponse: IResponse
        where TRequest : IRequest<TResponse>
    {

        /// <summary>
        /// Initializes a new instance of the <see cref="AsyncPagedRequest{TRequest, TResponse}"/> class.
        /// </summary>
        /// <param name="request">The request.</param>
        public PagedRequest(TRequest request)
        {
            this.Request = request;
        }

        /// <summary>
        /// Gets the request.
        /// </summary>
        /// <value>The request.</value>
        public TRequest Request { get; }

        /// <summary>
        /// Gets or sets the page.
        /// </summary>
        /// <value>The page.</value>
        public int Page { get; set; }

        /// <summary>
        /// Gets or sets the size of the page.
        /// </summary>
        /// <value>The size of the page.</value>
        public int PageSize { get; set; } = 30;
    }
}
