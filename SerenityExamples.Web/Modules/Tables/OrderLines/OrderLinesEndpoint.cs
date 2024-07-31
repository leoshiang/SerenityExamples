using Serenity.Reporting;
using SerenityExamples.Tables.Columns;
using System.Globalization;
using MyRow = SerenityExamples.Tables.OrderLinesRow;

namespace SerenityExamples.Tables.Endpoints;

[Route("Services/Tables/OrderLines/[action]")]
[ConnectionKey(typeof(MyRow))]
[ServiceAuthorize(typeof(MyRow))]
public class OrderLinesEndpoint : ServiceEndpoint
{
    [HttpPost]
    [AuthorizeCreate(typeof(MyRow))]
    public SaveResponse Create(
        IUnitOfWork uow,
        SaveRequest<MyRow> request,
        [FromServices] IOrderLinesSaveHandler handler)
    {
        return handler.Create(uow, request);
    }

    [HttpPost]
    [AuthorizeUpdate(typeof(MyRow))]
    public SaveResponse Update(
        IUnitOfWork uow,
        SaveRequest<MyRow> request,
        [FromServices] IOrderLinesSaveHandler handler)
    {
        return handler.Update(uow, request);
    }

    [HttpPost]
    [AuthorizeDelete(typeof(MyRow))]
    public DeleteResponse Delete(
        IUnitOfWork uow,
        DeleteRequest request,
        [FromServices] IOrderLinesDeleteHandler handler)
    {
        return handler.Delete(uow, request);
    }

    [HttpPost]
    public RetrieveResponse<MyRow> Retrieve(
        IDbConnection connection,
        RetrieveRequest request,
        [FromServices] IOrderLinesRetrieveHandler handler)
    {
        return handler.Retrieve(connection, request);
    }

    [HttpPost]
    [AuthorizeList(typeof(MyRow))]
    public ListResponse<MyRow> List(
        IDbConnection connection,
        ListRequest request,
        [FromServices] IOrderLinesListHandler handler)
    {
        return handler.List(connection, request);
    }

    [HttpPost]
    [AuthorizeList(typeof(MyRow))]
    public FileContentResult ListExcel(
        IDbConnection connection,
        ListRequest request,
        [FromServices] IOrderLinesListHandler handler,
        [FromServices] IExcelExporter exporter)
    {
        var data = List(connection, request, handler).Entities;
        var bytes = exporter.Export(data, typeof(OrderLinesColumns), request.ExportColumns);
        return ExcelContentResult.Create(
            bytes,
            "OrderLinesList_" +
            DateTime.Now.ToString("yyyyMMdd_HHmmss", CultureInfo.InvariantCulture) + ".xlsx");
    }
}