using Infrastructure.ElasticSearch.Core;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Text;

namespace Movies.Domain.Core
{
    public class Movie : DataIndex<JObject, string>
    {
        public string Body { get; set; }//description

        public string Cert { get; set; }//"U"

        public string Class { get; set; }//"Movie"

        public string Synopsis { get; set; }

        public int Year { get; set; }

        public int Duration { get; set; }//in seconds

        public string Headline { get; set; }//"Parental Guidance"

        public DateTime LastUpdated { get; set; }//"2013-07-15"

        public List<Person> Cast { get; set; } = new List<Person>();

        public List<Person> Directors { get; set; } = new List<Person>();

        public List<string> Genres { get; set; } = new List<string>();
    }
}
