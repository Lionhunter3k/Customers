using AutoMapper;
using System;
using System.Collections.Generic;
using System.Text;

namespace Customers.Infrastructure.Mapper
{
    public static class ProfileExtensions
    {
        public static void MapLocalDateTimeFromUtc(this Profile profile)
        {
            profile.RecognizePostfixes("Utc", "utc", "UTC");

            profile.ForAllPropertyMaps(map => map.DestinationPropertyType == typeof(DateTime) && map.SourceType == typeof(DateTime) && map.SourceMember.Name.ToLowerInvariant().EndsWith("utc") && !map.DestinationProperty.Name.ToLowerInvariant().EndsWith("utc"), (map, expression) =>
            {
                expression.ResolveUsing<TimezoneContextDateTimeResolver, DateTime>(map.SourceMember.Name);
            });

            profile.ForAllPropertyMaps(map => map.DestinationPropertyType == typeof(DateTime?) && map.SourceType == typeof(DateTime?) && map.SourceMember.Name.ToLowerInvariant().EndsWith("utc") && !map.DestinationProperty.Name.ToLowerInvariant().EndsWith("utc"), (map, expression) =>
            {
                expression.ResolveUsing<TimezoneContextDateTimeResolver, DateTime?>(map.SourceMember.Name);
            });
        }
    }
}
