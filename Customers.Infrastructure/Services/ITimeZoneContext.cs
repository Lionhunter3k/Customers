using System;
using System.Collections.Generic;
using System.Text;

namespace Customers.Infrastructure.Services
{
    public interface ITimeZoneContext
    {
        TimeZoneInfo TimeZone { get; }
    }
}
