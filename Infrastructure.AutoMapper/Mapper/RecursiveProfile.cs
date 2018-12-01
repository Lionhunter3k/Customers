using AutoMapper;
using Infrastructure.Model;
using Infrastructure.Reflection;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using System.Text;

namespace Infrastructure.AutoMapper.Mapper
{
    //commentary:
    //we use this profile class to recursively map nested properties based on a user defined convention
    public abstract class RecursiveProfile : Profile
    {
        protected RecursiveProfile(bool useGlobalMappingCache = true)
        {
            this._useGlobalMappingCache = useGlobalMappingCache;
        }

        static MethodInfo _createMapMethod = typeof(IProfileExpression).GetMethods()
            .Where(m => m.Name == nameof(IProfileExpression.CreateMap))
                        .Select(m => new
                        {
                            Method = m,
                            Params = m.GetParameters(),
                            Args = m.GetGenericArguments()
                        })
                        .Where(x => x.Args.Length == 2 && x.Params.Length == 1)
                        .Select(x => x.Method)
                        .First();

        static Dictionary<Tuple<Type, Type>, object> _mappings = new Dictionary<Tuple<Type, Type>, object>();

        private readonly bool _useGlobalMappingCache;

        protected virtual bool FilterNestedProperty(PropertyInfo property)
        {
            return property.PropertyType.FullName.Contains("Model");
        }

