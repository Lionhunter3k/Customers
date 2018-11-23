using AutoMapper;
using Customers.Domain.Core;
using Customers.Infrastructure.Mapper;
using Customers.Queries.Model;
using System;
using System.Linq;

namespace Customers.Queries.Mapper
{
    public class CustomerProfile : RecursiveProfile
    {
        public CustomerProfile()
        {
            this.MapLocalDateTimeFromUtc();

            this.CreateMapRecursive<CustomerListModel, Customer>()
                .GetMapFromEntity<Customer, CustomerListModel>(m => m, opt => opt
                    .ForMember(q => q.CanBeUpdated, r => r.MapFrom(t => t.UpdatedByAgents.Count() <= t.NumberOfIndividualRequests)));
        }   
    }
}
