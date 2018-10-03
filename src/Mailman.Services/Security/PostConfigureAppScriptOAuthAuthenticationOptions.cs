using Microsoft.Extensions.Options;

namespace Mailman.Services.Security
{
    public class PostConfigureAppScriptOAuthAuthenticationOptions : IPostConfigureOptions<AppScriptOAuthAuthenticationOptions>
    {
        public void PostConfigure(string name, AppScriptOAuthAuthenticationOptions options)
        {
        }
    }
}