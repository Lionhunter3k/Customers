using Customers.Domain.Core;
using NUnit.Framework;
using System;
using System.Collections.Generic;
using System.Text;

namespace Customers.Tests.Crud
{
    [TestFixture]
    public class AgentRequestCrud : CrudFixture<AgentRequest, string>
    {
        protected override void AssertAreEqual(AgentRequest expectedEntity, AgentRequest actualEntity)
        {
            Assert.AreEqual(expectedEntity.Id, actualEntity.Id);
            Assert.AreEqual(expectedEntity.CreatedOnUtc.ToString(), actualEntity.CreatedOnUtc.ToString());
        }

        protected override void AssertValidId(AgentRequest entity)
        {
            Assert.IsNotNull(entity.Id);
        }

        protected override AgentRequest BuildEntity()
        {
            return new AgentRequest("0.0.0.1");
        }

        protected override string ExtractId(AgentRequest entity)
        {
            return entity.Id;
        }

        protected override void ModifyEntity(AgentRequest entity)
        {
        }
    }
}
