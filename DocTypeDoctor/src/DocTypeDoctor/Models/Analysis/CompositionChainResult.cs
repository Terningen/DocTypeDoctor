namespace DocTypeDoctor.Models.Analysis
{
    public class CompositionChainResult
    {
        public Guid DocTypeId { get; set; }
        public string DocTypeName { get; set; } = string.Empty;
        public string DocTypeAlias { get; set; } = string.Empty;
        public int Depth { get; set; }
        public List<string> CompositionPath { get; set; } = new();
        public bool HasCircularReference { get; set; }
        public string Severity { get; set; } = string.Empty; // "Low", "Medium", "High"
    }
}
