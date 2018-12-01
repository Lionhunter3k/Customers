using Infrastructure.ElasticSearch.Configuration;
using Movies.Domain.Core;
using Nest;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace Movies.Domain.Infrastructure
{
    public class MovieConfiguration : ElasticIndexConfiguration<Movie>
    {
        //public override AnalysisDescriptor ConfigureSearchAnalysis(AnalysisDescriptor analysis)
        //{
        //    return analysis
        //    .Tokenizers(tokenizers => tokenizers
        //        .Pattern("content-tokenizer", p => p.Pattern(@"\W+"))
        //    )
        //    .TokenFilters(tokenfilters => tokenfilters
        //        .WordDelimiter("content-words", w => w
        //            .SplitOnCaseChange()
        //            .PreserveOriginal()
        //            .SplitOnNumerics()
        //            .GenerateNumberParts(false)
        //            .GenerateWordParts()
        //        )
        //    )
        //    .Analyzers(analyzers => analyzers
        //        .Custom("content-analyzer", c => c
        //            .Tokenizer("content-tokenizer")
        //            .Filters("content-words", "lowercase")
        //        )
        //    );
        //}

        protected override TypeMappingDescriptor<Movie> OnConfigureContentMapping(TypeMappingDescriptor<Movie> map)
        {
            return base.OnConfigureContentMapping(map)
                .Properties(ps => ps
                .Text(t => t
                    .Name(p => p.Headline)
                    .Fields(f => f
                        .Keyword(p => p.Name("raw"))
                    )
                )
                .Text(t => t
                    .Name(p => p.Class)
                    .Fields(f => f
                        .Keyword(p => p.Name("raw"))
                    )
                )
                .Text(t => t
                    .Name(p => p.Cert)
                    .Fields(f => f
                        .Keyword(p => p.Name("raw"))
                    )
                )
                .Nested<Person>(n => n
                    .Name(p => p.Cast.First())
                    .AutoMap()
                    //.Properties(props => props
                    //    .Text(t => t
                    //        .Name(a => a.Name)
                    //        //.Analyzer("content-analyzer")
                    //    )
                    //)
                )
                .Nested<Person>(n => n
                    .Name(p => p.Directors.First())
                    .AutoMap()
                )
            );
        }
    }
}
