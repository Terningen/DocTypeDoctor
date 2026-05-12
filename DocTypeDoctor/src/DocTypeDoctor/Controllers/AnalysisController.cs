using Asp.Versioning;
using DocTypeDoctor.Models.Analysis;
using DocTypeDoctor.Services.Interfaces;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace DocTypeDoctor.Controllers
{
    [ApiVersion("1.0")]
    [ApiExplorerSettings(GroupName = Constants.ApiName)]
    public class AnalysisController : DocTypeDoctorApiControllerBase
    {
        private readonly IAnalysisService _analysisService;

        public AnalysisController(IAnalysisService analysisService)
        {
            _analysisService = analysisService;
        }

        [HttpGet("analysis/similarity")]
        [ProducesResponseType<IEnumerable<SimilarityResult>>(StatusCodes.Status200OK)]
        public async Task<IEnumerable<SimilarityResult>> GetSimilarity([FromQuery] double threshold = 70)
            => await _analysisService.GetSimilarDocumentTypesAsync(threshold);

        [HttpGet("analysis/unused-properties")]
        [ProducesResponseType<IEnumerable<UnusedPropertyResult>>(StatusCodes.Status200OK)]
        public async Task<IEnumerable<UnusedPropertyResult>> GetUnusedProperties()
            => await _analysisService.GetUnusedPropertiesAsync();

        [HttpGet("analysis/composition-chains")]
        [ProducesResponseType<IEnumerable<CompositionChainResult>>(StatusCodes.Status200OK)]
        public async Task<IEnumerable<CompositionChainResult>> GetCompositionChains([FromQuery] int depthThreshold = 4)
            => await _analysisService.GetCompositionChainsAsync(depthThreshold);

        [HttpGet("analysis/naming-issues")]
        [ProducesResponseType<IEnumerable<PropertyNamingIssue>>(StatusCodes.Status200OK)]
        public async Task<IEnumerable<PropertyNamingIssue>> GetNamingIssues()
            => await _analysisService.GetPropertyNamingIssuesAsync();
    }
}
