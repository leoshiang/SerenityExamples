using MyRequest = Serenity.Services.ListRequest;
using MyResponse = Serenity.Services.ListResponse<SerenityExamples.Administration.LanguageRow>;
using MyRow = SerenityExamples.Administration.LanguageRow;


namespace SerenityExamples.Administration;
public interface ILanguageListHandler : IListHandler<MyRow, MyRequest, MyResponse> { }

public class LanguageListHandler(IRequestContext context) :
    ListRequestHandler<MyRow, MyRequest, MyResponse>(context), ILanguageListHandler
{
}