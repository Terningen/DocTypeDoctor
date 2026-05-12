namespace DocTypeDoctor.Models.Analysis
{
    public class PropertyNamingIssue
    {
        public string IssueType { get; set; } = string.Empty; // "NamingConvention", "InconsistentAlias"
        public string Description { get; set; } = string.Empty;
        public List<PropertyReference> Properties { get; set; } = new();
        public string SuggestedStandard { get; set; } = string.Empty;
    }

    public class PropertyReference
    {
        public Guid DocTypeId { get; set; }
        public string DocTypeName { get; set; } = string.Empty;
        public string PropertyAlias { get; set; } = string.Empty;
        public string PropertyName { get; set; } = string.Empty;
    }
}
