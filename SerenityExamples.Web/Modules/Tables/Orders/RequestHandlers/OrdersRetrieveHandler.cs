using MyRequest = Serenity.Services.RetrieveRequest;
using MyResponse = Serenity.Services.RetrieveResponse<SerenityExamples.Tables.OrdersRow>;
using MyRow = SerenityExamples.Tables.OrdersRow;

namespace SerenityExamples.Tables;

public interface IOrdersRetrieveHandler : IRetrieveHandler<MyRow, MyRequest, MyResponse>
{
}

public class OrdersRetrieveHandler : RetrieveRequestHandler<MyRow, MyRequest, MyResponse>, IOrdersRetrieveHandler
{
    public OrdersRetrieveHandler(
        IRequestContext context)
        : base(context)
    {
    }
}