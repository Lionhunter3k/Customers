using AutoMapper;
using Customers.Domain.Core;
using Customers.Queries.Model;
using Infrastructure.Queries;
using Infrastructure.Services;
using NHibernate;
using NHibernate.Linq;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Customers.Queries.Handler
{
    public class CustomerListHandler : IRequestHandler<PagedRequest<CustomerListRequestModel, CustomerListModel>, PagedList<CustomerListModel>>
    {
        private readonly ISession _session;
        private readonly IMapper _mapper;
        private readonly IDateTimeZoneContext _dateTimeZoneContext;

        public CustomerListHandler(ISession session, IMapper mapper, IDateTimeZoneContext dateTimeZoneContext)
        {
            this._session = session;
            this._mapper = mapper;
            this._dateTimeZoneContext = dateTimeZoneContext;
        }

        public async Task<PagedList<CustomerListModel>> HandleAsync(PagedRequest<CustomerListRequestModel, CustomerListModel> message)
        {
            IQueryable<Customer> query = _session.Query<Customer>();
            if (message.Request.MinDateOfBirth.HasValue)
                query = query.Where(q => q.DateOfBirth > message.Request.MinDateOfBirth.Value);
            if (message.Request.MaxDateOfBirth.HasValue)
                query = query.Where(q => q.DateOfBirth < message.Request.MaxDateOfBirth.Value);
            if (!string.IsNullOrEmpty(message.Request.Name))
                query = query.Where(q => q.Name.StartsWith(message.Request.Name));
            if (!string.IsNullOrEmpty(message.Request.PhoneNumber))
                query = query.Where(q => q.PhoneNumber.StartsWith(message.Request.PhoneNumber));
            if (!string.IsNullOrEmpty(message.Request.Email))
                query = query.Where(q => q.Email.StartsWith(message.Request.Email));
            //we should be careful when ordering by dates
            var results = await query.OrderByDescending(q => q.CreatedOnUtc).ThenBy(q => q.Name).Skip(message.Page * message.PageSize).Take(message.PageSize).ToListAsync();
            var count = await query.CountAsync();
            var timeZone = await _dateTimeZoneContext.GetTimeZoneAsync();
            return new PagedList<CustomerListModel>(_mapper.Map<List<CustomerListModel>>(results, opt => opt.Items["currentUserTimeZoneInfo"] = timeZone), message.Page, message.PageSize, count);
        }
    }
}
