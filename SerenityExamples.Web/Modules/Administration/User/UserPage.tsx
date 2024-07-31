import { Decorators, Dialog, EditorUtils, EntityDialog, EntityGrid, WidgetProps, cancelDialogButton, faIcon, getRemoteDataAsync, gridPageInit, localText, notifySuccess, okDialogButton, resolveUrl, stringFormat } from "@serenity-is/corelib";
import { addPasswordStrengthValidation } from "@serenity-is/extensions";
import { RoleRow, UserColumns, UserForm, UserPermissionService, UserRow, UserService } from "../../ServerTypes/Administration";
import { RemoteDataKeys } from "../../ServerTypes/RemoteDataKeys";
import { Texts } from "../../ServerTypes/Texts";
import { PermissionCheckEditor } from "../UserPermission/PermissionCheckEditor";

export default () => gridPageInit(UserGrid)

class UserGrid<P = {}> extends EntityGrid<UserRow, P> {
    protected override getColumnsKey() { return UserColumns.columnsKey; }
    protected override getDialogType() { return UserDialog; }
    protected override getIdProperty() { return UserRow.idProperty; }
    protected override getIsActiveProperty() { return UserRow.isActiveProperty; }
    protected override getLocalTextPrefix() { return UserRow.localTextPrefix; }
    protected override getService() { return UserService.baseUrl; }

    protected override createIncludeDeletedButton() { }

    protected override getColumns() {
        let columns = new UserColumns(super.getColumns());

        columns.ImpersonationToken && (columns.ImpersonationToken.format = ctx => !ctx.value ? "" :
            <a target="_blank" href={resolveUrl(`~/Account/ImpersonateAs?token=${encodeURIComponent(ctx.value)}`)}>
                <i class={faIcon("user-secret", "primary")}></i>
            </a>);

        columns.Roles && (columns.Roles.format = ctx => !ctx?.value?.length ? "" : <span ref={async el => {
            let lookup = await RoleRow.getLookupAsync();
            let roleList = ctx.value.map((x: number) => (lookup.itemById[x] || {}).RoleName || "");
            roleList.sort();
            el.textContent = roleList.join(", ");
        }}><i class={faIcon("spinner")}></i></span>)

        return columns.valueOf();
    }
}

@Decorators.registerClass("SerenityExamples.Administration.UserDialog")
export class UserDialog<P = {}> extends EntityDialog<UserRow, P> {
    protected override getFormKey() { return UserForm.formKey; }
    protected override getIdProperty() { return UserRow.idProperty; }
    protected override getIsActiveProperty() { return UserRow.isActiveProperty; }
    protected override getLocalTextPrefix() { return UserRow.localTextPrefix; }
    protected override getNameProperty() { return UserRow.nameProperty; }
    protected override getService() { return UserService.baseUrl; }

    protected form = new UserForm(this.idPrefix);

    constructor(props: WidgetProps<P>) {
        super(props);

        this.form.Password.domNode.setAttribute("autocomplete", "new-password");

        addPasswordStrengthValidation(this.form.Password, this.uniqueName);

        this.form.Password.change(() => EditorUtils.setRequired(this.form.PasswordConfirm, this.form.Password.value.length > 0));

        this.form.PasswordConfirm.addValidationRule(this.uniqueName, e => {
            if (this.form.Password.value != this.form.PasswordConfirm.value)
                return localText(Texts.Validation.PasswordConfirmMismatch);
        });
    }

    protected getToolbarButtons() {
        let buttons = super.getToolbarButtons();

        buttons.push({
            title: localText(Texts.Site.UserDialog.EditPermissionsButton),
            cssClass: 'edit-permissions-button',
            disabled: this.isNewOrDeleted.bind(this),
            icon: faIcon("lock", "success"),
            onClick: () => {
                UserPermissionDialog({
                    userID: this.entity.UserId,
                    username: this.entity.Username
                });
            }
        });

        return buttons;
    }

    protected afterLoadEntity() {
        super.afterLoadEntity();

        // these fields are only required in new record mode
        EditorUtils.setRequired(this.form.Password, this.isNew());
        EditorUtils.setRequired(this.form.PasswordConfirm, this.isNew());
    }
}

async function UserPermissionDialog(props: { userID: number, username: string }) {

    let { Entities: permissions, RolePermissions: rolePermissions } = await UserPermissionService.List({
        UserID: props.userID,
        RolePermissions: true
    });

    let implicitPermissions = await getRemoteDataAsync<Record<string, string[]>>(RemoteDataKeys.Administration.ImplicitPermissions);

    var checkEditor: PermissionCheckEditor;
    new Dialog({
        dialogClass: "s-UserPermissionDialog",
        title: stringFormat(Texts.Site.UserPermissionDialog.DialogTitle, props.username),
        buttons: [
            okDialogButton({
                click: async () => {
                    await UserPermissionService.Update({
                        UserID: props.userID,
                        Permissions: checkEditor.value
                    });
                    notifySuccess(Texts.Site.UserPermissionDialog.SaveSuccess);
                }
            }),
            cancelDialogButton()
        ],
        element: el => el.appendChild(<PermissionCheckEditor ref={w => checkEditor = w}
            showRevoke={true} value={permissions} implicitPermissions={implicitPermissions} rolePermissions={rolePermissions} />)
    });
}

