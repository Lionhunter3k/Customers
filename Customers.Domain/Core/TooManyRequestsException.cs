using System;
using System.Collections.Generic;
using System.Text;

namespace Customers.Domain.Core
{
    public class TooManyRequestsException : InvalidEntityException
    {
        public long CustomerId { get; }

        public int NumberOfIndividualRequests { get; }

        public string AgentIPAddress { get; }

        public TooManyRequestsException(long customerId, int numberOfIndividualRequests, string agentIPAddress)
            :base($"The customer account #{customerId} has exceeded the maximum number of change requests", customerId.ToString())
        {
            this.CustomerId = customerId;
            this.NumberOfIndividualRequests = numberOfIndividualRequests;
            this.AgentIPAddress = agentIPAddress;
        }
    }
}
