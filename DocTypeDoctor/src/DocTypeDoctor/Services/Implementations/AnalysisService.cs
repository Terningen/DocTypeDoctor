using DocTypeDoctor.Models.Analysis;
using DocTypeDoctor.Services.Interfaces;
using Umbraco.Cms.Core.Models;
using Umbraco.Cms.Core.Services;

namespace DocTypeDoctor.Services.Implementations
{
    public class AnalysisService : IAnalysisService
    {
        private readonly IContentTypeService _contentTypeService;
        private readonly IContentService _contentService;

        public AnalysisService(IContentTypeService contentTypeService, IContentService contentService)
        {
            _contentTypeService = contentTypeService;
            _contentService = contentService;
        }

        public Task<IEnumerable<SimilarityResult>> GetSimilarDocumentTypesAsync(double threshold)
        {
            // Dummy data for testing
            var results = new List<SimilarityResult>
            {
                new SimilarityResult
                {
                    DocType1Id = Guid.NewGuid(),
                    DocType1Name = "Article Page",
                    DocType1Alias = "articlePage",
                    DocType2Id = Guid.NewGuid(),
                    DocType2Name = "Blog Post",
                    DocType2Alias = "blogPost",
                    SimilarityScore = 92.5,
                    MatchingProperties = new List<string> { "title", "bodyText", "author", "publishDate", "seoTitle", "seoDescription" },
                    DifferingProperties = new List<string> { "categories", "tags", "featuredImage" },
                    Recommendation = "Consider merging these document types"
                },
                new SimilarityResult
                {
                    DocType1Id = Guid.NewGuid(),
                    DocType1Name = "News Item",
                    DocType2Id = Guid.NewGuid(),
                    DocType2Name = "Press Release",
                    DocType2Alias = "pressRelease",
                    SimilarityScore = 78.3,
                    MatchingProperties = new List<string> { "title", "content", "date", "author" },
                    DifferingProperties = new List<string> { "source", "contactInfo", "mediaGallery" },
                    Recommendation = "Consider extracting a shared composition"
                },
                new SimilarityResult
                {
                    DocType1Id = Guid.NewGuid(),
                    DocType1Name = "Product Page",
                    DocType2Id = Guid.NewGuid(),
                    DocType2Name = "Service Page",
                    DocType2Alias = "servicePage",
                    SimilarityScore = 85.0,
                    MatchingProperties = new List<string> { "title", "description", "image", "price", "featured" },
                    DifferingProperties = new List<string> { "sku", "stock", "duration", "bookingUrl" },
                    Recommendation = "Consider extracting a shared composition"
                }
            };

            return Task.FromResult<IEnumerable<SimilarityResult>>(results.Where(r => r.SimilarityScore >= threshold).OrderByDescending(r => r.SimilarityScore));
        }

        private double CalculateSimilarity(IContentType a, IContentType b, out List<string> matching, out List<string> differing)
        {
            var propsA = a.PropertyTypes.Select(p => p.Alias).ToHashSet(StringComparer.OrdinalIgnoreCase);
            var propsB = b.PropertyTypes.Select(p => p.Alias).ToHashSet(StringComparer.OrdinalIgnoreCase);

            matching = propsA.Intersect(propsB, StringComparer.OrdinalIgnoreCase).ToList();
            differing = propsA.Union(propsB, StringComparer.OrdinalIgnoreCase)
                              .Except(matching, StringComparer.OrdinalIgnoreCase).ToList();

            if (propsA.Count == 0 && propsB.Count == 0) { return 0; }

            var union = propsA.Union(propsB, StringComparer.OrdinalIgnoreCase).Count();
            return union == 0 ? 0 : (double)matching.Count / union;
        }

        public Task<IEnumerable<UnusedPropertyResult>> GetUnusedPropertiesAsync()
        {
            // Dummy data for testing
            var results = new List<UnusedPropertyResult>
            {
                new UnusedPropertyResult
                {
                    DocTypeId = Guid.NewGuid(),
                    DocTypeName = "Article Page",
                    DocTypeAlias = "articlePage",
                    PropertyAlias = "subtitle",
                    PropertyName = "Subtitle",
                    DataTypeName = "Umbraco.Textbox",
                    TotalNodes = 45,
                    UsageCount = 0
                },
                new UnusedPropertyResult
                {
                    DocTypeId = Guid.NewGuid(),
                    DocTypeName = "Blog Post",
                    DocTypeAlias = "blogPost",
                    PropertyAlias = "authorBio",
                    PropertyName = "Author Bio",
                    DataTypeName = "Umbraco.TextArea",
                    TotalNodes = 32,
                    UsageCount = 0
                },
                new UnusedPropertyResult
                {
                    DocTypeId = Guid.NewGuid(),
                    DocTypeName = "Product Page",
                    DocTypeAlias = "productPage",
                    PropertyAlias = "warrantyInfo",
                    PropertyName = "Warranty Information",
                    DataTypeName = "Umbraco.RichtextEditor",
                    TotalNodes = 28,
                    UsageCount = 0
                },
                new UnusedPropertyResult
                {
                    DocTypeId = Guid.NewGuid(),
                    DocTypeName = "News Item",
                    DocTypeAlias = "newsItem",
                    PropertyAlias = "relatedLinks",
                    PropertyName = "Related Links",
                    DataTypeName = "Umbraco.MultiUrlPicker",
                    TotalNodes = 15,
                    UsageCount = 0
                }
            };

            return Task.FromResult<IEnumerable<UnusedPropertyResult>>(results.OrderBy(r => r.DocTypeName));
        }

