using Customers.Domain.Core;
using Customers.Domain.Services;
using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace Customers.Api.Components
{
    public class HttpAgentRequestService : IAgentRequestService
    {
        private readonly IHttpContextAccessor _httpContextAccessor;
        private readonly NHibernate.ISession _session;

        public HttpAgentRequestService(IHttpContextAccessor httpContextAccessor, NHibernate.ISession session)
        {
            this._httpContextAccessor = httpContextAccessor;
            this._session = session;
        }

        public async Task<AgentRequest> GetCurrentAgentRequestAsync()
        {
            var httpRequest = _httpContextAccessor.HttpContext;
            var ipAddress = httpRequest.Connection.RemoteIpAddress.ToString();
            var previousAgentRequest = await _session.GetAsync<AgentRequest>(ipAddress);
            if(previousAgentRequest == null)
            {
                previousAgentRequest = new AgentRequest(ipAddress);
                await _session.SaveAsync(previousAgentRequest);
            }
            return previousAgentRequest;
        }
    }
}
