using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.DependencyInjection;
using Newtonsoft.Json.Serialization;
using Swashbuckle.AspNetCore.Swagger;
using System;
using System.Collections.Generic;
using System.Text;
using Api.Infrastructure.Container;
using Infrastructure.Container;
using Autofac;
using Movies.Domain.Core;
using Infrastructure.ElasticSearch.Container;
using Elasticsearch.Net;
using Nest;
using Nest.JsonNetSerializer;
using Microsoft.AspNetCore.Http;
using Movies.Queries.Model;
using Movies.Domain.Components;
using Api.Infrastructure;
using Microsoft.Extensions.Configuration;
using CloudinaryDotNet;
using Microsoft.AspNetCore.Routing;

namespace Movies.Api
{
    public class Startup : StartupBase
    {
        public IHostingEnvironment Environment { get; }
        public IConfiguration Configuration { get; }

        public Startup(IHostingEnvironment env, IConfiguration configuration)
        {
            Environment = env;
            Configuration = configuration;
        }

        public override IServiceProvider CreateServiceProvider(IServiceCollection services)
        {
            return services.AddAutofacProvider(builder =>
            {
                var assemblies = new AssemblyRegistry()
                .AddAssemblyFor<Movie>()
                .AddAssemblyFor<MovieListRequestModel>()
                .GetRegisteredAssemblies(Environment.ContentRootPath);

                //services
                var servicesModule = new ServiceModule { Assemblies = assemblies };
                builder.RegisterModule(servicesModule);

                //query module
                var queryModule = new QueryModule { Assemblies = assemblies };
                builder.RegisterModule(queryModule);

                //elasticsearch module
                var elasticModule = new ElasticSearchModule
                {
                    Assemblies = assemblies,
                    ConnectionSettingsFactory = uri =>
                    {
                        var pool = new SingleNodeConnectionPool(uri);
                        var connectionSettings = new ConnectionSettings(pool, JsonNetSerializer.Default);
                        return connectionSettings;
                    }
                };
                builder.RegisterModule(elasticModule);
            });
        }

        public override void ConfigureServices(IServiceCollection services)
        {
            base.ConfigureServices(services);

            services.EagerConfigure<MovieAssetLoaderOptions>(Configuration.GetSection("MovieAssetLoader"));

            services.EagerConfigure<Account>(Configuration.GetSection("Cloudinary"));

            services.AddRouting();

            services
                .AddMvcCore()
                .AddApiExplorer()
                .AddDataAnnotations()
                .AddFormatterMappings()
                .AddJsonFormatters();

            services.AddSwaggerGen(c =>
            {
                c.SwaggerDoc("v1", new Info { Title = "Movies", Version = "v1" });
            });
        }

        private static void InlineRoute(IApplicationBuilder app)
        {
            app.UseRouter(r =>
            {
                r.MapGet("config", async (request, response, routeData) =>
                {
                    var configuration = request.HttpContext.RequestServices.GetService<IConfiguration>();

                    foreach (var connString in configuration.AsEnumerable())
                    {
                        await response.WriteAsync($"{connString.Key}: {connString.Value} \n");
                    }
                });
            });
        }

        public override void Configure(IApplicationBuilder app)
        {
            app.UseDeveloperExceptionPage();

            InlineRoute(app);

            app.MapWhen(context => context.Request.Path.HasValue && context.Request.Path.Value.StartsWith("/v1/movies", StringComparison.InvariantCultureIgnoreCase) && string.Equals(context.Request.Method, "get", StringComparison.InvariantCultureIgnoreCase), spa =>
            {
                spa.Use((context, next) =>
                {
#if DEBUG
                    context.Request.Path = new PathString("/v1/index.debug.html");
#else
                    context.Request.Path = new PathString("/v1/index.html");
#endif
                    return next();
                });

                spa.UseStaticFiles();
            });

            app.UseStaticFiles(new StaticFileOptions { ServeUnknownFileTypes = true }); // For the rest of the static folder

            // Enable middleware to serve swagger-ui (HTML, JS, CSS, etc.),
            // specifying the Swagger JSON endpoint.
            app.UseSwaggerUI(c =>
            {
                c.SwaggerEndpoint("/swagger/v1/swagger.json", "Movies V1");
            });

            // Enable middleware to serve generated Swagger as a JSON endpoint.
            app.UseSwagger();
            app.UseMvc();
        }
    }
}
