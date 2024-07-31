using MyRequest = Serenity.Services.SaveRequest<SerenityExamples.Administration.LanguageRow>;
using MyResponse = Serenity.Services.SaveResponse;
using MyRow = SerenityExamples.Administration.LanguageRow;

namespace SerenityExamples.Administration;
public interface ILanguageSaveHandler : ISaveHandler<MyRow, MyRequest, MyResponse> { }
public class LanguageSaveHandler(IRequestContext context) :
    SaveRequestHandler<MyRow, MyRequest, MyResponse>(context), ILanguageSaveHandler
{
}