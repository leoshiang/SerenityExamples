using MyRequest = Serenity.Services.ListRequest;
using MyResponse = Serenity.Services.ListResponse<SerenityExamples.Tables.OrderLinesRow>;
using MyRow = SerenityExamples.Tables.OrderLinesRow;

namespace SerenityExamples.Tables;

public interface IOrderLinesListHandler : IListHandler<MyRow, MyRequest, MyResponse>
{
}

public class OrderLinesListHandler : ListRequestHandler<MyRow, MyRequest, MyResponse>, IOrderLinesListHandler
{
    public OrderLinesListHandler(
        IRequestContext context)
        : base(context)
    {
    }
}