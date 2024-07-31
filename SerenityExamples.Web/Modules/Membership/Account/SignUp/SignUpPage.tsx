import { deepClone, informationDialog, PropertyPanel, resolveUrl, serviceCall, WidgetProps } from "@serenity-is/corelib";
import { SignUpForm, SignupPageModel, SignUpRequest } from "../../../ServerTypes/Membership";
import { SignUpResponse } from "../../../ServerTypes/Membership/SignUpResponse";
import { Texts } from "../../../ServerTypes/Texts";
import { AccountPanelTitle } from "../AccountPanelTitle";

export default function pageInit(opt: SignupPageModel) {
    new SignUpPanel({ element: "#SignUpPanel", ...opt });
}

const myTexts = Texts.Forms.Membership.SignUp;

class SignUpPanel extends PropertyPanel<SignUpRequest, SignupPageModel> {

    protected getFormKey() { return SignUpForm.formKey; }

    private form: SignUpForm;

    constructor(props: WidgetProps<SignupPageModel>) {
        super(props);

        this.form = new SignUpForm(this.idPrefix);

        this.form.Email.domNode.setAttribute("autocomplete", "off");
        this.form.Password.domNode.setAttribute("autocomplete", "new-password");

        this.form.ConfirmEmail.addValidationRule(this.uniqueName, e => {
            if (this.form.ConfirmEmail.value !== this.form.Email.value) {
                return Texts.Validation.EmailConfirm;
            }
        });

        this.form.ConfirmPassword.addValidationRule(this.uniqueName, e => {
            if (this.form.ConfirmPassword.value !== this.form.Password.value) {
                return Texts.Validation.PasswordConfirmMismatch;
            }
        });

        if (this.options.ExternalProviderToken) {
            this.form.DisplayName.value = this.options.DisplayName;
            this.form.Email.value = this.options.Email;
            this.form.ConfirmEmail.value = this.options.Email;
            this.byId("FormInfo").text(myTexts.ConfirmDetails);
        }
    }

    override getPropertyItems() {
        var items = super.getPropertyItems();
        if (this.options.ExternalProviderToken) {
            var items = deepClone(items);
            for (var x of items.filter(x => x.name == "Password" || x.name == "ConfirmPassword")) {
                x.visible = false;
            }
        }
        return items;
    }

    submitClick() {
        if (!this.validateForm()) {
            return;
        }

        var request = this.propertyGrid.save();
        delete request.ConfirmEmail;
        delete request.ConfirmPassword;

        serviceCall({
            url: resolveUrl('~/Account/SignUp'),
            request: { ...request, ExternalProviderToken: this.options.ExternalProviderToken },
            onSuccess: (response: SignUpResponse) => {
                if (response.DemoActivationLink) {
                    informationDialog("You would normally receive an email with instructions to active your account now.\n\n" +
                        "But as this is a DEMO, you'll be redirected to the activation page automatically. ", () => {
                            redirectTo(response.DemoActivationLink);
                        });

                    return;
                }

                if (response.NeedsActivation) {
                    informationDialog(myTexts.Success, () => {
                        redirectTo('~/');
                    });
                }
                else {
                    redirectTo('~/');
                }
            }
        });
    }

    renderContents() {
        const id = this.useIdPrefix();
        return(<>
            <AccountPanelTitle />

            <div class="s-Panel p-4">
                <h5 class="text-center my-4">{myTexts.FormTitle}</h5>
                <p id={id.FormInfo} class="text-center">{myTexts.FormInfo}</p>

                <form id={id.Form} action="" autoComplete="off">
                    <input autoComplete="false" name="hidden" type="text" style="display:none;" />
                    <div id={id.PropertyGrid}></div>
                    <div class="px-field">
                        <button id={id.SubmitButton} type="submit" class="btn btn-primary my-4 w-100"
                            onClick={e => { e.preventDefault(); this.submitClick(); }}>
                            {myTexts.SubmitButton}
                        </button>
                    </div>
                </form>
            </div>
        </>)
    }
}

function redirectTo(url: string) {
    setTimeout(() => {
        window.location.href = resolveUrl(url);
    }, 0);
}