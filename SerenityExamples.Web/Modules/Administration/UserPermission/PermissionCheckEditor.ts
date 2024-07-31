import {
    DataGrid, Decorators, Dictionary,
    Fluent,
    GridUtils, Grouping, IGetEditValue, ISetEditValue, SlickFormatting, SlickTreeHelper, ToolButton,
    WidgetProps,
    count, getRemoteDataAsync, htmlEncode, localText, stripDiacritics, toGrouping, tryGetText, turkishLocaleCompare
} from "@serenity-is/corelib";
import { Column } from "@serenity-is/sleekgrid";
import { UserPermissionRow } from "../../ServerTypes/Administration";

export interface PermissionCheckEditorOptions {
    showRevoke?: boolean;
    value?: (UserPermissionRow | string)[];
    rolePermissions?: string[];
    implicitPermissions?: Record<string, string[]>;
}

export interface PermissionCheckItem {
    ParentKey?: string;
    Key?: string;
    Title?: string;
    IsGroup?: boolean;
    GrantRevoke?: boolean;
}

@Decorators.registerEditor('SerenityExamples.Administration.PermissionCheckEditor', [IGetEditValue, ISetEditValue])
export class PermissionCheckEditor<P extends PermissionCheckEditorOptions = PermissionCheckEditorOptions> extends DataGrid<PermissionCheckItem, P> {

    protected getIdProperty() { return "Key"; }

    private searchText: string;
    private byParentKey: Grouping<PermissionCheckItem>;

    constructor(props: WidgetProps<P>) {
        super(props);

        let titleByKey: Dictionary<string> = {};
        this.getSortedGroupAndPermissionKeys(titleByKey, (permissionKeys) => {
            if (!this.domNode)
                return;

            let items = permissionKeys.map(key => <PermissionCheckItem>{
                Key: key,
                ParentKey: this.getParentKey(key),
                Title: titleByKey[key],
                GrantRevoke: null,
                IsGroup: key.charAt(key.length - 1) === ':'
            });

            this.byParentKey = toGrouping(items, x => x.ParentKey);
            this.setItems(items);
            this.value = this._value;
        });

        if (this.options.value) {
            if (typeof this.options.value[0] === "string")
                this.valueAsStrings = this.options.value as string[];
            else
                this.value = this.options.value as UserPermissionRow[];
        }

        this.implicitPermissions = props.implicitPermissions;
        this.rolePermissions = props.rolePermissions;
    }

    private getItemGrantRevokeClass(item: PermissionCheckItem, grant: boolean): string {
        if (!item.IsGroup) {
            return ((item.GrantRevoke === grant) ? ' checked' : '');
        }

        let desc = this.getDescendants(item, true);
        let granted = desc.filter(x => x.GrantRevoke === grant);

        if (!granted.length) {
            return '';
        }

        if (desc.length === granted.length) {
            return 'checked';
        }

        return 'checked partial';
    }

    private roleOrImplicit(key): boolean {
        if (this._rolePermissions[key])
            return true;

        for (var k of Object.keys(this._rolePermissions)) {
            var d = this._implicitPermissions[k];
            if (d && d[key])
                return true;
        }

        for (var i of Object.keys(this._implicitPermissions)) {
            var item = this.view.getItemById(i);
            if (item && item.GrantRevoke == true) {
                var d = this._implicitPermissions[i];
                if (d && d[key])
                    return true;
            }
        }
    }

    private getItemEffectiveClass(item: PermissionCheckItem): string {

        if (item.IsGroup) {
            let desc = this.getDescendants(item, true);
            let grantCount = count(desc, x => x.GrantRevoke === true ||
                (x.GrantRevoke == null && this.roleOrImplicit(x.Key)));

            if (grantCount === desc.length || desc.length === 0) {
                return 'allow';
            }

            if (grantCount === 0) {
                return 'deny';
            }

            return 'partial';
        }

        let granted = item.GrantRevoke === true ||
            (item.GrantRevoke == null && this.roleOrImplicit(item.Key));

        return (granted ? ' allow' : ' deny');
    }

