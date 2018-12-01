using Domain.Core;
using System;
using System.Collections.Generic;
using System.Text;

namespace Customers.Domain.Core
{
    //commentary:
    //it's also ok to have anemic domain entities, a class like Address doesn't have any rules on its own, it's mostly just a data bag
    public class Address : BaseEntity<long>
    {
        public Address()
        {
            CreatedOnUtc = DateTime.UtcNow;
        }

        public virtual DateTime CreatedOnUtc { get; protected set; }

        public virtual string Street { get; set; }

        public virtual string Town { get; set; }

        public virtual string ZipCode { get; set; }

        public virtual string Country { get; set; }
    }
}
