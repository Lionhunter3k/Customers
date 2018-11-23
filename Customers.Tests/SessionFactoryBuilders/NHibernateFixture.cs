using NHibernate;
using NHibernate.Cfg;
using System;
using System.Collections.Generic;
using System.Text;

namespace Customers.Tests.SessionFactoryBuilders
{
    public abstract class NHibernateFixture<T> : BaseFixture where T : ISessionFactoryBuilder, new()
    {
        private static ISessionFactoryBuilder sessionFactoryBuilder = new T();

        private static ISessionFactory sessionFactory;

        protected ISessionFactory SessionFactory
        {
            get
            {
                return sessionFactory;
            }
        }

        protected ISession Session { get; private set; }


        protected virtual void ChangeConfiguration(Configuration cfg)
        {
        }

        protected override void OnFixtureSetup()
        {
            sessionFactoryBuilder.Configure(this.ChangeConfiguration);
            sessionFactory = sessionFactoryBuilder.BuildSessionFactory();
            base.OnFixtureSetup();
        }

        protected override void OnSetup()
        {
            this.Session = sessionFactoryBuilder.SetupNHibernateSession();
            base.OnSetup();
        }

        protected override void OnTeardown()
        {
            if (Session != null)
                sessionFactoryBuilder.TearDownNHibernateSession(Session);
            base.OnTeardown();
        }
    }
}