        public class MappedEntity<TSource, TDestination>
            where TSource : IRootModel<TDestination>
            where TDestination : class
        {
            private readonly RecursiveProfile _profile;

            private readonly Dictionary<Tuple<Type, Type>, object> _mappings;

            public MappedEntity(RecursiveProfile profile, Dictionary<Tuple<Type, Type>, object> mappings)
            {
                _profile = profile;
                _mappings = mappings;
            }

            private MappedEntity<TSource, TDestination> getMapFromModel<TRootSource, TRootDestination>(Action<IMappingExpression<TRootSource, TRootDestination>> options, bool createIfMissing)
                where TRootSource : IRootModel<TRootDestination>
                where TRootDestination : class
            {
                var key = Tuple.Create(typeof(TRootSource), typeof(TRootDestination));
                object existingMapping = null;
                if (_mappings.TryGetValue(key, out existingMapping))
                    options(existingMapping as IMappingExpression<TRootSource, TRootDestination>);
                else
                {
                    if (createIfMissing)
                    {
                        var newMapping = _profile.CreateMap<TRootSource, TRootDestination>();
                        _mappings.Add(key, newMapping);
                        options(newMapping);
                    }
                    else
                        throw new System.Collections.Generic.KeyNotFoundException();
                }
                return this;
            }

            private MappedEntity<TSource, TDestination> getMapFromEntity<TRootSource, TRootDestination>(Action<IMappingExpression<TRootSource, TRootDestination>> options, bool createIfMissing)
    where TRootSource : class
    where TRootDestination : IRootModel<TRootSource>
            {
                var key = Tuple.Create(typeof(TRootSource), typeof(TRootDestination));
                object existingMapping = null;
                if (_mappings.TryGetValue(key, out existingMapping))
                    options(existingMapping as IMappingExpression<TRootSource, TRootDestination>);
                else
                {
                    if (createIfMissing)
                    {
                        var newMapping = _profile.CreateMap<TRootSource, TRootDestination>();
                        _mappings.Add(key, newMapping);
                        options(newMapping);
                    }
                    else
                        throw new System.Collections.Generic.KeyNotFoundException();
                }
                return this;
            }

            public MappedEntity<TSource, TDestination> GetMapFromModel<TRootSource, TRootDestination>(Func<TSource, TRootSource> path, Action<IMappingExpression<TRootSource, TRootDestination>> options, bool createIfMissing = false)
                where TRootSource : IRootModel<TRootDestination>
                where TRootDestination : class
            {
                return getMapFromModel(options, createIfMissing);
            }

            public MappedEntity<TSource, TDestination> GetMapFromModel<TRootSource, TRootDestination>(Func<TSource, IEnumerable<TRootSource>> path, Action<IMappingExpression<TRootSource, TRootDestination>> options, bool createIfMissing = false)
    where TRootSource : IRootModel<TRootDestination>
    where TRootDestination : class
            {
                return getMapFromModel(options, createIfMissing);
            }

            public MappedEntity<TSource, TDestination> GetMapFromModel<TRootSource, TRootDestination>(Func<TSource, ICollection<TRootSource>> path, Action<IMappingExpression<TRootSource, TRootDestination>> options, bool createIfMissing = false)
where TRootSource : IRootModel<TRootDestination>
where TRootDestination : class
            {
                return getMapFromModel(options, createIfMissing);
            }

            public MappedEntity<TSource, TDestination> GetMapFromModel<TRootSource, TRootDestination>(Func<TSource, IReadOnlyCollection<TRootSource>> path, Action<IMappingExpression<TRootSource, TRootDestination>> options, bool createIfMissing = false)
where TRootSource : IRootModel<TRootDestination>
where TRootDestination : class
            {
                return getMapFromModel(options, createIfMissing);
            }

            public MappedEntity<TSource, TDestination> GetMapFromModel<TRootSource, TRootDestination>(Func<TSource, IReadOnlyList<TRootSource>> path, Action<IMappingExpression<TRootSource, TRootDestination>> options, bool createIfMissing = false)
where TRootSource : IRootModel<TRootDestination>
where TRootDestination : class
            {
                return getMapFromModel(options, createIfMissing);
            }

            public MappedEntity<TSource, TDestination> GetMapFromModel<TRootSource, TRootDestination>(Func<TSource, ISet<TRootSource>> path, Action<IMappingExpression<TRootSource, TRootDestination>> options, bool createIfMissing = false)
where TRootSource : IRootModel<TRootDestination>
where TRootDestination : class
            {
                return getMapFromModel(options, createIfMissing);
            }

            public MappedEntity<TSource, TDestination> GetMapFromModel<TRootSource, TRootDestination>(Func<TSource, IList<TRootSource>> path, Action<IMappingExpression<TRootSource, TRootDestination>> options, bool createIfMissing = false)
where TRootSource : IRootModel<TRootDestination>
where TRootDestination : class
            {
                return getMapFromModel(options, createIfMissing);
            }

            public MappedEntity<TSource, TDestination> GetMapFromModel<TRootSource, TRootDestination>(Func<TSource, List<TRootSource>> path, Action<IMappingExpression<TRootSource, TRootDestination>> options, bool createIfMissing = false)
where TRootSource : IRootModel<TRootDestination>
where TRootDestination : class
            {
                return getMapFromModel(options, createIfMissing);
            }

            public MappedEntity<TSource, TDestination> GetMapFromModel<TRootSource, TRootDestination>(Func<TSource, HashSet<TRootSource>> path, Action<IMappingExpression<TRootSource, TRootDestination>> options, bool createIfMissing = false)
where TRootSource : IRootModel<TRootDestination>
where TRootDestination : class
            {
                return getMapFromModel(options, createIfMissing);
            }

            public MappedEntity<TSource, TDestination> GetMapFromEntity<TRootSource, TRootDestination>(Func<TDestination, TRootSource> path, Action<IMappingExpression<TRootSource, TRootDestination>> options, bool createIfMissing = false)
    where TRootSource : class
    where TRootDestination : IRootModel<TRootSource>
            {
                return getMapFromEntity(options, createIfMissing);
            }

            public MappedEntity<TSource, TDestination> GetMapFromEntity<TRootSource, TRootDestination>(Func<TDestination, IEnumerable<TRootSource>> path, Action<IMappingExpression<TRootSource, TRootDestination>> options, bool createIfMissing = false)
where TRootSource : class
where TRootDestination : IRootModel<TRootSource>
            {
                return getMapFromEntity(options, createIfMissing);
            }

            public MappedEntity<TSource, TDestination> GetMapFromEntity<TRootSource, TRootDestination>(Func<TDestination, ICollection<TRootSource>> path, Action<IMappingExpression<TRootSource, TRootDestination>> options, bool createIfMissing = false)
where TRootSource : class
where TRootDestination : IRootModel<TRootSource>
            {
                return getMapFromEntity(options, createIfMissing);
            }

            public MappedEntity<TSource, TDestination> GetMapFromEntity<TRootSource, TRootDestination>(Func<TDestination, IReadOnlyCollection<TRootSource>> path, Action<IMappingExpression<TRootSource, TRootDestination>> options, bool createIfMissing = false)
where TRootSource : class
where TRootDestination : IRootModel<TRootSource>
            {
                return getMapFromEntity(options, createIfMissing);
            }

            public MappedEntity<TSource, TDestination> GetMapFromEntity<TRootSource, TRootDestination>(Func<TDestination, IList<TRootSource>> path, Action<IMappingExpression<TRootSource, TRootDestination>> options, bool createIfMissing = false)
where TRootSource : class
where TRootDestination : IRootModel<TRootSource>
            {
                return getMapFromEntity(options, createIfMissing);
            }

            public MappedEntity<TSource, TDestination> GetMapFromEntity<TRootSource, TRootDestination>(Func<TDestination, ISet<TRootSource>> path, Action<IMappingExpression<TRootSource, TRootDestination>> options, bool createIfMissing = false)
where TRootSource : class
where TRootDestination : IRootModel<TRootSource>
            {
                return getMapFromEntity(options, createIfMissing);
            }

            public MappedEntity<TSource, TDestination> GetMapFromEntity<TRootSource, TRootDestination>(Func<TDestination, List<TRootSource>> path, Action<IMappingExpression<TRootSource, TRootDestination>> options, bool createIfMissing = false)
where TRootSource : class
where TRootDestination : IRootModel<TRootSource>
            {
                return getMapFromEntity(options, createIfMissing);
            }

            public MappedEntity<TSource, TDestination> GetMapFromEntity<TRootSource, TRootDestination>(Func<TDestination, HashSet<TRootSource>> path, Action<IMappingExpression<TRootSource, TRootDestination>> options, bool createIfMissing = false)
where TRootSource : class
where TRootDestination : IRootModel<TRootSource>
            {
                return getMapFromEntity(options, createIfMissing);
            }
        }

