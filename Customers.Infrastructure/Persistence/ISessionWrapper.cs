﻿using NHibernate;
using System;
using System.Collections.Generic;
using System.Data;
using System.Text;

namespace Customers.Infrastructure.Persistence
{
    public interface ISessionWrapper
    {
        ITransaction BeginTransaction();

        ITransaction BeginTransaction(IsolationLevel isolationLevel);

        ITransaction Transaction { get; }

        bool IsConnected { get; }

        bool IsOpen { get; }
    }
}
