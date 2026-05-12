namespace DocTypeDoctor.Models.Analysis
{
    public class SimilarityResult
    {
        public Guid DocType1Id { get; set; }
        public string DocType1Name { get; set; } = string.Empty;
        public string DocType1Alias { get; set; } = string.Empty;
        public Guid DocType2Id { get; set; }
        public string DocType2Name { get; set; } = string.Empty;
        public string DocType2Alias { get; set; } = string.Empty;
        public double SimilarityScore { get; set; }
        public List<string> MatchingProperties { get; set; } = new();
        public List<string> DifferingProperties { get; set; } = new();
        public string Recommendation { get; set; } = string.Empty;
    }
}
