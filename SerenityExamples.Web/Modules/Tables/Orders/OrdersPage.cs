namespace SerenityExamples.Tables.Pages;

[PageAuthorize(typeof(OrdersRow))]
public class OrdersPage : Controller
{
    [Route("Tables/Orders")]
    public ActionResult Index()
    {
        return this.GridPage(
            "@/Tables/Orders/OrdersPage",
            OrdersRow.Fields.PageTitle());
    }
}