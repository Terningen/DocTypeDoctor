namespace DocTypeDoctor.Models.Analysis
{
    public class UnusedPropertyResult
    {
        public Guid DocTypeId { get; set; }
        public string DocTypeName { get; set; } = string.Empty;
        public string DocTypeAlias { get; set; } = string.Empty;
        public string PropertyAlias { get; set; } = string.Empty;
        public string PropertyName { get; set; } = string.Empty;
        public string DataTypeName { get; set; } = string.Empty;
        public int TotalNodes { get; set; }
        public int UsageCount { get; set; }
    }
}
