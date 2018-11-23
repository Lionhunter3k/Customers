using System;
using System.Collections.Generic;
using System.Text;

namespace Customers.Infrastructure.Queries
{
    //commentary:
    //marker interface to separate results given by application services, which can be mutated and persisted versus
    //results given by application queries, which are immutable and have no side effects
    //in other words, a class which has this interface tells the world it is side effect free
    public interface IResponse { }
}
