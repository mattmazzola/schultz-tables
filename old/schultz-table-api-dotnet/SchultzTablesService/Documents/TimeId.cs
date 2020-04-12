using System;
using Newtonsoft.Json;

namespace SchultzTablesService.Documents
{
    public class TimeId
    {
        [JsonProperty("id")]
        public string Id { get; set; }
        [JsonProperty("time")]
        public DateTimeOffset Time { get; set; }

        public TimeId()
        {
            Time = DateTimeOffset.UtcNow;
        }
    }
}
