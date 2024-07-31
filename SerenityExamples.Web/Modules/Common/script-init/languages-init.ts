import { EntityDialog, getLookupAsync } from "@serenity-is/corelib";
import { type LanguageRow } from "../../ServerTypes/Administration/LanguageRow";

async function siteLanguageList() {
    var result: string[][] = [];
    var languages = await getLookupAsync<LanguageRow>("Administration.Language");
    for (var k of languages.items) {
        if (k.LanguageId !== 'en')
            result.push([k.Id.toString(), k.LanguageName]);
    }
    return result;
}

siteLanguageList().then(value => EntityDialog.defaultLanguageList = () => value);