using Google.Apis.Sheets.v4;
using Mailman.Services.Security;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authentication.Google;
using Microsoft.AspNetCore.Hosting;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Serilog;
using System;

namespace Mailman.Services
{
    public static class ServiceCollectionExtensions
    {
        public static IServiceCollection ConfigureLogging(this IServiceCollection services, 
            IConfiguration configuration, 
            string module,
            Action<LoggerConfiguration> config = null)
        {
            services.AddSingleton<ILogger>(x =>
            {
                var loggerConfig = new LoggerConfiguration()
                    .Enrich.FromLogContext()
                    .Enrich.WithProperty("Application", "Mailman")
                    .Enrich.WithProperty("Module", module)
                    .ReadFrom.Configuration(configuration)
                    .WriteTo.Console();
                    

                // give a chance for the caller to further configure the Logger
                config?.Invoke(loggerConfig);

                return loggerConfig
                    .CreateLogger();
            });

            return services;
        }

        public static void AddMailmanServices(this IServiceCollection services, IConfiguration configuration)
        {
            services.AddAuthentication(options =>
            {
                options.DefaultScheme = CookieAuthenticationDefaults.AuthenticationScheme;
                options.DefaultChallengeScheme = GoogleDefaults.AuthenticationScheme;
            })
                .AddCookie(configuration)
                .AddGoogle(configuration);

            services.ConfureGoogleOAuthTokenService(configuration);
        }

        internal static AuthenticationBuilder AddCookie(this AuthenticationBuilder authenticationBuilder, IConfiguration configuration)
        {
            authenticationBuilder.AddCookie(); // use all defaults

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
                options.SaveTokens = true;
                options.AccessType = "offline";
            });

            return authenticationBuilder;
        }

        internal static void ConfureGoogleOAuthTokenService(this IServiceCollection services, IConfiguration configuration)
        {
            string redisUrl = Environment.GetEnvironmentVariable("GOOGLE_TOKEN_CACHE_URL");
            if (!string.IsNullOrWhiteSpace(redisUrl))
            {
                throw new NotSupportedException("The Redis OAuth token cache has not been implemented yet");
                //services.AddSingleton<IGoogleOAuthTokenService, RedisGoogleOAuthTokenService>();
            }
            else
            {
                string connectionString = Environment.GetEnvironmentVariable("GOOGLE_TOKEN_CACHE_DB_CONN");
                if (string.IsNullOrWhiteSpace(connectionString))
                    connectionString = configuration.GetConnectionString("GoogleTokenCache");
                if (string.IsNullOrWhiteSpace(connectionString))
                    connectionString = "Data Source=oauth.db";
                services.AddDbContextPool<OAuthTokenContext>(options => options.UseSqlite(connectionString));
                services.AddScoped<IGoogleOAuthTokenService, EntityFrameworkGoogleOAuthTokenService>();
            }

        }
    }
}
