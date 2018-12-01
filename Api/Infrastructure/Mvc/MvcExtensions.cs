using Microsoft.AspNetCore.Mvc.Abstractions;
using Microsoft.AspNetCore.Mvc.ApplicationParts;
using Microsoft.AspNetCore.Mvc.Controllers;
using Microsoft.AspNetCore.Mvc.Filters;
using Microsoft.AspNetCore.Mvc.Infrastructure;
using Microsoft.AspNetCore.Mvc.Internal;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.DependencyInjection.Extensions;
using System;
using System.Linq;
using System.Reflection;

namespace Api.Infrastructure.Mvc
{
    //commentary:
    //fine grained service registration for the MVC Core pipeline
    public static class MvcExtensions
    {
        public static IMvcCoreBuilder ConfigureActionInvokers(this IMvcCoreBuilder mvcServiceBuilder, Func<IServiceProvider, IActionInvokerFactory> actionInvokerFactory = null, Func<IServiceProvider, IActionInvokerProvider> actionInvokerProvider = null)
        {
            if (actionInvokerFactory == null)
                mvcServiceBuilder.Services.Replace(ServiceDescriptor.Singleton<IActionInvokerFactory, ActionInvokerFactory>());
            else
            {
                mvcServiceBuilder.Services.Replace(ServiceDescriptor.Singleton(actionInvokerFactory));
            }
            mvcServiceBuilder.Services.RemoveAll<IActionInvokerProvider>();
            if (actionInvokerProvider == null)
                mvcServiceBuilder.Services.TryAddEnumerable(ServiceDescriptor.Transient<IActionInvokerProvider, ControllerActionInvokerProvider>());
            else
            {
                mvcServiceBuilder.Services.TryAddEnumerable(ServiceDescriptor.Transient(actionInvokerProvider));
            }
            return mvcServiceBuilder;
        }

        public static IMvcCoreBuilder ConfigureControllerFactories(this IMvcCoreBuilder mvcServiceBuilder,
            Func<IServiceProvider, IControllerActivatorProvider> controllerActivatorProvider = null,
            Func<IServiceProvider, IControllerActivator> controllerActivator = null,
            Func<IServiceProvider, IControllerFactoryProvider> controllerFactoryProvider = null,
            Func<IServiceProvider, IControllerFactory> controllerFactory = null)
        {
            if (controllerActivatorProvider == null)
                mvcServiceBuilder.Services.Replace(ServiceDescriptor.Singleton<IControllerActivatorProvider, ControllerActivatorProvider>());
            else
            {
                mvcServiceBuilder.Services.Replace(ServiceDescriptor.Singleton(controllerActivatorProvider));
            }
            if (controllerActivator == null)
                mvcServiceBuilder.Services.Replace(ServiceDescriptor.Transient<IControllerActivator, DefaultControllerActivator>());
            else
            {
                mvcServiceBuilder.Services.Replace(ServiceDescriptor.Transient(controllerActivator));
            }
            if (controllerFactoryProvider == null)
                mvcServiceBuilder.Services.Replace(ServiceDescriptor.Singleton<IControllerFactoryProvider, ControllerFactoryProvider>());
            else
            {
                mvcServiceBuilder.Services.Replace(ServiceDescriptor.Singleton(controllerFactoryProvider));
            }
            if (controllerFactory == null)
                mvcServiceBuilder.Services.Replace(ServiceDescriptor.Singleton<IControllerFactory, DefaultControllerFactory>());
            else
            {
                mvcServiceBuilder.Services.Replace(ServiceDescriptor.Singleton(controllerFactory));
            }
            //mvcServiceBuilder.AddControllersAsServices();
            //the line above does the following:
            //mvcServiceBuilder.Services.Replace(ServiceDescriptor.Transient<IControllerActivator, ServiceBasedControllerActivator>());
            return mvcServiceBuilder;
        }

        public static IMvcCoreBuilder ConfigureFilterFactories(this IMvcCoreBuilder mvcServiceBuilder, Func<IServiceProvider, IFilterProvider> filterProvider = null)
        {
            mvcServiceBuilder.Services.RemoveAll<IFilterProvider>();
            if (filterProvider == null)
                mvcServiceBuilder.Services.TryAddEnumerable(ServiceDescriptor.Singleton<IFilterProvider, DefaultFilterProvider>());
            else
            {
                mvcServiceBuilder.Services.TryAddEnumerable(ServiceDescriptor.Singleton(filterProvider));
            }
            return mvcServiceBuilder;
        }

        //mvcServiceBuilder.AddApplicationPart<InputTagHelper>();
        //mvcServiceBuilder.AddApplicationPart<UrlResolutionTagHelper>();
        public static IMvcCoreBuilder AddApplicationPart<TPart>(this IMvcCoreBuilder mvcServiceBuilder)
        {
            Assembly mvcTagHelpersAssembly = typeof(TPart).GetTypeInfo().Assembly;
            if (!Enumerable.OfType<AssemblyPart>(mvcServiceBuilder.PartManager.ApplicationParts).Any(p => p.Assembly == mvcTagHelpersAssembly))
                mvcServiceBuilder.PartManager.ApplicationParts.Add(new AssemblyPart(mvcTagHelpersAssembly));
            return mvcServiceBuilder;
        }

        //mvcServiceBuilder.AddFeatureProviderPart<ViewComponentFeatureProvider>();
        //mvcServiceBuilder.AddFeatureProviderPart<MetadataReferenceFeatureProvider>();
        //mvcServiceBuilder.AddFeatureProviderPart<ViewsFeatureProvider>();
        public static IMvcCoreBuilder AddFeatureProviderPart<TPart>(this IMvcCoreBuilder mvcServiceBuilder)
            where TPart : IApplicationFeatureProvider, new()
        {
            Assembly mvcTagHelpersAssembly = typeof(TPart).GetTypeInfo().Assembly;
            if (!Enumerable.OfType<AssemblyPart>(mvcServiceBuilder.PartManager.FeatureProviders).Any(p => p.Assembly == mvcTagHelpersAssembly))
                mvcServiceBuilder.PartManager.FeatureProviders.Add(new TPart());
            return mvcServiceBuilder;
        }
    }
}
