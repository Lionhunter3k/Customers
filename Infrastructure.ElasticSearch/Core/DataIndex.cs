using Nest;
using System;
using System.Collections.Generic;
using System.Text;

namespace Infrastructure.ElasticSearch.Core
{
    public class DataIndex<TEntityData, TEntityKey>
    {
        public TEntityKey Id { get; set; }

        [Object(Enabled = false)]
        public TEntityData Data { get; set; }
    }
}
