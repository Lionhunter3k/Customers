using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace Customers.Infrastructure.Queries
{
    public interface IRequestHandler<in TRequest, TResponse>
      where TRequest : IRequest<TResponse>
      where TResponse : IResponse
    {
        Task<TResponse> HandleAsync(TRequest message);
    }
}
