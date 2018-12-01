using Movies.Domain.Core;
using Movies.Domain.Services;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.IO;
using System.Text;

namespace Movies.Domain.Components
{
    public class MovieParser : IMovieParser
    {
        private readonly JsonSerializer _serializer;

        public MovieParser()
        {
            this._serializer = JsonSerializer.Create();
        }

        public IEnumerator<Movie> ParseMoviesFromJson(Stream inputStream)
        {
            using (var readerStream = new StreamReader(inputStream))
            using (var jsonReader = new JsonTextReader(readerStream))
            {
                var hasRead = true;
                while(hasRead)
                {
                    do
                    {
                        hasRead = jsonReader.Read();
                    }
                    while (jsonReader.TokenType != JsonToken.StartObject && hasRead);
                    if (hasRead)
                    {
                        // Load each object from the stream and do something with it
                        var currentRawJson = _serializer.Deserialize<JObject>(jsonReader);
                        //JObject obj = JObject.Load(_jsonReader);
                        var movie = currentRawJson.ToObject<Movie>();
                        movie.Data = currentRawJson;
                        yield return movie;
                    }
                }
            }
        }
    }
}
