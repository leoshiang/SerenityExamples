using SerenityExamples.Administration;

namespace SerenityExamples.Membership.Pages;
public partial class AccountPage : Controller
{
    [Serializable]
    private class TwoFactorData
    {
        public string Username { get; set; }
        public int RetryCount { get; set; }
        public int TwoFactorCode { get; set; }
    }

    private void CheckTwoFactorAuthentication(string username, LoginRequest request, IUserRetrieveService userRetriever,
        IEmailSender emailSender, ISMSService smsService)
    {
        bool isTwoFactorReq = !string.IsNullOrEmpty(request.TwoFactorGuid) || request.TwoFactorCode != null;

        if (isTwoFactorReq)
        {
            ArgumentException.ThrowIfNullOrEmpty(request.TwoFactorGuid);
            ArgumentNullException.ThrowIfNull(request.TwoFactorCode);

            var key = "TwoFactorAuth:" + request.TwoFactorGuid;
            var data = Cache.Distributed.GetAutoJson<TwoFactorData>(key);
            if (data == null || data.Username == null || data.Username != username)
                throw new ValidationError("Can't validate credentials. Please try login again!");

            data.RetryCount++;
            if (data.RetryCount > 3)
            {
                Cache.Distributed.Remove(key);
                throw new ValidationError("Can't validate credentials. Please try login again!");
            }
            else
            {
                Cache.Distributed.SetAutoJson(key, data);
            }

            if (data.TwoFactorCode != request.TwoFactorCode)
                throw new ValidationError("Validation code is invalid. Please check and try again.");

            // login success. clear to not let same two factor guid/two factor code two be reused later
            Cache.Distributed.Remove(key);

            return;
        }

        ArgumentNullException.ThrowIfNull(userRetriever);

        if (userRetriever.ByUsername(username) is UserDefinition user &&
            ((user.TwoFactorAuth == TwoFactorAuthType.SMS &&
              user.MobilePhoneVerified &&
              UserHelper.IsValidPhone(user.MobilePhoneNumber)) ||
             (user.TwoFactorAuth == TwoFactorAuthType.Email)))
        {
            var data = new TwoFactorData
            {
                RetryCount = 0,
                Username = username,
                TwoFactorCode = new Random().Next(9000) + 1000
            };

            // this is to prevent users from sending too many SMS in a certain time interval
            var throttler = new Throttler(Cache.Memory, "TwoFactorAuthThrottle:" + username, TimeSpan.FromMinutes(5), 10);
            if (!throttler.Check())
                throw new ValidationError("Can't proceed with two factor authentication. You are over your validation limit!");

            var twoFactorGuid = Guid.NewGuid().ToString("N");

            string authenticationMessage;
            if (user.TwoFactorAuth == TwoFactorAuthType.SMS)
            {
                ArgumentNullException.ThrowIfNull(smsService);

                var mobile = user.MobilePhoneNumber.Trim();
                smsService.Send(
                    phoneNumber: mobile,
                    text: "Please use code " + data.TwoFactorCode + " for SerenityExamples login.",
                    reason: "Sent by SerenityExamples system for two factor authenication by SMS (" + user.Username + ")");

                // mask mobile number
                mobile = string.Concat(mobile.AsSpan()[..2], new string('*', mobile.Length - 4), mobile.AsSpan(mobile.Length - 2, 2));
                authenticationMessage = "Please enter code sent to your mobile phone with number " + mobile + " in <span class='counter'>{0}</span> seconds." +
                    (smsService is AppServices.FakeSMSService ?
                        " (You can find a text file under App_Data/SMS directory, as you haven't configured SMS service yet)" : "");
            }
            else
            {
                ArgumentNullException.ThrowIfNull(emailSender);

                emailSender.Send(
                    mailTo: user.Email,
                    subject: "Your two-factor authentication code for SerenityExamples login",
                    body: "Please use code " + data.TwoFactorCode + " for SerenityExamples login.");

                authenticationMessage = "Please enter code sent to your email adress in {0} seconds." +
                    " (If you didn't configure an SMTP server, you can find emails under App_Data/Mail directory";
            }

            Cache.Distributed.SetAutoJson("TwoFactorAuth:" + twoFactorGuid, data, TimeSpan.FromMinutes(2));
            throw new ValidationError("TwoFactorAuthenticationRequired",
                authenticationMessage + "|" + twoFactorGuid, "Two factor authentication is required!");
        }
    }
}