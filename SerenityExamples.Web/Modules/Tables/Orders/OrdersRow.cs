namespace SerenityExamples.Tables;

[ConnectionKey("Default")]
[Module("Tables")]
[TableName("訂單主檔")]
[DisplayName("訂單主檔")]
[InstanceName("訂單主檔")]
[GenerateFields]
[ReadPermission("訂單主檔:讀取")]
[ModifyPermission("訂單主檔:修改")]
[ServiceLookupPermission("訂單主檔:查表")]
[InsertPermission("訂單主檔:新增")]
public sealed partial class OrdersRow : Row<OrdersRow.RowFields>, IIdRow, INameRow
{

    [DisplayName("客戶編號")]
    [Column("客戶編號")]
    [Size(5)]
    [NotNull]
    public string CustomerNumber
    {
        get => fields.CustomerNumber[this];
        set => fields.CustomerNumber[this] = value;
    }

    [DisplayName("訂單日期")]
    [Column("訂單日期")]
    [NotNull]
    public DateTime? OrderDate
    {
        get => fields.OrderDate[this];
        set => fields.OrderDate[this] = value;
    }

    [DisplayName("訂單編號")]
    [Column("訂單編號")]
    [PrimaryKey]
    [IdProperty]
    [Size(10)]
    [NotNull]
    [QuickSearch]
    [NameProperty]
    public string OrderNumber
    {
        get => fields.OrderNumber[this];
        set => fields.OrderNumber[this] = value;
    }

    [DisplayName("業務員編號")]
    [Column("業務員編號")]
    [Size(10)]
    public string SalesNumber
    {
        get => fields.SalesNumber[this];
        set => fields.SalesNumber[this] = value;
    }

    [DisplayName("總金額")]
    [Column("總金額")]
    public int? Total
    {
        get => fields.Total[this];
        set => fields.Total[this] = value;
    }

    [DisplayName("訂單明細")]
    [MasterDetailRelation(foreignKey: nameof(OrderLinesRow.OrderNumber))]
    [NotMapped]
    public List<OrderLinesRow> Lines
    {
        get => fields.Lines[this];
        set => fields.Lines[this] = value;
    }
}