using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authentication.OAuth;

namespace Mailman.Services.Security
{
    public class AppScriptOAuthAuthenticationOptions : AuthenticationSchemeOptions
    {
        public string SignInScheme { get; set; } = CookieAuthenticationDefaults.AuthenticationScheme;
        public bool SaveTokens { get; set; } = true;
    }
}