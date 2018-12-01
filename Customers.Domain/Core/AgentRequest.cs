using Customers.Domain.Services;
using Domain.Core;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace Customers.Domain.Core
{
    public class AgentRequest : BaseEntity<string>
    {
        //commentary:
        //datetime fields should be store at minimum as Utc, to avoid local time conflicts if we had multiple applications on different
        //servers; we could outsource the retrieval of the date to a NTP server, if we really need to be precise
        public virtual DateTime CreatedOnUtc { get; protected set; }

        public virtual DateTime LastRequestOnUtc { get; protected set; }

        public virtual IEnumerable<Customer> CreatedCustomers { get => _createdCustomers; }

        private readonly ISet<Customer> _createdCustomers = new HashSet<Customer>();

        public virtual IEnumerable<Customer> UpdatedCustomers { get => _updatedCustomers; }

        private ISet<Customer> _updatedCustomers = new HashSet<Customer>();

        public AgentRequest(string ipAddress)
        {
            Id = ipAddress;
            CreatedOnUtc = DateTime.UtcNow;
            LastRequestOnUtc = DateTime.UtcNow;
        }

        protected AgentRequest()
        {
        }

        //commentary:
        //the application processes should be encapsulated in persisted objects
        //this way, the application rules can be easily enforced
        //application rules are anything than can come out of a specification, like the maximum number of change requests a customer can have
        //on the other hand, application infrastructure is stateless (the state of the object is not persisted or it doesn't have any), like our ICustomerService interface
        //What is an application process? Registering or updating a customer, depending on the application state
        //What is an application infrastructure? Database queries for existing customers by email
        public virtual async Task<Customer> CreateOrUpdateCustomerAsync(string email, string name, string phoneNumber, DateTime dateOfBirth, Address address, ICustomerService customerService)
        {
            var customer = await customerService.GetCustomerByEmailAsync(email);
            if(customer == null)
            {
                customer = address == null ? new Customer(email, name, phoneNumber, dateOfBirth, this) : new Customer(email, name, phoneNumber, dateOfBirth, address, this);
                _createdCustomers.Add(customer);
            }
            else
            {
                customer.InitializeChangeRequest(this);
                customer.UpdateProfile(name, phoneNumber, dateOfBirth);
                if (address != null)
                    customer.UpdateAddress(address);
                customer.CloseChangeRequest();
            }
            LastRequestOnUtc = DateTime.UtcNow;
            return customer;
        }
    }
}
