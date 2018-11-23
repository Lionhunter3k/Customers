using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace Customers.Infrastructure.Queries
{
    [Serializable]
    public class PagedList<T> : IPagedList<T>
    {
        public PagedList(IQueryable<T> source, int pageIndex, int pageSize)
        {
            int total = source.Count();
            this.TotalCount = total;
            this.TotalPages = total / pageSize;

            if (total % pageSize > 0)
                TotalPages++;

            this.PageSize = pageSize;
            this.PageIndex = pageIndex;
            this.Items = source.Skip(pageIndex * pageSize).Take(pageSize).ToList();
        }

        public PagedList(IEnumerable<T> source, int pageIndex, int pageSize)
        {
            TotalCount = source.Count();
            TotalPages = TotalCount / pageSize;

            if (TotalCount % pageSize > 0)
                TotalPages++;

            this.PageSize = pageSize;
            this.PageIndex = pageIndex;
            this.Items = source.Skip(pageIndex * pageSize).Take(pageSize).ToList();
        }

        public PagedList(IEnumerable<T> source, int pageIndex, int pageSize, int totalCount)
        {
            TotalCount = totalCount;
            TotalPages = TotalCount / pageSize;

            if (TotalCount % pageSize > 0)
                TotalPages++;

            this.PageSize = pageSize;
            this.PageIndex = pageIndex;
            this.Items = source.ToList();
        }

        public PagedList(IReadOnlyList<T> source, int pageIndex, int pageSize, int totalCount)
        {
            TotalCount = totalCount;
            TotalPages = TotalCount / pageSize;

            if (TotalCount % pageSize > 0)
                TotalPages++;

            this.PageSize = pageSize;
            this.PageIndex = pageIndex;
            this.Items = source;
        }

        public IReadOnlyList<T> Items { get; }

        public int PageIndex { get; }

        public int PageSize { get;}

        public int TotalCount { get; }

        public int TotalPages { get; }

        public bool HasPreviousPage
        {
            get { return (PageIndex > 0); }
        }

        public bool HasNextPage
        {
            get { return (PageIndex + 1 < TotalPages); }
        }
    }
}
