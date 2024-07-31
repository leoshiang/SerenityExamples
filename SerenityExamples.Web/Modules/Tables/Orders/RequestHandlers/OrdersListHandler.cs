using MyRequest = Serenity.Services.ListRequest;
using MyResponse = Serenity.Services.ListResponse<SerenityExamples.Tables.OrdersRow>;
using MyRow = SerenityExamples.Tables.OrdersRow;

namespace SerenityExamples.Tables;

public interface IOrdersListHandler : IListHandler<MyRow, MyRequest, MyResponse>
{
}

public class OrdersListHandler : ListRequestHandler<MyRow, MyRequest, MyResponse>, IOrdersListHandler
{
    public OrdersListHandler(
        IRequestContext context)
        : base(context)
    {
    }
}