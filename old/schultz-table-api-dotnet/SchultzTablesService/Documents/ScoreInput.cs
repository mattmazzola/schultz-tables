using System;
using System.Collections.Generic;
using Newtonsoft.Json;

namespace SchultzTablesService.Documents
{
    public class ScoreInput
    {
        [JsonProperty("id")]
        public string Id { get; set; }
        [JsonProperty("signedStartTime")]
        public string SignedStartTime { get; set; }
        [JsonProperty("userId")]
        public string UserId { get; set; }
        [JsonProperty("startTime")]
        public DateTime StartTime { get; set; }
        [JsonProperty("endTime")]
        public DateTime EndTime { get; set; }
        [JsonProperty("userSequence")]
        public IList<Answer> UserSequence { get; set; }
        [JsonProperty("expectedSequence")]
        public IList<string> ExpectedSequence { get; set; }
        [JsonProperty("randomizedSequence")]
        public IList<string> RandomizedSequence { get; set; }
        [JsonProperty("tableWidth")]
        public int TableWidth { get; set; }
        [JsonProperty("tableHeight")]
        public int TableHeight { get; set; }
        [JsonProperty("tableProperties")]
        public IList<KeyValuePair<string, string>> TableProperties { get; set; }
    }
}
