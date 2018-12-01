using Api.Filters;
using Api.NH.Filters;
using AutoMapper;
using Customers.Api.Models;
using Customers.Domain.Core;
using Customers.Domain.Services;
using Customers.Queries.Model;
using Infrastructure.NH.Persistence;
using Infrastructure.Queries;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace Customers.Api.Controllers
{
    [TypeFilter(typeof(NHibernateSessionFilter<StatefulSessionWrapper>))]
    [ValidateModelFilter]
    [UnhandledExceptionFilter(ExceptionType = typeof(TooManyRequestsException), Status = System.Net.HttpStatusCode.Forbidden)]
    [UnhandledExceptionFilter]
    public class CustomerController : ControllerBase
    {
        private readonly NHibernate.ISession _session;
        private readonly IMapper _mapper;
        private readonly ICustomerService _customerService;
        private readonly IAgentRequestService _agentRequestService;
        private readonly IRequestHandler<PagedRequest<CustomerListRequestModel, CustomerListModel>, PagedList<CustomerListModel>> _requestHandler;

        public CustomerController(NHibernate.ISession session, IMapper mapper, ICustomerService customerService, IAgentRequestService agentRequestService, IRequestHandler<PagedRequest<CustomerListRequestModel, CustomerListModel>, PagedList<CustomerListModel>> requestHandler)
        {
            this._session = session;
            this._mapper = mapper;
            this._customerService = customerService;
            this._agentRequestService = agentRequestService;
            this._requestHandler = requestHandler;
        }

        [Route("api/[controller]s")]
        [HttpGet]
        public async Task<PagedList<CustomerListModel>> List(CustomerListRequestModel model, int page = 1, int pageSize = 25)
        {
            var results = await _requestHandler.HandleAsync(new PagedRequest<CustomerListRequestModel, CustomerListModel>(model) { Page = page - 1, PageSize = pageSize < 1000 ? pageSize : 1000 });
            return results;
        }

        [Route("api/[controller]")]
        [AcceptVerbs("post", "put")]
        public async Task<CustomerUpsertModel> Upsert([FromBody]CustomerUpsertModel model)
        {
            var agentRequest = await _agentRequestService.GetCurrentAgentRequestAsync();
            var customer = await agentRequest.CreateOrUpdateCustomerAsync(model.Email, model.Name, model.PhoneNumber, model.DateOfBirth.Value, model.LastAddress != null ? _mapper.Map<Address>(model.LastAddress) : null, _customerService);
            await _session.SaveOrUpdateAsync(customer);
            _mapper.Map(customer, model);
            return model;
        }
    }
}
