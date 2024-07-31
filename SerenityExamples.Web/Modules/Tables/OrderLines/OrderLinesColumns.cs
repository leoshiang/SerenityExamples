namespace SerenityExamples.Tables.Columns;

[ColumnsScript("Tables.OrderLines")]
[BasedOnRow(typeof(OrderLinesRow), CheckNames = true)]
public class OrderLinesColumns
{
    [EditLink]
    public string OrderNumber { get; set; }

    [EditLink]
    public int ItemNumber { get; set; }

    [EditLink]
    public string ProductNumber { get; set; }

    [EditLink]
    public int Qty { get; set; }

    [EditLink]
    public int Price { get; set; }

    [EditLink]
    public int Total { get; set; }
}