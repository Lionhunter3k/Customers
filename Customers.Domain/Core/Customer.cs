using System;
using System.Collections.Generic;
using System.Text;

namespace Customers.Domain.Core
{
    //commentary:
    //persisted entities should protect their own state, according to encapsulation principles
    public class Customer : BaseEntity<long>
    {
        public virtual string Email { get; protected set; }

        public virtual string Name { get; protected set; }

        public virtual string PhoneNumber { get; protected set; }

        public virtual int NumberOfIndividualRequests { get; set; } = 4;

        public virtual DateTime DateOfBirth { get; protected set; }

        public virtual DateTime CreatedOnUtc { get; protected set; }

        public virtual DateTime UpdatedOnUtc { get; protected set; }

        public virtual AgentRequest CreatedByAgent { get; protected set; }

        //commentary:
        //a many to many implicit relationship
        //we could map an explicit entity to represent the Customer <-> AgentRequest mapping, so that we could save
        //relationship specific fields, like when was the mapping created
        public virtual IEnumerable<AgentRequest> UpdatedByAgents { get => _updatedByAgents; }

        private ISet<AgentRequest> _updatedByAgents = new HashSet<AgentRequest>();

        public virtual IEnumerable<Address> Addresses { get => _addresses; }

        private ISet<Address> _addresses = new HashSet<Address>();

        //commentary:
        //nHibernate tax
        protected Customer()
        {
        }

        public Customer(string email, string name, string phoneNumber, DateTime dateOfBirth, Address address, AgentRequest agentRequest)
            : this(email, name, phoneNumber, dateOfBirth, agentRequest)
        {
            if (address == null)
            {
                throw new ArgumentException("Address cannot be null or empty", nameof(address));
            }
            _addresses.Add(address);
        }

        public Customer(string email, string name, string phoneNumber, DateTime dateOfBirth, AgentRequest agentRequest)
        {
            if (string.IsNullOrEmpty(email))
            {
                //commentary:
                //use system exceptions when it makes sense
                throw new ArgumentException("Email cannot be null or empty", nameof(email));
            }

            ValidateProfile(name, phoneNumber, dateOfBirth);
            Email = email;
            Name = name;
            PhoneNumber = phoneNumber;
            DateOfBirth = dateOfBirth;
            CreatedByAgent = agentRequest;
            CreatedOnUtc = DateTime.UtcNow;
            UpdatedOnUtc = DateTime.UtcNow;
        }

        private void ValidateProfile(string name, string phoneNumber, DateTime dateOfBirth)
        {
            if (string.IsNullOrEmpty(name))
            {
                throw new ArgumentException("Name cannot be null or empty", nameof(name));
            }

            if (string.IsNullOrEmpty(phoneNumber))
            {
                throw new ArgumentException("Phone number cannot be null or empty", nameof(phoneNumber));
            }

            if (dateOfBirth > DateTime.Today)
            {
                throw new ArgumentException("Date of birth cannot be in the future", nameof(dateOfBirth));
            }
        }

        //commentary:
        //use transient state to leverage terse code
        private bool _canBeChangedByRequest = false;

        public virtual void InitializeChangeRequest(AgentRequest agentRequest)
        {
            _updatedByAgents.Add(agentRequest);
            if (NumberOfIndividualRequests >= _updatedByAgents.Count)
            {
                UpdatedOnUtc = DateTime.UtcNow;
                _canBeChangedByRequest = true;
            }
            else
            {
                //commentary:
                //use custom exceptions when application processes fail because of a rule enforced by the *our* specification, not the language, or the runtime
                throw new TooManyRequestsException(this.Id, NumberOfIndividualRequests, agentRequest.Id);
            }
        }

        public virtual void CloseChangeRequest()
        {
            _canBeChangedByRequest = false;
        }

        public virtual void UpdateProfile(string name, string phoneNumber, DateTime dateOfBirth)
        {
            if (!_canBeChangedByRequest)
                throw new InvalidEntityException("We must assign a change request in order to update a customer's profile", this.Id.ToString());
            ValidateProfile(name, phoneNumber, dateOfBirth);
            Name = name;
            PhoneNumber = phoneNumber;
            DateOfBirth = dateOfBirth;
        }

        public virtual void UpdateAddress(Address address)
        {
            if (!_canBeChangedByRequest)
                throw new InvalidEntityException("We must assign a change request in order to update a customer's address", this.Id.ToString());
            if (address == null)
            {
                throw new ArgumentNullException("Address cannot be null", nameof(address));
            }
            _addresses.Add(address);
        }
    }
}
