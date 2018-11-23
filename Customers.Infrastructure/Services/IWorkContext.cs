using System;
using System.Collections.Generic;
using System.Text;

namespace Customers.Infrastructure.Services
{
    public interface IWorkContext
    {
        TimeZoneInfo TimeZone { get; }
    }
}
