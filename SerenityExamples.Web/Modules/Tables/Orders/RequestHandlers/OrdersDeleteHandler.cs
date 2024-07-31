using MyRequest = Serenity.Services.DeleteRequest;
using MyResponse = Serenity.Services.DeleteResponse;
using MyRow = SerenityExamples.Tables.OrdersRow;

namespace SerenityExamples.Tables;

public interface IOrdersDeleteHandler : IDeleteHandler<MyRow, MyRequest, MyResponse>
{
}

public class OrdersDeleteHandler : DeleteRequestHandler<MyRow, MyRequest, MyResponse>, IOrdersDeleteHandler
{
    public OrdersDeleteHandler(
        IRequestContext context)
        : base(context)
    {
    }
}