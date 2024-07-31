namespace SerenityExamples.Tables.Columns;

[ColumnsScript("Tables.Orders")]
[BasedOnRow(typeof(OrdersRow), CheckNames = true)]
public class OrdersColumns
{
    [EditLink]
    public DateTime OrderDate { get; set; }

    [EditLink]
    public string OrderNumber { get; set; }

    [EditLink]
    public string CustomerNumber { get; set; }

    [EditLink]
    public string SalesNumber { get; set; }

    [EditLink]
    public int Total { get; set; }
}