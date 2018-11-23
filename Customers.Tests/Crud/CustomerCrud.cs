using Customers.Domain.Core;
using NUnit.Framework;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace Customers.Tests.Crud
{
    [TestFixture]
    public class CustomerCrud : CrudFixture<Customer, long>
    {
        protected override void AssertAreEqual(Customer expectedEntity, Customer actualEntity)
        {
            Assert.AreEqual(expectedEntity.Email, actualEntity.Email);
            Assert.AreEqual(expectedEntity.NumberOfIndividualRequests, actualEntity.NumberOfIndividualRequests);
            Assert.AreEqual(expectedEntity.UpdatedByAgents.Count(), actualEntity.UpdatedByAgents.Count());
        }

        protected override void AssertValidId(Customer entity)
        {
            Assert.IsTrue(entity.Id > 0);
        }

        protected override Customer BuildEntity()
        {
            var customer = new Customer("email@emai.com", "name", "0000", DateTime.Today.AddYears(-20), new AgentRequest("0.0.0"));
            base.Session.Save(customer.CreatedByAgent);
            return customer;
        }

        protected override long ExtractId(Customer entity)
        {
            return entity.Id;
        }

        protected override void ModifyEntity(Customer entity)
        {
            entity.NumberOfIndividualRequests = 20;
        }
    }
}
