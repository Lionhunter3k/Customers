using System;
using System.Collections.Generic;
using System.Text;

namespace Infrastructure.ElasticSearch.Core
{
    public interface IDataIndex<TEntity, TEntityData>
    {
        TEntityData Data { get; set; }
    }
}
