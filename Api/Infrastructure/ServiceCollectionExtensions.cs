using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Options;
using System;
using System.Collections.Generic;
using System.Text;

namespace Api.Infrastructure
{
    public static class ServiceCollectionExtensions
    {
        public static IServiceCollection ConfigureAndUnwrap<TOptions>(this IServiceCollection services, IConfiguration config) where TOptions : class, new()
        {
            services.Configure<TOptions>(config);
            services.AddScoped(sp => sp.GetService<IOptionsMonitor<TOptions>>().CurrentValue);
            return services;
        }

        public static IServiceCollection EagerConfigure<TConfig>(this IServiceCollection services, IConfiguration configuration) where TConfig : class, new()
        {
            return services.EagerConfigure(configuration, new TConfig());
        }

        public static IServiceCollection EagerConfigure<TConfig>(this IServiceCollection services, IConfiguration configuration, TConfig config) where TConfig : class
        {
            if (services == null) throw new ArgumentNullException(nameof(services));
            if (configuration == null) throw new ArgumentNullException(nameof(configuration));
            if (config == null) throw new ArgumentNullException(nameof(config));

            configuration.Bind(config);
            services.AddSingleton(config);
            return services;
        }

    
    }
}
