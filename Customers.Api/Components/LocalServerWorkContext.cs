using Customers.Infrastructure.Services;
using System;
using System.Collections.Generic;
using System.Text;

namespace Customers.Api.Components
{
    public class LocalServerWorkContext : IWorkContext
    {
        public TimeZoneInfo TimeZone => TimeZoneInfo.Local;
    }
}
