import { PropertyPanel, getCookie, notifyError, parseQueryString, resolveUrl, serviceCall, stringFormat, tryGetText } from "@serenity-is/corelib";
import { PromptDialog } from "@serenity-is/extensions";
import { LoginForm, LoginPageModel, LoginRequest } from "../../../ServerTypes/Membership";
import { Texts } from "../../../ServerTypes/Texts";
import { AccountPanelTitle } from "../AccountPanelTitle";

export default function pageInit(props: LoginPageModel) {
    return <LoginPanel {...props} element="#LoginPanel" ref={panel => {
        let form = panel.form;
        form.Username.element.attr("autocomplete", "username");
        form.Password.element.attr("autocomplete", "current-password");
        if (props?.ActivatedUser) {
            form.Username.value = props.ActivatedUser;
            form.Password.element.focus();
        }
        //#if (IsPublicDemo)
        else if ((props as any).IsPublicDemo) {
            form.Username.domNode.setAttribute("placeholder", form.Username.value = 'admin');
            form.Password.domNode.setAttribute("placeholder", form.Password.value = 'serenity');
        }
        //#endif*/
    }} />
}

class LoginPanel extends PropertyPanel<LoginRequest, LoginPageModel> {

    protected getFormKey() { return LoginForm.formKey; }

    readonly form = new LoginForm(this.idPrefix);

    protected loginClick() {
        if (!this.validateForm())
            return;

        var request = this.getSaveEntity();

        serviceCall({
            url: resolveUrl('~/Account/Login'),
            request: request,
            onSuccess: redirectToReturnUrl,
            onError: (response) => {
                if (response?.Error?.Code === "TwoFactorAuthenticationRequired") {
                    var args = response.Error.Arguments.split('|');
                    handleTwoFactorAuth(request.Username, request.Password, args[1], args[0]);
                    return true;
                }

                if (response?.Error?.Code === "RedirectUserTo") {
                    window.location.href = response.Error.Arguments;
                    return true;
                }

                if (response?.Error?.Message?.length) {
                    notifyError(response.Error.Message);
                    this.form.Password.element.focus();
                    return true;
                }
            }
        });

    }

    protected renderContents() {
        const id = this.useIdPrefix();
        const texts = Texts.Forms.Membership.Login;
        return (<>
            <AccountPanelTitle />
            <div class="s-Panel p-4">
                <h5 class="text-center my-4">{texts.LoginToYourAccount}</h5>
                <form id={id.Form} action="">
                    <div id={id.PropertyGrid}></div>
                    <div class="px-field">
                        <a class="float-end text-decoration-none" href={resolveUrl('~/Account/ForgotPassword')}>
                            {texts.ForgotPassword}
                        </a>
                    </div>
                    <div class="px-field">
                        <button id={id.LoginButton} type="submit" class="btn btn-primary my-3 w-100"
                            onClick={e => {
                                e.preventDefault();
                                this.loginClick();
                            }}>
                            {texts.SignInButton}
                        </button>
                    </div>
                </form>
            </div>
            <div class="text-center mt-2">
                <a class="text-decoration-none" href={resolveUrl('~/Account/SignUp')}>{texts.SignUpButton}</a>
            </div>
        </>);
    }
}

function getReturnUrl() {
    var q = parseQueryString();
    return q['returnUrl'] || q['ReturnUrl'];
}

function handleTwoFactorAuth(user: string, pass: string, twoFactorGuid: string, info: string) {
    var tries = 0;
    var remaining = 120;
    var dialog: PromptDialog = null;
    var showDialog = () => {
        dialog = new PromptDialog({
            title: "Two Factor Authentication",
            editorOptions: {
                maxLength: 4
            },
            editorType: "Integer",
            message: info,
            isHtml: true,
            required: true,
            validateValue: (x) => {
                if (x >= 1000 && x <= 9999) {
                    tries++;
                    serviceCall({
                        url: resolveUrl('~/Account/Login'),
                        request: {
                            Username: user,
                            Password: pass,
                            TwoFactorGuid: twoFactorGuid,
                            TwoFactorCode: x
                        },
                        onSuccess: redirectToReturnUrl,
                        onError: z => {
                            notifyError(z.Error.Message);
                            if (tries > 2) {
                                notifyError("Code entered is invalid! You can't try more than 3 times!");
                                dialog = null;
                                return;
                            }
                            showDialog();
                        }
                    });
                    return true;
                }

                notifyError("Please enter a valid code!");
                return false;
            }
        });

        dialog.dialogOpen();
    };

    function updateCounter() {
        remaining -= 1;
        if (dialog != null) {
            let counter = (dialog.domNode.querySelector("span.counter") as HTMLElement);
            counter && (counter.textContent = remaining.toString());
        }

        if (remaining >= 0)
            setTimeout(updateCounter, 1000);
        else if (dialog != null)
            dialog.dialogClose("done");
    };

    showDialog();
    window.setTimeout(updateCounter, 1000);
}

function redirectToReturnUrl() {
    var returnUrl = getReturnUrl();
    if (returnUrl && /^\//.test(returnUrl)) {
        var hash = window.location.hash;
        if (hash != null && hash != '#')
            returnUrl += hash;
        window.location.href = returnUrl;
    }
    else {
        window.location.href = resolveUrl('~/');
    }
}

//#if (OpenIdClient)
const externalLoginColorMap = {
    "Google": "#ea4335",
    "GitHub": "#333",
    "Microsoft": "#0078d7"
}

function ExternalLoginSection({ providers }: { providers: string[] }) {
    let texts = Texts.Forms.Membership.Login;
    let returnUrl = getReturnUrl();
    return <>
        {providers?.length > 0 &&
            <div class="s-horizontal-divider">
                <span>{texts.OR}</span>
            </div>}
        {providers?.map(providerName =>
            <form method="post"
                action={resolveUrl("~/Account/ExternalLogin") + (returnUrl ? "?ReturnUrl=" + encodeURIComponent(returnUrl) : "")}>
                <input hidden name="__RequestVerificationToken" value={getCookie("CSRF-TOKEN")} />
                <div class="px-field">
                    <button type="submit" name="provider" value={providerName}
                        class="btn my-2 w-100 d-flex align-items-center justify-content-center text-white"
                        style={`background-color: ${externalLoginColorMap[providerName] ?? "#6c757d"}`}>
                        <i class={"mx-1 fab fa-lg fa-" + providerName.toLowerCase()} aria-hidden="true"></i>
                        {tryGetText("Forms.Membership.Login.SignInWith" + providerName) ??
                            stringFormat(texts.SignInWithGeneric, providerName)}
                    </button>
                </div>
            </form>)}
    </>
}
//#endif
