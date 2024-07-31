using MyRequest = Serenity.Services.DeleteRequest;
using MyResponse = Serenity.Services.DeleteResponse;
using MyRow = SerenityExamples.Tables.OrderLinesRow;

namespace SerenityExamples.Tables;

public interface IOrderLinesDeleteHandler : IDeleteHandler<MyRow, MyRequest, MyResponse>
{
}

public class OrderLinesDeleteHandler : DeleteRequestHandler<MyRow, MyRequest, MyResponse>, IOrderLinesDeleteHandler
{
    public OrderLinesDeleteHandler(
        IRequestContext context)
        : base(context)
    {
    }
}