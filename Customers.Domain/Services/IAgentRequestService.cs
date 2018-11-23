using Customers.Domain.Core;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace Customers.Domain.Services
{
    public interface IAgentRequestService
    {
        Task<AgentRequest> GetCurrentAgentRequestAsync();
    }
}
