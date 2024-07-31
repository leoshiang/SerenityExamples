using MyRequest = Serenity.Services.ListRequest;
using MyResponse = Serenity.Services.ListResponse<SerenityExamples.Administration.RoleRow>;
using MyRow = SerenityExamples.Administration.RoleRow;


namespace SerenityExamples.Administration;
public interface IRoleListHandler : IListHandler<MyRow, MyRequest, MyResponse> { }

public class RoleListHandler(IRequestContext context) :
    ListRequestHandler<MyRow, MyRequest, MyResponse>(context), IRoleListHandler
{
}