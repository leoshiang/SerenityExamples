using MyRequest = Serenity.Services.SaveRequest<SerenityExamples.Administration.RoleRow>;
using MyResponse = Serenity.Services.SaveResponse;
using MyRow = SerenityExamples.Administration.RoleRow;

namespace SerenityExamples.Administration;
public interface IRoleSaveHandler : ISaveHandler<MyRow, MyRequest, MyResponse> { }
public class RoleSaveHandler(IRequestContext context) :
    SaveRequestHandler<MyRow, MyRequest, MyResponse>(context), IRoleSaveHandler
{
    protected override void InvalidateCacheOnCommit()
    {
        base.InvalidateCacheOnCommit();

        Cache.InvalidateOnCommit(UnitOfWork, UserPermissionRow.Fields);
        Cache.InvalidateOnCommit(UnitOfWork, RolePermissionRow.Fields);
    }
}