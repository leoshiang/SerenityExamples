
namespace SerenityExamples.Administration;

using Serenity.Abstractions;
using Serenity.ComponentModel;
using Serenity.Data;
using Serenity.Web;
using SerenityExamples.Administration.Repositories;
using System;
using System.Collections.Generic;

[DataScript("Administration.PermissionKeys", Permission = PermissionKeys.Security)]
public class PermissionKeysDataScript : DataScript<IEnumerable<string>>
{
    private readonly IPermissionKeyLister permissionKeyLister;

    public PermissionKeysDataScript(IPermissionKeyLister permissionKeyLister)
    {
        this.permissionKeyLister = permissionKeyLister ?? throw new ArgumentNullException(nameof(permissionKeyLister));
        GroupKey = RoleRow.Fields.GenerationKey;
    }

    protected override IEnumerable<string> GetData()
    {
        return permissionKeyLister.ListPermissionKeys(includeRoles: false);
    }
}