        public MappedEntity<T, K> CreateMapRecursive<T, K>(Func<PropertyInfo, bool> predicate = null)
where T : IRootModel<K>
where K : class
        {
            var mappings = _useGlobalMappingCache ? _mappings : new Dictionary<Tuple<Type, Type>, object>();
            CreateMapRecursive(typeof(T), typeof(K), predicate ?? this.FilterNestedProperty, mappings);
            return new MappedEntity<T, K>(this, mappings);
        }

        public void CreateMapRecursive(Type viewModel, Type entity, Func<PropertyInfo, bool> predicate, Dictionary<Tuple<Type, Type>, object> mappings = null)
        {
            mappings = mappings ?? (_useGlobalMappingCache ? _mappings : new Dictionary<Tuple<Type, Type>, object>());
            var shouldMapChildren = false;
            if (!mappings.ContainsKey(Tuple.Create(viewModel, entity)))
            {
                mappings.Add(Tuple.Create(viewModel, entity), _createMapMethod.MakeGenericMethod(viewModel, entity).Invoke(this, new object[] { MemberList.None }));
                shouldMapChildren = true;
            }
            if (!mappings.ContainsKey(Tuple.Create(entity, viewModel)))
            {
                mappings.Add(Tuple.Create(entity, viewModel), _createMapMethod.MakeGenericMethod(entity, viewModel).Invoke(this, new object[] { MemberList.None }));
                shouldMapChildren = true;
            }
            if (shouldMapChildren)
            {
                // Get a list of properties that are decorated with AutoMapperMapTo
                var viewModelNestedProperties =
                    viewModel.GetPublicProperties().Where(predicate);
                var entityProperties = entity.GetPublicProperties();
                // Create the map
                foreach (var propertyInfo in viewModelNestedProperties)
                {
                    var entityType = entityProperties.SingleOrDefault(q => q.Name == propertyInfo.Name)?.PropertyType;
                    if (entityType != null)
                    {
                        if (propertyInfo.PropertyType.IsGenericType())
                        {
                            var innerViewModelType = propertyInfo.PropertyType.GetGenericArguments()[0];
                            var innerEntityType = entityType.GetGenericArguments()[0];
                            CreateMapRecursive(innerViewModelType, innerEntityType, predicate, mappings);
                        }
                        else
                        {
                            CreateMapRecursive(propertyInfo.PropertyType, entityType, predicate, mappings);
                        }
                    }
                }
            }
        }
    }
}
