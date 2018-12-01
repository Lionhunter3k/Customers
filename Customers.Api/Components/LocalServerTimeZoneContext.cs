using Infrastructure.Services;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace Customers.Api.Components
{
    public class LocalDateTimeZoneContext : IDateTimeZoneContext
    {
        public Task<DateTime> GetDateTimeLocalAsync()
        {
            return Task.FromResult(DateTime.Now);
        }

        public Task<DateTime> GetDateTimeUtcAsync()
        {
            return Task.FromResult(DateTime.UtcNow);
        }

        public Task<TimeZoneInfo> GetTimeZoneAsync()
        {
            return Task.FromResult(TimeZoneInfo.Local);
        }
    }
}
