using MyRequest = Serenity.Services.RetrieveRequest;
using MyResponse = Serenity.Services.RetrieveResponse<SerenityExamples.Tables.OrderLinesRow>;
using MyRow = SerenityExamples.Tables.OrderLinesRow;

namespace SerenityExamples.Tables;

public interface IOrderLinesRetrieveHandler : IRetrieveHandler<MyRow, MyRequest, MyResponse>
{
}

public class OrderLinesRetrieveHandler : RetrieveRequestHandler<MyRow, MyRequest, MyResponse>,
    IOrderLinesRetrieveHandler
{
    public OrderLinesRetrieveHandler(
        IRequestContext context)
        : base(context)
    {
    }
}