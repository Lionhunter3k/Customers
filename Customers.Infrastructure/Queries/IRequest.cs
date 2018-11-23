using System;
using System.Collections.Generic;
using System.Text;

namespace Customers.Infrastructure.Queries
{
    public interface IRequest<out TResponse> where TResponse : IResponse { }
}
