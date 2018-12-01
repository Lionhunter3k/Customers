using AutoMapper;
using Customers.Infrastructure.Services;
using System;
using System.Collections.Generic;
using System.Text;

namespace Customers.Infrastructure.Mapper
{
    public class TimezoneContextDateTimeResolver : IMemberValueResolver<object, object, DateTime, object>, IMemberValueResolver<object, object, DateTime?, object>
    {
        private readonly ITimeZoneContext _workContext;

        public TimezoneContextDateTimeResolver(ITimeZoneContext workContext)
        {
            _workContext = workContext ?? throw new ArgumentNullException(nameof(workContext));
        }

        public object Resolve(object source, object destination, DateTime sourceMember, object destMember, ResolutionContext context)
        {
            sourceMember = DateTime.SpecifyKind(sourceMember, DateTimeKind.Utc);
            var currentUserTimeZoneInfo = _workContext.TimeZone;
            return TimeZoneInfo.ConvertTime(sourceMember, currentUserTimeZoneInfo);
        }

        public object Resolve(object source, object destination, DateTime? sourceMember, object destMember, ResolutionContext context)
        {
            if(sourceMember.HasValue)
            {
                return Resolve(source, destination, sourceMember.Value, destMember, context);
            }
            return null;
        }
    }
}
