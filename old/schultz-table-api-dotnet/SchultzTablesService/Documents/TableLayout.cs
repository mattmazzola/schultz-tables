using System.Collections.Generic;
using Newtonsoft.Json;

namespace SchultzTablesService.Documents
{
    public class TableLayout
    {
        [JsonProperty("id")]
        public string Id { get; set; }
        [JsonProperty("width")]
        public int Width { get; set; }
        [JsonProperty("height")]
        public int Height { get; set; }
        [JsonProperty("expectedSequence")]
        public IList<string> ExpectedSequence { get; set; }
        [JsonProperty("randomizedSequence")]
        public IList<string> RandomizedSequence { get; set; }
    }
}
