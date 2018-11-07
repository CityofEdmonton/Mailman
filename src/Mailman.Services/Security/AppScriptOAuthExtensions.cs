using Microsoft.AspNetCore.Authentication;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.DependencyInjection.Extensions;
using Microsoft.Extensions.Options;
using System;
using System.Collections.Generic;
using System.Text;

namespace Mailman.Services.Security
{
    public static class AppScriptOAuthExtensions
    {
        public static AuthenticationBuilder AddAppScriptOAuth(this AuthenticationBuilder builder)
            => builder.AddAppScriptOAuth(AppScriptOAuthAuthenticationDefaults.AuthenticationScheme);

        public static AuthenticationBuilder AddAppScriptOAuth(this AuthenticationBuilder builder, string authenticationScheme)
            => builder.AddAppScriptOAuth(authenticationScheme, configureOptions: null);

        public static AuthenticationBuilder AddAppScriptOAuth(this AuthenticationBuilder builder, Action<AppScriptOAuthAuthenticationOptions> configureOptions)
            => builder.AddAppScriptOAuth(AppScriptOAuthAuthenticationDefaults.AuthenticationScheme, configureOptions);

        public static AuthenticationBuilder AddAppScriptOAuth(this AuthenticationBuilder builder, string authenticationScheme, Action<AppScriptOAuthAuthenticationOptions> configureOptions)
            => builder.AddAppScriptOAuth(authenticationScheme, displayName: null, configureOptions: configureOptions);

        public static AuthenticationBuilder AddAppScriptOAuth(this AuthenticationBuilder builder, string authenticationScheme, string displayName, Action<AppScriptOAuthAuthenticationOptions> configureOptions)
        {
            builder.Services.TryAddEnumerable(ServiceDescriptor.Singleton<IPostConfigureOptions<AppScriptOAuthAuthenticationOptions>, PostConfigureAppScriptOAuthAuthenticationOptions>());
            return builder.AddScheme<AppScriptOAuthAuthenticationOptions, AppScriptOAuthAuthenticationHandler>(authenticationScheme, displayName, configureOptions);
        }
    }
}
