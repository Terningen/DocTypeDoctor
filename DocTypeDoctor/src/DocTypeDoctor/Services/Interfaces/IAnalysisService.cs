using DocTypeDoctor.Models.Analysis;

namespace DocTypeDoctor.Services.Interfaces
{
    public interface IAnalysisService
    {
        Task<IEnumerable<SimilarityResult>> GetSimilarDocumentTypesAsync(double threshold);
        Task<IEnumerable<UnusedPropertyResult>> GetUnusedPropertiesAsync();
        Task<IEnumerable<CompositionChainResult>> GetCompositionChainsAsync(int depthThreshold = 4);
        Task<IEnumerable<PropertyNamingIssue>> GetPropertyNamingIssuesAsync();
    }
}
