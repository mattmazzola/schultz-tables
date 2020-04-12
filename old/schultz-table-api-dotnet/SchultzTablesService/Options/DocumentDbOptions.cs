namespace SchultzTablesService.Options
{
    public class DocumentDbOptions
    {
        public string AccountUri { get; set; }
        public string AccountKey { get; set; }
        public string DatabaseName { get; set; }
        public string UsersCollectionName { get; set; }
        public string ScoresCollectionName { get; set; }
        public string TableLayoutsCollectionName { get; set; }
        public string TableTypesCollectionName { get; set; }
        public string TimeIdsCollectionName { get; set; }
    }
}
