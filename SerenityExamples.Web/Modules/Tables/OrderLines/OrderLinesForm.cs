namespace SerenityExamples.Tables.Forms;

[FormScript("Tables.OrderLines")]
[BasedOnRow(typeof(OrderLinesRow), CheckNames = true)]
public class OrderLinesForm
{
    public string OrderNumber { get; set; }
    public int ItemNumber { get; set; }
    public string ProductNumber { get; set; }
    public int Qty { get; set; }
    public int Price { get; set; }
    public int Total { get; set; }
}