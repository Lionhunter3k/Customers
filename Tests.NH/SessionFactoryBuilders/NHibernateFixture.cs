using NHibernate;
using NHibernate.Cfg;
using NUnit.Framework;
using System;
using System.Collections.Generic;
using System.Text;

namespace Tests.NH.SessionFactoryBuilders
{
    public abstract class NHibernateFixture<T> where T : ISessionFactoryBuilder, new()
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

        protected virtual void OnSessionFactoryCreated() { }

        [OneTimeSetUp]
        public void SessionFactorySetup()
        {
            sessionFactoryBuilder.Configure(this.ChangeConfiguration);
            sessionFactory = sessionFactoryBuilder.BuildSessionFactory();
            OnSessionFactoryCreated();
        }

        protected virtual void OnSessionCreated() { }

        [SetUp]
        public void SessionSetup()
        {
            this.Session = sessionFactoryBuilder.SetupNHibernateSession();
            OnSessionCreated();
        }

        protected virtual void OnSessionTearDown() { }

        [TearDown]
        public void SessionTeardown()
        {
            OnSessionTearDown();
            if (Session != null)
                sessionFactoryBuilder.TearDownNHibernateSession(Session);
        }
    }
}
