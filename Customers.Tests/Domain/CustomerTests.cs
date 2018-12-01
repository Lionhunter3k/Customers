using Customers.Domain.Core;
using Customers.Domain.Services;
using Moq;
using NUnit.Framework;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;
using System.Linq;

namespace Customers.Tests.Domain
{
    [TestFixture]
    public class CustomerTests
    {
        private Mock<ICustomerService> customerServiceMock;
        private ICollection<Customer> customers;
        private string email;
        private string name;
        private string phoneNumber;
        private DateTime dob;

        [SetUp]
        public void Setup()
        {
            this.customerServiceMock = new Mock<ICustomerService>();
            this.customers = new HashSet<Customer>();
            this.email = "test@test.ro";
            this.name = "test test";
            this.phoneNumber = "011111";
            this.dob = DateTime.Today.AddYears(-20);
            customerServiceMock.Setup(t => t.GetCustomerByEmailAsync(It.IsAny<string>())).Returns<string>(e => Task.FromResult(customers.FirstOrDefault(q => q.Email == e)));
        }

        [Test]
        public async Task Customer_Will_Be_Registered_With_An_Agent_Request_Upon_Creation()
        {
          
            var agentRequest = new AgentRequest("0.0.0.0");
            var createdCustomer = await agentRequest.CreateOrUpdateCustomerAsync(email, name, phoneNumber, dob, null, customerServiceMock.Object);
            Assert.AreEqual(1, agentRequest.CreatedCustomers.Count());
            Assert.AreEqual(0, createdCustomer.UpdatedByAgents.Count());
            Assert.AreSame(createdCustomer.CreatedByAgent, agentRequest);
        }

        [Test]
        public async Task Customer_Will_Be_Updated_If_The_Same_Email_Is_Used()
        {

            var agentRequest = new AgentRequest("0.0.0.0");
            var newPhoneNumber = "32132131";
            var createdCustomer = await agentRequest.CreateOrUpdateCustomerAsync(email, name, phoneNumber, dob, null, customerServiceMock.Object);
            customers.Add(createdCustomer);
            var updatedCustomer = await agentRequest.CreateOrUpdateCustomerAsync(email, name, newPhoneNumber, dob, null, customerServiceMock.Object);
            Assert.AreSame(createdCustomer, updatedCustomer);
            Assert.AreEqual(1, createdCustomer.UpdatedByAgents.Count());
            Assert.AreEqual(newPhoneNumber, createdCustomer.PhoneNumber);
        }

        [Test]
        public async Task Customer_Has_A_Fixed_Number_Of_Individual_Change_Requests()
        {
            var agents = new List<AgentRequest>();
            for(var i = 0; i < 10; i++)
            {
                agents.Add(new AgentRequest(i.ToString()));
            }
            var createdCustomer = await agents[0].CreateOrUpdateCustomerAsync(email, name, phoneNumber, dob, null, customerServiceMock.Object);
            createdCustomer.NumberOfIndividualRequests = 9;
            customers.Add(createdCustomer);
            Assert.CatchAsync(typeof(TooManyRequestsException), async () => 
            {
                foreach (var agent in agents)
                {
                    await agent.CreateOrUpdateCustomerAsync(email, name, phoneNumber, dob, null, customerServiceMock.Object);
                }
            });
            
        }
    }
}
