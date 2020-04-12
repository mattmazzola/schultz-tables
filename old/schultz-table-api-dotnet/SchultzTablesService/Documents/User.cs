using Newtonsoft.Json;

namespace SchultzTablesService.Documents
{
    public class User
    {
        [JsonProperty("email")]
        public string Email { get; set; }
        [JsonProperty("firstName")]
        public string FirstName { get; set; }
        [JsonProperty("gender")]
        public string Gender { get; set; }
        [JsonProperty("id")]
        public string Id { get; set; }
        [JsonProperty("lastName")]
        public string LastName { get; set; }
        [JsonProperty("link")]
        public string Link { get; set; }
        [JsonProperty("locale")]
        public string Locale { get; set; }
        [JsonProperty("minAgeRange")]
        public int? MinAgeRange { get; set; }
        [JsonProperty("name")]
        public string Name { get; set; }
        [JsonProperty("picture")]
        public string Picture { get; set; }
        [JsonProperty("provider")]
        public string Provider { get; set; }
        [JsonProperty("providerId")]
        public string ProviderId { get; set; }
        [JsonProperty("updatedTime")]
        public string UpdatedTime { get; set; }
        [JsonProperty("verified")]
        public string Verified { get; set; }
    }
}
