using System;
using System.Collections.Generic;
using System.Text;

namespace Infrastructure.Queries
{
    public interface IPagedList<T> : IResponse
    {
        int PageIndex { get; }
        int PageSize { get; }
        int TotalCount { get; }
        int TotalPages { get; }
        bool HasPreviousPage { get; }
        bool HasNextPage { get; }
        IReadOnlyList<T> Items { get; }
    }
}
