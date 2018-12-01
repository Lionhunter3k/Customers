using AutoMapper;
using Infrastructure.Services;
using System;
using System.Collections.Generic;
using System.Text;

namespace Infrastructure.AutoMapper.Mapper
{
    public class TimeZoneContextDateTimeResolver : IMemberValueResolver<object, object, DateTime, object>, IMemberValueResolver<object, object, DateTime?, object>
    {
        public object Resolve(object source, object destination, DateTime sourceMember, object destMember, ResolutionContext context)
        {
            sourceMember = DateTime.SpecifyKind(sourceMember, DateTimeKind.Utc);
            if (context.Items.TryGetValue("currentUserTimeZoneInfo", out var objCurrentUserTimeZoneInfo) && objCurrentUserTimeZoneInfo is TimeZoneInfo currentUserTimeZoneInfo)
            {
                return TimeZoneInfo.ConvertTime(sourceMember, currentUserTimeZoneInfo);
            }
            return TimeZoneInfo.ConvertTime(sourceMember, TimeZoneInfo.Local);
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
