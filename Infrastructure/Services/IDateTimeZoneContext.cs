using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace Infrastructure.Services
{
    public interface IDateTimeZoneContext
    {
        Task<TimeZoneInfo> GetTimeZoneAsync();

        Task<DateTime> GetDateTimeLocalAsync();

        Task<DateTime> GetDateTimeUtcAsync();
    }
}
