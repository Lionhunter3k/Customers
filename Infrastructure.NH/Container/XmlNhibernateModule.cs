using Autofac;
using NHibernate.Cfg;
using System.IO;

namespace Infrastructure.NH.Container
{
    public class XmlNhibernateModule : NHibernateModule
    {
        public string XmlCfgFileName { get; set; } = "hibernate.cfg.xml";

        protected override Configuration BuildConfiguration(IComponentContext context)
        {
            if (!string.IsNullOrEmpty(XmlCfgFileName))
            {
                var xmlConfigurationFilePath = XmlCfgFileName;
                if (!string.IsNullOrEmpty(SchemaRootPath))
                    xmlConfigurationFilePath = Path.Combine(SchemaRootPath, XmlCfgFileName);
                var nhConfig = new Configuration().Configure(xmlConfigurationFilePath);
                return nhConfig;
            }
            else
            {
                var nhConfig = new Configuration().Configure();
                return nhConfig;
            }
        }
    }
}
