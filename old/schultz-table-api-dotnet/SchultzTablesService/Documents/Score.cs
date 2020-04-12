using System;
using System.Collections.Generic;
using Newtonsoft.Json;

namespace SchultzTablesService.Documents
{
    public class Score
    {
        [JsonProperty("id")]
        public string Id { get; set; }
        [JsonProperty("userId")]
        public string UserId { get; set; }
        [JsonProperty("startTime")]
        public DateTime StartTime { get; set; }
        [JsonProperty("endTime")]
        public DateTime EndTime { get; set; }
        [JsonProperty("duration")]
        public TimeSpan Duration { get; set; }
        [JsonProperty("durationMilliseconds")]
        public double DurationMilliseconds { get; set; }
        [JsonProperty("sequence")]
        public IList<Answer> Sequence { get; set; }
        [JsonProperty("tableLayoutId")]
        public string TableLayoutId { get; set; }
        [JsonProperty("tableTypeId")]
        public string TableTypeId { get; set; }
    }

    public class Answer
    {
        [JsonProperty("time")]
        public DateTime Time { get; set; }
        [JsonProperty("cell")]
        public Cell Cell { get; set; }
        [JsonProperty("correct")]
        public bool Correct { get; set; }
    }

    public class Cell
    {
        [JsonProperty("text")]
        public string Text { get; set; }
        [JsonProperty("x")]
        public int X { get; set; }
        [JsonProperty("y")]
        public int Y { get; set; }
    }
}
