using System.Collections.Generic;
using Newtonsoft.Json;

namespace SchultzTablesService.Documents
{
    public class TableType
    {
        [JsonProperty("id")]
        public string Id { get; set; }
        [JsonProperty("width")]
        public int Width { get; set; }
        [JsonProperty("height")]
        public int Height { get; set; }
        [JsonProperty("properties")]
        public IList<KeyValuePair<string, string>> Properties { get; set; }
    }
}
