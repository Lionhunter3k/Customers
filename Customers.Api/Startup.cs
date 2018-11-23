using Autofac;
using Customers.Api.Infrastructure.Container;
using Customers.Domain.Core;
using Customers.Infrastructure.Container;
using Customers.Infrastructure.Services;
using Customers.Queries.Model;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.DependencyInjection;
using Newtonsoft.Json.Serialization;
using NHibernate.Tool.hbm2ddl;
using Swashbuckle.AspNetCore.Swagger;
using System;

namespace Customers.Api
{
    public class Startup : StartupBase
    {
        public IHostingEnvironment Environment { get; }

        public Startup(IHostingEnvironment env)
        {
            Environment = env;
        }

        public override IServiceProvider CreateServiceProvider(IServiceCollection services)
        {
            return services.AddAutofacProvider(builder =>
            {
                var assemblies = new AssemblyRegistry()
                .AddAssemblyFor<Startup>()
                .AddAssemblyFor<IWorkContext>()
                .AddAssemblyFor<Customer>()
                .AddAssemblyFor<CustomerListModel>();

                //nhibernate
                var nhibernateModule = new XmlNhibernateModule()
                {
                    SchemaRootPath = Environment.ContentRootPath,
                    XmlCfgFileName = "hibernate.cfg.sqlite.xml",
                };

                nhibernateModule.OnConfigurationCreated += CreateSchema;

                builder.RegisterModule(nhibernateModule);

                //services
                var servicesModule = new ServiceModule { Assemblies = assemblies };
                builder.RegisterModule(servicesModule);

                //automapper
                var automapperModule = new AutoMapperModule { Assemblies = assemblies };
                builder.RegisterModule(automapperModule);

                //query module
                var queryModule = new QueryModule { Assemblies = assemblies };
                builder.RegisterModule(queryModule);
            });
        }

        private static void CreateSchema(object sender, NHibernate.Cfg.Configuration cfg)
        {
            var schemaExport = new SchemaExport(cfg);
            schemaExport.Create(false, true);
        }

        public override void ConfigureServices(IServiceCollection services)
        {
            base.ConfigureServices(services);

            services.AddRouting();

            services
                .AddMvcCore()
                .AddApiExplorer()
                .AddDataAnnotations()
                .AddFormatterMappings()
                .AddJsonFormatters(settings =>
                {
                    settings.ContractResolver = new DefaultContractResolver();
                });

            services.AddHttpContextAccessor();

            services.AddSwaggerGen(c =>
            {
                c.SwaggerDoc("v1", new Info { Title = "Customers", Version = "v1" });
            });
        }

        public override void Configure(IApplicationBuilder app)
        {
            app.UseDeveloperExceptionPage();
            // Enable middleware to serve swagger-ui (HTML, JS, CSS, etc.), 
            // specifying the Swagger JSON endpoint.
            app.UseSwaggerUI(c =>
            {
                c.SwaggerEndpoint("/swagger/v1/swagger.json", "Customers V1");
            });

            // Enable middleware to serve generated Swagger as a JSON endpoint.
            app.UseSwagger();
            app.UseMvc();
        }
    }
}
