using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using System;
using System.Collections.Generic;
using System.Net;
using System.Text;

namespace Customers.Api.Infrastructure.Filters
{
    public class UnhandledExceptionFilterAttribute : ExceptionFilterAttribute
    {
        public HttpStatusCode Status { get; set; } = HttpStatusCode.InternalServerError;

        public Type ExceptionType { get; set; }

        public string ExceptionMessage { get; set; }

        public override void OnException(ExceptionContext context)
        {
            if (context.Result == null)
            {
                if (ExceptionType == null)
                {
                    context.Result = new ObjectResult(new { Message = ExceptionMessage ?? context.Exception.Message, Body = context.Exception.ToString() }) { StatusCode = (int)Status };
                }
                else
                {
                    if (ExceptionType.Equals(context.Exception.GetType()))
                    {
                        context.Result = new ObjectResult(new { context.Exception.Message }) { StatusCode = (int)Status };
                    }
                }
                context.ExceptionHandled = context.Result != null;
            }
        }
    }
}