    protected getColumns(): Column[] {
        let columns: Column[] = [{
            name: localText('Site.UserPermissionDialog.Permission'),
            field: 'Title',
            format: SlickFormatting.treeToggle(() => this.view, x => x.Key, ctx => {
                let item = ctx.item;
                let klass = this.getItemEffectiveClass(item);
                return '<span class="effective-permission ' + klass + '">' + htmlEncode(ctx.value) + '</span>';
            }),
            width: 495,
            sortable: false
        }, {
            name: localText('Site.UserPermissionDialog.Grant'), field: 'Grant',
            format: ctx => {
                let item1 = ctx.item;
                let klass1 = this.getItemGrantRevokeClass(item1, true);
                return "<span class='check-box grant no-float " + klass1 + "'></span>";
            },
            width: 65,
            sortable: false,
            headerCssClass: 'align-center',
            cssClass: 'align-center'
        }];

        if (this.options.showRevoke) {
            columns.push({
                name: localText('Site.UserPermissionDialog.Revoke'), field: 'Revoke',
                format: ctx => {
                    let item2 = ctx.item;
                    let klass2 = this.getItemGrantRevokeClass(item2, false);
                    return '<span class="check-box revoke no-float ' + klass2 + '"></span>';
                },
                width: 65,
                sortable: false,
                headerCssClass: 'align-center',
                cssClass: 'align-center'
            });
        }

        return columns;
    }

    public setItems(items: PermissionCheckItem[]): void {
        SlickTreeHelper.setIndents(items, x => x.Key, x => x.ParentKey, false);
        this.view.setItems(items, true);
    }

    protected onViewSubmit() {
        return false;
    }

    protected onViewFilter(item: PermissionCheckItem): boolean {
        if (!super.onViewFilter(item)) {
            return false;
        }

        if (!SlickTreeHelper.filterById(item, this.view, x => x.ParentKey))
            return false;

        if (this.searchText) {
            return this.matchContains(item) || item.IsGroup && this.getDescendants(item, false).some(x => this.matchContains(x));
        }

        return true;
    }

    private matchContains(item: PermissionCheckItem): boolean {
        return stripDiacritics(item.Title || '').toLowerCase().indexOf(this.searchText) >= 0;
    }

    private getDescendants(item: PermissionCheckItem, excludeGroups: boolean): PermissionCheckItem[] {
        let result: PermissionCheckItem[] = [];
        let stack = [item];
        while (stack.length > 0) {
            let i = stack.pop();
            let children = this.byParentKey[i.Key];
            if (!children)
                continue;

            for (let child of children) {
                if (!excludeGroups || !child.IsGroup) {
                    result.push(child);
                }

                stack.push(child);
            }
        }

        return result;
    }

    protected onClick(e, row, cell): void {
        super.onClick(e, row, cell);

        if (!Fluent.isDefaultPrevented(e)) {
            SlickTreeHelper.toggleClick(e, row, cell, this.view, (x: any) => x.Key);
        }

        if (Fluent.isDefaultPrevented(e)) {
            return;
        }

        let target = Fluent(e.target);
        let grant = target.hasClass('grant');

        if (grant || target.hasClass('revoke')) {
            e.preventDefault();

            let item = this.itemAt(row);
            let checkedOrPartial = target.hasClass('checked') || target.hasClass('partial');

            if (checkedOrPartial) {
                grant = null;
            }
            else {
                grant = grant !== checkedOrPartial;
            }

            if (item.IsGroup) {
                for (var d of this.getDescendants(item, true)) {
                    d.GrantRevoke = grant;
                }
            }
            else
                item.GrantRevoke = grant;

            this.slickGrid.invalidate();
        }
    }

