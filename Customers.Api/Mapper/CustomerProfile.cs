using Customers.Api.Models;
using Customers.Domain.Core;
using Customers.Infrastructure.Mapper;
using System;
using System.Linq;

namespace Customers.Api.Mapper
{
    public class CustomerProfile : RecursiveProfile
    {
        public CustomerProfile()
        {
            this.CreateMap<Address, AddressUpsertModel>(AutoMapper.MemberList.Destination)
                .ReverseMap();

            this.CreateMapRecursive<CustomerUpsertModel, Customer>()
                .GetMapFromEntity<Customer, CustomerUpsertModel>(m => m, opt => opt.ForMember(q => q.LastAddress, r => r.MapFrom(t => t.Addresses.LastOrDefault())));
        }
    }
}
