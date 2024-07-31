namespace SerenityExamples.Tables;

[ConnectionKey("Default")]
[Module("Tables")]
[TableName("訂單明細檔")]
[DisplayName("訂單明細檔")]
[InstanceName("訂單明細檔")]
[GenerateFields]
[ReadPermission("訂單明細檔:讀取")]
[ModifyPermission("訂單明細檔:修改")]
[ServiceLookupPermission("訂單明細檔:查表")]
[InsertPermission("訂單明細檔:新增")]
public sealed partial class OrderLinesRow : Row<OrderLinesRow.RowFields>, IIdRow, INameRow
{
    [Expression("CONCAT(t0.訂單編號, t0.項次)")]
    [IdProperty]
    public string FakeId
    {
        get => fields.FakeId[this];
        set => fields.FakeId[this] = value;
    }

    [Column("項次")]
    [DisplayName("項次")]
    [PrimaryKey]
    public int? ItemNumber
    {
        get => fields.ItemNumber[this];
        set => fields.ItemNumber[this] = value;
    }

    [Column("訂單編號")]
    [DisplayName("訂單編號")]
    [ForeignKey(typeof(OrdersRow))]
    [NameProperty]
    [PrimaryKey]
    [QuickSearch]
    [Size(10)]
    [Updatable(false)]
    public string OrderNumber
    {
        get => fields.OrderNumber[this];
        set => fields.OrderNumber[this] = value;
    }

    [Column("單價")]
    [DisplayName("單價")]
    public int? Price
    {
        get => fields.Price[this];
        set => fields.Price[this] = value;
    }

    [Column("產品編號")]
    [DisplayName("產品編號")]
    [Size(10)]
    public string ProductNumber
    {
        get => fields.ProductNumber[this];
        set => fields.ProductNumber[this] = value;
    }

    [Column("數量")]
    [DisplayName("數量")]
    public int? Qty
    {
        get => fields.Qty[this];
        set => fields.Qty[this] = value;
    }

    [Column("小計")]
    [DisplayName("小計")]
    public int? Total
    {
        get => fields.Total[this];
        set => fields.Total[this] = value;
    }
}