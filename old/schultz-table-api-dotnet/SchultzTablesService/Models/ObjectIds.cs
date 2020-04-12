using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Newtonsoft.Json;

namespace SchultzTablesService.Models
{
    public class ObjectIdsBody
    {
        [JsonProperty("objectIds")]
        public List<string> ObjectIds { get; set; }
        [JsonProperty("types")]
        public List<string> Types { get; set; }
    }
}
