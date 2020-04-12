using System.Linq;
using SchultzTablesService.DomainModels;
using SchultzTablesService.Models;

namespace SchultzTablesService
{
    public static class ModelConverters
    {
        public static User ToUser(this GraphApiUser graphApiUser)
        {
            return new User
            {
                Id = graphApiUser.ObjectId,
                Email = graphApiUser.OtherMails.First(),
                Name = graphApiUser.DisplayName
            };
        }
    }
}
