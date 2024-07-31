using System.Threading.Tasks;

namespace SerenityExamples.Administration.Pages;
[PageAuthorize(typeof(UserRow))]
public class UserPage : Controller
{
    [Route("Administration/User")]
    public ActionResult Index()
    {
        return this.GridPage(ESM.Modules.Administration.User.UserPage,
            UserRow.Fields.PageTitle());
    }

#pragma warning disable ASP0018 // Unused route parameter
    [Route("Administration/ExceptionLog/{*pathInfo}"), IgnoreAntiforgeryToken]
#pragma warning restore ASP0018 // Unused route parameter
    public async Task ExceptionLog([FromServices] IOptions<EnvironmentSettings> environmentSettings)
    {
        await StackExchange.Exceptional.ExceptionalMiddleware
            .HandleRequestAsync(HttpContext).ConfigureAwait(false);
    }
}