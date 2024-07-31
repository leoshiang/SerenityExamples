using MyRequest = Serenity.Services.SaveRequest<SerenityExamples.Tables.OrderLinesRow>;
using MyResponse = Serenity.Services.SaveResponse;
using MyRow = SerenityExamples.Tables.OrderLinesRow;

namespace SerenityExamples.Tables;

public interface IOrderLinesSaveHandler : ISaveHandler<MyRow, MyRequest, MyResponse>
{
}

public class OrderLinesSaveHandler : SaveRequestHandler<MyRow, MyRequest, MyResponse>, IOrderLinesSaveHandler
{
    public OrderLinesSaveHandler(
        IRequestContext context)
        : base(context)
    {
    }
}