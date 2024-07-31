using MyRequest = Serenity.Services.SaveRequest<SerenityExamples.Tables.OrdersRow>;
using MyResponse = Serenity.Services.SaveResponse;
using MyRow = SerenityExamples.Tables.OrdersRow;

namespace SerenityExamples.Tables;

public interface IOrdersSaveHandler : ISaveHandler<MyRow, MyRequest, MyResponse>
{
}

public class OrdersSaveHandler : SaveRequestHandler<MyRow, MyRequest, MyResponse>, IOrdersSaveHandler
{
    public OrdersSaveHandler(
        IRequestContext context)
        : base(context)
    {
    }
}