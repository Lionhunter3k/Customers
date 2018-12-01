using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using NHibernate;
using NHibernate.Cfg;
using NHibernate.Tool.hbm2ddl;

namespace Tests.NH.SessionFactoryBuilders
{
    public class SQLiteHbmSessionFactoryBuilder : ISessionFactoryBuilder
    {
        private Lazy<Configuration> _cfg = new Lazy<Configuration>(CreateConfiguration);

        private static FileHelper fileHelper = new FileHelper();

        private static Configuration CreateConfiguration()
        {
            fileHelper.DeletePreviousDbFiles();
            var dbFile = fileHelper.GetDbFileName();
            var cfg = new Configuration();
            cfg.AddProperties(new Dictionary<string, string>
                                                {
                                                    { NHibernate.Cfg.Environment.ConnectionDriver, "NHibernate.Driver.SQLite20Driver, NHibernate" },
                                                    { NHibernate.Cfg.Environment.Dialect, "NHibernate.Dialect.SQLiteDialect, NHibernate" },
                                                    { NHibernate.Cfg.Environment.ConnectionString, string.Format("Data Source={0};Version=3;New=True;", dbFile) }
                                                });
            cfg.Configure();
            var schemaExport = new SchemaExport(cfg);
            schemaExport.Create(true, true);
            return cfg;
        }

        private ISessionFactory sessionFactory;

        private Action<NHibernate.Cfg.Configuration> _customConfig;

        public ISessionFactory BuildSessionFactory()
        {
            if (this.sessionFactory == null)
                this.sessionFactory = this.GetSessionFactory();
            return this.sessionFactory;
        }

        private ISessionFactory GetSessionFactory()
        {
            if (_customConfig != null)
            {
                _customConfig(_cfg.Value);
            }
            return _cfg.Value.BuildSessionFactory();
        }


        public Configuration Configuration
        {
            get { return _cfg.Value; }
        }


        public ISession SetupNHibernateSession()
        {
            var session = this.BuildSessionFactory().OpenSession();
            session.BeginTransaction();
            return session;
        }

        public void TearDownNHibernateSession(ISession session)
        {

            try
            {
                if (session.Transaction != null)
                    session.Transaction.Dispose();
            }
            catch 
            {
            }
            try
            {
                session.Dispose();
            }
            catch
            {
            }
        }


        public void Configure(Action<Configuration> configure)
        {
            this._customConfig = configure;
        }
    }
}
