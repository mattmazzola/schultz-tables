using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SchultzTablesService.Models
{
    public class GraphApiUser
    {
        public string DisplayName { get; set; }
        public IEnumerable<string> OtherMails { get; set; }
        public string ObjectId { get; set; }
    }
}
