using Customers.Domain.Core;
using Infrastructure.Model;
using Infrastructure.Queries;
using System;
using System.Collections.Generic;
using System.Text;

namespace Customers.Queries.Model
{
    public class CustomerListModel : IRootModel<Customer>, IResponse
    {
        public long Id { get; set; }

        public string Email { get; set; }

        public string Name { get; set; }

        public string PhoneNumber { get; set; }

        public int NumberOfIndividualRequests { get; set; } = 4;

        public DateTime DateOfBirth { get; set; }

        public DateTime CreatedOn { get; set; }

        public DateTime UpdatedOn { get; set; }

        public string CreatedByAgentId { get; set; }

        public bool CanBeUpdated { get; set; }

        public List<AddressListModel> Addresses { get; set; } = new List<AddressListModel>();
    }

    public class AddressListModel
    {
        public string Street { get; set; }

        public string Town { get; set; }

        public string ZipCode { get; set; }

        public string Country { get; set; }

        public DateTime CreatedOn { get; set; }
    }
}
