using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Umbraco.Cms.Api.Common.Attributes;
using Umbraco.Cms.Web.Common.Authorization;
using Umbraco.Cms.Web.Common.Routing;

namespace DocTypeDoctor.Controllers
{
    [ApiController]
    [Route("api/doctypedoctor/v{version:apiVersion}")]
    [MapToApi(Constants.ApiName)]
    public class DocTypeDoctorApiControllerBase : ControllerBase
    {
    }
}