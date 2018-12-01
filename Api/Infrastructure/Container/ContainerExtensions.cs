using Autofac;
using Autofac.Extensions.DependencyInjection;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.DependencyInjection;
using System;

namespace Api.Infrastructure.Container
{
    public static class ContainerExtensions
    {
        public static IServiceProvider AddAutofacProvider(
     this IServiceCollection services,
     Action<ContainerBuilder> builderCallback = null)
        {
            // Instantiate the Autofac builder
            var builder = new ContainerBuilder();

            // If there is a callback use it for registrations
            // Since Autofac will be used for conventional registrations (most of the time), we should override the Autofac registrations with the ones made through AspNet IoC, since the latter are never automatic
            builderCallback?.Invoke(builder);

            // Populate the Autofac container with services
            builder.Populate(services);

            // Create a new container with component registrations
            var container = builder.Build();

            // When application stops then dispose container
            container.Resolve<IApplicationLifetime>()
                .ApplicationStopped.Register(() => container.Dispose());

            // Return the provider
            return container.Resolve<IServiceProvider>();
        }
    }
}
