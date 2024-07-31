namespace SerenityExamples.Administration.Pages;

[PageAuthorize(PermissionKeys.Translation)]
public class TranslationPage : Controller
{
    [Route("Administration/Translation")]
    public ActionResult Index()
    {
        return this.GridPage(ESM.Modules.Administration.Translation.TranslationPage,
            ExtensionsTexts.Site.Translation.EntityPlural);
    }
}