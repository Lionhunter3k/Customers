using System;
using System.Collections.Generic;
using System.Text;

namespace Customers.Domain.Core
{
    public class InvalidEntityException : InvalidOperationException
    {
        public string FormattedEntityId { get; }

        public InvalidEntityException(string message, string id) : base(message)
        {
            this.FormattedEntityId = id;
        }
    }
}
