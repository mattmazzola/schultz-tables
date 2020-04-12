using System.Collections.Generic;

namespace SchultzTablesService.DomainModels
{
    public class ScoresWithUsers
    {
        public string ContinuationToken { get; set; }
        public List<Score> Scores { get; set; }
        public List<User> Users { get; set; }
    }
}
