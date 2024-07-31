namespace SerenityExamples.Tables.Forms;

[FormScript("Tables.Orders")]
[BasedOnRow(typeof(OrdersRow), CheckNames = true)]
public class OrdersForm
{
    public DateTime OrderDate { get; set; }
    public string OrderNumber { get; set; }
    public string CustomerNumber { get; set; }
    public string SalesNumber { get; set; }
    public int Total { get; set; }
    
    [OrderLinesEditor]
    public List<OrderLinesRow> Lines { get; set; }
}