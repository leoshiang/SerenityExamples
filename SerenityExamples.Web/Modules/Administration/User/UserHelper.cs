using Microsoft.AspNetCore.DataProtection;
using Microsoft.AspNetCore.WebUtilities;
using Microsoft.Extensions.Caching.Memory;
using Microsoft.IdentityModel.Tokens;
using Serenity.Web.Providers;
using System.Data;
using System.IO;
using MyRow = SerenityExamples.Administration.UserRow;

namespace SerenityExamples.Administration;
public static class UserHelper
{
    private static MyRow.RowFields Fld { get { return MyRow.Fields; } }

    public static bool IsValidPhone(string number)
    {
        // please change this to a valid check for mobile phones in your country
        return !string.IsNullOrEmpty(number) && number.Length > 7 && long.TryParse(number, out long _);
    }

    public static string ValidateDisplayName(string displayName, ITextLocalizer localizer)
    {
        displayName = displayName.TrimToNull();

        if (displayName == null)
            throw DataValidation.RequiredError(Fld.DisplayName, localizer);

        return displayName;
    }

    public static string CalculateHash(string password, string salt)
    {
        return SiteMembershipProvider.ComputeSHA512(password + salt);
    }

    public static string GenerateHash(string password, ref string salt)
    {
        salt ??= Serenity.IO.TemporaryFileHelper.RandomFileCode()[..5];
        return CalculateHash(password, salt);
    }

    public static string GetImpersonationToken(IDataProtector dataProtector,
        byte[] clientHash, string forUsername, string username)
    {
        byte[] bytes;
        using (var ms = new MemoryStream())
        using (var bw = new BinaryWriter(ms))
        {
            bw.Write(DateTime.UtcNow.AddMinutes(60).ToBinary());
            bw.Write(forUsername);
            bw.Write(username);
            bw.Write(clientHash);
            bw.Flush();
            bytes = ms.ToArray();
        }

        return WebEncoders.Base64UrlEncode(dataProtector.Protect(bytes));
    }

    public static MyRow GetUser(IDbConnection connection, BaseCriteria filter)
    {
        var row = new MyRow();
        if (new SqlQuery().From(row)
            .Select(
                Fld.UserId,
                Fld.Username,
                Fld.DisplayName,
                Fld.PasswordHash,
                Fld.PasswordSalt,
                Fld.IsActive)
            .Where(filter)
            .GetFirst(connection))
        {
            return row;
        }

        return null;
    }

    public static bool IsInvariantLetter(char c)
    {
        return (c >= 'A' && c <= 'Z') ||
            (c >= 'a' && c <= 'z');
    }

    public static bool IsDigit(char c)
    {
        return (c >= '0' && c <= '9');
    }

    public static bool IsValidEmailChar(char c)
    {
        return IsInvariantLetter(c) ||
            IsDigit(c) ||
            c == '.' ||
            c == '-' ||
            c == '_' ||
            c == '@';
    }

    public static bool IsValidUsername(string name)
    {
        if (name == null ||
            name.Length < 0)
            return false;

        var c = name[0];
        if (!IsInvariantLetter(c))
            return false;

        for (var i = 1; i < name.Length - 1; i++)
        {
            c = name[i];
            if (!IsValidEmailChar(c))
                return false;
        }

        return true;
    }
}