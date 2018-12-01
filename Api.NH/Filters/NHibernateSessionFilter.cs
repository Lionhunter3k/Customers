using Infrastructure.NH.Persistence;
using Microsoft.AspNetCore.Mvc.Filters;
using System.Threading.Tasks;

namespace Api.NH.Filters
{
    public class NHibernateSessionFilter<T> : IAsyncActionFilter where T : ISessionWrapper
    {
        public NHibernateSessionFilter(T session)
        {
            this._session = session;
        }

        private readonly T _session;

        public async Task OnActionExecutionAsync(ActionExecutingContext context,
             ActionExecutionDelegate next)
        {
            if (_session.Transaction != null && _session.Transaction.IsActive)
                return;
            _session.BeginTransaction();
            var executedContext = await next();
            if (_session.Transaction == null || !_session.Transaction.IsActive)
                return;
            if (executedContext.Exception != null)
            {
                await _session.Transaction.RollbackAsync();
            }
            else
            {
                await _session.Transaction.CommitAsync();
            }
        }
    }
}
