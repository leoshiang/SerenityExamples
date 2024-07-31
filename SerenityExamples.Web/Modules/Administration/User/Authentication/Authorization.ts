import { getRemoteData } from "@serenity-is/corelib";
import { RemoteDataKeys } from "../../../ServerTypes/RemoteDataKeys";
import { ScriptUserDefinition } from "../../../ServerTypes/ScriptUserDefinition";

export function userDefinition() {
    return getRemoteData(RemoteDataKeys.UserData) as ScriptUserDefinition;
}

export function hasPermission(permissionKey: string): boolean {
    let ud = userDefinition();
    return ud.Username === 'admin' || !!ud.Permissions[permissionKey];
}