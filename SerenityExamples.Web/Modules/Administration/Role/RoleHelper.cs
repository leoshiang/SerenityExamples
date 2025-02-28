using MyRow = SerenityExamples.Administration.RoleRow;

namespace SerenityExamples.Administration;
public static class RoleHelper
{
    private static MyRow.RowFields Fld { get { return MyRow.Fields; } }
    public static Dictionary<int, MyRow> GetRoleById(ITwoLevelCache cache, ISqlConnections sqlConnections)
    {
        ArgumentNullException.ThrowIfNull(cache);

        return cache.GetLocalStoreOnly("RoleById", TimeSpan.Zero,
            Fld.GenerationKey, () =>
            {
                ArgumentNullException.ThrowIfNull(sqlConnections);

                using var connection = sqlConnections.NewFor<MyRow>();
                return connection.List<MyRow>().ToDictionary(x => x.RoleId.Value);
            });
    }
}
