using Microsoft.AspNetCore.Authentication;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using System;

namespace Mailman.Services
{
    public static class ServiceCollectionExtensions
    {
        public static void AddMailmanServices(this IServiceCollection serviceCollection)
        {

        }

        public static void AddGoogle(this AuthenticationBuilder authenticationBuilder, IConfiguration configuration)
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
            });

        }
    }
}
