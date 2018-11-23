using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using System.Runtime.CompilerServices;
using System.Text;

namespace Customers.Infrastructure.Reflection
{
    public static class ReflectionHelpers
    {
        [MethodImpl(MethodImplOptions.AggressiveInlining)]
        public static bool IsInterface(this Type type)
        {
#if (NETSTANDARD1_3)
            return type.GetTypeInfo().IsInterface;
#else
            return type.IsInterface;
#endif
        }

        [MethodImpl(MethodImplOptions.AggressiveInlining)]
        public static Type[] GetTypeInterfaces(this Type type)
        {
#if (NETSTANDARD1_3)
            return type.GetTypeInfo().ImplementedInterfaces.ToArray();
#else
            return type.GetInterfaces();
#endif
        }

        [MethodImpl(MethodImplOptions.AggressiveInlining)]
        public static PropertyInfo[] GetPublicProperties(this Type type)
        {
            if (type.IsInterface())
            {
                var propertyInfos = new List<PropertyInfo>();

                var considered = new List<Type>();
                var queue = new Queue<Type>();
                considered.Add(type);
                queue.Enqueue(type);

                while (queue.Count > 0)
                {
                    var subType = queue.Dequeue();
                    foreach (var subInterface in subType.GetTypeInterfaces())
                    {
                        if (considered.Contains(subInterface)) continue;

                        considered.Add(subInterface);
                        queue.Enqueue(subInterface);
                    }

                    var typeProperties = subType.GetTypesPublicProperties();

                    var newPropertyInfos = typeProperties
                        .Where(x => !propertyInfos.Contains(x));

                    propertyInfos.InsertRange(0, newPropertyInfos);
                }

                return propertyInfos.ToArray();
            }

            return type.GetTypesPublicProperties()
                .Where(t => t.GetIndexParameters().Length == 0) // ignore indexed properties
                .ToArray();
        }

        [MethodImpl(MethodImplOptions.AggressiveInlining)]
        internal static PropertyInfo[] GetTypesPublicProperties(this Type subType)
        {
#if (NETSTANDARD1_3)
            var pis = new List<PropertyInfo>();
            foreach (var pi in subType.GetRuntimeProperties())
            {
                var mi = pi.GetMethod ?? pi.SetMethod;
                if (mi != null && mi.IsStatic) continue;
                pis.Add(pi);
            }
            return pis.ToArray();
#else
            return subType.GetProperties(
                BindingFlags.FlattenHierarchy |
                BindingFlags.Public |
                BindingFlags.Instance);
#endif
        }


        [MethodImpl(MethodImplOptions.AggressiveInlining)]
        public static bool IsGenericType(this Type type)
        {
#if (NETSTANDARD1_3)
            return type.GetTypeInfo().IsGenericType;
#else
            return type.IsGenericType;
#endif
        }

#if (NETSTANDARD1_3)
        [MethodImpl(MethodImplOptions.AggressiveInlining)]
        public static Type[] GetGenericArguments(this Type type)
        {
            //http://stackoverflow.com/a/39140220/85785
            return type.GetTypeInfo().IsGenericTypeDefinition
                ? type.GetTypeInfo().GenericTypeParameters
                : type.GetTypeInfo().GenericTypeArguments;
        }
#endif

#if (NETSTANDARD1_3)
        [MethodImpl(MethodImplOptions.AggressiveInlining)]
        public static MethodInfo[] GetMethods(this Type type)
        {
            return type.GetRuntimeMethods().ToArray();
        }
#endif

    }
}
