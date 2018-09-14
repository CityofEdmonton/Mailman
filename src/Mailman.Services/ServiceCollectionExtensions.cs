using Google.Apis.Sheets.v4;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authentication.Google;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using System;

namespace Mailman.Services
{
    public static class ServiceCollectionExtensions
    {
        public static void AddMailmanServices(this IServiceCollection services, IConfiguration configuration)
        {
            services.AddAuthentication(options =>
            {
                options.DefaultScheme = CookieAuthenticationDefaults.AuthenticationScheme;
                options.DefaultChallengeScheme = GoogleDefaults.AuthenticationScheme;
                //options.DefaultScheme = GoogleDefaults.AuthenticationScheme;
                //options.DefaultSignInScheme = GoogleDefaults.AuthenticationScheme;
            })
                .AddCookie(configuration)
                .AddGoogle(configuration);

        }

        internal static AuthenticationBuilder AddCookie(this AuthenticationBuilder authenticationBuilder, IConfiguration configuration)
        {
            authenticationBuilder.AddCookie(options =>
            {
                // default can go here
            });

            return authenticationBuilder;
        }

        internal static AuthenticationBuilder AddGoogle(this AuthenticationBuilder authenticationBuilder, IConfiguration configuration)
        {
            // Environment variables take precendence
            string googleClientId = Environment.GetEnvironmentVariable("GOOGLE_CLIENT_ID");
            if (string.IsNullOrWhiteSpace(googleClientId))
                googleClientId = configuration["Authentication:Google:ClientId"];
            if (string.IsNullOrWhiteSpace(googleClientId))
                throw new InvalidOperationException("Google ClientId must be specified in a GOOGLE_CLIENT_ID environment variable or in a configuration file at Authentication:Google:ClientId");

                string googleClientSecret = Environment.GetEnvironmentVariable("GOOGLE_CLIENT_SECRET");
            if (string.IsNullOrWhiteSpace(googleClientSecret))
                googleClientSecret = configuration["Authentication:Google:ClientSecret"];
            if (string.IsNullOrWhiteSpace(googleClientSecret))
                throw new InvalidOperationException("Google ClientSecret must be specified in a GOOGLE_CLIENT_SECRET environment variable or in a configuration file at Authentication:Google:ClientSecret");

            authenticationBuilder.AddGoogle(options =>
            {
                options.ClientId = googleClientId;
                options.ClientSecret = googleClientSecret;
                options.Scope.Add(SheetsService.Scope.Spreadsheets);
                options.SignInScheme = CookieAuthenticationDefaults.AuthenticationScheme;
                options.CallbackPath = "/auth/signin-google";
                //var x = options.Events;
                //options.Events = new Microsoft.AspNetCore.Authentication.OAuth.OAuthEvents()
                //{

                //}
                //var oldEvents = options.Events;
                //options.Events = new Microsoft.AspNetCore.Authentication.OAuth.OAuthEvents()
                //{
                //    OnCreatingTicket = async context =>
                //    {
                //        await oldEvents.OnCreatingTicket(context);
                //    },
                //    OnTicketReceived = async context =>
                //    {
                //        await oldEvents.OnTicketReceived(context);
                //    },
                //    OnRedirectToAuthorizationEndpoint = oldEvents.OnRedirectToAuthorizationEndpoint,
                //    OnRemoteFailure = oldEvents.OnRemoteFailure

                //};

                options.Events.OnTicketReceived = async context =>
                    {
                        var x = context;
                    };

            });

            return authenticationBuilder;
        }
    }
}