    private getParentKey(key): string {
        if (key.charAt(key.length - 1) === ':') {
            key = key.substr(0, key.length - 1);
        }

        let idx = key.lastIndexOf(':');
        if (idx >= 0) {
            return key.substr(0, idx + 1);
        }
        return null;
    }

    protected getButtons(): ToolButton[] {
        return [];
    }

    protected createToolbarExtensions(): void {
        super.createToolbarExtensions();
        GridUtils.addQuickSearchInputCustom(this.toolbar.domNode, (_, text) => {
            this.searchText = stripDiacritics(text?.trim() ?? '').toLowerCase();
            this.view.setItems(this.view.getItems(), true);
        });
    }

    private getSortedGroupAndPermissionKeys(titleByKey: Dictionary<string>, then: (result: string[]) => void) {
        getRemoteDataAsync('Administration.PermissionKeys').then((keys: string[]) => {
            let titleWithGroup = {};
            for (var k of keys) {
                let s = k;

                if (!s) {
                    continue;
                }

                if (s.charAt(s.length - 1) == ':') {
                    s = s.substring(0, s.length - 1);
                    if (s.length === 0) {
                        continue;
                    }
                }

                if (titleByKey[s]) {
                    continue;
                }

                titleByKey[s] = tryGetText('Permission.' + s) ?? s;
                let parts = s.split(':');
                let group = '';
                let groupTitle = '';
                for (let i = 0; i < parts.length - 1; i++) {
                    group = group + parts[i] + ':';
                    let txt = tryGetText('Permission.' + group);
                    if (txt == null) {
                        txt = parts[i];
                    }
                    titleByKey[group] = txt;
                    groupTitle = groupTitle + titleByKey[group] + ':';
                    titleWithGroup[group] = groupTitle;
                }

                titleWithGroup[s] = groupTitle + titleByKey[s];
            }

            keys = Object.keys(titleByKey);
            keys = keys.sort((x, y) => turkishLocaleCompare(titleWithGroup[x], titleWithGroup[y]));

            then(keys);
        });
    }

    private _value: UserPermissionRow[];

    get value(): UserPermissionRow[] {

        let result: UserPermissionRow[] = [];

        if (!this.view.getItems().length) {
            // probably permission keys not loaded yet
            return (this._value || []).map(x => ({
                PermissionKey: x.PermissionKey,
                Granted: x.Granted
            }));
        }

        for (let item of this.view.getItems()) {
            if (item.GrantRevoke != null && item.Key.charAt(item.Key.length - 1) != ':') {
                result.push({ PermissionKey: item.Key, Granted: item.GrantRevoke });
            }
        }

        return result;
    }

    set value(value: UserPermissionRow[]) {

        this._value = (value || [])

        for (let item of this.view.getItems()) {
            item.GrantRevoke = null;
        }

        for (let item of this._value) {
            let r = this.view.getItemById(item.PermissionKey);
            r && (r.GrantRevoke = item.Granted ?? true);
        }

        this.setItems(this.getItems());
    }

    get valueAsStrings() {
        return this.value.map(x => x.PermissionKey);
    }

    set valueAsStrings(value: string[]) {
        this.value = (value || []).map(x => ({ PermissionKey: x }));
    }

    private _rolePermissions: Dictionary<boolean> = {};

    get rolePermissions(): string[] {
        return Object.keys(this._rolePermissions);
    }

    set rolePermissions(value: string[]) {
        this._rolePermissions = {};

        if (value) {
            for (let k of value) {
                this._rolePermissions[k] = true;
            }
        }

        this.setItems(this.getItems());
    }

    private _implicitPermissions: Record<string, Record<string, boolean>> = {};

    set implicitPermissions(value: Record<string, string[]>) {
        this._implicitPermissions = {};

        if (value) {
            for (var k of Object.keys(value)) {
                this._implicitPermissions[k] = this._implicitPermissions[k] || {};
                var l = value[k];
                if (l) {
                    for (var s of l)
                        this._implicitPermissions[k][s] = true;
                }
            }
        }
    }
}