        public Task<IEnumerable<CompositionChainResult>> GetCompositionChainsAsync(int depthThreshold = 4)
        {
            // Dummy data for testing
            var results = new List<CompositionChainResult>
            {
                new CompositionChainResult
                {
                    DocTypeId = Guid.NewGuid(),
                    DocTypeName = "Advanced Product Page",
                    DocTypeAlias = "advancedProductPage",
                    Depth = 7,
                    CompositionPath = new List<string> { "BasePage", "SeoBase", "ProductBase", "EcommerceBase", "AdvancedProductBase", "AdvancedProductPage" },
                    HasCircularReference = false,
                    Severity = "High"
                },
                new CompositionChainResult
                {
                    DocTypeId = Guid.NewGuid(),
                    DocTypeName = "Complex Blog Post",
                    DocTypeAlias = "complexBlogPost",
                    Depth = 5,
                    CompositionPath = new List<string> { "BasePage", "ContentBase", "BlogBase", "AuthorBase", "ComplexBlogPost" },
                    HasCircularReference = false,
                    Severity = "Medium"
                },
                new CompositionChainResult
                {
                    DocTypeId = Guid.NewGuid(),
                    DocTypeName = "Enterprise Article",
                    DocTypeAlias = "enterpriseArticle",
                    Depth = 6,
                    CompositionPath = new List<string> { "BasePage", "SeoBase", "ArticleBase", "EnterpriseBase", "WorkflowBase", "EnterpriseArticle" },
                    HasCircularReference = false,
                    Severity = "High"
                },
                new CompositionChainResult
                {
                    DocTypeId = Guid.NewGuid(),
                    DocTypeName = "Standard Page",
                    DocTypeAlias = "standardPage",
                    Depth = 4,
                    CompositionPath = new List<string> { "BasePage", "SeoBase", "ContentBase", "StandardPage" },
                    HasCircularReference = false,
                    Severity = "Medium"
                }
            };

            return Task.FromResult<IEnumerable<CompositionChainResult>>(results.Where(r => r.Depth >= depthThreshold).OrderByDescending(r => r.Depth));
        }

        private int CalculateCompositionDepth(IContentType ct, List<IContentType> all, List<string> path, HashSet<int> visited)
        {
            if (visited.Contains(ct.Id)) return 0;
            visited.Add(ct.Id);
            path.Add(ct.Name ?? ct.Alias);

            var compositions = ct.ContentTypeComposition
                .Select(c => all.FirstOrDefault(x => x.Id == c.Id))
                .Where(c => c != null)
                .Cast<IContentType>()
                .ToList();

            if (!compositions.Any()) return 0;

            return 1 + compositions.Max(c => CalculateCompositionDepth(c, all, path, new HashSet<int>(visited)));
        }

        public Task<IEnumerable<PropertyNamingIssue>> GetPropertyNamingIssuesAsync()
        {
            // Dummy data for testing
            var issues = new List<PropertyNamingIssue>
            {
                new PropertyNamingIssue
                {
                    IssueType = "InconsistentAlias",
                    Description = "Property 'authorName' uses 3 different alias formats: authorName, author_name, author-name",
                    Properties = new List<PropertyReference>
                    {
                        new PropertyReference { DocTypeId = Guid.NewGuid(), DocTypeName = "Blog Post", PropertyAlias = "authorName", PropertyName = "Author Name" },
                        new PropertyReference { DocTypeId = Guid.NewGuid(), DocTypeName = "Article Page", PropertyAlias = "author_name", PropertyName = "Author Name" },
                        new PropertyReference { DocTypeId = Guid.NewGuid(), DocTypeName = "News Item", PropertyAlias = "author-name", PropertyName = "Author Name" }
                    },
                    SuggestedStandard = "authorName"
                },
                new PropertyNamingIssue
                {
                    IssueType = "InconsistentAlias",
                    Description = "Property 'publishDate' uses 2 different alias formats: publishDate, publicationDate",
                    Properties = new List<PropertyReference>
                    {
                        new PropertyReference { DocTypeId = Guid.NewGuid(), DocTypeName = "Blog Post", PropertyAlias = "publishDate", PropertyName = "Publish Date" },
                        new PropertyReference { DocTypeId = Guid.NewGuid(), DocTypeName = "News Item", PropertyAlias = "publicationDate", PropertyName = "Publish Date" }
                    },
                    SuggestedStandard = "publishDate"
                },
                new PropertyNamingIssue
                {
                    IssueType = "InconsistentAlias",
                    Description = "Property 'metaDescription' uses 2 different alias formats: metaDescription, meta_description",
                    Properties = new List<PropertyReference>
                    {
                        new PropertyReference { DocTypeId = Guid.NewGuid(), DocTypeName = "Article Page", PropertyAlias = "metaDescription", PropertyName = "Meta Description" },
                        new PropertyReference { DocTypeId = Guid.NewGuid(), DocTypeName = "Product Page", PropertyAlias = "meta_description", PropertyName = "Meta Description" }
                    },
                    SuggestedStandard = "metaDescription"
                }
            };

            return Task.FromResult<IEnumerable<PropertyNamingIssue>>(issues);
        }

        private static string NormaliseAlias(string alias) =>
            alias.ToLowerInvariant().Replace("_", "").Replace("-", "");
    }
}
