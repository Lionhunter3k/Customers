using System;
using System.Collections.Generic;
using System.Text;

namespace Infrastructure.Queries
{
    public interface IRequest<out TResponse> where TResponse : IResponse { }
}
