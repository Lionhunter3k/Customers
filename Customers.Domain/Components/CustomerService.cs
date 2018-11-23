using Customers.Domain.Core;
using Customers.Domain.Services;
using NHibernate;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;
using System.Linq;
using NHibernate.Linq;

namespace Customers.Domain.Components
{
    public class CustomerService : ICustomerService
    {
        private readonly ISession _session;

        public CustomerService(ISession session)
        {
            this._session = session;
        }

        public async Task<Customer> GetCustomerByEmailAsync(string email)
        {
            var existingCustomer = await _session.Query<Customer>().Where(q => q.Email == email).SingleOrDefaultAsync();
            return existingCustomer;
        }
    }
}
