﻿using NHibernate;
using NHibernate.Cfg;
using System;
using System.Collections.Generic;
using System.Text;

namespace Customers.Tests.SessionFactoryBuilders
{
    public interface ISessionFactoryBuilder
    {
        ISessionFactory BuildSessionFactory();

        Configuration Configuration { get; }

        ISession SetupNHibernateSession();

        void TearDownNHibernateSession(ISession session);

        void Configure(Action<Configuration> configure);
    }
}
