namespace SerenityExamples.Tables.Pages;

[PageAuthorize(typeof(OrderLinesRow))]
public class OrderLinesPage : Controller
{
    [Route("Tables/OrderLines")]
    public ActionResult Index()
    {
        return this.GridPage(
            "@/Tables/OrderLines/OrderLinesPage",
            OrderLinesRow.Fields.PageTitle());
    }
}