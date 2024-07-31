import { Decorators, Dialog, EntityDialog, EntityGrid, cancelDialogButton, faIcon, getRemoteDataAsync, gridPageInit, notifySuccess, okDialogButton, stringFormat } from "@serenity-is/corelib";
import { RoleColumns, RoleForm, RolePermissionService, RoleRow, RoleService } from "../../ServerTypes/Administration";
import { RemoteDataKeys } from "../../ServerTypes/RemoteDataKeys";
import { Texts } from "../../ServerTypes/Texts";
import { PermissionCheckEditor } from "../UserPermission/PermissionCheckEditor";

export default () => gridPageInit(RoleGrid)

class RoleGrid extends EntityGrid<RoleRow> {
    protected override getColumnsKey() { return RoleColumns.columnsKey; }
    protected override getDialogType() { return RoleDialog; }
    protected override getRowDefinition() { return RoleRow; }
    protected override getService() { return RoleService.baseUrl; }
}

@Decorators.registerClass('SerenityExamples.Administration.RoleDialog')
export class RoleDialog<P = {}> extends EntityDialog<RoleRow, P> {
    protected override getFormKey() { return RoleForm.formKey; }
    protected override getRowDefinition() { return RoleRow; }
    protected override getService() { return RoleService.baseUrl; }

    protected override getToolbarButtons() {
        let buttons = super.getToolbarButtons();

        buttons.push({
            title: Texts.Site.RolePermissionDialog.EditButton,
            action: "edit-permissions",
            disabled: () => this.isNewOrDeleted(),
            icon: faIcon("lock", "success"),
            onClick: () => {
                RolePermissionDialog({
                    roleID: this.entity.RoleId,
                    roleName: this.entity.RoleName
                });
            }
        });

        return buttons;
    }
}

async function RolePermissionDialog(props: {
    roleID?: number,
    roleName?: string,
}) {
    let checkEditor: PermissionCheckEditor;
    let permissions = (await RolePermissionService.List({ RoleID: props.roleID, })).Entities;
    let implicitPermissions = await getRemoteDataAsync<Record<string, string[]>>(RemoteDataKeys.Administration.ImplicitPermissions);

    new Dialog({
        dialogClass: "s-RolePermissionDialog",
        title: stringFormat(Texts.Site.RolePermissionDialog.DialogTitle, props.roleName),
        buttons: [
            okDialogButton({
                click: async () => {
                    await RolePermissionService.Update({
                        RoleID: props.roleID,
                        Permissions: checkEditor.valueAsStrings
                    });
                    notifySuccess(Texts.Site.RolePermissionDialog.SaveSuccess);
                }
            }),
            cancelDialogButton()
        ],
        element: el => el.appendChild(<PermissionCheckEditor ref={w => checkEditor = w}
            showRevoke={false} value={permissions} implicitPermissions={implicitPermissions} />)
    });
}