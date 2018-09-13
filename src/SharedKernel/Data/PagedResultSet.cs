using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace SharedKernel.Data
{
    public class PagedResultSet<T>
    {
        internal PagedResultSet() { }

        public int PageNumber { get; internal set; }
        public int PageSize { get; internal set; }
        public int ResultCount { get; internal set; }
        public IEnumerable<T> Results { get; internal set; }
        public int TotalCount { get; internal set; }
        public bool IsLastPage()
        {
            return (PageNumber - 1) * PageSize + ResultCount >= TotalCount;
        }


    }

    public static class PagedResultSet
    {
        public static async Task<PagedResultSet<T>> Create<T>(IQueryable<T> results, int pageNumber, int pageSize,
            CancellationToken cancellationToken = default(CancellationToken))
        {
            var returnValue = new PagedResultSet<T>()
            {
                PageNumber = pageNumber,
                PageSize = pageSize
            };
            returnValue.TotalCount = await results.CountAsync(cancellationToken);
            var resultsArray = await results.Skip((pageNumber - 1) * pageSize).Take(pageSize).ToArrayAsync(cancellationToken);
            returnValue.Results = resultsArray;
            returnValue.ResultCount = resultsArray.Length;
            return returnValue;
        }

        public static PagedResultSet<T> Create<T>(IEnumerable<T> results, int pageNumber, int pageSize, int totalCount)
        {
            var returnValue = new PagedResultSet<T>()
            {
                PageNumber = pageNumber,
                PageSize = pageSize
            };
            returnValue.TotalCount = totalCount;
            returnValue.Results = results;
            returnValue.ResultCount = results.Count();
            return returnValue;
        }

    }


}
